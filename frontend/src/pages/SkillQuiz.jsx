import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

const SkillQuiz = () => {
  const skills = [
    "React.js", "HTML", "CSS", "JavaScript", "Node.js", "Express.js", "MongoDB", "Angular.js", 
    "Spring Boot", "Hibernate", "MySQL", "PostgreSQL", "Python", "Django", "Flask", "Ruby", 
    "Ruby on Rails", "PHP", "Laravel", "CodeIgniter", "C#", ".NET Core", "ASP.NET", 
    "Microsoft SQL Server", "REST APIs", "Vue.js", "Pandas", "NumPy", "Data Cleaning", 
    "Feature Engineering", "scikit-learn", "TensorFlow", "Keras", "PyTorch", "Matplotlib", 
    "Seaborn", "Plotly", "Tableau", "NLTK", "spaCy", "Hugging Face", "TextBlob", "OpenCV", 
    "YOLO", "SQL", "ETL Processes", "Apache Airflow", "Talend", "Apache Spark", "Hadoop", 
    "Kafka", "Hive", "Cassandra", "AWS (Redshift, S3)", "Google BigQuery", "Azure Data Lake", 
    "GANs", "OpenAI Gym", "Stable-Baselines", "Deep Q-Learning", "Bias Mitigation", 
    "Explainable AI", "FairML", "Scrum", "Kanban", "JIRA", "Confluence", "Roadmap Planning", 
    "Market Analysis", "SWOT Analysis", "Presentation Skills", "Documentation", 
    "Product Lifecycle Management", "Go-to-Market Strategy", "Competitive Analysis", 
    "Pricing Strategy", "Product Vision", "Market Segmentation", "User Research", 
    "User Testing", "Wireframing", "Prototyping", "UX/UI Design Collaboration", "A/B Testing", 
    "Growth Hacking", "KPI Analysis", "User Acquisition", "Retention Strategies", 
    "Funnel Analysis", "Excel", "DCF Analysis", "Ratio Analysis", "Bloomberg Terminal", 
    "Reuters", "Monte Carlo Simulation", "Regulatory Frameworks", "Audit", 
    "Financial Modelling", "Valuation Techniques", "Asset Management", "Credit Risk Assessment", 
    "Financial Statement Analysis", "Credit Scoring Models", "Credit Rating Systems", 
    "Mergers & Acquisitions (M&A)", "Financial Reporting", "Capital Budgeting", 
    "Cost of Capital", "Debt Financing", "Visual Design", "Interaction Design", 
    "User Interface Design", "Figma", "Adobe XD", "InVision", "Framer", "Photoshop", 
    "Illustrator", "Typography", "Color Theory"
];

  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [filteredSkills, setFilteredSkills] = useState(skills); // State for filtered skills
  const [selectedSkill, setSelectedSkill] = useState(null); // Selected skill
  const navigate = useNavigate(); // Routing

  const handleSearchChange = (e) => {
    e.preventDefault(); // Prevent form submission reload
    const term = searchTerm.toLowerCase();
    const filtered = skills.filter((skill) =>
      skill.toLowerCase().includes(term)
    );
    setFilteredSkills(filtered.length > 0 ? filtered : []); // Update filtered skills
  };

  const handleSkillClick = (skillName) => {
    setSelectedSkill((prevSkill) => (prevSkill === skillName ? null : skillName));
  };

  const handleLevelClick = (skillName, quizLevel) => {
    navigate(`/quiz/${skillName}?level=${quizLevel}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 px-4">
      {/* Search Bar */}
      <div className="w-full max-w-3xl my-6">
        <form
          onSubmit={handleSearchChange}
          className="flex items-center rounded-md bg-slate-200 p-1"
        >
          <input
            type="text"
            aria-label="Search"
            className="focus:outline-none  p-2 bg-transparent flex-grow rounded-lg h-14"
            placeholder="Search for a skill..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            type="submit"
            aria-label="Search Button"
            className="bg-[#9333ea] rounded-full p-2 m-1 text-white"
          >
            <FaSearch />
          </button>
        </form>
      </div>

      {/* Skills Section */}
      <div className="w-full max-w-[80%] mx-auto  bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Skill Quiz
        </h1>
        {filteredSkills.length > 0 ? (
          <div className="flex flex-col gap-4 w-full">
            {filteredSkills.map((skill, index) => (
              <div key={index} className="relative">
                <button
                  className="bg-gray-50 p-4 border rounded-md w-full shadow hover:bg-gray-200 text-gray-700 font-semibold"
                  onClick={() => handleSkillClick(skill)} // Toggle level options
                >
                  {skill}
                </button>

                {selectedSkill === skill && (
                  <div className="absolute mt-2 w-full bg-white shadow-lg rounded-md z-10 p-4">
                    <p className="text-gray-600 text-center mb-4">
                      Select Skill Level:
                    </p>
                    {["Easy", "Intermediate", "Advanced"].map((level) => (
                      <button
                        key={level}
                        className="block w-full text-center py-2 px-4 rounded-md mb-2 bg-blue-500 hover:bg-blue-600 text-white"
                        onClick={() => handleLevelClick(skill, level.toLowerCase())}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            No matching skill found. Please try a different search term.
          </p>
        )}
      </div>
    </div>
  );
};

export default SkillQuiz;