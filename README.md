# MedMother AI

**A production-grade medical education and reporting platform grounded in uploaded textbook content.**

> Answers come exclusively from retrieved textbook passages, with exact page references, figure citations, and chapter sources.

## Live Demo

https://drarnabjyotide.github.io

---

## Features

### Core Architecture: RAG (Retrieval-Augmented Generation)
- All answers grounded in uploaded textbook content
- Source citations with page numbers, figures, and chapter references
- Multiple textbooks can be selected as context simultaneously

### Chat Modes
| Mode | Description |
|------|-------------|
| **Explain Topic** | Deep explanation with citations from indexed textbooks |
| **Study Mode** | Structured notes, key points, and summaries |
| **Flashcards** | Auto-generated spaced-repetition flashcards |
| **Comparison Chart** | Side-by-side differential diagnosis tables |
| **Exam Revision** | High-yield MCQ-style Q&A |
| **Diagram Builder** | Concept maps and flowcharts from textbook content |
| **Case Assistant** | DDx, investigations, and management from clinical case |

### Pages
- **Dashboard** — Progress, stats, recent chats, quick actions
- **Medical Library** — Upload and manage textbooks, select context
- **Book Viewer** — Chapter index, figure gallery, book metadata
- **Chat** — Full RAG chat with 7 modes and citation cards
- **Study Center** — Generate study sessions with key points, mnemonics
- **Flashcard Center** — Spaced repetition with SM-2 algorithm
- **Diagram Center** — Visual concept maps from medical topics
- **USG Report Generator** — Structured reports with 10 templates
- **Case Assistant** — DDx tables, investigations, management steps
- **Obsidian Export** — Export to Markdown with YAML frontmatter + backlinks
- **Settings** — Profile, theme, integrations, security
- **Admin Upload** — Book upload with OCR/chunking/indexing pipeline

### USG Report Templates
- Obstetric — 1st Trimester
- Obstetric — 2nd/3rd Trimester
- Gynecological (Pelvic)
- Abdominal
- Thyroid & Parathyroid
- Breast (BIRADS)
- Scrotal
- Musculoskeletal
- Vascular (Doppler)
- Renal & Urinary Tract

---

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with dark mode
- **State**: Zustand with localStorage persistence
- **Routing**: React Router v6
- **PWA**: Service Worker + Web App Manifest
- **Export**: Obsidian-compatible Markdown with YAML frontmatter

## Integration Placeholders

| Service | Purpose | Status |
|---------|---------|--------|
| Anthropic Claude / OpenAI | LLM for generation | Placeholder |
| ChromaDB / Pinecone | Vector database | Placeholder |
| AWS Textract / Tesseract | OCR for image-based PDFs | Placeholder |
| PyMuPDF | PDF parsing | Placeholder |

---

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

---

## Target Users

- Doctors & Residents
- Medical Students
- Radiologists & Sonologists

---

## Clinical Disclaimer

MedMother AI is an **educational tool only**. All AI-generated content, including USG reports and case analyses, must be reviewed by a qualified clinician before clinical use. This platform is not a diagnostic tool and does not replace clinical judgement.
