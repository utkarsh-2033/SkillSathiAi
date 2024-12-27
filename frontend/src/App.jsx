import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Navbar from "./componenets/Navbar";
import Profile from "./pages/Profile";
import PrivateProfile from "./components/PrivateProfile";
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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
