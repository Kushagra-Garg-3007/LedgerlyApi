const { z } = require("zod");

const UploadStatementSchema = z.object({
  userId: z.string().min(1),
  file: z.object({
    originalname: z.string().min(1),
    path: z.string().min(1),
    mimetype: z.enum([
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ]),
  }),
}).refine(
  ({ file }) => {
    const extension = file.originalname.split(".").pop()?.toLowerCase();
    return extension === "xls" || extension === "xlsx";
  },
  {
    path: ["file", "originalname"],
    message: "Only .xls or .xlsx files are allowed",
  },
);

module.exports = {
  UploadStatementSchema,
};
