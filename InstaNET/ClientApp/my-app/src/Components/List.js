import React, { Component ,useEffect, useState} from 'react';
import {Link} from 'react-router-dom'
import { useGlobalContext } from '../AppContext';

export function List(){
    const styles={
        resultSpan:{
            float:'left',padding:'8px'
        },
        result:{
            padding:'5px',clear:'both',cursor:'pointer',borderTop:'0.5px dotted white'
        }
    }   
    return (
        <>
        <h3>Share to...</h3>
        <div>
        <div style={{paddingTop:'15px'}} className='scroll-area'>
            <div  style={styles.result}>
                <b><span style={styles.resultSpan}>To Chats</span></b>
            </div><div  style={styles.result}>
                <b><span style={styles.resultSpan}>Generate Link</span></b>
            </div>
            <div  style={styles.result}>
                <b><span style={styles.resultSpan}>Share as Post</span></b>
            </div><div  style={styles.result}>
                <b><span style={styles.resultSpan}>Save</span></b>
            </div>
        </div>
        </div>
        
        </>
        
    );
}


export function Report(){
    const [OpenCustomBox,setCustombox]=useState(false)
    const Showbox=useGlobalContext().Showbox
    const styles={
        resultSpan:{
            float:'left',padding:'8px'
        },
        result:{
            padding:'5px',clear:'both',cursor:'pointer',borderTop:'0.5px dotted white'
        }
    }   
    return (
        <>
        <h3>Report</h3>
        <div>
        <div style={{paddingTop:'15px'}} className='scroll-area'>
            <div  style={styles.result}>
                <b><span style={styles.resultSpan}>In Appropirate</span></b>
            </div><div  style={styles.result}>
                <b><span style={styles.resultSpan}>Malicious Content</span></b>
            </div>
            <div  style={styles.result}>
                <b><span style={styles.resultSpan}>It should not be on InstaNet</span></b>
            </div>
            <div onClick={()=>setCustombox(true)}  style={styles.result}>
                <b><span style={styles.resultSpan}>Custom</span></b>
            </div>
            {OpenCustomBox &&<div style={styles.result}>
                <textarea style={{padding:'5px',width:'250px'}}></textarea>
                <div>
                    <button onClick={()=>{Showbox()}}>Report</button></div>
            </div>}
        </div>
        </div>
        
        </>
        
    );
}
