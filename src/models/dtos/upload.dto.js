const { z } = require("zod");
const { DtoIdSchema } = require("../../utils/id.utils");

const UploadDtoSchema = z.object({
  id: DtoIdSchema,
  userId: DtoIdSchema,
  fileName: z.string().min(1),
  fileType: z.enum(["CSV", "XLS", "XLSX"]),
  uploadStatus: z.enum(["PENDING", "PROCESSED", "FAILED"]),
  uploadedAt: z.coerce.date(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  importedRows: z.number().int().nonnegative().optional(),
  rejectedRows: z.number().int().nonnegative().optional(),
});

module.exports = {
  UploadDtoSchema,
};
