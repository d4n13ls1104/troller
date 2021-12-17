import * as FieldErrors from "constants/fieldErrors";
import { RequestContext } from "types/RequestContext";
import { UserResponse } from "types/user/UserResponse.type";
import { hash, verify } from "argon2";
import { UserSession } from "types/user/UserSession.type";
import { isAuth } from "modules/middleware/auth.middleware";
import { User } from "entity/user.entity";
import {
  Resolver,
  Mutation,
  Arg,
  Query,
  Ctx,
  UseMiddleware,
} from "type-graphql";
import {
  LoginInput,
  loginValidationSchema,
} from "types/user/login/LoginInput.type";
import {
  RegisterInput,
  registerValidationSchema,
} from "types/user/register/RegisterInput.type";
import { Profile } from "../../entity/profile.entity";

@Resolver()
export class UserResolver {
  @Mutation(() => UserResponse)
  async register(@Arg("data") data: RegisterInput): Promise<UserResponse> {
    try {
      await registerValidationSchema.validate(data);
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

    const emailAlreadyRegistered = !!(await User.findOne({
      where: { email: data.email },
    }));

    const usernameAlreadyRegistered = !!(await User.findOne({
      where: { username: data.username },
    }));

    if (emailAlreadyRegistered) {
      return {
        errors: [FieldErrors.EMAIL_ALREADY_REGISTERED],
      };
    }

    if (usernameAlreadyRegistered) {
      return {
        errors: [FieldErrors.USERNAME_ALREADY_REGISTERED],
      };
    }

    const hashedPassword = await hash(data.password);

    const user = User.create({
      email: data.email,
      username: data.username,
      password: hashedPassword,
    });

    const profile = Profile.create({
      name: user.username,
    });

    user.profile = profile;

    await user.save();

    if (!user) {
      return {
        errors: [FieldErrors.GENERIC_FIELD_ERROR],
      };
    }

    return { user };
  }

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

  @UseMiddleware(isAuth)
  @Query(() => UserResponse)
  async me(@Ctx() ctx: RequestContext): Promise<UserResponse> {
    const user = await User.findOne({
      id: (ctx.req.session as UserSession).userId,
    });

    if (!user) {
      return {
        errors: [FieldErrors.GENERIC_FIELD_ERROR],
      };
    }

    return { user };
  }
}
