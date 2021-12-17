import { Field, ObjectType } from "type-graphql";
import { FieldError } from "./FieldError.type";
import { User } from "../../entity/user.entity";

@ObjectType()
export class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}
