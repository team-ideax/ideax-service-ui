import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderGit2,
  MessageSquareQuote,
  Settings,
  PlusCircle,
  CheckCircle2,
  Clock,
  ExternalLink,
  Sparkles,
  Download,
  UploadCloud,
  Layers,
  ArrowRight,
  Eye,
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import { projectService } from '../services/projectService';
import { reviewService } from '../services/reviewService';
import { settingsService } from '../services/settingsService';
import { useToast } from '../components/Toast';

export default function AdminDashboard() {
  const [projects, setProjects] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [settings, setSettings] = useState(settingsService.getSettings());
  const { addToast } = useToast();

  useEffect(() => {
    setProjects(projectService.getProjects());
    setReviews(reviewService.getReviews());
    setSettings(settingsService.getSettings());

    const unsubP = projectService.subscribe(() => setProjects(projectService.getProjects()));
    const unsubR = reviewService.subscribe(() => setReviews(reviewService.getReviews()));
    const unsubS = settingsService.subscribe(() => setSettings(settingsService.getSettings()));

    return () => {
      unsubP();
      unsubR();
      unsubS();
    };
  }, []);

  // Compute stats
  const totalProjects = projects.length;
  const publishedProjects = projects.filter((p) => p.published).length;
  const draftProjects = totalProjects - publishedProjects;

  const totalReviews = reviews.length;
  const publishedReviews = reviews.filter((r) => r.published).length;
  const pendingReviews = totalReviews - publishedReviews;

  const handleExportAll = () => {
    projectService.exportJSON();
    reviewService.exportJSON();
    settingsService.exportJSON();
    addToast('Downloaded projects.json, reviews.json, and settings.json', 'success');
  };

  return (
    <AdminLayout
      title="Dashboard Overview"
      subtitle="Welcome back, Administrator. Manage your portfolio content and settings."
      actions={
        <button
          onClick={handleExportAll}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#222222] text-xs font-semibold text-gray-200 hover:text-white hover:bg-[#2c2c2c] border border-brand-border transition-colors"
          title="Download current JSON data"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export JSON Files</span>
        </button>
      }
    >
      <div className="space-y-8">
        {/* ======================================================== */}
        {/* STATS METRIC WIDGETS                                     */}
        {/* ======================================================== */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* Total Projects */}
          <div className="p-5 rounded-2xl bg-[#161616] border border-brand-border">
            <span className="text-xs text-brand-muted font-medium block mb-1">Total Projects</span>
            <div className="text-3xl font-extrabold text-white font-mono">{totalProjects}</div>
            <span className="text-[11px] text-gray-500 mt-1 block">In repository</span>
          </div>

          {/* Published Projects */}
          <div className="p-5 rounded-2xl bg-[#161616] border border-brand-border">
            <span className="text-xs text-brand-muted font-medium block mb-1">Published Projects</span>
            <div className="text-3xl font-extrabold text-emerald-400 font-mono">{publishedProjects}</div>
            <span className="text-[11px] text-emerald-500/80 mt-1 block">Live on website</span>
          </div>

          {/* Draft Projects */}
          <div className="p-5 rounded-2xl bg-[#161616] border border-brand-border">
            <span className="text-xs text-brand-muted font-medium block mb-1">Draft Projects</span>
            <div className="text-3xl font-extrabold text-amber-400 font-mono">{draftProjects}</div>
            <span className="text-[11px] text-amber-500/80 mt-1 block">Hidden from public</span>
          </div>

          {/* Total Reviews */}
          <div className="p-5 rounded-2xl bg-[#161616] border border-brand-border">
            <span className="text-xs text-brand-muted font-medium block mb-1">Total Reviews</span>
            <div className="text-3xl font-extrabold text-white font-mono">{totalReviews}</div>
            <span className="text-[11px] text-gray-500 mt-1 block">Customer entries</span>
          </div>

          {/* Published Reviews */}
          <div className="p-5 rounded-2xl bg-[#161616] border border-brand-border">
            <span className="text-xs text-brand-muted font-medium block mb-1">Approved Reviews</span>
            <div className="text-3xl font-extrabold text-emerald-400 font-mono">{publishedReviews}</div>
            <span className="text-[11px] text-emerald-500/80 mt-1 block">Visible to visitors</span>
          </div>

          {/* Pending Reviews */}
          <div className="p-5 rounded-2xl bg-[#161616] border border-brand-border">
            <span className="text-xs text-brand-muted font-medium block mb-1">Pending Approval</span>
            <div className="text-3xl font-extrabold text-amber-400 font-mono">{pendingReviews}</div>
            <span className="text-[11px] text-amber-500/80 mt-1 block">Awaiting review</span>
          </div>
        </div>

        {/* ======================================================== */}
        {/* QUICK ACTIONS                                            */}
        {/* ======================================================== */}
        <div>
          <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/admin/projects?action=new"
              className="flex items-center gap-4 p-5 rounded-2xl bg-[#161616] border border-brand-border hover:border-brand-yellow/60 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-yellow/10 border border-brand-yellow/30 flex items-center justify-center text-brand-yellow group-hover:scale-105 transition-transform">
                <PlusCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-brand-yellow transition-colors">
                  Add New Project
                </h4>
                <p className="text-xs text-brand-muted">Publish a new portfolio item</p>
              </div>
            </Link>

            <Link
              to="/admin/projects"
              className="flex items-center gap-4 p-5 rounded-2xl bg-[#161616] border border-brand-border hover:border-brand-yellow/60 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
                <FolderGit2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-brand-yellow transition-colors">
                  Manage Projects
                </h4>
                <p className="text-xs text-brand-muted">Edit, categorize, or reorder</p>
              </div>
            </Link>

            <Link
              to="/admin/reviews?action=new"
              className="flex items-center gap-4 p-5 rounded-2xl bg-[#161616] border border-brand-border hover:border-brand-yellow/60 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
                <MessageSquareQuote className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-brand-yellow transition-colors">
                  Add Customer Review
                </h4>
                <p className="text-xs text-brand-muted">Record client testimonials</p>
              </div>
            </Link>

            <Link
              to="/admin/settings"
              className="flex items-center gap-4 p-5 rounded-2xl bg-[#161616] border border-brand-border hover:border-brand-yellow/60 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                <Settings className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-brand-yellow transition-colors">
                  Website Settings
                </h4>
                <p className="text-xs text-brand-muted">Update contacts & branding</p>
              </div>
            </Link>
          </div>
        </div>

        {/* ======================================================== */}
        {/* RECENT PROJECTS & REVIEWS PREVIEWS                       */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Projects Preview */}
          <div className="p-6 rounded-3xl bg-[#161616] border border-brand-border space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Recent Projects</h3>
                <p className="text-xs text-brand-muted">Latest additions to the portfolio</p>
              </div>
              <Link
                to="/admin/projects"
                className="text-xs font-semibold text-brand-yellow hover:underline flex items-center gap-1"
              >
                <span>View all ({totalProjects})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {projects.slice(0, 4).map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-[#1f1f1f] border border-brand-border/60 hover:border-brand-border transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={p.imageUrl}
                      alt={p.title}
                      className="w-10 h-10 rounded-lg object-cover bg-black shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-white truncate">{p.title}</div>
                      <div className="text-xs text-brand-muted flex items-center gap-2">
                        <span>{p.category}</span>
                        {p.featured && (
                          <span className="text-[10px] text-brand-yellow font-medium">★ Featured</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      p.published
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {p.published ? 'Published' : 'Draft'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews Preview */}
          <div className="p-6 rounded-3xl bg-[#161616] border border-brand-border space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Customer Reviews</h3>
                <p className="text-xs text-brand-muted">Latest customer feedback entries</p>
              </div>
              <Link
                to="/admin/reviews"
                className="text-xs font-semibold text-brand-yellow hover:underline flex items-center gap-1"
              >
                <span>View all ({totalReviews})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {reviews.slice(0, 4).map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-[#1f1f1f] border border-brand-border/60 hover:border-brand-border transition-colors"
                >
                  <div className="min-w-0 flex-1 pr-4">
                    <div className="text-sm font-semibold text-white truncate">
                      {r.customerName}
                    </div>
                    <div className="text-xs text-brand-muted line-clamp-1 italic">
                      "{r.feedback}"
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                      r.published
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {r.published ? 'Approved' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
