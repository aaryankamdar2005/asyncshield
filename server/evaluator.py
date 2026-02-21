import torch
from models import SimpleCNN, restore_1d_to_model

class Evaluator:
    def __init__(self, golden_dataloader):
        self.golden_dataloader = golden_dataloader
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.criterion = torch.nn.CrossEntropyLoss()

    def evaluate_accuracy(self, model: torch.nn.Module):
        model.to(self.device)
        model.eval()
        correct = 0
        total = 0
        
        with torch.no_grad():
            for inputs, targets in self.golden_dataloader:
                inputs, targets = inputs.to(self.device), targets.to(self.device)
                outputs = model(inputs)
                _, predicted = torch.max(outputs.data, 1)
                total += targets.size(0)
                correct += (predicted == targets).sum().item()
                
        return correct / total

    def verify_update(self, global_1d, updated_1d):
        """Returns the real ΔI (Delta Accuracy)."""
        model = SimpleCNN()
        
        # 1. Test original model
        model = restore_1d_to_model(model, global_1d)
        old_acc = self.evaluate_accuracy(model)
        
        # 2. Test proposed model update
        model = restore_1d_to_model(model, updated_1d)
        new_acc = self.evaluate_accuracy(model)
        
        delta_i = new_acc - old_acc
        return delta_i