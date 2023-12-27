const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: mongoose.Types.ObjectId,
  },
  order: {
    type: Number,
    default: null,
  },
  attachment: {
    type: String,
    default: null,
  },
  text: {
    type: String,
    default: null,
  },
  correct: {
    type: Boolean,
    default: null,
  },
});

const questionSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: mongoose.Types.ObjectId,
  },
  order: {
    type: Number,
    default: null,
  },
  attachment: {
    type: String,
    default: null,
  },
  text: {
    type: String,
    default: null,
  },
  options: [optionSchema],
});

const setSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: mongoose.Types.ObjectId,
  },
  topic: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      default: mongoose.Types.ObjectId,
    },
    name: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      default: null,
    },
    lang_id: {
      type: Number,
      default: 1,
    },
  },
  sets: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        default: mongoose.Types.ObjectId,
      },
      name: {
        type: String,
        default: null,
      },
      description: {
        type: String,
        default: null,
      },
      mark_type_id: {
        type: Number,
        required: true,
      },
      showCorrectAnswers: {
        type: Boolean,
        default: null,
      },
      language_id: {
        type: Number,
        default: 1,
      },
      attachment: {
        type: String,
        default: null,
      },
      questions: [questionSchema],
    },
  ],
});

const testRunoptionSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  ind: {
    type: Number,
    default: 0,
  },
  order: {
    type: Number,
    default: null,
  },
  attachment: {
    type: String,
    default: null,
  },
  text: {
    type: String,
    default: null,
  },
  selected: {
    type: Boolean,
    default: false,
  },
  correct: {
    type: Boolean,
    default: null,
  },
});

const testRunquestionSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  order: {
    type: Number,
    default: null,
  },
  ind: {
    type: Number,
    default: 0,
  },
  attachment: {
    type: String,
    default: null,
  },
  text: {
    type: String,
    default: null,
  },
  score: {
    type: Number,
    default: 0,
  },
  options: [testRunoptionSchema],
  answered: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: null,
  },
});

const testRunSchema = new mongoose.Schema({
  user_id: {
    type: String,
    default: null,
  },
  set_id: {
    type: String,
    default: null,
  },
  start: {
    type: Number,
    default: null,
  },
  finish: {
    type: Number,
    default: null,
  },
  questions: [testRunquestionSchema],
  currentQuestion: {
    type: Number,
    default: 0,
  },
  result: {
    questions: [testRunquestionSchema],
    score: {
      type: Number,
      default: 0,
    },
  },
});

const topicSchema = new mongoose.Schema({
  name: {
    type: String,
    default: null,
  },
  description: {
    type: String,
    default: null,
  },
});

const testResponseOptionSchema = new mongoose.Schema({
  test_run_id: {
    type: Number,
    default: null,
  },
  timestamp: {
    type: Number,
    default: null,
  },
  option_id: {
    type: Number,
    default: null,
  },
});

const testResponseSchema = new mongoose.Schema({
  test_run_id: {
    type: Number,
    default: null,
  },
  question_id: {
    type: Number,
    default: null,
  },
  timestamp: {
    type: Number,
    default: null,
  },
  correct: {
    type: String,
    default: null,
  },
  order: {
    type: Number,
    default: null,
  },
});

const markTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    default: null,
  },
});

// module.exports = mongoose.model("Set", setSchema);
// module.exports = mongoose.model("Question", questionSchema);
// module.exports = mongoose.model("Option", optionSchema);
// module.exports = mongoose.model("TestRun", testRunSchema);
// module.exports = mongoose.model("Topic", topicSchema);
// module.exports = mongoose.model("TestResponseOption", testResponseOptionSchema);
// module.exports = mongoose.model("TestResponse", testResponseSchema);
// module.exports = mongoose.model("MarkType", markTypeSchema);

const Set = mongoose.model("Set", setSchema);
const Question = mongoose.model("Question", questionSchema);
const Option = mongoose.model("Option", optionSchema);
const TestRun = mongoose.model("TestRun", testRunSchema);
const Topic = mongoose.model("Topic", topicSchema);
const TestResponseOption = mongoose.model(
  "TestResponseOption",
  testResponseOptionSchema
);
const TestResponse = mongoose.model("TestResponse", testResponseSchema);
const MarkType = mongoose.model("MarkType", markTypeSchema);

module.exports = {
  Set,
  Question,
  Option,
  TestRun,
  Topic,
  TestResponseOption,
  TestResponse,
  MarkType,
};
