const userData = require("../data/user.data");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const env = require("../config/env");
const { UserDtoSchema } = require("../models/dtos/user.dto");

function toUserDto(user) {
  return UserDtoSchema.parse({
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  });
}

class AuthService {
  async signup(payload) {
    const existingUser = await userData.findByEmail(payload.email);
    if (existingUser) {
      return {
        status: "conflict",
        user: null,
      };
    }

    const passwordHash = await bcrypt.hash(payload.password, 10);
    const createdUser = await userData.createUser({
      name: payload.name,
      email: payload.email,
      passwordHash,
    });

    return {
      status: "created",
      user: toUserDto(createdUser),
    };
  }

  async login(payload) {
    const user = await userData.findByEmail(payload.email);
    if (!user) {
      return {
        status: "unauthorized",
        user: null,
        token: null,
      };
    }

    const passwordMatches = await bcrypt.compare(payload.password, user.passwordHash);
    if (!passwordMatches) {
      return {
        status: "unauthorized",
        user: null,
        token: null,
      };
    }

    const userDto = toUserDto(user);
    const token = jwt.sign(
      {
        id: userDto.id,
        email: userDto.email,
        name: userDto.name,
      },
      env.jwtSecret,
      { expiresIn: "7d" },
    );

    return {
      status: "authenticated",
      user: userDto,
      token,
    };
  }

  async findUserByEmail(email) {
    const user = await userData.findByEmail(email);
    if (!user) {
      return null;
    }

    return toUserDto(user);
  }
}

module.exports = new AuthService();
