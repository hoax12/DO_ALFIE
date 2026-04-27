# ALFIE: Algebra Knowledge Graph

**ALFIE** is an Intelligent Tutoring System (ITS) designed to guide students through complex mathematical curricula using a **State-Aware GraphRAG** architecture. This project leverages Directed Acyclic Graph (DAG) logic to manage learning dependencies, providing contextually grounded AI assistance and preventing cognitive overload.

---

## 🚀 Key Features

* **Interactive Knowledge Graph:** A dynamic, color-coded visualization of Algebra lessons built with **React Flow**. Nodes represent concepts (e.g., Quadratic Equations) and edges represent prerequisites.
* **State-Aware Learning Paths:** Implements a strict "locking/unlocking" mechanism. Students must master foundational concepts before the system grants access to advanced topics, governed by a custom backend state-machine.
* **GraphRAG Orchestration:** Unlike standard RAG systems, ALFIE uses the Knowledge Graph structure to ground AI responses. Retrieval is scoped to the student's current node, ensuring information is pedagogically appropriate.
* **Agentic Tutoring:** Integrated with the **DigitalOcean Agent Platform** via the **Gradient SDK**. The "Alfie" tutor provides explanations, answers questions, and facilitates active learning.
* **Automated Assessment:** Generates topic-specific quizzes. Passing a quiz triggers a backend state transition via a **successor-unlocker algorithm**, updating the student's mastery matrix in real-time.

---

## 🛠️ Technology Stack

### **Frontend**
* **Framework:** React (Vite)
* **Visualization:** React Flow
* **Styling:** Tailwind CSS (Modern Dark Mode)

### **Backend**
* **Framework:** FastAPI (Python 3.12)
* **AI Engine:** `gradientai` (DigitalOcean GenAI Platform)
* **Logic Engine:** Custom Python DAG orchestration and successor-unlocker logic.

### **Infrastructure & DevOps**
* **Deployment:** DigitalOcean App Platform (Monorepo architecture)
* **Containerization:** Multi-stage Docker builds
* **CI/CD:** Automated deployments via GitHub Actions

---

## 🏗️ System Architecture

1.  **UI Layer (React):** Manages the graph visualization and user interaction.
2.  **API Gateway (FastAPI):** Orchestrates communication between the frontend, the graph logic, and the AI agent.
3.  **Logical Layer (DAG):** Enforces prerequisites. A node remains `LOCKED` until all parent nodes are `MASTERED`.
4.  **Data Layer (Vector DB):** A DigitalOcean Knowledge Base containing indexed Algebra textbooks (PDFs).
5.  **Agent Layer:** A conversational LLM agent that performs RAG-based synthesis of mathematical concepts.

---

## 🔧 Installation & Setup

### **Backend**
1.  Navigate to `/backend`.
2.  Install dependencies: `pip install -r requirements.txt`.
3.  Configure Environment Variables (see below).
4.  Start server: `uvicorn main:app --host 0.0.0.0 --port 8080`.

### **Frontend**
1.  Navigate to `/frontend`.
2.  Install dependencies: `npm install`.
3.  Build assets: `npm run build`.
4.  The backend serves the `dist/` folder in production.

---

## 🔐 Environment Variables

The following secrets must be configured in the DigitalOcean App Platform Settings:

| Variable | Description |
| :--- | :--- |
| `GRADIENT_ACCESS_TOKEN` | API Token for the DigitalOcean GenAI Platform |
| `GRADIENT_WORKSPACE_ID` | DigitalOcean Workspace ID |
| `ALFIE_AGENT_ID` | The unique ID for the tutor agent |
| `KNOWLEDGE_BASE_ID` | ID of the indexed knowledge base |
| `AGENT_ENDPOINT` | The specialized agent inference endpoint |
| `GRADIENT_AGENT_ACCESS_KEY` | Access key for agent communication |

---

## 🎓 Academic Context
This project was developed as part of a Master's project in Computer Science at the **University of Southern California (USC)**. It explores the intersection of **Knowledge Representation**, **Generative AI**, and **Pedagogical Engineering**.

---

## 📜 License
Educational Project - USC MSCS.
