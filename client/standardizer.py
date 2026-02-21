import numpy as np
import torch

class WeightStandardizer:
    def __init__(self, target_size=100000):
        self.target_size = target_size

    def flatten_and_pad(self, state_dict):
        """Extracts weights from PyTorch state_dict, flattens, and pads to target_size."""
        all_weights = []
        for key, tensor in state_dict.items():
            all_weights.append(tensor.cpu().numpy().flatten())
        
        # Concatenate all layers into a single 1D array
        flat_1d = np.concatenate(all_weights)
        current_size = len(flat_1d)
        
        if current_size > self.target_size:
            raise ValueError(f"Model is too large! Size: {current_size}")
            
        # Zero-pad to reach exactly 100,000 parameters
        padding_size = self.target_size - current_size
        padded_array = np.pad(flat_1d, (0, padding_size), 'constant', constant_values=0)
        
        return padded_array

    def normalize(self, padded_array):
        """Applies Z-Score Normalization (Standardization)."""
        mean = np.mean(padded_array)
        std = np.std(padded_array)
        
        if std == 0:
            return padded_array # Prevent division by zero
            
        normalized_array = (padded_array - mean) / std
        return normalized_array

    def process_model(self, model):
        """Main pipeline: takes a model, returns standard 1D array."""
        padded = self.flatten_and_pad(model.state_dict())
        standardized = self.normalize(padded)
        return standardized