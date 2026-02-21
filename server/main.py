# server/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List
import numpy as np
import os

from aggregator import RobustAggregator
from database import AsyncDatabase

app = FastAPI()

# Allow Next.js dashboard to talk to FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Real Database and Aggregator
db = AsyncDatabase("asyncshield.db")
aggregator = RobustAggregator()

global_model_weights = np.zeros(100000) 
global_version = 1

class UpdatePayload(BaseModel):
    client_id: str
    client_version: int
    weights_delta: List[float] 
    accuracy_improvement: float

@app.get("/download_architecture")
def download_architecture():
    """Allows autonomous clients to download the PyTorch model architecture on the fly."""
    file_path = "models.py"
    if os.path.exists(file_path):
        return FileResponse(file_path, media_type="text/x-python", filename="models.py")
    return {"error": "Architecture file not found on server."}

@app.get("/get_model")
def get_model():
    return {
        "version": global_version,
        "message": "Model ready for download"
    }

@app.post("/submit_update")
def submit_update(payload: UpdatePayload):
    global global_model_weights, global_version
    
    # 1. Evaluate accuracy (The Win Condition)
    if payload.accuracy_improvement < -0.05:
        db.add_commit(
            client_id=payload.client_id,
            status="Rejected ❌",
            reason="Data Poisoning / Poor Accuracy Detected",
            version_bump="None",
            bounty=0
        )
        return {"status": "rejected", "message": "Update failed accuracy checks."}

    # 2. Process via Aggregator
    client_weights = np.array(payload.weights_delta)
    global_model_weights = aggregator.apply_update(
        w_old=global_model_weights,
        w_client=client_weights,
        global_vers=global_version,
        client_vers=payload.client_version
    )
    
    # 3. Accept Update & Pay Bounty
    old_version = global_version
    global_version += 1
    bounty_earned = max(0, int(payload.accuracy_improvement * 1000))
    
    db.add_commit(
        client_id=payload.client_id,
        status="Merged ✅",
        reason=f"Improved accuracy by {payload.accuracy_improvement:.3f}",
        version_bump=f"v{old_version} -> v{global_version}",
        bounty=bounty_earned
    )

    return {"status": "success", "bounty_earned": bounty_earned, "new_version": global_version}

@app.get("/dashboard_data")
def get_dashboard_data():
    """Endpoint for Next.js frontend to fetch live data from SQLite."""
    return {
        "global_version": global_version,
        **db.get_dashboard_data()
    }