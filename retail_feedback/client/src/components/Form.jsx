import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import './Form.css';
import adidas from './assets/adidas.png';

/********************************
Name: Location Map
Function: Associates internal keys (unicentro, outlet, brand) with the full and visible names of adidas stores.
********************************/
const locationMap = {
  unicentro: 'adidas Store | Unicentro',
  outlet: 'adidas Outlet | Cra 13 #58-15',
  brand: 'adidas Store | Brand Center'
};

export default function Form() {
  const [form, setForm] = useState({
    location: '',
    availability: '',
    staff: '',
    cleanliness: '',
    satisfaction: 0,
    comment: ''
  });

  const [commentClicked, setCommentClicked] = useState(false);
  const [searchParams] = useSearchParams();

/********************************
Name: useEffect to set location from URL
Function & Result: Gets the 'location' parameter from the URL and compares it to the locationMap.
If valid, updates the form's 'location' field with the full store name.
If invalid or missing, displays an alert to the user.
********************************/
  useEffect(() => {
    const locationParam = searchParams.get('location');
    if (locationParam && locationMap[locationParam.toLowerCase()]) {
      setForm((prevForm) => ({
        ...prevForm,
        location: locationMap[locationParam.toLowerCase()]
      }));
    } else {
      alert('Invalid or missing store location');
    }
  }, [searchParams]);

/********************************
Name: handleSubmit Function
Function: Handles the submission of the feedback form.
Validates that all required fields are complete before sending the data to the server.
Result: If the data is valid, it is sent to the API via a POST request.
A thank you message is then displayed and the form is reset.
********************************/
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { location, availability, staff, cleanliness, satisfaction } = form;

    if (
      location === '' ||
      availability === '' ||
      staff === '' ||
      cleanliness === '' ||
      satisfaction === 0
    ) {
      alert('Please complete all required fields before submitting.');
      return;
    }

    await fetch('http://localhost:4000/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    alert('Thank you for your feedback!');

    setForm({
      location: form.location,
      availability: '',
      staff: '',
      cleanliness: '',
      satisfaction: 0,
      comment: ''
    });

    setCommentClicked(false);
  };

/********************************
Name: Rating Function
Function: Dynamically generates buttons from 1 to 5 to represent a rating per question.
Visually marks the selected button and updates the corresponding value in the form.
Result: Allows the user to select a rating from 1 to 5 for a specific form field.
********************************/
  const Rating = (field) =>
    [1, 2, 3, 4, 5].map((num) => (
      <button
        key={num}
        type="button"
        className={form[field] === num ? 'selected' : ''}
        onClick={() => setForm({ ...form, [field]: num })}
      >
        {num}
      </button>
    ));

  return (
    <div className="form-container">
      <form className="form" onSubmit={handleSubmit}>
        <img src={adidas} alt="Adidas Logo" className="logo" />
        <hr className="logo-divider" />

        <div className="slogan">
          <strong>Your Feedback</strong> <br />
          Our Improvement.
        </div>

        <p className="text_header">Tell us about your experience</p>

        <div className="location_display">
          <strong>Store: </strong> {form.location || 'Loading...'}
        </div>

        <label>Product Availability</label>
        <div className="rating">{Rating('availability')}</div>

        <label>Was our staff helpful?</label>
        <div className="rating_string">
          
          {/********************************
            Name: Rating String
            Function: Generates buttons with the options "Yes," "No," and "Not Sure" for the user to select.
            Result: Updates the form status based on the selected option.
            ********************************/
            }

          {['Yes', 'No', 'Not Sure'].map((option) => (
            <button
              type="button"
              key={option}
              className={form.staff === option ? 'selected' : ''}
              onClick={() => setForm({ ...form, staff: option })}
            >
              {option}
            </button>
          ))}
        </div>

        <label>Store cleanliness</label>
        <div className="rating">{Rating('cleanliness')}</div>

        <label>Overall satisfaction</label>
        <div className="custom-rating">
          {[0, 1, 2].map((index) => {
            const fillHeight = getBarFillHeight(form.satisfaction, index);
            return (
              <div key={index} className={`bar-wrapper bar-${index}`}>
                <div
                  className="bar-fill"
                  style={{ height: `${fillHeight}%` }}
                ></div>
              </div>
            );
          })}
        </div>

        <input
          type="range"
          min="0"
          max="5"
          step="1"
          value={form.satisfaction}
          onChange={(e) =>
            setForm({ ...form, satisfaction: parseInt(e.target.value) })
          }
          className="custom-slider"
        />
        <div className="slider-value">{form.satisfaction || ''}</div>

        <label>Comments (Optional)</label>
        <textarea
          placeholder="Leave a suggestion, help us grow"
          value={commentClicked ? form.comment : ''}
          onFocus={() => setCommentClicked(true)}
          onChange={(e) => setForm({ ...form, comment: e.target.value })}
        />

        <button className="Bttn_send" type="submit">
          SEND
        </button>
      </form>
    </div>
  );
}

/********************************
Name: getBarFillHeight Function
Function: Determines the fill percentage of the adidas logo based on the rating value.
Each value corresponds to a three-level array that simulates the height of stacked segments.
Result: Returns the fill percentage (0 to 100) to graphically represent the value.
********************************/
function getBarFillHeight(value, index) {
  const levels = {
    0: [0, 0, 0],
    1: [100, 0, 0],
    2: [100, 50, 0],
    3: [100, 100, 0],
    4: [100, 100, 50],
    5: [100, 100, 100]
  };
  return levels[value]?.[index] || 0;
}
