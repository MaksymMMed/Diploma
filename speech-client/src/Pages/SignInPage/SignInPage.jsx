import React, { useEffect } from "react";
import { useState } from 'react';
import Cookies from "js-cookie";
import './SignInPage.css'
import BigButton from "../../UI/Button/bigButton/BigButton";
import BasicInput from "../../UI/Input/BasicInput";
import { Link,useNavigate } from "react-router-dom";
import { UserService } from "../../API/UserService";

const SignInPage = () =>{

    const Navigate = useNavigate();
    const [userData,setUserData] = useState({email:'maksim2003mmm15@gmail.com',password:'Qwertym_1'})
    const [IsDataCorrect,setIsDataCorrect] = useState()
    const userService = new UserService()
    

    useEffect(()=>{
      setIsDataCorrect(true)
    },[])

    const SignIn = async (e) =>{
      e.preventDefault()
      const response = await userService.SignIn(userData.email,userData.password)
      if (response.status === 200){
        console.log("sign in success")
        Cookies.set('jwtToken', response.data, { expires: 1 });
        Navigate("/MainPage")
      }
      else{
        console.log(response.data)
        setIsDataCorrect(false)
        setUserData({email:"",password:""})
      }
    }

    return (
        <div className="LoginForm">
          <h1>Speech Improve</h1>
          <div className="InputPlace">
            <h3>Email</h3>
            <BasicInput placeholder=" Введіть email..." value={userData.email} onChange={e=>setUserData({...userData, email : e.target.value})} />
          </div>
          <div className="InputPlace">
            <h3>Password</h3>
            <BasicInput placeholder=" Введіть пароль..." value={userData.password} onChange={e=>setUserData({...userData, password : e.target.value})} />
          </div>
          {IsDataCorrect === false
          ?
            <p style={{color:"red"}}>Неправильний логін або пароль</p>
          : null
          } 
          <div className="Other">
            <p><Link to="/SignUp">Зареєструватися</Link></p>
          </div>
          <div className="ButtonPlace">
          <BigButton onClick={SignIn}>Увійти</BigButton>
          </div>
        </div>
        
      );
    }

export default SignInPage