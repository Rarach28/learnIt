const setsData = [
  {
    topic_id: 1,
    number: 1,
    name: "Set 1",
    description: "Description for Set 1",
    mark_type_id: 1,
    showCorrectAnswers: true,
    language_id: 1,
  },
  {
    topic_id: 2,
    number: 2,
    name: "Set 2",
    description: "Description for Set 2",
    mark_type_id: 2,
    showCorrectAnswers: false,
    language_id: 1,
  },
  // Add more sets as needed
];

const questionsData = [
  {
    set_id: 1,
    number: 1,
    name: "Question 1 for Set 1",
    description: "Description for Question 1",
  },
  {
    set_id: 1,
    number: 2,
    name: "Question 2 for Set 1",
    description: "Description for Question 2",
  },
  {
    set_id: 2,
    number: 1,
    name: "Question 1 for Set 2",
    description: "Description for Question 1",
  },
  // Add more questions as needed
];

const optionsData = [
  {
    question_id: 1,
    order: 1,
    attachment_id: null,
    text: "Option 1 for Question 1",
    correct: 0,
  },
  {
    question_id: 1,
    order: 2,
    attachment_id: null,
    text: "Option 2 for Question 1",
    correct: 1,
  },
  {
    question_id: 2,
    order: 1,
    attachment_id: null,
    text: "Option 1 for Question 2",
    correct: 1,
  },
  // Add more options as needed
];

// Use the data to create documents in your database
const Set = mongoose.model("Set", setSchema);
const Question = mongoose.model("Question", questionSchema);
const Option = mongoose.model("Option", optionSchema);

Set.insertMany(setsData)
  .then((sets) => {
    console.log("Sets added:", sets);
    // Now you can use the inserted sets to link questions and options
    const questionsWithSetIds = questionsData.map((question, index) => ({
      ...question,
      set_id: sets[index]._id,
    }));
    return Question.insertMany(questionsWithSetIds);
  })
  .then((questions) => {
    console.log("Questions added:", questions);
    // Now link options with question ids
    const optionsWithQuestionIds = optionsData.map((option, index) => ({
      ...option,
      question_id: questions[index]._id,
    }));
    return Option.insertMany(optionsWithQuestionIds);
  })
  .then((options) => {
    console.log("Options added:", options);
  })
  .catch((error) => {
    console.error("Error inserting data:", error);
  });
