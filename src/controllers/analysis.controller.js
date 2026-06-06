const asyncHandler = require("../utils/asyncHandler");
const analysisService = require("../services/analysis.service");

class UploadController {
    
  constructor() {
    this.getAnalysisForMonth = asyncHandler(this.getAnalysisForMonth.bind(this));
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
}

module.exports = new UploadController();
