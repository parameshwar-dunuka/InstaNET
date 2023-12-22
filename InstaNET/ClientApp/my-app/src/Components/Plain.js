import React, { Component ,useEffect} from 'react';
import {Link} from 'react-router-dom'
import {Post} from './Feed'


export function Plain({data,title}){   
    const styles={
        resultSpan:{
            float:'left',paddingTop:'5px',paddingLeft:'8px'
        },
        resultfloat:{
            float:'right',paddingTop:'5px',paddingLeft:'8px'
        },
        result:{
            padding:'5px',clear:'both',cursor:'pointer'
        }
    }  
    return (
        <>
        <div style={{}}>
        <h3>{title}</h3>
        <div>
            <input style={{margin:'0'}} className='field' type='text' placeholder='Type something to search..' />
        </div></div>
        <div className='scroll-area'>
        {
            data.map(x=>{ return (
            <div style={{paddingTop:'15px'}}>
            <div  style={styles.result}>
                <img style={{float:'left'}} className='profile-pic' src='https://images.unsplash.com/photo-1611262588024-d12430b98920?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aW5zdGFncmFtJTIwcHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60'></img>
                <b><span style={styles.resultSpan}>{x}</span></b>
                <button style={styles.resultfloat}>{'unfollow'}</button>
            </div>
            </div>
            )
            })
        }
        </div>
        
        </>
        
    );
}
