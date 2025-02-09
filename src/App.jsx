import { useState } from 'react';
import StockCalculator from './components/StockCalculator';
import BondsCalculator from './components/BondsCalculator';

function App() {
  const [activeTab, setActiveTab] = useState('stocks');

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">
            Инвестиционный калькулятор
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Анализ акций и облигаций для принятия инвестиционных решений
          </p>

          {/* Tabs */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-xl shadow-sm bg-white p-1.5">
              <button
                onClick={() => setActiveTab('stocks')}
                className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'stocks'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Акции
              </button>
              <button
                onClick={() => setActiveTab('bonds')}
                className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'bonds'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Облигации
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="transition-all duration-300 ease-in-out">
            {activeTab === 'stocks' ? <StockCalculator /> : <BondsCalculator />}
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;
