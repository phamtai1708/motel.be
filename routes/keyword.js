import { Router } from "express";
import dotenv from "dotenv";
import keywordController from "../controllers/keyword.js";
dotenv.config();




const KeywordRouter = Router();

KeywordRouter.get("/",keywordController.allKeyword);
KeywordRouter.get("/last", keywordController.getLastKeyword);
KeywordRouter.post("/createKeyword",keywordController.createKeyword);



export default KeywordRouter;
