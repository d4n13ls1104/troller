import { Field, ObjectType } from "type-graphql";
import { User } from "entity/user.entity";
import { FieldError } from "./FieldError.type";

@ObjectType()
export class GenericResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => Boolean)
  ok?: boolean;
}

@ObjectType()
export class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}
