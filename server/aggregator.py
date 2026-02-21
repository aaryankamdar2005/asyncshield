# server/aggregator.py
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

    def apply_update(self, w_old, delta_client, global_vers, client_vers):
        """
        Asynchronous Update Formula:
        W_new = W_old + (LR * Staleness) * (W_delta)
        """
        staleness = self.calculate_staleness(global_vers, client_vers)
        
        # Apply equation using the adaptive learning rate
        w_new = w_old + (self.lr * staleness) * delta_client
        return w_new

    # Note: trimmed_mean can be used if you collect updates in a buffer
    def trimmed_mean(self, updates_list, trim_ratio=0.1):
        if len(updates_list) < 3:
            return np.mean(updates_list, axis=0)
        stacked_updates = np.vstack(updates_list)
        trim_count = int(len(updates_list) * trim_ratio)
        sorted_updates = np.sort(stacked_updates, axis=0)
        trimmed_updates = sorted_updates[trim_count : -trim_count if trim_count > 0 else None, :]
        return np.mean(trimmed_updates, axis=0)