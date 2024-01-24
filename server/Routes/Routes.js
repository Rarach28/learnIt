const {
  Signup,
  Login,
  GetUser,
  UpdateUser,
  GetAll,
  GetSet,
  SaveSet,
  StartTest,
  GetTest,
  SubmitOption,
  FinishTest,
  ResultTest,
  Stats,
} = require("../Controllers/AuthController");

const { Learn } = require("../Controllers/LearnController");
const { userVerification } = require("../Middlewares/AuthMiddleware");

const router = require("express").Router();

router.post("/api/signup", Signup);
router.post("/api/login", Login);

router.post("/api", userVerification);
router.get("/api", userVerification);

// SECURE ROUTES

router.post("/api/test", (req, res) => {
  res.send("test");
});
router.get("/api/test", (req, res) => {
  res.send("test");
});

router.get("/api/sets/:id", GetSet);
router.get("/api/sets", GetAll);
router.put("/api/sets/add", SaveSet);

router.get("/api/learn/:setId/:randomOrder", Learn);
router.get("/api/stats/:setId", Stats);

router.get("/api/testRun/create/:setId", StartTest);
router.get("/api/testRun/:testRunId", GetTest);
router.get("/api/testRun/finish/:runId", FinishTest);
router.get("/api/testRun/result/:runId", ResultTest);
router.post("/api/submitOption", SubmitOption);

router.get("/api/user", GetUser);
router.put("/api/user", UpdateUser);

module.exports = router;
