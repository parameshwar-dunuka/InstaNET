import React, { Component ,useEffect, useState} from 'react';
import {Link} from 'react-router-dom'
import {useGlobalContext} from '../AppContext'


export function PostForm(){
    const base=useGlobalContext().baseAddress;
    const [file,setFile]=useState('')
    const [error,setError]=useState('')
  const Showbox=useGlobalContext().Showbox
  const setPopup=useGlobalContext().setPopup;
    
    
const fileHandler=(e)=>{
    //console.log(e.target.files)
    const reader = new FileReader();
    reader.addEventListener("load", function () {
        setFile(reader.result);
    }, false);
    reader.readAsDataURL(e.target.files[0]);
  }

const submitHandler=()=>{
    var form=document.getElementById('post')
    var formobj={}
    for (let index = 0; index < form.length; index++) {
        if (form[index].name==''){
            continue
        }
        if (form[index].value==''){
            setError('All fields are required')
            return;
        }
        if(form[index].type=='file')
            formobj[form[index].name]=file
        else if(form[index].type=='checkbox')
            formobj[form[index].name]=form[index].checked
        else{
            formobj[form[index].name]=form[index].value
        }
    }
    var jsonObj=JSON.stringify(formobj)

    fetch(base+'Profile/addpost', {
            method: 'POST',
            body:jsonObj,
            mode:'cors',
            headers:{
                "Authorization": "Bearer "+localStorage.getItem("tokenSecret"),
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        }).then(res=>res.json()).then(data=>{setPopup(false);Showbox();}).catch(x=>{ 
                           setError('Something went wrong')    })
    // fetch(base+'Profile', {
    //     method: 'GET',
    //     headers:{
    //         "Content-Type": "application/json",
    //         "Access-Control-Allow-Origin": "*",
    //     }
    //   }).then(res=>res.json()).then(data=>{console.log(data)})
  }

    const styles = {
        inputText: {
          color:'black',
          height:'100px',
          width:'300px',
          margin:'10px',
          padding:'10px'
        },
        Popup:{
            maxHeight:'500px'
        },
        button:{
            backgroundColor:'rgb(187 40 123)',
            width:'50px',
            height:'30px',
            color:'white'
        },
        checkbox:{
            height:'18px',
            width:'18px',
            margin:'10px'
        }
      };

      
    return (
        <>
        <form id='post'>
            <div style={styles.Popup}> 
            <h2>Add Post</h2>
            <input type='file' accept='.png,.jpg'  style={{height:'40px'}} name='file' 
            onChange={fileHandler}></input>
            <div>
            <input type='text' name='subtitle' className='field' placeholder='Where is it happened?' maxLength='30' ></input>
            </div>
            <div>
                <label>Tell something about it...</label>
                <div>
                    <textarea style={styles.inputText} name="description" maxLength='100' />
                </div>
            </div>
            <div>
                <label>Disable Comments</label>
                <input type='checkbox' style={styles.checkbox} name='disableComments' />
            </div>
            </div>
            <input type='button' value='Post' style={styles.button} onClick={submitHandler} />
            {error=='' ||<label style={{color:'red',paddingLeft:'10px'}}>{error}</label>}
        </form>
        
        </>
        
    );
}

export function AddStatusForm(){
    const base=useGlobalContext().baseAddress;
    const [file,setFile]=useState('')
    const [error,setError]=useState('')
  const Showbox=useGlobalContext().Showbox
  const setPopup=useGlobalContext().setPopup;
      
const fileHandler=(e)=>{
    //console.log(e.target.files)
    const reader = new FileReader();
    reader.addEventListener("load", function () {
        setFile(reader.result);
    }, false);
    reader.readAsDataURL(e.target.files[0]);
  }

const submitHandler=()=>{
    var form=document.getElementById('post')
    var formobj={}
    for (let index = 0; index < form.length; index++) {
        if (form[index].name==''){
            continue
        }
        if (form[index].value==''){
            setError('All fields are required')
            return;
        }
        if(form[index].type=='file')
            formobj[form[index].name]=file
        else if(form[index].type=='checkbox')
            formobj[form[index].name]=form[index].checked
        else{
            formobj[form[index].name]=form[index].value
        }
    }
    var jsonObj=JSON.stringify(formobj)

    fetch(base+'Profile/addstatus', {
            method: 'POST',
            body:jsonObj,
            mode:'cors',
            headers:{
                "Authorization": "Bearer "+localStorage.getItem("tokenSecret"),
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            }
        }).then(res=>res.json()).then(data=>{setPopup(false);Showbox();}).catch(x=>{ 
                           setError('Something went wrong')    })
    // fetch(base+'Profile', {
    //     method: 'GET',
    //     headers:{
    //         "Content-Type": "application/json",
    //         "Access-Control-Allow-Origin": "*",
    //     }
    //   }).then(res=>res.json()).then(data=>{console.log(data)})
  }
  
    const styles = {
        inputText: {
          color:'black',
          height:'100px',
          width:'300px',
          margin:'10px',
          padding:'10px'
        },
        Popup:{
            maxHeight:'500px'
        },
        button:{
            backgroundColor:'rgb(187 40 123)',
            width:'50px',
            height:'30px',
            color:'white'
        },
      };

    return(
        <>
        <form id='post'>
            <div style={styles.Popup}> 
            <h2>Add Status</h2>
            <input type='file' accept='.png,.jpg'  style={{height:'40px'}} name='file' 
            onChange={fileHandler}></input>
            
            <div>
                <label>Tell something about it...</label>
                <div>
                    <textarea style={styles.inputText} name="description" maxLength='50' />
                </div>
            </div>
            
            </div>
            <input type='button' value='Post' style={styles.button} onClick={submitHandler} />
            {error=='' ||<label style={{color:'red',paddingLeft:'10px'}}>{error}</label>}
        </form>
        </>
        )
}
