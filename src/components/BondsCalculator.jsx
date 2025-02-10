import { useState } from 'react';

const BondsCalculator = () => {
  const [formData, setFormData] = useState({
    nominal: '',
    marketPrice: '',
    coupon: '',
    yearsToMaturity: '',
    couponFrequency: '1',
    ebit: '',
    interestExpense: '',
    totalDebt: '',
    equity: '',
    ebitda: '',
    currentAssets: '',
    currentLiabilities: '',
    inventory: ''
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

  const calculateBondMetrics = () => {
    const couponFrequency = parseInt(formData.couponFrequency);

    if (couponFrequency < 1 || couponFrequency > 12) {
      alert('Частота выплаты купона должна быть от 1 до 12 раз в год');
      return;
    }

    const values = {
      nominal: parseFloat(formData.nominal),
      marketPrice: parseFloat(formData.marketPrice),
      coupon: parseFloat(formData.coupon),
      yearsToMaturity: parseInt(formData.yearsToMaturity),
      couponFrequency,
      ebit: parseFloat(formData.ebit),
      interestExpense: parseFloat(formData.interestExpense),
      totalDebt: parseFloat(formData.totalDebt),
      equity: parseFloat(formData.equity),
      ebitda: parseFloat(formData.ebitda),
      currentAssets: parseFloat(formData.currentAssets),
      currentLiabilities: parseFloat(formData.currentLiabilities),
      inventory: parseFloat(formData.inventory)
    };

    if (Object.values(values).some(isNaN)) {
      alert('Пожалуйста, введите корректные числовые значения');
      return;
    }

    // Расчет купона на одну выплату
    const couponPerPayment = values.coupon / values.couponFrequency;
    
    // Текущая доходность с учетом частоты выплат
    const currentYield = (values.coupon / values.marketPrice) * 100;
    
    // Доходность к погашению с учетом частоты выплат
    const simpleYtm = ((couponPerPayment * values.couponFrequency) +
                     (values.nominal - values.marketPrice) / values.yearsToMaturity) /
                     ((values.nominal + values.marketPrice) / 2) * 100;
    const icr = values.ebit / values.interestExpense;
    const deRatio = values.totalDebt / values.equity;
    const totalDebtToEbitda = values.totalDebt / values.ebitda;
    const currentRatio = values.currentAssets / values.currentLiabilities;
    const quickRatio = (values.currentAssets - values.inventory) / values.currentLiabilities;

    setResults({
      couponPerPayment,
      currentYield,
      simpleYtm,
      icr,
      deRatio,
      totalDebtToEbitda,
      currentRatio,
      quickRatio
    });

    let newWarnings = [];
    let newRecommendation = 'Покупать';

    if (icr < 2 || deRatio > 2 || totalDebtToEbitda > 5 || currentRatio < 1.1 || quickRatio < 0.7) {
      newRecommendation = 'Не покупать';
      
      if (icr < 2) {
        newWarnings.push('Низкий коэффициент покрытия процентов');
      }
      if (deRatio > 2) {
        newWarnings.push('Высокий коэффициент долговой нагрузки');
      }
      if (totalDebtToEbitda > 5) {
        newWarnings.push('Высокий коэффициент общей задолженности к EBITDA');
      }
      if (currentRatio < 1.1) {
        newWarnings.push('Низкий коэффициент текущей ликвидности');
      }
      if (quickRatio < 0.7) {
        newWarnings.push('Низкий коэффициент быстрой ликвидности');
      }
    }

    if (simpleYtm < 5) {
      newRecommendation = 'Не покупать';
      newWarnings.push('Низкая доходность к погашению');
    }

    setWarnings(newWarnings);
    setRecommendation(newRecommendation);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Данные об облигации</h3>
            <div>
              <label 
                htmlFor="nominal"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Номинал облигации
              </label>
              <input
                id="nominal"
                type="number"
                name="nominal"
                value={formData.nominal}
                onChange={handleInputChange}
                className="input-field"
                placeholder="0.00"
                title="Face Value, Par Value - Номинальная стоимость облигации, которая будет выплачена при погашении"
              />
            </div>

            <div>
              <label 
                htmlFor="marketPrice"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Рыночная цена
              </label>
              <input
                id="marketPrice"
                type="number"
                name="marketPrice"
                value={formData.marketPrice}
                onChange={handleInputChange}
                className="input-field"
                placeholder="0.00"
                title="Market Price - Текущая рыночная цена облигации"
              />
            </div>

            <div>
              <label 
                htmlFor="coupon"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Годовой купон
              </label>
              <input
                id="coupon"
                type="number"
                name="coupon"
                value={formData.coupon}
                onChange={handleInputChange}
                className="input-field"
                placeholder="0.00"
                title="Annual Coupon Payment - Сумма всех купонных выплат за год"
              />
            </div>

            <div>
              <label 
                htmlFor="yearsToMaturity"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Лет до погашения
              </label>
              <input
                id="yearsToMaturity"
                type="number"
                name="yearsToMaturity"
                value={formData.yearsToMaturity}
                onChange={handleInputChange}
                className="input-field"
                placeholder="0"
                title="Years to Maturity - Количество лет до погашения облигации"
              />
            </div>

            <div>
              <label
                htmlFor="couponFrequency"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Частота выплаты купона в год
              </label>
              <input
                id="couponFrequency"
                type="number"
                name="couponFrequency"
                value={formData.couponFrequency}
                onChange={handleInputChange}
                className="input-field"
                placeholder="1"
                min="1"
                max="12"
                title="Coupon Frequency - Количество выплат купона в течение года (от 1 до 12 раз в год)"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Данные о компании-эмитенте</h3>
            <div>
              <label 
                htmlFor="ebit"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                EBIT
              </label>
              <input
                id="ebit"
                type="number"
                name="ebit"
                value={formData.ebit}
                onChange={handleInputChange}
                className="input-field"
                placeholder="0.00"
                title="Earnings Before Interest and Taxes - Прибыль до вычета процентов и налогов"
              />
            </div>

            <div>
              <label 
                htmlFor="interestExpense"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Процентные расходы
              </label>
              <input
                id="interestExpense"
                type="number"
                name="interestExpense"
                value={formData.interestExpense}
                onChange={handleInputChange}
                className="input-field"
                placeholder="0.00"
                title="Interest Expense - Расходы компании на выплату процентов по всем долгам"
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
                htmlFor="ebitda"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                EBITDA
              </label>
              <input
                id="ebitda"
                type="number"
                name="ebitda"
                value={formData.ebitda}
                onChange={handleInputChange}
                className="input-field"
                placeholder="0.00"
                title="Earnings Before Interest, Taxes, Depreciation and Amortization - Прибыль до вычета процентов, налогов и амортизации"
              />
            </div>

            <div>
              <label 
                htmlFor="currentAssets"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Оборотные активы
              </label>
              <input
                id="currentAssets"
                type="number"
                name="currentAssets"
                value={formData.currentAssets}
                onChange={handleInputChange}
                className="input-field"
                placeholder="0.00"
                title="Current Assets - Активы, которые компания планирует использовать или продать в течение года"
              />
            </div>

            <div>
              <label 
                htmlFor="currentLiabilities"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Краткосрочные обязательства
              </label>
              <input
                id="currentLiabilities"
                type="number"
                name="currentLiabilities"
                value={formData.currentLiabilities}
                onChange={handleInputChange}
                className="input-field"
                placeholder="0.00"
                title="Current Liabilities - Обязательства, которые компания должна погасить в течение года"
              />
            </div>

            <div>
              <label 
                htmlFor="inventory"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Запасы
              </label>
              <input
                id="inventory"
                type="number"
                name="inventory"
                value={formData.inventory}
                onChange={handleInputChange}
                className="input-field"
                placeholder="0.00"
                title="Inventory - Товарно-материальные запасы компании"
              />
            </div>
          </div>
        </div>

        <button
          onClick={calculateBondMetrics}
          className="btn w-full"
        >
          Рассчитать
        </button>

        {results && (
          <div className="mt-8 space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">Результаты анализа</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl" title="Coupon Per Payment - Размер одной купонной выплаты">
                <div className="text-sm text-gray-600 mb-1">Размер купона за 1 выплату</div>
                <div className="text-xl font-semibold">{results.couponPerPayment.toFixed(2)}</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl" title="Current Yield - Текущая доходность облигации, отношение годового купона к рыночной цене">
                <div className="text-sm text-gray-600 mb-1">Текущая доходность</div>
                <div className="text-xl font-semibold">{results.currentYield.toFixed(2)}%</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl" title="Yield to Maturity - Доходность к погашению, полная доходность облигации при удержании до погашения">
                <div className="text-sm text-gray-600 mb-1">Доходность к погашению</div>
                <div className="text-xl font-semibold">{results.simpleYtm.toFixed(2)}%</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl" title="Interest Coverage Ratio - Коэффициент покрытия процентов, показывает способность компании обслуживать долг">
                <div className="text-sm text-gray-600 mb-1">Покрытие процентов</div>
                <div className="text-xl font-semibold">{results.icr.toFixed(2)}</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl" title="Debt to Equity Ratio - Отношение общего долга к собственному капиталу">
                <div className="text-sm text-gray-600 mb-1">D/E</div>
                <div className="text-xl font-semibold">{results.deRatio.toFixed(2)}</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl" title="Total Debt to EBITDA - Показывает, за сколько лет компания может погасить свой долг">
                <div className="text-sm text-gray-600 mb-1">Долг/EBITDA</div>
                <div className="text-xl font-semibold">{results.totalDebtToEbitda.toFixed(2)}</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl" title="Current Ratio - Коэффициент текущей ликвидности, способность компании погашать краткосрочные обязательства">
                <div className="text-sm text-gray-600 mb-1">Текущая ликвидность</div>
                <div className="text-xl font-semibold">{results.currentRatio.toFixed(2)}</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl" title="Quick Ratio - Коэффициент быстрой ликвидности, способность компании погашать краткосрочные обязательства без учета запасов">
                <div className="text-sm text-gray-600 mb-1">Быстрая ликвидность</div>
                <div className="text-xl font-semibold">{results.quickRatio.toFixed(2)}</div>
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

export default BondsCalculator;