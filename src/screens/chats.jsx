import { Button, Flex, Image, Input, InputGroup, InputRightElement, Spinner, Text } from "@chakra-ui/react";
import { endBefore, get, limitToFirst, limitToLast, off, onChildAdded, onChildChanged, onValue, orderByChild, orderByKey, orderByPriority, orderByValue, query, ref, startAfter, startAt } from "firebase/database";
import { dbRealtime } from "../utils/fbConfig";
import { useEffect, useRef, useState } from "react";
import api from "../utils/api";


export default function Chats (){

    const meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

    const [chats, setChats] = useState([]);
    const [cargandoSendMsg, setCargandoSendMsg] = useState(false);
    const [cargando, setCargando] = useState(true);
    const [newUpdate, setNewUpdate] = useState(false);

    const [chatSelect, setChatSelect] = useState(false);

    const [chat, setChat] = useState(false);
    const scrollChatRef = useRef(null);

    const [msg, setMsg] = useState("");
    const msgPropio = useRef([true, true]);
    const audio = useRef(new Audio(require("../assets/sonidoChatSoporte.mp3")));

    const ultimoElemento = useRef(false);
    const unsuscribe = useRef(false);

    async function getData (){
        setCargando(true);
        onChildAdded(query(ref(dbRealtime, "users"), orderByChild("ultimaActualizacion"), limitToLast(2)), (data)=>{
            setCargando(false);

            console.log("AAEEE");

            if (data.exists()) {
                setChats(chats => [{...data.val(), uid:data.key}, ...chats]);
                ultimoElemento.current = 2;
            }
        }, (err)=>{
            setCargando(false);
        });
        
    }

    async function getDataMore (){
        if (ultimoElemento.current !== false) {
            setCargando(true);
            const suscribe = await get(query(ref(dbRealtime, "users")), 
            (data)=>{
                console.log("Porfinn AAA");
                console.log(data.val());
                setCargando(false);

                if (data.exists()) {
                    /* setChats(chats => [...chats, {...data.val(), uid:data.key}]); */
                    /* ultimoElemento.current = ultimoElemento.current !== false ? ultimoElemento.current+2 : false; */
                }
            }, (e)=>console.log(e))
            .then((data)=>{
                console.log("Porfinn AAA");
                console.log(data.val());
                setCargando(false);
            });
            
            /* unsuscribe.current = suscribe; */
        }
        
    }

    useEffect(()=>{
        /* console.log(unsuscribe.current+" <-- unsuscribe");
        if (unsuscribe.current !== false && cargando === false) {
            off(unsuscribe.current);
        } */
    }, [cargando]);

    function setMoreData(){
        getDataMore();
    }

    function fechaMsg (fechaProp){
        const fecha = new Date(fechaProp*1000);
        let fechaResult = "";
        const hora = fecha.getHours().toLocaleString("es-ES");
        const minutos = fecha.getMinutes();
        fechaResult = (hora > 11 ? hora-12 : hora > 0 ? hora : 12) +":"+minutos;

        fechaResult = fechaResult.split(":");
        if (fechaResult[1].length == 1) {
            fechaResult = fechaResult[0]+":"+"0"+fechaResult[1].charAt(0);
        } else {
            fechaResult = fechaResult[0]+":"+fechaResult[1];
        }

        let nocheODia = hora > 11 ? "p.m." : "a.m.";
        fechaResult = `${fecha.getDate()} de ${meses[fecha.getMonth()]} ${fecha.getFullYear()},  ${fechaResult} ${nocheODia}`;

        return fechaResult;
    }

    function selectChat (chatUserSelect){
        if (chatUserSelect.chatSoporte !== false) {
            const chat = [];
            Object.keys(chatUserSelect.chatSoporte).map((msg)=>{
                chat.push(chatUserSelect.chatSoporte[msg]);
            });
            setChat(chat);

            setTimeout(()=>{
                scrollChatRef.current.scrollTop = scrollChatRef.current.scrollHeight;
                
            }, 50)
        }
    }

    async function enviarMsg (e){
        e.preventDefault();
        setCargandoSendMsg(true);
        if (!cargandoSendMsg) {
            msgPropio.current = [false, true];
            const res = await api("post", "/mandarMensajeSoporte", {mensaje:msg, usuarioID:chatSelect.uid}, true);
            if (res.result[0]) {
                setMsg("");
            }
        }
        setCargandoSendMsg(false);
    }

    function getUltimoMsg (chat){
        if (chat !== false) {
            const msg = chat[Object.keys(chat)[Object.keys(chat).length-1]];
            return msg.rol == "soporte" ? "Tu: "+msg.mensaje : msg.mensaje;
        }
    }

    
    useEffect(()=>{
        getData();

        onChildChanged(query(ref(dbRealtime, "users"), orderByChild("ultimaActualizacion")), (data)=>{
            setNewUpdate({...data.val(), uid:data.key});
        }, (err)=>{

        });
    }, []);

    useEffect(()=>{
        if (newUpdate !== false) {
            let chatsNew = [...chats];
            
            try {
                chatsNew.splice(chatsNew.findIndex(a => a.uid === newUpdate.uid), 1);
            } catch {
                
            }

            chatsNew = [newUpdate, ...chatsNew];

            if (msgPropio.current[1] && msgPropio.current[0]) {
                try {
                    if (Object.keys(newUpdate.chatSoporte).length !== Object.keys(chats[chats.findIndex(a => a.uid == newUpdate.uid)].chatSoporte).length) {
                        audio.current.play();
                    }
                } catch (err) {
                    alert("Para emitir el sonido de notificacion, primero debes interactuar con la pagina (Da un click en cualquier parte).");
                }
            }

            if (!msgPropio.current[0] && !msgPropio.current[1]) {
                msgPropio.current = [true, true];
            }
            if (!msgPropio.current[0]) {
                msgPropio.current[1] = false;
            }

            setChats(chatsNew);

            if (chatSelect.uid === newUpdate.uid) {
                selectChat(newUpdate);
            }
        }
    }, [newUpdate]);

    return (
        <Flex w="100%">
            <Flex borderRight="1px solid #e4e4e4" pr="1%" mt="2vh" flexDir="column" width="25%">
                <Text ml="1vw" fontSize="3.5vh" fontWeight="800">Chats</Text>
                <form style={{display:"flex", marginBottom:"1vh", height:"10%", alignItems:"center", width:"100%"}} >
                    <InputGroup>
                        <Input type="email" outline="none" _focus={{border:"1px solid #d8d8d8", boxShadow:"0px 0px 3px 1px #d8d8d8"}} w="100%" p="0.5vw" borderRadius="0.4vw" border="1px solid #b4b4b4" placeholder="Busca un usuario por email.."/>
                        <InputRightElement>

                        </InputRightElement>
                    </InputGroup>
                </form>
                <Flex overflowY="scroll" h="100%" flexDir="column" >
                    { !cargando ? chats.map((user)=>(
                        <Flex alignItems="center" bg={chatSelect.uid == user.uid ? "#eeeeee" : "transparent"} key={user.uid} onClick={()=>{setChat(false); selectChat(user); setChatSelect(user)}} mb="2vh" cursor="pointer" _hover={{backgroundColor:"#f8f8f8"}} borderRadius="0.6vw" p="2%">
                            {user.imagenPerfil ? 
                                <Flex backgroundImage={require("../assets/user.png")} backgroundSize="contain" backgroundRepeat="no-repeat" borderRadius="2vw" mr="0.7vw" w="3vw" h="3vw">
                                    <Image borderRadius="2vw" w="3vw" h="3vw" src={user.imagenPerfil} /> 
                                </Flex> 
                                : 
                                <Image src={require("../assets/user.png")} borderRadius="2vw" mr="0.7vw" w="3vw" h="3vw"/>
                            }
                            <Flex w="100%" flexDir="column">
                                <Text fontWeight="bold">{user.nombre.length > 21 ? user.nombre.slice(0, 21)+"..." : user.nombre}</Text>
                                <Text fontWeight={!user.ultimaActualizacion && "bold"} fontSize="2.2vh" color="#666666">{user.ultimaActualizacion ? getUltimoMsg(user.chatSoporte).length > 25 ? getUltimoMsg(user.chatSoporte).slice(0, 25)+"..." : getUltimoMsg(user.chatSoporte) : "Sin mensajes"}</Text>
                                <Flex alignItems="center">
                                    <Flex bg={user.rol == "normal" ? "#ebaa33" : "#323dce"} borderRadius="10px" h="7px" w="7px" />
                                    <Text ml="auto" mr="2%" fontSize="1.8vh" color="#868686">{user.ultimaActualizacion ? fechaMsg(user.ultimaActualizacion) : "-"}</Text>
                                </Flex>
                            </Flex>
                        </Flex>
                    )) : <Spinner mx="auto" color="#646464" mt="1vh" w="1vw" h="1vw" /> }
                </Flex>
                <Text onClick={setMoreData}>Ver mas</Text>
            </Flex>
            { chatSelect !== false ?
                    <Flex flexDir="column" h="100%" w="75%">
                        <Flex mt="1%" boxShadow="0px 2px 4px 1px #f0f0f0" alignItems="center" p="1%">
                            {chatSelect.imagenPerfil ? 
                                <Flex backgroundImage={require("../assets/user.png")} backgroundSize="contain" backgroundRepeat="no-repeat" borderRadius="2vw" mr="0.7vw" w="3vw" h="3vw">
                                    <Image borderRadius="2vw" w="3vw" h="3vw" src={chatSelect.imagenPerfil} /> 
                                </Flex> 
                                : 
                                <Image src={require("../assets/user.png")} borderRadius="2vw" mr="0.7vw" w="3vw" h="3vw"/>
                            }
                            <Text fontWeight="bold">{chatSelect.nombre}</Text>
                        </Flex>
                        <Flex scrollBehavior="smooth" ref={scrollChatRef} py="1%" overflowY="scroll" flexDir="column" h="100%">
                            {chat !== false && chat.map((msg)=>(
                                <Flex key={msg.mensaje+msg.fecha} my="0.5%" p="1%" pb="0.3%" borderRadius="0.5vw" borderBottomRightRadius="0" bg={msg.rol == "soporte" ? "#48ca68" : "#666666"} minW="20%" maxW="70%" flexDir="column" mr={msg.rol == "soporte" ? "2%" : "auto"} ml={msg.rol == "soporte" ? "auto" : "2%"}>
                                    <Text color="#fff">{msg.mensaje}</Text>
                                    <Text ml="auto" mr="2%" fontSize="1.8vh" color="#f1f1f1">{fechaMsg(msg.fecha)}</Text>
                                </Flex>
                            ))}
                        </Flex>
                        <Flex alignItems="center" p="1%">
                            <Flex borderRadius="0.2vw" cursor="pointer" _hover={{outline:"1px solid #d4d4d4"}} mr="1%">
                                <Image w="2vw" h="2vw" src={require("../assets/image.png")} />
                            </Flex>
                            <form style={{width:"90%"}}>
                                <Input opacity={cargandoSendMsg ? 0.3 : 1} disabled={cargandoSendMsg} value={msg} onChange={(e)=>setMsg(e.target.value)} _placeholder={{color:"#333333"}} bg="#dadada" outline="none" w="100%" p="0.5vw" borderRadius="0.4vw" border="none" placeholder="Escribe un mensaje.."/>
                                <Button display="none" type="submit" onClick={(e)=>enviarMsg(e)} />
                            </form>
                        </Flex>
                    </Flex> 
                :
                    <Flex h="100%" w="73%" p="2%">
                        <Text m="auto" fontWeight="bold">Selecciona un chat.</Text>
                    </Flex>
            }
        </Flex>
    )
}