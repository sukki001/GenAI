# 🧠 GenAI RAG Playground

A hands-on project exploring **Retrieval-Augmented Generation (RAG)** and **AI agent workflows** by building real systems from first principles.

This repository focuses on **how GenAI systems actually work internally**, not just on generating responses.

---

## 🚀 What This Project Does

### 📄 Document Indexing (Ingestion Pipeline)
- Loads PDF documents
- Splits them into semantic chunks
- Generates vector embeddings
- Stores them in Pinecone for retrieval

### 💬 Conversational RAG Query Engine
- Accepts user questions via CLI
- Rewrites follow-up queries into standalone questions
- Retrieves relevant document chunks
- Generates answers **strictly grounded in retrieved context**
- Avoids hallucinations when answers are not present

### 🧪 Experimental AI Agent Work
- Explores autonomous agents that plan and execute shell commands
- Inspired by tools like Cursor and Copilot Workspace
- Focused on understanding **tool usage, determinism, and control**

---


## 🛠️ Tech Stack

- **Node.js (ES Modules)**
- **Google Gemini API** (LLM & embeddings)
- **Pinecone** (vector database)
- **LangChain utilities**
- **PDF loaders & text splitters**
- **CLI-based interaction**

> The architecture is model-agnostic and can be adapted to OpenAI, DeepSeek, or local LLMs.

---


## 🧠 System Architecture

### 🔹 RAG Pipeline Architecture

```text
User Query
    │
    ▼
Query Rewriting (LLM)
    │
    ▼
Query Embedding
    │
    ▼
Vector Search (Pinecone)
    │
    ▼
Relevant Document Chunks
    │
    ▼
Context-Grounded Answer (LLM)



