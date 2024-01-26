import React from "react";
import { GoogleOAuthProvider, GoogleLogin, googleLogout } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

import "../../utilities.css";
import "./StartScreen.css";

//TODO: REPLACE WITH YOUR OWN CLIENT_ID
const GOOGLE_CLIENT_ID = "403610806352-6todi6649i18j0fn8sauqk7bpgsqghru.apps.googleusercontent.com";

const StartScreen = ({ userId, handleLogin, handleLogout, tutorial }) => {
    const navigate = useNavigate();
  return (
    <div className="StartScreen-container">
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        {userId ? <>
            <button
            onClick={() => {
                googleLogout();
                handleLogout();
            }}
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
            <h1>animal clashing</h1>
            {userId ? <>
                <div className="textAlign">
                    <button onClick={() => {
                        if (!tutorial) {
                            navigate("/gametutorial");
                        } else {
                            navigate("/lobbyfind");
                        }
                    }} className="StartScreen-button">PLAY</button>
                </div>
                <div className="textAlign">
                    <button onClick={() => {
                        navigate("/help");
                    }} className="StartScreen-button">HELP</button>
                </div>
                <div className="textAlign">
                    <button onClick={() => {
                        navigate("/achievements");
                    }} className="StartScreen-button">ACHIEVEMENTS</button>
                </div>
            </> : "please sign in to continue <3"
            }
        </div>
    </div>
  );
};

export default StartScreen;
