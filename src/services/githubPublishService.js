import { projectService } from './projectService';
import { reviewService } from './reviewService';
import { settingsService } from './settingsService';

const GITHUB_CONFIG_KEY = 'ideax_github_publish_config';

export const githubPublishService = {
  getConfig() {
    const raw = localStorage.getItem(GITHUB_CONFIG_KEY);
    if (!raw) {
      return {
        owner: '',
        repo: '',
        branch: 'main',
        token: '',
        configured: false,
      };
    }
    try {
      const parsed = JSON.parse(raw);
      return {
        ...parsed,
        configured: Boolean(parsed.owner && parsed.repo && parsed.token),
      };
    } catch {
      return { owner: '', repo: '', branch: 'main', token: '', configured: false };
    }
  },

  saveConfig(config) {
    localStorage.setItem(GITHUB_CONFIG_KEY, JSON.stringify(config));
  },

  async getFileSha(owner, repo, path, branch, token) {
    try {
      const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
        },
      });
      if (res.ok) {
        const data = await res.json();
        return data.sha;
      }
      return null;
    } catch {
      return null;
    }
  },

  async commitFile(owner, repo, path, branch, token, contentString, message) {
    const existingSha = await this.getFileSha(owner, repo, path, branch, token);
    const encoded = btoa(unescape(encodeURIComponent(contentString)));

    const body = {
      message,
      content: encoded,
      branch,
    };
    if (existingSha) {
      body.sha = existingSha;
    }

    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || `Failed to update ${path}`);
    }
    return await res.json();
  },

  async publishAllToGithub() {
    const config = this.getConfig();
    if (!config.configured) {
      return {
        success: false,
        message: 'GitHub publish credentials are not configured. Please configure them in Settings or download the JSON files manually.',
      };
    }

    try {
      const projectsData = JSON.stringify(projectService.getProjects(), null, 2);
      const reviewsData = JSON.stringify(reviewService.getReviews(), null, 2);
      const settingsData = JSON.stringify(settingsService.getSettings(), null, 2);

      const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

      await this.commitFile(
        config.owner,
        config.repo,
        'src/data/projects.json',
        config.branch || 'main',
        config.token,
        projectsData,
        `admin(content): update projects.json [${timestamp}]`
      );

      await this.commitFile(
        config.owner,
        config.repo,
        'src/data/reviews.json',
        config.branch || 'main',
        config.token,
        reviewsData,
        `admin(content): update reviews.json [${timestamp}]`
      );

      await this.commitFile(
        config.owner,
        config.repo,
        'src/data/settings.json',
        config.branch || 'main',
        config.token,
        settingsData,
        `admin(content): update settings.json [${timestamp}]`
      );

      return {
        success: true,
        message: 'Successfully published changes to GitHub repository! GitHub Actions will now trigger and deploy the live website.',
      };
    } catch (err) {
      return {
        success: false,
        message: `Failed to commit to GitHub: ${err.message}`,
      };
    }
  },
};
