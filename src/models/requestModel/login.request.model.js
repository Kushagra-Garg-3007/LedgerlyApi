const { z } = require("zod");

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

module.exports = {
  LoginSchema,
};
