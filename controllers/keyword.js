import KeywordModel from "../models/keyword.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { SecretKey } from "../middlewares/token.js";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();



const keywordController = {
  allKeyword: async (req, res) => {
    try {
      const allKeyword = await KeywordModel.find();
      res.status(200).send({
        message: "Success",
        data: allKeyword,
      });
    } catch (error) {
      res.status(500).send({
        message: error.message,
        data: null,
      });
    }
  },

  getLastKeyword: async (req, res) => {
    try {
      const lastKeyword = await KeywordModel.findOne().sort({ _id: -1 });
      res.status(200).send({
        message: "Success",
        data: lastKeyword,
      });
    } catch (error) {
      res.status(500).send({
        message: error.message,
        data: null,
      });
    }
  },

  createKeyword: async (req, res) => {
    try {
      const { keyword, content } = req.body;

      // Validate input
      if (!Array.isArray(keyword) || !Array.isArray(content)) {
        return res.status(400).send({
          message: "Keyword and content must be arrays",
          data: null,
        });
      }

      if (keyword.length !== 10) {
        return res.status(400).send({
          message: "Keyword array must contain exactly 10 items",
          data: null,
        });
      }

      if (keyword.length !== content.length) {
        return res.status(400).send({
          message: "Number of keywords must match number of content items",
          data: null,
        });
      }

      // Create a single document containing all keywords and their content
      const newKeyword = await KeywordModel.create({
        keyword: keyword,
        content: content
      });

      res.status(200).send({
        message: "Success",
        data: newKeyword,
      });
    } catch (error) {
      res.status(500).send({
        message: error.message,
        data: null,
      });
    }
  },
  
};

export default keywordController;
