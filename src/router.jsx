import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { Box, Flex, Image, Spinner, Text } from "@chakra-ui/react";
import { useEffect, useState } from 'react';
import { auth } from './utils/fbConfig';
import { onAuthStateChanged } from 'firebase/auth';
import Navbar from "./components/navbar";
import Repartidores from "./screens/repartidores";
import General from "./screens/general";
import Usuarios from "./screens/usuarios";
import Chats from "./screens/chats";
import ChatsAdmin from "./screens/chatsAdmin";
import IniciarSesion from "./screens/iniciarSesion";
import IfAuthFalseRedirigir from './components/IfAuthFalseRedirigir';
import api from './utils/api';
import ChatSoporteProvider from './context/chatSoporteContextProvider';
import ServiciosProvider from './context/serviciosContextProvider';
import ChatSoporteAdminProvider from './context/chatSoporteAdminContextProvider';

export default function App (){

    const [userSession, setUserSession] = useState(undefined);
    const [isLogueado, setIsLogueado] = useState(false);

    useEffect(()=>{
        const unsuscribe = onAuthStateChanged(auth, (user)=>{
            if (user) {
                setUserSession(true);
                api("post", "/setUltimoAccesoLogin");
            } else {
                setUserSession(false);
            }
        });
        unsuscribe();

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
            <ServiciosProvider isLogueado={userSession}>
                <ChatSoporteAdminProvider isLogueado={userSession}>
                    <ChatSoporteProvider isLogueado={userSession}>
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
                                        <Route path="/chatsAdmin" element={<ChatsAdmin/>} />
                                    </Routes>
                                </Flex>
                            </Flex>
                            :
                            <Routes>
                                <Route path="/" element={<IniciarSesion isLogueado={setUserSession} />} />
                            </Routes>
                        }
                    </ChatSoporteProvider>
                </ChatSoporteAdminProvider>
            </ServiciosProvider>
        </BrowserRouter>
    )
}