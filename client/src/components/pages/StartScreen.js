import React from "react";
import { GoogleOAuthProvider, GoogleLogin, googleLogout } from "@react-oauth/google";
import { Link } from "react-router-dom";

import "../../utilities.css";
import "./StartScreen.css";

//TODO: REPLACE WITH YOUR OWN CLIENT_ID
const GOOGLE_CLIENT_ID = "FILL ME IN";

const StartScreen = ({ userId, handleLogin, handleLogout }) => {
  return (
    <div className="StartScreen-container">
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        {userId ? <>
            <button
            onClick={() => {
                googleLogout();
                handleLogout();
            }}
            style={{width: 50}}
            className="StartScreen-login"
            >
            Logout
            </button>
            </> : (
            <div className="StartScreen-login">
            <GoogleLogin
                clientId={GOOGLE_CLIENT_ID}
                buttonText="Login"
                onSuccess={handleLogin}
                onFailure={(err) => console.log(err)}
                text="signin"
                width="50px"
            />
            </div>
        )}
        </GoogleOAuthProvider>
        <div className="StartScreen-body">
            <h1>welcome to game!</h1>
            <div className="textAlign">
            <Link to="/lobbyfind">
                <button className="StartScreen-button">PLAY</button>
            </Link>
            </div>
            <div className="textAlign">
            <Link to="/help">
                <button className="StartScreen-button">HELP</button>
            </Link>
            </div>
        </div>
    </div>
  );
};

export default StartScreen;
