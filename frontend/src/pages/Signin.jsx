import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useSelector,useDispatch } from "react-redux";
import { SiginStart,SigninSuccess,SigninFailure } from "../redux/slices/userSlice";
import OAuth from "../componenets/OAuth";

const Signin = () => {
  const [formdata, setFormdata] = useState({});
  const dispatch = useDispatch();
  const {isloading,error} = useSelector(state=>state.user);


  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch(SiginStart());
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/signin`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(formdata),
        credentials: 'include',
      });
      const data = await res.json();
      // console.log(data.user);
      if (!data.success) {
        dispatch(SigninFailure(data.message));
        return;
      }
      dispatch(SigninSuccess(data.user));
      navigate('/')
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
      <div className=" max-w-md mt-36 m-auto">
        <h1 className="font-bold text-2xl my-4 text-center">SignIn</h1>
        <form onSubmit={submitHandler} className="flex flex-col gap-8">
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
          <button className="bg-gray-700 hover:opacity-90 font-semibold rounded-lg p-2 text-white">
            {isloading ? "loading" : "SIGNIN"}
          </button>
        </form>
        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        <OAuth/>
        <p className="text-center flex mt-4 mr-1">
          Don't have an account?{" "}
          <Link to={"/signup"}>
            <span className="text-blue-400 ">signup</span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signin;
