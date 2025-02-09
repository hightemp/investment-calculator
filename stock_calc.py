def calculate_pe_ratio(market_price, earnings_per_share):
    return market_price / earnings_per_share

def calculate_pb_ratio(market_price, book_value_per_share):
    return market_price / book_value_per_share

def calculate_ps_ratio(market_price, revenue_per_share):
    return market_price / revenue_per_share

def calculate_dividend_yield(annual_dividend, market_price):
    return (annual_dividend / market_price) * 100

def calculate_debt_to_equity_ratio(total_debt, equity):
    return total_debt / equity

def calculate_roe(net_income, equity):
    return net_income / equity

def analyze_stock():
    print("Введите данные об акции:")
    try:
        market_price = float(input("Текущая рыночная цена акции: "))
        earnings_per_share = float(input("Прибыль на акцию (EPS): "))
        book_value_per_share = float(input("Балансовая стоимость на акцию: "))
        revenue_per_share = float(input("Выручка на акцию: "))
        annual_dividend = float(input("Годовой дивиденд на акцию: "))
    except ValueError:
        print("Ошибка: Введены некорректные данные об акции.")
        return

    print("\nВведите данные о компании:")
    try:
        total_debt = float(input("Общий долг: "))
        equity = float(input("Собственный капитал: "))
        net_income = float(input("Чистая прибыль: "))
    except ValueError:
        print("Ошибка: Введены некорректные данные о компании.")
        return

    pe_ratio = calculate_pe_ratio(market_price, earnings_per_share)
    pb_ratio = calculate_pb_ratio(market_price, book_value_per_share)
    ps_ratio = calculate_ps_ratio(market_price, revenue_per_share)
    dividend_yield = calculate_dividend_yield(annual_dividend, market_price)
    d_e_ratio = calculate_debt_to_equity_ratio(total_debt, equity)
    roe = calculate_roe(net_income, equity)

    print("\nРезультаты анализа:")
    print(f"P/E: {pe_ratio:.2f}")
    print(f"P/B: {pb_ratio:.2f}")
    print(f"P/S: {ps_ratio:.2f}")
    print(f"Дивидендная доходность: {dividend_yield:.2f}%")
    print(f"Коэффициент долговой нагрузки (D/E): {d_e_ratio:.2f}")
    print(f"Рентабельность собственного капитала (ROE): {roe:.2f}%")

    recommendation = "Покупать"
    
    if pe_ratio > 25 or pb_ratio > 4 or ps_ratio > 5:
      recommendation = "Не покупать"
      print("\nВНИМАНИЕ: Акция переоценена по мультипликаторам!")
      if pe_ratio > 25:
        print(f"  - Высокий P/E ({pe_ratio:.2f}). Средний по рынку около 15-20")
      if pb_ratio > 4:
        print(f"  - Высокий P/B ({pb_ratio:.2f}). Средний по рынку около 1-3")
      if ps_ratio > 5:
        print(f"  - Высокий P/S ({ps_ratio:.2f}). Средний по рынку около 1-2")

    if d_e_ratio > 2 or roe < 10:
        recommendation = "Не покупать"
        print("\nВНИМАНИЕ: Высокая долговая нагрузка или низкая рентабельность!")
        if d_e_ratio > 2:
            print(f"  - Высокий коэффициент долговой нагрузки (D/E): {d_e_ratio:.2f}. Рекомендуется ниже 2.")
        if roe < 10:
            print(f"  - Низкая рентабельность собственного капитала (ROE): {roe:.2f}%. Рекомендуется выше 10-15%.")

    if dividend_yield < 2:
        print("\nВНИМАНИЕ: Низкая дивидендная доходность!")

    print(f"\nРекомендация: {recommendation}")

if __name__ == "__main__":
    analyze_stock()