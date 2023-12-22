import React, { Component, useEffect, useState } from 'react';
import {Link,useLocation,useNavigate,useLoaderData,useParams} from 'react-router-dom'
import {ProfileBody} from './ProfileBody'
import {Layout} from './Layout'

export function Profile({UserData}) {


      return (
          <>
            <Layout userData={UserData} >
                <div className='Main-Body'>
                <ProfileBody posts={UserData.posts}/>
              </div> 
            </Layout>
          </>
    );
  
}
