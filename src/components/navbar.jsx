import { Flex, Image, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cargando from "./cargando";

import { signOut } from "firebase/auth";
import { auth, dbRealtime } from "../utils/fbConfig";
import { off, ref } from "firebase/database";

/* 56d675 */

export default function Navbar ({logout}){

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false); 
    const path = window.location.pathname;

    async function cerrarSesion(){
        setLoading(true); 
        off(ref(dbRealtime, "users"));
        off(ref(dbRealtime, "chatsAdmin"));
        await signOut(auth)
        .then(()=>{
            logout(false);
            navigate("/");
        }); 
        setLoading(false)
    }

    return (
        <Flex pt="2vh" flexDir="column" bg="#313131" alignItems="center" position="fixed" width="15vw" height="100%" left="0" top="0">
            <Cargando isOpen={loading} txt="Cerrando sesión.." />
            <Image my="3vh" width="45%" src={require("../assets/logo1.png")} />
            <Flex alignItems="center" bg={path == "/" && "rgba(86, 214, 117, 0.25)"} borderRadius="0.4vw" mb="2vh" color="#fff" onClick={()=>navigate("/")} cursor="pointer" transition="all 0.25s" w="80%" _hover={{backgroundColor:"rgba(86, 214, 117, 0.7)", color:"#fff"}} padding="2.5vh" pl="2vw" >
                <span style={{width:"2vw"}} className="material-symbols-outlined">dashboard</span>
                <Text ml="0.4vw">General</Text>
            </Flex>
            <Flex alignItems="center" borderRadius="0.4vw" bg={path == "/repartidores" && "rgba(86, 214, 117, 0.25)"} mb="2vh"  color="#fff" onClick={()=>navigate("/repartidores")} cursor="pointer" transition="all 0.25s" w="80%" _hover={{backgroundColor:"rgba(86, 214, 117, 0.7)", color:"#fff"}} padding="2.5vh" pl="2vw" >
                <span style={{width:"2vw"}} className="material-symbols-outlined">sports_motorsports</span>
                <Text ml="0.4vw">Repartidores</Text>
            </Flex>
            <Flex alignItems="center" borderRadius="0.4vw" bg={path == "/usuarios" && "rgba(86, 214, 117, 0.25)"} mb="2vh" color="#fff" onClick={()=>navigate("/usuarios")} cursor="pointer" transition="all 0.25s" w="80%" _hover={{backgroundColor:"rgba(86, 214, 117, 0.7)", color:"#fff"}} padding="2.5vh" pl="2vw">
                <span style={{width:"2vw"}} className="material-symbols-outlined">group</span>
                <Text ml="0.4vw">Usuarios</Text>
            </Flex>
            <Flex alignItems="center" borderRadius="0.4vw" bg={path == "/chats" && "rgba(86, 214, 117, 0.25)"} color="#fff" mb="2vh" onClick={()=>navigate("/chats")} cursor="pointer" transition="all 0.25s" w="80%" _hover={{backgroundColor:"rgba(86, 214, 117, 0.7)", color:"#fff"}} padding="2.5vh" pl="2vw">
                <span style={{width:"2vw"}} className="material-symbols-outlined">forum</span>
                <Text ml="0.4vw">Chats</Text>
            </Flex>
            <Flex alignItems="center" borderRadius="0.4vw" bg={path == "/chatsAdmin" && "rgba(86, 214, 117, 0.25)"} color="#fff" mb="2vh" onClick={()=>navigate("/chatsAdmin")} cursor="pointer" transition="all 0.25s" w="80%" _hover={{backgroundColor:"rgba(86, 214, 117, 0.7)", color:"#fff"}} padding="2.5vh" pl="2vw">
                <span style={{width:"2vw"}} className="material-symbols-outlined">forum</span>
                <Text ml="0.3vw" fontSize="2.2vh">Chats Admin</Text>
            </Flex>

            <Flex borderRadius="0.4vw" color="#fff" onClick={()=>{ const confirm1 = window.confirm("¿Estas seguro que quieres cerrar sesión?"); confirm1 && cerrarSesion() }} cursor="pointer" transition="all 0.25s" w="90%" _hover={{backgroundColor:"rgba(86, 214, 117, 0.7)", color:"#fff"}} padding="2.5vh" pl="2vw">
                <span style={{width:"2vw", transform:"rotate(180deg)"}} className="material-symbols-outlined">logout</span>
                <Text ml="0.4vw">Cerrar sesión</Text>
            </Flex>
        </Flex> 
    )
}