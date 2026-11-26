import { LIVE_CONFIG } from '../config';

export interface CaseStudy {
  id: string;
  number: string;
  client: string;
  title: string;
  summary: string;
  context: string;
  contribution: string[];
  flowTitle: string;
  flow: string[];
  technologies: string[];
  outcome: string;
  notes?: string;
}

export interface ExperienceItem {
  id: string;
  dates: string;
  location: string;
  role: string;
  company: string;
  description: string;
  technologies: string[];
  caseStudyId?: string;
  caseStudyLabel?: string;
}

export interface SkillGroup {
  id: string;
  label: string;
  items: string;
  note?: string;
}

export interface EducationItem {
  id: string;
  kind: 'Education' | 'Certification';
  dates: string;
  title: string;
  detail: string;
}

/** Public contact address (a forwarding alias). Set it in config.ts; empty means none is shown. */
export const EMAIL = LIVE_CONFIG.contact.email;
export const LINKEDIN_URL = 'https://www.linkedin.com/in/yahya-berbeche';
export const GITHUB_URL = 'https://github.com/yberbec';

export const ABOUT_PARAGRAPHS = [
  "I'm a software engineer based in Montréal, Canada, with 7 years of experience delivering enterprise software for international e-commerce and Canadian retail environments.",
  "I've worked across both Build and Production teams: designing integrations and microservices, improving code quality, monitoring live systems and collaborating with distributed, cross-functional teams. My core expertise is Java and Spring, complemented by frontend experience with Angular and TypeScript."
];

export const LANGUAGES_NOTE = 'French & English · Canadian Permanent Resident · Authorized to work in Canada';

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'fresh-data',
    number: '01',
    client: 'NESPRESSO · SQLI DIGITAL EXPERIENCE',
    title: 'Fresh-data integration APIs',
    summary: 'REST APIs for data ingestion and transmission to Adobe Experience Platform, built around a client-defined schema.',
    context: 'The Fresh-data workstream handled data ingestion and transmission to Adobe Experience Platform. The integration had to follow a strict schema defined by the client while keeping synchronization and performance observable.',
    contribution: [
      'Designed and developed REST APIs for data ingestion and transmission.',
      'Implemented the client-defined data schema in the integration flow.',
      'Worked on latency optimizations and asynchronous data synchronization.',
      'Added detailed performance monitoring using Grafana.'
    ],
    flowTitle: 'Integration flow',
    flow: ['Incoming data', 'REST API', 'Client schema mapping', 'Asynchronous synchronization', 'Adobe Experience Platform'],
    technologies: ['Java', 'Spring Boot', 'REST APIs', 'Microservices', 'Adobe Experience Platform', 'Grafana'],
    outcome: 'Delivered an API-based integration with asynchronous synchronization, latency improvements and performance monitoring.',
    notes: 'The CV does not specify exact throughput, latency figures or the underlying messaging technology, so these are intentionally not claimed.'
  },
  {
    id: 'pickup-points',
    number: '02',
    client: 'NESPRESSO · SQLI DIGITAL EXPERIENCE',
    title: 'Pickup points microservice',
    summary: 'Connected an external provider REST API to Nespresso’s existing pickup-point import process.',
    context: 'The pickup-point integration consumed data from an external provider and transformed it into the format expected by Nespresso’s internal applications.',
    contribution: [
      'Developed a microservice that consumes the external provider’s REST API.',
      'Mapped the provider response to Nespresso’s internal data format.',
      'Integrated the transformed data with the existing pickup-point-import application.',
      'The existing import application handled persistence in the database.'
    ],
    flowTitle: 'Data import flow',
    flow: ['External provider', 'Provider REST API', 'Microservice & data mapping', 'Pickup-point import application', 'Database'],
    technologies: ['Java', 'Spring', 'REST APIs', 'Microservices', 'Data mapping', 'SQL'],
    outcome: 'Connected an external data provider to the existing Nespresso import and database-persistence process.'
  },
  {
    id: 'ratings-reviews',
    number: '03',
    client: 'NESPRESSO · SQLI DIGITAL EXPERIENCE',
    title: 'Ratings & reviews platform migration',
    summary: 'Adapted backend microservices during the migration from Sprinklr to Bazaarvoice.',
    context: 'Nespresso’s customer ratings and reviews solution moved from Sprinklr to Bazaarvoice. The backend services needed to be adapted to remain compatible with the new platform.',
    contribution: [
      'Worked on microservices responsible for customer ratings and reviews.',
      'Adapted backend integrations as part of the Sprinklr-to-Bazaarvoice migration.',
      'Supported compatibility between the existing services and the new platform.'
    ],
    flowTitle: 'Platform transition',
    flow: ['Existing ratings & reviews services', 'Backend microservice adaptation', 'Bazaarvoice platform'],
    technologies: ['Java', 'Spring Boot', 'REST APIs', 'Microservices', 'Sprinklr', 'Bazaarvoice'],
    outcome: 'Contributed to the platform migration by adapting the backend microservices for the new ratings and reviews provider.'
  },
  {
    id: 'metro-foundation',
    number: '04',
    client: 'METRO INC. · TINK PROFITABILITÉ NUMÉRIQUE',
    title: 'Foundation shared application architecture',
    summary: 'Contributed to a shared architecture for Metro, Super C and Food Basics while preserving banner-specific extensions.',
    context: 'The Metro project covered a multi-brand application ecosystem including Metro, Super C, Food Basics, Jean Coutu and the Moi Rewards loyalty program. Within that ecosystem, Foundation was a shared architecture initiative focused on centralizing and standardizing code across Metro, Super C and Food Basics.',
    contribution: [
      'Contributed to the integration of the Foundation project within the application ecosystem.',
      'Worked with a shared codebase while maintaining banner-specific customizations and extensions.',
      'Supported application stability through production and non-production bug analysis and fixes.',
      'Collaborated with development, QA, DevOps, analysts and support teams in an Agile environment.'
    ],
    flowTitle: 'Shared architecture concept',
    flow: ['Metro', 'Super C', 'Food Basics', 'Foundation shared code', 'Banner-specific customizations & extensions'],
    technologies: ['Java', 'Spring Boot', 'Spring Security', 'Spring Data', 'JEE', 'REST APIs', 'Jenkins', 'SonarQube', 'Maven', 'JUnit', 'Mockito', 'Grafana', 'Graylog'],
    outcome: 'Contributed to code centralization and standardization across three grocery banners while retaining their specific customizations.',
    notes: 'Foundation is described here only for Metro, Super C and Food Basics. Jean Coutu and Moi Rewards are part of the broader application ecosystem, not presented as Foundation consumers.'
  },
  {
    id: 'quality-reliability',
    number: '05',
    client: 'NESPRESSO · BUILD & PRODUCTION TEAMS',
    title: 'Code quality & production reliability',
    summary: 'Combined legacy-code refactoring, unit testing, monitoring and production incident response.',
    context: 'Alongside feature development, the Nespresso work included Build and Production responsibilities focused on service reliability and maintainability.',
    contribution: [
      'Refactored legacy code and implemented unit tests.',
      'Contributed to a reported 30% reduction in bugs.',
      'Analyzed production logs with Kibana and monitored services with Grafana.',
      'Managed incidents through ServiceNow and participated in on-call rotations.',
      'Supported continuous integration, monitoring and production issue resolution.'
    ],
    flowTitle: 'Reliability workflow',
    flow: ['Production signals & logs', 'Kibana / Grafana analysis', 'Incident investigation', 'Fixes & unit tests', 'Service stability'],
    technologies: ['Java', 'Spring', 'JUnit', 'Mockito', 'TDD', 'Jenkins', 'Kibana', 'Grafana', 'ServiceNow'],
    outcome: 'The CV reports a 30% reduction in bugs from legacy-code refactoring and unit-test implementation. Production work also included monitoring, incident resolution and on-call support.'
  }
];

export const PERSONAL_PROJECT = {
  id: 'job-scraper',
  repo: 'job-scraping',
  title: 'Job scraping application',
  description: 'A personal backend application that collects job listings, processes search results and exports them for analysis.',
  technologies: ['Spring Boot', 'PostgreSQL', 'Docker']
};

export const EXPERIENCE: ExperienceItem[] = [
  {
    id: 'tink-metro',
    dates: 'OCT 2025 — JUN 2026',
    location: 'MONTRÉAL, QC',
    role: 'Software Developer',
    company: 'Tink · Metro project',
    description: 'Worked in the Build team on the Metro Inc. application ecosystem: Metro, Super C, Food Basics, Jean Coutu and Moi Rewards. Contributed to Foundation, a shared architecture for common code across grocery banners, and handled production and non-production fixes with development, QA, DevOps, analysts and support teams.',
    technologies: ['Java', 'Spring Boot', 'Spring Security', 'JEE', 'REST APIs', 'Jenkins', 'SonarQube', 'JUnit', 'Mockito', 'Graylog', 'Grafana'],
    caseStudyId: 'metro-foundation',
    caseStudyLabel: 'Explore the Foundation case study'
  },
  {
    id: 'sqli-nespresso',
    dates: 'FEB 2019 — OCT 2025',
    location: 'RABAT, MOROCCO',
    role: 'Software Developer',
    company: 'SQLI · Nespresso project',
    description: "Worked across Build and Production teams on Nespresso's e-commerce microservices. Delivered pickup-point, ratings/reviews and Adobe Experience Platform integrations; refactored legacy code and implemented unit tests, contributing to a reported 30% reduction in bugs. Also supported production through monitoring, incident management and on-call rotations.",
    technologies: ['Java', 'Spring Boot', 'Microservices', 'REST', 'SOAP', 'Docker', 'Jenkins', 'Kibana', 'Grafana', 'ServiceNow', 'TDD'],
    caseStudyId: 'quality-reliability',
    caseStudyLabel: 'Explore code quality & production work'
  }
];

export const SKILLS: SkillGroup[] = [
  { id: 'backend', label: 'BACKEND', items: 'Java · Java EE · Spring IoC · Spring Boot · Spring Security · Spring Data · JSP · Servlets · EJB · JDBC · Hibernate · REST · SOAP · Microservices' },
  { id: 'frontend', label: 'FRONTEND', items: 'TypeScript · JavaScript · Angular · HTML · CSS' },
  { id: 'databases', label: 'DATABASES', items: 'Oracle · Microsoft SQL Server · MySQL · Access · PostgreSQL (personal project)' },
  { id: 'tools', label: 'TOOLS & DELIVERY', items: 'Git · Bitbucket · Maven · Jenkins · Docker · SonarQube · JUnit · Mockito · Tomcat · Jira · ServiceNow' },
  { id: 'monitoring', label: 'MONITORING & VISUALIZATION', items: 'Kibana · Grafana' },
  { id: 'cloud', label: 'CLOUD', items: 'AWS · EC2 · S3 · IAM · RDS · VPC · CloudWatch · Lambda · API Gateway', note: 'Cloud technologies listed in my technical skills.' }
];

export const EDUCATION: EducationItem[] = [
  { id: 'master', kind: 'Education', dates: '2019 — 2021', title: "Master's Degree · Software Quality", detail: 'Faculty of Sciences, University of Fez · Morocco' },
  { id: 'bachelor', kind: 'Education', dates: '2015 — 2019', title: "Bachelor's Degree · Mathematics & Computer Science", detail: 'Faculty of Sciences, University of Fez · Morocco' },
  { id: 'oracle-java', kind: 'Certification', dates: '2024', title: 'Oracle Certified Professional', detail: 'Java SE 17 Developer' },
  { id: 'scrum-psd', kind: 'Certification', dates: '2024', title: 'Professional Scrum Developer I', detail: 'Scrum.org certification' }
];
