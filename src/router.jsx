import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { Box, Flex, Image, Spinner, Text } from "@chakra-ui/react";
import { useEffect, useState } from 'react';
import { auth } from './utils/fbConfig';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import Navbar from "./components/navbar";
import Repartidores from "./screens/repartidores";
import General from "./screens/general";
import Usuarios from "./screens/usuarios";
import Chats from "./screens/chats";
import IniciarSesion from "./screens/iniciarSesion";
import IfAuthFalseRedirigir from './components/IfAuthFalseRedirigir';

export default function App (){

    const [userSession, setUserSession] = useState(undefined);
    const [isLogueado, setIsLogueado] = useState(false);

    useEffect(()=>{
        const unsuscribe = onAuthStateChanged(auth, (user)=>{
            if (user) {
                setUserSession(true);
            } else {
                setUserSession(false);
            }
        });
        unsuscribe();
        
        /* signInWithEmailAndPassword(auth, "admin@domiexpress.admin", "config-ñ77@"); */

    }, [isLogueado]);

    if (userSession === undefined) {
        return (
            <Flex flexDir="column" alignItems="center" justifyContent="center" position="absolute" width="100%" height="100%" left="0" top="0">
                <Image width="9vw" src={require("./assets/logo.png")} />
                <Spinner mt="3vh" width="1.5vw" height="1.5vw"/>
            </Flex>
        )
    }

    return (
        <BrowserRouter>
            <IfAuthFalseRedirigir userSession={userSession} />
            { userSession && <Navbar logout={setUserSession} />}
            { userSession ?
                <Flex h="100vh" ml="15vw" bg="#313131">
                    <Flex p="2vh" w="100%" borderRadius="1vh" m="0.7vw" bg="#fff">
                        <Routes>
                            <Route path="/" element={<General/>} />
                            <Route path="/repartidores" element={<Repartidores/>} />
                            <Route path="/usuarios" element={<Usuarios/>} />
                            <Route path="/chats" element={<Chats/>} />
                        </Routes>
                    </Flex>
                </Flex>
                :
                <Routes>
                    <Route path="/" element={<IniciarSesion/>} />
                </Routes>
            }
        </BrowserRouter>
    )
}