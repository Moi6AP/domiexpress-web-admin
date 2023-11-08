import { equalTo, onChildChanged, orderByChild, query, ref } from "firebase/database";
import { createContext, useRef, useState } from "react";
import { auth, dbRealtime } from "../utils/fbConfig";
import { Flex, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export const chatSoporteAdminContext = createContext({
    chatSoporteAdmin:false,
    setChatSoporteAdmin:()=>{}
});

export default function ChatSoporteAdminProvider ({isLogueado: isLogueadoProp, children}){

    const isLogueado = useRef(isLogueadoProp);

    const [chatSoporteAdmin, setChatSoporteAdmin] = useState(false);
    const [newNotificacion, setNewNotificacion] = useState(false);
    const newNotificacionProceso = useRef(false);

    const audio = useRef(new Audio(require("../assets/sonidoChatSoporte.mp3")));

    function tienenMenosDeDosMinutosDeDiferencia(unixFecha1, unixFecha2) {
        const diferenciaEnSegundos = Math.abs(unixFecha1 - unixFecha2);
        return diferenciaEnSegundos < 120;
    }

    function uidOtroAdmin (chat, a){
        return chat.adminUID_1 == auth.currentUser.uid ? 2 : 1;
    }

    function onMensajesAdmin (){
        onChildChanged(query(ref(dbRealtime, "chatsAdmin"), orderByChild("adminUID_1"), equalTo(auth.currentUser.uid)), onMsg, onErr);

        onChildChanged(query(ref(dbRealtime, "chatsAdmin"), orderByChild("adminUID_2"), equalTo(auth.currentUser.uid)), onMsg, onErr);

        function onMsg (data){
            const chatSoporteAdminNew = {...data.val(), uid:data.key};

                try {
                    if (chatSoporteAdminNew.chatSoporteAdmin !== false) {
                        const camposChatSoporteAdmin = Object.keys(chatSoporteAdminNew.chatSoporte);
                        const msgNew = chatSoporteAdminNew.chatSoporte[camposChatSoporteAdmin[camposChatSoporteAdmin.length-1]];
    
                        if (msgNew.uid !== auth.currentUser.uid || !tienenMenosDeDosMinutosDeDiferencia(msgNew.fecha, new Date()/1000)) {
                            if (tienenMenosDeDosMinutosDeDiferencia(chatSoporteAdminNew.ultimaActualizacion, new Date()/1000)) {
                                setChatSoporteAdmin(chatSoporteAdminNew);
                                if (window.location.pathname !== "/chatsAdmin") {
                                    setNewNotificacion(true);
                                }
                                audio.current.play();
                            } else {
                                setChatSoporteAdmin({...chatSoporteAdminNew, offNewMsg:true});
                            }
                        } else {
                            setChatSoporteAdmin(chatSoporteAdminNew);
                        }
                    }
                    
                    setTimeout(()=>{
                        setNewNotificacion(false);
                    }, 3000);
                } catch (err) {
                    console.log(err);
                    alert("Para emitir el sonido de notificacion, primero debes interactuar con la pagina (Da un click en cualquier parte).");
                }
        }

        function onErr (err) {
            alert("Sucedio un error, comprueba tu conexión a internet y si el error persiste, contacta al desarrollador.");
        }
    }

    if (isLogueado.current === true) {
        onMensajesAdmin();
        isLogueado.current = false;
    }

    return (
        <chatSoporteAdminContext.Provider value={{chatSoporteAdmin, setChatSoporteAdmin}}>
            { newNotificacion && 
                <Link to="/chatsAdmin">
                    <Flex minW="15vw" flexDir="column" boxShadow="0px 0px 5px 2px #8b8b8b" borderRadius="0.5vw" p="0.7vw" bg="#fff" position="absolute" zIndex={1} bottom="2vh" left="2vw">
                        <Flex alignItems="center">
                            <Text color="#000" fontWeight="bold">{chatSoporteAdmin["adminNombre_"+uidOtroAdmin(chatSoporteAdmin)]}</Text>
                            <Text fontSize="2vh" ml="0.5vw" color="#c02828">Admin</Text>
                        </Flex>
                        <Text color="#5f5f5f">{chatSoporteAdmin.chatSoporte !== false && chatSoporteAdmin.chatSoporte[Object.keys(chatSoporteAdmin.chatSoporte)[Object.keys(chatSoporteAdmin.chatSoporte).length-1]].mensaje}</Text>
                    </Flex>
                </Link>
            }

            {children}
        </chatSoporteAdminContext.Provider>
    );
}