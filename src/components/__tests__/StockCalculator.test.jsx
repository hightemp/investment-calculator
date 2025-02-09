import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import StockCalculator from '../StockCalculator';

describe('StockCalculator', () => {
  it('renders without crashing', () => {
    render(<StockCalculator />);
    expect(screen.getByText('Данные об акции')).toBeInTheDocument();
    expect(screen.getByText('Данные о компании')).toBeInTheDocument();
  });

  it('contains all required input fields', () => {
    render(<StockCalculator />);
    
    const inputs = [
      'Рыночная цена акции',
      'Прибыль на акцию (EPS)',
      'Балансовая стоимость на акцию',
      'Выручка на акцию',
      'Годовой дивиденд',
      'Общий долг',
      'Собственный капитал',
      'Чистая прибыль'
    ];

    inputs.forEach(label => {
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    });
  });

  it('calculates ratios correctly', () => {
    render(<StockCalculator />);

    const testData = {
      'Рыночная цена акции': '100',
      'Прибыль на акцию (EPS)': '5',
      'Балансовая стоимость на акцию': '50',
      'Выручка на акцию': '20',
      'Годовой дивиденд': '3',
      'Общий долг': '1000',
      'Собственный капитал': '2000',
      'Чистая прибыль': '200'
    };

    Object.entries(testData).forEach(([label, value]) => {
      const input = screen.getByLabelText(label);
      fireEvent.change(input, { target: { value } });
    });

    fireEvent.click(screen.getByText('Рассчитать'));

    expect(screen.getByText('20.00')).toBeInTheDocument();
    expect(screen.getByText('2.00')).toBeInTheDocument();
    expect(screen.getByText('5.00')).toBeInTheDocument();
    expect(screen.getByText('3.00%')).toBeInTheDocument();
    expect(screen.getByText('0.50')).toBeInTheDocument();
    expect(screen.getByText('10.00%')).toBeInTheDocument();
  });

  it('shows "Покупать" recommendation for good metrics', () => {
    render(<StockCalculator />);

    const goodMetrics = {
      'Рыночная цена акции': '100',
      'Прибыль на акцию (EPS)': '10',
      'Балансовая стоимость на акцию': '50',
      'Выручка на акцию': '50',
      'Годовой дивиденд': '4',
      'Общий долг': '1000',
      'Собственный капитал': '2000',
      'Чистая прибыль': '300'
    };

    Object.entries(goodMetrics).forEach(([label, value]) => {
      const input = screen.getByLabelText(label);
      fireEvent.change(input, { target: { value } });
    });

    fireEvent.click(screen.getByText('Рассчитать'));
    expect(screen.getByText('Покупать')).toBeInTheDocument();
  });

  it('shows "Не покупать" recommendation and warnings for bad metrics', () => {
    render(<StockCalculator />);

    const badMetrics = {
      'Рыночная цена акции': '300',
      'Прибыль на акцию (EPS)': '10',
      'Балансовая стоимость на акцию': '50',
      'Выручка на акцию': '50',
      'Годовой дивиденд': '1',
      'Общий долг': '4000',
      'Собственный капитал': '2000',
      'Чистая прибыль': '100'
    };

    Object.entries(badMetrics).forEach(([label, value]) => {
      const input = screen.getByLabelText(label);
      fireEvent.change(input, { target: { value } });
    });

    fireEvent.click(screen.getByText('Рассчитать'));
    
    expect(screen.getByText('Не покупать')).toBeInTheDocument();
    expect(screen.getByText(/Высокий P\/E/)).toBeInTheDocument();
    expect(screen.getByText(/Высокий P\/B/)).toBeInTheDocument();
    expect(screen.getByText(/Высокий P\/S/)).toBeInTheDocument();
    expect(screen.getByText(/Низкая дивидендная доходность/)).toBeInTheDocument();
    expect(screen.getByText(/Высокий коэффициент долговой нагрузки/)).toBeInTheDocument();
    expect(screen.getByText(/Низкая рентабельность собственного капитала/)).toBeInTheDocument();
  });

  it('validates input data', () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    render(<StockCalculator />);

    fireEvent.click(screen.getByText('Рассчитать'));
    expect(alertMock).toHaveBeenCalledWith('Пожалуйста, введите корректные числовые значения');

    const input = screen.getByLabelText('Рыночная цена акции');
    fireEvent.change(input, { target: { value: 'not-a-number' } });
    fireEvent.click(screen.getByText('Рассчитать'));
    expect(alertMock).toHaveBeenCalledWith('Пожалуйста, введите корректные числовые значения');

    alertMock.mockRestore();
  });
});