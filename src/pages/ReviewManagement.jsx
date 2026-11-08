import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Star,
  Check,
  X,
  Eye,
  EyeOff,
  Download,
  RotateCcw,
  AlertTriangle,
  User,
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import { reviewService } from '../services/reviewService';
import { useToast } from '../components/Toast';

export default function ReviewManagement() {
  const [reviews, setReviews] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const { addToast } = useToast();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Form Fields
  const [formData, setFormData] = useState({
    id: '',
    customerName: '',
    feedback: '',
    projectName: '',
    rating: 5,
    imageUrl: '',
    reviewDate: new Date().toISOString().split('T')[0],
    published: false,
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    setReviews(reviewService.getReviews());
    const unsub = reviewService.subscribe(() => {
      setReviews(reviewService.getReviews());
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

  const handleOpenCreate = () => {
    setEditingReview(null);
    setFormData({
      id: '',
      customerName: '',
      feedback: '',
      projectName: '',
      rating: 5,
      imageUrl: '',
      reviewDate: new Date().toISOString().split('T')[0],
      published: true,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (review) => {
    setEditingReview(review);
    setFormData({
      id: review.id,
      customerName: review.customerName,
      feedback: review.feedback,
      projectName: review.projectName || '',
      rating: review.rating || 5,
      imageUrl: review.imageUrl || '',
      reviewDate: review.reviewDate || new Date().toISOString().split('T')[0],
      published: Boolean(review.published),
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingReview(null);
    setFormErrors({});
  };

  const handleSave = (e) => {
    e.preventDefault();
    setFormErrors({});

    if (editingReview) {
      const res = reviewService.updateReview(editingReview.id, formData);
      if (res.success) {
        addToast('Review updated successfully.', 'success');
        handleCloseModal();
      } else {
        setFormErrors(res.errors || {});
        addToast('Please correct form errors.', 'error');
      }
    } else {
      const res = reviewService.createReview(formData);
      if (res.success) {
        addToast(`Review ${res.review.id} added successfully!`, 'success');
        handleCloseModal();
      } else {
        setFormErrors(res.errors || {});
        addToast('Please correct form errors.', 'error');
      }
    }
  };

  const handleDelete = (id) => {
    const res = reviewService.deleteReview(id);
    if (res.success) {
      addToast('Review deleted.', 'info');
      setDeleteConfirmId(null);
    } else {
      addToast('Failed to delete review.', 'error');
    }
  };

  const handleTogglePublish = (id) => {
    reviewService.togglePublish(id);
    addToast('Review approval status updated.', 'info');
  };

  const handleExportJSON = () => {
    reviewService.exportJSON();
    addToast('Exported reviews.json', 'success');
  };

  const handleReset = () => {
    if (window.confirm('Reset all reviews back to original bundled JSON?')) {
      reviewService.resetToDefault();
      addToast('Reviews reset to defaults.', 'info');
    }
  };

  // Filter reviews
  const filtered = reviews.filter((r) => {
    const matchesSearch =
      r.customerName.toLowerCase().includes(search.toLowerCase()) ||
      r.feedback.toLowerCase().includes(search.toLowerCase()) ||
      (r.projectName && r.projectName.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus =
      filterStatus === 'All' ||
      (filterStatus === 'Approved' && r.published) ||
      (filterStatus === 'Pending' && !r.published);

    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout
      title="Customer Review Management"
      subtitle="Moderate, approve, and record authentic customer feedback."
      actions={
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportJSON}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#202020] text-xs font-semibold text-gray-200 hover:text-white border border-brand-border transition-colors"
            title="Download updated reviews.json"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export JSON</span>
          </button>

          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#202020] text-xs font-semibold text-gray-400 hover:text-rose-400 border border-brand-border transition-colors"
            title="Reset to default reviews"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-brand-yellow text-black hover:bg-brand-yellowHover shadow-glow-yellow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Review</span>
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#161616] border border-brand-border">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by customer name, project or review text..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#1e1e1e] border border-brand-border text-sm text-white focus:outline-none focus:border-brand-yellow"
            />
          </div>

          <div className="flex items-center gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[#1e1e1e] border border-brand-border text-xs text-white focus:outline-none focus:border-brand-yellow"
            >
              <option value="All">All Reviews ({reviews.length})</option>
              <option value="Approved">Approved ({reviews.filter((r) => r.published).length})</option>
              <option value="Pending">Pending ({reviews.filter((r) => !r.published).length})</option>
            </select>
          </div>
        </div>

        {/* Reviews Table */}
        <div className="bg-[#161616] border border-brand-border rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="bg-[#1c1c1c] text-xs uppercase text-brand-muted font-semibold border-b border-brand-border">
                <tr>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-4 py-4">Project</th>
                  <th className="px-4 py-4">Rating</th>
                  <th className="px-4 py-4">Date</th>
                  <th className="px-4 py-4 text-center">Approval</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/60">
                {filtered.map((review) => (
                  <tr key={review.id} className="hover:bg-white/[0.02] transition-colors">
                    {/* Customer Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        {review.imageUrl ? (
                          <img
                            src={review.imageUrl}
                            alt={review.customerName}
                            className="w-10 h-10 rounded-full object-cover bg-black border border-brand-border shrink-0 mt-0.5"
                            onError={(e) => (e.currentTarget.style.display = 'none')}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-[#242424] border border-brand-border flex items-center justify-center text-xs font-bold text-brand-yellow shrink-0 mt-0.5">
                            {review.customerName?.charAt(0) || 'U'}
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="font-bold text-white text-sm">
                            {review.customerName}
                          </div>
                          <div className="text-xs text-brand-yellow font-mono">{review.id}</div>
                          <p className="text-xs text-brand-muted line-clamp-2 mt-1 italic max-w-md">
                            "{review.feedback}"
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Associated Project */}
                    <td className="px-4 py-4 text-xs">
                      {review.projectName ? (
                        <span className="text-gray-300 font-medium">
                          {review.projectName}
                        </span>
                      ) : (
                        <span className="text-gray-500">—</span>
                      )}
                    </td>

                    {/* Rating */}
                    <td className="px-4 py-4 text-xs">
                      <div className="flex items-center gap-1 text-brand-yellow">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < (review.rating || 5)
                                ? 'text-brand-yellow fill-brand-yellow'
                                : 'text-gray-700 fill-gray-700'
                            }`}
                          />
                        ))}
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-4 text-xs text-brand-muted whitespace-nowrap">
                      {review.reviewDate}
                    </td>

                    {/* Approval Toggle */}
                    <td className="px-4 py-4 text-center">
                      <button
                        onClick={() => handleTogglePublish(review.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                          review.published
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        }`}
                        title={review.published ? 'Click to unapprove/hide' : 'Click to approve for public site'}
                      >
                        {review.published ? <Check className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        <span>{review.published ? 'Approved' : 'Pending'}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEdit(review)}
                          className="p-2 rounded-lg text-gray-400 hover:text-brand-yellow hover:bg-[#252525] transition-colors"
                          title="Edit Review"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(review.id)}
                          className="p-2 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-[#252525] transition-colors"
                          title="Delete Review"
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
                No reviews found. Click "Add Review" to record one.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* ADD / EDIT REVIEW MODAL                                  */}
      {/* ======================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-xl bg-[#141414] border border-brand-border rounded-3xl shadow-2xl overflow-hidden my-8">
            <div className="px-6 py-5 border-b border-brand-border flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">
                {editingReview ? `Edit Review (${editingReview.id})` : 'Add Customer Review'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-2 text-gray-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Customer / Display Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#1e1e1e] border border-brand-border text-white text-sm focus:outline-none focus:border-brand-yellow"
                />
                {formErrors.customerName && <p className="text-xs text-rose-400 mt-1">{formErrors.customerName}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Customer Feedback *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="The customer's genuine testimonial regarding ideaX's software delivery..."
                  value={formData.feedback}
                  onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#1e1e1e] border border-brand-border text-white text-sm focus:outline-none focus:border-brand-yellow resize-none"
                />
                {formErrors.feedback && <p className="text-xs text-rose-400 mt-1">{formErrors.feedback}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                    Associated Project Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. AI Business Intelligence"
                    value={formData.projectName}
                    onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1e1e1e] border border-brand-border text-white text-sm focus:outline-none focus:border-brand-yellow"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                    Rating (1 to 5 Stars)
                  </label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#1e1e1e] border border-brand-border text-white text-sm focus:outline-none focus:border-brand-yellow"
                  >
                    <option value={5}>★★★★★ (5 Stars)</option>
                    <option value={4}>★★★★☆ (4 Stars)</option>
                    <option value={3}>★★★☆☆ (3 Stars)</option>
                    <option value={2}>★★☆☆☆ (2 Stars)</option>
                    <option value={1}>★☆☆☆☆ (1 Star)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                    Customer Photo URL (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1e1e1e] border border-brand-border text-white text-sm focus:outline-none focus:border-brand-yellow"
                  />
                  {formErrors.imageUrl && <p className="text-xs text-rose-400 mt-1">{formErrors.imageUrl}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                    Review Date
                  </label>
                  <input
                    type="date"
                    value={formData.reviewDate}
                    onChange={(e) => setFormData({ ...formData, reviewDate: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1e1e1e] border border-brand-border text-white text-sm focus:outline-none focus:border-brand-yellow"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="w-4 h-4 rounded accent-brand-yellow"
                  />
                  <span className="text-xs font-semibold text-gray-300 select-none">
                    Approved for Public Website Display
                  </span>
                </label>
              </div>

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
                  {editingReview ? 'Save Changes' : 'Record Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-[#161616] border border-rose-500/30 rounded-3xl p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Delete Customer Review?</h3>
            <p className="text-xs text-brand-muted">
              Are you sure you want to remove review <code className="text-brand-yellow">{deleteConfirmId}</code>?
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
