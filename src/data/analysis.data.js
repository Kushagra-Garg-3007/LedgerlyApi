const prisma = require("../config/prisma");

class AnalysisData {
    async getTransactionsForAnalysis(fromDate, toDate, userId){
        try {
            return await prisma.rawTransaction.findMany({
                where: {
                    userId,
                    txnDate: {
                        gte: fromDate,
                        lte: toDate
                    }
                },
                select: {
                    id: true,
                    txnDate: true,
                    txnType: true,
                    amount: true,
                    annotation:{
                        select: {
                            entity: {
                                select: {
                                    name: true
                                }
                            },
                            category: {
                                select: {
                                    name: true
                                }
                            }
                        }
                    }
                }
            })
        } catch (error) {
            throw new Exception(error.message);
        }
    }
}

module.exports = new AnalysisData()