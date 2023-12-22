import React, { Component ,useEffect, useState} from 'react';
import {Link,useParams,useLoaderData, useSearchParams} from 'react-router-dom'
import { MyProfileLayout } from './MyProfileLayout';
import {ProfileBody} from './ProfileBody'
import { Login } from './Login';
import { ErrorPage } from './ErrorPage';
import { useGlobalContext } from '../AppContext';
import { AnonymousProfileData } from '../AuthCheck';


function Posts({layoutType,data}){

    return (
        <div>
            <ProfileBody posts={data} />
        </div>
        )

    // if(layoutType=='tagged'){
    //     return(
    //         <>
    //             <div className='Empty-posts'> 
    //             <div>📷</div>
    //             No posts yet</div>
    //         </>
    //         )
    // }
    // else{
        
    // }
}

export function MyProfile(){
    const setPopup=useGlobalContext().setPopup;
    const setParam=useGlobalContext().setParam;
    const [display,setDisplay]=useState('posts')
    const [activeIndex,setActiveIndex]=useState(1)
    const dataToken=useLoaderData()
    const [profileData,setProfileData]=useState('')
    const ProfileName=useParams().ProfileName
    const styles={
        heads:{
            paddingLeft:'60px',
            fontSize:'20px',
            cursor:'pointer'
        }
    }      
    useEffect(()=>{
        dataToken(ProfileName).then(x=>x.json()).then(data=>{
            if(data.userName==null){
                setPopup(true)
                setParam({params:<ErrorPage data={"The Profile you are looking doesn't exist"} />
                ,showClosebtn:false,classAppend:'list-content'})
            }
            else{
                setProfileData(data)
            }
        })
        .catch(err=>{
            AnonymousProfileData(ProfileName).then(x=>x.json())
            .then(data=>{
                if(data.userName==null){
                    setPopup(true)
                    setParam({params:<ErrorPage data={"The Profile you are looking doesn't exist"} />
                    ,showClosebtn:false,classAppend:'list-content'})
                }
                else{
                    setProfileData(data)
                    setPopup(true)
                    setParam({params:<Login data={"Login before proceeding"} />,showClosebtn:true,classAppend:'list-content'})
                }
            })
        })
    },[])
    
    const setHeader=(e,type,index)=>{
        setActiveIndex(index)
        setDisplay(type); 
    }
    return (
        <>
        {profileData==''?'':
        <MyProfileLayout profileName={profileData.displayName} profileData={profileData}>
            <div style={{paddingTop:'25px'}}>
                <span style={styles.heads}><span className={activeIndex==1?'active':'Inactive'} onClick={(e)=>{setHeader(e,'posts',1)}}>📮Posts</span></span>
                <span style={styles.heads}><span className={activeIndex==2?'active':'Inactive'} onClick={(e)=>{setHeader(e,'tagged',2)}}>🏷️Tagged</span></span>
                <span style={styles.heads}><span className={activeIndex==3?'active':'Inactive'} onClick={(e)=>{setHeader(e,'saved',3)}}>🔽Saved</span></span>
            </div>
            <div>
                <div><Posts layoutType={display} data={profileData.posts}/></div>
            </div>
        </MyProfileLayout>}
        </>
        
    );
}
