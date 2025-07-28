import {useState} from 'react';

export default function Form()
{
    const [form, setForm]=useState({
    location: '',
    availability: '',
    staff: '',
    cleanliness: '',
    satisfaction: '',
    comment: ''
});

const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('http://localhost:4000/api/feedback',{
    method: 'POST',
    headers: { 'Content-Type' : 'application/json'},
    body: JSON.stringify(form),
});

alert('Thank you for your feedback!');

setForm({  
    location: '',
    availability: '',
    staff: '',
    cleanliness: '',
    satisfaction: '',
    comment: ''
    });
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
    <form className = "form" onSubmit = {handleSubmit}>

    <div className = "logo-divider"></div>

    <div className="slogan">
        <strong>Your Feedback</strong> <br />
        Our Improvement.
    </div>

    <p className="text_header">Tell us about your experience</p>

    <select value={form.location}
    onChange = {e => setForm({...form, location:e.target.value})}>
     <option value = "">Store Locator</option>
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
            type ="buttom"
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
    <div className ="rating"> {Rating('satisfaction')} </div>

   <label>Comments (Optional)</label>
   <textarea
   value = {form.comment}
   onChange = {e => setForm({...form, comment: e.target.value})}
   />

    <button className = "Bttn_send" type="submit">SEND</button> 
  
    </form>
);
}
