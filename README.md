# CodeReview AI — LLM-Powered Code Review Assistant

An AI-powered code review tool that analyzes pull requests and code snippets for **security vulnerabilities**, **style issues**, **performance bottlenecks**, and **bugs** using LangChain, GPT-4o, and a full React + TypeScript dashboard.

##  Features

- **AI Code Analysis** — GPT-4o via LangChain chains analyzes code for security, style, performance, and bugs
- **Real-time Dashboard** — Recharts-powered analytics showing review stats, acceptance rates, issue breakdowns
- **Multi-language Support** — TypeScript, JavaScript, Python, Go, Rust, Java, and more
- **Issue Severity System** — Critical / High / Medium / Low / Info with expandable details and fix suggestions
- **Review History** — Browse past reviews with filtering and detailed drill-down
- **Docker Ready** — Full containerization with Docker Compose for one-command deployment

## Tech Stack

| Layer | Technology |
|-------|-----------|
| AI/LLM | LangChain + OpenAI GPT-4o |
| Backend | Node.js + Express + TypeScript |
| Frontend | React 18 + TypeScript + Vite |
| Charts | Recharts |
| Styling | Tailwind CSS |
| HTTP Client | Axios + TanStack Query |
| Validation | Zod |
| Container | Docker + Docker Compose |



##  How It Works

1. User pastes code into the dashboard and selects review type(s)
2. Frontend POSTs to `/api/reviews` with code + metadata
3. Backend builds a LangChain `RunnableSequence`: `ChatPromptTemplate → ChatOpenAI (GPT-4o) → StringOutputParser`
4. GPT-4o returns structured JSON with issues, severity, suggestions, and a quality score
5. Results are stored in-memory and returned to the frontend
6. React dashboard renders issues with expandable cards, severity badges, and code snippets
7. User can accept reviews; stats update in the dashboard
