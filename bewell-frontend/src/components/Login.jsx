import React from 'react';
import jwtDecode from 'jwt-decode';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import shareVideo from '../assets/share.mp4';
import logo from  '../assets/BeWellLogo.png';
import { client } from '../client';

const Login = () => {

  const navigate= useNavigate();

  function handleCallbackResponse(response) {
    console.log("Encoded token"+ response.credential);
    var userObject= jwtDecode(response.credential);
    console.log (userObject)
    localStorage.setItem('user',JSON.stringify(userObject));
    const {name, sub, picture} = userObject;

    const doc = {
      _id: sub,
      _type: 'user',
      userName: name,
      image: picture, 
    }
    client.createIfNotExists(doc)
      .then(() => {
        navigate('/', {replace:true})
      })
  }

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: process.env.REACT_APP_GOOGLE_API_TOKEN,
      callback: handleCallbackResponse
    });

    google.accounts.id.renderButton(
      document.getElementById("signInDiv"),
      {theme:"outline", size:"large"}
    );
    google.accounts.id.prompt()
  }, [])

  

  return (
    <div className="flex justify-start items-center flex-col h-screen">
        <div className=" relative w-full h-full">
          <video 
            src={shareVideo}
            type= 'video/mp4'
            loop
            controls={false}
            muted
            autoPlay
            className="w-full h-full object-cover"
          />
          <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay">
            <div className='p-5'>
              <img src={logo} width="200px" alt='logo'/>

            </div>
            <div id='signInDiv'></div>

          </div>
        </div>
    </div>
  )
}

export default Login