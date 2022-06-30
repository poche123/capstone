import React from 'react';
import jwtDecode from 'jwt-decode';
import { useEffect, useState, } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInterval } from 'usehooks-ts';
import bcpic from '../assets/background.jpg';
import logo from  '../assets/BeWellLogo.png';
import { client } from '../client';
import Cookies from 'universal-cookie';

const Login = () => {

  const navigate= useNavigate();


  function handleCallbackResponse(response) {
    
    var userObject= jwtDecode(response.credential);
    
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

  const google = window.google

  useEffect(() => {
    
    google.accounts.id.initialize({
      client_id: process.env.REACT_APP_GOOGLE_API_TOKEN,
      callback: handleCallbackResponse
    });

    google.accounts.id.renderButton(
      document.getElementById("signInDiv"),
      {theme:"outline", size:"large"}
    );
    
  }, [])

  

  return (
    <div className="flex justify-start items-center flex-col h-screen">
        <div className=" relative w-full h-full">
          <img
            src={bcpic}
            type= 'image'
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