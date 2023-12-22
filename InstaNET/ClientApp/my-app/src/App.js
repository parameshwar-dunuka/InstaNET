import logo from './logo.svg';
import './App.css';
import React, { Component,createContext} from 'react';
import { Signup } from './Components/Signup';
import { AppLayout } from './Components/AppLayout';
import { ErrorPage } from './Components/ErrorPage';
import {BrowserRouters,Route,createBrowserRouter,RouterProvider,createRoutesFromElements, redirect, useParams} from 'react-router-dom'
import {Home} from './Components/Home'
import { MyProfile } from './Components/MyProfile';

export default function App() {
    const InitializeProfile=()=>{
      return ()=>{
        const token=localStorage.getItem("tokenSecret");
        const userName=localStorage.getItem("userName");
        return fetch('https://localhost:7215/'+'Profile/UserData?userName='+userName, {
        method: 'GET',
        mode:'cors',
        headers:{
            "accept": "*/*",
            "Authorization": "Bearer "+token,
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        }
        })
      }
    }

    const InitializeUserProfile=(userName)=>{
      return (userName)=>{
        const token=localStorage.getItem("tokenSecret");
        return fetch('https://localhost:7215/'+'Profile/GetProfile?userName='+userName, {
        method: 'GET',
        mode:'cors',
        headers:{
            "accept": "*/*",
            "Authorization": "Bearer "+token,
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        }
        })
      }
    }
    
  return (
    
      <RouterProvider router={createBrowserRouter(createRoutesFromElements(<Route path='/' element={<AppLayout />}>
              <Route exact path='*' element={<ErrorPage />} />
              <Route path='accounts/signup' element={<Signup />} />
              <Route index element={<Home />} loader={InitializeProfile} />
              <Route path='/:ProfileName' element={<MyProfile />} loader={InitializeUserProfile} errorElement={<Home />} />
          
        </Route>))}/>
  );

}


