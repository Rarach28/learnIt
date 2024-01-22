const { Set, TestRun } = require("../Models/SetModel");
const User = require("../Models/UserModel");
const { createSecretToken, verifySecretToken } = require("../util/SecretToken");
// const bcrypt = require("bcryptjs");
const bcrypt = require("bcrypt");

module.exports.Learn = async (req, res) => {
  const setId = req.params.setId;
  const randomOrder = req.params.randomOrder;

  try {
    const token = req.cookies.token;
    const decodedToken = verifySecretToken(token);
    const userId = decodedToken.id;
    // Get the set
    // const setRes = await Set.findOne({ "sets.number": Number(setNumber) });
    const setRes = await Set.findOne({
      sets: {
        $elemMatch: { _id: setId },
      },
    }).lean();

    if (!setRes) {
      // If set is not found, return an error response
      return res.status(404).json({
        data: {},
        message: "1: Set not found for: " + setId,
      });
    }

    const set = setRes?.sets?.find((set) => set._id == setId);

    if (!set) {
      // If the set with the specified number is not found, return an error response
      return res.status(404).json({
        data: {},
        message: "2:Set not found for: " + setId,
      });
    }

    // in each set, find the question and filter out the wrong options
    const questions = set.questions.map((question) => {
      const options = question.options.filter((option) => option.correct);
      return { ...question, options };
    });
    if (randomOrder == 1) {
      questions.sort(() => Math.random() - 0.5);
    }
    set.questions = questions;

    res.status(200).json({
      data: {
        set: set,
      },
    });
  } catch (error) {
    console.error("Error in Learn:", error);
    res.status(500).json({
      data: {},
      message: "Error in Learn",
    });
  }
};
