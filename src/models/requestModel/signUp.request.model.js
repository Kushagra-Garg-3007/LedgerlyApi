const { z } = require("zod");

const SignupSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
});

module.exports = {
  SignupSchema,
};
