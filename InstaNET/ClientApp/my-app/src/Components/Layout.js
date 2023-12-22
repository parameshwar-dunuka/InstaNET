import React, { Component,useEffect } from 'react';
import {Link} from 'react-router-dom'
import {Status} from './Status'
import { Actions } from './Action';
import {ProfileBody} from './ProfileBody'

export function Layout({userData,children}){
  
  
      return (
          <>
            <div className='statusBar'>
              <Status statusData={userData.status}/>
            </div> 
            <Actions userName={userData.userName} profilePic={userData.profilePic}/>
            {children}
            <footer style={{textAlign:'center',padding:'10px'}}>From NetWorks</footer>
          </>
    );
  
}
