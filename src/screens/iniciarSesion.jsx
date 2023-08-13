import { Button, Flex, Input, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../utils/fbConfig";
import { useState } from "react";

export default function IniciarSesion ({isLogueado}){

    const navigate = useNavigate();
    const [inputsValue, setInputsValue] = useState({email:"", pass:""});

    async function iniciarSesion (e){
        e.preventDefault();
        if (inputsValue.email.replace("  ", "").trim() != "" && inputsValue.pass.replace("  ", "").trim() != "") {
            await signInWithEmailAndPassword(auth, inputsValue.email, inputsValue.pass)
            .then(()=>{
                isLogueado(true);
            })
            .catch((e)=>{
                console.log(e.code);
                if (e.code == "auth/invalid-email") {
                    alert("Ingresa un correo valido.");
                } else if (e.code == "auth/user-not-found") {
                    alert("El correo ingresado no pertenece a ninguna cuenta.");
                } else if (e.code == "auth/wrong-password") {
                    alert("La contraseña es incorrecta.");
                } else if (e.code == "auth/too-many-requests") {
                    alert("Muchos intentos fallidos, vuelve a intentarlo mas tarde.");
                } else if (e.code == "auth/user-disabled") {
                    alert("Lo sentimos, Tu cuenta ha sido deshabilitada.");
                } else {
                    alert("Sucedio un error. Comprueba tu conexión a internet.");
                }
            });
        } else {
            alert("Rellena los campos faltantes.");
        }
    }

    return (
        <Flex h="100vh" justifyContent="center" alignItems="center" p="3%" flexDir="column">
            <Text fontWeight="bold" fontSize="3.6vh" mb="4vh">Iniciar sesión</Text>
            <form style={{width:"100%", display:"flex", flexDirection:"column", alignItems:"center"}}>
                <Flex w="20%" flexDir="column">
                    <Input onChange={(e)=>setInputsValue({...inputsValue, email:e.target.value})} type="email" outline="none" p="2%" placeholder="Email"/>
                    <Input onChange={(e)=>setInputsValue({...inputsValue, pass:e.target.value})} type="password" outline="none" p="2%" mt="2vh" placeholder="Contraseña"/>
                </Flex>
                <Button type="submit" onClick={(e)=>iniciarSesion(e)} p="0.5%" cursor="pointer" border="none" outline="none" mt="4vh" w="20%">Entrar</Button> 
            </form>
        </Flex>
    )
}