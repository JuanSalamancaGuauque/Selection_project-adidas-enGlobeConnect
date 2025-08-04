import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { Bar, Pie, Line } from "react-chartjs-2";
import "./Dashboard.css";
import adidas from "./assets/adidaswhite.png";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

/********************************
Name: ratingLabels & staffLabels
Function: Used to display options or legends on satisfaction scales.
********************************/
const ratingLabels = ["1", "2", "3", "4", "5"];
const staffLabels = ["Yes", "No", "Not Sure"];

/********************************
Name: Dashboard Component
Function: Displays the main administration panel for viewing and managing feedback by store.
Result: Loads data from the backend, allows you to select a store and view statistics or comments.
********************************/
export default function Dashboard() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [highlightedComments, sethighlightedComments] = useState([]);
  const [selectedStore, setSelectedStore] = useState("");
  const [selectedView, setSelectedView] = useState("statistics");

  /*
*******************************
Name: useEffect for initial feedback loading
Function: Makes an API request to retrieve all feedback records.
Result: Stores the data in the 'feedbacks' state.
*******************************
*/
  useEffect(() => {
    fetch("http://localhost:4000/api/feedback")
      .then((res) => res.json())
      .then(setFeedbacks)
      .catch((err) => console.error("Error al cargar feedback:", err));
  }, []);

  useEffect(() => {
    if (selectedView === "highlighted") {
      fetchHighlightedComments();
    }
  }, [selectedView]);

  /*
*******************************
Name: HighlightComm Function
Function: Sends a comment to the backend to highlight it.
Receives the original comment ID, text, and location.
*******************************
*/
  const HighlightComm = async (commentId, commentText, location) => {
    try {
      await fetch("http://localhost:4000/api/highlighted", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId, commentText, location }),
      });
      alert("comment highlighted");
    } catch (err) {
      console.error("comment highlighted error", err);
      alert("Could not highlight comment");
    }
  };

  const fetchHighlightedComments = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/highlighted");
      const data = await res.json();
      sethighlightedComments(data);
    } catch (err) {
      console.error("Error loading highlighted comments:", err);
    }
  };

  const deletedHighlightedComment = async (id) => {
    try {
      await fetch(`http://localhost:4000/api/highlighted/${id}`, {
        method: "DELETE",
      });
      sethighlightedComments((prev) => prev.filter((c) => c._id !== id));
      alert("comment removed");
    } catch (err) {
      console.log("Delete error", err);
      alert("could not delete comment");
    }
  };

  /********************************
- stores: Generates an array of available locations from the feedback data.
- filtered: Filters feedback based on the selected store; if no selection is made, returns all.
********************************/
  const stores = [...new Set(feedbacks.map((f) => f.location))];
  const filtered = selectedStore
    ? feedbacks.filter((f) => f.location === selectedStore)
    : feedbacks;

  if (!filtered.length) return <p>Loading data or no results...</p>;

  /********************************
Name: countRatings Function
Function: Counts the number of times each rating (from 1 to 5) appears per question.
Result: Returns a 5-element array, where each index represents the number of answers with that rating.
********************************/
  const countRatings = (field) => {
    const counts = Array(5).fill(0);
    filtered.forEach(
      (f) => f[field] >= 1 && f[field] <= 5 && counts[f[field] - 1]++
    );
    return counts;
  };

  /********************************
Name: calculateAverage Function
Function: Calculates the average of the grades (between 1 and 5).
********************************/
  const calculateAverage = (field) => {
    const valid = filtered.map((f) => f[field]).filter((v) => v >= 1 && v <= 5);
    return valid.length
      ? (valid.reduce((a, b) => a + b) / valid.length).toFixed(2)
      : 0;
  };

  /*********************************
Name: getTimeData Function
Function: Generates a time series of data. Filters existing records and their creation date, sorting them chronologically, 
and then converts them into {x, y} objects for display in graphs.
Result: Returns an array of objects with dates (`x`) and values (`y`) to graph the evolution of the field over time.
*********************************/
  const getTimeData = (field) =>
    filtered
      .filter((f) => f[field] && f.createdAt)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)) //ascending date
      .map((f) => ({ x: new Date(f.createdAt), y: f[field] }));

  /***********************************
Name: (staffCounts)
Function: Loops through each label defined in `staffLabels` ("Yes", "No", "Not Sure") and counts how many times it appears in the `staff` field of the filtered feedback.
***********************************/
  const staffCounts = staffLabels.map(
    (label) => filtered.filter((f) => f.staff === label).length
  );

  /**********************************
Name: chartSettings function
Function: Generates the basic settings for a chart, receives the data to be charted, and the desired background color.
Result: Returns an object with the labels and datasets.
**********************************/
  const chartSettings = (data, color) => ({
    labels: ratingLabels,
    datasets: [{ data, backgroundColor: color }],
  });

  /***********************************
Name: lineSettings function
Function: Generates the settings for a line chart, including the dataset name, the data itself, and the line color.
Result: Returns a settings object for representing time series.
***********************************/
  const lineSettings = (label, data, color) => ({
    datasets: [
      {
        label,
        data,
        borderColor: color,
        tension: 0.3,
        fill: false,
      },
    ],
  });

  /************************************
Name: timeOptions Object
Function: Sets the X-axis as a time scale (by days) and constrains the Y-axis between 1 and 5 by the maximum score.
Result: Displays data distributed over time.
************************************/
  const timeOptions = {
    scales: {
      x: { type: "time", time: { unit: "day" } },
      y: { min: 1, max: 6 },
    },
  };

  return (
    <div className="dashboard-layout">
      <aside className="sideMenu">
        <img src={adidas} alt="Logo" className="sideMenu-logo" />
        <nav className="sideMenu-nav">
          <button
            className={`sideMenu-button ${
              selectedView === "statistics" ? "active" : ""
            }`}
            onClick={() => setSelectedView("statistics")}
          >
            Statistics
          </button>
          <button
            className={`sideMenu-button ${
              selectedView === "tendencies" ? "active" : ""
            }`}
            onClick={() => setSelectedView("tendencies")}
          >
            Tendencies
          </button>
          <button
            className={`sideMenu-button ${
              selectedView === "comments" ? "active" : ""
            }`}
            onClick={() => setSelectedView("comments")}
          >
            Commentss
          </button>

          <button
            className={`sideMenu-button ${
              selectedView === "highlighted" ? "active" : ""
            }`}
            onClick={() => setSelectedView("highlighted")}
          >
            Highlighted
          </button>
        </nav>
      </aside>

      <main className="main-dashboard">
        <h1>DASHBOARD</h1>

        <select
          className="store-locator"
          value={selectedStore}
          onChange={(e) => setSelectedStore(e.target.value)}
        >
          <option value="">SHOP</option>
          {stores.map((store) => (
            <option key={store} value={store}>
              {store}
            </option>
          ))}
        </select>
        {selectedView === "comments" && (
          <div className="comments-section">
            <h2>Customer Comments</h2>
            <ul className="comments-list">
              {filtered
                .filter((f) => f.comment)
                .map((f, i) => (
                  <li key={i} className="comment-item">
                    <p>{f.comment}</p>
                    <button
                      onClick={() =>
                        HighlightComm(f._id, f.comment, f.location)
                      }
                      className="highlight-button"
                    >
                      Highlight
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        )}

        {selectedView === "highlighted" && (
          <div className="comments-section">
            <h2>Highlighted Comments</h2>
            <ul className="comments-list">
              {highlightedComments.length === 0 ? (
                <p>No Highlighted Comments found.</p>
              ) : (
                highlightedComments
                  .filter((c) => !selectedStore || c.location === selectedStore)
                  .map((c, i) => (
                    <li key={i} className="comment-item">
                      <p>{c.commentText}</p>
                      <button
                        onClick={() => deletedHighlightedComment(c._id)}
                        className="highlight-button"
                      >
                        Remove
                      </button>
                    </li>
                  ))
              )}
            </ul>
          </div>
        )}

        {selectedView === "statistics" && (
          <>
            <div className="stats-container">
              {[
                ["Feedbacks", filtered.length],
                ["Average Availability", calculateAverage("availability")],
                ["Average Cleanliness", calculateAverage("cleanliness")],
                ["Average Experience", calculateAverage("satisfaction")],
              ].map(([label, value]) => (
                <div key={label} className="card">
                  {label}
                  <span>{value}</span>
                </div>
              ))}
            </div>

            <div className="charts-grid">
              <div className="chart-container">
                <h4>Product Availability</h4>
                <Bar
                  data={chartSettings(countRatings("availability"), "#36a2eb")}
                  options={{ plugins: { legend: { display: false } } }}
                />
              </div>
              <div className="chart-container">
                <h4>Was the staff Helpful</h4>
                <Pie
                  data={{
                    labels: staffLabels,
                    datasets: [
                      {
                        data: staffCounts,
                        backgroundColor: ["#4caf50", "#f44336", "#ff9800"],
                      },
                    ],
                  }}
                  options={{ plugins: { legend: { position: "bottom" } } }}
                />
              </div>
              <div className="chart-container">
                <h4>Store Cleanliness</h4>
                <Bar
                  data={chartSettings(countRatings("cleanliness"), "#4bc0c0")}
                  options={{ plugins: { legend: { display: false } } }}
                />
              </div>
              <div className="chart-container">
                <h4>Overall Experience</h4>
                <Bar
                  data={chartSettings(countRatings("satisfaction"), "#ff6384")}
                  options={{ plugins: { legend: { display: false } } }}
                />
              </div>
            </div>
          </>
        )}
        {selectedView === "tendencies" && (
          <div className="charts-grid">
            <div className="chart-container">
              <h4>Trend: Availability</h4>
              <Line
                data={lineSettings(
                  "Availability",
                  getTimeData("availability"),
                  "#36a2eb"
                )}
                options={timeOptions}
              />
            </div>
            <div className="chart-container">
              <h4>Trend: Cleanliness</h4>
              <Line
                data={lineSettings(
                  "Cleanliness",
                  getTimeData("cleanliness"),
                  "#4bc0c0"
                )}
                options={timeOptions}
              />
            </div>
            <div className="chart-container">
              <h4>Trend: Satisfaction</h4>
              <Line
                data={lineSettings(
                  "Satisfaction",
                  getTimeData("satisfaction"),
                  "#ff6384"
                )}
                options={timeOptions}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
