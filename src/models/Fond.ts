
export class Fond {

    add_payment(payment: FondPayment) {
        this.overallAmount += payment.amount;
    }

    overallAmount: number;
    paymentDate: Date;


    constructor(overallAmount: number, paymentDate: Date) {
        this.overallAmount = overallAmount;
        this.paymentDate = paymentDate;
    }
}

export class FondPayment {
    amount: number;
    date: Date;

    constructor(amount: number, date: Date) {
        this.amount = amount;
        this.date = date;
    }
}
