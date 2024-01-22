import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { axios, axi_url } from "../api/axios";
import { IoInformationCircleOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

export default function Stats() {
  const [stats, setStats] = useState({});
  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`${axi_url}api/stats/${id}`, {
        withCredentials: true,
      })
      .then((response) => setStats(response.testRuns))
      .catch((error) => console.error(error));
  }, [id]);

  console.log("stats", stats);
  if (!stats || stats.length === 0) {
    return (
      <div role="alert" className="alert">
        <IoInformationCircleOutline className="text-info text-2xl" />
        <span>No Records Yet</span>
        <div>
          {
            <Link
              to={`/sets/test/create/${id}`}
              className="btn btn-sm btn-primary"
            >
              Go to Test
            </Link>
          }
        </div>
      </div>
    );
  }

  //   return JSON.stringify(stats);
  return (
    <div className="container mx-auto px-4">
      <h2 className="font-bold text-4xl mt-2">Statistics</h2>
      <table className="table w-full">
        <thead>
          <tr>
            <th>Date</th>
            <th>Duration</th>
            <th>Score</th>
            <th>Detail</th>
          </tr>
        </thead>
        <tbody>
          {JSON.stringify(stats) != "{}" &&
            stats.map((stat) => (
              <tr key={stat._id}>
                <td>{new Date(stat.start).toLocaleDateString()}</td>
                <td>{formatDuration(stat.start, stat.finish)}</td>
                <td>{stat.result ? stat.result.score * 100 + "%" : "-"}</td>
                <td>
                  {stat.finish && (
                    <Link
                      to={`/sets/test/result/${stat._id}`}
                      className="btn btn-sm btn-primary"
                    >
                      Detail
                    </Link>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

// Function to format duration
function formatDuration(start, finish) {
  const duration = Math.floor((finish - start) / 1000);
  // const hours = String(Math.floor(duration / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((duration % 3600) / 60)).padStart(2, "0");
  const seconds = String(duration % 60).padStart(2, "0");

  return finish ? `${minutes}:${seconds}` : "-";
}
