import React, { Component ,useState} from 'react';
import {Post} from './Feed'
import {useGlobalContext} from '../AppContext'

export function Search(){
    const [search,setSearch]=useState('')
    const [searchRes,setSearchRes]=useState([])

    const base=useGlobalContext().baseAddress;

    const styles={
        resultSpan:{
            float:'left',paddingTop:'5px',paddingLeft:'8px'
        },
        result:{
            padding:'5px',clear:'both',cursor:'pointer'
        }
    }
    const searchInternal=()=>{
        fetch(base+'Profile/search?searchtext='+search, {
        method: 'GET',
        mode:'cors',
        headers:{
            "accept": "*/*",
            "Authorization": "Bearer "+localStorage.getItem("tokenSecret"),
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        } }).then(res=>res.json())
            .then(data=>{ setSearchRes(data);
                          }).catch(x=>{ })
    }

    return (
        <>
        <h3>Search</h3>
        <div>
        <div style={{position:'sticky',top:'0'}}>
            <input className='field' type='text' value={search}
                                     onChange={(e)=>{setSearch(e.target.value) ; 
                                        var x;
                                        clearTimeout(x)
                                    if(search.length>=3)
                                    {x=setTimeout(() => {
                                        searchInternal()
                                    }, 200);}}} 
                        id='search-box' placeholder='Type something to search..' />
        </div>
        <div style={{paddingTop:'15px'}} className='scroll-area' >
            {searchRes.length==0?'': searchRes.map((x)=>{
                    return (<div  style={styles.result} onClick={()=>{window.location.pathname=`/${x.userName}`}}>
                        <img style={{float:'left'}} className='profile-pic' src={x.userProfilepic || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'}></img>
                        <b><span style={styles.resultSpan}>{x.userName}</span></b>
                        {x.isFollowing==true?<span style={styles.resultSpan}>: Following</span>:''}
                    </div>)
            }) }
            
        </div>
        </div>
        
        </>
        
    );
}
