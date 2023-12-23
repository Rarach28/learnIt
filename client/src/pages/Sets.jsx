import React, { useEffect, useState } from "react";
import { axios } from "../api/axios";
import { PiExamFill } from "react-icons/pi";
import { TbCardsFilled } from "react-icons/tb";
import { MdEditDocument } from "react-icons/md";
import { Link } from "react-router-dom";

const Sets = () => {
  const [sets, setSets] = useState([]);
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [learnModalOpen, setLearnModalOpen] = useState(false);
  const [selectedSet, setSelectedSet] = useState(null);

  useEffect(() => {
    axios
      .getSets()
      .then((response) => setSets(response.sets))
      .catch((error) => console.error(error));
  }, []);

  const openTestModal = (set) => {
    setSelectedSet(set);
    setTestModalOpen(true);
  };

  const closeTestModal = () => {
    setSelectedSet(null);
    setTestModalOpen(false);
  };

  const openLearnModal = (set) => {
    setSelectedSet(set);
    setLearnModalOpen(true);
  };

  const closeLearnModal = () => {
    setSelectedSet(null);
    setLearnModalOpen(false);
  };

  const renderSets = (topic) => (
    <div key={topic._id} className="topic-section">
      <div className="font-semibold text-2xl mt-2">{topic.topic.name}</div>
      <p className="pb-2">{topic.topic.description}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        {topic.sets.map((set) => (
          <div
            key={set._id}
            className="card card-compact bg-base-100 shadow-xl w-full"
          >
            <figure>
              <img
                className="rounded-t-lg h-48 w-full object-cover"
                src={
                  set.attachment ??
                  "https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"
                }
                alt={topic.name}
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title">{set.name}</h2>
              <p>{set.description}</p>
              <p>Number of Questions: {set.questions.length}</p>
              <div className="grid grid-cols-3 gap-x-2">
                <Link
                  className="btn btn-primary text-center tooltip tooltip-primary"
                  data-tip="Statistics"
                  to={`/sets/stats/${set._id}`}
                >
                  <PiExamFill className="text-2xl w-full h-full p-1" />
                </Link>
                <button
                  className="btn btn-primary text-center tooltip tooltip-primary"
                  data-tip="Learn"
                  onClick={() => openLearnModal(set)}
                >
                  <TbCardsFilled className="text-2xl w-full h-full p-1" />
                </button>
                <button
                  className="btn btn-primary text-center tooltip tooltip-primary"
                  data-tip="Take a test"
                  onClick={() => openTestModal(set)}
                >
                  <MdEditDocument className="text-2xl w-full h-full p-1" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="sets_page">
      {testModalOpen && selectedSet && (
        <dialog id="stats_modal" className="modal" open>
          <div className="modal-box">
            <h3 className="font-bold text-lg">Take a Test</h3>
            <p className="py-4">
              Take a test with total of {selectedSet.questions.length} questions
            </p>
            <div className="modal-action">
              <Link to={`/sets/test/create/${selectedSet._id}`} className="btn">
                Go to Test
              </Link>
              <button className="btn" onClick={closeTestModal}>
                Close
              </button>
            </div>
          </div>
        </dialog>
      )}

      {/* Learn Modal */}
      {learnModalOpen && selectedSet && (
        <dialog id="learn_modal" className="modal" open>
          <div className="modal-box">
            <h3 className="font-bold text-lg">Learn!</h3>
            <p className="py-4">{selectedSet.description}</p>

            <div className="modal-action">
              <Link to={`/sets/learn/${selectedSet._id}`} className="btn">
                Go to Flash Cards
              </Link>
              <button className="btn" onClick={closeLearnModal}>
                Close
              </button>
            </div>
          </div>
        </dialog>
      )}

      {sets.map((topic) => renderSets(topic))}
    </div>
  );
};

export default Sets;
