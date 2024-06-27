import React, { useState,useEffect } from 'react';
import './SignUpPage.css'
import { Link,useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import BigButton from '../../UI/Button/bigButton/BigButton';
import BasicInput from "../../UI/Input/BasicInput";
import { UserService } from '../../API/UserService';


const SignUpPage = () =>{
    
    const [IsDataCorrect,setIsDataCorrect] = useState()
    const [userData,setUserData] = useState({email:'HeisenbergW@gmail.com',password:'Qwertym_1',username:'WaltherWhite'})
    const userService = new UserService()

    useEffect(()=>{
      setIsDataCorrect(true)
    },[])

    const Navigate = useNavigate();

    const SignUp = async (e) =>{
      e.preventDefault()
      const response = await userService.SignUp(userData.email,userData.username,userData.password)
      if (response.status === 200){
        console.log("sign up success")
        Cookies.set('jwtToken', response.data, { expires: 1 }); // Token will expire in 1 day
        Navigate("/MainPage")
      }
      else{
        console.log(response.data)
        setIsDataCorrect(false)
        setUserData({username:"",email:"",password:""})
      }
    }

    return (
        <div className="RegisterPage">
          <h1>Speech Improve</h1>
          <div className="InputPlace">
            <h3>Email</h3>
            <BasicInput placeholder=" Введіть email..." value={userData.email} onChange={e=>setUserData({...userData, email : e.target.value})} />
          </div>
          <div className="InputPlace">
            <h3>Name</h3>
            <BasicInput placeholder=" Введіть ім'я користувача..." value={userData.name} onChange={e=>setUserData({...userData, username : e.target.value})} />
          </div>
          <div className="InputPlace">
            <h3>Password</h3>
            <BasicInput placeholder=" Введіть пароль..." value={userData.password} onChange={e=>setUserData({...userData, password : e.target.value})} />
          </div>
          {IsDataCorrect === false
          ?
            <p style={{color:"red"}}>Користувач з таким email вже існує</p>
          : null
          } 
          <div className="Other">
            <p><Link to="/">Авторизуватися</Link></p>
          </div>
          <div className="ButtonPlace">
          <BigButton onClick={SignUp}>Зареєструватися</BigButton>
          </div>
        </div>
        
      );

}

export default SignUpPage