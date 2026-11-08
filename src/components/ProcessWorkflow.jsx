import React from 'react';
import {
  FileQuestion,
  ClipboardList,
  Compass,
  Code2,
  CheckCircle,
  Rocket,
  Headphones,
} from 'lucide-react';

const steps = [
  {
    step: '01',
    title: 'Project Enquiry',
    description: 'Submit your concept via our Google form, email, or direct WhatsApp call to initiate the conversation.',
    icon: FileQuestion,
  },
  {
    step: '02',
    title: 'Requirement Collection',
    description: 'We hold discovery sessions to gather user journeys, functional constraints, and technical goals.',
    icon: ClipboardList,
  },
  {
    step: '03',
    title: 'Planning & Proposal',
    description: 'We prepare architectural blueprints, technology stack recommendations, milestone timelines, and fixed quotes.',
    icon: Compass,
  },
  {
    step: '04',
    title: 'Agile Development',
    description: 'Clean coding following industry standards, weekly progress demonstrations, and continuous branch testing.',
    icon: Code2,
  },
  {
    step: '05',
    title: 'Testing & Validation',
    description: 'Rigorous automated unit testing, end-to-end integration checks, performance profiling, and security audits.',
    icon: CheckCircle,
  },
  {
    step: '06',
    title: 'Final Delivery',
    description: 'Production deployment to cloud infrastructure, domain mapping, asset delivery, and source code handover.',
    icon: Rocket,
  },
  {
    step: '07',
    title: 'Post-Delivery Support',
    description: 'Ongoing technical maintenance, monitoring, performance patches, and milestone feature scaling.',
    icon: Headphones,
  },
];

export default function ProcessWorkflow() {
  return (
    <div className="relative">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((item, index) => {
          const IconComponent = item.icon;
          const isLast = index === steps.length - 1;

          return (
            <div
              key={item.step}
              className={`relative flex flex-col p-6 rounded-2xl bg-brand-card border border-brand-border hover:border-brand-yellow/60 transition-all duration-300 group hover:-translate-y-1 ${
                isLast ? 'md:col-span-2 lg:col-span-1 bg-gradient-to-b from-brand-card to-[#1a1805]' : ''
              }`}
            >
              {/* Header: Step Number & Icon */}
              <div className="flex items-center justify-between mb-5">
                <span className="font-mono text-2xl font-black text-brand-yellow/30 group-hover:text-brand-yellow transition-colors">
                  {item.step}
                </span>
                <div className="w-12 h-12 rounded-xl bg-[#202020] border border-brand-border group-hover:border-brand-yellow/40 flex items-center justify-center text-brand-yellow shadow-inner">
                  <IconComponent className="w-6 h-6 group-hover:scale-110 transition-transform" />
                </div>
              </div>

              {/* Step Title & Description */}
              <h4 className="text-lg font-bold text-white mb-2 group-hover:text-brand-yellow transition-colors">
                {item.title}
              </h4>
              <p className="text-sm text-brand-muted leading-relaxed">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
