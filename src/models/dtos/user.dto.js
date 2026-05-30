const { z } = require("zod");
const { DtoIdSchema } = require("../../utils/id.utils");

const UserDtoSchema = z.object({
  id: DtoIdSchema,
  name: z.string().min(1),
  email: z.string().email(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

module.exports = {
  UserDtoSchema,
};
