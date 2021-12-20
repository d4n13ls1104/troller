import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { redis } from "./redis";
import { RequestContext } from "./types/RequestContext";
import express from "express";
import connectRedis from "connect-redis";
import session from "express-session";
import cors from "cors";
import dotenv from "dotenv";
// import path from "path";

dotenv.config();

const PORT = process.env.ENVIORMENT === "production" ? 80 : 4000;

const SESSION_SECRET = process.env.SESSION_SECRET || "dev_secret";

const bootstrap = async () => {
  await createConnection();

  const schema = await buildSchema({
    resolvers: [__dirname + "/modules/**/*.resolver.{ts,js}"],
  });

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }: RequestContext) => ({ req, res }),
  });

  const app = express();

  const RedisStore = connectRedis(session);

  const sessionOptions: session.SessionOptions = {
    store: new RedisStore({
      client: redis,
    }),
    name: "qid",
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,

    cookie: {
      httpOnly: true,
      secure: process.env.ENVIORMENT === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7 * 365, // 7 years
    },
  };

  // allow api access while testing react
  app.use(
    cors({
      credentials: true,
      origin: "http://localhost:3000",
    })
  );

  app.use(session(sessionOptions));

  // app.use(express.static(path.join(__dirname, "/build/public")));

  // app.get("*", (_req, res) =>
  //   res.sendFile(path.join(__dirname, "/build/public/index.html"))
  // );

  apolloServer.applyMiddleware({ app });

  app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
};

bootstrap();
