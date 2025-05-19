import { Router } from "express";
import UserRouter from "./user.js";
import LandRouter from "./land.js";
import RoomRouter from "./room.js";
import KeywordRouter from "./keyword.js";

const RootRouterV1 = Router();

RootRouterV1.use("/users", UserRouter);
RootRouterV1.use("/lands", LandRouter);
RootRouterV1.use("/rooms", RoomRouter);
RootRouterV1.use("/keyword", KeywordRouter);
export default RootRouterV1;
