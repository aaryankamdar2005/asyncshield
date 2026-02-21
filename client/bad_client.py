import requests
import numpy as np
import uuid
import time

# Configuration
SERVER_URL = "http://localhost:8000"
CLIENT_ID = f"malicious-node-{uuid.uuid4().hex[:4]}"
WEIGHT_SIZE = 500000 # Must match the Server's standardized size

def get_server_state():
    """Fetch current model version from server."""
    try:
        response = requests.get(f"{SERVER_URL}/get_model")
        return response.json()
    except Exception as e:
        print(f"[{CLIENT_ID}] Error connecting to server: {e}")
        return None

def submit_malicious_update(garbage_delta, current_version):
    """Attempt to push garbage weights to the server."""
    payload = {
        "client_id": CLIENT_ID,
        "client_version": current_version,
        "weights_delta": garbage_delta.tolist() # Sending raw random numbers
    }
    
    print(f"[{CLIENT_ID}] Attempting to poison model v{current_version}...")
    try:
        start_time = time.time()
        res = requests.post(f"{SERVER_URL}/submit_update", json=payload)
        duration = time.time() - start_time
        
        print(f"[{CLIENT_ID}] Server responded in {duration:.2f}s")
        return res.json()
    except Exception as e:
        print(f"[{CLIENT_ID}] Submission failed: {e}")
        return None

def run_attack():
    print(f"--- Starting Malicious Client: {CLIENT_ID} ---")
    
    # 1. Get the current state
    state = get_server_state()
    if not state:
        return
    
    current_v = state['version']
    print(f"[{CLIENT_ID}] Targeting Global Model Version: {current_v}")

    # 2. Generate "Poison" Weights
    # Instead of training, we generate high-variance random noise
    # to try and destroy the model's intelligence.
    print(f"[{CLIENT_ID}] Generating malicious weight delta...")
    garbage_delta = np.random.uniform(-1, 1, size=WEIGHT_SIZE)

    # 3. Submit the attack
    response = submit_malicious_update(garbage_delta, current_v)

    # 4. Analyze Server Reaction
    if response:
        if response.get("status") == "rejected":
            print(f"[{CLIENT_ID}] ATTACK FAILED ❌")
            print(f"[{CLIENT_ID}] Server Reason: {response.get('message')}")
            print(f"[{CLIENT_ID}] Bounty Earned: 0 (Zero-Trust caught us!)")
        else:
            print(f"[{CLIENT_ID}] ATTACK SUCCESSFUL ✅ (This shouldn't happen if Zero-Trust is working!)")
            print(f"[{CLIENT_ID}] Bounty Earned: {response.get('bounty_earned')}")

if __name__ == "__main__":
    run_attack()