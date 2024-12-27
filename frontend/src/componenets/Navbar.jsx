import React from "react";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/slices/userSlice";

const Navbar = () => {
  const user = useSelector(selectUser);
  // console.log(user);
  return (
    <header className=" bg-gray-700 rounded-md">
      <div className="flex justify-between items-center py-2 px-4 max-w-7xl mx-auto shadow-lg">
        <Link to="/">
          <p className="font-extrabold text-sm sm:text-2xl">
            <span className="text-white">Prop</span>
            <span className="text-[#9333ea]">Xchange</span>
          </p>
        </Link>
        <form>
          <div className="flex rounded-md bg-slate-300 my-1">
            <input
              type="text"
              className="focus:outline-none p-1 bg-transparent w-28 sm:w-64"
              placeholder="search..."
            />
            <span className="bg-[#9333ea]  rounded-full p-2 m-1">
              <FaSearch />
            </span>
          </div>
        </form>
        <ul className="flex gap-4 font-semibold text-white">
          {user && (
            <Link to="/profile">
              <li>
                <img
                  src={user.photo}
                  alt="profile"
                  className="rounded-full h-7 w-7 object-cover"
                />
              </li>
            </Link>
          )}
          {!user && (
            <Link to="/signup">
              <li className="hover:text-purple-500">Sign-up</li>
            </Link>
          )}
        </ul>
      </div>
    </header>
  );
};

export default Navbar;
