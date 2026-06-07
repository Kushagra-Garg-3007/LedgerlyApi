const analysisData = require("../data/analysis.data");
const { AnalysisDtoSchema } = require("../models/dtos/analysisSummary.dto");
const {InsightsDtoSchema} = require("../models/dtos/insight.dto")

class AnalysisService {

    async getAnalysisForMonth(fromDate, toDate, userId) 
    {
        const transactions = await analysisData.getTransactionsForAnalysis(fromDate, toDate, userId);
        
        const result = {
            totalIncome: 0,
            totalExpense: 0,
            incomeSources: new Map(),
            expenseCategories: new Map(),
            merchants: new Map()
        };

        for(let transaction of transactions){
            const amount = Number(transaction.amount);
            const category = transaction.annotation.category.name;
            if(transaction.txnType == "CREDIT"){
                result.totalIncome += amount;
                result.incomeSources.set(
                    category,
                    (result.incomeSources.get(category) || 0) + amount
                );
            }
            else {
                result.totalExpense += amount
                result.expenseCategories.set(
                    category,
                    (result.expenseCategories.get(category) || 0) + amount
                );
            
                const merchant = transaction.annotation.entity.name;

                result.merchants.set(
                    merchant,
                    (result.merchants.get(merchant) || 0) + amount
                );
            }
        }
        const incomeSources = mapToPercentageArray(result.incomeSources, result.totalIncome);
        const expenseCategories = mapToPercentageArray(result.expenseCategories, result.totalExpense);
        const topMerchants = mapToPercentageArray(result.merchants, result.totalExpense).sort((a, b) => b.amount - a.amount).slice(0, 5);

        const analysis = {
            summary: {
                totalIncome: Number(result.totalIncome.toFixed(2)),
                totalExpense: Number(result.totalExpense.toFixed(2)),
                netSavings: Number((result.totalIncome - result.totalExpense).toFixed(2))
            },
            incomeSources,
            expenseCategories,
            topMerchants
        }

        return AnalysisDtoSchema.parse(analysis);
    }

    async getInsights(currentPeriodStartDate, currentPeriodEndDate, previousPeriodStartDate, previousPeriodEndDate, userId)
    {
        const currentData = await analysisData.getInsightData(currentPeriodStartDate, currentPeriodEndDate, userId);

        const previousData = await analysisData.getInsightData(previousPeriodStartDate, previousPeriodEndDate, userId);

        const currentMonthCount = new Set(currentData.map(x => x.txnMonth)).size || 1;

        const previousMonthCount = new Set(previousData.map(x => x.txnMonth)).size || 1;

        const currentDataDict = new Map();

        for (const item of currentData) {
            const key = `${item.categoryName}|${item.txnType}`;

            currentDataDict.set(
            key,
            (currentDataDict.get(key) || 0) + Number(item.txnValue)
            );
        }

        const previousDataDict = new Map();

        for (const item of previousData) {
            const key = `${item.categoryName}|${item.txnType}`;

            previousDataDict.set(
            key,
            (previousDataDict.get(key) || 0) + Number(item.txnValue)
            );
        }

        const result = {
            summary: {
            totalImprovedCategories: 0,
            totalAttentionCategories: 0,
            totalImprovedIncomeSources: 0
            },
            spendingImproved: [],
            spendingIncreased: [],
            incomeChanges: []
        };

        const processedKeys = new Set();

        // Current period categories
        for (const [key, currentTotal] of currentDataDict) {
            processedKeys.add(key);

            const [name, txnType] = key.split("|");

            const previousTotal = previousDataDict.get(key) || 0;

            const currentAverage = currentTotal / currentMonthCount;

            const previousAverage = previousTotal / previousMonthCount;

            const difference = currentAverage - previousAverage;

            const percentageChange = previousAverage === 0 ? null : Number(((difference / previousAverage) * 100).toFixed(2));

            const insight = {
                name,
                txnType,
                currentAverage: Number(currentAverage.toFixed(2)),
                previousAverage: Number(previousAverage.toFixed(2)),
                difference: Number(difference.toFixed(2)),
                percentageChange,
                isNew: previousAverage === 0 && currentAverage > 0
            };

            if (txnType === "DEBIT") {
                if (difference < 0) {
                    result.summary.totalImprovedCategories++;
                    result.spendingImproved.push(insight);
                } else if (difference > 0) {
                    result.summary.totalAttentionCategories++;
                    result.spendingIncreased.push(insight);
                }
            } else {
                if (difference > 0) {
                    result.summary.totalImprovedIncomeSources++;
                }
                result.incomeChanges.push(insight);
            }
        }

        // Categories present only in previous period
        for (const [key, previousTotal] of previousDataDict) {
            if (processedKeys.has(key)) {
                continue;
            }

            const [name, txnType] = key.split("|");

            const previousAverage = previousTotal / previousMonthCount;

            const insight = {
                name,
                txnType,
                currentAverage: 0,
                previousAverage: Number(previousAverage.toFixed(2)),
                difference: Number((-previousAverage).toFixed(2)),
                percentageChange: -100,
                isRemoved: true
            };

            if (txnType === "DEBIT") {
                result.summary.totalImprovedCategories++;
                result.spendingImproved.push(insight);
            } else {
                result.incomeChanges.push(insight);
            }
        }

        result.spendingImproved.sort((a, b) => a.difference - b.difference);

        result.spendingIncreased.sort((a, b) => b.difference - a.difference);

        result.incomeChanges.sort((a, b) => Math.abs(b.difference) - Math.abs(a.difference));

        return InsightsDtoSchema.parse(result);
    }
}

function mapToPercentageArray(map, total) {
  return [...map.entries()].map(([name, amount]) => ({
    name,
    amount: Number(amount.toFixed(2)),
    percentage:
      total === 0 ? 0 : Number(((amount / total) * 100).toFixed(2))
  }));
}

module.exports = new AnalysisService();
