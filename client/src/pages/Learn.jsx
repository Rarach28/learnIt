import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { axios, axi_url } from "../api/axios";

export default function Learn() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [set, setSet] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [cardIndex, setCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    axios
      .get(`${axi_url}api/learn/${id}`)
      .then((response) => {
        setSet(response.set);
        setQuestions(response.set.questions);
      })
      .catch((error) => console.error(error));
  }, [id]);

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
          "list-disc ml-3 " + (showAnswer ? "opacity-100" : "opacity-0")
        }
      >
        {options.map((option) => (
          <li key={option._id} className={`card-subtitle`}>
            {option.text}
          </li>
        ))}
      </ul>
    );
  };

  const renderCard = () => {
    const question = questions[cardIndex];
    return (
      <div className="card bg-base-100 shadow-xl w-full justify-self-center md:col-start-2 md:col-end-12">
        <div className="card-body">
          <h2 className="card-title">{question.text}</h2>
          <div className="card-answer">
            {renderCardOptions(question.options)}
          </div>
        </div>
        <div className="card-actions">
          <button
            className=" w-full btn btn-primary"
            onClick={handleShowAnswer}
          >
            {showAnswer ? "Hide Answer" : "Show Answer"}
          </button>
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
      <div className="flex justify-between items-center mt-4">
        <button className="btn btn-primary" onClick={handlePrevCard}>
          Previous Card
        </button>
        <button className="btn btn-primary" onClick={handleNextCard}>
          Next Card
        </button>
      </div>
    </div>
  );
}
