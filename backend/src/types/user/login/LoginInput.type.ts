import yup from "yup";
import { Field, InputType } from "type-graphql";

@InputType()
export class LoginInput {
  @Field()
  email: string;

  @Field()
  password: string;
}

export const loginValidationSchema = yup.object().shape({
  email: yup.string().required(),
  password: yup.string().required(),
});
