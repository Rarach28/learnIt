import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function Stats() {
  const [stats, setStats] = useState({});
  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`http://localhost:4050/api/stats/${id}`, { withCredentials: true })
      .then((response) => setStats(response.data.data.testRuns))
      .catch((error) => console.error(error));
  }, [id]);

  console.log("stats", stats);
  if (!stats || stats.length === 0) {
    return <div>Loading...</div>;
  }

  //   return "FAS";
  return (
    <div className="container mx-auto px-4">
      <h2 className="font-bold text-4xl mt-2">Statistics</h2>
      <table className="table w-full">
        <thead>
          <tr>
            <th>Date</th>
            <th>Duration</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((stat) => (
            <tr key={stat._id}>
              <td>{new Date(stat.start).toLocaleDateString()}</td>
              <td>{formatDuration(stat.start, stat.finish)}</td>
              <td>{stat.result ? stat.result.score * 100 + "%" : "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Function to format duration
function formatDuration(start, finish) {
  const durationInSeconds = Math.floor((finish - start) / 1000);
  const hours = Math.floor(durationInSeconds / 3600);
  const minutes = Math.floor((durationInSeconds - hours * 3600) / 60);
  const seconds = durationInSeconds - hours * 3600 - minutes * 60;

  return `${hours}h ${minutes}m ${seconds}s`;
}
