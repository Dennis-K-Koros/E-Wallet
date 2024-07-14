const parseMpesaMessage = (message) => {
    const expensePattern = /Ksh([\d,]+(\.\d{2})?) paid to .* on (\d+\/\d+\/\d+) at (\d+:\d+ (AM|PM))/;
    const incomePattern = /You have received Ksh([\d,]+(\.\d{2})?) from .* on (\d+\/\d+\/\d+) at (\d+:\d+ (AM|PM))/;
    
    let type, amount, date, time;

    if (expensePattern.test(message)) {
        type = 'expense';
        const match = message.match(expensePattern);
        amount = match[1].replace(/,/g, '');
        date = match[3];
        time = match[4];
    } else if (incomePattern.test(message)) {
        type = 'income';
        const match = message.match(incomePattern);
        amount = match[1].replace(/,/g, '');
        date = match[3];
        time = match[4];
    } else {
        return null;
    }

    const dateTime = new Date(`${date} ${time}`);

    return {
        type,
        amount,
        date: dateTime,
        category: 'MPESA',
        paymentMethod: 'M-Pesa',
    };
};

const parseTransactionMessages = (messages) => {
    console.log('Parsing messages:', messages);
    return messages
      .map((message) => parseMpesaMessage(message.body))
      .filter((transaction) => transaction !== null);
  };
