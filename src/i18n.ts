export const profile = {
  name: 'Pray Somaldo',
  initials: 'PS',
  role: 'Lead AI Engineer',
  tagline: 'I build production LLM systems, RAG pipelines, and multi-agent workflows.',
  location: 'Jakarta, Indonesia',
  email: 'praysomaldo95@gmail.com',
  phone: '+62 82128660704',
  github: 'https://github.com/praysmld',
  linkedin: 'https://linkedin.com/in/praysomaldo',
  personalSite: 'https://prays.github.io',
  resume: '/Pray_Resume_14_April.pdf',
  currentCompany: 'Simplify',
}

export const hero = {
  eyebrow: 'Lead AI Engineer · Jakarta',
  title: 'Pray Somaldo',
  subtitle: 'I build production LLM systems, RAG pipelines, and multi-agent workflows.',
  description:
    "Currently leading a team of 15 AI engineers at Simplify building AI agents for the software development lifecycle. Seven years shipping LLM integrations, fine-tuning open models, and turning research into production infrastructure.",
  ctaPrimary: 'Get in touch',
  ctaSecondary: 'View experience',
}

export type Role = {
  company: string
  title: string
  location: string
  period: string
  highlights: string[]
  stack: string[]
}

export const experience: Role[] = [
  {
    company: 'Simplify',
    title: 'Lead AI Engineer',
    location: 'Jakarta, Indonesia',
    period: 'Jan 2026 – Now',
    highlights: [
      'Leading team of 15 AI engineers building AI agents that simplify the software development lifecycle.',
      'Managing stakeholder expectations around AI agent capabilities and delivery timelines.',
      'Architecting multi-agent workflows on LangChain + LangGraph.',
    ],
    stack: ['LangChain', 'LangGraph', 'LLMs', 'Multi-modal', 'Leadership'],
  },
  {
    company: 'PT SMART Tbk',
    title: 'AI Technical Lead',
    location: 'Jakarta, Indonesia',
    period: 'Nov 2025 – Jan 2026',
    highlights: [
      'Led 4-person team on computer vision for palm fruit quality assessment.',
      'Refactored loose-fruit detection codebase, cutting developer time by 30%.',
      'Automated deployment pipelines for CV model releases.',
    ],
    stack: ['Computer Vision', 'Python', 'MLOps', 'Team Leadership'],
  },
  {
    company: 'Links',
    title: 'AI Advisor (Part-time)',
    location: 'US remote',
    period: 'Nov 2025 – Now',
    highlights: [
      'Advise engineering teams on LLM selection, prompt strategy, and client expectations.',
      'Built AI agent systems with MCP (Model Context Protocol) server integration.',
    ],
    stack: ['LLMs', 'AI Agents', 'MCP', 'Prompt Engineering'],
  },
  {
    company: 'Polyrific',
    title: 'Senior AI Engineer',
    location: 'NY, US remote',
    period: 'Jul 2024 – Jun 2025',
    highlights: [
      'Integrated multiple LLM APIs (OpenAI, Groq, Mistral, Anthropic, Bedrock) with Gmail/Jira/Slack — 20% latency reduction.',
      'Built multi-modal conversational chatbot with podcast-style audio + image generation (Azure TTS, Flux).',
      'Designed agentic memory: session summarization + cross-session consolidation.',
      'Shipped PII protection using Microsoft Presidio before LLM calls.',
      'Researched open-source embeddings — 15% cost reduction without quality loss.',
    ],
    stack: ['TypeScript', 'Node.js', 'FastAPI', 'Milvus', 'PostgreSQL', 'Docker', 'Presidio', 'ollama', 'llamacpp'],
  },
  {
    company: 'GDP Labs',
    title: 'Sr. Machine Learning Engineer / Data Scientist',
    location: 'Jakarta, Indonesia',
    period: 'Jun 2021 – Jun 2024',
    highlights: [
      'Built on-premise RAG chatbots (LangChain, LlamaIndex, ChromaDB, Flask).',
      'Fine-tuned Llama2 and Mistral — 60% improvement on a bank project.',
      'Implemented NER for entity anonymization before LLM API calls.',
      'Advised AWS data analytics architecture and built MLOps on API Gateway + CloudWatch.',
      'Fine-tuned multilingual embeddings with Q&A datasets — 15% retrieval lift.',
      'Optimized LightGBM for ingredient prediction — 10% waste reduction.',
    ],
    stack: ['LangChain', 'LlamaIndex', 'ChromaDB', 'Elasticsearch', 'AWS', 'Docker', 'Kubernetes', 'RAG', 'Transformers', 'Grafana'],
  },
  {
    company: 'PT Sugihart Digital Imaji',
    title: 'Machine Learning Engineer',
    location: 'Duren Sawit, Indonesia',
    period: 'Aug 2019 – Jan 2021',
    highlights: [
      'Built real-time face recognition attendance system — <2s latency, 97%+ accuracy.',
      'Developed people density heatmap system for crowd visualization.',
    ],
    stack: ['OpenCV', 'TensorFlow', 'PyTorch', 'YOLO', 'TensorRT', 'DeepStream', 'ONNX'],
  },
  {
    company: 'Freelance / Various',
    title: 'Data Scientist',
    location: 'Indonesia',
    period: 'Oct 2017 – Feb 2021',
    highlights: [
      'Text ML model for news filtering — 95% accuracy.',
      'Data clustering for campaign segmentation (region, density, salary).',
      'NLP transformer for online course recommendation (Nanyang Technological University Singapore).',
    ],
    stack: ['AWS', 'Pandas', 'Docker', 'spaCy', 'SentenceTransformer'],
  },
]

export type SkillGroup = { label: string; items: string[] }

export const skills: SkillGroup[] = [
  {
    label: 'LLM / Agents',
    items: ['LangChain', 'LangGraph', 'LlamaIndex', 'MCP', 'Tool calling', 'Multi-agent orchestration', 'Prompt engineering'],
  },
  {
    label: 'LLM Providers',
    items: ['OpenAI', 'Anthropic (Claude)', 'Groq', 'Mistral', 'Amazon Bedrock', 'ollama', 'llama.cpp'],
  },
  {
    label: 'RAG & Vector Stores',
    items: ['Milvus', 'ChromaDB', 'pgvector', 'Elasticsearch', 'Embedding fine-tuning', 'Hybrid search'],
  },
  {
    label: 'Fine-tuning & Training',
    items: ['Llama2', 'Mistral', 'Multilingual embeddings', 'LoRA', 'PEFT'],
  },
  {
    label: 'Computer Vision',
    items: ['OpenCV', 'YOLO', 'Darknet', 'TensorRT', 'DeepStream', 'ONNX'],
  },
  {
    label: 'ML / Data',
    items: ['PyTorch', 'TensorFlow', 'scikit-learn', 'PySpark', 'LightGBM', 'MLflow', 'Pandas'],
  },
  {
    label: 'Cloud (AWS)',
    items: ['SageMaker', 'Glue', 'Athena', 'Lambda', 'API Gateway', 'QuickSight', 'RDS', 'S3'],
  },
  {
    label: 'Infra / MLOps',
    items: ['Docker', 'Kubernetes', 'FastAPI', 'Node.js', 'TypeScript', 'Grafana', 'CloudWatch'],
  },
]

export type Achievement = { label: string; detail: string }

export const achievements: Achievement[] = [
  { label: 'EasyOCR Open-Source Contributor', detail: 'JaidedAI/EasyOCR — 70+ language OCR library.' },
  { label: 'AWS ML Engineer – Associate', detail: 'Certified Oct 2025.' },
  { label: 'Best Employee @ GDP Labs', detail: 'Out of 70+ employees (Aug 2022).' },
  { label: 'Top 10 — Shopee National DS Competition', detail: 'Product matching, advanced category (Nov 2020, 139 teams).' },
  { label: 'Mentor @ Garuda Hacks', detail: "Mentored 52 teams at Indonesia's premier hackathon (Jul 2023)." },
  { label: 'Advisor @ Bangkit', detail: 'Google/GoTo/Traveloka bootcamp — 3 teams (Jun 2023).' },
  { label: 'Udacity CV Nanodegree', detail: 'Computer Vision Nanodegree (Jul 2020).' },
  { label: 'MSc Computer Science', detail: 'University of Indonesia (2019–2021).' },
]

export const nav = {
  home: 'Home',
  about: 'About',
  experience: 'Experience',
  skills: 'Skills',
  contact: 'Contact',
}

export const footer = {
  built: 'Built with React 19 + Vite + Tailwind · Claude Code',
  rights: `© ${new Date().getFullYear()} Pray Somaldo`,
}
