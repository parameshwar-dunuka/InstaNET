import React, { Component,createContext,useContext} from 'react';
import { useState } from 'react';
import { PopUp } from './Components/PopUp';

const GlobalContext=createContext()

export const useGlobalContext=()=>useContext(GlobalContext) // this custom hook can be used by its child 
function ShowBox({data}){
  return (<>
    <div className='show-box'>{data||'Successful ✅'}</div>
  </>)
}
export function AppContext(props){
        const [baseAddress,setbaseAddress]=useState('https://localhost:7215/')
        const [token,setToken]=useState('')
        const [userName,setuserName]=useState(null)
        const [showPopup,setPopup]=useState(false)
        const [authSuccess,setauthSuccess]=useState(false)
        const [showBox,setshowBox]=useState({show:false,data:null})
        const [loading,setloading]=useState(true)
        const [userData,setUserData]=useState({})


        
        const OpenShowbox=(data)=>{
            setshowBox({show:true,data:data})
            setTimeout(() => {
              setshowBox({show:false,data:null})
            }, 1000);
        }

      const [param,setParam]=useState({params:'',classAppend:'',showClosebtn:false})
      

        return <GlobalContext.Provider value={{baseAddress:baseAddress,token:token,setToken:setToken,userName:userName
                                        ,setPopup:setPopup,setParam:setParam,setuserName:setuserName
                                        ,authSuccess:authSuccess,setauthSuccess:setauthSuccess
                                        ,Showbox:OpenShowbox,loadingState:loading,setLoading:setloading
                                        ,userData:userData,setUserData:setUserData}}>
                {props.children}
                <div className='popup'>
                    {showPopup==true && <PopUp data={param.params} ShowPopUp={setPopup} classAppend={param.classAppend}
                                          showClosebtn={param.showClosebtn}/>}
                </div>
                <div>
                    {showBox.show==true && <ShowBox data={showBox.data}/>}
                </div>
            </GlobalContext.Provider>
}
