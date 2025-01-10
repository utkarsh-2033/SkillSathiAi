import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, logoutUser } from "../redux/slices/userSlice";

const Navbar2 = () => {
  const user = useSelector(selectUser);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false); // New state for main menu
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const DropdownRef = useRef(null);

  const handleClickOutside = (e) => {
    if (DropdownRef.current && !DropdownRef.current.contains(e.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/signin"); // Redirect to the login page after logout
  };

  const toggleDropdown = () => {
    setDropdownOpen((prevState) => !prevState);
  };

  const toggleMenu = () => {
    setMenuOpen((prevState) => !prevState);
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

        {/* Navigation Links (visible only on larger devices) */}
        <div className="hidden lg:flex space-x-3 lg:space-x-20">
          <Link
            to="/skillQuiz"
            className="font-semibold text-md text-white py-2 px-6 shadow-sm transition-all duration-300 ease-in-out transform hover:scale-103"
          >
            SkillQuiz
          </Link>
          <Link
            to="/games"
            className="font-semibold text-md text-white py-2 px-6 shadow-sm transition-all duration-300 ease-in-out transform hover:scale-103"
          >
            Games
          </Link>
          <Link
            to="/recommendation"
            className="font-semibold text-md text-white py-2 px-6 shadow-sm transition-all duration-300 ease-in-out transform hover:scale-103"
          >
            Recommendation
          </Link>
          <Link
            to="/chat-forums"
            className="font-semibold text-md text-white py-2 px-6 shadow-sm transition-all duration-300 ease-in-out transform hover:scale-103"
          >
            Chat Rooms
          </Link>
        </div>
        {/* Desktop Profile Section */}
        {user && (
          <div className="hidden sm:block relative">
            <div
              className="cursor-pointer flex items-center"
              onClick={toggleDropdown}
            >
              <img
                src={user.photo || "https://via.placeholder.com/150"}
                alt="profile"
                className="rounded-full h-12 w-12 object-cover"
              />
            </div>
            {isDropdownOpen && (
              <div
                ref={DropdownRef}
                className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-2xl z-50"
              >
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
        )}

        {/* Dropdown Menu Button (for smaller devices) */}
        <buttonb
          className="text-white text-2xl lg:hidden"
          onClick={toggleMenu}
          aria-label="Toggle Menu"
        >
          ☰ {/* Hamburger icon */}
        </buttonb>

        {/* Dropdown Menu for all links (visible on smaller devices) */}
        {isMenuOpen && (
          <div className="absolute top-14 right-4 w-64 bg-white rounded-lg shadow-xl z-50">
            <ul className="divide-y divide-gray-200">
              {/* Tools Dropdown */}
              <li className="p-2">
                <div
                  className="font-semibold text-lg px-4 py-2 hover:bg-gray-100 rounded-md cursor-pointer flex justify-between items-center"
                  onClick={() =>
                    setDropdownOpen((prev) =>
                      prev === "tools" ? null : "tools"
                    )
                  }
                >
                  Tools
                  <span className="text-gray-500">
                    {isDropdownOpen === "tools" ? "▲" : "▼"}
                  </span>
                </div>
                {isDropdownOpen === "tools" && (
                  <ul className="bg-gray-50 rounded-md mt-2 shadow-inner">
                    <li>
                      <Link
                        to="/skillQuiz"
                        className="block font-medium text-md px-4 py-2 hover:bg-purple-100 hover:text-purple-600 rounded-md"
                        onClick={() => setMenuOpen(false)}
                      >
                        SkillQuiz
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/games"
                        className="block font-medium text-md px-4 py-2 hover:bg-purple-100 hover:text-purple-600 rounded-md"
                        onClick={() => setMenuOpen(false)}
                      >
                        Games
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/recommendation"
                        className="block font-medium text-md px-4 py-2 hover:bg-purple-100 hover:text-purple-600 rounded-md"
                        onClick={() => setMenuOpen(false)}
                      >
                        Recommendation
                      </Link>
                    </li>
                  </ul>
                )}
              </li>

              {/* User Dropdown */}
              <li className="p-2">
                <div
                  className="font-semibold text-lg px-4 py-2 hover:bg-gray-100 rounded-md cursor-pointer flex justify-between items-center"
                  onClick={() =>
                    setDropdownOpen((prev) => (prev === "user" ? null : "user"))
                  }
                >
                  User
                  <span className="text-gray-500">
                    {isDropdownOpen === "user" ? "▲" : "▼"}
                  </span>
                </div>
                {isDropdownOpen === "user" && (
                  <ul className="bg-gray-50 rounded-md mt-2 shadow-inner">
                    {user ? (
                      <>
                        <li>
                          <Link
                            to="/profile"
                            className="block font-medium text-md px-4 py-2 hover:bg-purple-100 hover:text-purple-600 rounded-md"
                            onClick={() => setMenuOpen(false)}
                          >
                            Profile
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/career-goal"
                            className="block font-medium text-md px-4 py-2 hover:bg-purple-100 hover:text-purple-600 rounded-md"
                            onClick={() => setMenuOpen(false)}
                          >
                            Career Goal
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/skill-assessment"
                            className="block font-medium text-md px-4 py-2 hover:bg-purple-100 hover:text-purple-600 rounded-md"
                            onClick={() => setMenuOpen(false)}
                          >
                            Skill Assessment
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/progress"
                            className="block font-medium text-md px-4 py-2 hover:bg-purple-100 hover:text-purple-600 rounded-md"
                            onClick={() => setMenuOpen(false)}
                          >
                            Progress
                          </Link>
                        </li>
                        <li>
                          <button
                            onClick={() => {
                              handleLogout();
                              setMenuOpen(false);
                            }}
                            className="block font-medium text-md w-full text-left px-4 py-2 text-white bg-purple-600 hover:bg-purple-700 rounded-md"
                          >
                            Logout
                          </button>
                        </li>
                      </>
                    ) : (
                      <li>
                        <Link
                          to="/signup"
                          className="block font-medium text-md px-4 py-2 hover:bg-purple-100 hover:text-purple-600 rounded-md"
                          onClick={() => setMenuOpen(false)}
                        >
                          Sign-up
                        </Link>
                      </li>
                    )}
                  </ul>
                )}
              </li>
            </ul>
          </div>
        )}

        
      </div>
    </header>
  );
};

export default Navbar2;
