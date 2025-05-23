import { calculateDueDate } from '@loan/utils/calculateDueDate.util';



export function generateAmortization(
    amount: number,
    term: number,
    interest: number,
    type: 'fija' | 'variable',
) {
    const monthlyRate = interest / 12;
    type AmortizationEntry = {
        installment: number;
        principal: number;
        interest: number;
        total: number;
        balance: number;
        dueDate: Date;
    };
    const amortization: AmortizationEntry[] = [];
    const startDate = new Date();
    if (type === 'fija') {
        const monthlyPayment =
            (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -term));
        let balance = amount;



        for (let i = 1; i <= term; i++) {
            const interestPayment = balance * monthlyRate;
            const principalPayment = monthlyPayment - interestPayment;
            balance -= principalPayment;

            amortization.push({
                installment: i,
                principal: Number(principalPayment.toFixed(2)),
                interest: Number(interestPayment.toFixed(2)),
                total: Number(monthlyPayment.toFixed(2)),
                balance: Number(Math.max(balance, 0).toFixed(2)),
                dueDate: calculateDueDate(startDate, i),
            });
        }
    } else {
        const fixedPrincipal = amount / term;
        let balance = amount;

        for (let i = 1; i <= term; i++) {
            const interestPayment = balance * monthlyRate;
            const totalPayment = fixedPrincipal + interestPayment;
            balance -= fixedPrincipal;

            amortization.push({
                installment: i,
                principal: Number(fixedPrincipal.toFixed(2)),
                interest: Number(interestPayment.toFixed(2)),
                total: Number(totalPayment.toFixed(2)),
                balance: Number(Math.max(balance, 0).toFixed(2)),
                dueDate: calculateDueDate(startDate, i),
            });
        }
    }

    return amortization;
}