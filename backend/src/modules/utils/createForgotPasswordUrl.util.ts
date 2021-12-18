import { v4 } from "uuid";
import { redis } from "redis";
import { forgotPasswordPrefix } from "modules/constants/redisPrefixes";

export const createForgotPasswordUrl = async (userId: string) => {
  const token = v4();
  await redis.set(forgotPasswordPrefix + token, userId, "ex", 60 * 15); // 15 minutes

  return process.env.BASE_URL + `/user/resetpassword/${token}`;
};
