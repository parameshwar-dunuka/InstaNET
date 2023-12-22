import React, { Component, useEffect, useState } from 'react';
import {Link, useNavigate} from 'react-router-dom'
import {Search} from './Search'
import { authCheck } from '../AuthCheck';
import { PostForm } from './PostForm';
import {useGlobalContext} from '../AppContext';
import { HttpTransportType, HubConnectionBuilder } from '@microsoft/signalr';


export function ChatBox({userName,displayName}) {
      const navigate =useNavigate()
      const [chatmenu,setChatmenu]=useState(userName=="openchatbox"?true:false)
      const [chatrefersh,setChatrefersh]=useState(true)
      const [connection,setConnection]=useState(null)
      const [someconst,setsomeconst]=useState([])
      const base=useGlobalContext().baseAddress;
      const [touser,setToUser]=useState(userName);
      const [todisplayname,setTodisplayname]=useState(displayName);



      const [chatters,setChatters]=useState([])
      const [messages,Setmessages]=useState([]);

      const setParam=useGlobalContext().setParam;
      const UserName=useGlobalContext().userName;

      const styles={
        resultSpan:{
            float:'left',paddingLeft:'12px'
        },
        result:{
            padding:'12px',clear:'both',cursor:'pointer'
        },
        message:{
            backgroundColor:'rgb(50, 168, 82)', 
            padding:'5px',
            maxWidth:'150px',
            borderRadius:'10px',
            wordWrap: 'break-word'
        }
    }
    useEffect(()=>{
        if(chatmenu==true){
            loadchatMessages(userName).then(y=>y.json())
            .then(x=>{
                for (let index = 0; index < x.length; index++) {
                    var element = x[index];
                    chatters.push({displayName:element.displayName,userName:element.userName,profilePic:element.profilePic})
                }
                setChatters([...chatters])

            }).catch(err=>{console.log(err)})
        }
        else{
            loadchatMessages(userName).then(y=>y.json())
            .then(x=>{
                pushmsgs(x)
            }).catch(err=>{console.log(err)})
        }
        
    },[])

    const pushmsgs=(x)=>{
        var msgs=[]
        for (let index = 0; index < x.length; index++) {
            var element = x[index];
            if(element.msgUser==localStorage.getItem("userName")){
                msgs.push({sentbyMe:true,msg:element.message})
            }
            else{
                msgs.push({sentbyMe:false,msg:element.message})
            }
        }
        Setmessages([...msgs])
        setChatrefersh(chatrefersh?false:true)
    }

    useEffect(()=>{
        var chatBody=document.getElementById('chat-body')
        if(chatBody!=null && chatBody!=undefined){
            chatBody.scrollTo(0, chatBody.scrollHeight);
        }

        if(connection==null){
            const signalRConnection = new HubConnectionBuilder()
            .withUrl("https://localhost:7215/chatHub",{
                skipNegotiation: true,
                transport: HttpTransportType.WebSockets
              })
            .withAutomaticReconnect()
            .build();
            signalRConnection.start().then(x=>{
                setConnection(signalRConnection)
                
            });

            signalRConnection.on("ReceiveMessage_"+localStorage.getItem("userName"), (chatDatarec, message) => {
                var msg=[]
                for (let index = 0; index < chatDatarec.length; index++) {
                    const element = chatDatarec[index];
                    if(element.msgUser==localStorage.getItem("userName")){
                        msg.push({sentbyMe:true,msg:element.message})
                    }
                    else{
                        msg.push({sentbyMe:false,msg:element.message})
                    }
                }

                Setmessages([...msg])
                setChatrefersh(chatrefersh?false:true)
            });
        }
        

    },[...someconst,{}])
    
    const loadchatMessages=(Touser)=>{
        var fromUser=localStorage.getItem("userName");
        return fetch(base+'Profile/GetChatMessages?toUser='+Touser, {
            method: 'GET',
            mode:'cors',
            headers:{
                "accept": "*/*",
                "Content-Type": "application/json",
                "Authorization": "Bearer "+localStorage.getItem("tokenSecret"),
                "Access-Control-Allow-Origin": "*",
            }
            })
    }
    const sendMessage=()=>{
        if(document.getElementById('msgbox').value==''){
            return
        }
        connection.invoke("SendMessage", localStorage.getItem("userName"), touser, document.getElementById('msgbox').value);        
        messages.push({sentbyMe:true,msg:document.getElementById('msgbox').value})
        Setmessages([...messages])
        setChatrefersh(chatrefersh?false:true)
        document.getElementById('msgbox').value=''
        
    }
    
    return (
        <>
        {chatmenu==true?
        <div>
            <input style={{margin:'0'}} className='field' type='text' placeholder='Type something to search..' />
        <div className='scroll-area'>
        {
            chatters.map(x=>{ return (
            <div style={{paddingTop:'15px'}}>
            <div  style={styles.result}>
                <span>
                    <img onClick={()=>{window.location.pathname=`/${x.userName}`;}} style={{float:'left'}} className='profile-pic' src={x.profilePic ||  'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'}></img>
                    <b><span onClick={()=>{setChatmenu(false); setToUser(x.userName);setTodisplayname(x.displayName); loadchatMessages(x.userName).then(y=>y.json())
                        .then(x=>{
                            pushmsgs(x)
                        });}} 
                    style={styles.resultSpan}>{x.displayName}</span></b>
                </span>
            </div>
            </div>
            )
            })
        }
        </div>
        </div>
        :
        <div>
            <div>
            {chatters.length>0?<span style={{cursor:'pointer'}} onClick={()=>{setChatmenu(true)}}>Previous</span>:''}
            <b style={{position:'relative',left:'80px'}}>{todisplayname}</b>
            </div>
            <div className='scroll-area' style={{overflowX:'hidden'}} id='chat-body'>
            {chatrefersh==true?messages.map((x)=>{ return (
            <div  style={{paddingRight:'20px',paddingTop:'10px',clear:'both' }}>
                <span style={x.sentbyMe?{...styles.message,float:'right'}:{...styles.message,float:'left'}}>{x.msg}</span>
            </div>
            )
            }):messages.map((x)=>{ return (
                <div  style={{paddingRight:'20px',paddingTop:'10px',clear:'both' }}>
                    <span style={x.sentbyMe?{...styles.message,float:'right'}:{...styles.message,float:'left'}}>{x.msg}</span>
                </div>
                )
                })
            }   
            </div>
            <div>
            <input className='field' style={{width:'290px'}} type='text' placeholder='send message' id='msgbox' />
            <button style={{padding:'5px', display:'inline'}} onClick={(e)=>{sendMessage()}}>send</button>
            </div>
        </div>
        }
        </>
    );
  
}
