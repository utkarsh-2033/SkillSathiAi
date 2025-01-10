import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import OAuth from "../componenets/OAuth";

const Signup = () => {
  const [formdata, setFormdata] = useState({});
  const [isloading, setisloading] = useState(false);
  const [error, seterror] = useState(null);

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setisloading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(formdata),
      });
      const data = await res.json();
      if (!data.success) {
        seterror(data.message);
        setisloading(false);
        return;
      }
      setisloading(false);
      seterror(null);
      navigate('/signin')
    } catch (err) {
      console.log(err);
    }
  };

  const changeHandler = (e) => {
    setFormdata((prevdata) => {
      return { ...prevdata, [e.target.id]: e.target.value };
    });
    // console.log(formdata);
  };
  return (
    <div className="min-h-screen">
      <div className=" max-w-md mt-32 m-auto">
        <h1 className="font-bold text-2xl my-4 text-center">SignUp</h1>
        <form onSubmit={submitHandler} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="username"
            id="username"
            onChange={changeHandler}
            className="focus:outline-4 focus:outline-gray-700 rounded-md p-2 bg-slate-200"
          />

          <input
            type="email"
            id="email"
            placeholder="email"
            onChange={changeHandler}
            className="focus:outline-4 focus:outline-gray-700 rounded-md p-2 bg-slate-200"
          />
          <input
            type="password"
            id="password"
            placeholder="password"
            onChange={changeHandler}
            className="focus:outline-4 focus:outline-gray-700 rounded-md p-2 bg-slate-200"
          />
          <button className="bg-gray-700 font-semibold rounded-lg p-2 text-white hover:opacity-90">
            {isloading ? "loading" : "SIGNUP"}
          </button>
        </form>
        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        <OAuth/>
        <p className="text-center flex mt-4 mr-1">
          Already have an account?{" "}
          <Link to={"/signin"}>
            <span className="text-blue-400 ">signin</span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
