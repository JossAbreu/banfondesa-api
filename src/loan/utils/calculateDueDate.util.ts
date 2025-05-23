// Método para calcular la fecha de vencimiento
export function calculateDueDate(startDate: Date, installmentNumber: number): Date {
    const due = new Date(startDate);
    due.setMonth(due.getMonth() + installmentNumber);
    return due;
}