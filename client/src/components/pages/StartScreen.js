import React from "react";
import { GoogleOAuthProvider, GoogleLogin, googleLogout } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

import "../../utilities.css";
import "./StartScreen.css";
import title from "../../public/assets/title.png"

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
        <div>
            <img src={title} className="StartScreen-title"/>
        </div>
        <div className="StartScreen-body">
            {userId ? <>
                <div className="textAlign textAlign-play">
                    <button onClick={() => {
                        if (!tutorial) {
                            navigate("/gametutorial");
                        } else {
                            navigate("/lobbyfind");
                        }
                    }} className="StartScreen-button">PLAY</button>
                </div>
                <div className="textAlign textAlign-rules">
                    <button onClick={() => {
                        navigate("/help");
                    }} className="StartScreen-button">RULES</button>
                </div>
                <div className="textAlign textAlign-points">
                    <button onClick={() => {
                        navigate("/pointpage");
                    }} className="StartScreen-button">POINT MANUAL</button>
                </div>
                <div className="textAlign textAlign-achieve">
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
