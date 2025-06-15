// latexTemplate.js
// const createSectionTitle = (title) => {
//   return `\\section{${escapeLatex(title)}}`;
// };

// const createLatexSection = (title) => {
//     // Manual escaping for section titles (not user input)
//     const cleanTitle = title.replace(/&/g, '\\&');
//     return `\\section{${cleanTitle}}`;
// };

const escapeLatex = (str) => {
  if (typeof str !== 'string') return '';
  
  // First convert *word* to \textbf{word}
  let result = str.replace(/\*([^*]+)\*/g, '\\textbf{$1}');
  
  // Then escape special characters, but preserve \textbf{} commands
  // Split on \textbf{...} to process separately
  const parts = result.split(/(\\textbf\{[^}]*\})/);
  
  result = parts.map((part, index) => {
    // Don't escape \textbf{} commands (odd indices)
    if (index % 2 === 1) {
      return part;
    }
    
    // Escape special characters in regular text
    return part
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
  }).join('');
  
  return result;
};


const generateHeader = (personalInfo) => {
  const { name, email, phone, linkedin, github, portfolio, leetcode } = personalInfo;
  
  // Build contact links with FontAwesome icons
  const contactLinks = [];
  
  if (email) {
    contactLinks.push(`\\faIcon{envelope}\n    \\href{mailto:${email}}{\\color{black}${escapeLatex(email)}}`);
  }
  if (phone) {
    contactLinks.push(`\\faIcon{phone}\n    \\href{tel:${phone}}{\\color{black}${escapeLatex(phone)}}`);
  }
  if (linkedin) {
    contactLinks.push(`\\faIcon{linkedin}\n    \\href{${linkedin}}{\\color{black}LinkedIn}`);
  }
  if (github) {
    contactLinks.push(`\\faIcon{github}\n    \\href{${github}}{\\color{black}GitHub}`);
  }
  if (portfolio) {
    contactLinks.push(`\\faIcon{code}\n    \\href{${portfolio}}{\\color{black}Portfolio}`);
  }
  if (leetcode) {
    contactLinks.push(`\\faIcon{code-branch}\n    \\href{${leetcode}}{\\color{black}LeetCode}`);
  }

  const contactSection = contactLinks.join(' \\hspace{5px}\n    ');

  return `\\begin{center}
    \\textbf{\\Huge \\scshape ${escapeLatex(name) || 'Your Name'}} \\\\ \\vspace{8pt}
    \\small 
    ${contactSection}
\\end{center}

\\vspace{-8pt}`;
};

const generateEducationSection = (education) => {
  if (!education || !Array.isArray(education) || !education.some(e => e && e.institution)) return '';
  
  const educationEntries = education
    .filter(edu => edu && edu.institution && edu.institution.trim() !== '')
    .map(edu => {
      const coursework = edu.coursework && edu.coursework.trim() !== '' ? 
        `\n    \\resumeItemListStart\n      \\item {\\textit{Relevant Coursework:} ${escapeLatex(edu.coursework)}}\n    \\resumeItemListEnd\n    \\vspace{-7pt}` : '';
      
      const cgpaText = edu.cgpa && edu.cgpa.trim() !== '' ? `\\textbf{CGPA: ${escapeLatex(edu.cgpa)}}` : '';
      
      return `    \\resumeSubheading
    {${escapeLatex(edu.institution || '')}}{${escapeLatex(edu.duration || '')}}
    {${escapeLatex(edu.degree || '')}}{${cgpaText}}${coursework}`;
    }).join('\n\n');

  return `\\section{Education}
  \\resumeSubHeadingListStart
${educationEntries}
  \\resumeSubHeadingListEnd`;
};

const generateExperienceSection = (experience) => {
  if (!experience || !Array.isArray(experience) || !experience.some(e => e && e.company)) return '';
  
  const experienceEntries = experience
    .filter(exp => exp && exp.company && exp.company.trim() !== '')
    .map(exp => {
      const achievements = (exp.achievements || []).filter(ach => ach && typeof ach === 'string' && ach.trim() !== '');
      const achievementsList = achievements.length > 0 ? 
        `\n    \\resumeItemListStart\n${achievements.map(ach => `        \\resumeItem{${escapeLatex(ach)}}`).join('\n')}\n    \\resumeItemListEnd` : '';
      
      return `   \\resumeSubheading
    {${escapeLatex(exp.company || '')}}{${escapeLatex(exp.duration || '')}}
    {${escapeLatex(exp.position || '')}}{${escapeLatex(exp.location || '')}}${achievementsList}`;
    }).join('\n\n');

  return `\\section{Experience}
  \\resumeSubHeadingListStart

${experienceEntries}

  \\resumeSubHeadingListEnd`;
};

const generateProjectsSection = (projects) => {
  if (!projects || !Array.isArray(projects) || !projects.some(p => p && p.name)) return '';
  
  // Add the custom resumeProject command definition
  const projectCommand = `\\newcommand{\\resumeProject}[4]{
\\vspace{0.5mm}\\item
    \\begin{tabular*}{0.98\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
        \\textbf{#1} & \\textit{\\footnotesize{#3}} \\\\
        \\footnotesize{\\textit{#2}} & \\footnotesize{#4}
    \\end{tabular*}
    \\vspace{-4.4mm}
}
\\vspace{-8pt}`;
  
  const projectEntries = projects
    .filter(proj => proj && proj.name && proj.name.trim() !== '')
    .map(proj => {
      const descriptions = (proj.description || []).filter(desc => desc && typeof desc === 'string' && desc.trim() !== '');
      
      // Build links with colored formatting
      const links = [];
      if (proj.github && proj.github.trim() !== '') {
        links.push(`\\href{${proj.github}}{\\textcolor{blue}{(GitHub)}}`);
      }
      if (proj.livesite && proj.livesite.trim() !== '') {
        links.push(`\\href{${proj.livesite}}{\\textcolor{blue}{(Live Site)}}`);
      }
      const linkString = links.join(' ');
      
      const techWithLinks = proj.technologies ? 
        `${escapeLatex(proj.technologies)}${linkString ? ' ' + linkString : ''}` : 
        linkString;
      
      const descriptionList = descriptions.length > 0 ? 
        `\n\n \\resumeItemListStart\n${descriptions.map(desc => `\\resumeItem{${escapeLatex(desc)}}`).join('\n')}\n\\resumeItemListEnd` : '';
      
      return `     \\resumeProject
    {${escapeLatex(proj.name || '')}}{${techWithLinks}}{}${descriptionList}`;
    }).join('\n\n');

  return `${projectCommand}

\\section{Projects}
    \\resumeSubHeadingListStart

${projectEntries}

    \\resumeSubHeadingListEnd
\\vspace{-8pt}`;
};

const generateSkillsSection = (skills) => {
  if (!skills || typeof skills !== 'object') return '';
  
  const skillEntries = Object.entries(skills)
    .filter(([key, value]) => key && value && typeof value === 'string' && value.trim() !== '')
    .map(([key, value]) => {
      const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
      return `     \\textbf{${escapeLatex(capitalizedKey)}}{: ${escapeLatex(value)}} \\\\`;
    }).join('\n     \\vspace{3pt}\n');

  if (!skillEntries) return '';

  return `\\section{Skills}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
${skillEntries.replace(/\\\\\s*$/, '')} % Remove trailing \\
    }}
 \\end{itemize}`;
};

const generateCertificationsSection = (certifications) => {
    if (!certifications || !Array.isArray(certifications)) return '';

    const validCerts = certifications.filter(c => c && typeof c === 'string' && c.trim() !== '');
    if (validCerts.length === 0) return '';

    const certEntries = validCerts
        .map(cert => `\\resumeItem{${escapeLatex(cert)}}`)
        .join('\\vspace{4pt}\n');

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
\\usepackage{hyperref}
\\usepackage{fontawesome5}
\\usepackage{enumitem} % For adjusting itemize margins
\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\usepackage{xcolor}

% Custom command for clickable icon link
\\newcommand{\\iconhref}[1]{\\href{#1}{\\raisebox{.15ex}{\\footnotesize \\faExternalLink*}}}

\\hypersetup{
    colorlinks=true,       % false: boxed links; true: colored links
    linkcolor=black,       % color of internal links
    citecolor=black,       % color of links to bibliography
    filecolor=black,       % color of file links
    urlcolor=blue          % color of external links
}

\\input{glyphtounicode}

%----------FONT OPTIONS----------
% sans-serif
% \\usepackage[sfdefault]{FiraSans}
% \\usepackage[sfdefault]{roboto}
% \\usepackage[sfdefault]{noto-sans}
% \\usepackage[default]{sourcesanspro}

% serif
% \\usepackage{CormorantGaramond}
% \\usepackage{charter}

\\pagestyle{fancy}
\\fancyhf{} % clear all header and footer fields
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

% Adjust margins
\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}

\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

% Sections formatting
\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

% Ensure that generate pdf is machine readable/ATS parsable
\\pdfgentounicode=1

%-------------------------
% Custom commands
\\newcommand{\\resumeItem}[1]{
  \\item\\small{
    {#1 \\vspace{-2pt}}
  }
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-2pt}\\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubSubheading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\textit{\\small#1} & \\textit{\\small #2} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubItem}[1]{\\resumeItem{#1}\\vspace{-4pt}}

\\renewcommand\\labelitemii{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-8pt}}

%-------------------------------------------
%%%%%%  RESUME STARTS HERE  %%%%%%%%%%%%%%%%%%%%%%%%%%%%
\\addtolength{\\topmargin}{-12pt} % Reduce top margin
\\addtolength{\\textheight}{24pt} % Increase text height to reduce bottom margin`;
};

const generateLatexResume = (resumeData, options = {}) => {
  const { 
    personalInfo, 
    education, 
    experience, 
    projects, 
    skills, 
    certifications 
  } = resumeData;

  // Generate sections based on options or data availability
  const sections = [];
  
  if (options.includeEducation !== false) {
    const eduSection = generateEducationSection(education);
    if (eduSection) sections.push(eduSection);
  }
  
  if (options.includeProjects !== false) {
    const projSection = generateProjectsSection(projects);
    if (projSection) sections.push(projSection);
  }
  
  if (options.includeExperience !== false) {
    const expSection = generateExperienceSection(experience);
    if (expSection) sections.push(expSection);
  }
  
  if (options.includeSkills !== false) {
    const skillsSection = generateSkillsSection(skills);
    if (skillsSection) sections.push(skillsSection);
  }
  
  if (options.includeCertifications !== false) {
    const certSection = generateCertificationsSection(certifications);
    if (certSection) sections.push(certSection);
  }

  return `${getDocumentPreamble()}

\\begin{document}
${generateHeader(personalInfo)}

${sections.join('\n\n')}

\\end{document}`;
};

export { generateLatexResume, escapeLatex };