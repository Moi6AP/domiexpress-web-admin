import axios from "axios";
import { getAuth } from "firebase/auth";

const auth = getAuth();

async function getUserToken (){
    let result = false;
    try {
        await auth.currentUser.getIdToken()
        .then((token)=>{
            result = token;
        });
    } catch {
        
    }

    return result;
}

export default async function api(tipoPeticion, ruta, body, urlFull){

    try {
        return await axios[tipoPeticion](`${process.env.NODE_ENV == "development" ? `http://192.168.1.16:4200${urlFull ? "" : "/admin"}`+ruta : `https://api-domiexpress.ue.r.appspot.com${urlFull ? "" : "/admin"}`+ruta}`, body, {
            headers:{
                "token": await getUserToken()
            }
        })
        .then((res)=>{
            return res.data
        });
    } catch (e) {

        return {result:[false, "Lo sentimos, sucedio un error, Comprueba tu conexión a internet."]};
    }
}