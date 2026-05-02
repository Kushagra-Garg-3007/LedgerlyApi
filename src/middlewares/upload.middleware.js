const multer = require("multer");

const ALLOWED_MIME_TYPES = new Set([
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
]);

/**
 * Handle file upload for bank statements.
 * We allow only Excel files and limit size to 10 MB.
 */
const upload = multer({
  dest: "tmp/uploads/",
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (_req, file, callback) => {
    const extension = file?.originalname?.split(".").pop()?.toLowerCase();
    const hasValidExtension = extension === "xls" || extension === "xlsx";
    const hasValidMime = ALLOWED_MIME_TYPES.has(file?.mimetype);

    if (!hasValidExtension || !hasValidMime) {
      return callback(
        Object.assign(new Error("Only .xls or .xlsx files are allowed"), { statusCode: 400 }),
      );
    }

    return callback(null, true);
  },
});

module.exports = {
  uploadStatementFile: upload.single("file"),
};
