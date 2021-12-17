import * as FieldErrors from "constants/fieldErrors";
import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { UserResponse } from "types/user/UserResponse.type";
import { RequestContext } from "types/RequestContext";
import { UserSession } from "types/user/UserSession.type";
import { verify } from "argon2";
import { isAuth } from "../middleware/auth.middleware";
import { User } from "entity/user.entity";

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

    if (passwordIsCorrect) {
      (ctx.req.session as UserSession).userId = user.id; // login user
      return { user };
    }

    return {
      errors: [FieldErrors.INVALID_CREDENTIALS],
    };
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
}
