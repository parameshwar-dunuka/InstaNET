import React, { Component ,useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom'
import { CallbackauthCheck } from '../AuthCheck';
import { useGlobalContext } from '../AppContext';


export function Users({data,title}){ 
    const navigate=useNavigate()  
    const setPopup=useGlobalContext().setPopup;
    const [togglesbtn,setTogglesbtn]=useState()

    const ToggleFollows=(user,following)=>{
        
        if(document.getElementById(user+'_btn').textContent=='UnFollow'){
            CallbackauthCheck('profile/ToggleFollowing','get',{userName:user},true,(x)=>{},'a')
            .then(x=>x.json())
            .then(pending=>{
                document.getElementById(user+'_btn').textContent='Follow'
            })
        }
        else{
            CallbackauthCheck('profile/ToggleFollowing','get',{userName:user},true,(x)=>{},'a')
            .then(pending=>{
                document.getElementById(user+'_btn').textContent='UnFollow'
            })
        }
    }

    const styles={
        resultSpan:{
            float:'left',paddingTop:'5px',paddingLeft:'8px'
        },
        resultfloat:{
            float:'right',paddingTop:'5px',paddingLeft:'8px'
        },
        result:{
            padding:'5px',clear:'both',cursor:'pointer'
        }
    }  
    return (
        <>
        <div style={{}}>
        <h3>{title}</h3>
        <div>
            <input style={{margin:'0'}} className='field' type='text' placeholder='Type something to search..' />
        </div></div>
        <div className='scroll-area'>
        {
            data.map(x=>{ return (
            <div style={{paddingTop:'15px'}}>
            <div  style={styles.result}>
                <span onClick={()=>{setPopup(false); window.location.pathname=`/${x.userName}`;}}>
                    <img style={{float:'left'}} className='profile-pic' src={x.profilePic ||  'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'}></img>
                <b><span style={styles.resultSpan}>{x.displayName}</span></b></span>
                {x.isRequester==false?<button id={x.userName+'_btn'} onClick={()=>{ToggleFollows(x.userName,x.isFollowing)}} style={styles.resultfloat}>{x.isFollowing==true?'UnFollow':'Follow'}</button>:''}
            </div>
            </div>
            )
            })
        }
        </div>
        
        </>
        
    );
}
