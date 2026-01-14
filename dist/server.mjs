import {
  uploadImageRoute
} from "./chunk-IPSREKXZ.mjs";
import "./chunk-KY6VS4RU.mjs";
import "./chunk-D7BEHAO5.mjs";
import "./chunk-7VYRV3HJ.mjs";

// src/server.ts
import { fastify } from "fastify";
import { fastifyCors } from "@fastify/cors";
import { fastifyMultipart } from "@fastify/multipart";
var server = fastify();
server.register(fastifyCors, {
  origin: "*"
});
server.register(fastifyMultipart);
server.register(uploadImageRoute);
server.listen({ port: 3333, host: "0.0.0.0" }).then(() => {
  console.log("HTTP server running!");
});
