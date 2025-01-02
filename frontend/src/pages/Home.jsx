// HomePage.jsx
import React from "react";

function HomePage() {
  const handleScroll = (sectionId) => {
    document.getElementById(sectionId).scrollIntoView({ behaviour: "smooth" });
  };
  return (
    // <div>
      <div className="bg-gray-50 min-h-screen">
        {/* Hero Section */}
        <section className="bg-white py-10 mx-auto lg:mt-8  lg:mr-0 md:space-x-10">
          <div className="container mx-auto px-2 flex flex-col-reverse md:flex-row items-center lg:mb-60 pb-8 lg:space-x-20  ">
            {/* Left Content */}
            <div className="md:w-1/2 text-center md:text-left shadow-sm lg:w-[40%] ">
              <h2 className="text-5xl font-bold mb-6 leading-tight">
                Empowering Education with{" "}
                <span className="text-[#5d2294]">AI</span>
              </h2>
              <p className="text-gray-600 mb-8 lg:text-2xl">
                Discover personalized learning paths and career guidance
                tailored to your unique goals. Our AI-driven platform ensures
                progress tracking, practical skills, and community engagement
                for your growth.
              </p>
              <div className="flex items-center justify-center">
                {" "}
                <button
                  onClick={() => handleScroll("features")}
                  className="bg-violet-600 text-white px-6 py-3 rounded-lg text-2xl hover:bg-violet-700 transition mb-8"
                >
                  Get Started
                </button>{" "}
              </div>
            </div>

            {/* Right Illustration */}
            <div className="md:w-full mt-10 md:mt-0 flex justify-center lg:w-[100%] lg:h-[100%]lg:mr-0 lg:mt-0 shadow-sm ">
              <img
                src="https://static.vecteezy.com/system/resources/previews/001/937/625/large_2x/online-education-application-learning-worldwide-on-phone-mobile-website-background-social-distance-concept-the-classroom-training-course-library-illustration-flat-design-vector.jpg" // Replace with your image URL
                alt="Online Education Illustration"
                className="w-full h-full lg:mr-0 lg:ml-6 justify-center mt-10"
              />
            </div>
          </div>
        </section>
        {/* Features Section */}
        <section
          id="features"
          className="bg-gray-10 min-h-screen py-16 items-center "
        >
          <div className="container mx-auto px-4 ">
            <h3 className="text-3xl font-bold text-center mb-12">
              Key Features
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                title="Skill Assessment"
                description="Evaluate your current skills through quizzes and user input."
              />
              <FeatureCard
                title="Personalized Learning Paths"
                description="AI-driven recommendations for tailored courses and resources."
              />
              <FeatureCard
                title="Progress Tracking"
                description="Offer periodic assessments and actionable feedback."
              />
              <FeatureCard
                title="Community Support"
                description="Engage with peers through forums to collaborate and ask questions."
              />
              <FeatureCard
                title="Gamification"
                description="Earn rewards and take on challenges to stay motivated."
              />
              <FeatureCard
                title="Career Interventions"
                description="Practical, career-relevant skill-building activities."
              />
            </div>
          </div>
          <div className="flex items-center justify-center">
            <button
              onClick={() => handleScroll("learnmore")}
              className="bg-violet-600 text-white px-6 py-3 mt-3 items-center rounded-lg text-2xl hover:bg-violet-800 transition duration-200 border-none"
            >
              Learn More
            </button>
          </div>
        </section>
        <section id="learnmore" className="bg-gray-50 py-16 min-h-screen">
  <div className="container mx-auto flex flex-col md:flex-row items-center justify-center lg:space-x-20 lg:text-2xl">
    <div className="md:w-full mt-10 md:mt-0 flex justify-center lg:w-1/2 lg:mt-0 lg:h-[100%]">
      <img
        src="https://www.htmlpanda.com/blog/wp-content/uploads/2021/06/A-Complete-Guide-on-E-Learning-Website-Development-750x375.png"
        alt="Online Education Illustration"
        className="w-[90%] lg:w-[120%] lg:h-auto"
      />
    </div>
    <div className="w-full lg:w-1/2 mt-8 lg:mt-0 lg:pl-8 text-center md:text-left">
      <h2 className="text-2xl font-bold mb-4">
        "Your AI Guide to Skill Development: Step-by-Step Path to Success."
      </h2>

      <ul className="space-y-4 list-none">
        <li className="relative pl-8 before:content-['➤'] before:absolute before:left-0 before:text-violet-700">
          <strong>Skill Assessment:</strong> Use quizzes and user input forms to evaluate current skills.
        </li>
        <li className="relative pl-8 before:content-['➤'] before:absolute before:left-0 before:text-violet-700">
          <strong>Gap Identification:</strong> Analyze quiz results to find skill gaps aligned with career goals.
        </li>
        <li className="relative pl-8 before:content-['➤'] before:absolute before:left-0 before:text-violet-700">
          <strong>Personalized Learning Paths:</strong> Recommend tailored courses and learning resources.
        </li>
        <li className="relative pl-8 before:content-['➤'] before:absolute before:left-0 before:text-violet-700">
          <strong>Progress Tracking:</strong> Provide visual charts and periodic assessments for actionable feedback.
        </li>
        <li className="relative pl-8 before:content-['➤'] before:absolute before:left-0 before:text-violet-700">
          <strong>Community Support:</strong> Enable peer collaboration via forums and live chat.
        </li>
        <li className="relative pl-8 before:content-['➤'] before:absolute before:left-0 before:text-violet-600">
          <strong>Gamification:</strong> Motivate users with rewards, challenges, and achievements.
        </li>
        <li className="relative pl-8 before:content-['➤'] before:absolute before:left-0 before:text-violet-700">
          <strong>Career Interventions:</strong> Focus on practical skill-building for career advancement.
        </li>
      </ul>
    </div>
  </div>
</section>

      </div>
     
  );
}
function FeatureCard({ title, description }) {
  return (
    <div className="bg-white shadow-md p-6 rounded-lg transform transition-transform duration-300 hover:scale-110 hover:bg-slate-50">
      <h4 className="text-xl font-bold mb-4">{title}</h4>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

export default HomePage;