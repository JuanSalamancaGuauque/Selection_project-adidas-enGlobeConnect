import { useEffect, useState } from 'react';

import adidas from './assets/adidaswhite.png';
import idol1 from './assets/jefe.png';
import idol2 from './assets/messi.png';
import idol3 from './assets/zapatilla.png';
import idol4 from './assets/worldcup.png';

import Fbackground from './assets/background.jpg';

import './DashClient.css';

const idolImages = [idol1, idol2, idol3, idol4];

export default function DashClient() {
  const [feedbackData, setFeedbackData] = useState([]);
  const [highlightedComments, setHighlightedComments] = useState([]);
  const [currentCommentIndex, setCurrentCommentIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [storeTitle, setStoreTitle] = useState('Loading...');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fadeImage, setFadeImage] = useState(true);

  const storeName = 'Brand';

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeImage(false);
      setTimeout(() => {
        setCurrentImageIndex((prev) => (prev + 1) % idolImages.length);
        setFadeImage(true);
      }, 500);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const feedbackRes = await fetch(`http://localhost:4000/api/feedback?location=${storeName}`);
        const feedbackJson = await feedbackRes.json();
        setFeedbackData(feedbackJson);
        if (feedbackJson.length > 0) {
          setStoreTitle(feedbackJson[0].location);
        }

        const commentRes = await fetch(`http://localhost:4000/api/highlighted?location=${storeName}`);
        const commentJson = await commentRes.json();
        setHighlightedComments(commentJson);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentCommentIndex((prevIndex) =>
          (prevIndex + 1) % highlightedComments.length
        );
        setFade(true);
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, [highlightedComments]);

  const avg = (key) => {
    if (feedbackData.length === 0) return 0;
    const total = feedbackData.reduce((sum, entry) => sum + (entry[key] || 0), 0);
    return total / feedbackData.length;
  };

  const getStars = (value) => {
    const rounded = Math.round(value);
    return '★'.repeat(rounded) + '☆'.repeat(5 - rounded);
  };

  const currentComment =
    highlightedComments.length > 0
      ? highlightedComments[currentCommentIndex]?.commentText
      : 'Loading comments...';

  return (
    <div className="background" style={{ backgroundImage: `url(${Fbackground})` }}>
      <div className="chart_container">
        <div className={`chart_box ${loaded ? 'loaded' : ''}`}>
          <div className="column First_column">
            <img src={adidas} alt="adidas logo" className="adidas_logo" />
            <div className="store_container">
              <p className="store_name">{storeTitle.toUpperCase()}</p>
            </div>
            <div className="foundation">
              <span>19</span>
              <div className="divider"></div>
              <span>24</span>
            </div>
          </div>

          <div className="column Second_column">
            <img
              src={idolImages[currentImageIndex]}
              alt="adidas idol"
              className={`idol_img ${fadeImage ? 'fade-in' : 'fade-out'}`}
            />
          </div>

          <div className="column Third_column">
            <h2>WE ARE THE BEST OPTION FOR YOU</h2>
            <p className="subtittle">WE DON'T SAY IT, YOU SAY IT</p>

            <div className="ratings">
              <div className="rating_item">
                <div className="stars">{getStars(avg('availability'))}</div>
                <p>PRODUCT AVAILABILITY</p>
              </div>

              <div className="rating_item">
                <div className="stars">{getStars(avg('cleanliness'))}</div>
                <p>STORE CARE</p>
              </div>

              <div className="rating_item">
                <div className="stars">{getStars(avg('satisfaction'))}</div>
                <p>GENERAL SATISFACTION</p>
              </div>
            </div>

            <div className={`comment_box ${fade ? 'fade-in' : 'fade-out'}`}>
              <em>"{currentComment}"</em>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}