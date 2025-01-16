import { react } from "./react";
import { babel } from "./babel";
import { awsSdk } from "./awsSdk";
import { jest } from "./jest";
import { pulumi } from "./pulumi";
import { fastify } from "./fastify";
import { rmwc } from "./rmwc";

export const presets = [react, babel, awsSdk, jest, pulumi, fastify, rmwc];
