const prisma = require("../config/prisma");

class UserData {
  async findByEmail(email) {
    return prisma.user.findUnique({ where: { email } });
  }

  async createUser({ email, passwordHash, name }) {
    return prisma.user.create({
      data: { email, passwordHash, name },
    });
  }
}

module.exports = new UserData();