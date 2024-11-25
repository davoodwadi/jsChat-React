import React from "react";
// import "../index.css";
const Spinner = () => {
  return <div className="spinner"></div>;
};

const SignupButton = () => {
  return <button id="signupButton">Signup</button>;
};
const LoginButton = () => {
  return <button id="loginButton">Login</button>;
};
const AuthenticateButtons = () => {
  return (
    <div id="authenticateButtons" className="button-box">
      <SignupButton />
      <LoginButton />
    </div>
  );
};
const Authenticate = ({ child }) => {
  return <div id="authenticate">{child}</div>;
};

const SignupPage = () => {
  return (
    <div id="signupPage" className="authentication-box">
      <div className="auth-box">
        <input id="signUsername" className="input-text" />
        <input id="signPassword" className="input-text" />
      </div>
    </div>
  );
};

const ProfileSection = () => {
  return (
    <div
      className="flex flex-col items-center justify-center text-center"
      id="profileSection" 
    >
      <div className="flex flex-col justify-center rounded-md border border-teal-300 bg-teal-50 p-6">
        <h2 className="">
          Welcome, <span id="profileUsername">Dummy</span>
        </h2>

        <div className="flex">
          <span className="font-bold">
            Last login:{" "}
            <span>
              <i>August 17, 2024 at 12:55 PM GMT+3:30</i>
            </span>
          </span>
        </div>
      </div>
      <div id="logoutContainer" className="flex flex-row justify-center">
        <button
          id="logoutButton"
          className="mt-2 rounded bg-teal-500 p-2 text-white transition duration-200 hover:bg-teal-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

const isAuthenticated = true;

const AuthenticationBox = () => {
  if (isAuthenticated) {
    return (
      <>
        <Authenticate child={ProfileSection()} />
      </>
    );
  } else {
    return (
      <>
        <Authenticate child={AuthenticateButtons()} />
      </>
    );
  }
};

export default AuthenticationBox;
