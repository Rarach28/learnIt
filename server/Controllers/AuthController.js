const { Set, TestRun } = require("../Models/SetModel");
const User = require("../Models/UserModel");
const { createSecretToken, verifySecretToken } = require("../util/SecretToken");
// const bcrypt = require("bcryptjs");
const bcrypt = require("bcrypt");

module.exports.Signup = async (req, res, next) => {
  try {
    const { email, password, username } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ data: { data: {}, message: "User already exists" } });
    }
    const user = await User.create({
      email: email,
      password: password,
      username: username,
      blocked: false,
      role_id: null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });
    res.status(201).json({
      data: {
        data: {
          success: true,
          user,
        },
        message: "User signed in successfully",
      },
    });
    next();
  } catch (error) {
    console.error(error);
  }
};

module.exports.Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({
        data: { data: {}, message: "All fields are required" },
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        data: { data: {}, message: "Incorrect password or email" },
      });
    }
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return res.json({
        data: {
          data: {},
          message: "Incorrect password or email",
          pass: password,
          userpass: user.password,
        },
      });
    }
    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });
    res.status(201).json({
      data: { data: {}, message: "User logged in successfully", success: true },
    });
    next();
  } catch (error) {
    console.error(error);
  }
};

module.exports.GetUser = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decodedToken = verifySecretToken(token);
    const userId = decodedToken.id;

    const user = await User.findById(userId).lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User found",
      data: {
        user,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" + error });
  }
};

module.exports.UpdateUser = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decodedToken = verifySecretToken(token);
    const userId = decodedToken.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { email, username, password } = req.body;

    if (email) {
      user.email = email;
    }

    if (username) {
      user.username = username;
    }

    if (password && password.length > 0) {
      (user.password = password), 12;
    }

    await user.save();

    res.status(200).json({
      message: "User updated",
      data: {
        user,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.GetAll = async (req, res, next) => {
  try {
    //get all sets
    const sets = await Set.find();
    res.status(201).json({
      data: {
        sets: sets,
      },
    });
    next();
  } catch (error) {
    console.error(error);
  }
};

module.exports.FinishTest = async (req, res, next) => {
  const testRun_id = req.params.runId;

  // Get the test run
  const testRun = await TestRun.findById(testRun_id).lean();
  // // Get the set
  const setRes = await Set.findOne({ "sets._id": testRun.set_id }).lean();

  if (!testRun) {
    // If test run is not found, return an error response
    return res.status(404).json({
      data: {},
      message: "Test run not found for: " + testRun_id,
    });
  }

  if (!setRes) {
    // If set is not found, return an error response
    return res.status(404).json({
      data: {},
      message: "Set not found for: " + testRun.set_id,
    });
  }

  const set = setRes?.sets?.find((set) => set._id === testRun.set_id);

  // Initialize the result object
  const result = {
    questions: [],
    score: 0,
  };

  // Loop through each question in the test run
  for (const question of testRun.questions) {
    // Find the corresponding question in the set
    const setQuestion = set.questions.find(
      (q) => String(q._id) === String(question._id)
    );

    // Initialize questionResult object
    const questionResult = {
      _id: question._id,
      text: question.text,
      score: 0,
      options: [],
    };

    // Combine set options and testRun options
    const combinedOptions = setQuestion.options.map((setOption) => {
      const testRunOption = question.options.find(
        (runOption) => String(runOption._id) === String(setOption._id)
      );

      // Determine if the option is correct
      const isCorrect = setOption.correct === testRunOption.selected;

      // Update the score
      if (isCorrect) {
        questionResult.score += 1;
      }

      return {
        _id: setOption._id,
        text: setOption.text,
        correct: setOption.correct,
        selected: testRunOption.selected,
      };
    });

    // Update questionResult
    questionResult.options = combinedOptions;

    // Update the score
    result.score += questionResult.score;

    // Add questionResult to the result
    result.questions.push(questionResult);
  }
  // update result.score to result.score / number of options
  result.score =
    result.score /
    testRun.questions.reduce((total, q) => total + q.options.length, 0);

  // Update the test run
  testRun.result = result;
  testRun.questions = [];
  testRun.finish = Date.now();
  await TestRun.findByIdAndUpdate(testRun_id, testRun);

  res.status(201).json({
    data: {},
  });
};

module.exports.ResultTest = async (req, res, next) => {
  const testRun_id = req.params.runId;
  const testRun = await TestRun.findById(testRun_id).lean();

  res.status(200).json({
    data: {
      testRun: testRun,
    },
  });
};

module.exports.SubmitOption = async (req, res, next) => {
  const testRun_id = req.body.testRun_id;
  const option = req.body.option;
  const questionIndex = req.body.questionIndex;

  // Get the test run
  const testRun = await TestRun.findById(testRun_id);

  if (!testRun) {
    // If test run is not found, return an error response
    return res.status(404).json({
      data: {},
      message: "Test run not found for: " + testRun_id,
    });
  }

  // update the test run, set the option selected to option.selected and save and return
  testRun.questions[questionIndex].options[option.order - 1].selected =
    option.selected;

  //check if at least one option is selected
  const selectedOptions = testRun.questions[questionIndex].options.filter(
    (option) => option.selected === true
  );

  //if at least one option is selected, set the question to selected
  testRun.questions[questionIndex].answered =
    selectedOptions.length > 0 ? true : false;

  const tr = await testRun.save();
  // Return the test run
  res.status(200).json({
    data: {
      testRun: tr,
    },
  });
};

module.exports.StartTest = async (req, res) => {
  const setId = req.params.setId;

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

    const set = setRes?.sets?.find((set) => set._id === setId);

    if (!set) {
      // If the set with the specified number is not found, return an error response
      return res.status(404).json({
        data: {},
        message: "2:Set not found for: " + setId,
      });
    }

    // Select random (max 10) questions from the set, shuffle them, and return
    const questions = set.questions || [];
    const shuffledQuestions = questions
      ? [...questions].sort(() => Math.random() - 0.5)
      : [];
    const selectedQuestions = shuffledQuestions.slice(
      0,
      Math.min(10, shuffledQuestions.length)
    );

    // Remove "correct" field from the qoices to be sent, if multiple choices correct, than add "correct" field to the choices
    const modifiedQuestions = selectedQuestions.map((question, i) => {
      question.ind = i;
      // Remove the "correct" attribute from each option
      const modifiedOptions = question.options.map((option) => {
        const { correct, ...modifiedOption } = option;
        return modifiedOption;
      });

      // Check if the question has a single correct option or multiple
      const isSingleCorrect = question.options.filter(
        (option) => option.correct === true
      ).length;

      // Add the new attribute "type" to indicate if it's "single" or "multiple"
      return {
        ...question,
        options: modifiedOptions,
        type: isSingleCorrect === 1 ? "single" : "multiple",
      };
    });

    // // Create a new test
    const newTest = {
      user_id: userId,
      set_id: setId,
      questions: modifiedQuestions,
      currentQuestion: 0,
      start: Date.now(),
      result: null,
    };
    const tt = await TestRun.create(newTest);

    res.status(200).json({
      data: {
        runId: tt._id,
      },
    });

    // // Return the test
    // res.status(200).json({
    //   data: {
    //     test: newTest,
    //   },
    // });
  } catch (error) {
    console.error("Error starting test:", error);
    res.status(500).json({
      data: {
        user_id: userId,
      },
      message: "Internal server error",
    });
  }
};

module.exports.GetTest = async (req, res) => {
  const testRunId = req.params.testRunId;

  try {
    // Get the test run
    const testRun = await TestRun.findById(testRunId);

    if (!testRun) {
      // If test run is not found, return an error response
      return res.status(404).json({
        data: {},
        message: "Test run not found for: " + testRunId,
      });
    }

    // Return the test run
    res.status(200).json({
      data: {
        testResult: testRun,
      },
    });
  } catch (error) {
    console.error("Error getting test:", error);
    res.status(500).json({
      data: {},
      message: "Internal server error",
    });
  }
};

module.exports.Stats = async (req, res, next) => {
  const setId = req.params.setId;
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
  }

  const decodedToken = verifySecretToken(token);
  const userId = decodedToken.id;
  // get all my test runs for this set
  const testRuns = await TestRun.find({ set_id: setId, user_id: userId });

  res.status(200).json({
    data: {
      testRuns: testRuns,
    },
  });
};

// module.exports.StartTest = async (req, res) => {
//   const setNumber = Number(req.params.setNumber);

// // Decode the token
// try {
//   const token = req.cookies.token;
//   const decodedToken = verifySecretToken(token);
//   const userId = decodedToken.id;
//   // Get the set
//   // const setRes = await Set.findOne({ "sets.number": Number(setNumber) });
//   const setRes = await Set.findOne({
//     sets: {
//       $elemMatch: { number: setNumber },
//     },
//   }).lean();

//   if (!setRes) {
//     // If set is not found, return an error response
//     return res.status(404).json({
//       data: {},
//       message: "1: Set not found for: " + setNumber,
//     });
//   }

//   const set = setRes?.sets?.find((set) => Number(set.number) === setNumber);

//   if (!set) {
//     // If the set with the specified number is not found, return an error response
//     return res.status(404).json({
//       data: {},
//       message: "2:Set not found for: " + setNumber,
//     });
//   }

//   // Select random (max 10) questions from the set, shuffle them, and return
//   const questions = set.questions || [];
//   const shuffledQuestions = questions
//     ? [...questions].sort(() => Math.random() - 0.5)
//     : [];
//   const selectedQuestions = shuffledQuestions.slice(
//     0,
//     Math.min(10, shuffledQuestions.length)
//   );

//   // Remove "correct" field from the qoices to be sent, if multiple choices correct, than add "correct" field to the choices
//   const modifiedQuestions = selectedQuestions.map((question) => {
//     // Remove the "correct" attribute from each option
//     const modifiedOptions = question.options.map((option) => {
//       const { correct, ...modifiedOption } = option;
//       return modifiedOption;
//     });

//     // Check if the question has a single correct option or multiple
//     const isSingleCorrect = question.options.filter(
//       (option) => option.correct === true
//     ).length;

//     // Add the new attribute "type" to indicate if it's "single" or "multiple"
//     return {
//       ...question,
//       options: modifiedOptions,
//       type: isSingleCorrect === 1 ? "single" : "multiple",
//     };
//   });

//   // Create a new test
//   const newTest = {
//     user_id: userId,
//     setNumber: setNumber,
//     questions: modifiedQuestions,
//     start: Date.now(),
//   };
//   await TestRun.create(newTest);

//   // Return the test
//   res.status(200).json({
//     data: {
//       test: newTest,
//     },
//   });
// } catch (error) {
//   console.error("Error starting test:", error);
//   res.status(500).json({
//     data: {
//       user_id: userId,
//     },
//     message: "Internal server error",
//   });
// }
// };

module.exports.GetSet = async (req, res, next) => {
  try {
    // Get the set with the specified number
    const set = await Set.findOne({
      "sets.number": Number(req.params.setNumber),
    });

    if (!set) {
      // If set is not found, return an error response
      return res.status(404).json({
        data: {},
        message: "Set not found for: " + req.params.setNumber,
      });
    }

    // Return the found set
    res.status(200).json({
      data: {
        set: set,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      data: {},
      message: "Internal server error",
    });
  }
};
