import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { axios, axi_url } from "../api/axios";

const timeBox = (s) => {
  const hours = Math.floor(s / 3600);
  const minutes = Math.floor((s - hours * 3600) / 60);
  const seconds = s - hours * 3600 - minutes * 60;

  return (
    <span className="countdown font-mono text-2xl">
      <span style={{ "--value": hours || 0 }}></span>:
      <span style={{ "--value": minutes || 0 }}></span>:
      <span style={{ "--value": seconds }}></span>
    </span>
  );
};

export const CreateTest = () => {
  const { setNumber, questionNumber } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(axi_url + "/api/testRun/create/" + setNumber)
      .then((response) => {
        navigate(`/sets/test/${response.runId}`);
      })
      .catch((error) => console.error(error));
  }, [setNumber, questionNumber]);
};

export const FinishTest = () => {
  const { runId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(axi_url + "/api/testRun/finish/" + runId)
      .then((response) => {
        console.log(response);
        navigate(`/sets/test/result/${runId}`);
      })
      .catch((error) => console.error(error));
  }, []);
};

export const ResultTest = () => {
  const { runId } = useParams();
  const navigate = useNavigate();
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    axios
      .get(axi_url + "/api/testRun/result/" + runId)
      .then((response) => {
        setTestResult(response.testRun);
      })
      .catch((error) => console.error(error));
  }, []);

  const getOptionClassName = (option) => {
    if (option.correct) {
      return "bg-success";
    } else if (!option.correct) {
      return "bg-error";
    }
    //  else if (option.correct && !option.selected) {
    //   return "bg-warning";
    // }
    return "";
  };

  // return "haha";
  if (!testResult) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Result</h1>
      {/* grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 */}
      <div className="flex">
        {/* Score Box */}
        <div className="bg-neutral p-2 rounded w-fit h-26">
          <div className="w-full mb-2 font-semibold">Score</div>
          <div
            className="radial-progress text-primary"
            style={{ "--value": testResult.result.score * 100 }}
            role="progressbar"
          >
            {testResult.result.score * 100}%
          </div>
        </div>

        {/* Time Box */}
        <div className="bg-neutral p-2 rounded w-fit ml-2 h-26">
          <div className="w-full font-semibold">Time</div>
          <div className="h-20 flex justify-center items-center">
            {timeBox(Math.floor((testResult.finish - testResult.start) / 1000))}
          </div>
        </div>
      </div>
      {testResult && (
        <div>
          <p className="text-2xl font-semibold my-2">Questions</p>
          {testResult.result.questions.map((question, index) => (
            <div key={index}>
              <div>
                {question.text}{" "}
                <span className="badge badge-primary">{question.score}b</span>
              </div>
              <div className="options-container">
                {question.options.map((option, optionIndex) => (
                  <div key={optionIndex} className={`option flex my-2`}>
                    <span
                      className={`p-[6px] rounded-full h-9 w-9 ${getOptionClassName(
                        option
                      )}`}
                    >
                      <input
                        type="checkbox"
                        checked={option.selected}
                        className={`checkbox`}
                        readOnly
                      />
                    </span>
                    <label className="pt-1 ml-1">{option.text}</label>
                  </div>
                ))}
              </div>
              <hr />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Test = ({ username }) => {
  const [setInfo, setSetInfo] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  const { setNumber, questionNumber } = useParams();
  const navigate = useNavigate();

  const [testModalOpen, setTestModalOpen] = useState(false);
  const openTestModal = (set) => {
    setTestModalOpen(true);
  };

  const closeTestModal = () => {
    setTestModalOpen(false);
  };

  useEffect(() => {
    axios
      .get(axi_url + "/api/testRun/" + setNumber)
      .then((response) => {
        const set = response.testResult;
        const question = set.questions[set.currentQuestion ?? 0];

        if (!set) {
          console.error(`Set not found for setNumber: ${setNumber}`);
          return;
        }
        console.log("SET", set);
        setSetInfo(set);
        setCurrentQuestion(question);
        setElapsedTime(Math.floor((Date.now() - set.start) / 1000));
      })
      .catch((error) => console.error(error));
  }, [setNumber, questionNumber]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setElapsedTime((prevTime) => prevTime + 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleQuestionClick = (question) => {
    // navigate(`/sets/${setNumber}/questions/${question.order}`);
    // setCurrentQuestion(question);
  };

  const handleOptionClick = (option) => {
    const updatedOptions = currentQuestion.options.map((o) =>
      o._id === option._id
        ? { ...o, selected: !o.selected } // Toggle the selected state
        : o
    );

    const updatedQuestion = { ...currentQuestion, options: updatedOptions };
    setCurrentQuestion(updatedQuestion);

    option.selected = !option.selected;

    axios
      .post(axi_url + "/api/submitOption", {
        testRun_id: setInfo._id,
        option: option,
        questionIndex: currentQuestion.ind,
      })
      .then((response) => {
        const { answered } = response.testRun.questions[currentQuestion.ind];

        setSetInfo((prevSetInfo) => {
          const updatedQuestions = [...prevSetInfo.questions];
          updatedQuestions[currentQuestion.ind] = {
            ...currentQuestion,
            options: updatedOptions,
            answered: answered, // Update answered status
          };

          return {
            ...prevSetInfo,
            questions: updatedQuestions,
          };
        });

        console.log("Option submitted successfully");
      })
      .catch((error) => console.error(error));
  };

  const changeCurrentQ = (i) => () => {
    const question = setInfo.questions[i];
    setCurrentQuestion(question);
  };

  if (!setInfo) {
    return <div>Loading...</div>;
  }

  // return "hha";

  return (
    <>
      {/* //{modal} */}
      {testModalOpen && (
        <dialog id="stats_modal" className="modal" open>
          <div className="modal-box">
            <h3 className="font-bold text-lg">Finish Test</h3>
            <div className="mt-3">
              {setInfo.questions.map((q, i) => (
                <span key={q._id} className="">
                  <input
                    className="p-1 border w-8 h-8 text-center mx-1 join-item btn"
                    type="radio"
                    name="options"
                    onChange={changeCurrentQ(i)}
                    checked={i === currentQuestion.ind}
                    aria-label={i + 1}
                    disabled
                  />
                  <span
                    className={
                      // "checkCircleBox w-4 h-4 inline-block rounded-full bg-success absolute top-[-5px] left-[25px] " +
                      "checkCircleBox w-4 h-4 inline-block rounded-full bg-success relative top-[-15px] left-[-15px] " +
                      (q.answered ? "" : "none")
                    }
                  ></span>
                </span>
              ))}
            </div>
            <div className="modal-action">
              <Link to={`/sets/test/finish/${setInfo._id}`} className="btn">
                Finish Test
              </Link>
              <button className="btn" onClick={closeTestModal}>
                Close
              </button>
            </div>
          </div>
        </dialog>
      )}
      {/*render boxes*/}
      {/* <div className="grid grid-cols-6 gap-4"> */}
      {/* <div className="col-span-full sm:col-span-3 md:col-span-2">
          {setInfo.questions.map((q, i) => (
            <span key={q._id} className=" w-4">
              <input
                className="p-1 border w-8 h-8 text-center mx-1 join-item btn"
                type="radio"
                name="options"
                onChange={changeCurrentQ(i)}
                checked={i === currentQuestion.ind}
                aria-label={i + 1}
              />
              <span
                className={
                  // "checkCircleBox w-4 h-4 inline-block rounded-full bg-success absolute top-[-5px] left-[25px] " +
                  "checkCircleBox w-4 h-4 inline-block rounded-full bg-success relative top-[-15px] left-[-15px] " +
                  (q.answered ? "" : "none")
                }
              ></span>
            </span>
          ))}
          <div>
            <button className="btn btn-accent mt-2" onClick={openTestModal}>
              Finish Test
            </button>
          </div>
        </div> */}
      {/*render question*/}
      <div className="col-span-full sm:col-span-3 md:col-span-4">
        <div className="flex mb-3">
          {timeBox(elapsedTime)}
          <progress
            className="progress progress-info mt-2 ml-2"
            value={currentQuestion.ind + 1 ?? 0}
            max={setInfo.questions.length ?? 0}
          ></progress>
        </div>
        <div className="text-lg mb-3">{currentQuestion.text}</div>

        {/* Options */}
        {(currentQuestion.type == "single" ||
          currentQuestion.type == "multiple") && (
          <div>
            {currentQuestion.options.map((option) => (
              <div key={option._id} className="flex gap-2 my-2">
                <input
                  id={"rb" + option._id}
                  type="checkbox"
                  className="checkbox"
                  name="options"
                  value={option.text}
                  checked={option.selected}
                  onChange={() => handleOptionClick(option)}
                />
                <label htmlFor={"rb" + option._id}>{option.text}</label>
              </div>
            ))}
          </div>
        )}
        {/* Buttons */}
        <div className="mt-3">
          <button
            disabled={currentQuestion.ind <= 0}
            className="btn btn-accent w-1/3"
            onClick={() =>
              setCurrentQuestion(setInfo.questions[currentQuestion.ind - 1])
            }
          >
            Back
          </button>
          <button className="btn btn-accent w-1/3" onClick={openTestModal}>
            Finish
          </button>
          <button
            disabled={setInfo.questions[currentQuestion.ind + 1] === undefined}
            className="btn btn-accent w-1/3"
            onClick={() =>
              setCurrentQuestion(setInfo.questions[currentQuestion.ind + 1])
            }
          >
            Next
          </button>
        </div>
      </div>
      {/* </div> */}
    </>
  );
};

export default Test;
