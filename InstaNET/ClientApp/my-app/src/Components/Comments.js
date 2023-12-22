import React, { Component ,useEffect, useState} from 'react';
import {Link} from 'react-router-dom'
import {useGlobalContext} from '../AppContext';
import {Post} from './Feed'

export function Comments({postid}){
    const [showreply,setShowreply]=useState(false)
    const [comments,setcomments]=useState([])
    const [loading,setLoading]=useState(true)
    const base=useGlobalContext().baseAddress;
    const fetechComments=()=>{
        var IdOFPost=postid;
        var jsonObj={forPost : IdOFPost,commentStr:'getcomment',commentByUser:''};
  
        var jsonObj= JSON.stringify( jsonObj)
        fetch(base+'Profile/postcomments?forPost='+IdOFPost, {
          method: 'GET',
          mode:'cors',
          headers:{
              "accept": "*/*",
              "Authorization": "Bearer "+localStorage.getItem("tokenSecret"),
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
          }
      }).then(res=>res.json()).then(data=>{
                                  setcomments(data);
                            }).catch(x=>{ })
    }
    useEffect(()=>{
        fetechComments()
    },[])

    const styles={
        resultSpan:{
            float:'left',paddingLeft:'8px',display:'inline'
        },
        resultImg:{
           float:'left',cursor:'pointer',height:'25px',borderRadius:'50%',margin:'3px',height:'25px'
        },
        Comment:{
            paddingLeft:'10px',wordBreak: 'break-all',fontSize:'14px'
        }
    }
    const ReplyNow=()=>{

    }
    const postCommenton=()=>{
        var myComment=document.getElementById('myComment');
        if(myComment.value==''){
            return
        }
        var jsonObj={forPost : postid,commentStr:myComment.value,commentByUser:''};
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
                                document.getElementById('myComment').value=''
                                fetechComments()
                              }
                            }).catch(x=>{ })
  
      }
    return (
        <>
        <h3>Comment</h3>
        <div>
        <div style={{position:'sticky',top:'0'}}>
            <input className='field' maxLength='50' type='text' id='myComment' placeholder='Add your comment...' />
            <button style={{height:'30px'}} onClick={()=>{postCommenton()}}>Post</button>
        </div>
        <div style={{paddingTop:'15px',textAlign:'left'}} className='scroll-area'>
        {comments.length==0?'': 
            comments.map((x)=>{ return (
            <div style={{paddingTop:'8px', clear: 'both'}}>
                <div style={styles.resultSpan}>
                <img  onClick={()=>{window.location.pathname=`/${x.userName}`}}  style={styles.resultImg} src={x.userProfilepic || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'}></img>
                <b><span style={styles.resultSpan}>{x.userName}</span></b>
                <span style={styles.Comment}>{x.commentStr}</span>
                {/* <div style={{margin:'10px',paddingLeft:'80px'}}>
                    <span>🤍</span>
                    <span style={{padding:'10px'}} onClick={ReplyNow}>Reply</span>
                </div>
                <div style={{margin:'10px',paddingLeft:'40px'}}>
                    {showreply==false?
                    <span style={{cursor:'pointer'}}>View all Replies..</span>:
                    <div>
                    <div style={styles.resultSpan}>
                        <img style={styles.resultImg} src='https://images.unsplash.com/photo-1611262588024-d12430b98920?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aW5zdGFncmFtJTIwcHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60'></img>
                        <b><span style={styles.resultSpan}>prem</span></b>
                        <span style={styles.Comment}>{x.commentStr}</span>
                    </div>
                    </div>
                    }
                    
                </div> */}
                <br />
                </div>
            </div>
            )
            })
        }
        </div>
        
        </div>
        </>
        
    );
}