import { Box, Button, Flex, FormControl, Image, Input, InputGroup, InputRightElement, Select, Spinner, Text } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import api from "../utils/api";
import { getFecha } from "../utils/funciones";
import Cargando from "../components/cargando";
import Modal from "../components/modal";
import Servicios from "./general/servicios";
import { useNavigate } from "react-router-dom";

export default function General (){

    const navigate = useNavigate();

    const [infoGeneral, setInfoGeneral] = useState({usuarios:undefined, usersAdmin:undefined, repartidores:undefined, pedidosTotal:undefined, pedidosEnCurso:undefined});
    
    const [costoServicios, setCostoServicios] = useState(undefined);

    const [usersAdmin, setUsersAdmin] = useState(undefined);
    const [ultimoElementoUsersAdmin, setUltimoElementoUsersAdmin] = useState(false);


    const [loading, setLoading] = useState(false);
    const [loadData, setLoadData] = useState(false);
    const [modalAddUser, setModalAddUser] = useState(false);

    const inputsAddUser = useRef({nombre:"", email:"", pass:""});

    const [modalAddCosto, setModalAddCosto] = useState(false);
    const inputsAddCosto = useRef({desdeKM:"", hastaKM:"", costo:""});

    const [cargandoSearch, setCargandoSearch] = useState(false);
    const [searchUsers, setSearchUsers] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [isSearch, setIsSearch] = useState(false);


    // GET INFO API (FETCH)

    async function getUsersAdmin (){
        setLoadData(true);
        const res = await api("post", "/getUsersAdmin", {ultimoElemento: ultimoElementoUsersAdmin !== false ? ultimoElementoUsersAdmin : undefined})
        setLoadData(false);
        if (res.result[0]) {
            setUltimoElementoUsersAdmin(res.result[2]);
            setUsersAdmin( (usersAdmin == undefined) ? res.result[1] : [...usersAdmin, ...res.result[1]]);
        } else {
            alert(res.result[1]);
        }
    }

    async function getInfoGeneral (){
        const res = await api("post", "/getInfoGeneral", {});
        if (res.result[0]) {
            const data = res.result[1];
            setCostoServicios(data.costoServicios);
            setInfoGeneral({usuarios:data.cantidadUsersNormales, usuariosEliminados:data.cantidadUsersNormalesEliminados, usersAdmin:data.cantidadUsersAdmin, usersAdminEliminados:data.cantidadUsersAdminEliminados, repartidores:data.cantidadUsersRepartidores,  repartidoresEliminados:data.cantidadUsersRepartidoresEliminados, pedidosTotal:data.cantidadPedidosTotal, pedidosEnCurso:data.cantidadPedidosCurso});
        } else {
            alert(res.result[1]);
        }
    }

    async function buscarUser (e){
        e.preventDefault();
        setIsSearch(true);
        if (searchInput !== "" && !cargandoSearch) {
            setCargandoSearch(true);
            const res = await api("post", "/buscarUser", {search:searchInput, rol:"admin"});
            if (res.result[0]) {
                if (typeof res.result[1] !== "string") {
                    console.log(res.result[1]);
                    setSearchUsers(res.result[1]);
                } else {
                    setSearchUsers( res.result[1]);   
                }
            } else {
                setSearchUsers(res.result[1]);
            }
            setCargandoSearch(false);
        } else {
            setIsSearch(false);
        }
    }

    // CRUD USERS ADMIN

    async function addUserAdmin (e){
        e.preventDefault();
        if (inputsAddUser.current.email !== "" && inputsAddUser.current.nombre !== "" && inputsAddUser.current.pass !== "") {
            if (inputsAddUser.current.nombre.trim().replace("  ").length > 1 && inputsAddUser.current.nombre !== "Admin") {
                const valEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,10}$/g;
                if (valEmail.test(inputsAddUser.current.email)) {
                    if (inputsAddUser.current.pass.length > 5) {
                        setLoading("Creando usuario..");
                        const res = await api("post", "/addUserAdmin", inputsAddUser.current);
                        setLoading(false);
                        if (res.result[0]) {
                            setModalAddUser(false);
                            navigate("/asd");
                            setTimeout(()=>{
                                navigate("/");
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
                if (inputsAddUser.current.nombre === "Admin") {
                    alert("El nombre no puede ser explicitamente 'Admin'.");    
                } else {
                    alert("El nombre debe tener minimo 2 caracteres.");
                };
            }
        } else {
            alert("Rellena todos los campos.");
        }
    }

    async function delAdminUser (id){
        const preguntaDel = window.confirm("¿Estas seguro de eliminar este usuario?");
        if (preguntaDel) {
            setLoading("Eliminando..");
            const res = await api("post", "/delUserAdmin", {delUserID: id});
            setLoading(false);
            console.log(res);
            if (res.result[0] == true) {
                const usersAdminNew = [...usersAdmin];
                usersAdminNew[usersAdminNew.findIndex(e => e.uid === id)].delCuenta = true;
                
                setUsersAdmin(usersAdminNew);
                setInfoGeneral({...infoGeneral, usersAdmin:infoGeneral.usersAdmin-1});
                alert("Usuario eliminado correctamente.");
            } else {
                alert(res.result[1]);
            }
        }
    }

    // CRUD COSTO DE LOS SERVICIOS

    async function delCostoServicio (distancia){
        const preguntaDel = window.confirm("¿Estas seguro de eliminar este costo?");
        if (preguntaDel) {
            setLoading("Eliminando..");
            const res = await api("post", "/delCosto", {delIDCosto: distancia});
            setLoading(false);
            if (res.result[0] == true) {
                const costoServiciosNew = {...costoServicios};
                delete costoServiciosNew[distancia];
                setCostoServicios(costoServiciosNew);
                alert("Costo eliminado correctamente.");
            } else {
                alert(res.result[1]);
            }
        }
    }

    async function addCostoServicio (e){
        e.preventDefault();
        const { desdeKM, hastaKM, costo } = inputsAddCosto.current;
        const valPunto = /\./;

        if (desdeKM > 0 && hastaKM > 0 && costo > 0) {
            if (!valPunto.test(desdeKM) && !valPunto.test(hastaKM) && !valPunto.test(costo)) {
                if (!costoServicios[`${desdeKM}km-${hastaKM}km`]) {
                    setLoading("Agregando costo..");
                    const res = await api("post", "/addCosto", {IDCosto:`${desdeKM}km-${hastaKM}km`, costo:costo});
                    setLoading(false);
                    if (res.result[0]) {
                        setModalAddCosto(false);
                        navigate("/asd");
                        setTimeout(()=>{
                            navigate("/");
                        }, 40);
                    } else {
                        alert(res.result[1]);
                    }
                } else {
                    alert("El costo que intentas agregar, ya existe.");
                }
            } else {
                alert("Los campos tienen que ser numeros, no pueden contener simbolos adicionales. (. , - / $)")
            }
        } else {
            alert("Rellena todos los campos. (Los valores tienen que ser mayor a cero.)");
        }
    } 


    useEffect(()=>{
        getInfoGeneral();
        getUsersAdmin();
    }, []);

    return (
        <Box overflowX="hidden" overflowY="scroll" height="100%" width="82vw" p="2vh">
            <Modal isOpen={modalAddUser} onClose={()=>setModalAddUser(false)}>
                <form style={{display:"flex", alignItems:"center", width:"30vw", padding:"5%", flexDirection:"column"}}>
                    <Text fontWeight="bold" fontSize="3vh">Añadir usuario</Text>
                    <Flex mt="4%" alignItems="center" w="100%" flexDir="column">
                       <Input onChange={(e)=>inputsAddUser.current.nombre = e.target.value} w="70%" borderRadius="4px" outline="none" borderWidth="1px" borderColor="#b4b4b4" p="1%" mb="3%" placeholder="Nombre" /> 
                       <Input onChange={(e)=>inputsAddUser.current.email = e.target.value} w="70%" borderRadius="4px" outline="none" borderWidth="1px" borderColor="#b4b4b4" p="1%" mb="3%" placeholder="Correo electronico" /> 
                       <Input onChange={(e)=>inputsAddUser.current.pass = e.target.value} w="70%" borderRadius="4px" outline="none" borderWidth="1px" borderColor="#b4b4b4" p="1%" mb="7%" placeholder="Contraseña" /> 
                    </Flex>
                    <Button cursor="pointer" _hover={{backgroundColor:"#38C95B"}} transition="all 0.2s" color="#fff" bg="#56D675" fontWeight="bold" w="70%" p="2%" border="none" onClick={(e)=>addUserAdmin(e)} type="submit">Agregar usuario</Button>
                </form>
            </Modal>

            <Modal isOpen={modalAddCosto} onClose={()=>setModalAddCosto(false)}>
                <form style={{display:"flex", alignItems:"center", width:"30vw", padding:"5%", flexDirection:"column"}}>
                    <Text fontWeight="bold" fontSize="3vh">Añadir costo</Text>
                    <Flex mt="4%" alignItems="center" w="100%" flexDir="column">
                       <Input type="number" onChange={(e)=>inputsAddCosto.current.desdeKM = e.target.value} w="70%" borderRadius="4px" outline="none" borderWidth="1px" borderColor="#b4b4b4" p="1%" mb="3%" placeholder="Desde (KM)" /> 
                       <Input type="number" onChange={(e)=>inputsAddCosto.current.hastaKM = e.target.value} w="70%" borderRadius="4px" outline="none" borderWidth="1px" borderColor="#b4b4b4" p="1%" mb="3%" placeholder="Hasta (KM)" /> 
                       <Input type="number" onChange={(e)=>inputsAddCosto.current.costo = e.target.value} w="70%" borderRadius="4px" outline="none" borderWidth="1px" borderColor="#b4b4b4" p="1%" mb="7%" placeholder="Costo" /> 
                    </Flex>
                    <Button cursor="pointer" _hover={{backgroundColor:"#38C95B"}} transition="all 0.2s" color="#fff" bg="#56D675" fontWeight="bold" w="70%" p="2%" border="none" onClick={(e)=>addCostoServicio(e)} type="submit">Agregar costo</Button>
                </form>
            </Modal>

            <Cargando isOpen={loading} txt={loading} />

            <Flex>
                <Flex width="10vw" justifyContent="center" alignItems="center" borderRadius="0.5vw" p="2vh" border="1px solid #E8E8E8">
                    <span style={{width:"2vw"}} className="material-symbols-outlined">sports_motorsports</span> 
                    <Box ml="0.5vw">
                        <Text fontWeight="500" color="#8A8A8A" >Repartidores</Text>
                        <Flex justifyContent="center">
                            {infoGeneral.repartidores === undefined ?  
                                <Spinner color="#646464" mt="1vh" w="1vw" h="1vw"/>
                                : <Text color="#4B4B4B" fontSize="3.5vh" fontWeight="bold">{infoGeneral.repartidores-infoGeneral.repartidoresEliminados}</Text>}
                        </Flex>
                    </Box>
                </Flex>
                <Flex ml="1.5vw" width="10vw" justifyContent="center" alignItems="center" borderRadius="0.5vw" p="2vh" border="1px solid #E8E8E8">
                    <span style={{width:"2vw"}} className="material-symbols-outlined">group</span> 
                    <Box ml="0.5vw">
                        <Text fontWeight="500" color="#8A8A8A" >Usuarios</Text>
                        <Flex justifyContent="center">
                            {infoGeneral.usuarios === undefined ?  
                                <Spinner color="#646464" mt="1vh" w="1vw" h="1vw"/>
                                : <Text color="#4B4B4B" fontSize="3.5vh" fontWeight="bold">{infoGeneral.usuarios-infoGeneral.usuariosEliminados}</Text>}
                        </Flex>
                    </Box>
                </Flex>
                <Flex ml="1.5vw" width="15vw" justifyContent="center" alignItems="center" borderRadius="0.5vw" p="2vh" border="1px solid #E8E8E8">
                    <span style={{width:"2vw"}} className="material-symbols-outlined">shield_person</span> 
                    <Box ml="0.5vw">
                        <Text fontWeight="500" color="#8A8A8A" >Usuarios Admin</Text>
                        <Flex justifyContent="center">
                            {infoGeneral.usersAdmin === undefined ?  
                                <Spinner color="#646464" mt="1vh" w="1vw" h="1vw"/>
                                : <Text color="#4B4B4B" fontSize="3.5vh" fontWeight="bold">{infoGeneral.usersAdmin-infoGeneral.usersAdminEliminados}</Text>}
                        </Flex>
                    </Box>
                </Flex>
                <Flex ml="1.5vw" width="15vw" justifyContent="center" alignItems="center" borderRadius="0.5vw" p="2vh" border="1px solid #E8E8E8">
                    <span style={{width:"2vw"}} className="material-symbols-outlined">inactive_order</span>
                    <Box ml="0.5vw">
                        <Text fontWeight="500" color="#8A8A8A" >Pedidos en Total</Text>
                        <Flex justifyContent="center">
                            {infoGeneral.pedidosTotal === undefined ?  
                                <Spinner color="#646464" mt="1vh" w="1vw" h="1vw"/>
                                : <Text color="#4B4B4B" fontSize="3.5vh" fontWeight="bold">{infoGeneral.pedidosTotal}</Text>}
                        </Flex>
                    </Box>
                </Flex>
                <Flex ml="auto" mr="2vw" width="15vw" justifyContent="center" alignItems="center" borderRadius="0.5vw" p="2vh" border="1px solid #E8E8E8">
                    <span style={{width:"2vw"}} className="material-symbols-outlined">order_play</span>
                    <Box ml="0.5vw">
                        <Text fontWeight="500" color="#8A8A8A" >Pedidos En Curso</Text>
                        <Flex justifyContent="center">
                            {infoGeneral.pedidosEnCurso === undefined ?  
                                <Spinner color="#646464" mt="1vh" w="1vw" h="1vw"/>
                                : <Text color="#4B4B4B" fontSize="3.5vh" fontWeight="bold">{infoGeneral.pedidosEnCurso}</Text>}
                        </Flex>
                    </Box>
                </Flex>
            </Flex>

            <Flex borderRadius="0.5vw" width="80vw" p="1.2vw" pb={ultimoElementoUsersAdmin === false ? "2.4%" : "0" } border="1px solid #E8E8E8" flexDir="column" mt="4vh">
                <Flex>
                    <Text ml="1vw" fontSize="3.5vh" fontWeight="800">Usuarios Administradores</Text>
                    <form style={{display:usersAdmin?.length > 0 ? "flex" : "none", marginLeft:"auto", marginRight:"auto", height:"10%", alignItems:"center", width:"40%"}} >
                        <InputGroup>
                            <Input value={searchInput} onChange={(e)=>setSearchInput(e.target.value)} type="email" outline="none" _focus={{border:"1px solid #d8d8d8", boxShadow:"0px 0px 3px 1px #d8d8d8"}} w="100%" p="0.5vw" borderRadius="0.4vw" border="1px solid #b4b4b4" placeholder="Busca un usuario por ID, email.."/>
                            <InputRightElement display={(isSearch && !cargandoSearch) ? "flex" :  "none"} onClick={()=>{setSearchInput(""); setIsSearch(false); setSearchUsers(false);}} cursor="pointer" h="100%" pr="1%" alignItems="center">
                                <Image w="1.6vw" h="1.6vw" src={require("../assets/x.png")} />
                            </InputRightElement>
                        </InputGroup>
                        <Button onClick={(e)=>buscarUser(e)} type="submit" display="none" />
                    </form>
                    <Button ml="1vw" onClick={()=>setModalAddUser(true)} transition="all 0.2s" cursor="pointer" _hover={{backgroundColor:"#38C95B"}} mr="1.5vw" borderRadius="1vh" p="1.3vh" bg="#56D675" border="none" >
                        <Text fontWeight="bold" color="#fff">Agregar Usuario</Text>
                    </Button>
                </Flex>
                {   cargandoSearch ?
                        <Spinner ml="auto" mr="auto" color="#646464" my="2vh" w="1.2vw" h="1.2vw"/>
                    : isSearch ?
                        Array.isArray(searchUsers) ?
                            <Flex border="1px solid #E8E8E8" flexDir="column" mt="2.5vh">
                                <Flex width="100%" >
                                    <Flex p="1vh" justifyContent="center" w="28%" borderRight="1px solid #E8E8E8">
                                        <Text color="#666666" fontWeight="bold">Nombre</Text>
                                    </Flex>
                                    <Flex p="1vh" justifyContent="center" w="30%" borderRight="1px solid #E8E8E8">
                                        <Text color="#666666" fontWeight="bold">Correo</Text>
                                    </Flex>
                                    <Flex p="1vh" justifyContent="center" w="22%" borderRight="1px solid #E8E8E8">
                                        <Text color="#666666" fontWeight="bold">Ultimo acceso</Text>
                                    </Flex>
                                    <Flex p="1vh" justifyContent="center" w="20%" borderRight="1px solid #E8E8E8">
                                        <Text color="#666666" fontWeight="bold">Fecha creación</Text>
                                    </Flex>
                                </Flex>
                                { searchUsers.map((userAdmin)=>(
                                    <Flex key={userAdmin.uid} borderTop="1px solid #E8E8E8" width="100%">
                                        <Flex p="1vh" justifyContent="center" w="28%" borderRight="1px solid #E8E8E8">
                                            <Text color={userAdmin.delCuenta ? "#c91212" : "#000"} >{userAdmin.nombre}</Text>
                                        </Flex>
                                        <Flex p="1vh" justifyContent="center" w="30%" borderRight="1px solid #E8E8E8">
                                            <Text color={userAdmin.delCuenta ? "#c91212" : "#000"}>{userAdmin.email}</Text>
                                        </Flex>
                                        <Flex p="1vh" justifyContent="center" w="22%" borderRight="1px solid #E8E8E8">
                                            <Text color={userAdmin.delCuenta ? "#c91212" : "#000"}>{getFecha(userAdmin.ultimoAcceso["_seconds"], true)}</Text>
                                        </Flex>
                                        <Flex position="relative" p="1vh" justifyContent="center" w="20%" borderRight="1px solid #E8E8E8">
                                            <Text color={userAdmin.delCuenta ? "#c91212" : "#000"}>{getFecha(userAdmin.fechaCreado["_seconds"])}</Text>
                                            <Flex display={userAdmin.delCuenta ? "none" : "flex"} opacity={userAdmin.nombre == "Admin" ? 0.3 : 1} onClick={()=>{userAdmin.nombre != "Admin" && delAdminUser(userAdmin.uid)}} right="3%" position="absolute" cursor="pointer" h="3.1vh" >
                                                <svg xmlns="http://www.w3.org/2000/svg" height="100%" viewBox="0 -960 960 960" width="100%">
                                                    <path fill="#c71645" d="M256.478-105.869q-32.74 0-56.262-23.356-23.522-23.355-23.522-55.862v-560.391h-11q-16.706 0-28.158-11.502-11.451-11.501-11.451-28.283 0-16.781 11.451-28.107 11.452-11.326 28.158-11.326h173.262q0-16.957 11.451-28.566 11.452-11.609 28.158-11.609h202.87q16.636 0 28.405 11.769 11.769 11.77 11.769 28.406h172.697q16.706 0 28.158 11.501 11.451 11.502 11.451 28.283 0 16.782-11.451 28.108-11.452 11.326-28.158 11.326h-11v560.391q0 32.507-23.522 55.862-23.522 23.356-56.262 23.356H256.478Zm0-639.609v560.391h447.044v-560.391H256.478Zm103.174 444.391q0 14.29 10.197 24.406 10.198 10.116 24.609 10.116 14.412 0 24.607-10.116 10.196-10.116 10.196-24.406v-329.391q0-14.29-10.48-24.689-10.481-10.398-24.892-10.398t-24.324 10.398q-9.913 10.399-9.913 24.689v329.391Zm171.087 0q0 14.29 10.48 24.406 10.481 10.116 24.892 10.116t24.607-10.116q10.195-10.116 10.195-24.406v-329.391q0-14.29-10.311-24.689-10.312-10.398-24.892-10.398t-24.775 10.398q-10.196 10.399-10.196 24.689v329.391ZM256.478-745.478v560.391-560.391Z"/>
                                                </svg>
                                            </Flex>
                                        </Flex>
                                    </Flex>
                            ))}
                            </Flex>
                        :   <Text mx="auto" color="#616161" mt="3.5vh">{searchUsers}</Text>
                    : usersAdmin == undefined ?
                        <Spinner ml="auto" mr="auto" color="#646464" my="2vh" w="1.2vw" h="1.2vw"/>
                    : usersAdmin.length > 0 ?
                        <Flex border="1px solid #E8E8E8" flexDir="column" mt="2.5vh">
                            <Flex width="100%" >
                                <Flex p="1vh" justifyContent="center" w="28%" borderRight="1px solid #E8E8E8">
                                    <Text color="#666666" fontWeight="bold">Nombre</Text>
                                </Flex>
                                <Flex p="1vh" justifyContent="center" w="30%" borderRight="1px solid #E8E8E8">
                                    <Text color="#666666" fontWeight="bold">Correo</Text>
                                </Flex>
                                <Flex p="1vh" justifyContent="center" w="22%" borderRight="1px solid #E8E8E8">
                                    <Text color="#666666" fontWeight="bold">Ultimo acceso</Text>
                                </Flex>
                                <Flex p="1vh" justifyContent="center" w="20%" borderRight="1px solid #E8E8E8">
                                    <Text color="#666666" fontWeight="bold">Fecha creación</Text>
                                </Flex>
                            </Flex>
                            { usersAdmin.map((userAdmin)=>(
                                <Flex key={userAdmin.uid} borderTop="1px solid #E8E8E8" width="100%">
                                    <Flex p="1vh" justifyContent="center" w="28%" borderRight="1px solid #E8E8E8">
                                        <Text color={userAdmin.delCuenta ? "#c91212" : "#000"} >{userAdmin.nombre}</Text>
                                    </Flex>
                                    <Flex p="1vh" justifyContent="center" w="30%" borderRight="1px solid #E8E8E8">
                                        <Text color={userAdmin.delCuenta ? "#c91212" : "#000"}>{userAdmin.email}</Text>
                                    </Flex>
                                    <Flex p="1vh" justifyContent="center" w="22%" borderRight="1px solid #E8E8E8">
                                        <Text color={userAdmin.delCuenta ? "#c91212" : "#000"}>{getFecha(userAdmin.ultimoAcceso["_seconds"], true)}</Text>
                                    </Flex>
                                    <Flex position="relative" p="1vh" justifyContent="center" w="20%" borderRight="1px solid #E8E8E8">
                                        <Text color={userAdmin.delCuenta ? "#c91212" : "#000"}>{getFecha(userAdmin.fechaCreado["_seconds"])}</Text>
                                        <Flex display={userAdmin.delCuenta ? "none" : "flex"} opacity={userAdmin.nombre == "Admin" ? 0.3 : 1} onClick={()=>{userAdmin.nombre != "Admin" && delAdminUser(userAdmin.uid)}} right="3%" position="absolute" cursor="pointer" h="3.1vh" >
                                            <svg xmlns="http://www.w3.org/2000/svg" height="100%" viewBox="0 -960 960 960" width="100%">
                                                <path fill="#c71645" d="M256.478-105.869q-32.74 0-56.262-23.356-23.522-23.355-23.522-55.862v-560.391h-11q-16.706 0-28.158-11.502-11.451-11.501-11.451-28.283 0-16.781 11.451-28.107 11.452-11.326 28.158-11.326h173.262q0-16.957 11.451-28.566 11.452-11.609 28.158-11.609h202.87q16.636 0 28.405 11.769 11.769 11.77 11.769 28.406h172.697q16.706 0 28.158 11.501 11.451 11.502 11.451 28.283 0 16.782-11.451 28.108-11.452 11.326-28.158 11.326h-11v560.391q0 32.507-23.522 55.862-23.522 23.356-56.262 23.356H256.478Zm0-639.609v560.391h447.044v-560.391H256.478Zm103.174 444.391q0 14.29 10.197 24.406 10.198 10.116 24.609 10.116 14.412 0 24.607-10.116 10.196-10.116 10.196-24.406v-329.391q0-14.29-10.48-24.689-10.481-10.398-24.892-10.398t-24.324 10.398q-9.913 10.399-9.913 24.689v329.391Zm171.087 0q0 14.29 10.48 24.406 10.481 10.116 24.892 10.116t24.607-10.116q10.195-10.116 10.195-24.406v-329.391q0-14.29-10.311-24.689-10.312-10.398-24.892-10.398t-24.775 10.398q-10.196 10.399-10.196 24.689v329.391ZM256.478-745.478v560.391-560.391Z"/>
                                            </svg>
                                        </Flex>
                                    </Flex>
                                </Flex>
                           ))}
                        </Flex> 
                    : <Flex m="1%" ><Text color="#616161">Sin usuarios registrados.</Text></Flex>
                }
                <Flex display={ultimoElementoUsersAdmin !== false ? "block" : "none"} cursor="pointer" justifyContent="center" mx="auto" p="0.2%" my="1.2%" borderRadius="5%" bg="#e6e6e6" w="10%" onClick={()=>{!loadData && getUsersAdmin()}}>
                    { loadData ? <Spinner ml="auto" mr="auto" color="#646464" w="0.7vw" h="0.7vw"/> : <Text fontSize="2.3vh" textAlign="center">Ver mas</Text>} 
                </Flex>
            </Flex>

            <Flex borderRadius="0.5vw" width="80vw" p="1.2vw" border="1px solid #E8E8E8" flexDir="column" mt="4vh">
                <Flex alignItems="center" justifyContent="space-between">
                    <Text ml="1vw" fontSize="3.5vh" fontWeight="800">Costo de los Servicios</Text>
                    <Button onClick={()=>setModalAddCosto(true)} transition="all 0.2s" cursor="pointer" _hover={{backgroundColor:"#38C95B"}} mr="1.5vw" borderRadius="1vh" p="1.3vh" bg="#56D675" border="none" >
                        <Text fontWeight="bold" color="#fff">Agregar costo</Text>
                    </Button>
                </Flex>
                {   costoServicios == undefined ?
                        <Spinner ml="auto" mr="auto" color="#646464" my="2vh" w="1.2vw" h="1.2vw"/>
                    :  Object.keys(costoServicios).length > 0 ?
                        <Flex border="1px solid #E8E8E8" flexDir="column" mt="2.5vh">
                            <Flex width="100%" >
                                <Flex p="1vh" justifyContent="center" w="50%" borderRight="1px solid #E8E8E8">
                                    <Text color="#666666" fontWeight="bold">Distancia</Text>
                                </Flex>
                                <Flex p="1vh" justifyContent="center" w="50%" borderRight="1px solid #E8E8E8">
                                    <Text color="#666666" fontWeight="bold">Costo</Text>
                                </Flex>
                            </Flex>
                            {  Object.keys(costoServicios).map((distancia)=>(
                                <Flex key={distancia} borderTop="1px solid #E8E8E8" width="100%">
                                    <Flex p="1vh" justifyContent="center" w="50%" borderRight="1px solid #E8E8E8">
                                        <Text>{distancia}</Text>
                                    </Flex>
                                    <Flex position="relative" p="1vh" justifyContent="center" w="50%" borderRight="1px solid #E8E8E8">
                                        <Text>${costoServicios[distancia].toLocaleString()}</Text>
                                        <Flex onClick={()=>delCostoServicio(distancia)} right="3%" position="absolute" cursor="pointer" h="3.1vh" >
                                            <svg xmlns="http://www.w3.org/2000/svg" height="100%" viewBox="0 -960 960 960" width="100%">
                                                <path fill="#c71645" d="M256.478-105.869q-32.74 0-56.262-23.356-23.522-23.355-23.522-55.862v-560.391h-11q-16.706 0-28.158-11.502-11.451-11.501-11.451-28.283 0-16.781 11.451-28.107 11.452-11.326 28.158-11.326h173.262q0-16.957 11.451-28.566 11.452-11.609 28.158-11.609h202.87q16.636 0 28.405 11.769 11.769 11.77 11.769 28.406h172.697q16.706 0 28.158 11.501 11.451 11.502 11.451 28.283 0 16.782-11.451 28.108-11.452 11.326-28.158 11.326h-11v560.391q0 32.507-23.522 55.862-23.522 23.356-56.262 23.356H256.478Zm0-639.609v560.391h447.044v-560.391H256.478Zm103.174 444.391q0 14.29 10.197 24.406 10.198 10.116 24.609 10.116 14.412 0 24.607-10.116 10.196-10.116 10.196-24.406v-329.391q0-14.29-10.48-24.689-10.481-10.398-24.892-10.398t-24.324 10.398q-9.913 10.399-9.913 24.689v329.391Zm171.087 0q0 14.29 10.48 24.406 10.481 10.116 24.892 10.116t24.607-10.116q10.195-10.116 10.195-24.406v-329.391q0-14.29-10.311-24.689-10.312-10.398-24.892-10.398t-24.775 10.398q-10.196 10.399-10.196 24.689v329.391ZM256.478-745.478v560.391-560.391Z"/>
                                            </svg>
                                        </Flex>
                                    </Flex>
                                </Flex>
                            ))}  
                     </Flex>
                    : <Flex m="1%" ><Text color="#616161">No hay costos.</Text></Flex> 
                }
            </Flex>

            <Servicios/>            
        </Box>
    )
}