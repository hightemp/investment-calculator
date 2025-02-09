import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import BondsCalculator from '../BondsCalculator';

describe('BondsCalculator', () => {
  it('renders without crashing', () => {
    render(<BondsCalculator />);
    expect(screen.getByText('Данные об облигации')).toBeInTheDocument();
    expect(screen.getByText('Данные о компании-эмитенте')).toBeInTheDocument();
  });

  it('contains all required input fields', () => {
    render(<BondsCalculator />);
    
    const inputs = [
      'Номинал облигации',
      'Рыночная цена',
      'Годовой купон',
      'Лет до погашения',
      'Частота выплаты купона в год',
      'EBIT',
      'Процентные расходы',
      'Общий долг',
      'Собственный капитал',
      'EBITDA',
      'Оборотные активы',
      'Краткосрочные обязательства',
      'Запасы'
    ];

    inputs.forEach(label => {
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    });
  });

  it('calculates bond metrics correctly', () => {
    render(<BondsCalculator />);

    const testData = {
      'Номинал облигации': '1000',
      'Рыночная цена': '950',
      'Годовой купон': '80',
      'Лет до погашения': '5',
      'EBIT': '1000',
      'Процентные расходы': '200',
      'Общий долг': '2000',
      'Собственный капитал': '4000',
      'EBITDA': '1200',
      'Оборотные активы': '1500',
      'Краткосрочные обязательства': '1000',
      'Запасы': '300'
    };

    Object.entries(testData).forEach(([label, value]) => {
      const input = screen.getByLabelText(label);
      fireEvent.change(input, { target: { value } });
    });

    const select = screen.getByLabelText('Частота выплаты купона в год');
    fireEvent.change(select, { target: { value: '2' } });

    fireEvent.click(screen.getByText('Рассчитать'));

    expect(screen.getByText('8.42%')).toBeInTheDocument();
    expect(screen.getByText('5.00')).toBeInTheDocument();
    expect(screen.getByText('0.50')).toBeInTheDocument();
    expect(screen.getByText('1.67')).toBeInTheDocument();
    expect(screen.getByText('1.50')).toBeInTheDocument();
    expect(screen.getByText('1.20')).toBeInTheDocument();
  });

  it('shows "Покупать" recommendation for good metrics', () => {
    render(<BondsCalculator />);

    const goodMetrics = {
      'Номинал облигации': '1000',
      'Рыночная цена': '950',
      'Годовой купон': '60',
      'Лет до погашения': '3',
      'EBIT': '1000',
      'Процентные расходы': '200',
      'Общий долг': '2000',
      'Собственный капитал': '4000',
      'EBITDA': '1500',
      'Оборотные активы': '2000',
      'Краткосрочные обязательства': '1000',
      'Запасы': '500'
    };

    Object.entries(goodMetrics).forEach(([label, value]) => {
      const input = screen.getByLabelText(label);
      fireEvent.change(input, { target: { value } });
    });

    fireEvent.click(screen.getByText('Рассчитать'));
    expect(screen.getByText('Покупать')).toBeInTheDocument();
  });

  it('shows "Не покупать" recommendation and warnings for bad metrics', () => {
    render(<BondsCalculator />);

    const badMetrics = {
      'Номинал облигации': '1000',
      'Рыночная цена': '990',
      'Годовой купон': '40',
      'Лет до погашения': '5',
      'EBIT': '200',
      'Процентные расходы': '150',
      'Общий долг': '4000',
      'Собственный капитал': '1000',
      'EBITDA': '500',
      'Оборотные активы': '1000',
      'Краткосрочные обязательства': '1000',
      'Запасы': '400'
    };

    Object.entries(badMetrics).forEach(([label, value]) => {
      const input = screen.getByLabelText(label);
      fireEvent.change(input, { target: { value } });
    });

    fireEvent.click(screen.getByText('Рассчитать'));
    
    expect(screen.getByText('Не покупать')).toBeInTheDocument();
    expect(screen.getByText(/Низкий коэффициент покрытия процентов/)).toBeInTheDocument();
    expect(screen.getByText(/Высокий коэффициент долговой нагрузки/)).toBeInTheDocument();
    expect(screen.getByText(/Высокий коэффициент общей задолженности к EBITDA/)).toBeInTheDocument();
    expect(screen.getByText(/Низкий коэффициент текущей ликвидности/)).toBeInTheDocument();
    expect(screen.getByText(/Низкий коэффициент быстрой ликвидности/)).toBeInTheDocument();
  });

  it('validates coupon frequency', () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    render(<BondsCalculator />);

    const testData = {
      'Номинал облигации': '1000',
      'Рыночная цена': '950',
      'Годовой купон': '80',
      'Лет до погашения': '5',
      'EBIT': '1000',
      'Процентные расходы': '200',
      'Общий долг': '2000',
      'Собственный капитал': '4000',
      'EBITDA': '1200',
      'Оборотные активы': '1500',
      'Краткосрочные обязательства': '1000',
      'Запасы': '300'
    };

    Object.entries(testData).forEach(([label, value]) => {
      const input = screen.getByLabelText(label);
      fireEvent.change(input, { target: { value } });
    });

    const select = screen.getByLabelText('Частота выплаты купона в год');
    fireEvent.change(select, { target: { value: '1' } });
    fireEvent.change(select, { target: { value: '3' } });

    fireEvent.click(screen.getByText('Рассчитать'));
    expect(alertMock).toHaveBeenCalledWith('Частота выплаты купона должна быть 1, 2 или 4');

    alertMock.mockRestore();
  });

  it('validates input data', () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    render(<BondsCalculator />);

    fireEvent.click(screen.getByText('Рассчитать'));
    expect(alertMock).toHaveBeenCalledWith('Пожалуйста, введите корректные числовые значения');

    const input = screen.getByLabelText('Номинал облигации');
    fireEvent.change(input, { target: { value: 'not-a-number' } });
    fireEvent.click(screen.getByText('Рассчитать'));
    expect(alertMock).toHaveBeenCalledWith('Пожалуйста, введите корректные числовые значения');

    alertMock.mockRestore();
  });
});