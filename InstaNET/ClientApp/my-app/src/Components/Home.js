import React, { Component,useEffect,useState } from 'react';
import {Link, Navigate,useLocation,useNavigate,useLoaderData} from 'react-router-dom'
import {useGlobalContext} from '../AppContext'
import { Profile } from './Profile';
import { Login } from './Login';

export function Home (){
  const location = useLocation();
  const [error,setError]=useState([])
  const dataTOKEN=useLoaderData()
  const authSuccess=useGlobalContext().authSuccess;
  const setpopup=useGlobalContext().setPopup;
  const navigate=useNavigate()
  const setauthSuccess=useGlobalContext().setauthSuccess;
  const loading=useGlobalContext().loadingState;
  const setloading=useGlobalContext().setLoading;
  const userData=useGlobalContext().userData;
  const setUserData=useGlobalContext().setUserData;
  
  useEffect(()=>{
    if(location.state==null ||(location.state.returnUrl==null || location.state.returnUrl==''
    ||location.state.returnUrl==undefined ||location.state.returnUrl=='/') ){
      dataTOKEN().then(res=>res.json()).then(data=>{
        if(data.profileInPending==true){
          navigate('/accounts/signup',{state:'Complete Profile to Proceed'})
        }
        setloading(false)
        setauthSuccess(true)
        setUserData(data)
      }).catch(x=>{ 	
        setloading(false)
        setauthSuccess(false)
      })
    }
    else{
      window.location.pathname=location.state.returnUrl
    }
    }
      //navigate("/",{state:{userName:userName??localStorage.getItem("userName")}})
     ,[])
 

      return (
          <div>{loading==true? <div style={{}} className='loading'></div>:authSuccess==true?<Profile UserData={userData}/>:
              <div className='Login'><Login data={location.state}/></div>}
          </div>
    );
  
}
