import React, { useState } from 'react';
import './Dropdown.css';


const SubjectDropdown = ({ updateHints }) => {
  const [subjects, setSubjects] = useState([
    "WEB DEVLOPMENT",  // These represent subject names in the initialHints object
    "Data SCIENCE",
    "UI/UX DESIGNER",  // Updated key
    "FINANCIAL ANALYST",  // Updated key
    "PRODUCT MANAGER",  // Updated key
  ]);
 
  const [selectedSubject, setSelectedSubject] = useState("");


  const handleSubjectChange = (e) => {
    const subject = e.target.value;
    setSelectedSubject(subject);
    updateHints(subject);
  };


  return (
    <div className="subject-dropdown-container">
      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="subject-dropdown" style={{ marginRight: '10px' }}>
          Select a subject:
        </label>
        <select
          id="subject-dropdown"
          value={selectedSubject}
          onChange={handleSubjectChange}
          style={{ padding: '5px', marginRight: '10px' }}
        >
          <option value="" disabled>
            Select
          </option>
          {subjects.map((subject, index) => (
            <option key={index} value={subject}>
              {subject}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};


export default SubjectDropdown;
