import React, { Component ,useEffect} from 'react';
import {Link} from 'react-router-dom'
import {Post} from './Feed'
import { clear } from '@testing-library/user-event/dist/clear';

export function PopUp({data,ShowPopUp,classAppend,showClosebtn}){
    const ClosePopup=()=>{
        ShowPopUp(false)
    }      
    return (
        <>
        {showClosebtn==false ? <div className='mymodal' onClick={ClosePopup}></div> // for closing when clicked outside
        : <div className='mymodal'></div> }
            <div className={classAppend ||'modal-content'}>
            {showClosebtn && <button style={{position:'sticky',top:'0',float:'right'}} onClick={ClosePopup}>X</button>}
                {data}
            </div>
        </>
        
    );
}
