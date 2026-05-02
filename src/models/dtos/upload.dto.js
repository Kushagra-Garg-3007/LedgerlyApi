const { z } = require("zod");

const UploadDtoSchema = z.object({
  id: z.string().min(1),
  userId: z.string().min(1),
  fileName: z.string().min(1),
  fileType: z.enum(["CSV", "XLS", "XLSX"]),
  uploadStatus: z.enum(["PENDING", "PROCESSED", "FAILED"]),
  uploadedAt: z.coerce.date(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

module.exports = {
  UploadDtoSchema,
};
