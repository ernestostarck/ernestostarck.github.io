export interface ProjectCase {
  title?: string;
  summary?: string;
  context?: string;
  problem?: string;
  solution?: string;
  decisions?: string;
  impact?: string;
}

type Localized = { es: ProjectCase; en: ProjectCase };

// Texto curado por repositorio (clave = nombre en GitHub). Lo que no esté aquí
// se toma automáticamente del README / descripción del repositorio.
export const PROJECT_CATEGORIES: Record<string, string> = {
  'market-insight': 'data',
  'zenith-flow': 'software',
  'meddecide-cdss': 'ai',
  'automation-pipeline': 'automation',
  'sistema-reuniones-tutorias': 'automation',
};

export const PROJECT_CASES: Record<string, Localized> = {
  'market-insight': {
    es: {
      title: 'MercadoInsight',
      summary: 'Plataforma de inteligencia de mercado sobre datos de compras públicas de ChileCompra.',
      problem: 'La información de Mercado Público requiere procesamiento y análisis para identificar tendencias, oportunidades comerciales y comportamiento de los compradores.',
      solution: 'Plataforma que transforma datos de compras públicas en información estructurada para apoyar decisiones comerciales.',
    },
    en: {
      title: 'MercadoInsight',
      summary: 'Market intelligence platform built on ChileCompra public procurement data.',
      problem: 'Public procurement data needs processing and analysis to spot trends, business opportunities and buyer behavior.',
      solution: 'A platform that turns public procurement data into structured information to support commercial decisions.',
    },
  },
  'zenith-flow': {
    es: {
      title: 'Zenith Flow',
      summary: 'Aplicación web de productividad con tablero Kanban y persistencia local con IndexedDB.',
      context: 'Interfaz oscura con enfoque glassmorphism para organizar tareas personales y de equipo.',
      problem: 'Necesidad de una base de productividad que permita seguir trabajo, prioridades y estado sin depender de servicios externos.',
      solution: 'Tablero Kanban con arrastrar y soltar, métricas visuales, búsqueda y filtrado por prioridad, y editor de tareas con checklist.',
      decisions: 'React 18 con Vite, React Bootstrap e IndexedDB para persistencia local en el navegador.',
      impact: 'Seguimiento más rápido de tareas y datos guardados localmente, sin base de datos remota.',
    },
    en: {
      title: 'Zenith Flow',
      summary: 'Productivity web app with a Kanban board and local persistence using IndexedDB.',
      context: 'Dark glassmorphism interface to organize personal and team tasks.',
      problem: 'A productivity base was needed to track work, priorities and status without relying on external services.',
      solution: 'Drag-and-drop Kanban board, visual metrics, search and priority filters, and a task editor with checklists.',
      decisions: 'React 18 with Vite, React Bootstrap and IndexedDB for local in-browser persistence.',
      impact: 'Faster task tracking and locally stored data, with no remote database.',
    },
  },
  'meddecide-cdss': {
    es: {
      title: 'MedDecide DSS',
      summary: 'Sistema de soporte a decisiones clínicas con Next.js y rutas API serverless.',
      context: 'Demo educativa de un flujo clínico para triaje, diagnóstico diferencial e interacciones farmacológicas.',
      problem: 'Mostrar cómo un panel clínico puede priorizar pacientes, calcular puntajes rápidos y resumir hallazgos sin infraestructura pesada.',
      solution: 'Dashboard con cola de pacientes, calculadoras qSOFA, CURB-65 y CHA2DS2-VASc, y endpoints serverless sobre una base de conocimiento local.',
      decisions: 'Next.js con App Router, API Routes y visualización SVG manual para la distribución de triaje.',
      impact: 'Reglas clínicas visibles y arquitectura fácil de extender con persistencia o autenticación.',
    },
    en: {
      title: 'MedDecide DSS',
      summary: 'Clinical decision support system built with Next.js and serverless API routes.',
      context: 'Educational demo of a clinical flow for triage, differential diagnosis and drug interactions.',
      problem: 'Show how a clinical panel can prioritize patients, compute quick scores and summarize findings without heavy infrastructure.',
      solution: 'Dashboard with a patient queue, qSOFA, CURB-65 and CHA2DS2-VASc calculators, and serverless endpoints over a local knowledge base.',
      decisions: 'Next.js App Router, API Routes and a hand-built SVG chart for triage distribution.',
      impact: 'Visible clinical rules and an architecture easy to extend with persistence or authentication.',
    },
  },
  'automation-pipeline': {
    es: {
      title: 'SheetFlow Automation Hub',
      summary: 'Plataforma fullstack para automatizar el procesamiento de planillas XLSX con trazabilidad.',
      context: 'Operación con planillas heterogéneas desde upload directo y URLs remotas (OneDrive, SharePoint, Google Sheets).',
      problem: 'Flujo manual frágil, baja observabilidad y dificultad para repetir resultados entre empresas.',
      solution: 'Endpoint único de ejecución con backend Node como orquestador y motor Python para la lógica de negocio.',
      decisions: 'Separación estricta Frontend/API/Python y persistencia de corridas en PostgreSQL.',
      impact: 'Procesamiento repetible y auditable, con base preparada para escalar a colas asíncronas.',
    },
    en: {
      title: 'SheetFlow Automation Hub',
      summary: 'Fullstack platform that automates XLSX spreadsheet processing with traceability.',
      context: 'Operation with heterogeneous spreadsheets from direct uploads and remote URLs (OneDrive, SharePoint, Google Sheets).',
      problem: 'Fragile manual flow, low observability and difficulty repeating results across companies.',
      solution: 'A single run endpoint, with a Node backend as orchestrator and a Python engine for business logic.',
      decisions: 'Strict Frontend/API/Python separation and run persistence in PostgreSQL.',
      impact: 'Repeatable, auditable processing, ready to scale to asynchronous queues.',
    },
  },
  'sistema-reuniones-tutorias': {
    es: {
      title: 'Sistema de Reuniones – Tutorías UFT',
      summary: 'Aplicación web en Google Apps Script para agendar reuniones con Google Meet.',
      context: 'Coordinación manual de tutorías con poca trazabilidad y alta fricción operativa.',
      problem: 'Agendamientos fuera de reglas (feriados, fines de semana, bloques no válidos) y riesgo de desorden en reservas.',
      solution: 'Routing por rol, disponibilidad en Google Sheets, bloqueo de concurrencia con LockService y eventos con Google Meet.',
      decisions: 'Arquitectura server-side en Apps Script por despliegue rápido, bajo costo y adopción inmediata.',
    },
    en: {
      title: 'Meeting System – UFT Tutoring',
      summary: 'Google Apps Script web app to schedule meetings with Google Meet.',
      context: 'Manual tutoring coordination with little traceability and high operational friction.',
      problem: 'Bookings outside the rules (holidays, weekends, invalid blocks) and a risk of disorderly reservations.',
      solution: 'Role-based routing, availability in Google Sheets, concurrency locking with LockService and Google Meet events.',
      decisions: 'Server-side Apps Script architecture for fast deployment, low cost and immediate adoption.',
    },
  },
};
