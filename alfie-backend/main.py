from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import os

# Import your logic from the local file
from logic import successor_unlocker

app = FastAPI()

# 1. Setup CORS (Essential for local testing)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. API Routes
@app.post("/api/unlock")
async def unlock_nodes(data: dict):
    # This calls your GraphRAG logic
    matrix = data.get("matrix", {})
    edges = data.get("edges", [])
    updated_matrix, changed = successor_unlocker(matrix, edges)
    return {"updated_matrix": updated_matrix, "changed": changed}

# 3. Serve React Static Files
# This assumes your Dockerfile moved the 'dist' folder to '/app/static'
if os.path.exists("static"):
    app.mount("/assets", StaticFiles(directory="static/assets"), name="assets")

    @app.get("/{full_path:path}")
    async def serve_react_app(full_path: str):
        # Prevent API routes from being intercepted by the frontend router
        if full_path.startswith("api/"):
            return {"error": "API route not found"}
        return FileResponse("static/index.html")