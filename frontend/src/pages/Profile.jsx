import React from "react";
import { useSelector } from "react-redux";
import { FaEdit, FaSignOutAlt } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  UpdateuserSuccess,
  UpdateuserFailure,
  DeleteLogoutUserSuccess,
  DeleteLogoutUserFailure,
} from "../redux/slices/userSlice";
import CareerGoalsSelection from "../componenets/CareerGoalSelection";
import { useDispatch } from "react-redux";
const Profile = () => {
  const [file, setfile] = useState(null);
  const [errorUpload, seterrorUpload] = useState(false);
  const [uploadcomplete, setuploadcomplete] = useState(false);
  const [formdata, setformdata] = useState({});
  const [editmode, seteditmode] = useState(false);

  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const { currentUser: user, error } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "e-estate");
    fetch("https://api.cloudinary.com/v1_1/duw0uzjax/image/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        setformdata((prevFormData) => ({
          ...prevFormData,
          photo: data.url,
        }));
        // console.log(data.url);
        seterrorUpload(false);
        setuploadcomplete(true);
        setfile(null);
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
        seterrorUpload(true);
      });
  };

  const onChangeHandler = (e) => {
    setformdata((prevFormData) => {
      return { ...prevFormData, [e.target.id]: e.target.value };
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setuploadcomplete(false);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/updateprofile/${user._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formdata),
      });
      const result = await res.json();
      if (!result.success) {
        dispatch(UpdateuserFailure(result.message));
        return;
      }
      dispatch(UpdateuserSuccess(result.user));
      seteditmode(false);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteUserHandler = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/deleteuser/${user._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.success) {
        dispatch(DeleteLogoutUserSuccess());
        navigate("/signup");
      } else {
        dispatch(DeleteLogoutUserFailure(data.message));
      }
    } catch (error) {
      console.log(error);
      dispatch(DeleteLogoutUserFailure("Error deleting user"));
    }
  };

  const logoutHandler = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await res.json();
      if (!result.success) {
        dispatch(DeleteLogoutUserFailure(result.message));
        return;
      }
      dispatch(DeleteLogoutUserSuccess());
      navigate("/signin");
    } catch (err) {
      console.log("logout error", err);
      dispatch(DeleteLogoutUserFailure("Error logging out"));
    }
  };

  return (
    <div>
      <div className="max-w-5xl flex flex-col sm:flex-row gap-8  m-auto my-16 p-8 pt-2 bg-white rounded-md shadow-lg">
        <div className="flex flex-col sm:flex-1">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              setfile(e.target.files[0]);
            }}
            ref={fileRef}
            hidden
          />
          <img
            src={formdata.photo || user.photo}
            alt="profile"
            className="rounded-full self-center h-24 w-24 object-cover"
          />
          {editmode && (
            <FaEdit
              onClick={() => editmode && fileRef.current.click()}
              className="self-center -mt-4 bg-white "
            />
          )}

          {!errorUpload && uploadcomplete && (
            <p className="text-green-400 text-center">
              Image upload successful
            </p>
          )}
          {errorUpload && (
            <p className="text-red-700 text-center">Error in Image upload</p>
          )}
          <form onSubmit={submitHandler} className="flex flex-col gap-4 my-3">
            <div className="flex flex-col">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                defaultValue={user.username}
                onChange={onChangeHandler}
                disabled={!editmode}
                className={` ${
                  editmode
                    ? "bg-slate-200 border-2 border-black"
                    : "bg-slate-100"
                } focus:outline-4 rounded-md p-2 font-semibold`}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="email">Email</label>
              <input
                type="text"
                id="email"
                defaultValue={user.email}
                onChange={onChangeHandler}
                disabled={!editmode}
                className={` ${
                  editmode
                    ? "bg-slate-200 border-2 border-black"
                    : "bg-slate-100"
                } focus:outline-4 rounded-md p-2 font-semibold`}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="password">Password</label>
              <input
                type="Password"
                id="password"
                defaultValue="764tr64t"
                onChange={onChangeHandler}
                disabled={!editmode}
                className={` ${
                  editmode
                    ? "bg-slate-200 border-2 border-black"
                    : "bg-slate-100"
                } focus:outline-4 rounded-md p-2 font-semibold`}
              />
            </div>
            {!editmode && (
              <button
                type="button"
                onClick={() => seteditmode(true)}
                className="bg-blue-600 p-2 w-24 text-white font-semibold hover:opacity-90  rounded-md self-center flex justify-center items-center gap-2"
              >
                Edit
                <FaEdit />
              </button>
            )}
            {error && <p className="text-red-700 text-center">{error}</p>}
            {editmode && (
              <button
                type="submit"
                className="bg-green-600 p-2 w-24 text-white font-semibold hover:opacity-90  rounded-md self-center flex justify-center items-center gap-2"
              >
                Save
              </button>
            )}
          </form>
          <div className="flex flex-col gap-4 mt-8">
            <button
              onClick={logoutHandler}
              className="bg-red-300 font-semibold p-2 rounded-md hover:opacity-90 flex justify-center items-center gap-2"
            >
              Logout
              <FaSignOutAlt />
            </button>
            <button
              onClick={deleteUserHandler}
              className="bg-red-800 text-slate-100 font-semibold p-2 rounded-md hover:opacity-90 "
            >
              Delete
            </button>
          </div>
        </div>
        
      </div>
      
    </div>
  );
};

export default Profile;
