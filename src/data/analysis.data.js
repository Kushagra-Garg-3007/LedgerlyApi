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

    async getInsightData(fromDate, toDate, userId){
        try {
            return await prisma.$queryRaw
            `SELECT
                TO_CHAR(rt.txn_date, 'YYYY-MM') AS "txnMonth",
                c.name AS "categoryName",
                rt.txn_type AS "txnType",
                SUM(rt.amount) AS "txnValue"
            FROM raw_transactions rt
            INNER JOIN transaction_annotations ta
                ON ta.raw_transaction_id = rt.id
            INNER JOIN categories c
                ON c.id = ta.category_id
            WHERE rt.user_id = ${userId}
                AND rt.txn_date BETWEEN ${fromDate} AND ${toDate}
            GROUP BY
                TO_CHAR(rt.txn_date, 'YYYY-MM'),
                c.id,
                rt.txn_type
            ORDER BY
                "txnMonth" ASC;`
        } 
        catch (error) {
            throw new Exception(error.message)
        }
    }
}

module.exports = new AnalysisData()