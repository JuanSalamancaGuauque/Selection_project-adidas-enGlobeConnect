import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';

import adidas from './assets/adidaswhite.png';
import idol1 from './assets/jefe.png';
import idol2 from './assets/messi.png';
import idol3 from './assets/zapatilla.png';
import idol4 from './assets/worldcup.png';
import Fbackground from './assets/background.jpg';

import './DashClient.css';

const idolImages = [idol1, idol2, idol3, idol4];

export default function DashClient() {

/*********************************
Name: Global component states (display screen or presentation)
Function: Manages the state of feedback data, highlighted comments, animations, images, and store parameters.
********************************/

  const [feedbackData, setFeedbackData] = useState([]);
  const [highlightedComments, setHighlightedComments] = useState([]);
  const [currentCommentIndex, setCurrentCommentIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [storeTitle, setStoreTitle] = useState('Loading...');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fadeImage, setFadeImage] = useState(true);
  const [storeLocation, setStoreLocation] = useState('');
  const [searchParams] = useSearchParams();

/********************************
Name: useEffect - Extract location parameter
Function: Obtains the `location` parameter from the URL and saves it to the `storeLocation` state
Result: Allows you to determine which store should be displayed based on the URL.
********************************/
  useEffect(() => {
    const locationParam = searchParams.get("location");
    if (locationParam) {
      setStoreLocation(locationParam.toLowerCase());
    }
  }, [searchParams]);

/********************************
Name: useEffect - Image Rotation with Animation
Function: Changes the current image every 6 seconds by applying a fade-in animation.
- First, disables the animation.
- Then, after 0.5 seconds, change the image and re-enables the animation.
********************************/
  useEffect(() => {
    const interval = setInterval(() => {
      setFadeImage(false);
      setTimeout(() => {
        setCurrentImageIndex((prev) => (prev + 1) % idolImages.length);
        setFadeImage(true);
      }, 500);
    }, 6000);

  /*Cleaning image rotation interval*/
    return () => clearInterval(interval);
  }, []);
  
  /*Startup animation activation*/
  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);
  }, []);

  /*Reaction to location change*/
  useEffect(() => {
    if (!storeLocation) return;

/********************************
Name: fetchData
Function: Makes asynchronous requests to retrieve feedback data and highlighted comments based on the store's location.
If feedback is found, updates the store's title.
Result: Updates the feedbackData, highlightedComments, and storeTitle states with the data retrieved from the server.
********************************/  
    const fetchData = async () => {
      try {
        const feedbackRes = await fetch(`http://localhost:4000/api/feedback?location=${storeLocation}`);
        const feedbackJson = await feedbackRes.json();
        setFeedbackData(feedbackJson);
        if (feedbackJson.length > 0) {
          setStoreTitle(feedbackJson[0].location);
        }

        const commentRes = await fetch(`http://localhost:4000/api/highlighted?location=${storeLocation}`);
        const commentJson = await commentRes.json();
        setHighlightedComments(commentJson);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

/*Calls fetchData() immediately when storeLocation changes and then every 10 seconds.*/
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [storeLocation]);

/*Sets an interval that changes the index of the current featured comment every 5 seconds, with a fade-in animation.*/
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

/********************************
Name: avg - Calculate Average
Function: Calculates the average of the numeric values for a given key in the feedback data.
Result: Returns the numeric average or 0 if no data is available.
********************************/
  const avg = (key) => {
    if (feedbackData.length === 0) return 0;
    const total = feedbackData.reduce((sum, entry) => sum + (entry[key] || 0), 0);
    return total / feedbackData.length;
  };

/********************************
Name: getStars
Function: Converts a numeric value to a visual representation of stars (from 1 to 5).
Result: Returns a string stars based on the rounded value.
********************************/
  const getStars = (value) => {
    const rounded = Math.round(value);
    return '★'.repeat(rounded) + '☆'.repeat(5 - rounded);
  };

/********************************
Name: currentComment
Function: Selects the text of the featured comment based on the current store.
Result: Returns the comment text or a loading message if no comments are available.
********************************/
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
                <p><b>PRODUCT AVAILABILITY</b></p>
              </div>

              <div className="rating_item">
                <div className="stars">{getStars(avg('cleanliness'))}</div>
                <p><b>STORE CARE</b></p>
              </div>

              <div className="rating_item">
                <div className="stars">{getStars(avg('satisfaction'))}</div>
                <p><b>GENERAL EXPERIENCE</b></p>
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
