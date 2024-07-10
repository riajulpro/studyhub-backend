import jwt from "jsonwebtoken";

export const createAcessToken = (user: object, expires: string) => {
  return jwt.sign({ user }, process.env.JWT_ACCESS_SECRET as string, {
    expiresIn: expires,
  });
};
export const createRefreshToken = (user: object) => {
  return jwt.sign({ user }, process.env.JWT_REFRESH_SECRET as string, {
    expiresIn: "30 days",
  });
};
export const createForgotPasswordToken = (email: string) => {
  return jwt.sign({ email }, process.env.JWT_RESET_SECRET as string, {
    expiresIn: "5m",
  });
};
