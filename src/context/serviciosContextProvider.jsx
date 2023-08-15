import { equalTo, onChildAdded, onChildChanged, orderByChild, query, ref } from "firebase/database";
import { createContext, useRef, useState } from "react";
import { auth, dbRealtime } from "../utils/fbConfig";
import { Flex, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export const chatSoporteAdminContext = createContext({
    servicios:false,
    setServicios:()=>{}
});

export default function ChatSoporteAdminProvider ({isLogueado:isLogueadoProp, children}){

    const isLogueado = useRef(isLogueadoProp);
    const [servicios, setServicios] = useState(false);
    const [newNotificacion, setNewNotificacion] = useState(false);

    const audio = useRef(new Audio(require("../assets/nuevoPedido.mp3")));

    function onServicios (){
        onChildAdded(ref(dbRealtime, "servicios"), onMsg, onErr);

        function onMsg (){
                try {
                   /*  audio.current.play();
                    setNewNotificacion(true);
                    setTimeout(()=>{
                        setNewNotificacion(false);
                    }, 3300); */
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
        onServicios();
        isLogueado.current = false;
    }

    return (
        <chatSoporteAdminContext.Provider value={{servicios, setServicios}}>
            { newNotificacion && 
                <Link to="/">
                    <Flex minW="15vw" flexDir="column" boxShadow="0px 0px 5px 2px #8b8b8b" borderRadius="0.5vw" p="0.7vw" bg="#fff" position="absolute" zIndex={1} bottom="2vh" left="2vw">
                        <Flex alignItems="center">
                            <Text color="#000" fontWeight="bold">Sistema</Text>
                        </Flex>
                        <Text color="#5f5f5f">Tienes un nuevo pedido</Text>
                    </Flex>
                </Link>
            }

            {children}
        </chatSoporteAdminContext.Provider>
    );
}