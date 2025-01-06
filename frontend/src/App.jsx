import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Navbar from "./componenets/Navbar";
import Profile from "./pages/Profile";
import PrivateProfile from "./componenets/PrivateProfile";
import SkillAssessment from "./pages/skill-assessment";
import Quiz from "./pages/Quiz";
import Footer from "./componenets/Footer";
import AdminPanel from "./pages/admin";
import SkillGapIdentificationPage from './pages/SkillGapIdentification'
import SkillAssessmentFeedbackPage from "./pages/SkillAssessmentFeedbackPage";
import SkillQuiz from './pages/SkillQuiz'
import RecommendationPage from './pages/RecommendationPage'
import GameSelectionPage from "./pages/Games";
import CarrierGoal from "./pages/CareerGoal";
import PuzzleQuiz from "./pages/PuzzleQuiz";
import SudokuGame from "./pages/Sudoku";
import ProgressPage from "./pages/ProgressPage";
function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route element={<PrivateProfile />}>
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/skill-assessment" element={<SkillAssessment />} />
            <Route path="/quiz/:skillname" element={<Quiz />} />
            <Route path="/skillQuiz" element={<SkillQuiz />}/>
            <Route path="/skill-gap-identification" element={<SkillGapIdentificationPage />} />
            <Route path="/skill-assessment-feedback" element={<SkillAssessmentFeedbackPage />} />
            <Route path="/recommendation" element={<RecommendationPage />} />
            <Route path="/career-goal" element={<CarrierGoal />} />
            <Route path="/games" element={<GameSelectionPage />} />
            <Route path="/game/sudoku" element={<SudokuGame />} />
            <Route path="/game/puzzle-quiz" element={<PuzzleQuiz />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Footer />
    </div>
  );
}

export default App;
