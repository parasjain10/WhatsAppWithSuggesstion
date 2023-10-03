import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { InfinitySpin } from "react-loader-spinner";
import { ToastContainer } from "react-toastify";

import watsapp from "../img/watsapp.png";
import { showToast } from "../util";
import { INFINITY_SPIN } from "../constants";

const Login = () => {
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFocus = () => {
    setErr(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = e.target[0].value;
    const password = e.target[1].value;
    if (!email || !password) {
      showToast("Invalid/Missing Credentials", "error");
      return;
    }

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      setLoading(false);
      navigate("/");
    } catch (err) {
      setLoading(false);
      showToast("Something went wrong", "error");
    }
  };
  return (
    <div className="formContainer">
      <ToastContainer />
      {!loading ? (
        <div className="formWrapper">
          <span className="logo">
            <img src={watsapp} alt="" className="src" />
          </span>
          <form onSubmit={handleSubmit}>
            {err && <span id="errorText">Invalid/missing credentials</span>}
            <input type="email" placeholder="email" onFocus={handleFocus} />
            <input
              type="password"
              placeholder="password"
              onFocus={handleFocus}
            />
            <button disabled={err}>Sign in</button>
          </form>
          <p>
            You don't have an account?{" "}
            <Link to="/register" id="p">
              Sign Up
            </Link>
          </p>
        </div>
      ) : (
        <InfinitySpin width="200" color={INFINITY_SPIN} />
      )}
    </div>
  );
};

export default Login;
