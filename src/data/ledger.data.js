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

    try {
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
    } catch (error) {
      throw error;
    }
  }

  async listTransactionsByUserId(userId) {
    if (!userId) {
      return [];
    }

    try {
      return await getPrisma().rawTransaction.findMany({
        where: { userId },
        orderBy: [{ txnDate: "desc" }, { sourceRow: "desc" }],
        select: {
          id: true,
          txnDate: true,
          txnType: true,
          amount: true,
          balance: true,
          annotation: {
            select: {
              id: true,
              note: true,
              entityId: true,
              categoryId: true,
              entity: {
                select: {
                  id: true,
                  name: true,
                },
              },
              category: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new LedgerData();
