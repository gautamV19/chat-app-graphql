import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import { buildSchema } from "type-graphql";
import dotenv from "dotenv";
import { createConnection } from "typeorm";

import UserResolver from "./Resolvers/UserResolver";
import User from "./Models/User";
import Message from "./Models/Message";
import Group from "./Models/Group";

dotenv.config({ path: "./config.env" });

const main = async () => {
  const schema = await buildSchema({
    resolvers: [UserResolver],
  });
  const server = new ApolloServer({
    schema,
  });

  server
    .listen(7500)
    .then(({ url }) => {
      console.log(`🚀  Server ready at ${url}`);
    })
    .catch((e) => {
      console.log(`error in running the server ${e}`);
    });
};

createConnection({
  type: "postgres",
  url: process.env.DATABASE_URL,
  synchronize: true,
  logging: true,
  entities: [User, Group, Message],
})
  .then(() => {
    console.log("Database Connected");
    main();
  })
  .catch((e) => {
    console.log(`error in connecting the db ${e}`);
  });
