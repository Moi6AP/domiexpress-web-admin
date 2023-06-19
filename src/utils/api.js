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

export default async function api(tipoPeticion, ruta, body){

    try {
        return await axios[tipoPeticion](`${process.env.NODE_ENV == "development" ? "http://localhost:4200"+ruta : ""+ruta}`, body, {
            headers:{
                "token": await getUserToken()
            }
        })
        .then((res)=>{
            return res.data
        })
    } catch (e) {
        console.log(e);
        return "Error";
    }
}