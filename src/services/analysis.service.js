const analysisData = require("../data/analysis.data");
const { AnalysisDtoSchema } = require("../models/dtos/analysisSummary.dto");

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
