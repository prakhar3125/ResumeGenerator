//LandingPage.js
import React from 'react';
import { FileText, Zap, Download, Star, ArrowRight, Check, Globe, Users, Award } from 'lucide-react';
// import { DarkModeToggle, useDarkMode } from './your-existing-components'; // Import from your existing code
import { useNavigate } from 'react-router-dom';
// const DarkModeContext = createContext();
import { DarkModeProvider, DarkModeToggle } from './Resume'; // Import DarkModeProvider from Resume.js





const LandingPage = () => {
  const navigate = useNavigate();
  const handleGetStarted = () => {
    navigate('/builder');
  };
  const features = [
    {
      icon: <Zap size={24} />,
      title: "Lightning Fast",
      description: "Generate professional resumes in seconds with our optimized LaTeX compilation engine."
    },
    {
      icon: <FileText size={24} />,
      title: "Professional Templates",
      description: "Clean, ATS-friendly templates designed by hiring experts to make you stand out."
    },
    {
      icon: <Download size={24} />,
      title: "Instant Download",
      description: "Get your resume as a high-quality PDF ready for immediate use and sharing."
    },
    {
      icon: <Globe size={24} />,
      title: "Customizable Sections",
      description: "Drag and drop to reorder sections and tailor your resume for any position."
    }
  ];

  const benefits = [
    "ATS-optimized formatting",
    "Real-time preview",
    "Professional LaTeX styling", 
    "Dark/Light mode support",
    "Responsive design",
    "No watermarks"
  ];



  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      {/* Header */}
      <header className="surface border-b" style={{ borderColor: 'var(--color-border)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <FileText size={32} style={{ color: 'var(--color-primary)' }} />
              <h1 className="text-2xl font-bold" style={{ color: 'var(--color-foreground)' }}>
                ResumeForge
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <nav className="hidden md:flex items-center gap-6">
                <a href="#features" className="hover:text-opacity-80 transition-colors" style={{ color: 'var(--color-foreground-secondary)' }}>
                  Features
                </a>
                <a href="#how-it-works" className="hover:text-opacity-80 transition-colors" style={{ color: 'var(--color-foreground-secondary)' }}>
                  How it Works
                </a>
                {/* <a href="#pricing" className="hover:text-opacity-80 transition-colors" style={{ color: 'var(--color-foreground-secondary)' }}>
                  Pricing
                </a> */}
              </nav>
              <DarkModeToggle />
              <button 
                onClick={handleGetStarted}
                className="btn-primary flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
              >
                Get Started
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </header>

{/* Hero Section */}
<section className="py-20">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-5xl md:text-6xl font-bold mb-6" style={{ color: 'var(--color-foreground)' }}>
        Create Professional Resumes with
        <span className="block mt-2" style={{ color: 'var(--color-primary)' }}>
          LaTeX Precision
        </span>
      </h1>
      <p className="text-xl mb-8 leading-relaxed" style={{ color: 'var(--color-foreground-secondary)' }}>
        Generate stunning, ATS-friendly resumes in seconds. Our LaTeX-powered engine ensures
        perfect formatting every time, giving you the edge in today's competitive job market.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
        <button
          onClick={handleGetStarted}
          className="btn-primary flex items-center gap-3 px-8 py-4 rounded-lg text-lg font-semibold"
        >
          Start Building Now
          {/* Assuming you have an ArrowRight icon component */}
          {/* <ArrowRight size={20} /> */}
        </button>
        <a
          href="https://drive.google.com/file/d/1ERzlMRsTVwUMo-eImW4tEuUKreWV1y7i/view?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
        >
          <button className="surface hover:surface-secondary border border-border flex items-center gap-3 px-8 py-4 rounded-lg text-lg font-semibold transition-colors">
            {/* Assuming you have a FileText icon component */}
            {/* <FileText size={20} /> */}
            View Sample
          </button>
        </a>
      </div>
      <div className="mb-12">
  <div className="max-w-2xl mx-auto">
    <h3 className="text-center text-lg font-semibold mb-6" style={{ color: 'var(--color-foreground-secondary)' }}>
      See What You Can Create
    </h3>
    <div className="relative group">
      <img
        src="img.jpg"
        alt="Professional resume sample created with ResumeForge"
        className="w-full rounded-lg shadow-2xl border border-opacity-20 hover:shadow-3xl transition-shadow duration-300"
        style={{ borderColor: 'var(--color-border)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black-20 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  </div>
</div>
      <div className="flex items-center justify-center gap-6 text-sm mb-12" style={{ color: 'var(--color-foreground-secondary)' }}>
        <div className="flex items-center gap-2">
          {/* Assuming you have a Check icon component */}
          {/* <Check size={16} style={{ color: 'var(--color-primary)' }} /> */}
          <span>Free to use</span>
        </div>
        <div className="flex items-center gap-2">
          {/* <Check size={16} style={{ color: 'var(--color-primary)' }} /> */}
          <span>No signup required</span>
        </div>
        <div className="flex items-center gap-2">
          {/* <Check size={16} style={{ color: 'var(--color-primary)' }} /> */}
          <span>Instant download</span>
        </div>
      </div>

      {/* MODIFIED: Added Project By Section (Larger) */}
      <div className="text-center mt-4">
        {/* Increased text size from sm to lg and bottom margin from 2 to 4 */}
        <p className="text-lg mb-4" style={{ color: 'var(--color-foreground-secondary)' }}>
          A Project By{' '}
          <a
            href="https://www.linkedin.com/in/prakhar3125/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold"
            style={{ color: 'var(--color-primary)' }}
          >
            Prakhar Sinha
          </a>
        </p>
        <div className="flex justify-center items-center gap-6"> {/* Increased gap for larger icons */}
          <a
            href="https://www.linkedin.com/in/prakhar3125/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn Profile"
            className="hover:opacity-75 transition-opacity"
          >
            {/* MODIFIED: Increased icon size from 24x24 to 32x32 */}
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
          </a>
          <a
            href="https://github.com/prakhar3125/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Profile"
            className="hover:opacity-75 transition-opacity"
          >
            {/* MODIFIED: Increased icon size from 24x24 to 32x32 */}
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          </a>
        </div>
      </div>

    </div>
  </div>
</section>

      {/* Features Section */}
      <section id="features" className="py-20" style={{ backgroundColor: 'var(--color-surface-secondary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--color-foreground)' }}>
              Powerful Features for Perfect Resumes
            </h2>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--color-foreground-secondary)' }}>
              Everything you need to create, customize, and download professional resumes that get noticed.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="surface rounded-lg p-6 text-center hover:surface-secondary transition-colors">
                <div className="flex justify-center mb-4" style={{ color: 'var(--color-primary)' }}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--color-foreground)' }}>
                  {feature.title}
                </h3>
                <p style={{ color: 'var(--color-foreground-secondary)' }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--color-foreground)' }}>
              How It Works
            </h2>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--color-foreground-secondary)' }}>
              Create your professional resume in three simple steps.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Fill Your Information",
                description: "Enter your personal details, education, experience, and skills through our intuitive form interface."
              },
              {
                step: "02", 
                title: "Customize & Preview",
                description: "Reorder sections, see real-time preview, and customize your resume layout to match your style."
              },
              {
                step: "03",
                title: "Download & Share",
                description: "Get your professionally formatted PDF resume instantly, ready for job applications."
              }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center text-2xl font-bold text-white" style={{ backgroundColor: 'var(--color-primary)' }}>
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--color-foreground)' }}>
                  {step.title}
                </h3>
                <p style={{ color: 'var(--color-foreground-secondary)' }}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20" style={{ backgroundColor: 'var(--color-surface-secondary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6" style={{ color: 'var(--color-foreground)' }}>
                Why Choose ResumeForge?
              </h2>
              <p className="text-lg mb-8" style={{ color: 'var(--color-foreground-secondary)' }}>
                Stand out from the competition with professionally crafted resumes that showcase your skills and experience in the best possible light.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Check size={20} style={{ color: 'var(--color-primary)' }} />
                    <span style={{ color: 'var(--color-foreground)' }}>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="surface rounded-lg p-8 text-center">
              <div className="flex justify-center mb-6">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={24} fill="currentColor" style={{ color: '#fbbf24' }} />
                  ))}
                </div>
              </div>
              <blockquote className="text-lg italic mb-4" style={{ color: 'var(--color-foreground)' }}>
                "ResumeForge helped me land my dream job! The LaTeX formatting made my resume look incredibly professional."
              </blockquote>
              <div className="font-semibold" style={{ color: 'var(--color-foreground)' }}>
                Divyam
              </div>
              <div className="text-sm" style={{ color: 'var(--color-foreground-secondary)' }}>
                VIT Vellore
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6" style={{ color: 'var(--color-foreground)' }}>
            Ready to Build Your Perfect Resume?
          </h2>
          <p className="text-xl mb-8" style={{ color: 'var(--color-foreground-secondary)' }}>
            Join thousands of professionals who have successfully landed their dream jobs with ResumeForge.
          </p>
          <button 
            onClick={handleGetStarted}
            className="btn-primary flex items-center gap-3 px-8 py-4 rounded-lg text-lg font-semibold mx-auto"
          >
            Start Creating Your Resume
            <ArrowRight size={20} />
          </button>
          <p className="text-sm mt-4" style={{ color: 'var(--color-foreground-secondary)' }}>
            No credit card required • Free forever • Download instantly
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="surface border-t py-12" style={{ borderColor: 'var(--color-border)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <FileText size={24} style={{ color: 'var(--color-primary)' }} />
                <span className="text-lg font-bold" style={{ color: 'var(--color-foreground)' }}>
                  ResumeForge
                </span>
              </div>
              <p className="text-sm" style={{ color: 'var(--color-foreground-secondary)' }}>
                Professional LaTeX resume generator for modern job seekers.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4" style={{ color: 'var(--color-foreground)' }}>
                Product
              </h4>
              <ul className="space-y-2 text-sm" style={{ color: 'var(--color-foreground-secondary)' }}>
                <li><a href="#" className="hover:text-opacity-80 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-opacity-80 transition-colors">Templates</a></li>
                <li><a href="#" className="hover:text-opacity-80 transition-colors">Examples</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4" style={{ color: 'var(--color-foreground)' }}>
                Support
              </h4>
              <ul className="space-y-2 text-sm" style={{ color: 'var(--color-foreground-secondary)' }}>
                <li><a href="#" className="hover:text-opacity-80 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-opacity-80 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-opacity-80 transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4" style={{ color: 'var(--color-foreground)' }}>
                Company
              </h4>
              <ul className="space-y-2 text-sm" style={{ color: 'var(--color-foreground-secondary)' }}>
                <li><a href="#" className="hover:text-opacity-80 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-opacity-80 transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-opacity-80 transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm" style={{ borderColor: 'var(--color-border)', color: 'var(--color-foreground-secondary)' }}>
            © 2025 ResumeForge. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
