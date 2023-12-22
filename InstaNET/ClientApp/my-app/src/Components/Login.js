import React, { Component ,useState} from 'react';
import {Link,Outlet, useNavigate} from 'react-router-dom'
import {Post} from './Feed'
import {useGlobalContext} from '../AppContext'



export function Login({data}){   
    const [error,setError]=useState([])
    const base=useGlobalContext().baseAddress;
    const setToken=useGlobalContext().setToken;
    const setuserName=useGlobalContext().setuserName;
    const setauthSuccess=useGlobalContext().setauthSuccess;
    const setpopup=useGlobalContext().setPopup;
    const navigate=useNavigate()
    const setloading=useGlobalContext().setLoading;


    const Login = ()=> {
        data=''
        var form=document.getElementById('login')
        var formobj={}
          for (let index = 0; index < form.length; index++) {
              if (form[index].name==''){
                  continue
              }
              if (form[index].value==''){
                  setError(['All fields are required'])
                  return;
              }
              formobj[form[index].name]=form[index].value
          }
          formobj['returnUrl']=window.location.pathname;
          var jsonObj=JSON.stringify(formobj)
          fetch(base+'Accounts/Login', {
              method: 'POST',
              body:jsonObj,
              mode:'cors',
              headers:{
                  "accept": "*/*",
                  "Content-Type": "application/json",
                  "Access-Control-Allow-Origin": "*",
              }
            }).then(res=>res.json()).then(data=>{
            if(data.errors!=null &&data.errors.length>0){
                setError(data.errors)
            }
            else{
              localStorage.setItem("tokenSecret",data.jwtToken)
              localStorage.setItem("userName",data.userName)
              setauthSuccess(true)
              setpopup(false)
              setuserName(data.userName)
              setloading(true)
              window.location.reload();
              navigate('/',{state:{returnUrl:data.returnUrl}})
            }
          }).catch(x=>{ setError(['Check your internet or Something went wrong..'])    })
        }

    return (
        <>
        <form id='login'>
                  <div>
                      <p style={{ fontFamily: 'Cursive, Arial, sans-serif', fontSize: '28px', textAlign: 'center' }}>InstaNet</p>
                      <div>
                        <input className='field' name='userName' type='text' placeholder='Username or Email'></input>
                      </div>
                      <div>
                        <input className='field' name='password' type='password' placeholder='Password'></input>
                      </div>
                      <div>
                          <input style={{ fontSize: '15px', width: '350px', backgroundColor: 'RGB(50, 140, 237)', border: '0.01px solid', borderRadius: '10px', height: '35px', margin: '10px', color: 'whitesmoke'  }} type='button'  onClick={Login} value='Log In'></input>
                      </div>
                      <div style={{color:'red'}}>{error==null?'':error.map(x=><div>{x}</div>)}</div>
                      <div style={{color:'red'}}>{data==''?'':<div>{data}</div>}</div>

                        <p>----------- or -------------</p>
                        <div>
                          <p>Sign In With <a href='www.google.com'>Google</a></p>
                        </div>
                    <div className='forgotpw'>
                        <p>Don't have an Account? <Link to={'/accounts/signup'}>Sign up</Link> here</p>
                    </div>
                  </div>
                    
              </form>
        </>
        
    );
}
