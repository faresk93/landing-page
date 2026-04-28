export interface CVContact {
  location: string;
  phone: string;
  email: string;
  website: string;
  github: string;
  linkedin: string;
}

export interface CVProfile {
  name: string;
  title: string;
  summary: string;
  contact: CVContact;
}

export interface CVSubRole {
  client: string;
  period: string;
  bullets: string[];
}

export interface CVExperience {
  id: string;
  role: string;
  company: string;
  client?: string;
  location: string;
  period: string;
  contextNote?: string;
  summary: string;
  bullets: string[];
  stack: string[];
  subRoles?: CVSubRole[];
  accent: 'cyan' | 'indigo' | 'emerald' | 'amber';
}

export interface CVSkillGroup {
  label: string;
  items: string[];
}

export interface CVEducation {
  id: string;
  degree: string;
  institution: string;
  period: string;
  honors?: string;
}

export interface CVProject {
  name: string;
  url?: string;
  description: string;
  stack: string[];
}

export interface CVLanguage {
  label: string;
  level: string;
}

export interface CVData {
  profile: CVProfile;
  experiences: CVExperience[];
  skills: CVSkillGroup[];
  education: CVEducation[];
  projects: CVProject[];
  languages: CVLanguage[];
  certifications: string[];
  interests: string[];
}

export const CV: CVData = {
  profile: {
    name: 'Fares KHIARY',
    title: 'Full-Stack Web Developer — PHP/Symfony & Angular',
    summary:
      'Full-Stack Engineer with 5+ years of experience building scalable web applications using PHP (Symfony) and Angular. Experienced in REST API design and large-scale booking platforms. Background in chemical engineering with strong analytical and problem-solving skills.',
    contact: {
      location: 'Paris, France',
      phone: '+33 758 533 825',
      email: 'contact@fares-khiary.com',
      website: 'fares-khiary.com',
      github: 'github.com/faresk93',
      linkedin: 'linkedin.com/in/fares-khiary',
    },
  },
  experiences: [
    {
      id: 'jems-pathe',
      role: 'Full Stack Developer',
      company: 'JEMS Group',
      client: 'Pathé Cinemas',
      location: 'Neuilly-sur-Seine / Paris, France',
      period: 'May 2023 — Present',
      summary:
        'Full-stack work on a large-scale cinema booking and order management platform, with REST APIs, payment integrations and continuous delivery.',
      bullets: [
        'Full-stack development on a large-scale cinema booking and order management platform.',
        'Design and maintenance of REST APIs following Domain-Driven Design (DDD) and CQRS.',
        'Integration and migration of payment solutions: Adyen, Payline, NAPS, ANCV.',
        'Third-party integrations: Vista (cinema management), Auth0, Redis (caching/events), Salesforce (CRM).',
        'Code quality and testing: PHPUnit, Behat, Jest, PHPStan, PHPCS.',
        'Dockerized environment with CI/CD pipelines (Git, GitLab, Jenkins).',
        'PHP version migrations and deprecation fixes.',
      ],
      stack: [
        'Symfony 4.4',
        'PHP 8.2',
        'Angular 9',
        'NgRx',
        'REST',
        'DDD',
        'CQRS',
        'Adyen',
        'Payline',
        'Auth0',
        'Redis',
        'Salesforce',
        'Vista',
        'PHPUnit',
        'Behat',
        'Jest',
        'PHPStan',
        'Docker',
        'GitLab',
        'Jenkins',
      ],
      accent: 'cyan',
    },
    {
      id: 'bouygues',
      role: 'Full Stack Developer',
      company: 'Bouygues Telecom Entreprises',
      location: 'Paris, France',
      period: 'Nov 2020 — Mar 2023',
      contextNote: 'Via Talan Tunisia from Nov 2020 to Sept 2021, then direct.',
      summary:
        'Customer incident ticketing suite for fixed, mobile and cloud lines, within a team of seven developers.',
      bullets: [
        'Developed within a team of 7 developers on a suite of customer incident ticketing applications (fixed/mobile/cloud lines).',
        'Built business features, designed and exposed REST web services.',
        'Production incident resolution and bug fixing.',
        'Unit testing, code review, and continuous code quality improvement.',
        'Rotating Scrum Master within the team.',
        'Client support and on-call activities (business hours / non-business hours).',
      ],
      stack: ['PHP', 'Symfony 3.4', 'Symfony 4.4', 'Zend', 'REST', 'Scrum'],
      accent: 'indigo',
    },
    {
      id: 'facnote',
      role: 'Web Developer — Freelance',
      company: 'Facnote',
      location: 'Remote',
      period: 'Nov 2020 — Aug 2021',
      summary:
        'Full-stack development within Groupe Facnote (accounting software publisher) on business applications.',
      bullets: [
        'Backend feature development (controllers, services, business logic).',
        'Frontend integration using Twig, JavaScript and jQuery.',
        'Design and implementation of monitoring and configuration interfaces.',
        'SQL query optimization, bug fixing, legacy code refactoring, and functional enhancements.',
      ],
      stack: ['Symfony', 'PHP', 'MySQL', 'Twig', 'JavaScript', 'jQuery'],
      accent: 'emerald',
    },
    {
      id: 'talan',
      role: 'Full-Stack Developer Symfony / Angular',
      company: 'Talan Tunisia',
      location: 'Tunis, Tunisia',
      period: 'Jan 2019 — Nov 2020',
      summary:
        'Two consecutive client missions delivering Symfony + Angular business platforms, with strong focus on REST APIs and frontend craft.',
      bullets: [
        'Continuous code quality improvement, code review, and unit testing across both missions.',
      ],
      stack: ['Symfony 4.4', 'Symfony 4', 'Angular 7', 'Angular', 'REST', 'TypeScript'],
      subRoles: [
        {
          client: 'Sagemcom',
          period: 'Dec 2019 — Nov 2020',
          bullets: [
            'Built from scratch (Symfony 4.4 / Angular 7) a purchase order publishing platform for production and non-production suppliers.',
            'Designed, developed, and exposed REST web services (backend).',
            'UI mockup integration, web service consumption, and feature development (frontend).',
          ],
        },
        {
          client: 'BNP Paribas',
          period: 'Jan 2019 — Dec 2019',
          bullets: [
            'Developed a platform for digitizing resource management supports, activities, and methodologies (Symfony 4 / Angular).',
            'Major frontend contribution: mockup integration, feature development, REST web service consumption.',
            'Continuous backend (API) code quality improvement.',
          ],
        },
      ],
      accent: 'amber',
    },
  ],
  skills: [
    {
      label: 'Backend',
      items: ['PHP 8.x', 'Symfony 3.4 / 4.4+', 'REST APIs', 'DDD', 'Hexagonal Architecture'],
    },
    {
      label: 'Frontend',
      items: ['Angular (2–9+)', 'NgRx', 'JavaScript / TypeScript', 'jQuery', 'HTML5', 'CSS3', 'Twig', 'Bootstrap'],
    },
    { label: 'Databases', items: ['MySQL', 'PostgreSQL', 'Redis'] },
    { label: 'DevOps / Tools', items: ['Docker', 'CI/CD', 'Git', 'GitLab', 'Jenkins', 'AWS', 'Apigee'] },
    { label: 'Testing / Quality', items: ['PHPUnit', 'Behat', 'Jest', 'PHPStan', 'PHPCS', 'Codeception'] },
    { label: 'Integrations', items: ['Adyen', 'Payline', 'Auth0', 'Salesforce', 'Vista', 'Redis'] },
    { label: 'Methodology', items: ['Agile / Scrum'] },
    { label: 'AI & Tools', items: ['Claude Code', 'Gemini', 'Codex', 'n8n'] },
  ],
  education: [
    {
      id: 'insat',
      degree: "Engineer's Degree in Industrial Chemistry",
      institution: 'National Institute of Applied Science and Technology (INSAT), Tunis',
      period: '2013 — 2018',
    },
    {
      id: 'bac',
      degree: "Bachelor's Degree in Mathematics",
      institution: 'Lycée Beni Khalled, Tunis',
      period: '2012',
      honors: 'With Highest Honors',
    },
    {
      id: 'bootcamp',
      degree: 'Intensive Full-Stack Web Development Training',
      institution: 'Talan Academy (12 weeks) & Go My Code (3 months)',
      period: '2018',
      honors: 'PHP/Symfony, Angular, JavaScript, MySQL, Git',
    },
  ],
  projects: [
    {
      name: 'Portfolio Landing Page',
      url: 'https://fares-khiary.com',
      description:
        'A modern, interactive portfolio featuring 3D graphics, an AI-powered chat assistant trained on my career, and a futuristic space theme. Fully mobile-friendly.',
      stack: ['React', 'Three.js', 'Framer Motion', 'Supabase', 'n8n', 'Hostinger VPS'],
    },
  ],
  languages: [
    { label: 'Arabic', level: 'Native' },
    { label: 'French', level: 'Professional' },
    { label: 'English', level: 'Professional' },
    { label: 'German', level: 'Basic' },
  ],
  certifications: ['Professional Scrum Master I (PSM I)', '20+ web development certifications'],
  interests: ['Game development', 'AI applications', 'Technical innovation'],
};
