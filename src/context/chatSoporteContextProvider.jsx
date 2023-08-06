import { onChildChanged, ref } from "firebase/database";
import { createContext, useEffect, useRef, useState } from "react";
import { dbRealtime } from "../utils/fbConfig";
import { Flex, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export const chatSoporteContext = createContext({
    chatSoporte:false,
    setChatSoporte:()=>{}
});

export default function ChatSoporteProvider ({isLogueado: isLogueadoProp, children}){

    const isLogueado = useRef(isLogueadoProp);

    const [chatSoporte, setChatSoporte] = useState(false);
    const [newNotificacion, setNewNotificacion] = useState(false);
    const newNotificacionProceso = useRef(false);

    const audio = useRef(new Audio(require("../assets/sonidoChatSoporte.mp3")));

    function tienenMenosDeDosMinutosDeDiferencia(unixFecha1, unixFecha2) {
        const diferenciaEnSegundos = Math.abs(unixFecha1 - unixFecha2);
        return diferenciaEnSegundos < 120;
      }

    function onMensajesSoporte (){
        onChildChanged(ref(dbRealtime, "users"), (data)=>{
            const chatSoporteNew = {...data.val(), uid:data.key};

            try {
                if (chatSoporteNew.chatSoporte !== false) {
                    const camposChatSoporte = Object.keys(chatSoporteNew.chatSoporte);
                    const msgNew = chatSoporteNew.chatSoporte[camposChatSoporte[camposChatSoporte.length-1]];

                    if (msgNew.rol !== "soporte" || !tienenMenosDeDosMinutosDeDiferencia(msgNew.fecha, new Date()/1000)) {
                        if (tienenMenosDeDosMinutosDeDiferencia(chatSoporteNew.ultimaActualizacion, new Date()/1000)) {
                            setChatSoporte(chatSoporteNew);
                            if (window.location.pathname !== "/chats") {
                                setNewNotificacion(true);
                            }
                            audio.current.play();
                        } else {
                            setChatSoporte({...chatSoporteNew, offNewMsg:true});
                        }
                    } else {
                        setChatSoporte(chatSoporteNew);
                    }
                }
                
                setTimeout(()=>{
                    setNewNotificacion(false);
                }, 3000);
            } catch (err) {
                console.log(err);
                alert("Para emitir el sonido de notificacion, primero debes interactuar con la pagina (Da un click en cualquier parte).");
            }

        }, (err)=>{
            console.log(err);
            alert("Sucedio un error, comprueba tu conexión a internet y si el error persiste, contacta al desarrollador.");
        });
    }

    if (isLogueado.current === true) {
        onMensajesSoporte();
        isLogueado.current = false;
    }

    return (
        <chatSoporteContext.Provider value={{chatSoporte, setChatSoporte}}>
            { newNotificacion && 
                <Link to="/chats">
                    <Flex minW="15vw" flexDir="column" boxShadow="0px 0px 5px 2px #8b8b8b" borderRadius="0.5vw" p="0.7vw" bg="#fff" position="absolute" zIndex={1} bottom="2vh" left="2vw">
                        <Flex alignItems="center">
                            <Text color="#000" fontWeight="bold">{chatSoporte.nombre}</Text>
                            <Flex ml="0.5vw" bg={chatSoporte.rol == "normal" ? "#ebaa33" : "#323dce"} borderRadius="10px" h="7px" w="7px" />
                        </Flex>
                        <Text color="#5f5f5f">{chatSoporte.chatSoporte !== false && chatSoporte.chatSoporte[Object.keys(chatSoporte.chatSoporte)[Object.keys(chatSoporte.chatSoporte).length-1]].mensaje}</Text>
                    </Flex>
                </Link>
            }

            {children}
        </chatSoporteContext.Provider>
    );
}