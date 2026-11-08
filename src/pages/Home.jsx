import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  ExternalLink,
  Mail,
  Phone,
  MessageSquare,
  CheckCircle2,
  Code2,
  Globe,
  Smartphone,
  Monitor,
  Server,
  Cpu,
  Terminal,
  Database,
  Layers,
  Search,
  ChevronRight,
  Send,
  Zap,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProjectCard from '../components/ProjectCard';
import ProjectModal from '../components/ProjectModal';
import ReviewCard from '../components/ReviewCard';
import ProcessWorkflow from '../components/ProcessWorkflow';
import { projectService } from '../services/projectService';
import { reviewService } from '../services/reviewService';
import { settingsService } from '../services/settingsService';
import initialServices from '../data/services.json';

// Icon mapper for dynamic services
const serviceIconMap = {
  Globe: Globe,
  Smartphone: Smartphone,
  Monitor: Monitor,
  Server: Server,
  Cpu: Cpu,
  Code2: Code2,
};

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [settings, setSettings] = useState(settingsService.getSettings());
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Quick contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactProject, setContactProject] = useState('');

  useEffect(() => {
    // Load initial data
    setProjects(projectService.getPublishedProjects());
    setReviews(reviewService.getPublishedReviews());
    setSettings(settingsService.getSettings());

    // Subscribe to live changes
    const unsubProjects = projectService.subscribe(() => {
      setProjects(projectService.getPublishedProjects());
    });
    const unsubReviews = reviewService.subscribe(() => {
      setReviews(reviewService.getPublishedReviews());
    });
    const unsubSettings = settingsService.subscribe(() => {
      setSettings(settingsService.getSettings());
    });

    return () => {
      unsubProjects();
      unsubReviews();
      unsubSettings();
    };
  }, []);

  // Filter projects by category and search
  const categories = ['All', 'Web Development', 'AI/ML', 'Java Applications', 'Full Stack Applications', 'Developer Tools'];

  const filteredProjects = projects.filter((project) => {
    const matchesCategory =
      selectedCategory === 'All' || project.category === selectedCategory;
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.technologies || []).some((t) =>
        t.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  // Handle quick enquiry submit
  const handleQuickEnquiry = (e) => {
    e.preventDefault();
    const googleFormUrl = settings.enquiryForm || 'https://forms.gle/8RsBqNQtjr6ToifQ7';
    // Open Google Form
    window.open(googleFormUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text flex flex-col selection:bg-brand-yellow selection:text-black">
      <Navbar />

      <main className="flex-1">
        {/* ======================================================== */}
        {/* HERO SECTION                                             */}
        {/* ======================================================== */}
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
          {/* Ambient Glows */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-yellow/10 rounded-full blur-[130px] pointer-events-none" />
          <div className="absolute top-10 right-10 w-72 h-72 bg-brand-yellow/5 rounded-full blur-[90px] pointer-events-none" />

          {/* Grid pattern background */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(rgba(255, 212, 0, 0.25) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            {/* Pill Announcement */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-brand-yellow/30 text-xs sm:text-sm font-medium text-brand-yellow mb-8 shadow-glow-yellow-sm">
              <Sparkles className="w-4 h-4 fill-brand-yellow" />
              <span>Full-Cycle Custom Software Engineering</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.1] mb-6">
              Turning Ideas Into{' '}
              <span className="text-brand-yellow inline-block relative">
                Software
                <svg
                  className="absolute -bottom-2 left-0 w-full h-3 text-brand-yellow opacity-70"
                  viewBox="0 0 100 12"
                  preserveAspectRatio="none"
                  fill="none"
                >
                  <path
                    d="M0,8 Q50,0 100,8"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            {/* Subtitle / Intro */}
            <p className="text-lg sm:text-xl text-brand-muted max-w-3xl mx-auto leading-relaxed mb-10">
              {settings.about?.introduction ||
                'ideaX transforms ideas into practical software solutions through thoughtful planning, modern technologies and reliable development practices.'}
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-16">
              <a
                href={settings.enquiryForm || 'https://forms.gle/8RsBqNQtjr6ToifQ7'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl font-bold text-base bg-brand-yellow text-black hover:bg-brand-yellowHover shadow-glow-yellow transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <span>Start Your Project</span>
                <ArrowRight className="w-5 h-5" />
              </a>

              <a
                href="#projects"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-base bg-brand-card hover:bg-[#1f1f1f] text-white border border-brand-border hover:border-brand-yellow/50 transition-all duration-300"
              >
                <span>Explore Our Work</span>
              </a>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6 border-t border-brand-border/60">
              {(settings.about?.stats || [
                { label: 'Projects Completed', value: '3+' },
                { label: 'Client Satisfaction', value: '99%' },
                { label: 'Average Delivery', value: '3-6 Wks' },
                { label: 'Dedicated Support', value: '24/7' },
              ]).map((stat, i) => (
                <div key={i} className="p-4 rounded-xl bg-brand-card/50 border border-brand-border/50 text-center">
                  <div className="text-2xl sm:text-3xl font-black text-brand-yellow mb-1 font-mono">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-brand-muted font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* ABOUT US SECTION                                         */}
        {/* ======================================================== */}
        <section id="about" className="py-24 bg-[#0a0a0a] border-t border-brand-border relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Story & Mission */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-yellow/10 border border-brand-yellow/30 text-brand-yellow text-xs font-semibold uppercase tracking-wider">
                  <Zap className="w-3.5 h-3.5" />
                  About ideaX
                </div>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                  Crafting practical software that drives tangible business growth.
                </h2>

                <p className="text-brand-muted text-base sm:text-lg leading-relaxed">
                  {settings.about?.mission ||
                    'Empowering ambitious entrepreneurs, businesses, and creators by transforming raw concepts into robust, scalable, and intuitive software products.'}
                </p>

                <p className="text-brand-muted text-base leading-relaxed">
                  {settings.about?.approach ||
                    'We follow a disciplined engineering process combining rapid prototyping, clean architecture, automated testing, and transparent communication.'}
                </p>

                {/* Key Pillars */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-brand-card border border-brand-border">
                    <CheckCircle2 className="w-5 h-5 text-brand-yellow shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-white font-semibold text-sm">Clean & Scalable Code</h4>
                      <p className="text-xs text-brand-muted mt-1">Modular architecture designed for frictionless future expansion.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-xl bg-brand-card border border-brand-border">
                    <CheckCircle2 className="w-5 h-5 text-brand-yellow shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-white font-semibold text-sm">Transparent Milestones</h4>
                      <p className="text-xs text-brand-muted mt-1">Direct developer communication and weekly interactive demos.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-xl bg-brand-card border border-brand-border">
                    <CheckCircle2 className="w-5 h-5 text-brand-yellow shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-white font-semibold text-sm">On-Time Delivery</h4>
                      <p className="text-xs text-brand-muted mt-1">Rigorous sprint planning with zero unbudgeted scope creeps.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-xl bg-brand-card border border-brand-border">
                    <CheckCircle2 className="w-5 h-5 text-brand-yellow shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-white font-semibold text-sm">Post-Launch Support</h4>
                      <p className="text-xs text-brand-muted mt-1">Continuous monitoring, bug resolution, and cloud maintenance.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Tech Stack Card */}
              <div className="lg:col-span-5">
                <div className="p-8 rounded-3xl bg-brand-card border border-brand-border shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-36 h-36 bg-brand-yellow/10 blur-3xl pointer-events-none" />

                  <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-brand-yellow" />
                    <span>Technology Expertise</span>
                  </h3>
                  <p className="text-xs text-brand-muted mb-6">
                    Our core stack leverages modern, battle-tested technologies.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <span className="text-xs font-semibold text-brand-yellow uppercase tracking-wider block mb-2">
                        Frontend & UI
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {['React.js', 'Vite', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Redux', 'Vue.js'].map((t) => (
                          <span key={t} className="text-xs px-3 py-1 rounded-md bg-[#222] border border-[#333] text-gray-200">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-xs font-semibold text-brand-yellow uppercase tracking-wider block mb-2">
                        Backend & APIs
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {['Node.js', 'Express', 'Java Spring Boot', 'Python FastAPI', 'PostgreSQL', 'MongoDB', 'Redis'].map((t) => (
                          <span key={t} className="text-xs px-3 py-1 rounded-md bg-[#222] border border-[#333] text-gray-200">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-xs font-semibold text-brand-yellow uppercase tracking-wider block mb-2">
                        AI / ML & Desktop
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {['PyTorch', 'Gemini API', 'Pandas', 'OpenCV', 'JavaFX', 'Electron', 'Docker', 'AWS'].map((t) => (
                          <span key={t} className="text-xs px-3 py-1 rounded-md bg-[#222] border border-[#333] text-gray-200">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-brand-border/60 flex items-center justify-between">
                    <span className="text-xs text-brand-muted">Ready to discuss your stack?</span>
                    <a
                      href="#contact"
                      className="text-xs font-bold text-brand-yellow hover:underline flex items-center gap-1"
                    >
                      <span>Talk to us</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* SERVICES SECTION                                         */}
        {/* ======================================================== */}
        <section id="services" className="py-24 bg-brand-bg border-t border-brand-border relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-yellow/10 border border-brand-yellow/30 text-brand-yellow text-xs font-semibold uppercase tracking-wider mb-4">
                <Layers className="w-3.5 h-3.5" />
                What We Offer
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
                End-to-End Software Services
              </h2>
              <p className="text-brand-muted text-base sm:text-lg">
                From high-performing web platforms to intelligent AI workflows, we engineer reliable software tailored to your specific business requirements.
              </p>
            </div>

            {/* Service Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {initialServices.map((service) => {
                const IconComp = serviceIconMap[service.icon] || Code2;
                return (
                  <div
                    key={service.id}
                    className="flex flex-col justify-between p-8 rounded-3xl bg-brand-card border border-brand-border hover:border-brand-yellow/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-glow-yellow-sm group"
                  >
                    <div>
                      {/* Icon */}
                      <div className="w-14 h-14 rounded-2xl bg-[#202020] border border-brand-border group-hover:border-brand-yellow/50 flex items-center justify-center text-brand-yellow mb-6 shadow-inner transition-colors">
                        <IconComp className="w-7 h-7 group-hover:scale-110 transition-transform" />
                      </div>

                      {/* Title & Description */}
                      <h3 className="text-xl font-bold text-white group-hover:text-brand-yellow transition-colors mb-3">
                        {service.title}
                      </h3>
                      <p className="text-sm text-brand-muted leading-relaxed mb-6">
                        {service.description}
                      </p>

                      {/* Key features bullets */}
                      <ul className="space-y-2 mb-6">
                        {(service.features || []).map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-gray-300">
                            <span className="text-brand-yellow font-bold">•</span>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Tech Badges */}
                    <div className="pt-4 border-t border-brand-border/60">
                      <div className="flex flex-wrap gap-1.5">
                        {(service.technologies || []).map((t, i) => (
                          <span
                            key={i}
                            className="text-[11px] px-2.5 py-0.5 rounded bg-[#1e1e1e] text-gray-300 border border-[#2e2e2e]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* PROJECTS PORTFOLIO SECTION                               */}
        {/* ======================================================== */}
        <section id="projects" className="py-24 bg-[#0a0a0a] border-t border-brand-border relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-yellow/10 border border-brand-yellow/30 text-brand-yellow text-xs font-semibold uppercase tracking-wider mb-4">
                  <Code2 className="w-3.5 h-3.5" />
                  Our Portfolio
                </div>
                <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                  Featured Projects
                </h2>
                <p className="text-brand-muted text-sm sm:text-base mt-2 max-w-xl">
                  Explore practical systems we have built across Web, AI/ML, Full Stack, and Enterprise domains.
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search projects or tech..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-brand-card border border-brand-border text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-yellow transition-colors"
                />
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-brand-yellow text-black font-semibold shadow-glow-yellow-sm'
                      : 'bg-brand-card text-brand-muted hover:text-white border border-brand-border hover:border-brand-borderHover'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Projects Grid */}
            {filteredProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onSelect={(p) => setSelectedProject(p)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-brand-card rounded-2xl border border-brand-border">
                <p className="text-brand-muted text-base">
                  No projects found matching "{searchQuery}".
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchQuery('');
                  }}
                  className="mt-4 px-4 py-2 rounded-lg bg-brand-yellow text-black text-sm font-semibold hover:bg-brand-yellowHover"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ======================================================== */}
        {/* CUSTOMER REVIEWS SECTION                                 */}
        {/* ======================================================== */}
        <section id="reviews" className="py-24 bg-brand-bg border-t border-brand-border relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-yellow/10 border border-brand-yellow/30 text-brand-yellow text-xs font-semibold uppercase tracking-wider mb-4">
                <Sparkles className="w-3.5 h-3.5 fill-brand-yellow" />
                Customer Trust
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
                What Our Clients Say
              </h2>
              <p className="text-brand-muted text-base sm:text-lg">
                Authentic feedback from businesses and founders who entrusted their software initiatives to ideaX.
              </p>
            </div>

            {/* Reviews Grid */}
            {reviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reviews.map((rev) => (
                  <ReviewCard key={rev.id} review={rev} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-brand-muted">
                No customer reviews published yet.
              </div>
            )}
          </div>
        </section>

        {/* ======================================================== */}
        {/* DEVELOPMENT PROCESS SECTION                              */}
        {/* ======================================================== */}
        <section id="process" className="py-24 bg-[#0a0a0a] border-t border-brand-border relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-yellow/10 border border-brand-yellow/30 text-brand-yellow text-xs font-semibold uppercase tracking-wider mb-4">
                <Zap className="w-3.5 h-3.5" />
                Our Methodology
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
                The 7-Step Development Process
              </h2>
              <p className="text-brand-muted text-base sm:text-lg">
                A structured, transparent workflow ensuring predictable deadlines, premium craftsmanship, and zero surprises.
              </p>
            </div>

            <ProcessWorkflow />
          </div>
        </section>

        {/* ======================================================== */}
        {/* CONTACT & PROJECT ENQUIRY SECTION                        */}
        {/* ======================================================== */}
        <section id="contact" className="py-24 bg-brand-bg border-t border-brand-border relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Left Column: Direct Contact Info */}
              <div className="lg:col-span-5 space-y-8">
                <div>
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-yellow/10 border border-brand-yellow/30 text-brand-yellow text-xs font-semibold uppercase tracking-wider mb-4">
                    <MessageSquare className="w-3.5 h-3.5" />
                    Let's Connect
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
                    Ready to turn your idea into software?
                  </h2>
                  <p className="text-brand-muted text-sm sm:text-base leading-relaxed">
                    Have a new project or an existing application to modernize? Reach out via our official channels or submit an enquiry form. We typically respond within 24 hours.
                  </p>
                </div>

                {/* Contact Cards */}
                <div className="space-y-4">
                  {/* Email */}
                  <a
                    href={`mailto:${settings.email || 'team.ideax@gmail.com'}`}
                    className="flex items-center gap-4 p-5 rounded-2xl bg-brand-card border border-brand-border hover:border-brand-yellow/50 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#202020] border border-brand-border flex items-center justify-center text-brand-yellow group-hover:bg-brand-yellow group-hover:text-black transition-colors">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-brand-muted">Email Us Directly</div>
                      <div className="text-white font-semibold text-sm sm:text-base group-hover:text-brand-yellow transition-colors">
                        {settings.email || 'team.ideax@gmail.com'}
                      </div>
                    </div>
                  </a>

                  {/* Phone */}
                  <a
                    href={`tel:${settings.phoneRaw || '+919345746981'}`}
                    className="flex items-center gap-4 p-5 rounded-2xl bg-brand-card border border-brand-border hover:border-brand-yellow/50 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#202020] border border-brand-border flex items-center justify-center text-brand-yellow group-hover:bg-brand-yellow group-hover:text-black transition-colors">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-brand-muted">Phone Consultation</div>
                      <div className="text-white font-semibold text-sm sm:text-base group-hover:text-brand-yellow transition-colors">
                        {settings.phone || '+91 9345746981'}
                      </div>
                    </div>
                  </a>

                  {/* WhatsApp */}
                  <a
                    href={settings.whatsappUrl || 'https://wa.me/919345746981'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-5 rounded-2xl bg-brand-card border border-brand-border hover:border-emerald-500/50 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#202020] border border-brand-border flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-brand-muted">Instant WhatsApp Chat</div>
                      <div className="text-white font-semibold text-sm sm:text-base group-hover:text-emerald-400 transition-colors">
                        Chat on WhatsApp
                      </div>
                    </div>
                  </a>
                </div>
              </div>

              {/* Right Column: Project Enquiry Form Box */}
              <div className="lg:col-span-7">
                <div className="p-8 sm:p-10 rounded-3xl bg-brand-card border border-brand-border relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-brand-yellow/10 rounded-full blur-3xl pointer-events-none" />

                  <h3 className="text-2xl font-bold text-white mb-2">
                    Project Enquiry
                  </h3>
                  <p className="text-sm text-brand-muted mb-8">
                    Fill out our official Google Form or submit a quick enquiry below to get an architectural breakdown and proposal estimate.
                  </p>

                  <form onSubmit={handleQuickEnquiry} className="space-y-5">
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Alex Henderson"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-[#1c1c1c] border border-brand-border text-white text-sm focus:outline-none focus:border-brand-yellow transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. alex@company.com"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-[#1c1c1c] border border-brand-border text-white text-sm focus:outline-none focus:border-brand-yellow transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                        Project Overview or Requirement
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Briefly describe what you would like to build, timeline, and key requirements..."
                        value={contactProject}
                        onChange={(e) => setContactProject(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-[#1c1c1c] border border-brand-border text-white text-sm focus:outline-none focus:border-brand-yellow transition-colors resize-none"
                      />
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
                      <button
                        type="submit"
                        className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm bg-brand-yellow text-black hover:bg-brand-yellowHover shadow-glow-yellow transition-all"
                      >
                        <Send className="w-4 h-4" />
                        <span>Continue to Official Enquiry Form</span>
                        <ExternalLink className="w-4 h-4 ml-1" />
                      </button>
                    </div>

                    <p className="text-xs text-brand-muted/70 text-center pt-2">
                      Official Form: <a href={settings.enquiryForm || 'https://forms.gle/8RsBqNQtjr6ToifQ7'} target="_blank" rel="noopener noreferrer" className="text-brand-yellow hover:underline">{settings.enquiryForm || 'https://forms.gle/8RsBqNQtjr6ToifQ7'}</a>
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Detailed Project Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}

      <Footer />
    </div>
  );
}
