import React, { useEffect, useState } from "react";
import { axi_url, axios } from "../api/axios";
import { PiExamFill } from "react-icons/pi";
import { TbCardsFilled } from "react-icons/tb";
import { MdEditDocument } from "react-icons/md";
import { Link, json, useNavigate, useParams } from "react-router-dom";
import { FaFolderPlus } from "react-icons/fa";
import { MdLibraryAdd } from "react-icons/md";

const Sets = () => {
  const [sets, setSets] = useState([]);
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [learnModalOpen, setLearnModalOpen] = useState(false);
  const [selectedSet, setSelectedSet] = useState(null);
  const [user, setUser] = useState(null);
  const [visibleAdd, setVisibleAdd] = useState(null);

  useEffect(() => {
    axios
      .get(axi_url + "api/user", { withCredentials: true })
      .then((response) => {
        setUser(response.user);
        return response.user;
      })
      .then((user) => {
        // Set visibility here
        setVisibleAdd(
          user?.role_id &&
            user?.role_id.length > 0 &&
            user?.role_id.includes("add_set")
        );

        return axios.getSets();
      })
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
      {visibleAdd && (
        <Link to={`/sets/add/` + topic._id} className="btn">
          <MdLibraryAdd />
          Add Set
        </Link>
      )}
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
      <div>
        {visibleAdd && (
          <Link to={`/sets/add`} className="btn">
            <FaFolderPlus />
            Add Topic
          </Link>
        )}
      </div>
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

export const SetAdd = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [jsonInput, setJsonInput] = useState("");
  const [isValidJson, setIsValidJson] = useState(true);

  useEffect(() => {
    axios
      .getSetByNumber(id || null)
      .then((response) => {
        console.log("rrr", response.set);
        setJsonInput(JSON.stringify(response.set, null, 4));
      })
      .catch((error) => console.error(error));
  }, [id]);

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setJsonInput(inputValue);

    try {
      JSON.parse(inputValue);
      setIsValidJson(true);
    } catch (error) {
      setIsValidJson(false);
    }
  };

  const handlePost = () => {
    if (isValidJson) {
      axios
        .put(axi_url + "api/sets/add", {
          id: id || null,
          set: JSON.parse(jsonInput),
        })
        .then((response) => {
          // Handle success, e.g., navigate to a different page
          navigate("/success");
        })
        .catch((error) => {
          console.error(error);
          // Handle error, e.g., show an error message
        });
    } else {
      // Handle invalid JSON case, e.g., show an error message
      console.error("Invalid JSON");
    }
  };

  return (
    <>
      {!isValidJson && (
        <div className="badge badge-error h-12">Invalid JSON</div>
      )}
      {isValidJson && (
        <button
          onClick={handlePost}
          disabled={!isValidJson}
          className="btn btn-primary"
        >
          Post to API
        </button>
      )}
      <textarea
        className="w-full textarea textarea-bordered h-4/5 mt-2"
        value={jsonInput}
        onChange={handleInputChange}
      />
    </>
  );
};

export default Sets;
