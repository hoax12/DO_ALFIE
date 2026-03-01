import os
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from gradient import Gradient

# Import your local graph logic
from logic import successor_unlocker

app = FastAPI()

# --- 1. Centralized SDK Configuration ---
# We initialize the client once at startup rather than inside functions
GRADIENT_TOKEN = os.getenv("GRADIENT_ACCESS_TOKEN")
WORKSPACE_ID = os.getenv("GRADIENT_WORKSPACE_ID")
AGENT_ACCESS_KEY = os.getenv("AGENT_ID")
AGENT_ENDPOINT = os.getenv("AGENT_ENDPOINT")
KB_ID = os.getenv("KNOWLEDGE_BASE_ID") # Add this to your DO Env Vars

# Global Gradient Client
client = Gradient(
    access_token=GRADIENT_TOKEN,
    workspace_id=WORKSPACE_ID
)

# Shared Agent Client for chat
agent_client = Gradient(
    agent_access_key=AGENT_ACCESS_KEY,
    agent_endpoint=AGENT_ENDPOINT
)

# --- 2. Middleware ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 3. API Routes ---

@app.post("/api/unlock")
async def unlock_nodes(data: dict):
    """Updates the Mastery Matrix based on the dependency graph."""
    matrix = data.get("matrix", {})
    edges = data.get("edges", [])
    updated_matrix, changed = successor_unlocker(matrix, edges)
    return {"updated_matrix": updated_matrix, "changed": changed}

@app.post("/api/ask")
async def ask_alfie(query_data: dict):
    """Directly chats with the Alfie1 Agent using your 4 Algebra PDFs."""
    try:
        # Using the Agent ID from your screenshot
        alfie = agent_client.agents.get(AGENT_ACCESS_KEY)
        response = alfie.chat(message=query_data['text'])
        return {"answer": response.message}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/explain")
async def explain_topic(data: dict):
    """Special route for RAG-based explanations from the Knowledge Base."""
    try:
        kb = client.knowledge_bases.get(KB_ID)
        topic = data.get("topic")
        node_id = data.get("node_id")
        
        result = kb.query(query=f"Explain {topic} in the context of Algebra Lesson {node_id}")
        return {"explanation": result.answer}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- 4. Static File Serving (Monorepo Production) ---
if os.path.exists("static"):
    app.mount("/assets", StaticFiles(directory="static/assets"), name="assets")

    @app.get("/{full_path:path}")
    async def serve_react_app(full_path: str):
        if full_path.startswith("api/"):
            return {"error": "API route not found"}
        return FileResponse("static/index.html")