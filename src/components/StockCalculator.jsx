import { useState } from 'react';

const StockCalculator = () => {
  const [formData, setFormData] = useState({
    marketPrice: '',
    earningsPerShare: '',
    bookValuePerShare: '',
    revenuePerShare: '',
    annualDividend: '',
    totalDebt: '',
    equity: '',
    netIncome: ''
  });

  const [results, setResults] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [warnings, setWarnings] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateRatios = () => {
    const {
      marketPrice, earningsPerShare, bookValuePerShare,
      revenuePerShare, annualDividend, totalDebt,
      equity, netIncome
    } = formData;

    const values = {
      marketPrice: parseFloat(marketPrice),
      earningsPerShare: parseFloat(earningsPerShare),
      bookValuePerShare: parseFloat(bookValuePerShare),
      revenuePerShare: parseFloat(revenuePerShare),
      annualDividend: parseFloat(annualDividend),
      totalDebt: parseFloat(totalDebt),
      equity: parseFloat(equity),
      netIncome: parseFloat(netIncome)
    };

    if (Object.values(values).some(isNaN)) {
      alert('Пожалуйста, введите корректные числовые значения');
      return;
    }

    const peRatio = values.marketPrice / values.earningsPerShare;
    const pbRatio = values.marketPrice / values.bookValuePerShare;
    const psRatio = values.marketPrice / values.revenuePerShare;
    const dividendYield = (values.annualDividend / values.marketPrice) * 100;
    const deRatio = values.totalDebt / values.equity;
    const roe = (values.netIncome / values.equity) * 100;

    setResults({
      peRatio,
      pbRatio,
      psRatio,
      dividendYield,
      deRatio,
      roe
    });

    let newWarnings = [];
    let newRecommendation = 'Покупать';

    if (peRatio > 25 || pbRatio > 4 || psRatio > 5) {
      newRecommendation = 'Не покупать';
      if (peRatio > 25) {
        newWarnings.push(`Высокий P/E (${peRatio.toFixed(2)}). Средний по рынку около 15-20`);
      }
      if (pbRatio > 4) {
        newWarnings.push(`Высокий P/B (${pbRatio.toFixed(2)}). Средний по рынку около 1-3`);
      }
      if (psRatio > 5) {
        newWarnings.push(`Высокий P/S (${psRatio.toFixed(2)}). Средний по рынку около 1-2`);
      }
    }

    if (deRatio > 2 || roe < 10) {
      newRecommendation = 'Не покупать';
      if (deRatio > 2) {
        newWarnings.push(`Высокий коэффициент долговой нагрузки (D/E): ${deRatio.toFixed(2)}`);
      }
      if (roe < 10) {
        newWarnings.push(`Низкая рентабельность собственного капитала (ROE): ${roe.toFixed(2)}%. Рекомендуется выше 10-15%.`);
      }
    }

    if (dividendYield < 2) {
      newWarnings.push(`Низкая дивидендная доходность: ${dividendYield.toFixed(2)}%`);
    }

    setWarnings(newWarnings);
    setRecommendation(newRecommendation);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Данные об акции</h3>
            <div>
              <label 
                htmlFor="marketPrice"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Рыночная цена акции
              </label>
              <input
                id="marketPrice"
                type="number"
                name="marketPrice"
                value={formData.marketPrice}
                onChange={handleInputChange}
                className="input-field"
                placeholder="0.00"
                title="Текущая рыночная цена одной акции (Market Price, Stock Price)"
              />
            </div>
            
            <div>
              <label 
                htmlFor="earningsPerShare"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Прибыль на акцию (EPS)
              </label>
              <input
                id="earningsPerShare"
                type="number"
                name="earningsPerShare"
                value={formData.earningsPerShare}
                onChange={handleInputChange}
                className="input-field"
                placeholder="0.00"
                title="Earnings Per Share (EPS) - Чистая прибыль компании, разделенная на количество акций в обращении"
              />
            </div>

            <div>
              <label 
                htmlFor="bookValuePerShare"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Балансовая стоимость на акцию
              </label>
              <input
                id="bookValuePerShare"
                type="number"
                name="bookValuePerShare"
                value={formData.bookValuePerShare}
                onChange={handleInputChange}
                className="input-field"
                placeholder="0.00"
                title="Book Value Per Share (BVPS) - Собственный капитал компании, разделенный на количество акций в обращении"
              />
            </div>

            <div>
              <label 
                htmlFor="revenuePerShare"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Выручка на акцию
              </label>
              <input
                id="revenuePerShare"
                type="number"
                name="revenuePerShare"
                value={formData.revenuePerShare}
                onChange={handleInputChange}
                className="input-field"
                placeholder="0.00"
                title="Revenue Per Share - Общая выручка компании, разделенная на количество акций в обращении"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Данные о компании</h3>
            <div>
              <label 
                htmlFor="annualDividend"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Годовой дивиденд
              </label>
              <input
                id="annualDividend"
                type="number"
                name="annualDividend"
                value={formData.annualDividend}
                onChange={handleInputChange}
                className="input-field"
                placeholder="0.00"
                title="Annual Dividend - Сумма всех дивидендных выплат за год на одну акцию"
              />
            </div>

            <div>
              <label 
                htmlFor="totalDebt"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Общий долг
              </label>
              <input
                id="totalDebt"
                type="number"
                name="totalDebt"
                value={formData.totalDebt}
                onChange={handleInputChange}
                className="input-field"
                placeholder="0.00"
                title="Total Debt - Сумма всех краткосрочных и долгосрочных обязательств компании"
              />
            </div>

            <div>
              <label 
                htmlFor="equity"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Собственный капитал
              </label>
              <input
                id="equity"
                type="number"
                name="equity"
                value={formData.equity}
                onChange={handleInputChange}
                className="input-field"
                placeholder="0.00"
                title="Shareholders' Equity - Разница между активами и обязательствами компании"
              />
            </div>

            <div>
              <label 
                htmlFor="netIncome"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Чистая прибыль
              </label>
              <input
                id="netIncome"
                type="number"
                name="netIncome"
                value={formData.netIncome}
                onChange={handleInputChange}
                className="input-field"
                placeholder="0.00"
                title="Net Income - Прибыль компании после вычета всех расходов и налогов"
              />
            </div>
          </div>
        </div>

        <button
          onClick={calculateRatios}
          className="btn w-full"
        >
          Рассчитать
        </button>

        {results && (
          <div className="mt-8 space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">Результаты анализа</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl" title="Price to Earnings Ratio - Отношение рыночной цены акции к прибыли на акцию">
                <div className="text-sm text-gray-600 mb-1">P/E</div>
                <div className="text-xl font-semibold">{results.peRatio.toFixed(2)}</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl" title="Price to Book Ratio - Отношение рыночной цены акции к балансовой стоимости на акцию">
                <div className="text-sm text-gray-600 mb-1">P/B</div>
                <div className="text-xl font-semibold">{results.pbRatio.toFixed(2)}</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl" title="Price to Sales Ratio - Отношение рыночной цены акции к выручке на акцию">
                <div className="text-sm text-gray-600 mb-1">P/S</div>
                <div className="text-xl font-semibold">{results.psRatio.toFixed(2)}</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl" title="Dividend Yield - Процентное отношение годового дивиденда к рыночной цене акции">
                <div className="text-sm text-gray-600 mb-1">Дивидендная доходность</div>
                <div className="text-xl font-semibold">{results.dividendYield.toFixed(2)}%</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl" title="Debt to Equity Ratio - Отношение общего долга к собственному капиталу">
                <div className="text-sm text-gray-600 mb-1">D/E</div>
                <div className="text-xl font-semibold">{results.deRatio.toFixed(2)}</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl" title="Return on Equity - Рентабельность собственного капитала">
                <div className="text-sm text-gray-600 mb-1">ROE</div>
                <div className="text-xl font-semibold">{results.roe.toFixed(2)}%</div>
              </div>
            </div>

            {warnings.length > 0 && (
              <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                <h4 className="text-lg font-medium text-yellow-800 mb-2">Предупреждения:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {warnings.map((warning, index) => (
                    <li key={index} className="text-yellow-700">{warning}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className={`p-4 rounded-xl border ${
              recommendation === 'Покупать' 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <h4 className="text-lg font-medium mb-2">Рекомендация</h4>
              <p className={`text-xl font-bold ${
                recommendation === 'Покупать' ? 'text-green-700' : 'text-red-700'
              }`}>
                {recommendation}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockCalculator;