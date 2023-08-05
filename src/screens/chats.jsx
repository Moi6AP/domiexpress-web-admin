import { Button, Flex, Image, Input, InputGroup, InputRightElement, Spinner, Text } from "@chakra-ui/react";
import { endBefore, equalTo, get, limitToFirst, limitToLast, off, onChildAdded, onChildChanged, onValue, orderByChild, orderByKey, orderByPriority, orderByValue, query, ref, startAfter, startAt } from "firebase/database";
import { auth, dbRealtime } from "../utils/fbConfig";
import { useContext, useEffect, useRef, useState } from "react";
import { chatSoporteContext } from "../context/chatSoporteContextProvider";
import api from "../utils/api";


export default function Chats (){

    const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

    const { chatSoporte } = useContext(chatSoporteContext)

    const [chats, setChats] = useState(false);
    const [cargandoSendMsg, setCargandoSendMsg] = useState(false);
    const [cargando, setCargando] = useState(false);
    const [newUpdate, setNewUpdate] = useState(false);

    const [chatSelect, setChatSelect] = useState(false);

    const [chat, setChat] = useState(false);
    const scrollChatRef = useRef(null);

    const [msg, setMsg] = useState("");
    const msgPropio = useRef([true, true]);

    const inputSendMsgRef = useRef(null);

    const [buscarChatEmail, setBuscarChatEmail] = useState(false);
    const [chatEmail, setChatEmail] = useState(false);
    const [emailInput, setEmailInput] = useState("");

    const limiteChats = 15;
    const [cargoPagina, setCargoPagina] = useState(false)

    async function getData (){
        setCargando(true);
        onChildAdded(query(ref(dbRealtime, "users"), orderByChild("ultimaActualizacion"), limitToLast(limiteChats)), (data)=>{
            setCargando(false);

            if (data.exists()) {
                setChats(chats => [{...data.val(), uid:data.key}, ...(chats === false ? [] : chats)]);
            }
        }, (err)=>{

            setChats([]);
            alert("Sucedio un error, comprueba tu conexión a internet y si el error persiste, contacta al desarrollador.");
            setCargando(false);
        });
    }

    function setMoreData(){
        /* getDataMore(); */
    }

    function fechaMsg (fechaProp){
        const fecha = new Date(fechaProp*1000);
        let fechaResult = "";
        const hora = fecha.getHours().toLocaleString("es-ES");
        const minutos = fecha.getMinutes();
        fechaResult = (hora > 11 ? hora-12 > 0 ? hora-12 : 12 : hora > 0 ? hora : 12) +":"+minutos;

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
            return msg.rol == "soporte" ? msg.adminNombre == auth.currentUser.displayName ? "Tu: "+msg.mensaje : "Admin: "+msg.mensaje : msg.mensaje;
        }
    }

    async function buscarUserChat (e){
        e.preventDefault();
        setBuscarChatEmail(true);
        if (emailInput !== "" && !cargando) {
            setCargando(true);
            const res = await api("post", "/buscarUserChat", {search:emailInput});
            if (res.result[0]) {
                if (typeof res.result[1] !== "string") {
                    setChatEmail(res.result[1]);
                } else {
                    setChatEmail( res.result[1]);   
                }
            } else {
                setChatEmail(res.result[1]);
                /* alert(res.result[1]); */
            }
            setCargando(false);
        } else {
            setBuscarChatEmail(false);
        }
    }
    
    useEffect(()=>{
        getData();

      
    }, []);

    useEffect(()=>{
        if (chatSoporte !== false && cargoPagina) {
            let chatsNew = [...chats];
            
            try {
                if (!chatSoporte.offNewMsg) {
                    chatsNew.splice(chatsNew.findIndex(a => a.uid === chatSoporte.uid), 1);
                }
            } catch {
                
            }

            if (chatSoporte.offNewMsg) {
                const index = chatsNew.findIndex(a => a.uid === chatSoporte.uid);
                    if (index > -1) {
                        chatsNew[index] = chatSoporte;
                    } 
            } else {
                chatsNew = [chatSoporte, ...chatsNew];
            }

            setChats(chatsNew);

            if (chatSelect.uid === chatSoporte.uid) {
                selectChat(chatSoporte);
            }
        }
    }, [chatSoporte]);

    useEffect(()=>{
        if (chats !== false && !cargoPagina) {
            off(ref(dbRealtime, "users"), "child_added");
            setCargoPagina(true);
        }

        setTimeout(()=>{
            if (chats === false) {
                setChats(chatsNew => chatsNew !== false ? chatsNew : []);
                setCargando(false);
            }
        }, 2500);
    }, [chats]);

    return (
        <Flex w="100%">
            <Flex borderRight="1px solid #e4e4e4" pr="1%" mt="2vh" flexDir="column" width="25%">
                <Text ml="1vw" fontSize="3.5vh" fontWeight="800">Chats</Text>
                <Flex ml="auto" mb="0.5vh">
                    <Flex mr="1vw" alignItems="center">
                        <Flex mr="0.3vw" bg="#ebaa33" borderRadius="10px" h="7px" w="7px" />
                        <Text fontSize="1.7vh">Usuarios</Text>
                    </Flex>
                    <Flex alignItems="center">
                        <Flex mr="0.3vw" bg="#323dce" borderRadius="10px" h="7px" w="7px" />
                        <Text fontSize="1.8vh">Repartidores</Text>
                    </Flex>
                </Flex>
                <form style={{display:"flex", marginBottom:"1vh", height:"10%", alignItems:"center", width:"100%"}} >
                    <InputGroup>
                        <Input value={emailInput} onChange={(e)=>setEmailInput(e.target.value)} type="email" outline="none" _focus={{border:"1px solid #d8d8d8", boxShadow:"0px 0px 3px 1px #d8d8d8"}} w="100%" p="0.5vw" borderRadius="0.4vw" border="1px solid #b4b4b4" placeholder="Busca un usuario por ID, email.."/>
                        <InputRightElement display={buscarChatEmail ? "flex" :  "none"} onClick={()=>{setEmailInput(""); setBuscarChatEmail(false); chatEmail.uid == chatSelect.uid && setChatSelect(false) }} cursor="pointer" h="100%" pr="1%" alignItems="center">
                            <Image w="1.6vw" h="1.6vw" src={require("../assets/x.png")} />
                        </InputRightElement>
                    </InputGroup>
                    <Button onClick={(e)=>buscarUserChat(e)} type="submit" display="none" />
                </form>
                <Flex overflowY="scroll" h="100%" flexDir="column" >
                    { !cargando ? 
                        buscarChatEmail ?
                            Array.isArray(chatEmail) ?
                                chatEmail.map((chatSearch)=>(
                                    <Flex alignItems="center" bg={chatSelect.uid === chatSearch.uid ? "#eeeeee" : "transparent"} key={chatSearch.uid} onClick={()=>{setChat(false); selectChat(chatSearch); setChatSelect(chatSearch)}} mb="2vh" cursor="pointer" _hover={{backgroundColor:"#f8f8f8"}} borderRadius="0.6vw" p="2%">
                                        {chatSearch.imagenPerfil ? 
                                            <Flex backgroundImage={require("../assets/user.png")} backgroundSize="contain" backgroundRepeat="no-repeat" borderRadius="2vw" mr="0.7vw" w="3vw" h="3vw">
                                                <Image borderRadius="2vw" w="3vw" h="3vw" src={chatSearch.imagenPerfil} /> 
                                            </Flex> 
                                            : 
                                            <Image src={require("../assets/user.png")} borderRadius="2vw" mr="0.7vw" w="3vw" h="3vw"/>
                                        }
                                        <Flex w="100%" flexDir="column">
                                            <Text color={chatSearch.delCuenta ? "#c43131" : "#000"} fontWeight="bold">{chatSearch.nombre.length > 21 ? chatSearch.nombre.slice(0, 21)+"..." : chatSearch.nombre}</Text>
                                            <Text fontWeight={!chatSearch.ultimaActualizacion && "bold"} fontSize="2.2vh" color={chatSearch.delCuenta ? "#c43131" : chatSearch.bold ? "#000" : "#666666"}>{chatSearch.ultimaActualizacion ? getUltimoMsg(chatSearch.chatSoporte).length > 25 ? getUltimoMsg(chatSearch.chatSoporte).slice(0, 25)+"..." : getUltimoMsg(chatSearch.chatSoporte) : "Sin mensajes"}</Text>
                                            <Flex alignItems="center">
                                                <Flex bg={chatSearch.delCuenta ? "#c43131" : chatSearch.rol == "normal" ? "#ebaa33" : "#323dce"} borderRadius="10px" h="7px" w="7px" />
                                                <Text ml="auto" mr="2%" fontSize="1.8vh" color="#868686">{chatSearch.ultimaActualizacion ? fechaMsg(chatSearch.ultimaActualizacion) : "-"}</Text>
                                            </Flex>
                                        </Flex>
                                    </Flex>
                                ))
                                : <Text color="#616161">{ chatEmail === "no-existe" ? "No se encontraron resultados." : chatEmail}</Text>
                        : (chats.length > 0) ? 
                            chats.map((user)=>(
                                <Flex alignItems="center" bg={chatSelect.uid == user.uid ? "#eeeeee" : "transparent"} key={user.uid} onClick={()=>{ setTimeout(()=>inputSendMsgRef.current.focus(), 50); setChat(false); selectChat(user); setChatSelect(user)}} mb="2vh" cursor="pointer" _hover={{backgroundColor:"#f8f8f8"}} borderRadius="0.6vw" p="2%">
                                    {user.imagenPerfil ? 
                                        <Flex backgroundImage={require("../assets/user.png")} backgroundSize="contain" backgroundRepeat="no-repeat" borderRadius="2vw" mr="0.7vw" w="3vw" h="3vw">
                                            <Image borderRadius="2vw" w="3vw" h="3vw" src={user.imagenPerfil} /> 
                                        </Flex> 
                                        : 
                                        <Image src={require("../assets/user.png")} borderRadius="2vw" mr="0.7vw" w="3vw" h="3vw"/>
                                    }
                                    <Flex w="100%" flexDir="column">
                                        <Text color={user.delCuenta ? "#c43131" : "#000"} fontWeight="bold">{user.nombre.length > 21 ? user.nombre.slice(0, 21)+"..." : user.nombre}</Text>
                                        <Text fontWeight={!user.ultimaActualizacion ? "bold" : user.bold ? "900" : "normal"} fontSize="2.2vh" color={user.delCuenta ? "#c43131" : user.bold ? "#000" : "#666666"}>{user.ultimaActualizacion ? getUltimoMsg(user.chatSoporte).length > 25 ? getUltimoMsg(user.chatSoporte).slice(0, 25)+"..." : getUltimoMsg(user.chatSoporte) : "Sin mensajes"}</Text>
                                        <Flex alignItems="center">
                                            <Flex bg={user.delCuenta ? "#c43131" : user.rol == "normal" ? "#ebaa33" : "#323dce"} borderRadius="10px" h="7px" w="7px" />
                                            <Text ml="auto" mr="2%" fontSize="1.8vh" color="#868686">{user.ultimaActualizacion ? fechaMsg(user.ultimaActualizacion) : "-"}</Text>
                                        </Flex>
                                    </Flex>
                                </Flex>
                            ))
                            : <Text color="#616161">No tienes chats :)</Text>
                        : <Spinner mx="auto" color="#646464" mt="1vh" w="1vw" h="1vw" /> }
                </Flex>
                {/* <Text onClick={setMoreData}>Ver mas</Text> */}
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
                            <Text color={chatSelect.delCuenta ? "#c43131" : "#000"} fontWeight="bold">{chatSelect.nombre}</Text>
                        </Flex>
                        <Flex scrollBehavior="smooth" ref={scrollChatRef} py="1%" overflowY="scroll" flexDir="column" h="100%">
                            {chat !== false && chat.map((msg)=>(
                                <Flex key={msg.mensaje+msg.fecha} my="0.5%" p="1%" pb="0.3%" borderRadius="0.5vw" borderBottomRightRadius={msg.rol == "soporte" ? "0" : "0.5vw"} borderTopLeftRadius={msg.rol == "soporte" ? "0.5vw" : "0"} bg={msg.rol == "soporte" ? msg.adminNombre == auth.currentUser.displayName ? "#48ca68" : "#9c12d3" : "#666666"} minW="20%" maxW="70%" flexDir="column" mr={msg.rol == "soporte" ? "2%" : "auto"} ml={msg.rol == "soporte" ? "auto" : "2%"}>
                                    {(msg.rol == "soporte" && msg.adminNombre !== auth.currentUser.displayName) && <Text ml="auto" mr="2%" fontSize="1.8vh" color="#f1f1f1">{msg.adminNombre}</Text>}
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
                                <Input ref={inputSendMsgRef} opacity={cargandoSendMsg ? 0.3 : 1} disabled={cargandoSendMsg} value={msg} onChange={(e)=>setMsg(e.target.value)} _placeholder={{color:"#333333"}} bg="#dadada" outline="none" w="100%" p="0.5vw" borderRadius="0.4vw" border="none" placeholder="Escribe un mensaje.."/>
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