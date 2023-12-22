import React, { useState,useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom'
import { Actions } from './Action';
import { Users } from './Users';
import {useGlobalContext} from '../AppContext'
import { Login } from './Login';
import { authCheck,CallbackauthCheck } from '../AuthCheck';
import {ChatBox} from './ChatBox';

function ProfileEditPop({data}){
    const [enable,setEnable]=useState({userName:false,email:false,displayName:false,btn:false})
    const [profpicurl,setProfilpicurl]=useState(data.profilePic || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png')
    const [userName,setUserName]=useState(data.userName)
    const [displayName,setdisplayName]=useState(data.displayName)
    const [error,setError]=useState('')
    const base=useGlobalContext().baseAddress;
    const Showbox=useGlobalContext().Showbox
    const setPopup=useGlobalContext().setPopup;



    const styles={
        header:{paddingLeft:'10px',paddingTop:'10px'},
        headerImg:{position:'relative',
            width: '120px',
            height: '120px', 
            borderRadius: '50%',
        },
        disabledBox:{
           backgroundColor: 'rgb(255,255,255,0.7)',
           pointerEvents:'none',right:'10px'
        },
        undisabledBox:{
            backgroundColor: 'rgb(255,255,255)',
           pointerEvents:'all'
        },
        editdivs:{
            padding:'10px'
        }
    }     
    const setpROFILEpIC=(input)=>{
        var reader = new FileReader();

        reader.onload = function(e) {
          setProfilpicurl(e.target.result);
        }
    
        reader.readAsDataURL(input.target.files[0]);
    }

    const setProfileEdit=()=>{
        if(displayName==''|| userName=='' || document.getElementById('userBIO').value==''){
            setError('All fields are required')
        }
        if(enable.userName==true||enable.displayName==true){
            setError('Save before continuing')
        }
        else{
            setError('')
            var jsonObj=`{"changeduserName":"${userName}","originaluserName":"${localStorage.getItem("userName")}",
                            "bio":"${document.getElementById('userBIO').value}","displayName":"${displayName}",
                        "userProfilepic":"${profpicurl}"}`
            fetch(base+'Profile/setprofile', {
                method: 'POST',
                body:jsonObj,
                mode:'cors',
                headers:{
                    "Authorization": "Bearer "+localStorage.getItem("tokenSecret"),
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                }
            }).then(res=>res.json())
              .then(data=>{
                Showbox()
                setPopup(false)
                 console.log(data)
            }).catch(x=>{ setError(['UserName already exists'])    })
        }
    }
    return (<>
        <div>
            <div className='scroll-area' style={{height:'400px'}}>
            <div className='statusDiv'>
                <label for='file-input'>
                <img style={styles.headerImg} src={profpicurl}></img>
                <div style={{position:'absolute',zIndex:'4', bottom:'18px',left:'8px', fontSize:'15px',cursor:'pointer', backgroundColor:'black'}}>Change Picture</div>
                </label>
                <input style={{display:'none'}} id='file-input' type='file' onChange={setpROFILEpIC}></input>
            </div>
            <div style={{float:'left'}}>
                    <div>
                        <span style={{paddingRight:'10px'}}>User Name</span>
                        <div style={{display:'inline-block',position:'relative'}}>
                        <input type='text' className='field' style={enable.userName==true?styles.undisabledBox:styles.disabledBox} value={userName} onChange={(e)=>{setUserName(e.target.value)}}></input>
                        {enable.userName==false?<button onClick={()=>{setEnable({...enable,userName:true})}} style={{position:'absolute',right:'10px',top:'10px',height:'40px',width:'42px'}}>✏️</button>
                        :<button onClick={()=>{setEnable({...enable,userName:false})}} style={{position:'absolute',right:'10px',top:'10px',height:'40px',width:'42px'}}>✅</button>}
                        </div>
                    </div>
                    <div>
                        <span style={{paddingRight:'10px'}}>Display Name</span>
                        <div style={{display:'inline-block',position:'relative'}}>
                        <input type='text' className='field' style={enable.displayName==true?styles.undisabledBox:styles.disabledBox} value={displayName} onChange={(e)=>{setdisplayName(e.target.value)}}></input>
                        {enable.displayName==false?<button onClick={()=>{setEnable({...enable,displayName:true})}} style={{position:'absolute',right:'10px',top:'10px',height:'40px',width:'42px'}}>✏️</button>
                        :<button onClick={()=>{setEnable({...enable,displayName:false})}} style={{position:'absolute',right:'10px',top:'10px',height:'40px',width:'42px'}}>✅</button>}
                        </div>
                    </div>
                    <div>
                        <div style={{paddingRight:'10px'}}>Add Bio</div>
                        <div style={{display:'inline-block',position:'relative'}}>
                        <textarea type='text' className='field' style={{}} id='userBIO'>{data.bio}</textarea>
                        
                        </div>
                    </div>
                    {/* <div style={styles.editdivs}>
                        <span style={{cursor:'pointer'}}>Manage Blocked Profiles</span>
                    </div> */}
                    {/* <div  style={styles.editdivs}>
                        <span>Profile Access</span>
                        <div>
                        <label>Friends</label><input type='Radio' id={'Friends'} name='profileAccess'/>
                        <label>Everyone</label><input type='Radio' checked id={'everyone'} name='profileAccess' />
                        </div>
                    </div> */}
                    <div style={{display:'inline-block',position:'relative',paddingTop:'10px'}}>
                        <button  style={{height:'30px'}} onClick={setProfileEdit}>Submit</button>          
                        <span style={{color:'red',padding:'5px'}}>{error}</span> </div>
             </div>
            </div>    
        </div>
    </>)
}

export function MyProfileLayout(props){
    
    const base=useGlobalContext().baseAddress;
    const setPopup=useGlobalContext().setPopup;
    const setParam=useGlobalContext().setParam;
    const authSuccess=useGlobalContext().authSuccess;
    const setauthSuccess=useGlobalContext().setauthSuccess;
    const [isfollowing,setIsfollowing]=useState({pendingStatus:props.profileData.isFollowingPending==false?'Following':'Pending'
                                            ,isfollower:props.profileData.isFollowing})

    const navigate=useNavigate()
    const styles={
        header:{position:'absolute',paddingLeft:'350px',paddingTop:'10px'},
        headerImg:{
            width: '120px',
            height: '120px', 
            borderRadius: '50%',
            float:'left',
            paddingTop:'8px'
        },
        spanTitle:{fontSize:'25px'},
        divs:{paddingRight:'15px',paddingBottom:'10px',paddingTop:'12px',cursor:'pointer'}
    }      

    const profile='pam'

    const showFollowers=()=>{
        CallbackauthCheck('profile/GetFollowers','get',{userName:props.profileData.userName},true,(x)=>{},'a')
        .then(x=>x.json()).then(data=>{
            setPopup(true)
            setParam({params:<Users data={data}
                title={'Followers'}/>,showClosebtn:false,classAppend:'center-content'})
        })
        .catch(err=>{
            setPopup(true)
            setParam({params:<Login data={"Login before proceeding"} />,showClosebtn:true,classAppend:'list-content'})
            
        })
        
    }
    const showFollowing=()=>{
        CallbackauthCheck('profile/GetFollowing','get',{userName:props.profileData.userName},true,(x)=>{},'a')
        .then(x=>x.json()).then(data=>{
            setPopup(true)
            setParam({params:<Users data={data}
                title={'Following'}/>,showClosebtn:false,classAppend:'center-content'})
        })
        .catch(err=>{
            setPopup(true)
            setParam({params:<Login data={"Login before proceeding"} />,showClosebtn:true,classAppend:'list-content'})
            
        })
        
    }
    const ToggleFollowing=()=>{
        CallbackauthCheck('profile/ToggleFollowing','get',{userName:props.profileData.userName},true,(x)=>{},'a')
        .then(x=>x.json())
        .then(pending=>{
            if(pending.ispending==true){
                setIsfollowing({isfollower:true,pendingStatus:'Pending'})
            }
            else{
                setIsfollowing({isfollower:true,pendingStatus:'Following'})
            }
        })
        .catch(err=>{
            setPopup(true)
            setParam({params:<Login data={"Login before proceeding"} />,showClosebtn:true,classAppend:'list-content'})
            
        })
    }
    const ToggleUnFollowing=()=>{
        CallbackauthCheck('profile/ToggleFollowing','get',{userName:props.profileData.userName},true,(x)=>{},'a')
        .then(pending=>{
            setIsfollowing({isfollower:false})
        })
        .catch(err=>{
            setPopup(true)
            setParam({params:<Login data={"Login before proceeding"} />,showClosebtn:true,classAppend:'list-content'})
            
        })
    }
    const ProfileEdit=()=>{
        fetch(base+'Profile/GetProfileEdit?userName='+localStorage.getItem('userName'), {
            method: 'GET',
            mode:'cors',
            headers:{
                "accept": "*/*",
                "Content-Type": "application/json",
                "Authorization": "Bearer "+localStorage.getItem("tokenSecret"),
                "Access-Control-Allow-Origin": "*",
            }
            }).then(y=>y.json()).then(x=>{
                setPopup(true)
                 setParam({params:<ProfileEditPop data={x} />,showClosebtn:true,classAppend:'list-content'})
            }).catch(err=>{})
    }

    const logout=()=>{
        return fetch(base+'Accounts/Logout', {
        method: 'GET',
        mode:'cors',
        headers:{
            "accept": "*/*",
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        }
        }).then(x=>{
            localStorage.setItem('tokenSecret','')
            localStorage.setItem('userName','')
            setauthSuccess(false)
            navigate('/')
        }).catch(err=>{localStorage.setItem('tokenSecret','')
        localStorage.setItem('userName','')
        navigate('/')})
    }

    const OpenChatbox=()=>{
        authCheck().then(x=>x.json()).then(y=>{
          setPopup(true)
          setParam({params:<ChatBox userName={props.profileData.userName} displayName={props.profileName}/>,showClosebtn:true,classAppend:'chat-content'})
        }).catch(err=>{navigate('/',{state:"Login to continue"})})
      }
    return (
        <>
        <Actions  userName={localStorage.getItem('userName')} profilePic={props.profileData.myProfilePic}>
            <div style={styles.header}>
                <div>
                    <img style={styles.headerImg} src={props.profileData.profilePic || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'}></img>
                    <div style={{float:'left',paddingLeft:'50px'}}>
                        <div style={styles.spanTitle}>
                            <span style={{paddingRight:'30px'}}>{props.profileName}</span>
                            {props.profileData.isSelf==true?
                                <span><button onClick={ProfileEdit}>Edit Profile</button>
                                <button style={{margin:'5px'}} title='logout' onClick={logout}>:-)</button></span>:
                                <button title='click to chat' onClick={()=>{OpenChatbox()}}>Chat</button>}
                        </div>
                        <div  style={styles.divs}>
                            <b>
                                <span style={styles.divs}>{props.profileData.postCount} posts</span>&nbsp;&nbsp;
                                <span style={styles.divs} onClick={showFollowers}>{props.profileData.followersCount} followers</span>&nbsp;&nbsp;
                                <span style={styles.divs} onClick={showFollowing}>{props.profileData.followingCount} following</span>
                            </b>
                        </div>
                        <div>
                            {props.profileData.isSelf==false?
                            isfollowing.isfollower==true?<button style={{height:'30px'}} onClick={ToggleUnFollowing}>{isfollowing.pendingStatus}</button>:
                            <button style={{backgroundColor:'#6f8ac2',height:'30px'}} onClick={ToggleFollowing}>Follow</button>:''}
                            
                        </div>
                        <div  style={styles.divs}>
                             {props.profileData.bio}
                        </div>
                    </div>
                    
                </div>
            <div style={{clear:'both'}}>
                {props.children}
            </div>

            </div>
            
            
        </Actions>
        </>
        
    );
}
