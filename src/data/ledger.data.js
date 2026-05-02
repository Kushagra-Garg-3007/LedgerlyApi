function getPrisma() {
  return require("../config/prisma");
}

class LedgerData {
  async getSummaryByUserId(userId) {
    if (!userId) {
      return {
        totalDebit: 0,
        totalCredit: 0,
        transactionCount: 0,
      };
    }

    const [debitAgg, creditAgg, transactionCount] = await Promise.all([
      getPrisma().rawTransaction.aggregate({
        where: { userId, txnType: "DEBIT" },
        _sum: { amount: true },
      }),
      getPrisma().rawTransaction.aggregate({
        where: { userId, txnType: "CREDIT" },
        _sum: { amount: true },
      }),
      getPrisma().rawTransaction.count({ where: { userId } }),
    ]);

    return {
      totalDebit: Number(debitAgg._sum.amount || 0),
      totalCredit: Number(creditAgg._sum.amount || 0),
      transactionCount,
    };
  }
}

module.exports = new LedgerData();
