import {useState} from 'react';
import './Form.css';
import adidas from './assets/adidas.png';
export default function Form()
{
    const [form, setForm]=useState({
    location: '',
    availability: '',
    staff: '',
    cleanliness: '',
    satisfaction: 0,
    comment: ''
});
const [commentClicked, setCommentClicked]=useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();

  const { location, availability, staff, cleanliness, satisfaction } = form;

  // Validación de campos requeridos
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
    body: JSON.stringify(form),
  });

  alert('Thank you for your feedback!');

  setForm({
    location: '',
    availability: '',
    staff: '',
    cleanliness: '',
    satisfaction: 0,
    comment: ''
  });
  setCommentClicked(false);
};


const Rating = (field) =>
[1, 2, 3, 4, 5].map(num =>(
    <button
        key={num}
        type="button"
        className = {form[field] === num ? 'selected' : ''}
        onClick = {() => setForm({...form, [field]:num})}
    >
        {num}
    </button>
));


return (
    <div className="form-container">
        <form className = "form" onSubmit = {handleSubmit}>
        <img src={adidas} alt="Adidas Logo" className="logo"/>
        <hr className = "logo-divider"/>

        <div className="slogan">
            <strong>Your Feedback</strong> <br />
            Our Improvement.
        </div>

        <p className="text_header">Tell us about your experience</p>

        <select value={form.location}
        onChange = {e => setForm({...form, location:e.target.value})}>
        <option value = "">Store Location</option>
        <option value = "adidas Store | Unicentro">adidas Store Bogota, Centro Comercial Unicentro</option>
        <option value = "adidas Outlet | Cra 13 #58-15">adidas Outlet Store Bogota, Cra 13 # 58-15</option>
        <option value = "adidas Store | Brand Center">adidas Brand Center Bogota</option>
        </select>

        <label>Product Availability</label>
        <div className ="rating"> {Rating('availability')} </div>

        <label>Was our staff helpful?</label>
        <div className ="rating_string"> 
        
            {['Yes', 'No', 'Not Sure'].map(option => (
                <button
                type ="button"
                key = {option}
                className = {form.staff === option ? 'selected' : ''}
                onClick={() => setForm({...form, staff: option})}
            > {option} 
            </button>
            ))}
        
        </div>

        <label>Store cleanliness</label>
        <div className ="rating"> {Rating('cleanliness')} </div>

        <label>Overall satisfaction</label>
        <div className ="custom-rating">
            {[0, 1, 2].map((index)=>{
                const fillHeight=getBarFillHeight(form.satisfaction, index);
                return(
                    <div key={index}className={`bar-wrapper bar-${index}`}>
                        <div
                        className="bar-fill"
                        style={{height:`${fillHeight}%`}}
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
            onChange={(e)=>
                setForm({...form, satisfaction:parseInt(e.target.value)})
            }
            className="custom-slider"
        />
        <div className="slider-value">{form.satisfaction ||''}</div>

    <label>Comments (Optional)</label>
    <textarea
    placeholder="leave a suggestion, help us grow"
    value={commentClicked ? form.comment: ''}
    onFocus={()=>setCommentClicked(true)}
    onChange = {e => setForm({...form, comment: e.target.value})}
    />

        <button className = "Bttn_send" type="submit">SEND</button> 
    
        </form>
</div>
);
}

function getBarFillHeight (value, index){
    const levels={
        0:[0,0,0],
        1:[100,0,0],
        2:[100,50,0],
        3:[100,100,0],
        4:[100,100,50],
        5:[100,100,100],
    };
    return levels[value]?.[index]||0;
}