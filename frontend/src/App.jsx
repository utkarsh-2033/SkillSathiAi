import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Navbar from "./componenets/Navbar";
import Profile from "./pages/Profile";
import PrivateProfile from "./componenets/PrivateProfile";
import SkillAssessment from './pages/skill-assessment'
import Quiz from "./pages/Quiz";
function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<PrivateProfile/>}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/skill-assessment" element={<SkillAssessment />} />
          <Route path="/quiz/:skillname" element={<Quiz />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
