import { useState } from "react";
import "./App.css";
function SmallInput({ name, type, text, value, onChange, error }) {
  return (
    <div className="input-container">
      <label htmlFor={name}>{text}</label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={error ? "error" : ""}
      />
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

function QueryType({ selectedOption, setSelectedOption, error }) {
  return (
    <fieldset>
      <legend>Query Type *</legend>

      {["general", "support"].map((type) => (
        <label
          key={type}
          htmlFor={type}
          className={`query-label ${selectedOption === type ? "active" : ""}`}
          style={{
            backgroundColor:
              selectedOption === type ? "hsl(148, 38%, 91%)" : "",
          }}
        >
          <input
            type="radio"
            name="query"
            id={type}
            checked={selectedOption === type}
            onChange={() => setSelectedOption(type)}
          />
          {type === "general" ? "General Enquiry" : "Support Request"}
        </label>
      ))}
      {error && <p className="error-message">{error}</p>}
    </fieldset>
  );
}

function BigInput({ value, onChange, error }) {
  return (
    <div className="input-container">
      <label htmlFor="message">Message *</label>
      <textarea
        id="message"
        name="message"
        value={value}
        onChange={onChange}
        className={error ? "error" : ""}
      />
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

function CheckBox({ checked, onChange, error }) {
  return (
    <div className="input-container">
      <label htmlFor="contact" className="checkbox-label">
        <input
          type="checkbox"
          id="contact"
          name="consent"
          checked={checked}
          onChange={onChange}
        />
        I consent to being contacted by the team *
      </label>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

function PopupMessage() {
  return (
    <div className="popup-container hidden">
      <div className="popup-title">
        <img src="\public\icon-success-check.svg" alt="Success icon" />
        <h3>Message Sent!</h3>
      </div>
      <p>Thanks for completing the form. We'll be in touch soon!</p>
    </div>
  );
}

export default function App() {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/u;
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    message: "",
    query: "",
    consent: false,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.first_name.trim())
      newErrors.first_name = "This field is required";
    if (!formData.last_name.trim())
      newErrors.last_name = "This field is required";
    if (!emailRegex.test(formData.email))
      newErrors.email = "Please enter a valid email adress";
    if (!formData.email.trim()) newErrors.email = "This field is required";
    if (!formData.query) newErrors.query = "Please select a query type";
    if (!formData.message.trim()) newErrors.message = "This field is required";
    if (!formData.consent)
      newErrors.consent =
        "To submit this form, please consent to being contacted";

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    const popup = document.querySelector(".popup-container");

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    popup.classList.toggle("hidden");
    setTimeout(() => {
      popup.classList.toggle("hidden");
    }, 5000);
    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      query: "",
      message: "",
      consent: false,
    });
  };

  return (
    <>
      <PopupMessage />
      <form className="card-container" onSubmit={handleSubmit}>
        <h1 className="form-title">Contact Us</h1>
        <div className="names-container">
          <SmallInput
            name="first_name"
            text="First Name *"
            type="text"
            value={formData.first_name}
            onChange={handleChange}
            error={errors.first_name}
          />
          <SmallInput
            name="last_name"
            text="Last Name *"
            type="text"
            value={formData.last_name}
            onChange={handleChange}
            error={errors.last_name}
          />
        </div>
        <SmallInput
          name="email"
          text="Email Address *"
          type="text"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
        />
        <QueryType
          selectedOption={formData.query}
          setSelectedOption={(value) =>
            setFormData({ ...formData, query: value })
          }
          error={errors.query}
        />
        <BigInput
          value={formData.message}
          onChange={handleChange}
          error={errors.message}
        />
        <CheckBox
          checked={formData.consent}
          onChange={handleChange}
          error={errors.consent}
        />
        <button type="submit">Submit</button>
      </form>
    </>
  );
}
