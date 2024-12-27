import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../utils/firebase";
import {useDispatch} from "react-redux";
import { useNavigate } from "react-router-dom";
import { SigninSuccess } from "../redux/slices/userSlice";

const OAuth = () => {
  const navigate = useNavigate();
  const dispatch=useDispatch();
  const googleAuthHandler = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      console.log(result);
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          username: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to authenticate with Google');
      }

      const data = await res.json();
      dispatch(SigninSuccess(data.user));
      navigate("/");
    } catch (err) {
      console.log(err,"google auth error");
    }
  };
  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={googleAuthHandler}
        className="bg-red-700 w-full text-white p-2 rounded-md hover:opacity-90"
      >
        Signin with Google
      </button>
    </div>
  );
};

export default OAuth;
