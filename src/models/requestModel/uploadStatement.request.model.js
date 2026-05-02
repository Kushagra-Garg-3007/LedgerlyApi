const { z } = require("zod");

const UploadStatementSchema = z.object({
  userId: z.string().min(1),
  file: z.object({
    originalname: z.string().min(1),
  }),
});

module.exports = {
  UploadStatementSchema,
};
