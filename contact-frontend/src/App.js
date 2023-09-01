import React, { useState } from "react";
import "./App.css";
import ContactTabel from "./components/ContactTable";
import ContactForm from "./components/ContactForm";

const App = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);

  const toggleFormVisibility = () => {
    setIsFormVisible((prevValue) => !prevValue);
  };

  return (
    <div className="App">
      <ContactTabel />
      <div className="create-form">
        <button onClick={toggleFormVisibility}>
          {isFormVisible ? "Hide Form" : "Create Form"}
        </button>
      </div>
      {isFormVisible && <ContactForm />}
    </div>
  );
};

export default App;
