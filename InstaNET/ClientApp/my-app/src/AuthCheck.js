
export function authCheck(){
    const token=localStorage.getItem("tokenSecret");
    const userName=localStorage.getItem("userName");
    return fetch('https://localhost:7215/'+'Profile/Index?userName='+userName, {
    method: 'GET',
    mode:'cors',
    headers:{
        "accept": "*/*",
        "Authorization": "Bearer "+token,
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    }
    })
}
export function GetProfileData(){
    const token=localStorage.getItem("tokenSecret");
    const userName=localStorage.getItem("userName");
    return fetch('https://localhost:7215/'+'Profile/GetProfile?userName='+userName, {
    method: 'GET',
    mode:'cors',
    headers:{
        "accept": "*/*",
        "Authorization": "Bearer "+token,
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    }
    })
}
export function AnonymousProfileData(userName){
    const token=localStorage.getItem("tokenSecret");
    return fetch('https://localhost:7215/'+'Profile/AnonymousIndex?userName='+userName, {
    method: 'GET',
    mode:'cors',
    headers:{
        "accept": "*/*",
        // "Authorization": "Bearer "+token,
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    }
    })
}

export function CallbackauthCheck(url,type,body,isQuerystr,callback,params){
    var urlstr='?'
    if(isQuerystr==true){
        var keys=Object.keys(body)
        var values=Object.values(body)
        for (let index = 0; index < keys.length; index++) {
            urlstr=urlstr+keys[index]+'='+values[index]+'&'
        }
        urlstr=urlstr.replace(/&*$/, '')
    }
    const token=localStorage.getItem("tokenSecret");
    const userName=localStorage.getItem("userName");
    return fetch('https://localhost:7215/'+url+urlstr, {
    method: type,
    mode:'cors',
    headers:{
        "accept": "*/*",
        "Authorization": "Bearer "+token,
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    }
    }).then(x=>{callback(params); return x})
}
