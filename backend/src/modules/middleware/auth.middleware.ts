import { MiddlewareFn } from "type-graphql";
import { RequestContext } from "types/RequestContext";
import { UserSession } from "types/user/UserSession.type";

export const isAuth: MiddlewareFn<RequestContext> = async (
  { context },
  next
) => {
  if (!(context.req.session as UserSession).userId)
    throw Error("Not authenticated");

  return next();
};
