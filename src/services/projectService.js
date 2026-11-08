import initialProjects from '../data/projects.json';

const STORAGE_KEY = 'ideax_projects_data';

// Helper to trigger JSON download in browser
export function downloadJsonFile(filename, data) {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

class ProjectService {
  constructor() {
    this.listeners = [];
  }

  // Subscribe to changes
  subscribe(fn) {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter(l => l !== fn);
    };
  }

  notify() {
    this.listeners.forEach(fn => fn());
  }

  getProjects() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Initialize with bundled JSON
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialProjects));
      return initialProjects;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return initialProjects;
    }
  }

  getPublishedProjects() {
    return this.getProjects().filter(p => p.published);
  }

  getFeaturedProjects() {
    return this.getProjects().filter(p => p.published && p.featured);
  }

  getProjectById(id) {
    return this.getProjects().find(p => p.id === id) || null;
  }

  generateNextId(existingProjects) {
    const ids = existingProjects
      .map(p => {
        const num = parseInt(p.id?.replace(/\D/g, '') || '0', 10);
        return isNaN(num) ? 0 : num;
      })
      .filter(n => n > 0);
    const max = ids.length ? Math.max(...ids) : 0;
    const nextNum = max + 1;
    return `PRJ${String(nextNum).padStart(3, '0')}`;
  }

  saveProjects(projects) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    this.notify();
  }

  validateProject(data, isEdit = false, currentId = null) {
    const errors = {};
    if (!data.title || !data.title.trim()) {
      errors.title = 'Project title is required.';
    }
    if (!data.description || !data.description.trim()) {
      errors.description = 'Short description is required.';
    }
    if (!data.category || !data.category.trim()) {
      errors.category = 'Category is required.';
    }
    if (!data.imageUrl || !data.imageUrl.trim()) {
      errors.imageUrl = 'Project image URL is required.';
    } else {
      try {
        new URL(data.imageUrl);
      } catch {
        errors.imageUrl = 'Please provide a valid image URL (e.g. https://...).';
      }
    }
    if (data.demoUrl && data.demoUrl.trim()) {
      try {
        new URL(data.demoUrl);
      } catch {
        errors.demoUrl = 'Demo URL must be a valid URL.';
      }
    }
    if (data.repositoryUrl && data.repositoryUrl.trim()) {
      try {
        new URL(data.repositoryUrl);
      } catch {
        errors.repositoryUrl = 'Repository URL must be a valid URL.';
      }
    }
    if (!data.technologies || (Array.isArray(data.technologies) && data.technologies.length === 0)) {
      errors.technologies = 'At least one technology is required.';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  createProject(projectData) {
    const current = this.getProjects();
    const validation = this.validateProject(projectData);
    if (!validation.isValid) {
      return { success: false, errors: validation.errors };
    }

    const newId = projectData.id?.trim() || this.generateNextId(current);
    if (current.some(p => p.id === newId)) {
      return { success: false, errors: { id: `Project ID ${newId} already exists.` } };
    }

    const techArray = Array.isArray(projectData.technologies)
      ? projectData.technologies
      : (typeof projectData.technologies === 'string'
          ? projectData.technologies.split(',').map(t => t.trim()).filter(Boolean)
          : []);

    const newProject = {
      id: newId,
      title: projectData.title.trim(),
      description: projectData.description.trim(),
      detailedDescription: (projectData.detailedDescription || '').trim(),
      imageUrl: projectData.imageUrl.trim(),
      category: projectData.category.trim(),
      technologies: techArray,
      demoUrl: (projectData.demoUrl || '').trim(),
      repositoryUrl: (projectData.repositoryUrl || '').trim(),
      featured: Boolean(projectData.featured),
      published: projectData.published !== undefined ? Boolean(projectData.published) : true,
    };

    const updated = [newProject, ...current];
    this.saveProjects(updated);
    return { success: true, project: newProject };
  }

  updateProject(id, projectData) {
    const current = this.getProjects();
    const index = current.findIndex(p => p.id === id);
    if (index === -1) {
      return { success: false, errors: { general: 'Project not found.' } };
    }

    const validation = this.validateProject(projectData, true, id);
    if (!validation.isValid) {
      return { success: false, errors: validation.errors };
    }

    const techArray = Array.isArray(projectData.technologies)
      ? projectData.technologies
      : (typeof projectData.technologies === 'string'
          ? projectData.technologies.split(',').map(t => t.trim()).filter(Boolean)
          : []);

    const updatedProject = {
      ...current[index],
      title: projectData.title.trim(),
      description: projectData.description.trim(),
      detailedDescription: (projectData.detailedDescription || '').trim(),
      imageUrl: projectData.imageUrl.trim(),
      category: projectData.category.trim(),
      technologies: techArray,
      demoUrl: (projectData.demoUrl || '').trim(),
      repositoryUrl: (projectData.repositoryUrl || '').trim(),
      featured: Boolean(projectData.featured),
      published: Boolean(projectData.published),
    };

    const updatedList = [...current];
    updatedList[index] = updatedProject;
    this.saveProjects(updatedList);
    return { success: true, project: updatedProject };
  }

  deleteProject(id) {
    const current = this.getProjects();
    const filtered = current.filter(p => p.id !== id);
    if (filtered.length === current.length) {
      return { success: false, message: 'Project not found.' };
    }
    this.saveProjects(filtered);
    return { success: true };
  }

  togglePublish(id) {
    const current = this.getProjects();
    const project = current.find(p => p.id === id);
    if (!project) return false;
    return this.updateProject(id, { ...project, published: !project.published });
  }

  toggleFeatured(id) {
    const current = this.getProjects();
    const project = current.find(p => p.id === id);
    if (!project) return false;
    return this.updateProject(id, { ...project, featured: !project.featured });
  }

  exportJSON() {
    const data = this.getProjects();
    downloadJsonFile('projects.json', data);
  }

  resetToDefault() {
    this.saveProjects(initialProjects);
  }
}

export const projectService = new ProjectService();
