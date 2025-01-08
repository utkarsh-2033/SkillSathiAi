import React, { useState ,useRef,useEffect} from "react";
import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, logoutUser } from "../redux/slices/userSlice";

const Navbar2 = () => {
  const user = useSelector(selectUser);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const DropdownRef =useRef(null);

  const handleClickOutside = (e) => {
    if (DropdownRef.current && !DropdownRef.current.contains(e.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log("Search submitted");
  };

  const toggleDropdown = () => {
    setDropdownOpen((prevState) => !prevState);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login"); // Redirect to the login page after logout
  };

  return (
    <header className="bg-gray-700 rounded-md">
      <div className="flex justify-between items-center py-2 px-4 max-w-7xl mx-auto shadow-lg">
        {/* Logo */}
        <Link to="/">
          <p className="font-extrabold text-sm sm:text-2xl">
            <span className="text-white">SkillSathi</span>
            <span className="text-[#9333ea]">AI</span>
          </p>
        </Link>

        {/* SkillQuiz Link */}
        <nav>
          <Link to="/skillQuiz">
            <span className="font-semibold text-md text-white bg-[#9333ea] hover:bg-purple-600 py-2 px-4 rounded-full shadow-lg">
              SkillQuiz
            </span>
          </Link>
        </nav>
        <nav>
          <Link to="/games">
            <span className="font-semibold text-md text-white bg-[#9333ea] hover:bg-purple-600 py-2 px-4 rounded-full shadow-lg">
              Games
            </span>
          </Link>
        </nav>
        {/* <nav>
          <Link to="/recommendation">
            <span className="font-semibold text-md text-white bg-[#9333ea] hover:bg-purple-600 py-2 px-4 rounded-full shadow-lg">
              Recommendation
            </span>
          </Link>
        </nav> */}

        {/* User Profile Dropdown */}
        <div className="relative">
          {user ? (
            <div
              className="cursor-pointer flex items-center"
              onClick={toggleDropdown}
              style={{ marginRight: "0px" }}
            >
              <img
                src={user.photo || "https://via.placeholder.com/150"}
                alt="profile"
                className="rounded-full h-12 w-12 object-cover"
              />
            </div>
          ) : (
            <Link to="/signup">
              <span className="font-semibold text-white hover:text-purple-500">
                Sign-up
              </span>
            </Link>
          )}

          {/* Dropdown Menu */}
          {isDropdownOpen && user && (
            <div ref={DropdownRef} className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-2xl z-50">
              <ul className="text-gray-700">
                <li>
                  <Link
                    to="/profile"
                    className="block font-semibold text-lg px-4 py-2 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <Link
                    to="/career-goal"
                    className="block font-semibold text-lg px-4 py-2 hover:bg-gray-100"
                  >
                    Career Goal
                  </Link>
                </li>
                <li>
                  <Link
                    to="/skill-assessment"
                    className="block font-semibold text-lg px-4 py-2 hover:bg-gray-100"
                  >
                    Skill Assessment
                  </Link>
                </li>
                <li>
                  <Link
                    to="/progress"
                    className="block font-semibold text-lg px-4 py-2 hover:bg-gray-100"
                  >
                    Progress
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin"
                    className="block font-semibold text-lg px-4 py-2 hover:bg-gray-100"
                  >
                    Admin
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="block text-white font-bold text-xl w-full text-left bg-gray-900 px-4 py-2 hover:bg-gray-600 rounded-md"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar2;
