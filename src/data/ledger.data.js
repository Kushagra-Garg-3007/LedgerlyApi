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

  async listTransactionsByUserId({
    userId,
    startDate,
    endDate,
    page,
    limit,
    type,
    categoryId,
    sortDirection = 'desc',
  }) {
    const skip = (page - 1) * limit;

    const where = {
      userId,
      txnDate: {
        gte: startDate,
        lte: endDate,
      },
    };

    if (type) {
      where.txnType = type;
    }

    if (categoryId) {
      where.annotation = {
        is: {
          categoryId,
        },
      };
    }

    const [transactions, totalItems] =
      await getPrisma().$transaction([
        getPrisma().rawTransaction.findMany({
          where,
          skip,
          take: limit,
          orderBy: [
            { txnDate: sortDirection },
            { sourceRow: sortDirection },
          ],
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
        }),

        getPrisma().rawTransaction.count({
          where,
        }),
      ]);

    return {
      transactions,
      totalItems,
    };
  }
}

module.exports = new LedgerData();
