import * as FieldErrors from "modules/constants/fieldErrors";
import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { createConfirmationUrl } from "modules/utils/createConfirmationUrl.util";
import { UserResponse } from "types/user/UserResponse.type";
import { confirmUserPrefix } from "modules/constants/redisPrefixes";
import { RequestContext } from "types/RequestContext";
import { UserSession } from "types/user/UserSession.type";
import { sendEmail } from "modules/utils/sendEmail.util";
import { verify } from "argon2";
import { isAuth } from "modules/middleware/auth.middleware";
import { User } from "entity/user.entity";
import { redis } from "redis";

import {
  LoginInput,
  loginValidationSchema,
} from "types/user/login/LoginInput.type";

@Resolver()
export class AuthResolver {
  @Mutation(() => UserResponse)
  async login(
    @Arg("data") data: LoginInput,
    @Ctx() ctx: RequestContext
  ): Promise<UserResponse> {
    try {
      await loginValidationSchema.validate(data);
    } catch (err) {
      return {
        errors: [
          {
            field: err.path,
            message: err.errors[0],
          },
        ],
      };
    }

    const user = await User.findOne({ where: { email: data.email } });

    if (!user) {
      return {
        errors: [FieldErrors.EMAIL_NOT_REGISTERED],
      };
    }

    const passwordIsCorrect = await verify(user.password, data.password);

    if (!passwordIsCorrect) {
      return {
        errors: [FieldErrors.INVALID_CREDENTIALS],
      };
    }

    if (!user.confirmedEmail) {
      const confirmationUrl = await createConfirmationUrl(user.id);
      await sendEmail({
        from: `<noreply@chat.sandtee.ml>`,
        to: user.email,
        subject: "Please confirm your email",
        text: "Test",
        html: `<a href="${confirmationUrl}">${confirmationUrl}</a>`,
      });
      return {
        errors: [FieldErrors.UNCONFIRMED_EMAIL],
      };
    }

    (ctx.req.session as UserSession).userId = user.id; // login user
    return { user };
  }

  @Mutation(() => UserResponse)
  @UseMiddleware(isAuth)
  @Mutation(() => Boolean)
  async logout(@Ctx() ctx: RequestContext): Promise<boolean> {
    return new Promise((resolve, reject) => {
      ctx.req.session.destroy((err) => {
        if (err) {
          console.error(err);
          return reject(false);
        }

        ctx.res.clearCookie("qid");
        return resolve(true);
      });
    });
  }

  @Mutation(() => Boolean)
  async confirmEmail(@Arg("token") token: string): Promise<boolean> {
    const userId = await redis.get(confirmUserPrefix + token);

    if (!userId) return false;

    await User.update({ id: userId }, { confirmedEmail: true });
    await redis.del(confirmUserPrefix + token);

    return true;
  }
}
