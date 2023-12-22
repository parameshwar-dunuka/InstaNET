import React, { Component, useEffect, useState } from 'react';
import {Link} from 'react-router-dom'
import {useGlobalContext} from '../AppContext'


export function Slider({datatoSlide,startIndex}){

  const setPopup=useGlobalContext().setPopup;

  const [index,setIndex]=useState(startIndex);
  var width=1;

  
  const move=(ind)=> {
    clearInterval(localStorage.getItem("intervalid"))
    if(ind<0 || datatoSlide.length<ind+1){
      setPopup(false)
      return
    }
    if(index!=ind)
      setIndex(ind)
    width=1;
    var elem = document.getElementById("myBar");   
    elem.style.width = '1%'; 
    var id = setInterval(frame, 100);
    localStorage.setItem("intervalid",id)
    function frame() {
      if (width >= 100) {
        clearInterval(id);
        if(datatoSlide.length==ind+1){
          clearInterval(id);
          setPopup(false)
        }
        else{
          move(index+1);
        }
      } else {
        width++; 
        elem.style.width = width + '%'; 
      }
    }
  }

      useEffect(function(){
        move(startIndex);
      },[])

      const styles={
        img:{
          height:'400px',
          width:'600px',
        },
        headerImg:{
          width: '5%',
          height: '3%', 
          borderRadius: '50%',
          float:'left',
        }
      }
      return (
          <>
          <div>
              <button style={{position:'absolute',left:'10px',top:'300px'}} onClick={()=>{move(index-1)}}>⬅️</button>
              <div style={{padding:'30px',clear:'both'}}>
                <div style={{textAlign:'left',fontSize:'18px',cursor:'pointer'}} onClick={()=>{window.location.pathname=`/${JSON.parse(datatoSlide[index].dataset.obj).userName}`}}>
                  <img style={styles.headerImg} src= 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'></img>
                  <b style={{padding:'5px'}} >{JSON.parse(datatoSlide[index].dataset.obj).userName}
                  </b>&nbsp;&nbsp; <span style={{fontSize:'10px'}}>{JSON.parse(datatoSlide[index].dataset.obj).postedAgo}</span></div>
                <img style={styles.img} src={datatoSlide[index].src}></img>
                <div>{JSON.parse(datatoSlide[index].dataset.obj).Description}</div>
                <div style={{position:'absolute',bottom:'5px',width:'700px',left:'60px'}}>
                <div id='myBar' style={{backgroundColor:'crimson',width:'1%',borderRadius:'12px',height:'3px'}}>
                </div>
              </div>
              </div>
              <button style={{position:'absolute',right:'10px',top:'300px'}} onClick={()=>{move(index+1)}}>➡️</button>
              

          </div>
            
          </>
          
    );
  
}
