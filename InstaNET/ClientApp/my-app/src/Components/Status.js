import React, { Component ,useEffect} from 'react';
import {useGlobalContext} from '../AppContext'
import { AddStatusForm } from './PostForm';
import { Slider } from './Slider';

export function Status({statusData}){
  const setPopup=useGlobalContext().setPopup;
  const setParam=useGlobalContext().setParam;
  var i=0;
  useEffect(function(){
    //console.log(statusData)
    },[])

    const startSlideStatus=(x)=>{
      var statuses=document.querySelectorAll('.otherstatus')
      setPopup(true)
      setParam({params:<Slider datatoSlide={Array.prototype.slice.call(statuses)} startIndex={x}/>,showClosebtn:true,classAppend:'slider-content'})
    }
    const mySlideStatus=(x)=>{
      var statuses=document.querySelectorAll('.mystatus')
      setPopup(true)
      setParam({params:<Slider datatoSlide={Array.prototype.slice.call(statuses)} startIndex={x} />,showClosebtn:true,classAppend:'slider-content'})
    }
     const addStatus=()=>{
        setPopup(true)
        setParam({params:<AddStatusForm />,showClosebtn:true,classAppend:'modal-content'})
     }
    return (
          <>
          <div className='statusDiv' onClick={addStatus} >
          <img style={{position:'relative'}} className='statusInd' src='https://images.unsplash.com/photo-1611262588024-d12430b98920?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aW5zdGFncmFtJTIwcHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60'></img>
          <div title='Add status' style={{position:'absolute',zIndex:'4', top:'20px',left:'18px', fontSize:'48px',cursor:'pointer'}}>+</div>
          </div>


          {statusData!=null ?
          statusData.filter(y=>y.isSelfStatus==true).map((x,i)=>
          { return (<div className='statusDiv' onClick={()=>{ mySlideStatus(i)}}>
            <img className='statusInd mystatus' src={x.statusData} data-obj={`{"userName":"${x.whoseStatus}","Description":"${x.description}","Id":"${x.statusId}","postedAgo":"Posted ${x.seenAgo=='0'?'while':x.seenAgo + ' hours'} ago"}`}></img>
            <div title='my status' style={{position:'absolute',zIndex:'4', top:'56px',left:'20px', fontSize:'12px',cursor:'pointer'}}><b>my status</b></div>
            </div>)
          }):''}

          {statusData!=null ?
          statusData.filter(y=>y.isSelfStatus==false).map((x,i)=>
          { return (<div className='statusDiv' onClick={()=>{ startSlideStatus(i)}}>
          <img className='statusInd otherstatus' style={x.isSeen?{  border: "3px solid rgb(218, 204, 204)"}:{border: "3px solid rgb(224, 56, 56)"} }
          src={x.statusData} data-obj={`{"userName":"${x.whoseStatus}","Description":"${x.description}","Id":"${x.statusId}","postedAgo":"Posted ${x.seenAgo=='0'?'while':x.seenAgo + 'hours'} ago"}`}></img>
          <div title='see status' style={{position:'absolute',zIndex:'4', top:'56px',left:'20px', fontSize:'12px',cursor:'pointer'}}><b>{x.whoseStatus}</b></div>
          </div> )
          }):''}
        
        
          </>
    );
}
