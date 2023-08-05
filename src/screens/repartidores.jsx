import { Box, Button, Flex, Input, Select, Spinner, Text } from "@chakra-ui/react";
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

    const inputsAddUser = useRef({nombre:"", email:"", pass:"", tipoDocumento:"", numeroDocumento:"", vehiculo:""});
    
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
        e.preventDefault();
        if (inputsAddUser.current.email !== "" && inputsAddUser.current.nombre !== "" && inputsAddUser.current.pass !== "" && inputsAddUser.current.tipoDocumento !== "" && inputsAddUser.current.numeroDocumento !== "" && inputsAddUser.current.vehiculo !== "") {
            const valEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,10}$/g;
            if (valEmail.test(inputsAddUser.current.email)) {
                if (inputsAddUser.current.pass.length > 5) {
                    setLoading("Creando usuario..");
                    const res = await api("post", "/addUserRepartidor", {...inputsAddUser.current, tipoDocumento:inputsAddUser.current.tipoDocumento == "1" ? "Cedula" : "Pasaporte", vehiculo:inputsAddUser.current.vehiculo == "1" ? "moto" : inputsAddUser.current.vehiculo == "2" ? "carro" : "bicicleta"});
                    setLoading(false);
                    if (res.result[0]) {
                        setModalAddUser(false);
                        navigate("/asd");
                        setTimeout(()=>{
                            navigate("/repartidores");
                        }, 40);
                    } else {
                        alert(res.result[1]);
                    }
                } else {
                    alert("La contraseña debe tener minimo 6 caracteres.");    
                }
            } else {
                alert("El correo ingresado no es valido.");
            }
        } else {
            alert("Rellena todos los campos.");
        }
    }

    async function delUser (id){
        const preguntaDel = window.confirm("¿Estas seguro de eliminar este usuario?");
        if (preguntaDel) {
            setLoading("Eliminando..");
            const res = await api("post", "/delUser", {delUserID: id});
            setLoading(false);

            if (res.result[0] == true) {
                const repartidoresNew = [...repartidores];
                repartidoresNew[repartidoresNew.findIndex(a => a.uid == id)].delCuenta = true;

                setRepartidores(repartidoresNew);
                alert("Usuario eliminado correctamente.");
            } else {
                alert(res.result[1]);
            }
        }
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

                       <select style={{width:"70%", padding:"1%", marginBottom:"3%"}} onChange={(e)=>inputsAddUser.current.tipoDocumento = e.target.value} defaultValue="0">
                            <option value="0" disabled >Tipo de documento</option>
                            <option value="1" >Cedula</option>
                            <option value="2" >Pasaporte</option>
                       </select>
                       <Input onChange={(e)=>inputsAddUser.current.numeroDocumento = e.target.value} w="70%" borderRadius="4px" outline="none" borderWidth="1px" borderColor="#b4b4b4" p="1%" mb="3%" placeholder="Numero documento" /> 

                       <select style={{width:"70%", padding:"1%", marginBottom:"7%"}} onChange={(e)=>inputsAddUser.current.vehiculo = e.target.value} defaultValue="0">
                            <option value="0" disabled >Vehiculo</option>
                            <option value="1" >Moto</option>
                            <option value="2" >Carro</option>
                            <option value="2" >Bicicleta</option>
                       </select>
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
                <Flex display={ultimoElementoSolicitudes !== false ? "block" : "none"} cursor="pointer" mx="auto" fontSize="2.3vh" p="0.2%" my="1.2%" textAlign="center" borderRadius="5%" bg="#e6e6e6" w="10%" onClick={()=>{!loadData && getSolicitudes()}}>
                    { loadData ? <Spinner ml="auto" mr="auto" color="#646464" w="0.7vw" h="0.7vw"/> : "Ver mas"} 
                </Flex>
            </Flex>

            <Flex pb={ultimoElemento === false ? "2.4%" : "0" } borderRadius="0.5vw" width="80vw" p="1.2vw" border="1px solid #E8E8E8" flexDir="column" mt="4vh">
                <Flex alignItems="center" justifyContent="space-between">
                    <Text ml="1vw" fontSize="3.5vh" fontWeight="800">Repartidores</Text>
                    <Button onClick={()=>setModalAddUser(true)} transition="all 0.2s" cursor="pointer" _hover={{backgroundColor:"#38C95B"}} mr="1.5vw" borderRadius="1vh" p="1.3vh" bg="#56D675" border="none" >
                        <Text fontWeight="bold" color="#fff">Agregar Repartidor</Text>
                    </Button>
                </Flex>
                {   repartidores === undefined ?
                        <Spinner ml="auto" mr="auto" color="#646464" my="2vh" w="1.2vw" h="1.2vw"/>
                    : repartidores.length > 0 ?
                        <Flex border="1px solid #E8E8E8" flexDir="column" mt="2.5vh">
                            <Flex width="100%" >
                                <Flex p="1vh" justifyContent="center" w="29%" borderRight="1px solid #E8E8E8">
                                    <Text color="#666666" fontWeight="bold">Nombre</Text>
                                </Flex>
                                <Flex p="1vh" justifyContent="center" w="25%" borderRight="1px solid #E8E8E8">
                                    <Text color="#666666" fontWeight="bold">Correo electronico</Text>
                                </Flex>
                                <Flex p="1vh" justifyContent="center" w="13%" borderRight="1px solid #E8E8E8">
                                    <Text color="#666666" fontWeight="bold">Cant. Pedidos</Text>
                                </Flex>
                                <Flex p="1vh" justifyContent="center" w="15%" borderRight="1px solid #E8E8E8">
                                    <Text color="#666666" fontWeight="bold">Ganancias</Text>
                                </Flex>
                                <Flex p="1vh" justifyContent="center" w="13%" borderRight="1px solid #E8E8E8">
                                    <Text color="#666666" fontWeight="bold">Vehiculo</Text>
                                </Flex>
                            </Flex>
                           { repartidores.map((repartidor)=>(
                                <Flex key={repartidor.uid} borderTop="1px solid #E8E8E8" width="100%">
                                    <Flex p="1vh" justifyContent="center" w="29%" borderRight="1px solid #E8E8E8">
                                        <Text color={repartidor.delCuenta ? "#c91212" : "#000"}>{repartidor.nombre}</Text>
                                    </Flex>
                                    <Flex p="1vh" justifyContent="center" w="25%" borderRight="1px solid #E8E8E8">
                                        <Text color={repartidor.delCuenta ? "#c91212" : "#000"}>{repartidor.email}</Text>
                                    </Flex>
                                    <Flex p="1vh" justifyContent="center" w="13%" borderRight="1px solid #E8E8E8">
                                        <Text color={repartidor.delCuenta ? "#c91212" : "#000"}>{repartidor.cantidadPedidosRealizados}</Text>
                                    </Flex>
                                    <Flex p="1vh" justifyContent="center" w="15%" borderRight="1px solid #E8E8E8">
                                        <Text color={repartidor.delCuenta ? "#c91212" : "#000"}>${repartidor.tusGanancias}</Text>
                                    </Flex>
                                    <Flex p="1vh" justifyContent="center" w="13%" borderRight="1px solid #E8E8E8">
                                        <Text color={repartidor.delCuenta ? "#c91212" : "#000"}>{repartidor.vehiculo}</Text>
                                    </Flex>
                                    <Flex display={repartidor.delCuenta ? "none" : "flex"} w="5%" justifyContent="center" alignItems="center" onClick={()=>delUser(repartidor.uid)} cursor="pointer">
                                        <Flex h="3.1vh" >
                                            <svg xmlns="http://www.w3.org/2000/svg" height="100%" viewBox="0 -960 960 960" width="100%">
                                                <path fill="#c71645" d="M256.478-105.869q-32.74 0-56.262-23.356-23.522-23.355-23.522-55.862v-560.391h-11q-16.706 0-28.158-11.502-11.451-11.501-11.451-28.283 0-16.781 11.451-28.107 11.452-11.326 28.158-11.326h173.262q0-16.957 11.451-28.566 11.452-11.609 28.158-11.609h202.87q16.636 0 28.405 11.769 11.769 11.77 11.769 28.406h172.697q16.706 0 28.158 11.501 11.451 11.502 11.451 28.283 0 16.782-11.451 28.108-11.452 11.326-28.158 11.326h-11v560.391q0 32.507-23.522 55.862-23.522 23.356-56.262 23.356H256.478Zm0-639.609v560.391h447.044v-560.391H256.478Zm103.174 444.391q0 14.29 10.197 24.406 10.198 10.116 24.609 10.116 14.412 0 24.607-10.116 10.196-10.116 10.196-24.406v-329.391q0-14.29-10.48-24.689-10.481-10.398-24.892-10.398t-24.324 10.398q-9.913 10.399-9.913 24.689v329.391Zm171.087 0q0 14.29 10.48 24.406 10.481 10.116 24.892 10.116t24.607-10.116q10.195-10.116 10.195-24.406v-329.391q0-14.29-10.311-24.689-10.312-10.398-24.892-10.398t-24.775 10.398q-10.196 10.399-10.196 24.689v329.391ZM256.478-745.478v560.391-560.391Z"/>
                                            </svg>
                                        </Flex>
                                    </Flex>
                                </Flex>
                           ))}
                        </Flex>
                    : <Flex m="1%" ><Text color="#616161">Sin repartidores.</Text></Flex>
                }
                <Flex display={ultimoElemento !== false ? "block" : "none"} cursor="pointer" mx="auto" fontSize="2.3vh" p="0.2%" my="1.2%" textAlign="center" borderRadius="5%" bg="#e6e6e6" w="10%" onClick={()=>{!loadData && getRepartidores()}}>
                    { loadData ? <Spinner ml="auto" mr="auto" color="#646464" w="0.7vw" h="0.7vw"/> : "Ver mas"} 
                </Flex>
            </Flex>
    </Box>
    )
}