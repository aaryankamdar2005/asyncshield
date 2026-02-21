import numpy as np

class RobustAggregator:
    def __init__(self, learning_rate=1.0, alpha=0.5):
        self.lr = learning_rate
        self.alpha = alpha # Staleness penalty sensitivity

    def calculate_staleness(self, global_version, client_version):
        """Calculates decay factor based on version lag."""
        lag = max(0, global_version - client_version)
        # Asymptotically drops as lag increases: 1 / (1 + alpha * lag)
        return 1.0 / (1.0 + self.alpha * lag)

    def trimmed_mean(self, updates_list, trim_ratio=0.1):
        """
        Removes the highest and lowest values across all updates to prevent 
        data poisoning (e.g., if a malicious client sends extremely large weights).
        """
        if len(updates_list) < 3:
            # Not enough updates to trim safely, fallback to standard mean
            return np.mean(updates_list, axis=0)
            
        # Stack updates into a 2D matrix (num_clients x 100,000)
        stacked_updates = np.vstack(updates_list)
        
        # Calculate how many items to trim from top and bottom
        trim_count = int(len(updates_list) * trim_ratio)
        
        # Sort along the client axis (axis=0)
        sorted_updates = np.sort(stacked_updates, axis=0)
        
        # Slice off the top and bottom 'trim_count'
        trimmed_updates = sorted_updates[trim_count : -trim_count if trim_count > 0 else None, :]
        
        # Return the mean of the remaining robust updates
        return np.mean(trimmed_updates, axis=0)

    def apply_update(self, w_old, w_client, global_vers, client_vers):
        """Applies: W_new = W_old + (LR * Staleness) * (W_client - W_old)"""
        staleness = self.calculate_staleness(global_vers, client_vers)
        
        # Calculate the delta (change)
        delta = w_client - w_old
        
        # Apply equation
        w_new = w_old + (self.lr * staleness) * delta
        return w_new