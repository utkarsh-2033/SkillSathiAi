import React, { useState } from "react";

const CourseAndBookRecommendation = () => {
  const [coursePrompt, setCoursePrompt] = useState("");
  const [numOfCourseRec, setNumOfCourseRec] = useState(10);
  const [courseRecommendations, setCourseRecommendations] = useState([]);
  const [loadingCourse, setLoadingCourse] = useState(false);
  const [courseError, setCourseError] = useState("");

  const [bookPrompt, setBookPrompt] = useState("");
  const [numOfBookRec, setNumOfBookRec] = useState(10);
  const [bookRecommendations, setBookRecommendations] = useState([]);
  const [loadingBook, setLoadingBook] = useState(false);
  const [bookError, setBookError] = useState("");

  // Handle Course Recommendations
  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    setLoadingCourse(true);
    setCourseError("");
    setCourseRecommendations([]);

    try {
      const response = await fetch("http://127.0.0.1:5000/course-recommendation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: coursePrompt, num_of_rec: parseInt(numOfCourseRec) }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch course recommendations");
      }

      const data = await response.json();
      // Ensure the data contains valid values
      const validCourseRecommendations = data.map((rec) => ({
        Title: rec.Title || "No Title",
        Description: rec.Description || "No Description",
        Stars: rec.Stars || "N/A",
        Source: rec.Source || "N/A",
        URL: rec.URL || "#", // Ensure URL is valid
      }));

      setCourseRecommendations(validCourseRecommendations.slice(0, 10)); // Limit to 10 recommendations
    } catch (err) {
      setCourseError(err.message);
    } finally {
      setLoadingCourse(false);
    }
  };

  // Handle Book Recommendations
  const handleBookSubmit = async (e) => {
    e.preventDefault();
    setLoadingBook(true);
    setBookError("");
    setBookRecommendations([]);

    try {
      const response = await fetch("http://127.0.0.1:5000/book-recommendation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: bookPrompt, num_of_rec: parseInt(numOfBookRec) }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch book recommendations");
      }

      const data = await response.json();
      // Ensure the data contains valid values
      const validBookRecommendations = data.map((rec) => ({
        Title: rec.Title || "No Title",
        Description: rec.Description || "No Description",
        Author: rec.Author || "Unknown Author",
        Price: rec.Price || "N/A",
        Publisher: rec.Publisher || "Unknown Publisher",
        Stars: rec.Stars || "N/A",
        URL: rec.URL || "#", // Ensure URL is valid
      }));

      setBookRecommendations(validBookRecommendations.slice(0, 10)); // Limit to 10 recommendations
    } catch (err) {
      setBookError(err.message);
    } finally {
      setLoadingBook(false);
    }
  };

  return (
    <div className="my-4 max-w-4xl mx-auto p-6 bg-gray-100 rounded-md shadow-md">
      {/* <h1 className="text-2xl font-bold text-gray-700 mb-4">Course & Book Recommendation</h1> */}

      {/* Course Recommendation Section */}
      <section className="mb-6">
        <h2 className="text-xl font-bold text-gray-700 mb-4">Course Recommendation</h2>
        <form onSubmit={handleCourseSubmit} className="space-y-4">
          <div>
            <label htmlFor="coursePrompt" className="block text-sm font-medium text-gray-600 mb-1">
              Enter Skill/Topic for Courses:
            </label>
            <input
              id="coursePrompt"
              type="text"
              value={coursePrompt}
              onChange={(e) => setCoursePrompt(e.target.value)}
              placeholder="e.g., React, Machine Learning"
              className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="numOfCourseRec" className="block text-sm font-medium text-gray-600 mb-1">
              Number of Recommendations (max 10):
            </label>
            <input
              id="numOfCourseRec"
              type="number"
              value={numOfCourseRec}
              onChange={(e) => setNumOfCourseRec(Math.min(e.target.value, 10))}
              min="1"
              max="10"
              className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loadingCourse}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            {loadingCourse ? "Loading..." : "Get Course Recommendations"}
          </button>
        </form>

        {courseError && <p className="text-red-500 mt-4">{courseError}</p>}

        {courseRecommendations.length > 0 && (
          <div className="overflow-x-auto mt-6">
            <table className="table-auto w-full border-collapse bg-white shadow-sm rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2">Title</th>
                  {/* <th className="px-4 py-2">Description</th> */}
                  <th className="px-4 py-2">Stars</th>
                  <th className="px-4 py-2">Source</th>
                  <th className="px-4 py-2">URL</th>
                </tr>
              </thead>
              <tbody>
                {courseRecommendations.map((rec, index) => (
                  <tr key={index} className="border-b hover:bg-gray-100">
                    <td className="px-4 py-2">{rec.Title}</td>
                    {/* <td className="px-4 py-2">{rec.Description}</td> */}
                    <td className="px-4 py-2">{rec.Stars}</td>
                    <td className="px-4 py-2">{rec.Source}</td>
                    <td className="px-4 py-2">
                      <a
                        href={rec.URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                      >
                        View Course
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Book Recommendation Section */}
      <section>
        <h2 className="text-xl font-bold text-gray-700 mb-4">Book Recommendation</h2>
        <form onSubmit={handleBookSubmit} className="space-y-4">
          <div>
            <label htmlFor="bookPrompt" className="block text-sm font-medium text-gray-600 mb-1">
              Enter Skill/Topic for Books:
            </label>
            <input
              id="bookPrompt"
              type="text"
              value={bookPrompt}
              onChange={(e) => setBookPrompt(e.target.value)}
              placeholder="e.g., React, Machine Learning"
              className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="numOfBookRec" className="block text-sm font-medium text-gray-600 mb-1">
              Number of Recommendations (max 10):
            </label>
            <input
              id="numOfBookRec"
              type="number"
              value={numOfBookRec}
              onChange={(e) => setNumOfBookRec(Math.min(e.target.value, 10))}
              min="1"
              max="10"
              className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loadingBook}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            {loadingBook ? "Loading..." : "Get Book Recommendations"}
          </button>
        </form>

        {bookError && <p className="text-red-500 mt-4">{bookError}</p>}

        {bookRecommendations.length > 0 && (
          <div className="overflow-x-auto mt-6">
            <table className="table-auto w-full border-collapse bg-white shadow-sm rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2">Title</th>
                  {/* <th className="px-4 py-2">Description</th> */}
                  <th className="px-4 py-2">Author</th>
                  <th className="px-4 py-2">Price</th>
                  <th className="px-4 py-2">Publisher</th>
                  <th className="px-4 py-2">Stars</th>
                  <th className="px-4 py-2">URL</th>
                </tr>
              </thead>
              <tbody>
                {bookRecommendations.map((rec, index) => (
                  <tr key={index} className="border-b hover:bg-gray-100">
                    <td className="px-4 py-2">{rec.Title}</td>
                    {/* <td className="px-4 py-2">{rec.Description}</td> */}
                    <td className="px-4 py-2">{rec.Author}</td>
                    <td className="px-4 py-2">{rec.Price}$ </td>
                    <td className="px-4 py-2">{rec.Publisher}</td>
                    <td className="px-4 py-2">{rec.Stars}</td>
                    <td className="px-4 py-2">
                      <a
                        href={rec.URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                      >
                        View Book
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default CourseAndBookRecommendation;
