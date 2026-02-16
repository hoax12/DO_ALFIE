from fastapi import FastAPI
from logic import successor_unlocker
from pydantic import BaseModel

app = FastAPI()

class MasteryState(BaseModel):
    matrix: dict
    edges: list

@app.get("/")
def read_root():
    return {"status": "Alfie is online"}

@app.post("/unlock")
def unlock_nodes(state: MasteryState):
    updated_matrix, changed = successor_unlocker(state.matrix, state.edges)
    return {"updated_matrix": updated_matrix, "changed": changed}