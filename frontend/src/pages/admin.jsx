import React, { useState } from "react";

const initialQuiz = {
  title: "",
  level: "",
  question: {
    type: "MCQ",
    question: "",
    options: ["", "", "", ""],
    correct_option: "",
    difficulty_index: 1,
    explanation: "",
  },
};

const AdminPanel = () => {
  const [quiz, setQuiz] = useState(initialQuiz);

  const handleQuizTitleChange = (e) => {
    setQuiz({ ...quiz, title: e.target.value });
  };

  const handleLevelChange = (level) => {
    setQuiz({ ...quiz, level });
  };

  const handleQuestionChange = (e) => {
    setQuiz({
      ...quiz,
      question: { ...quiz.question, [e.target.name]: e.target.value },
    });
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...quiz.question.options];
    updatedOptions[index] = value;
    setQuiz({
      ...quiz,
      question: { ...quiz.question, options: updatedOptions },
    });
  };

  const saveQuestion = async () => {
    console.log(quiz);
    const { title, level, question } = quiz;
    const questionWithType = {
        ...question,
        type: "MCQ", // Adding the type explicitly
      };

    if (!title || !level || !question.question || !question.correct_option) {
      alert("Please fill all the fields.");
      return;
    }

    try {
      const response = await fetch("/api/addQuestion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, level, question }),
      });

      if (response.ok) {
        alert("Question added successfully!");
        setQuiz(initialQuiz);
      } else {
        const errorData = await response.json();
        alert(`Failed to save question: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error saving question:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4 w-[80%] min-h-screen">
      <div className="space-y-2">
        <label className="block text-2xl font-bold">Quiz Title:</label>
        <input
          type="text"
          value={quiz.title}
          onChange={handleQuizTitleChange}
          className="w-full border rounded p-2"
          placeholder="Enter quiz title"
        />
      </div>

      <div className="flex space-x-4">
        {["easy", "intermediate", "advanced"].map((level) => (
          <button
            key={level}
            onClick={() => handleLevelChange(level)}
            className={`px-4 py-2 text-2xl font-bold rounded ${
              quiz.level === level ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Add Question:</h2>
        <div className="space-y-2">
          <input
            type="text"
            name="question"
            value={quiz.question.question}
            onChange={handleQuestionChange}
            className="w-full border rounded p-2"
            placeholder="Enter question"
          />
          <div className="space-y-1">
            {quiz.question.options.map((option, index) => (
              <div key={index} className="space-y-1">
                <label className="block text-1xl font-bold">
                  Option {index + 1}:
                </label>
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="w-full border rounded p-2"
                  placeholder={`Enter Option ${index + 1}`}
                />
              </div>
            ))}
          </div>
          <label className="block text-1xl font-bold">
                Correct Option
                </label>
          <input
            type="text"
            name="correct_option"
            value={quiz.question.correct_option}
            onChange={handleQuestionChange}
            className="w-full border rounded p-2"
            placeholder="Enter correct option"
          />
          <label className="block text-1xl font-bold">
                Explanation
                </label>
          <textarea
            name="explanation"
            value={quiz.question.explanation}
            onChange={handleQuestionChange}
            className="w-full border rounded p-2"
            placeholder="Enter explanation"
          />
<label className="block text-1xl font-bold">
                
           Difficulty Index:     </label>
          <input
            type="number"
            name="difficulty_index"
            value={quiz.question.difficulty_index}
            onChange={handleQuestionChange}
            className="w-full border rounded p-2"
            placeholder="Enter difficulty index"
            min={1}
            max={5}
          />
        </div>
        <label className="block text-1xl font-bold">
                
                </label>
        <button
          onClick={saveQuestion}
          className="px-4 py-2 text-2xl font-bold bg-green-500 text-white rounded"
        >
          Save Question
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;
