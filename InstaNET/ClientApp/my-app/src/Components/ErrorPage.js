import React, { Component ,useEffect} from 'react';
import {Link} from 'react-router-dom'
import { Home } from './Home';
import { useGlobalContext } from '../AppContext';
export function ErrorPage(){
    
    const setShowPopup=useGlobalContext().setPopup
    const falsePopup=()=>{
        setShowPopup(false)
    }
    return (
        <>
        <div style={{color:'red' , textAlign:'center',paddingTop:'10%', fontSize:'40px'}}>
           This Page Does not Exist. What are you Looking for ? 
        </div>
        <div style={{textAlign:'center',padding:'50px'}}>
            Go to back to <Link  onClick={falsePopup} to='/'>Home</Link> 
        </div>
        </>
        
    );
}
