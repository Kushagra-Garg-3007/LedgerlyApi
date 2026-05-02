const prisma = require("../config/prisma");

class UserData {
  async findByEmail(email) {
    try {
      const result = await prisma.user.findUnique({ where: { email } });
      return result;
    } catch (error) {
      throw error;
    }
  }

  async createUser({ email, passwordHash, name }) {
    try {
      const result = await prisma.user.create({
        data: { email, passwordHash, name },
      });
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new UserData();