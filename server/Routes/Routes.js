const {
  Signup,
  Login,
  GetUser,
  UpdateUser,
  GetAll,
  StartTest,
  GetTest,
  SubmitOption,
  FinishTest,
  ResultTest,
  Stats,
} = require("../Controllers/AuthController");

const { Learn } = require("../Controllers/LearnController");
const { userVerification } = require("../Middlewares/AuthMiddleware");

// const { GetAll } = require("../Controllers/SetController");

const router = require("express").Router();

router.post("/", userVerification);
router.post("/signup", Signup);
router.post("/login", Login);
router.get("/api/sets", GetAll);

router.get("/api/learn/:setId", Learn);
router.get("/api/stats/:setId", Stats);

router.get("/api/testRun/create/:setId", StartTest);
router.get("/api/testRun/:testRunId", GetTest);
router.get("/api/testRun/finish/:runId", FinishTest);
router.get("/api/testRun/result/:runId", ResultTest);
router.post("/api/submitOption", SubmitOption);

router.get("/api/user", GetUser);
router.put("/api/user", UpdateUser);

module.exports = router;
