def calculate_current_yield(coupon, market_price):
    return (coupon / market_price) * 100

def calculate_simple_ytm(coupon, nominal, market_price, years_to_maturity):
    return (coupon + (nominal - market_price) / years_to_maturity) / ((nominal + market_price) / 2) * 100

def calculate_interest_coverage_ratio(ebit, interest_expense):
    return ebit / interest_expense

def calculate_debt_to_equity_ratio(total_debt, equity):
    return total_debt / equity

def calculate_total_debt_to_ebitda(total_debt, ebitda):
    return total_debt / ebitda

def calculate_current_ratio(current_assets, current_liabilities):
    return current_assets / current_liabilities

def calculate_quick_ratio(current_assets, inventory, current_liabilities):
    return (current_assets - inventory) / current_liabilities

def analyze_bond():
    print("Введите данные об облигации:")
    try:
        nominal = float(input("Номинал облигации: "))
        market_price = float(input("Текущая рыночная цена: "))
        coupon = float(input("Годовой купонный платеж: "))
        years_to_maturity = int(input("Количество лет до погашения: "))
        coupon_frequency = int(input("Частота выплаты купона в год (1, 2, 4):"))
        
        if coupon_frequency not in [1, 2, 4]:
            raise ValueError("Некорректная частота выплаты купона")

    except ValueError:
        print("Ошибка: Введены некорректные данные об облигации.")
        return

    print("\nВведите данные о компании-эмитенте:")
    try:
        ebit = float(input("EBIT (прибыль до вычета процентов и налогов): "))
        interest_expense = float(input("Процентные расходы: "))
        total_debt = float(input("Общий долг: "))
        equity = float(input("Собственный капитал: "))
        ebitda = float(input("EBITDA: "))
        current_assets = float(input("Оборотные активы: "))
        current_liabilities = float(input("Краткосрочные обязательства: "))
        inventory = float(input("Запасы: "))
    except ValueError:
        print("Ошибка: Введены некорректные данные о компании.")
        return

    current_yield = calculate_current_yield(coupon, market_price)
    simple_ytm = calculate_simple_ytm(coupon, nominal, market_price, years_to_maturity)
    icr = calculate_interest_coverage_ratio(ebit, interest_expense)
    d_e = calculate_debt_to_equity_ratio(total_debt, equity)
    total_debt_to_ebitda = calculate_total_debt_to_ebitda(total_debt, ebitda)
    current_ratio = calculate_current_ratio(current_assets, current_liabilities)
    quick_ratio = calculate_quick_ratio(current_assets, inventory, current_liabilities)

    print("\nРезультаты анализа:")
    print(f"Текущая доходность: {current_yield:.2f}%")
    print(f"Простая доходность к погашению: {simple_ytm:.2f}%")
    print(f"Коэффициент покрытия процентов: {icr:.2f}")
    print(f"Коэффициент долговой нагрузки: {d_e:.2f}")
    print(f"Коэффициент общей задолженности к EBITDA: {total_debt_to_ebitda:.2f}")
    print(f"Коэффициент текущей ликвидности: {current_ratio:.2f}")
    print(f"Коэффициент быстрой ликвидности: {quick_ratio:.2f}")

    recommendation = "Покупать"
    if icr < 2 or d_e > 2 or total_debt_to_ebitda > 5 or current_ratio < 1.1 or quick_ratio < 0.7:
        recommendation = "Не покупать"
        print("\nВНИМАНИЕ: Высокий риск!")
        if icr < 2:
            print("  - Низкий коэффициент покрытия процентов.")
        if d_e > 2:
            print("  - Высокий коэффициент долговой нагрузки.")
        if total_debt_to_ebitda > 5:
            print("  - Высокий коэффициент общей задолженности к EBITDA.")
        if current_ratio < 1.1:
            print("  - Низкий коэффициент текущей ликвидности.")
        if quick_ratio < 0.7:
            print("  - Низкий коэффициент быстрой ликвидности.")

    if simple_ytm < 5:
        recommendation = "Не покупать"
        print("\nВНИМАНИЕ: Низкая доходность")

    print(f"\nРекомендация: {recommendation}")

if __name__ == "__main__":
    analyze_bond()