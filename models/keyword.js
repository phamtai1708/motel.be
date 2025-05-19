import mongoose from "mongoose";

const keywordSchema = new mongoose.Schema({
  keyword:Array,
  content:Array,
  
  
  
});

const KeywordModel = mongoose.model("keyword", keywordSchema);
export default KeywordModel;
