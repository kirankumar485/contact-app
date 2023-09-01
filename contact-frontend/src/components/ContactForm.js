import React, { useState } from "react";
import axios from "axios";

const InputField = ({ label, value, onChange, type = "text" }) => (
  <div>
    <label>{label}:</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

const ContactForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState({
    line1: "",
    line2: "",
    city: "",
    country: "",
    zipCode: "",
  });
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const newContact = {
      firstName,
      lastName,
      gender,
      address,
      email,
      phone,
    };

    try {
      await axios.post("http://localhost:3001/api/data", newContact);
      clearForm();
    } catch (error) {
      console.error("Error creating data:", error);
    }
  };

  const validateForm = () => {
    if (
      !firstName ||
      !lastName ||
      !gender ||
      !address.line1 ||
      !address.city ||
      !address.country ||
      !address.zipCode ||
      !email ||
      !phone
    ) {
      alert("All fields are mandatory.");
      return false;
    }

    if (!/^[A-Za-z]+$/.test(firstName) || firstName.length < 3) {
      alert(
        "First name should have at least 3 letters and contain only alphabets."
      );
      return false;
    }

    if (!/^[A-Za-z]+$/.test(lastName) || lastName.length < 3) {
      alert(
        "Last name should have at least 3 letters and contain only alphabets."
      );
      return false;
    }

    if (!/^(MALE|FEMALE|OTHERS)$/.test(gender)) {
      alert("Gender should be MALE, FEMALE, or OTHERS.");
      return false;
    }

    if (address.line1.length < 8) {
      alert("Address line 1 should have at least 8 characters.");
      return false;
    }

    if (!address.city) {
      alert("City is mandatory.");
      return false;
    }

    if (!/^[A-Z]+$/.test(address.country)) {
      alert("Country should contain only capital letters.");
      return false;
    }

    if (!/^\d{10}$/.test(phone)) {
      alert("Phone number should be a 10-digit number.");
      return false;
    }

    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      alert("Enter a valid email address.");
      return false;
    }

    return true;
  };
  const clearForm = () => {
    setFirstName("");
    setLastName("");
    setGender("");
    setAddress({
      line1: "",
      line2: "",
      city: "",
      country: "",
      zipCode: "",
    });
    setEmail("");
    setPhone("");
  };

  return (
    <div className="CreateForm">
      <h2 className="heading">Create Form</h2>
      <form onSubmit={handleSubmit}>
        <InputField
          label="First Name"
          value={firstName}
          onChange={setFirstName}
        />
        <InputField label="Last Name" value={lastName} onChange={setLastName} />
        <InputField label="Gender" value={gender} onChange={setGender} />
        <InputField
          label="Address Line 1"
          value={address.line1}
          onChange={(val) => setAddress({ ...address, line1: val })}
        />
        <InputField
          label="Address Line 2"
          value={address.line2}
          onChange={(val) => setAddress({ ...address, line2: val })}
        />
        <InputField
          label="City"
          value={address.city}
          onChange={(val) => setAddress({ ...address, city: val })}
        />
        <InputField
          label="Country"
          value={address.country}
          onChange={(val) => setAddress({ ...address, country: val })}
        />
        <InputField
          label="Zip Code"
          value={address.zipCode}
          onChange={(val) => setAddress({ ...address, zipCode: val })}
        />
        <InputField
          label="Email"
          value={email}
          onChange={setEmail}
          type="email"
        />
        <InputField
          label="Phone"
          value={phone}
          onChange={setPhone}
          type="tel"
        />
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default ContactForm;
