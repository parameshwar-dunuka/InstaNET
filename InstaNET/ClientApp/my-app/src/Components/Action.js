import React, { Component, useState } from 'react';
import {Link, useNavigate} from 'react-router-dom'
import {Search} from './Search'
import ReactDOM from 'react-dom/client';
import { authCheck } from '../AuthCheck';
import { PostForm } from './PostForm';
import {useGlobalContext} from '../AppContext';
import {ChatBox} from './ChatBox';


export function Actions(props) {
      const navigate =useNavigate()
      
      const [classAppend,setClass]=useState('')
      const [showClosebtn,setShowClosebtn]=useState(false)
      const setPopup=useGlobalContext().setPopup;
      const setParam=useGlobalContext().setParam;
      const UserName=useGlobalContext().userName;
      const profile=props.userName==null?UserName || '':props.userName

      const OpenChatbox=()=>{
        authCheck().then(x=>x.json()).then(y=>{
          setPopup(true)
          setParam({params:<ChatBox userName={'openchatbox'}/>,showClosebtn:true,classAppend:'chat-content'})
        }).catch(err=>{navigate('/',{state:"Login to continue"})})
      }
    const AddPost=()=>{
      authCheck().then(x=>x.json()).then(y=>{
        setPopup(true)
        setParam({params:<PostForm />,showClosebtn:true,classAppend:'modal-content'})
      }).catch(err=>{navigate('/',{state:"Login to continue"})})
    }
     const SearchFunction=()=>{
      setPopup(true)
      setParam({params:<Search />,showClosebtn:false,classAppend:'modal-content'})
     }
      return (
          <>
          <div>
            {props.children}
          <div  className='ActionsBar'>
            <div className='Action-item' title='InstaNet Refresh' onClick={()=>{window.scrollTo(0,0)}}>📱</div>
            <div className='Action-item' title='Home'><Link to={`/${''}`}>🏠</Link></div>
            <div className='Action-item' onClick={SearchFunction} title='Search'>🔎</div>
            <div className='Action-item' title='Chats' onClick={()=>{OpenChatbox()}}>📬</div>
            <div className='Action-item' title='Notification'>🔔</div>
            <div className='Action-item' onClick={AddPost} title='Add Post'>➕</div>
            <div className='Action-item' title='Profile'>
              <span onClick={()=>{window.location.pathname=`/${profile}`}}>
              <img className='profile-pic' src={props.profilePic ||'https://images.unsplash.com/photo-1611262588024-d12430b98920?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aW5zdGFncmFtJTIwcHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60'}></img>
              </span>
              {/* <Link to={`/${profile}`}>
              <img className='profile-pic' src={props.profilePic ||'https://images.unsplash.com/photo-1611262588024-d12430b98920?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aW5zdGFncmFtJTIwcHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60'}></img>
              </Link> */}
            </div>
          </div>

            </div>
          </>
    );
  
}
