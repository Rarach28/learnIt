import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { axios, axi_url } from "../api/axios";
import { BiSolidShow, BiHide } from "react-icons/bi";

export default function Learn() {
  const { id, randomOrder } = useParams();
  const navigate = useNavigate();
  const [set, setSet] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [cardIndex, setCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    axios
      .get(`${axi_url}api/learn/${id}/${randomOrder}`)
      .then((response) => {
        setSet(response.set);
        setQuestions(response.set.questions);
      })
      .catch((error) => console.error(error));
  }, [id, randomOrder]);

  const handleNextCard = () => {
    setShowAnswer(false);
    if (cardIndex < questions.length - 1) {
      setCardIndex(cardIndex + 1);
    } else {
      setCardIndex(0);
    }
  };

  const handlePrevCard = () => {
    setShowAnswer(false);
    if (cardIndex > 0) {
      setCardIndex(cardIndex - 1);
    } else {
      setCardIndex(questions.length - 1);
    }
  };

  const handleShowAnswer = () => {
    setShowAnswer((prevShowAnswer) => !prevShowAnswer);
  };

  const renderCardOptions = (options) => {
    return (
      <ul
        className={
          "list-disc pl-3 " + (showAnswer ? "opacity-100" : "opacity-0")
        }
      >
        {options.length === 0 ||
        (options.length === 1 && options[0].text == "") ? (
          <li className={`card-subtitle text-lg`}>~ No Options ~</li>
        ) : (
          options.map((option) => (
            <li key={option._id} className={`card-subtitle text-lg`}>
              {option.text}
            </li>
          ))
        )}
      </ul>
    );
  };

  const renderCard = () => {
    const question = questions[cardIndex];
    return (
      <div className="card bg-base-100 shadow-xl w-full justify-self-center md:col-start-2 md:col-end-12 mb-8">
        <div className="card-body">
          <h2 className="card-title border-b pb-1 ">{question.text}</h2>
          <div className="card-answer max-h-[50vh] overflow-auto ml-1">
            {renderCardOptions(question.options)}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="font-semibold text-2xl mt-2">Learn</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-2 justify-center">
        {set && renderCard()}
      </div>
      <div className="fixed bottom-5 right-5 pe-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            className=" w-full col-span-2 btn btn-accent z-[900000]"
            onClick={handleShowAnswer}
          >
            {showAnswer ? (
              <>
                <BiHide className="me-1" /> Hide Answer
              </>
            ) : (
              <>
                <BiSolidShow className="me-1" /> Show Answer
              </>
            )}
          </button>
          <button className="btn btn-primary" onClick={handlePrevCard}>
            Previous Card
          </button>
          <button className="btn btn-primary" onClick={handleNextCard}>
            Next Card
          </button>
        </div>
      </div>
    </div>
  );
}
