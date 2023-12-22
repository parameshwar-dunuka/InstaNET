import React, { Component ,useEffect,useState} from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {useGlobalContext} from '../AppContext'

export function Signup() { 
      const base=useGlobalContext().baseAddress;
      const setPopup=useGlobalContext().setPopup;
      const [nextpage,setNextpage]=useState(false)
      const [profpicurl,setProfilpicurl]=useState('https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png')
      const [error,setError]=useState([])
      const setauthSuccess=useGlobalContext().setauthSuccess;
      const [file,setFile]=useState('')
      const data=useLocation();
      if(nextpage!=true && (data.state!=null && data.state!=undefined && data.state!='' )){
        setNextpage(true)
      }
      const navigate = useNavigate();
      useEffect(function(){
        setPopup(false)
      },[])

      const styles={
        submitbtn:{
          fontSize: '15px', width: '350px', backgroundColor: 'RGB(50, 140, 237)', border: '0.01px solid', borderRadius: '10px', height: '35px', margin: '10px', color: 'whitesmoke' 
        },
        headerImg:{position:'relative',
            width: '120px',
            height: '120px', 
            borderRadius: '50%',
        },
      }

      const Signup = ()=> {
          var form=document.getElementById('signup')
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
          var jsonObj=JSON.stringify(formobj)

          fetch(base+'Accounts/Register', {
                method: 'POST',
                body:jsonObj,
                mode:'cors',
                headers:{
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                }
            }).then(res=>res.json()).then(data=>{
              if(data.errors.length>0){
                  setError(data.errors)
              }
              else{
                localStorage.setItem("tokenSecret",data.jwtToken)
                localStorage.setItem("userName",data.userName)
                setauthSuccess(true)
                setError(['Signup Successful'])
                setNextpage(true)
              }
            }).catch(x=>{ setError(['Something went wrong..'])    })
        }
        const SignupFinish = ()=> {
          var form=document.getElementById('signup')
          var formobj={}
            for (let index = 0; index < form.length; index++) {
                if (form[index].name==''){
                    continue
                }
                if (form[index].type!='file' && form[index].value==''){
                    setError(['All fields are required'])
                    return;
                }
                if(form[index].type=='file')
                    formobj[form[index].name]=file
                else
                    formobj[form[index].name]=form[index].value
            }
              
              formobj['user']=localStorage.getItem("userName")
              var jsonObj=JSON.stringify(formobj)

          fetch(base+'Profile/ProfileComplete', {
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
                 navigate('/',{state:'Signup successful , Login to Begin'})
            }).catch(x=>{ setError(['Something went wrong..'])    })
        }
      const setpROFILEpIC=(input)=>{
          var reader = new FileReader();
  
          reader.onload = function(e) {
            setFile(reader.result)
            setProfilpicurl(e.target.result);
          }
          
          reader.readAsDataURL(input.target.files[0]);
      }
        
      return (
        <>
        {nextpage==false?
          <div>
              <form id='signup'>
                  <div style={{ border: '0.1px solid' }} className='Login'>
                      <p style={{ fontFamily: 'Cursive, Arial, sans-serif', fontSize: '28px', textAlign: 'center' }}>InstaNet</p>
                      <div>
                        <input className='field' name='email' type='text' placeholder='Email'></input>
                      </div>
                      <div>
                        <input className='field' name='userName' type='text' placeholder='User Name'></input>
                      </div>
                      <div>
                        <input className='field' name='displayName' type='text' placeholder='Display Name'></input>
                      </div>
                      <div>
                        <input className='field' name='password' type='password' placeholder='Password'></input>
                      </div>
                      <div>
                          <input style={styles.submitbtn} type='button' value='Sign up' onClick={Signup}></input>
                      </div>
                      <div style={{color:'red'}}>{error==null?'':error.map(x=><div>{x}</div>)}</div>
                        <p>----------- or -------------</p>
                    <div className='forgotpw'>
                        <p>Have Account? <Link to='/'>Login</Link> here</p>
                    </div>
                  </div>
                    
              </form>
          </div>:
          <div>
              <form id='signup'>
                  <div style={{ border: '0.1px solid' }} className='Login'>
                      <p style={{  fontSize: '24px', textAlign: 'center' }}>Add Profile Pic</p>
                      <div className='statusDiv'>
                          <label for='file-input'>
                          <img style={styles.headerImg} src={profpicurl}></img>
                          <div style={{position:'absolute',zIndex:'4', bottom:'18px',left:'8px', fontSize:'15px',cursor:'pointer', backgroundColor:'black'}}>Change Picture</div>
                          </label>
                          <input style={{display:'none'}} id='file-input' type='file' name='profilePic' onChange={setpROFILEpIC}></input>
                      </div>
                      <div>
                        <textarea maxLength='120' name='bio' placeholder='Add Bio' style={{height:'80px',padding:'10px',width:'325px'}}>
                        </textarea>
                      </div>
                      <div>
                        <input className='field' id='location' name='location' type='text' placeholder='Location'></input>
                      </div>
                      <div>
                          <input style={styles.submitbtn} type='button' value='Continue' onClick={SignupFinish}></input>
                      </div>
                      <div style={{color:'red'}}>{error==null?'':error.map(x=><div>{x}</div>)}</div>

                  </div>
                    
              </form>
          </div>
          }
        </>
          
    );
  
}
