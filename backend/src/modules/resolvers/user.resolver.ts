import * as FieldErrors from "modules/constants/fieldErrors";
import { RequestContext } from "types/RequestContext";
import { UserResponse } from "types/user/UserResponse.type";
import { hash } from "argon2";
import { UserSession } from "types/user/UserSession.type";
import { Profile } from "entity/profile.entity";
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
  RegisterInput,
  registerValidationSchema,
} from "types/user/register/RegisterInput.type";
import { usernameValidationSchema } from "types/user/changeUsername/usernameValidationSchema";

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

  @UseMiddleware(isAuth)
  @Mutation(() => UserResponse)
  async changeUsername(
    @Arg("username") username: string,
    @Ctx() ctx: RequestContext
  ): Promise<UserResponse> {
    try {
      usernameValidationSchema.validate(username);
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

    const { userId } = ctx.req.session as UserSession;

    const user = await User.findOne(userId);

    if (!user) {
      return {
        errors: [FieldErrors.GENERIC_FIELD_ERROR],
      };
    }

    user.username = username;
    await user.save();

    return { user };
  }
}
