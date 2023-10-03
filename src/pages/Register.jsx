import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth, db, storage } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { InfinitySpin, RotatingLines } from "react-loader-spinner";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import User from "../img/user.png";
import whatsapp from "../img/whatsapp.png";
import { showToast } from "../util";
import { INFINITY_SPIN } from "../constants";

const Register = () => {
  const navigate = useNavigate();

  const [formKey, setFormKey] = useState(1);
  const [loading, setLoading] = useState(false);
  const [fileLoading, setFileLoading] = useState(false);

  useEffect(() => {
    setFormKey((prevKey) => prevKey + 1);
  }, []);

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];

    try {
      //Create user
      const res = await createUserWithEmailAndPassword(auth, email, password);

      //Create a unique image name
      const date = new Date().getTime();
      const storageRef = ref(storage, `${displayName + date}`);

      await uploadBytesResumable(storageRef, file).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          try {
            //Update profile
            await updateProfile(res.user, {
              displayName,
              photoURL: downloadURL,
            });
            //create user on firestore
            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              displayName,
              email,
              photoURL: downloadURL,
            });

            //create empty user chats on firestore
            await setDoc(doc(db, "userChats", res.user.uid), {});
            navigate("/");
          } catch (err) {
            console.log(err);
            showToast("Something went wrong", "error");
            setLoading(false);
          }
        });
      });
    } catch (err) {
      showToast("Something went wrong", "error");
      setLoading(false);
    }
    setFormKey((prevKey) => prevKey + 1);
  };

  const handleFileChange = async (e) => {
    setFileLoading(true);
    const timeoutId = setTimeout(() => {
      setFileLoading(false);
      clearTimeout(timeoutId);
    }, 2000);
  };

  return (
    <div className="formContainer">
      <ToastContainer />
      <div className="formWrapper">
        <span className="whatsapplogo">
          <img src={whatsapp} alt="whatsapp logo" />
        </span>
        <span className="logo">Sign Up To WhatsApp</span>
        {loading ? (
          <InfinitySpin width="200" color={INFINITY_SPIN} />
        ) : (
          <>
            <form onSubmit={handleSubmit} key={formKey}>
              <input required type="text" placeholder="display name" />
              <input required type="email" placeholder="email" />
              <input required type="password" placeholder="password" />
              <input
                required
                type="file"
                id="file"
                onChange={handleFileChange}
              />
              <label htmlFor="file">
                <img src={User} alt="" />
                <span id="p">Add an profile photo</span>
                {fileLoading && (
                  <span>
                    <RotatingLines
                      strokeColor="grey"
                      strokeWidth="5"
                      animationDuration="0.75"
                      width="30"
                      visible={true}
                    />
                  </span>
                )}
              </label>
              <button disabled={loading}>Sign up</button>
            </form>
          </>
        )}

        <p>
          You do have an account?{" "}
          <Link to="/login" id="p">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
