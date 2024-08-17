import React from 'react';

const Spinner = () => {
  return <div className='spinner'></div>
}


const SignupButton = () => {
  return (
    <button id='signupButton'>Signup</button>
  )
}
const LoginButton = () => {
  return (
    <button id='loginButton'>Login</button>
  )
}
const AuthenticateButtons = () => {
  return (
    <div id='authenticateButtons' className='button-box'>
      <SignupButton/>
      <LoginButton/>
    </div>
  )
}
const Authenticate = ({ child }) => {
  return (
    <div id='authenticate'>
      { child }
    </div>
  )
};

const SignupPage = () => {
  return (
    <div id='signupPage' className='authentication-box'>
      <div className='auth-box'>
        <input id="signUsername" className="input-text"/>
        <input id="signPassword" className="input-text"/>
      </div>
    </div>
  )
};

const ProfileSection = () => {
  return (
    <div className='authentication-box' id='profileSection'>
      
    </div>
  )
}

const isAuthenticated = false


const App = () => {
  if (isAuthenticated){
    return (
      <>
        <Authenticate child={AuthenticateButtons()}/>
      </>
  )} else {
    return (
      <>
        <Authenticate child={AuthenticateButtons()}/>
      </>
    )
  }
  
  };

export default App;