/* Resume.js */

import React, { useState, useEffect, useCallback, createContext, useContext, useRef } from 'react';
import { Mail, Phone, Linkedin, Github, Globe, Code, FileText, Plus, Trash2, Download, Loader, AlertTriangle, ChevronDown, RefreshCw, Briefcase, Wrench, Award, Moon, Sun, GripVertical } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import LandingPage from './LandingPage'; // Import the new LandingPage component
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// --- Dark Mode Context ---
const DarkModeContext = createContext();

export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error('useDarkMode must be used within DarkModeProvider');
  }
  return context;
};

export const DarkModeProvider = ({ children }) => {
  const getInitialTheme = () => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) return storedTheme === 'dark';
    
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark;
  };

  const [isDark, setIsDark] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <DarkModeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </DarkModeContext.Provider>
  );
};

// --- Dark Mode Toggle Component ---
export const DarkModeToggle = () => {
  const { isDark, toggleTheme } = useDarkMode();

  // Add a small delay to prevent rapid clicking
  const [isToggling, setIsToggling] = useState(false);

  const handleToggle = () => {
    if (isToggling) return;
    setIsToggling(true);
    toggleTheme();
    setTimeout(() => setIsToggling(false), 150);
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isToggling}
      className="p-2 rounded-lg surface hover:surface-secondary border border-border"
      style={{ 
        transition: 'background-color 0.1s cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: isToggling ? 0.7 : 1
      }}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? (
        <Sun size={20} className="text-yellow-500" />
      ) : (
        <Moon size={20} className="text-slate-600" />
      )}
    </button>
  );
};

// --- LaTeX Generation Module with Dynamic Ordering ---

const escapeLatex = (str) => {
  if (typeof str !== 'string') return '';
  return str
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/&/g, '\\&')
    .replace(/%/g, '\\%')
    .replace(/\$/g, '\\$')
    .replace(/#/g, '\\#')
    .replace(/_/g, '\\_')
    .replace(/{/g, '\\{')
    .replace(/}/g, '\\}')
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/\^/g, '\\textasciicircum{}');
};

const generateHeader = (personalInfo) => {
  const { name, email, phone, linkedin, github, portfolio, leetcode } = personalInfo;
  
  const contactLinks = [
    email ? `\\faIcon{envelope} \\href{mailto:${email}}{\\color{black}${escapeLatex(email)}}` : '',
    phone ? `\\faIcon{phone} \\href{tel:${phone.replace(/[^\d+]/g, '')}}{\\color{black}${escapeLatex(phone)}}` : '',
    linkedin ? `\\faIcon{linkedin} \\href{${linkedin}}{\\color{black}LinkedIn}` : '',
    github ? `\\faIcon{github} \\href{${github}}{\\color{black}GitHub}` : '',
    portfolio ? `\\faIcon{code} \\href{${portfolio}}{\\color{black}Portfolio}` : '',
    leetcode ? `\\faIcon{code-branch} \\href{${leetcode}}{\\color{black}LeetCode}` : ''
  ].filter(link => link).join(' \\hspace{5px}\n');

  return `\\begin{center}
    \\textbf{\\Huge \\scshape ${escapeLatex(name) || 'Your Name'}} \\\\ \\vspace{8pt}
    \\small
    ${contactLinks}
\\end{center}`;
};

const generateEducationSection = (education) => {
    if (!education || !education.some(e => e && e.institution)) return '';
    const entries = education.filter(e => e.institution).map(edu => {
        const coursework = edu.coursework ? `\\resumeItemListStart\\item{\\textit{Relevant Coursework:} ${escapeLatex(edu.coursework)}}\\resumeItemListEnd` : '';
        return `\\resumeSubheading
      {${escapeLatex(edu.institution)}}{${escapeLatex(edu.duration)}}
      {${escapeLatex(edu.degree)}}{${edu.cgpa ? `\\textbf{CGPA: ${escapeLatex(edu.cgpa)}}` : ''}}
      ${coursework}`;
    }).join('\\vspace{-7pt}\n');
    return `\\section{Education}
    \\resumeSubHeadingListStart
    ${entries}
    \\resumeSubHeadingListEnd`;
};

const generateExperienceSection = (experience) => {
    if (!experience || !experience.some(e => e && e.company)) return '';
    const entries = experience.filter(e => e.company).map(exp => {
        const achievements = exp.achievements.filter(a => a.trim() !== '');
        const achievementsList = achievements.length > 0 ? `\\resumeItemListStart
        ${achievements.map(ach => `\\resumeItem{${escapeLatex(ach)}}`).join('\n')}
      \\resumeItemListEnd` : '';
        return `\\resumeSubheading
      {${escapeLatex(exp.company)}}{${escapeLatex(exp.duration)}}
      {${escapeLatex(exp.position)}}{${escapeLatex(exp.location)}}
      ${achievementsList}`;
    }).join('');
    return `\\section{Experience}
    \\resumeSubHeadingListStart
    ${entries}
    \\resumeSubHeadingListEnd`;
};

const generateProjectsSection = (projects) => {
    if (!projects || !projects.some(p => p && p.name)) return '';
    const entries = projects.filter(p => p.name).map(proj => {
        const descriptions = proj.description.filter(d => d.trim() !== '');
        const descriptionList = descriptions.length > 0 ? `\\resumeItemListStart
        ${descriptions.map(desc => `\\resumeItem{${escapeLatex(desc)}}`).join('\n')}
        \\resumeItemListEnd` : '';
        const links = [
            proj.github ? `\\href{${proj.github}}{\\textcolor{blue}{(GitHub)}}` : '',
            proj.livesite ? `\\href{${proj.livesite}}{\\textcolor{blue}{(Live Site)}}` : ''
        ].filter(Boolean).join(' ');
        
        return `\\resumeProject
        {${escapeLatex(proj.name)}}
        {${escapeLatex(proj.technologies)} ${links}}{}{}
        ${descriptionList}`;
    }).join('\n');
    return `\\section{Projects}
    \\resumeSubHeadingListStart
    ${entries}
    \\resumeSubHeadingListEnd`;
};

const generateSkillsSection = (skills) => {
    const skillEntries = Object.entries(skills)
        .filter(([, value]) => value && value.trim() !== '')
        .map(([key, value]) => `\\textbf{${escapeLatex(key.charAt(0).toUpperCase() + key.slice(1))}}{: ${escapeLatex(value)}}`);

    if (skillEntries.length === 0) return '';
    
    return `\\section{Skills}
    \\begin{itemize}[leftmargin=0.15in, label={}]
        \\small{\\item{
            ${skillEntries.join(' \\\\\n\\vspace{3pt}\n')}
        }}
    \\end{itemize}`;
};

const generateCertificationsSection = (certifications) => {
    const validCerts = certifications.filter(c => c && c.trim() !== '');
    if (validCerts.length === 0) return '';
    
    const certEntries = validCerts.map(cert => `\\resumeItem{${escapeLatex(cert)}}`).join('\\vspace{4pt}\n');
    
    return `\\vspace{-12pt}
    \\section{Certifications \\& Achievements}
    \\begin{itemize}[leftmargin=0.15in, label={}]
        \\item{
            \\begin{itemize}[leftmargin=0.15in, itemsep=-2pt]
                ${certEntries}
            \\end{itemize}
        }
    \\end{itemize}`;
};

const getDocumentPreamble = () => {
  return `\\documentclass[letterpaper,11pt]{article}
\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\usepackage{fontawesome5}
\\usepackage{amsmath}
\\usepackage{xcolor}

\\hypersetup{
    colorlinks=true,
    linkcolor=black,
    citecolor=black,
    filecolor=black,
    urlcolor=blue
}

\\pagestyle{fancy}
\\fancyhf{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}
\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

\\pdfgentounicode=1

\\newcommand{\\resumeItem}[1]{\\item\\small{{#1 \\vspace{-2pt}}}}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-2pt}\\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeProject}[4]{
    \\vspace{0.5mm}\\item
    \\begin{tabular*}{0.98\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & \\textit{\\footnotesize{#3}} \\\\
      \\footnotesize{\\textit{#2}} & \\footnotesize{#4}
    \\end{tabular*}
    \\vspace{-4.4mm}
}

\\renewcommand\\labelitemii{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-8pt}}
`;
};

// Enhanced LaTeX Generation with Dynamic Section Ordering
const generateFullLatex = (resumeData, sectionOrder) => {
    const preamble = getDocumentPreamble();
    const header = generateHeader(resumeData.personalInfo);
    
    // Section generators mapping
    const sectionGenerators = {
        education: () => generateEducationSection(resumeData.education),
        experience: () => generateExperienceSection(resumeData.experience),
        projects: () => generateProjectsSection(resumeData.projects),
        skills: () => generateSkillsSection(resumeData.skills),
        certifications: () => generateCertificationsSection(resumeData.certifications)
    };
    
    // Generate sections in the specified order
    const sections = sectionOrder
        .filter(sectionId => sectionGenerators[sectionId] && resumeData[sectionId])
        .map(sectionId => sectionGenerators[sectionId]())
        .filter(Boolean)
        .join('\n\\vspace{-8pt}\n');

    const documentBody = `
\\addtolength{\\topmargin}{-12pt}
\\addtolength{\\textheight}{24pt}
\\begin{document}
${header}
\\vspace{-8pt}
${sections}
\\end{document}
    `;

    return preamble + documentBody;
};

// --- React Components ---

// Debounce hook for delaying function execution
const useDebounce = (callback, delay) => {
    const [timeoutId, setTimeoutId] = useState(null);
    
    return (...args) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        const newTimeoutId = setTimeout(() => {
            callback(...args);
        }, delay);
        setTimeoutId(newTimeoutId);
    };
};

// Enhanced Collapsible Section Component with Dark Mode Support and Animation Fix
const CollapsibleSection = ({ title, icon, children, defaultOpen = true }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const [isAnimating, setIsAnimating] = useState(false);
    const [animationKey, setAnimationKey] = useState(0);
    const contentRef = useRef(null);
    
    const toggleSection = () => {
        if (isAnimating) return;
        
        setIsAnimating(true);
        setIsOpen(prev => !prev);
        
        // Reset animation state after transition completes
        setTimeout(() => {
            setIsAnimating(false);
            setAnimationKey(prev => prev + 1);
        }, 300);
    };

    // Force re-render mechanism for stuck animations
    const forceRerender = () => {
        setAnimationKey(prev => prev + 1);
    };

    return (
        <div key={animationKey} className="surface rounded-lg mb-4 lg:mb-6 overflow-hidden transition-all duration-300">
            <button
                onClick={toggleSection}
                disabled={isAnimating}
                className="w-full flex justify-between items-center p-3 lg:p-4 text-left font-semibold text-base lg:text-lg hover:surface-secondary transition-colors duration-200"
                style={{ 
                    color: 'var(--color-foreground)',
                    opacity: isAnimating ? 0.7 : 1
                }}
            >
                <div className="flex items-center gap-2 lg:gap-3">
                    <div className="flex-shrink-0">
                        {React.cloneElement(icon, { size: window.innerWidth < 1024 ? 20 : 24 })}
                    </div>
                    <span className="truncate">{title}</span>
                </div>
                <ChevronDown
                    size={window.innerWidth < 1024 ? 20 : 24}
                    className={`transform transition-transform duration-300 flex-shrink-0 ${
                        isOpen ? 'rotate-180' : ''
                    }`}
                />
            </button>
            <div
                ref={contentRef}
                className={`transition-all duration-300 ease-in-out ${
                    isOpen 
                        ? 'max-h-[2000px] opacity-100 visible' 
                        : 'max-h-0 opacity-0 invisible overflow-hidden'
                }`}
                style={{
                    transitionProperty: 'max-height, opacity, visibility',
                    willChange: 'max-height, opacity'
                }}
            >
                <div className="p-3 lg:p-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
                    {children}
                </div>
            </div>
        </div>
    );
};

// Section Order Manager Component with Drag & Drop
const SectionOrderManager = ({ sectionOrder, setSectionOrder, isOpen, setIsOpen }) => {
    const sectionNames = {
        education: { name: 'Education', icon: <Code size={20} /> },
        experience: { name: 'Experience', icon: <Briefcase size={20} /> },
        projects: { name: 'Projects', icon: <Globe size={20} /> },
        skills: { name: 'Skills', icon: <Wrench size={20} /> },
        certifications: { name: 'Certifications and Achievements', icon: <Award size={20} /> }
    };

    const handleOnDragEnd = (result) => {
        if (!result.destination) return;

        const items = Array.from(sectionOrder);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setSectionOrder(items);
    };

    if (!isOpen) {
        return (
            <div className="surface rounded-lg shadow-md mb-4 lg:mb-6 p-3 lg:p-4">
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-full flex justify-between items-center text-left font-semibold text-base lg:text-lg"
                    style={{ color: 'var(--color-foreground)' }}
                >
                    <div className="flex items-center gap-2 lg:gap-3">
                        <GripVertical size={window.innerWidth < 1024 ? 20 : 24} />
                        <span className="truncate">Customize Section Order</span>
                    </div>
                    <ChevronDown size={window.innerWidth < 1024 ? 20 : 24} className="flex-shrink-0" />
                </button>
            </div>
        );
    }

    return (
        <div className="surface rounded-lg shadow-md mb-4 lg:mb-6">
            <button
                onClick={() => setIsOpen(false)}
                className="w-full flex justify-between items-center p-3 lg:p-4 text-left font-semibold text-base lg:text-lg"
                style={{ color: 'var(--color-foreground)' }}
            >
                <div className="flex items-center gap-2 lg:gap-3">
                    <GripVertical size={window.innerWidth < 1024 ? 20 : 24} />
                    <span className="truncate">Customize Section Order</span>
                </div>
                <ChevronDown size={window.innerWidth < 1024 ? 20 : 24} className="transform rotate-180 flex-shrink-0" />
            </button>
            
            <div className="p-3 lg:p-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
                <p className="text-xs lg:text-sm mb-3 lg:mb-4" style={{ color: 'var(--color-foreground-secondary)' }}>
                    Drag and drop to reorder sections. This will change the order in your generated resume.
                </p>
                
                <DragDropContext onDragEnd={handleOnDragEnd}>
                    <Droppable droppableId="sections">
                        {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                                {sectionOrder.map((sectionId, index) => (
                                    <Draggable key={sectionId} draggableId={sectionId} index={index}>
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className={`flex items-center gap-2 lg:gap-3 p-2 lg:p-3 surface-secondary rounded-lg border cursor-move hover:surface transition-colors ${
                                                    snapshot.isDragging ? 'opacity-60 transform rotate-2 shadow-lg z-1000' : ''
                                                }`}
                                                style={{
                                                    borderColor: 'var(--color-border)',
                                                    ...provided.draggableProps.style
                                                }}
                                            >
                                                <GripVertical size={14} style={{ color: 'var(--color-foreground-secondary)' }} className="flex-shrink-0" />
                                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                                    {sectionNames[sectionId]?.icon}
                                                    <span className="font-medium text-sm lg:text-base truncate" style={{ color: 'var(--color-foreground)' }}>
                                                        {sectionNames[sectionId]?.name}
                                                    </span>
                                                </div>
                                                <div className="text-xs lg:text-sm flex-shrink-0" style={{ color: 'var(--color-foreground-secondary)' }}>
                                                    {index + 1}
                                                </div>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
                
                <div className="mt-3 lg:mt-4 p-2 lg:p-3 rounded-lg" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
                    <p className="text-xs lg:text-sm" style={{ color: 'var(--color-primary)' }}>
                        💡 <strong>Tip:</strong> The sections will appear in your resume in the exact order shown above.
                    </p>
                </div>
            </div>
        </div>
    );
};

// The core component for the Resume Generator with all enhancements and fixes
const ResumeGenerator = () => {
  // State for the form data (preserved exactly as original)
  const [resumeData, setResumeData] = useState({
    personalInfo: { name: '', email: '', phone: '', linkedin: '', github: '', portfolio: '', leetcode: '' },
    education: [{ institution: '', duration: '', degree: '', cgpa: '', coursework: '' }],
    experience: [{ company: '', duration: '', position: '', location: '', achievements: [''] }],
    projects: [{ name: '', technologies: '', github: '', livesite: '', description: [''] }],
    skills: { expertise: '', languages: '', frameworks: '', tools: '', professional: '' },
    certifications: ['']
  });

  // New state for section ordering
  const [sectionOrder, setSectionOrder] = useState([
    'education',
    'projects', 
    'experience',
    'skills',
    'certifications'
  ]);
  
  const [sectionOrderOpen, setSectionOrderOpen] = useState(false);

  // State for UI control and compilation (preserved exactly as original)
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isCompiling, setIsCompiling] = useState(false);
  const [compilationError, setCompilationError] = useState('');
  
  // Add render keys for forced re-rendering
  const [projectsRenderKey, setProjectsRenderKey] = useState(0);
  const [globalRenderKey, setGlobalRenderKey] = useState(0);
  
  // Refs for scroll functionality
  const projectsSectionRef = useRef(null);
  
  // Enhanced compilation function with dynamic section ordering
  const handleCompile = useCallback(async (isManual = false) => {
    // Set compiling state for both manual and auto compilation
    setIsCompiling(true);
    setCompilationError('');

    // Use the enhanced generateFullLatex with section ordering
    const latexString = generateFullLatex(resumeData, sectionOrder);
    
    try {
        const response = await fetch('https://latex.ytotech.com/builds/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                compiler: 'pdflatex',
                resources: [{ path: 'main.tex', content: latexString }]
            })
        });

        if (!response.ok) {
            let errorMessage = `API Error: ${response.status} ${response.statusText}`;
            try {
                const errorData = await response.json();
                errorMessage = errorData.log || errorData.message || JSON.stringify(errorData);
            } catch (e) {
                const textError = await response.text();
                if (textError) { errorMessage = textError; }
            }
            throw new Error(errorMessage);
        }

        const pdfBlob = await response.blob();
        
        if (pdfUrl) {
            URL.revokeObjectURL(pdfUrl);
        }
        
        const newPdfUrl = URL.createObjectURL(pdfBlob);
        setPdfUrl(newPdfUrl);
    } catch (error) {
        console.error("Compilation failed:", error);
        setCompilationError(error.message);
        setPdfUrl(null);
    } finally {
        // Always reset compiling state regardless of manual or auto
        setIsCompiling(false);
    }
}, [resumeData, sectionOrder, pdfUrl]);

  // Enhanced useEffect to include sectionOrder dependency
  useEffect(() => {
    const timeoutId = setTimeout(() => {
        handleCompile(false);
    }, 1000); // 1 second delay for auto-compilation

    return () => {
        clearTimeout(timeoutId);
        if (pdfUrl) {
            URL.revokeObjectURL(pdfUrl);
        }
    };
}, [resumeData, sectionOrder]);

  // --- Enhanced Data Update Functions with Scroll and Re-render Fixes ---
  const updatePersonalInfo = (field, value) => setResumeData(p => ({ ...p, personalInfo: { ...p.personalInfo, [field]: value } }));
  
  const addEducation = () => setResumeData(p => ({ ...p, education: [...p.education, { institution: '', duration: '', degree: '', cgpa: '', coursework: '' }] }));
  const removeEducation = index => setResumeData(p => ({ ...p, education: p.education.filter((_, i) => i !== index) }));
  const updateEducation = (index, field, value) => setResumeData(p => ({...p, education: p.education.map((e, i) => i === index ? { ...e, [field]: value } : e)}));
  
  const addExperience = () => setResumeData(p => ({ ...p, experience: [...p.experience, { company: '', duration: '', position: '', location: '', achievements: [''] }] }));
  const removeExperience = index => setResumeData(p => ({ ...p, experience: p.experience.filter((_, i) => i !== index) }));
  const updateExperience = (index, field, value) => setResumeData(p => ({ ...p, experience: p.experience.map((e, i) => i === index ? { ...e, [field]: value } : e)}));
  const addExperienceAchievement = expIndex => setResumeData(p => ({ ...p, experience: p.experience.map((e, i) => i === expIndex ? { ...e, achievements: [...e.achievements, ''] } : e) }));
  const removeExperienceAchievement = (expIndex, achIndex) => setResumeData(p => ({ ...p, experience: p.experience.map((e, i) => i === expIndex ? { ...e, achievements: e.achievements.filter((_, j) => j !== achIndex) } : e) }));
  const updateExperienceAchievement = (expIndex, achIndex, value) => setResumeData(p => ({...p, experience: p.experience.map((e, i) => i === expIndex ? { ...e, achievements: e.achievements.map((a, j) => j === achIndex ? value : a) } : e)}));
  
  // Enhanced project functions with scroll and re-render fixes
  const addProject = () => {
    setResumeData(p => ({ 
        ...p, 
        projects: [...p.projects, { 
            name: '', 
            technologies: '', 
            github: '', 
            livesite: '', 
            description: [''] 
        }] 
    }));
    
    // Force projects section re-render
    setProjectsRenderKey(prev => prev + 1);
    
    // Scroll to new project after state update
    setTimeout(() => {
        if (projectsSectionRef.current) {
            const projectItems = projectsSectionRef.current.querySelectorAll('[data-project-index]');
            const lastProject = projectItems[projectItems.length - 1];
            if (lastProject) {
                lastProject.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start',
                    inline: 'nearest'
                });
            }
        }
    }, 150);
  };
  
  const removeProject = index => {
    setResumeData(p => ({ ...p, projects: p.projects.filter((_, i) => i !== index) }));
    setProjectsRenderKey(prev => prev + 1);
  };
  
  const updateProject = (index, field, value) => setResumeData(p => ({...p, projects: p.projects.map((proj, i) => i === index ? { ...proj, [field]: value } : proj)}));
  
  const addProjectDescription = projIndex => {
    setResumeData(p => ({ 
        ...p, 
        projects: p.projects.map((proj, i) => 
            i === projIndex 
                ? { ...proj, description: [...proj.description, ''] }
                : proj
        )
    }));
  };
  
  const removeProjectDescription = (projIndex, descIndex) => {
    setResumeData(p => ({ 
        ...p, 
        projects: p.projects.map((proj, i) => 
            i === projIndex 
                ? { ...proj, description: proj.description.filter((_, j) => j !== descIndex) }
                : proj
        )
    }));
  };
  
  const updateProjectDescription = (projIndex, descIndex, value) => {
    setResumeData(p => ({ 
        ...p, 
        projects: p.projects.map((proj, i) => 
            i === projIndex 
                ? { 
                    ...proj, 
                    description: proj.description.map((d, j) => 
                        j === descIndex ? value : d
                    ) 
                }
                : proj
        )
    }));
  };
  
  const updateSkills = (field, value) => setResumeData(p => ({...p, skills: { ...p.skills, [field]: value } }));
  const addCertification = () => setResumeData(p => ({ ...p, certifications: [...p.certifications, ''] }));
  const removeCertification = index => setResumeData(p => ({ ...p, certifications: p.certifications.filter((_, i) => i !== index) }));
  const updateCertification = (index, value) => setResumeData(p => ({...p, certifications: p.certifications.map((c, i) => i === index ? value : c)}));
  
  // Force re-render function for stuck sections
  const forceGlobalRerender = () => {
    setGlobalRenderKey(prev => prev + 1);
    setProjectsRenderKey(prev => prev + 1);
  };
  
  // Generate sections dynamically based on section order
  const renderSectionByType = (sectionType) => {
    switch(sectionType) {
      case 'education':
        return (
          <CollapsibleSection key="education" title="Education" icon={<Code size={24} />} defaultOpen={true}>
            <div className="flex justify-end mb-3 lg:mb-4">
              <button onClick={addEducation} className="btn-primary flex items-center gap-1 lg:gap-2 px-2 lg:px-3 py-2 rounded-lg text-xs lg:text-sm font-medium">
                <Plus size={14} /> Add Education
              </button>
            </div>
            {resumeData.education.map((edu, index) => (
              <div key={`education-${index}-${edu.institution || 'empty'}`} className="border-t pt-3 lg:pt-4 mt-3 lg:mt-4 first:border-t-0 first:mt-0" style={{ borderColor: 'var(--color-border)' }}>
                {resumeData.education.length > 1 && (
                  <div className="flex justify-end mb-2">
                    <button onClick={() => removeEducation(index)} className="text-red-500 hover:text-red-700 p-1 rounded" title="Remove Education">
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                  <input 
                    type="text" 
                    placeholder="Institution Name" 
                    value={edu.institution} 
                    onChange={(e) => updateEducation(index, 'institution', e.target.value)} 
                    className="input-field p-2 lg:p-3 text-sm lg:text-base rounded-lg focus:outline-none"
                  />
                  <input 
                    type="text" 
                    placeholder="Duration (e.g., Sep 2020 - Present)" 
                    value={edu.duration} 
                    onChange={(e) => updateEducation(index, 'duration', e.target.value)} 
                    className="input-field p-2 lg:p-3 text-sm lg:text-base rounded-lg focus:outline-none"
                  />
                  <input 
                    type="text" 
                    placeholder="Degree & Specialization" 
                    value={edu.degree} 
                    onChange={(e) => updateEducation(index, 'degree', e.target.value)} 
                    className="input-field p-2 lg:p-3 text-sm lg:text-base rounded-lg focus:outline-none"
                  />
                  <input 
                    type="text" 
                    placeholder="CGPA/GPA" 
                    value={edu.cgpa} 
                    onChange={(e) => updateEducation(index, 'cgpa', e.target.value)} 
                    className="input-field p-2 lg:p-3 text-sm lg:text-base rounded-lg focus:outline-none"
                  />
                </div>
                <textarea 
                  placeholder="Relevant Coursework (comma-separated)" 
                  value={edu.coursework} 
                  onChange={(e) => updateEducation(index, 'coursework', e.target.value)} 
                  rows={2} 
                  className="input-field w-full p-2 lg:p-3 text-sm lg:text-base rounded-lg mt-3 lg:mt-4 focus:outline-none resize-none"
                />
              </div>
            ))}
          </CollapsibleSection>
        );

      case 'experience':
        return (
          <CollapsibleSection key="experience" title="Experience" icon={<Briefcase size={24} />} defaultOpen={true}>
            <div className="flex justify-end mb-3 lg:mb-4">
              <button onClick={addExperience} className="btn-primary flex items-center gap-1 lg:gap-2 px-2 lg:px-3 py-2 rounded-lg text-xs lg:text-sm font-medium">
                <Plus size={14} /> Add Experience
              </button>
            </div>
            {resumeData.experience.map((exp, index) => (
              <div key={`experience-${index}-${exp.company || 'empty'}`} className="border-t pt-3 lg:pt-4 mt-3 lg:mt-4 first:border-t-0 first:mt-0" style={{ borderColor: 'var(--color-border)' }}>
                {resumeData.experience.length > 1 && (
                  <div className="flex justify-end mb-2">
                    <button onClick={() => removeExperience(index)} className="text-red-500 hover:text-red-700 p-1 rounded" title="Remove Experience">
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4 mb-3 lg:mb-4">
                  <input 
                    type="text" 
                    placeholder="Company Name" 
                    value={exp.company} 
                    onChange={e => updateExperience(index, 'company', e.target.value)} 
                    className="input-field p-2 lg:p-3 text-sm lg:text-base rounded-lg focus:outline-none" 
                  />
                  <input 
                    type="text" 
                    placeholder="Duration (e.g., May 2025 – June 2025)" 
                    value={exp.duration} 
                    onChange={e => updateExperience(index, 'duration', e.target.value)} 
                    className="input-field p-2 lg:p-3 text-sm lg:text-base rounded-lg focus:outline-none" 
                  />
                  <input 
                    type="text" 
                    placeholder="Position/Role" 
                    value={exp.position} 
                    onChange={e => updateExperience(index, 'position', e.target.value)} 
                    className="input-field p-2 lg:p-3 text-sm lg:text-base rounded-lg focus:outline-none" 
                  />
                  <input 
                    type="text" 
                    placeholder="Location (e.g., New Delhi)" 
                    value={exp.location} 
                    onChange={e => updateExperience(index, 'location', e.target.value)} 
                    className="input-field p-2 lg:p-3 text-sm lg:text-base rounded-lg focus:outline-none" 
                  />
                </div>
                <div className="space-y-2 lg:space-y-3">
                  <label className="font-medium text-xs lg:text-sm" style={{ color: 'var(--color-foreground-secondary)' }}>
                    Achievements/Responsibilities:
                  </label>
                  {exp.achievements.map((ach, achIndex) => (
                    <div key={`achievement-${achIndex}`} className="flex items-start gap-2">
                      <textarea 
                        placeholder="Describe an achievement" 
                        value={ach} 
                        onChange={e => updateExperienceAchievement(index, achIndex, e.target.value)} 
                        rows={2} 
                        className="input-field flex-1 p-2 lg:p-3 text-sm lg:text-base rounded-lg focus:outline-none resize-none" 
                      />
                      {exp.achievements.length > 1 && (
                        <button 
                          onClick={() => removeExperienceAchievement(index, achIndex)} 
                          className="text-red-500 hover:text-red-700 mt-2 p-1 rounded"
                          title="Remove Achievement"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button 
                    onClick={() => addExperienceAchievement(index)} 
                    className="text-blue-600 hover:text-blue-800 text-xs lg:text-sm font-medium"
                  >
                    + Add Achievement
                  </button>
                </div>
              </div>
            ))}
          </CollapsibleSection>
        );

      case 'projects':
        return (
          <CollapsibleSection 
            key={`projects-${projectsRenderKey}`} 
            title="Projects" 
            icon={<Globe size={24} />} 
            defaultOpen={true}
          >
            <div className="flex justify-between items-center mb-3 lg:mb-4">
              <button onClick={forceGlobalRerender} className="text-blue-600 hover:text-blue-800 text-xs font-medium" title="Refresh if stuck">
                <RefreshCw size={14} />
              </button>
              <button onClick={addProject} className="btn-primary flex items-center gap-1 lg:gap-2 px-2 lg:px-3 py-2 rounded-lg text-xs lg:text-sm font-medium">
                <Plus size={14} /> Add Project
              </button>
            </div>
            <div ref={projectsSectionRef}>
              {resumeData.projects.map((proj, index) => (
                <div 
                  key={`project-${index}-${proj.name || 'empty'}-${projectsRenderKey}`}
                  data-project-index={index}
                  className="border-t pt-3 lg:pt-4 mt-3 lg:mt-4 first:border-t-0 first:mt-0 transition-all duration-300" 
                  style={{ borderColor: 'var(--color-border)' }}
                >
                  {resumeData.projects.length > 1 && (
                    <div className="flex justify-end mb-2">
                      <button onClick={() => removeProject(index)} className="text-red-500 hover:text-red-700 p-1 rounded" title="Remove Project">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4 mb-3 lg:mb-4">
                    <input 
                      type="text" 
                      placeholder="Project Name" 
                      value={proj.name} 
                      onChange={e => updateProject(index, 'name', e.target.value)} 
                      className="input-field p-2 lg:p-3 text-sm lg:text-base rounded-lg md:col-span-2 focus:outline-none" 
                    />
                    <input 
                      type="text" 
                      placeholder="Technologies Used" 
                      value={proj.technologies} 
                      onChange={e => updateProject(index, 'technologies', e.target.value)} 
                      className="input-field p-2 lg:p-3 text-sm lg:text-base rounded-lg md:col-span-2 focus:outline-none" 
                    />
                    <input 
                      type="url" 
                      placeholder="GitHub Repository URL" 
                      value={proj.github} 
                      onChange={e => updateProject(index, 'github', e.target.value)} 
                      className="input-field p-2 lg:p-3 text-sm lg:text-base rounded-lg focus:outline-none" 
                    />
                    <input 
                      type="url" 
                      placeholder="Live Site URL" 
                      value={proj.livesite} 
                      onChange={e => updateProject(index, 'livesite', e.target.value)} 
                      className="input-field p-2 lg:p-3 text-sm lg:text-base rounded-lg focus:outline-none" 
                    />
                  </div>
                  <div className="space-y-2 lg:space-y-3">
                    <label className="font-medium text-xs lg:text-sm" style={{ color: 'var(--color-foreground-secondary)' }}>
                      Description:
                    </label>
                    {proj.description.map((desc, descIndex) => (
                      <div key={`description-${descIndex}`} className="flex items-start gap-2">
                        <textarea 
                          placeholder="Describe the project and your contributions" 
                          value={desc} 
                          onChange={e => updateProjectDescription(index, descIndex, e.target.value)} 
                          rows={2} 
                          className="input-field flex-1 p-2 lg:p-3 text-sm lg:text-base rounded-lg focus:outline-none resize-none" 
                        />
                        {proj.description.length > 1 && (
                          <button 
                            onClick={() => removeProjectDescription(index, descIndex)} 
                            className="text-red-500 hover:text-red-700 mt-2 p-1 rounded"
                            title="Remove Description"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                    <button 
                      onClick={() => addProjectDescription(index)} 
                      className="text-blue-600 hover:text-blue-800 text-xs lg:text-sm font-medium"
                    >
                      + Add Description Point
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CollapsibleSection>
        );

      case 'skills':
        return (
          <CollapsibleSection key="skills" title="Skills" icon={<Wrench size={24} />} defaultOpen={true}>
            <div className="space-y-3 lg:space-y-4">
              <textarea 
                placeholder="Expertise" 
                value={resumeData.skills.expertise} 
                onChange={(e) => updateSkills('expertise', e.target.value)} 
                rows={2} 
                className="input-field w-full p-2 lg:p-3 text-sm lg:text-base rounded-lg focus:outline-none resize-none" 
              />
              <textarea 
                placeholder="Languages" 
                value={resumeData.skills.languages} 
                onChange={(e) => updateSkills('languages', e.target.value)} 
                rows={2} 
                className="input-field w-full p-2 lg:p-3 text-sm lg:text-base rounded-lg focus:outline-none resize-none" 
              />
              <textarea 
                placeholder="Frameworks & Technologies" 
                value={resumeData.skills.frameworks} 
                onChange={(e) => updateSkills('frameworks', e.target.value)} 
                rows={2} 
                className="input-field w-full p-2 lg:p-3 text-sm lg:text-base rounded-lg focus:outline-none resize-none" 
              />
              <textarea 
                placeholder="Developer Tools" 
                value={resumeData.skills.tools} 
                onChange={(e) => updateSkills('tools', e.target.value)} 
                rows={2} 
                className="input-field w-full p-2 lg:p-3 text-sm lg:text-base rounded-lg focus:outline-none resize-none" 
              />
              <textarea 
                placeholder="Professional Skills" 
                value={resumeData.skills.professional} 
                onChange={(e) => updateSkills('professional', e.target.value)} 
                rows={2} 
                className="input-field w-full p-2 lg:p-3 text-sm lg:text-base rounded-lg focus:outline-none resize-none" 
              />
            </div>
          </CollapsibleSection>
        );

      case 'certifications':
        return (
          <CollapsibleSection key="certifications" title="Certifications & Achievements" icon={<Award size={24} />} defaultOpen={true}>
            <div className="flex justify-end mb-3 lg:mb-4">
              <button onClick={addCertification} className="btn-primary flex items-center gap-1 lg:gap-2 px-2 lg:px-3 py-2 rounded-lg text-xs lg:text-sm font-medium">
                <Plus size={14} /> Add Certification
              </button>
            </div>
            <div className="space-y-2 lg:space-y-3">
              {resumeData.certifications.map((cert, index) => (
                <div key={`certification-${index}`} className="flex items-start gap-2">
                  <textarea 
                    placeholder="Certification name, issuing organization, etc." 
                    value={cert} 
                    onChange={(e) => updateCertification(index, e.target.value)} 
                    rows={2} 
                    className="input-field flex-1 p-2 lg:p-3 text-sm lg:text-base rounded-lg focus:outline-none resize-none" 
                  />
                  {resumeData.certifications.length > 1 && (
                    <button 
                      onClick={() => removeCertification(index)} 
                      className="text-red-500 hover:text-red-700 mt-2 p-1 rounded"
                      title="Remove Certification"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </CollapsibleSection>
        );

      default:
        return null;
    }
  };

  return (
    <div key={globalRenderKey} className="flex flex-col lg:flex-row min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
        {/* Mobile-Optimized Layout: Details Section (Upper 2/3) */}
        <div className="w-full lg:w-1/2 flex flex-col" style={{ backgroundColor: 'var(--color-surface)' }}>
            {/* Form Container - Mobile: 2/3 height, Desktop: Full height */}
            <div className="h-screen lg:h-screen overflow-y-auto p-3 lg:p-6" 
                 style={{ 
                     height: window.innerWidth < 1024 ? '66.67vh' : '100vh',
                     minHeight: window.innerWidth < 1024 ? '66.67vh' : 'auto'
                 }}>
                
                {/* Compact Header with Dark Mode Toggle and Download */}
                <div className="flex justify-between items-center mb-4 lg:mb-8">
                    <h1 className="text-xl lg:text-3xl font-bold truncate pr-2" style={{ color: 'var(--color-foreground)' }}>
                        LaTeX Resume Generator
                    </h1>
                    <div className="flex items-center gap-2 lg:gap-3 flex-shrink-0">
                        <DarkModeToggle />
                        {pdfUrl && (
                            <a 
                                href={pdfUrl} 
                                download="resume.pdf" 
                                className="btn-primary flex items-center gap-1 lg:gap-2 px-2 lg:px-4 py-2 rounded-lg text-xs lg:text-sm font-medium"
                            >
                                <Download size={14} /> 
                                <span className="hidden sm:inline">Download</span>
                            </a>
                        )}
                    </div>
                </div>

                {/* Section Order Manager */}
                <SectionOrderManager 
                    sectionOrder={sectionOrder}
                    setSectionOrder={setSectionOrder}
                    isOpen={sectionOrderOpen}
                    setIsOpen={setSectionOrderOpen}
                />

                {/* Personal Information Section */}
                <CollapsibleSection title="Personal Information" icon={<FileText size={24} />} defaultOpen={true}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                        <input 
                            type="text" 
                            placeholder="Full Name" 
                            value={resumeData.personalInfo.name} 
                            onChange={(e) => updatePersonalInfo('name', e.target.value)} 
                            className="input-field p-2 lg:p-3 text-sm lg:text-base rounded-lg focus:outline-none" 
                        />
                        <input 
                            type="email" 
                            placeholder="Email Address" 
                            value={resumeData.personalInfo.email} 
                            onChange={(e) => updatePersonalInfo('email', e.target.value)} 
                            className="input-field p-2 lg:p-3 text-sm lg:text-base rounded-lg focus:outline-none" 
                        />
                        <input 
                            type="tel" 
                            placeholder="Phone Number" 
                            value={resumeData.personalInfo.phone} 
                            onChange={(e) => updatePersonalInfo('phone', e.target.value)} 
                            className="input-field p-2 lg:p-3 text-sm lg:text-base rounded-lg focus:outline-none" 
                        />
                        <input 
                            type="url" 
                            placeholder="LinkedIn Profile URL" 
                            value={resumeData.personalInfo.linkedin} 
                            onChange={(e) => updatePersonalInfo('linkedin', e.target.value)} 
                            className="input-field p-2 lg:p-3 text-sm lg:text-base rounded-lg focus:outline-none" 
                        />
                        <input 
                            type="url" 
                            placeholder="GitHub Profile URL" 
                            value={resumeData.personalInfo.github} 
                            onChange={(e) => updatePersonalInfo('github', e.target.value)} 
                            className="input-field p-2 lg:p-3 text-sm lg:text-base rounded-lg focus:outline-none" 
                        />
                        <input 
                            type="url" 
                            placeholder="Portfolio Website URL" 
                            value={resumeData.personalInfo.portfolio} 
                            onChange={(e) => updatePersonalInfo('portfolio', e.target.value)} 
                            className="input-field p-2 lg:p-3 text-sm lg:text-base rounded-lg focus:outline-none" 
                        />
                        <input 
                            type="url" 
                            placeholder="LeetCode Profile URL" 
                            value={resumeData.personalInfo.leetcode} 
                            onChange={(e) => updatePersonalInfo('leetcode', e.target.value)} 
                            className="input-field p-2 lg:p-3 text-sm lg:text-base rounded-lg md:col-span-2 focus:outline-none" 
                        />
                    </div>
                </CollapsibleSection>

                {/* Render sections in the order specified by sectionOrder */}
                {sectionOrder.map(sectionType => renderSectionByType(sectionType))}
            </div>
        </div>

        {/* Mobile-Optimized Layout: PDF Preview Section (Lower 1/3) */}
        <div className="w-full lg:w-1/2 flex flex-col" style={{ backgroundColor: 'var(--color-surface-secondary)' }}>
            <div className="flex-grow surface rounded-lg lg:rounded-none flex items-center justify-center p-2 lg:p-4 m-2 lg:m-4 lg:mt-4"
                 style={{ 
                     height: window.innerWidth < 1024 ? '33.33vh' : 'calc(100vh - 2rem)',
                     minHeight: window.innerWidth < 1024 ? '33.33vh' : 'auto',
                     maxHeight: window.innerWidth < 1024 ? '33.33vh' : 'none'
                 }}>

                {isCompiling && (
                    <div className="text-center" style={{ color: 'var(--color-foreground-secondary)' }}>
                        <Loader size={window.innerWidth < 1024 ? 32 : 48} className="animate-spin mb-2 lg:mb-4 mx-auto" />
                        <p className="text-xs lg:text-base">Compiling PDF with custom section order...</p>
                    </div>
                )}
                {compilationError && !isCompiling && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-800 p-2 lg:p-4 m-2 lg:m-4 rounded-md w-full h-full overflow-y-auto">
                        <div className="flex items-center">
                            <AlertTriangle size={window.innerWidth < 1024 ? 20 : 24} className="mr-2 lg:mr-3 flex-shrink-0" />
                            <p className="font-bold text-sm lg:text-base">Compilation Failed</p>
                        </div>
                        <p className="text-xs lg:text-sm mt-1 lg:mt-2 mb-1 lg:mb-2">Please check your inputs for special characters. The error from the compiler is shown below:</p>
                        <pre className="text-xs mt-1 lg:mt-2 p-1 lg:p-2 bg-red-50 rounded whitespace-pre-wrap font-mono break-all max-h-32 lg:max-h-none overflow-y-auto">
                            {compilationError}
                        </pre> 
                    </div>
                )}
                {!isCompiling && !compilationError && pdfUrl && (
                    <object data={pdfUrl} type="application/pdf" width="100%" height="100%" className="rounded-lg">
                        <div className="text-center p-4">
                            <p className="text-sm lg:text-base mb-2" style={{ color: 'var(--color-foreground-secondary)' }}>Your browser does not support PDFs.</p>
                            <a href={pdfUrl} className="btn-primary inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium">
                                <Download size={16} /> Download PDF
                            </a>
                        </div>
                    </object>
                )}
                {!isCompiling && !compilationError && !pdfUrl && (
                    <div className="text-center" style={{ color: 'var(--color-foreground-secondary)' }}>
                        <p className="text-sm lg:text-base">Your resume preview will appear here.</p>
                        <p className="text-xs lg:text-sm">Start typing to see it live!</p>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

// Main App Component with Dark Mode Provider
const App = () => {
    return (
        <DarkModeProvider>
            <div style={{ backgroundColor: 'var(--color-background)', minHeight: '100vh' }}>
                <ResumeGenerator />
            </div>
        </DarkModeProvider>
    );
};

export default ResumeGenerator;
