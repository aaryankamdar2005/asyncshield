# server/models.py
import torch
import torch.nn as nn
import numpy as np

class SimpleCNN(nn.Module):
    def __init__(self):
        super(SimpleCNN, self).__init__()
        # Shrunk down the channels to keep total parameters at ~54,000 
        # (This easily fits inside our 100k limit array)
        self.conv1 = nn.Conv2d(1, 8, kernel_size=5, padding=2)
        self.relu1 = nn.ReLU()
        self.pool1 = nn.MaxPool2d(2)
        
        self.conv2 = nn.Conv2d(8, 16, kernel_size=5, padding=2)
        self.relu2 = nn.ReLU()
        self.pool2 = nn.MaxPool2d(2)
        
        # 16 channels * 7 * 7 spatial grid = 784
        self.fc1 = nn.Linear(784, 64)
        self.relu3 = nn.ReLU()
        self.fc2 = nn.Linear(64, 10)

    def forward(self, x):
        x = self.pool1(self.relu1(self.conv1(x)))
        x = self.pool2(self.relu2(self.conv2(x)))
        x = x.view(x.size(0), -1)
        x = self.relu3(self.fc1(x))
        x = self.fc2(x)
        return x

def restore_1d_to_model(model: nn.Module, flat_weights_1d: np.ndarray):
    """Injects exactly the required parameters from the 100k 1D array back into the PyTorch model."""
    state_dict = model.state_dict()
    offset = 0
    
    for key, tensor in state_dict.items():
        numel = tensor.numel()
        layer_flat = flat_weights_1d[offset : offset + numel]
        layer_tensor = torch.from_numpy(layer_flat).view_as(tensor).float()
        state_dict[key].copy_(layer_tensor)
        offset += numel
        
    model.load_state_dict(state_dict)
    return model