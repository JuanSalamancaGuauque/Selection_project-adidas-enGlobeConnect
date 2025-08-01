import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, ArcElement,
  LineElement, PointElement, Title, Tooltip, Legend, TimeScale
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { Bar, Pie, Line } from 'react-chartjs-2';
import './Dashboard.css';
import adidas from './assets/adidaswhite.png';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, LineElement, PointElement, Title, Tooltip, Legend, TimeScale);

const ratingLabels = ['1', '2', '3', '4', '5'];
const staffLabels = ['Yes', 'No', 'Not sure'];

export default function Dashboard() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [selectedStore, setSelectedStore] = useState('');
  const [selectedView, setSelectedView] = useState('statistics');

  useEffect(() => {
    fetch('http://localhost:4000/api/feedback')
      .then(res => res.json())
      .then(setFeedbacks)
      .catch(err => console.error('Error al cargar feedback:', err));
  }, []);

  const HighlightComm = async (commentId, commentText) => {
    try {
      await fetch('http://localhost:4000/api/highlighted', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentId, commentText })
      });
      alert('Comentario destacado');
    } catch (err) {
      console.error('Error al destacar comentario:', err);
      alert('No se pudo destacar el comentario.');
    }
  };

  const stores = [...new Set(feedbacks.map(f => f.storeLocation))];
  const filtered = selectedStore ? feedbacks.filter(f => f.storeLocation === selectedStore) : feedbacks;

  if (!filtered.length) return <p>Loading data or no results...</p>;

  const countRatings = (field) => {
    const counts = Array(5).fill(0);
    filtered.forEach(f => (f[field] >= 1 && f[field] <= 5) && counts[f[field] - 1]++);
    return counts;
  };

  const calculateAverage = (field) => {
    const valid = filtered.map(f => f[field]).filter(v => v >= 1 && v <= 5);
    return valid.length ? (valid.reduce((a, b) => a + b) / valid.length).toFixed(2) : 0;
  };

  const getTimeData = (field) => (
    filtered
      .filter(f => f[field] && f.createdAt)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      .map(f => ({ x: new Date(f.createdAt), y: f[field] }))
  );

  const staffCounts = staffLabels.map(label => filtered.filter(f => f.staffHelpful === label).length);

  const chartSettings = (data, color) => ({
    labels: ratingLabels,
    datasets: [{ data, backgroundColor: color }]
  });

  const lineSettings = (label, data, color) => ({
    datasets: [{
      label, data, borderColor: color, tension: 0.3, fill: false
    }]
  });

  const timeOptions = {
    scales: {
      x: { type: 'time', time: { unit: 'day' } },
      y: { min: 1, max: 5 }
    }
  };

  return (
    <div className="dashboard-layout">
      <aside className="sideMenu">
        <img src={adidas} alt="Logo" className="sideMenu-logo" />
        <nav className="sideMenu-nav">
          <button
            className={`sideMenu-button ${selectedView === 'statistics' ? 'active' : ''}`}
            onClick={() => setSelectedView('statistics')}
          >
            Statistics
          </button>
          <button
            className={`sideMenu-button ${selectedView === 'tendencies' ? 'active' : ''}`}
            onClick={() => setSelectedView('tendencies')}
          >
            Tendencies
          </button>
          <button
            className={`sideMenu-button ${selectedView === 'comments' ? 'active' : ''}`}
            onClick={() => setSelectedView('comments')}
          >
            Comments
          </button>
        </nav>

      </aside>

      <main className="main-dashboard">
        <h1>DASHBOARD</h1>

        <select className="store-locator" value={selectedStore} onChange={(e) => setSelectedStore(e.target.value)}>
          <option value="">SHOP</option>
          {stores.map(store => <option key={store} value={store}>{store}</option>)}
        </select>
        {selectedView === 'comments' && (
          <div className="comments-section">
            <h2>Customer Comments</h2>
            <ul className="comments-list">
              {filtered
                .filter(f => f.comment)
                .map((f, i) => (
                  <li key={i} className="comment-item">
                    <p>{f.comment}</p>
                    <button
                      onClick={() => HighlightComm(f._id, f.comment)}
                      className="highlight-button"
                    >
                      Highlight
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        )}
        {selectedView === 'statistics' && (
          <>
            <div className="stats-container">
              {[
                ['Feedbacks', filtered.length],
                ['Average Availability', calculateAverage('ratingAvailability')],
                ['Average Cleanliness', calculateAverage('storeCleanliness')],
                ['Average Experience', calculateAverage('overallSatisfaction')],
              ].map(([label, value]) => (
                <div key={label} className="card">{label}<span>{value}</span></div>
              ))}
            </div>

            <div className="charts-grid">
              <div className="chart-container">
                <h4>Product Availability</h4>
                <Bar data={chartSettings(countRatings('ratingAvailability'), '#36a2eb')}
                  options={{ plugins: { legend: { display: false } } }} />
              </div>
              <div className="chart-container">
                <h4>Was the staff Helpful</h4>
                <Pie data={{ labels: staffLabels, datasets: [{ data: staffCounts, backgroundColor: ['#4caf50', '#f44336', '#ff9800'] }] }}
                  options={{ plugins: { legend: { position: 'bottom' } } }} />
              </div>
              <div className="chart-container">
                <h4>Store Cleanliness</h4>
                <Bar data={chartSettings(countRatings('storeCleanliness'), '#4bc0c0')}
                  options={{ plugins: { legend: { display: false } } }} />
              </div>
              <div className="chart-container">
                <h4>Overall Experience</h4>
                <Bar data={chartSettings(countRatings('overallSatisfaction'), '#ff6384')}
                  options={{ plugins: { legend: { display: false } } }} />
              </div>
            </div>
          </>
        )}
        {selectedView === 'tendencies' && (
          <div className="charts-grid">
            <div className="chart-container">
              <h4>Trend: Availability</h4>
              <Line data={lineSettings('Availability', getTimeData('ratingAvailability'), '#36a2eb')}
                options={timeOptions} />
            </div>
            <div className="chart-container">
              <h4>Trend: Cleanliness</h4>
              <Line data={lineSettings('Cleanliness', getTimeData('storeCleanliness'), '#4bc0c0')}
                options={timeOptions} />
            </div>
            <div className="chart-container">
              <h4>Trend: Satisfaction</h4>
              <Line data={lineSettings('Satisfaction', getTimeData('overallSatisfaction'), '#ff6384')}
                options={timeOptions} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}