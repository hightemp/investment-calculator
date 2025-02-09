import numpy as np
import pandas as pd
from typing import List, Tuple

class BondSimulator:
    def __init__(self):
        self.min_yield = 0.05
        self.max_yield = 0.15
        self.default_probability = 0.01
        self.default_recovery = 0.60
        
    def simulate_single_portfolio(self, 
                                investment: float = 100000, 
                                n_bonds: int = 100,
                                years: int = 1) -> float:
        amount_per_bond = investment / n_bonds
        yields = np.random.uniform(self.min_yield, self.max_yield, n_bonds)
        defaults = np.random.random(n_bonds) < self.default_probability
        
        final_value = 0
        for i in range(n_bonds):
            if defaults[i]:
                final_value += amount_per_bond * self.default_recovery
            else:
                final_value += amount_per_bond * (1 + yields[i] * years)
                
        return final_value
    
    def run_simulation(self, 
                      n_simulations: int = 10000,
                      investment: float = 100000,
                      n_bonds: int = 100,
                      years: int = 1) -> Tuple[List[float], dict]:
        results = []
        for _ in range(n_simulations):
            final_value = self.simulate_single_portfolio(investment, n_bonds, years)
            results.append(final_value)
            
        stats = {
            'mean_return': np.mean(results) / investment - 1,
            'std_dev': np.std(results) / investment,
            'min_return': min(results) / investment - 1,
            'max_return': max(results) / investment - 1,
            'var_95': np.percentile(results, 5) / investment - 1
        }
        
        return results, stats

simulator = BondSimulator()
results, stats = simulator.run_simulation()

print("=== Результаты симуляции ===")
print(f"Средняя доходность: {stats['mean_return']:.2%}")
print(f"Стандартное отклонение: {stats['std_dev']:.2%}")
print(f"Минимальная доходность: {stats['min_return']:.2%}")
print(f"Максимальная доходность: {stats['max_return']:.2%}")
print(f"Value at Risk (95%): {stats['var_95']:.2%}")

import matplotlib.pyplot as plt
from datetime import datetime

def save_plot(results: list, filename_prefix: str = "bond_simulation"):
    plt.figure(figsize=(12, 8))
    plt.hist(results, bins=50, density=True, color='skyblue', alpha=0.7)
    plt.title('Распределение доходности портфеля облигаций', fontsize=14)
    plt.xlabel('Итоговая стоимость портфеля (руб.)', fontsize=12)
    plt.ylabel('Частота', fontsize=12)
    plt.grid(True, alpha=0.3)
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"{filename_prefix}_{timestamp}.png"
    
    plt.savefig(filename, dpi=300, bbox_inches='tight')
    plt.close()
    
    return filename

saved_file = save_plot(results)
print(f"\nГрафик сохранен в файл: {saved_file}")