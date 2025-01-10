import React, { useState } from 'react';
import styles from '../../pages/sudokustyle.module.css';

const SubjectDropdown = ({ updateHints }) => {
  const [subjects] = useState([
    'WEB DEVELOPMENT',
    'DATA SCIENCE',
    'UI/UX DESIGNER',
    'FINANCIAL ANALYST',
    'PRODUCT MANAGER',
  ]);

  const [selectedSubject, setSelectedSubject] = useState('');

  const handleSubjectChange = (e) => {
    const subject = e.target.value;
    setSelectedSubject(subject);
    updateHints(subject);
  };

  return (
    <div className={styles.dropdownContainer}>
      <label htmlFor="subject-dropdown" className={styles.label}>
        Select a subject:
      </label>
      <select
        id="subject-dropdown"
        value={selectedSubject}
        onChange={handleSubjectChange}
        className={styles.dropdown}
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
  );
};

export default SubjectDropdown;
