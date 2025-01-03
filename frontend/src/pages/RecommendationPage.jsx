import React, { useState } from "react";

const CourseRecommendation = () => {
  const [prompt, setPrompt] = useState("");
  const [numOfRec, setNumOfRec] = useState(10);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setRecommendations([]);

    try {
      const response = await fetch("http://127.0.0.1:5000/course-recommendation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, num_of_rec: parseInt(numOfRec) }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch recommendations");
      }

      const data = await response.json();
      setRecommendations(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-md shadow-md">
      <h1 className="text-2xl font-bold text-gray-700 mb-4">Course Recommendation</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="prompt"
            className="block text-sm font-medium text-gray-600 mb-1"
          >
            Enter Skill/Topic:
          </label>
          <input
            id="prompt"
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., React, Machine Learning"
            className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label
            htmlFor="numOfRec"
            className="block text-sm font-medium text-gray-600 mb-1"
          >
            Number of Recommendations:
          </label>
          <input
            id="numOfRec"
            type="number"
            value={numOfRec}
            onChange={(e) => setNumOfRec(e.target.value)}
            min="1"
            className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          {loading ? "Loading..." : "Get Recommendations"}
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {recommendations.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-bold text-gray-700 mb-4">Recommended Courses:</h2>
          <table className="table-auto w-full border-collapse bg-white shadow-sm rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Description</th>
                <th className="px-4 py-2">Stars</th>
                <th className="px-4 py-2">Source</th>
                <th className="px-4 py-2">URL</th>
              </tr>
            </thead>
            <tbody>
              {recommendations.map((rec, index) => (
                <tr key={index} className="border-b hover:bg-gray-100">
                  <td className="px-4 py-2">{rec.Title}</td>
                  <td className="px-4 py-2">{rec.Description || "N/A"}</td>
                  <td className="px-4 py-2">{rec.Stars || "N/A"}</td>
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
    </div>
  );
};

export default CourseRecommendation;
