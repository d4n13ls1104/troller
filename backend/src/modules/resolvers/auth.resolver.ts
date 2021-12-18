import * as FieldErrors from "modules/constants/fieldErrors";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { createForgotPasswordUrl } from "modules/utils/createForgotPasswordUrl.util";
import { createConfirmationUrl } from "modules/utils/createConfirmationUrl.util";
import { UserResponse } from "types/user/UserResponse.type";
import { RequestContext } from "types/RequestContext";
import { UserSession } from "types/user/UserSession.type";
import { sendEmail } from "modules/utils/sendEmail.util";
import { hash, verify } from "argon2";
import { User } from "entity/user.entity";
import { redis } from "redis";

import {
  confirmUserPrefix,
  forgotPasswordPrefix,
} from "modules/constants/redisPrefixes";

import {
  LoginInput,
  loginValidationSchema,
} from "types/user/login/LoginInput.type";
import {
  passwordValidationSchema,
  ResetPasswordInput,
} from "types/user/resetPassword/ResetPasswordInput.type";

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

  @Mutation(() => Boolean)
  logout(@Ctx() ctx: RequestContext) {
    ctx.req.session.destroy(() => true); // i have to return true to escape the callback function because express-session is retarded and uses fucking callbacks instead of promises
    ctx.res.clearCookie("qid");

    return true;
  }

  @Mutation(() => Boolean)
  async confirmEmail(@Arg("token") token: string): Promise<boolean> {
    const userId = await redis.get(confirmUserPrefix + token);

    if (!userId) return false;

    await User.update({ id: userId }, { confirmedEmail: true });
    await redis.del(confirmUserPrefix + token);

    return true;
  }

  @Mutation(() => UserResponse)
  async resetPassword(
    @Arg("data") data: ResetPasswordInput
  ): Promise<UserResponse> {
    try {
      await passwordValidationSchema.validate(data.password);
    } catch (err) {
      return {
        errors: [
          {
            field: err.path,
            message: err.message,
          },
        ],
      };
    }
    const userId = await redis.get(forgotPasswordPrefix + data.token);

    const user = await User.findOne({ where: { id: userId } });

    if (!userId || !user) {
      return {
        errors: [FieldErrors.INVALID_TOKEN],
      };
    }

    const hashedPassword = await hash(data.password);

    await User.update({ id: user.id }, { password: hashedPassword });
    await redis.del(forgotPasswordPrefix + data.token);

    return { user };
  }

  @Mutation(() => Boolean)
  async forgotPassword(@Arg("email") email: string): Promise<boolean> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return true;
    }

    const passwordResetUrl = await createForgotPasswordUrl(user.id);

    sendEmail({
      from: "<noreply@chat.sandtee.ml>",
      to: user.email,
      subject: "Password reset",
      text: "test",
      html: `<h1>We received a request to reset your password</h1><p>If this was not you ignore this email.</p><br/><a href="${passwordResetUrl}">${passwordResetUrl}</a>`,
    });

    return true;
  }
}
