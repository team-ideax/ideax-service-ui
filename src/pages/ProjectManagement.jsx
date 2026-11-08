import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  Github,
  Sparkles,
  Check,
  X,
  Eye,
  EyeOff,
  Download,
  RotateCcw,
  AlertTriangle,
  UploadCloud,
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import { projectService } from '../services/projectService';
import { useToast } from '../components/Toast';

export default function ProjectManagement() {
  const [projects, setProjects] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const { addToast } = useToast();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Form Fields
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    description: '',
    detailedDescription: '',
    imageUrl: '',
    category: 'Web Development',
    technologies: '',
    demoUrl: '',
    repositoryUrl: '',
    featured: false,
    published: true,
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    setProjects(projectService.getProjects());
    const unsub = projectService.subscribe(() => {
      setProjects(projectService.getProjects());
    });
    return unsub;
  }, []);

  // Check query params for quick action: ?action=new
  useEffect(() => {
    if (searchParams.get('action') === 'new') {
      handleOpenCreate();
      setSearchParams({});
    }
  }, [searchParams]);

  const categories = [
    'Web Development',
    'AI/ML',
    'Java Applications',
    'Full Stack Applications',
    'Developer Tools',
    'Mobile Apps',
  ];

  const handleOpenCreate = () => {
    setEditingProject(null);
    setFormData({
      id: '',
      title: '',
      description: '',
      detailedDescription: '',
      imageUrl: '',
      category: 'Web Development',
      technologies: '',
      demoUrl: '',
      repositoryUrl: '',
      featured: false,
      published: true,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (project) => {
    setEditingProject(project);
    setFormData({
      id: project.id,
      title: project.title,
      description: project.description,
      detailedDescription: project.detailedDescription || '',
      imageUrl: project.imageUrl || '',
      category: project.category,
      technologies: Array.isArray(project.technologies)
        ? project.technologies.join(', ')
        : project.technologies || '',
      demoUrl: project.demoUrl || '',
      repositoryUrl: project.repositoryUrl || '',
      featured: Boolean(project.featured),
      published: Boolean(project.published),
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    setFormErrors({});
  };

  const handleSave = (e) => {
    e.preventDefault();
    setFormErrors({});

    const techArray = formData.technologies
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      ...formData,
      technologies: techArray,
    };

    if (editingProject) {
      const res = projectService.updateProject(editingProject.id, payload);
      if (res.success) {
        addToast('Project updated successfully.', 'success');
        handleCloseModal();
      } else {
        setFormErrors(res.errors || {});
        addToast('Please correct form errors.', 'error');
      }
    } else {
      const res = projectService.createProject(payload);
      if (res.success) {
        addToast(`Project ${res.project.id} created successfully!`, 'success');
        handleCloseModal();
      } else {
        setFormErrors(res.errors || {});
        addToast('Please correct form errors.', 'error');
      }
    }
  };

  const handleDelete = (id) => {
    const res = projectService.deleteProject(id);
    if (res.success) {
      addToast('Project deleted.', 'info');
      setDeleteConfirmId(null);
    } else {
      addToast('Failed to delete project.', 'error');
    }
  };

  const handleTogglePublish = (id) => {
    projectService.togglePublish(id);
    addToast('Project visibility toggled.', 'info');
  };

  const handleToggleFeatured = (id) => {
    projectService.toggleFeatured(id);
    addToast('Featured status updated.', 'info');
  };

  const handleExportJSON = () => {
    projectService.exportJSON();
    addToast('Exported projects.json', 'success');
  };

  const handleReset = () => {
    if (window.confirm('Reset all projects back to the original bundled JSON? Any local modifications will be overwritten.')) {
      projectService.resetToDefault();
      addToast('Projects reset to default data.', 'info');
    }
  };

  // Filter projects
  const filtered = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      (p.technologies || []).some((t) => t.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory = filterCategory === 'All' || p.category === filterCategory;
    const matchesStatus =
      filterStatus === 'All' ||
      (filterStatus === 'Published' && p.published) ||
      (filterStatus === 'Draft' && !p.published) ||
      (filterStatus === 'Featured' && p.featured);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <AdminLayout
      title="Project Management"
      subtitle="Create, update, and manage portfolio project showcases."
      actions={
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportJSON}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#202020] text-xs font-semibold text-gray-200 hover:text-white border border-brand-border transition-colors"
            title="Download updated projects.json"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export JSON</span>
          </button>

          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#202020] text-xs font-semibold text-gray-400 hover:text-rose-400 border border-brand-border transition-colors"
            title="Reset to default JSON"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-brand-yellow text-black hover:bg-brand-yellowHover shadow-glow-yellow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Project</span>
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Filters and Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#161616] border border-brand-border">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, description or technology..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#1e1e1e] border border-brand-border text-sm text-white focus:outline-none focus:border-brand-yellow"
            />
          </div>

          <div className="flex items-center gap-3">
            {/* Category Filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[#1e1e1e] border border-brand-border text-xs text-white focus:outline-none focus:border-brand-yellow"
            >
              <option value="All">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[#1e1e1e] border border-brand-border text-xs text-white focus:outline-none focus:border-brand-yellow"
            >
              <option value="All">All Status</option>
              <option value="Published">Published</option>
              <option value="Draft">Drafts</option>
              <option value="Featured">Featured</option>
            </select>
          </div>
        </div>

        {/* Project Table */}
        <div className="bg-[#161616] border border-brand-border rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="bg-[#1c1c1c] text-xs uppercase text-brand-muted font-semibold border-b border-brand-border">
                <tr>
                  <th className="px-6 py-4">Project</th>
                  <th className="px-4 py-4">Category</th>
                  <th className="px-4 py-4">Technologies</th>
                  <th className="px-4 py-4 text-center">Featured</th>
                  <th className="px-4 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/60">
                {filtered.map((project) => (
                  <tr key={project.id} className="hover:bg-white/[0.02] transition-colors">
                    {/* Project Title & Image */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={project.imageUrl}
                          alt={project.title}
                          className="w-12 h-12 rounded-xl object-cover bg-black border border-brand-border shrink-0"
                          onError={(e) => {
                            e.currentTarget.src =
                              'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=200&auto=format&fit=crop';
                          }}
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-white text-sm line-clamp-1">
                            {project.title}
                          </div>
                          <div className="text-xs text-brand-yellow font-mono">{project.id}</div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-4 text-xs">
                      <span className="px-2.5 py-1 rounded-md bg-[#222] border border-[#333] text-gray-300">
                        {project.category}
                      </span>
                    </td>

                    {/* Technologies */}
                    <td className="px-4 py-4 text-xs">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {(project.technologies || []).slice(0, 3).map((t, i) => (
                          <span
                            key={i}
                            className="text-[11px] px-2 py-0.5 rounded bg-[#1f1f1f] border border-[#2e2e2e] text-gray-300"
                          >
                            {t}
                          </span>
                        ))}
                        {(project.technologies || []).length > 3 && (
                          <span className="text-[10px] text-brand-yellow font-bold">
                            +{project.technologies.length - 3}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Featured Toggle */}
                    <td className="px-4 py-4 text-center">
                      <button
                        onClick={() => handleToggleFeatured(project.id)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          project.featured
                            ? 'bg-brand-yellow/10 border-brand-yellow text-brand-yellow'
                            : 'bg-[#222] border-[#333] text-gray-500 hover:text-white'
                        }`}
                        title={project.featured ? 'Remove Featured' : 'Mark as Featured'}
                      >
                        <Sparkles className="w-4 h-4 fill-current" />
                      </button>
                    </td>

                    {/* Published Toggle */}
                    <td className="px-4 py-4 text-center">
                      <button
                        onClick={() => handleTogglePublish(project.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-colors ${
                          project.published
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        }`}
                      >
                        {project.published ? <Check className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        <span>{project.published ? 'Published' : 'Draft'}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEdit(project)}
                          className="p-2 rounded-lg text-gray-400 hover:text-brand-yellow hover:bg-[#252525] transition-colors"
                          title="Edit Project"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(project.id)}
                          className="p-2 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-[#252525] transition-colors"
                          title="Delete Project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div className="p-8 text-center text-brand-muted text-sm">
                No projects found. Click "Add Project" to create one.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* ADD / EDIT PROJECT MODAL                                 */}
      {/* ======================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-[#141414] border border-brand-border rounded-3xl shadow-2xl overflow-hidden my-8">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-brand-border flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">
                {editingProject ? `Edit Project (${editingProject.id})` : 'Add New Project'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-2 text-gray-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Project Title */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI Business Intelligence"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#1e1e1e] border border-brand-border text-white text-sm focus:outline-none focus:border-brand-yellow"
                />
                {formErrors.title && <p className="text-xs text-rose-400 mt-1">{formErrors.title}</p>}
              </div>

              {/* Category & Featured & Published */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#1e1e1e] border border-brand-border text-white text-sm focus:outline-none focus:border-brand-yellow"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="featuredCheckbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 rounded accent-brand-yellow"
                  />
                  <label htmlFor="featuredCheckbox" className="text-xs font-semibold text-gray-300 select-none">
                    Featured Project
                  </label>
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="publishedCheckbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="w-4 h-4 rounded accent-brand-yellow"
                  />
                  <label htmlFor="publishedCheckbox" className="text-xs font-semibold text-gray-300 select-none">
                    Published (Public)
                  </label>
                </div>
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Short Description * (appears on card)
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Summary of what the project does..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#1e1e1e] border border-brand-border text-white text-sm focus:outline-none focus:border-brand-yellow resize-none"
                />
                {formErrors.description && <p className="text-xs text-rose-400 mt-1">{formErrors.description}</p>}
              </div>

              {/* Detailed Description */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Detailed Description (appears in modal)
                </label>
                <textarea
                  rows={3}
                  placeholder="Comprehensive technical breakdown, problem solved, impact..."
                  value={formData.detailedDescription}
                  onChange={(e) => setFormData({ ...formData, detailedDescription: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#1e1e1e] border border-brand-border text-white text-sm focus:outline-none focus:border-brand-yellow resize-none"
                />
              </div>

              {/* Image URL & Preview */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Project Image URL *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#1e1e1e] border border-brand-border text-white text-sm focus:outline-none focus:border-brand-yellow"
                />
                {formErrors.imageUrl && <p className="text-xs text-rose-400 mt-1">{formErrors.imageUrl}</p>}

                {formData.imageUrl && (
                  <div className="mt-2 flex items-center gap-3 p-2 rounded-xl bg-[#1e1e1e] border border-brand-border">
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="w-16 h-10 rounded-lg object-cover bg-black"
                      onError={(e) => (e.currentTarget.style.display = 'none')}
                    />
                    <span className="text-xs text-brand-muted">Image preview</span>
                  </div>
                )}
              </div>

              {/* Technologies (comma separated) */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Technologies * (comma separated)
                </label>
                <input
                  type="text"
                  required
                  placeholder="React, TypeScript, Tailwind CSS, Python"
                  value={formData.technologies}
                  onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#1e1e1e] border border-brand-border text-white text-sm focus:outline-none focus:border-brand-yellow"
                />
                {formErrors.technologies && <p className="text-xs text-rose-400 mt-1">{formErrors.technologies}</p>}
              </div>

              {/* Demo URL & Repository URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                    Demo URL (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://demo.example.com"
                    value={formData.demoUrl}
                    onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1e1e1e] border border-brand-border text-white text-sm focus:outline-none focus:border-brand-yellow"
                  />
                  {formErrors.demoUrl && <p className="text-xs text-rose-400 mt-1">{formErrors.demoUrl}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                    Repository URL (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={formData.repositoryUrl}
                    onChange={(e) => setFormData({ ...formData, repositoryUrl: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1e1e1e] border border-brand-border text-white text-sm focus:outline-none focus:border-brand-yellow"
                  />
                  {formErrors.repositoryUrl && <p className="text-xs text-rose-400 mt-1">{formErrors.repositoryUrl}</p>}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-brand-border flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-brand-muted hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-brand-yellow text-black hover:bg-brand-yellowHover shadow-glow-yellow-sm"
                >
                  {editingProject ? 'Save Changes' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-[#161616] border border-rose-500/30 rounded-3xl p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Delete Project?</h3>
            <p className="text-xs text-brand-muted">
              Are you sure you want to delete project <code className="text-brand-yellow">{deleteConfirmId}</code>? This action cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-brand-muted hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-rose-500 text-white hover:bg-rose-600 transition-colors"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
