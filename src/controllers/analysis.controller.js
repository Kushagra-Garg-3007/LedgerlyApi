const asyncHandler = require("../utils/asyncHandler");
const analysisService = require("../services/analysis.service");

class UploadController {

  constructor() {
    this.getAnalysisForMonth = asyncHandler(this.getAnalysisForMonth.bind(this));
    this.getInsights = asyncHandler(this.getInsights.bind(this));
  }

  async getAnalysisForMonth(req, res) {

    let {fromDate, toDate} = req.query;

    const date = new Date();

    fromDate = !fromDate ? new Date(date.getFullYear(), date.getMonth(), 1) : new Date(fromDate);
    toDate = !toDate ? new Date(date.getFullYear(), date.getMonth()+1, 0) : new Date(toDate);
    
    toDate.setHours(23,59,59);

    const analysis = await analysisService.getAnalysisForMonth(fromDate, toDate, req.user.id);

    return res.status(201).json(analysis);
  }

  async getInsights(req, res) {

    let {currentPeriodStartDate, currentPeriodEndDate, previousPeriodStartDate, previousPeriodEndDate} = req.query;

    const date = new Date();

    if (currentPeriodStartDate || previousPeriodStartDate){
        currentPeriodStartDate = new Date(currentPeriodStartDate);
        previousPeriodStartDate = new Date(previousPeriodStartDate);
    }
    if (currentPeriodEndDate || previousPeriodEndDate){
        currentPeriodEndDate = new Date(currentPeriodEndDate);
        previousPeriodEndDate = new Date(previousPeriodEndDate);
        currentPeriodEndDate.setHours(23,59,59);
        previousPeriodEndDate.setHours(23,59,59);
    }

    const analysis = await analysisService.getInsights(currentPeriodStartDate, currentPeriodEndDate, previousPeriodStartDate, previousPeriodEndDate, req.user.id);

    return res.status(201).json(analysis);
  }
}

module.exports = new UploadController();
