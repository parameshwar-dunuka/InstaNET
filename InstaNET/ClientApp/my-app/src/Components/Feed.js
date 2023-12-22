import React, { Component ,useEffect} from 'react';
import {Link, json} from 'react-router-dom'
import { useState } from 'react';
import {useGlobalContext} from '../AppContext';
import { List, Report } from './List';
import { Comments } from './Comments';

export function Post({data}){
  const [comment,setComment]=useState('')
  const [isLiked,setLiked]=useState(data.isLiked)
  const [noLikes,SetnoLikes]=useState(data.numofLikes)

  const [option,setoption]=useState(null)
  const setPopup=useGlobalContext().setPopup;
  const setParam=useGlobalContext().setParam;
  const base=useGlobalContext().baseAddress;
  const [error,setError]=useState('')
  const Showbox=useGlobalContext().Showbox

    const LikePostsAjax=(ISliked)=>{
      var IdOFPost=data.postId;
      var jsonObj={forPost : IdOFPost,commentStr:ISliked,commentByUser:''};
      var jsonObj= JSON.stringify( jsonObj)
      fetch(base+'Profile/likedit', {
        method: 'POST',
        body:jsonObj,
        mode:'cors',
        headers:{
            "Authorization": "Bearer "+localStorage.getItem("tokenSecret"),
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        }
    }).then(res=>res.json()).then(data=>{
                          }).catch(x=>{ 
                            setError('Something went wrong')    })
    }

    const DoubleclkLove=()=>{
      setLiked(true)
      if(isLiked==false){
        SetnoLikes(noLikes+1)
        LikePostsAjax('like')
      }
    }
    const Likedpic=()=>{
      setLiked(!isLiked)
      var wt=isLiked==false?'like':'unlike'
      LikePostsAjax(wt);
      if(!isLiked){
        SetnoLikes(noLikes+1)
      }
      else{
        SetnoLikes(noLikes-1)
      }

    }
    const shareIt=()=>{
      setPopup(true)
      setParam({params:<List />,showClosebtn:false,classAppend:'list-content'})
    }
    const ReportTt=()=>{
      setPopup(true)
      setParam({params:<Report />,showClosebtn:false,classAppend:'list-content'})
    }
    const showOptions=()=>{
      option==null? setoption( <span style={{fontSize:'15px',backgroundColor:'black',textAlign:'right',padding:'12px'}}>
        <span onClick={shareIt}>Share</span>
        <span onClick={ReportTt}>Report</span></span>):setoption(null)
    }
    const viewComments=()=>{
      setPopup(true)
      setParam({params:<Comments postid={data.postId}/>,showClosebtn:true,classAppend:'list-content'})
    }
    const postComment=()=>{
      var IdOFPost=data.postId;
      var jsonObj={forPost : IdOFPost,commentStr:comment,commentByUser:''};
      var jsonObj= JSON.stringify( jsonObj)
      fetch(base+'Profile/AddComment', {
        method: 'POST',
        body:jsonObj,
        mode:'cors',
        headers:{
            "Authorization": "Bearer "+localStorage.getItem("tokenSecret"),
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        }
    }).then(res=>res.json()).then(data=>{
                            if(data==true){
                              setComment('')
                              Showbox()
                            }
                          }).catch(x=>{ 
                            setError('Something went wrong')    })

    }
    return (
          <>
            <div className='post-body'>
              <div style={{position:'relative'}}>
                <span style={{position:"absolute",fontSize:'28px',right:'5px',cursor:'pointer',zIndex:'1'}}>
                  {/* {option==null?<span onClick={showOptions}>...</span>: <span><span style={{textAlign:'right'}} onClick={showOptions}>...</span> {option}</span>} */}
                </span>                
                <img onClick={()=>{window.location.pathname=`/${data.postedUserName}`}} className='post-body-profile' src={data.profilePic||'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'}></img>
                <span><b>{data.postedUserName}</b></span>
                <span>{data.subtitle}</span>
              </div>
                <div style={{position:'relative'}}> {/* to display heart symbol */}
                  {isLiked && <span className='Heart'>❤️</span>}
                  <img  onDoubleClick={DoubleclkLove} className='post-body-mainimg' 
                  src={data.postData}></img>
                  </div>
                <span className='LikePost'>
                  <label title='like' onClick={Likedpic}>
                  {isLiked? '❤️':'🤍'}</label>
                  <label title='comment' onClick={()=>{document.getElementById('comment_'+data.postId).focus()}}>💬</label>
                  <label title='share'>📱</label>
                  <label title='save' style={{float:'right', paddingRight:'5px'}}>
                    <img style={{height:'25px',width:'25px'}} src='https://w7.pngwing.com/pngs/860/512/png-transparent-instagram-social-media-save-instagram-instagram-save-social-media-logo-icon-thumbnail.png'></img>
                    </label>
                </span>
                <span><b>{noLikes} likes</b></span>
                <span><b>{data.postedUserName}  </b>{data.postDescription}</span>
                <span style={{color:'GrayText',cursor:'pointer'}} onClick={viewComments}>View all {data.numofComments} comments...</span>
                {data.topComment!=null ?<span><b>{data.topComment.userName}  </b>{data.topComment.commentStr}</span> :''}
                  {comment==''||<span onClick={postComment} style={{float:'right', paddingRight:'5px',color:'#1bffef',cursor:'pointer'}}>Post</span>}
                <input id={`comment_${data.postId}`} value={comment} type='text' placeholder='Add a comment...' onChange={(e)=>{setComment(e.target.value)}}></input>
            </div>
          </>
    );
}
