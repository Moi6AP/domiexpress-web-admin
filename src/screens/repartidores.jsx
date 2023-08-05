import { Box, Button, Flex, Input, Spinner, Text } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import api from "../utils/api";
import { getFecha } from "../utils/funciones";
import Modal from "../components/modal";
import Cargando from "../components/cargando";
import { useNavigate } from "react-router-dom";

export default function Repartidores (){

    const navigate = useNavigate();

    const [repartidores, setRepartidores] = useState(undefined);
    const [ultimoElemento, setUltimoElemento] = useState(false);

    const [solicitudes, setSolicitudes] = useState(undefined);
    const [ultimoElementoSolicitudes, setUltimoElementoSolicitudes] = useState(false);

    const [loadData, setLoadData] = useState(false);
    const [loading, setLoading] = useState(false);

    const [modalVerDocumentos, setModalVerDocumentos] = useState(false);

    const [modalAddUser, setModalAddUser] = useState(false);

    const inputsAddUser = useRef({nombre:"", email:"", pass:""});
    
    async function getRepartidores (){
        setLoadData(true);
        const res = await api("post", "/getUsers", {ultimoElemento: ultimoElemento !== false ? ultimoElemento : undefined, rol:"conductor"})
        setLoadData(false);
        if (res.result[0]) {
            setUltimoElemento(res.result[2]);
            setRepartidores( repartidores == undefined ? res.result[1] : [...repartidores, ...res.result[1]]);
        } else {
            alert(res.result[1]);
        }
    }

    async function getSolicitudes (){
        setLoadData(true);
        const res = await api("post", "/getSolicitudesVerificacion", {ultimoElemento: ultimoElementoSolicitudes !== false ? ultimoElementoSolicitudes : undefined})
        setLoadData(false);
        if (res.result[0]) {
            setUltimoElementoSolicitudes(res.result[2]);
            setSolicitudes( solicitudes == undefined ? res.result[1] : [...solicitudes, ...res.result[1]]);
        } else {
            alert(res.result[1]);
        }
    }

    async function aceptarORechazarSolicitud (tipo, uid){
        const data = {repartidorUID:uid, accept:tipo};

        if (tipo === false){
            const motivo = prompt("Ingresa el motivo del rechazo de la solicitud.");
            if (motivo?.length > 0) {
                data.motivo = motivo;
                const confirmacion = window.confirm(`¿Estas seguro de rechazar esta solicitud?`);
                if (confirmacion) {
                    await sendSolicitud();
                }
            }
        } else {
            const confirmacion = window.confirm(`¿Estas seguro de aceptar esta solicitud?`);
            if (confirmacion) {
                await sendSolicitud();
            }
        }

        async function sendSolicitud (){
            const res = await api("post", "/aceptarRepartidorSolicitud", data);
            if (res.result[0]) {
                alert("Respuesta de solicitud de verificación enviada correctamente!");
                const solicitudesNew = {...solicitudes};
                solicitudesNew.splice(solicitudesNew.findIndex(e => e.uid == uid), 1);
                setSolicitudes(solicitudesNew);
            } else {
                alert(res.result[1]);
            }
        }
    }

    async function addUser (e){

    }

     useEffect(()=>{
        getSolicitudes();
        getRepartidores();
     }, []);

    return (
        <Box overflowX="hidden" overflowY="scroll" height="100%" width="82vw" p="2vh">
            <Modal isOpen={modalVerDocumentos} onClose={()=>setModalVerDocumentos(false)}>

            </Modal>

            <Modal isOpen={modalAddUser} onClose={()=>setModalAddUser(false)}>
                <form style={{display:"flex", alignItems:"center", width:"30vw", padding:"5%", flexDirection:"column"}}>
                    <Text fontWeight="bold" fontSize="3vh">Añadir usuario</Text>
                    <Flex mt="4%" alignItems="center" w="100%" flexDir="column">
                       <Input onChange={(e)=>inputsAddUser.current.nombre = e.target.value} w="70%" borderRadius="4px" outline="none" borderWidth="1px" borderColor="#b4b4b4" p="1%" mb="3%" placeholder="Nombre" /> 
                       <Input onChange={(e)=>inputsAddUser.current.email = e.target.value} w="70%" borderRadius="4px" outline="none" borderWidth="1px" borderColor="#b4b4b4" p="1%" mb="3%" placeholder="Correo electronico" /> 
                       <Input onChange={(e)=>inputsAddUser.current.pass = e.target.value} w="70%" borderRadius="4px" outline="none" borderWidth="1px" borderColor="#b4b4b4" p="1%" mb="3%" placeholder="Contraseña" /> 
                    </Flex>
                    <Button cursor="pointer" _hover={{backgroundColor:"#38C95B"}} transition="all 0.2s" color="#fff" bg="#56D675" fontWeight="bold" w="70%" p="2%" border="none" onClick={(e)=>addUser(e)} type="submit">Agregar usuario</Button>
                </form>
            </Modal>

            <Cargando isOpen={loading} txt={loading} />

            <Flex pb={ultimoElementoSolicitudes === false ? "2.4%" : "0" } borderRadius="0.5vw" width="80vw" p="1.2vw" border="1px solid #E8E8E8" flexDir="column" mt="4vh">
                <Flex alignItems="center" justifyContent="flex-start">
                    <Text ml="1vw" fontSize="3.5vh" fontWeight="800">Solicitudes de Verificación</Text>
                </Flex>
                {   solicitudes === undefined ?
                        <Spinner ml="auto" mr="auto" color="#646464" my="2vh" w="1.2vw" h="1.2vw"/>
                    : solicitudes.length > 0 ?
                        <Flex border="1px solid #E8E8E8" flexDir="column" mt="2.5vh">
                            <Flex width="100%" >
                                <Flex p="1vh" justifyContent="center" w="25%" borderRight="1px solid #E8E8E8">
                                    <Text color="#666666" fontWeight="bold">Nombre</Text>
                                </Flex>
                                <Flex p="1vh" justifyContent="center" w="27%" borderRight="1px solid #E8E8E8">
                                    <Text color="#666666" fontWeight="bold">Correo electronico</Text>
                                </Flex>
                                <Flex p="1vh" justifyContent="center" w="18%" borderRight="1px solid #E8E8E8">
                                    <Text color="#666666" fontWeight="bold">Fecha de solicitud</Text>
                                </Flex>
                                <Flex p="1vh" justifyContent="center" w="15%" borderRight="1px solid #E8E8E8">
                                    <Text color="#666666" fontWeight="bold">Documentos</Text>
                                </Flex>
                                <Flex p="1vh" justifyContent="center" w="15%" borderRight="1px solid #E8E8E8">
                                    <Text color="#666666" fontWeight="bold">Aceptar/Rechazar</Text>
                                </Flex>
                            </Flex>
                           { solicitudes.map((solicitud)=>(
                                <Flex key={solicitud.uid} borderTop="1px solid #E8E8E8" width="100%">
                                    <Flex p="1vh" justifyContent="center" w="25%" borderRight="1px solid #E8E8E8">
                                        <Text>{solicitud.nombre}</Text>
                                    </Flex>
                                    <Flex p="1vh" justifyContent="center" w="27%" borderRight="1px solid #E8E8E8">
                                        <Text>{solicitud.email}</Text>
                                    </Flex>
                                    <Flex p="1vh" justifyContent="center" w="18%" borderRight="1px solid #E8E8E8">
                                        <Text>{getFecha(solicitud.timestamp["_seconds"])}</Text>
                                    </Flex>
                                    <Flex cursor="pointer" p="1vh" justifyContent="center" w="15%" borderRight="1px solid #E8E8E8">
                                        <Text textAlign="center" w="50%" bg="#E4E4E4" >Ver</Text>
                                    </Flex>
                                    <Flex p="1vh" justifyContent="center" w="15%" borderRight="1px solid #E8E8E8">
                                        <Text transition="background-color 0.2s" onClick={()=>aceptarORechazarSolicitud(true, solicitud.uid)} _hover={{backgroundColor:"#38C95B"}} bg="#56D675" py="1%" cursor="pointer" textAlign="center" color="#fff" borderRadius="10%" mr="7%" w="40%">Si</Text>
                                        <Text transition="background-color 0.2s" onClick={()=>aceptarORechazarSolicitud(false, solicitud.uid)} py="1%" cursor="pointer" textAlign="center" color="#fff" borderRadius="10%" _hover={{backgroundColor:"#CB2215"}} bg="#C24339" w="40%">No</Text>
                                    </Flex>
                                </Flex>
                           ))}
                        </Flex>
                    : <Flex m="1%" ><Text color="#616161">Sin solicitudes de verificación.</Text></Flex>
                }
                <Text display={ultimoElementoSolicitudes !== false ? "block" : "none"} cursor="pointer" mx="auto" fontSize="2.3vh" p="0.2%" my="1.2%" textAlign="center" borderRadius="5%" bg="#e6e6e6" w="10%" onClick={()=>{!loadData && getSolicitudes()}}>
                    { loadData ? <Spinner ml="auto" mr="auto" color="#646464" w="0.7vw" h="0.7vw"/> : "Ver mas"} 
                </Text>
            </Flex>

            <Flex pb={ultimoElemento === false ? "2.4%" : "0" } borderRadius="0.5vw" width="80vw" p="1.2vw" border="1px solid #E8E8E8" flexDir="column" mt="4vh">
                <Flex alignItems="center" justifyContent="space-between">
                    <Text ml="1vw" fontSize="3.5vh" fontWeight="800">Repartidores</Text>
                    <Button transition="all 0.2s" cursor="pointer" _hover={{backgroundColor:"#38C95B"}} mr="1.5vw" borderRadius="1vh" p="1.3vh" bg="#56D675" border="none" >
                        <Text fontWeight="bold" color="#fff">Agregar Repartidor</Text>
                    </Button>
                </Flex>
                {   repartidores === undefined ?
                        <Spinner ml="auto" mr="auto" color="#646464" my="2vh" w="1.2vw" h="1.2vw"/>
                    : repartidores.length > 0 ?
                        <Flex border="1px solid #E8E8E8" flexDir="column" mt="2.5vh">
                            <Flex width="100%" >
                                <Flex p="1vh" justifyContent="center" w="25%" borderRight="1px solid #E8E8E8">
                                    <Text color="#666666" fontWeight="bold">Nombre</Text>
                                </Flex>
                                <Flex p="1vh" justifyContent="center" w="25%" borderRight="1px solid #E8E8E8">
                                    <Text color="#666666" fontWeight="bold">Correo electronico</Text>
                                </Flex>
                                <Flex p="1vh" justifyContent="center" w="25%" borderRight="1px solid #E8E8E8">
                                    <Text color="#666666" fontWeight="bold">Pedidos Realizados</Text>
                                </Flex>
                                <Flex p="1vh" justifyContent="center" w="25%" borderRight="1px solid #E8E8E8">
                                    <Text color="#666666" fontWeight="bold">Ganancias</Text>
                                </Flex>
                                <Flex p="1vh" justifyContent="center" w="25%" borderRight="1px solid #E8E8E8">
                                    <Text color="#666666" fontWeight="bold">Vehiculo</Text>
                                </Flex>
                            </Flex>
                           { repartidores.map((repartidor)=>(
                                <Flex key={repartidor.uid} borderTop="1px solid #E8E8E8" width="100%">
                                    <Flex p="1vh" justifyContent="center" w="20%" borderRight="1px solid #E8E8E8">
                                        <Text color={repartidor.delCuenta ? "#c91212" : "#000"}>{repartidor.nombre}</Text>
                                    </Flex>
                                    <Flex p="1vh" justifyContent="center" w="20%" borderRight="1px solid #E8E8E8">
                                        <Text color={repartidor.delCuenta ? "#c91212" : "#000"}>{repartidor.email}</Text>
                                    </Flex>
                                    <Flex p="1vh" justifyContent="center" w="20%" borderRight="1px solid #E8E8E8">
                                        <Text color={repartidor.delCuenta ? "#c91212" : "#000"}>{repartidor.cantidadPedidosRealizados}</Text>
                                    </Flex>
                                    <Flex p="1vh" justifyContent="center" w="20%" borderRight="1px solid #E8E8E8">
                                        <Text color={repartidor.delCuenta ? "#c91212" : "#000"}>${repartidor.ganancias}</Text>
                                    </Flex>
                                    <Flex p="1vh" justifyContent="center" w="20%" borderRight="1px solid #E8E8E8">
                                        <Text color={repartidor.delCuenta ? "#c91212" : "#000"}>{repartidor.vehiculo}</Text>
                                    </Flex>
                                </Flex>
                           ))}
                        </Flex>
                    : <Flex m="1%" ><Text color="#616161">Sin repartidores.</Text></Flex>
                }
                <Text display={ultimoElemento !== false ? "block" : "none"} cursor="pointer" mx="auto" fontSize="2.3vh" p="0.2%" my="1.2%" textAlign="center" borderRadius="5%" bg="#e6e6e6" w="10%" onClick={()=>{!loadData && getRepartidores()}}>
                    { loadData ? <Spinner ml="auto" mr="auto" color="#646464" w="0.7vw" h="0.7vw"/> : "Ver mas"} 
                </Text>
            </Flex>
    </Box>
    )
}