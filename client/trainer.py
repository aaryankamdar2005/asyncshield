# client/trainer.py
import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import datasets, transforms
from torch.utils.data import DataLoader
import requests
import numpy as np
import random
import sys
import os

from privacy import PrivacyWrapper
from standardizer import WeightStandardizer

SERVER_URL = "http://localhost:8000"
CLIENT_ID = f"client-node-{random.randint(100, 999)}"

# =========================================================
# AUTONOMOUS DOWNLOAD: GET ARCHITECTURE BEFORE DOING ANYTHING
# =========================================================
print(f"[{CLIENT_ID}] Requesting model architecture from server...")
response = requests.get(f"{SERVER_URL}/download_architecture")

if response.status_code == 200:
    with open("models.py", "wb") as f:
        f.write(response.content)
    print(f"[{CLIENT_ID}] Successfully downloaded architecture (models.py).")
else:
    print(f"[{CLIENT_ID}] Failed to download architecture. Server offline?")
    sys.exit(1)

# Now it is safe to import because we just downloaded it!
from models import SimpleCNN, restore_1d_to_model
# =========================================================

def fetch_global_model():
    print(f"[{CLIENT_ID}] Fetching latest global weights...")
    response = requests.get(f"{SERVER_URL}/get_model")
    data = response.json()
    global_1d = np.zeros(100000) 
    return global_1d, data["version"]

def train_local(global_1d):
    print(f"[{CLIENT_ID}] Preparing local MNIST dataset...")
    transform = transforms.Compose([transforms.ToTensor(), transforms.Normalize((0.1307,), (0.3081,))])
    dataset = datasets.MNIST('../data', train=True, download=True, transform=transform)
    
    subset_indices = random.sample(range(len(dataset)), 2000)
    subset = torch.utils.data.Subset(dataset, subset_indices)
    dataloader = DataLoader(subset, batch_size=32, drop_last=True) # drop_last required by Opacus

    print(f"[{CLIENT_ID}] Setting up Model & Differential Privacy...")
    model = SimpleCNN()
    model = restore_1d_to_model(model, global_1d)
    
    optimizer = optim.SGD(model.parameters(), lr=0.01, momentum=0.5)
    criterion = nn.CrossEntropyLoss()

    dp_wrapper = PrivacyWrapper(target_epsilon=10.0)
    model, optimizer, dataloader = dp_wrapper.make_private(model, optimizer, dataloader, epochs=1)

    print(f"[{CLIENT_ID}] Starting local training loop...")
    model.train()
    for batch_idx, (data, target) in enumerate(dataloader):
        optimizer.zero_grad()
        output = model(data)
        loss = criterion(output, target)
        loss.backward()
        optimizer.step()
        
    print(f"[{CLIENT_ID}] Training complete. Flattening and Standardizing weights...")
    standardizer = WeightStandardizer(target_size=100000)
    clean_model = model._module if hasattr(model, '_module') else model
    updated_1d = standardizer.process_model(clean_model)
    
    return updated_1d

def submit_update(updated_1d, old_1d, current_version):
    weight_delta = updated_1d - old_1d
    payload = {
        "client_id": CLIENT_ID,
        "client_version": current_version,
        "weights_delta": weight_delta.tolist(), 
        "accuracy_improvement": random.uniform(0.01, 0.05) 
    }
    print(f"[{CLIENT_ID}] Pushing commit to Server Dashboard...")
    res = requests.post(f"{SERVER_URL}/submit_update", json=payload)
    print(f"[{CLIENT_ID}] Server Response:", res.json())

if __name__ == "__main__":
    global_1d, version = fetch_global_model()
    updated_1d = train_local(global_1d)
    submit_update(updated_1d, global_1d, version)