import * as yup from "yup";
import { Field, InputType } from "type-graphql";

@InputType()
export class ResetPasswordInput {
  @Field()
  token: string;

  @Field()
  password: string;
}

export const passwordValidationSchema = yup.string().min(8).max(255).required();
