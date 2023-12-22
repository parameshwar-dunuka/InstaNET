import React, { Component ,useEffect} from 'react';
import {Link} from 'react-router-dom'
import {Post} from './Feed'

export function ProfileBody({posts}){

     
    return (
          <div className='profile'>
            {posts!=null && posts.length > 0  ?posts.map((x,i)=> {return (
                <div  className='Post' id={`post_main_${x.postId}`}>
                <Post key={i} data={x}/>
                </div>)
            }):(
                <div>
                <div className='Empty-posts'> 
                <div>📷</div>
                No posts yet</div>
                </div>
                )}
            {/* <div  className='Post'>
                <Post />
            </div>
            <div  className='Post'>
                <Post />
            </div> */}
          </div>
    );
}
