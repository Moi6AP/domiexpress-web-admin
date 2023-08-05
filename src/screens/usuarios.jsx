import { Box, Button, Flex, Image, Input, InputGroup, InputRightElement, Spinner, Text } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import api from "../utils/api";
import { getFecha } from "../utils/funciones";
import Cargando from "../components/cargando";
import Modal from "../components/modal";
import { useNavigate } from "react-router-dom";

export default function Repartidores (){

    const navigate = useNavigate();

    const [usuarios, setUsuarios] = useState(undefined);
    const [ultimoElemento, setUltimoElemento] = useState(false);

    const [loadData, setLoadData] = useState(false);
    const [loading, setLoading] = useState(false);

    const [modalAddUser, setModalAddUser] = useState(false);

    const inputsAddUser = useRef({nombre:"", email:"", pass:""});

    const [cargandoSearch, setCargandoSearch] = useState(false);
    const [searchUsers, setSearchUsers] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [isSearch, setIsSearch] = useState(false);
    
    async function getUsuarios (){
        setLoadData(true);
        const res = await api("post", "/getUsers", {ultimoElemento: ultimoElemento !== false ? ultimoElemento : undefined, rol:"normal"})
        setLoadData(false);
        if (res.result[0]) {
            setUltimoElemento(res.result[2]);
            setUsuarios( usuarios == undefined ? res.result[1] : [...usuarios, ...res.result[1]]);
        } else {
            alert(res.result[1]);
        }
    }

    async function delUser (id){
        const preguntaDel = window.confirm("¿Estas seguro de eliminar este usuario?");
        if (preguntaDel) {
            setLoading("Eliminando..");
            const res = await api("post", "/delUser", {delUserID: id});
            setLoading(false);

            if (res.result[0] == true) {
                const usuariosNew = [...usuarios];
                usuariosNew[usuariosNew.findIndex(a => a.uid == id)].delCuenta = true;

                setUsuarios(usuariosNew);
                alert("Usuario eliminado correctamente.");
            } else {
                alert(res.result[1]);
            }
        }
    }

    async function addUser (e){
        e.preventDefault();
        if (inputsAddUser.current.email !== "" && inputsAddUser.current.nombre !== "" && inputsAddUser.current.pass !== "") {
            if (inputsAddUser.current.nombre.trim().replace("  ").length > 1 && inputsAddUser.current.nombre !== "Admin") {
                const valEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,10}$/g;
                if (valEmail.test(inputsAddUser.current.email)) {
                    if (inputsAddUser.current.pass.length > 5) {
                        setLoading("Creando usuario..");
                        const res = await api("post", "/addUserNormal", inputsAddUser.current);
                        setLoading(false);
                        if (res.result[0]) {
                            setModalAddUser(false);
                            navigate("/asd");
                            setTimeout(()=>{
                                navigate("/usuarios");
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

    async function buscarUser (e){
        e.preventDefault();
        setIsSearch(true);
        if (searchInput !== "" && !cargandoSearch) {
            setCargandoSearch(true);
            const res = await api("post", "/buscarUser", {search:searchInput, rol:"normal"});
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

     useEffect(()=>{
        getUsuarios();
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
                    <Button cursor="pointer" _hover={{backgroundColor:"#38C95B"}} transition="all 0.2s" color="#fff" bg="#56D675" fontWeight="bold" w="70%" p="2%" border="none" onClick={(e)=>addUser(e)} type="submit">Agregar usuario</Button>
                </form>
            </Modal>

            <Cargando isOpen={loading} txt={loading} />

            <Flex pb={ultimoElemento === false ? "2.4%" : "0" } borderRadius="0.5vw" width="80vw" p="1.2vw" border="1px solid #E8E8E8" flexDir="column" mt="4vh">
                <Flex alignItems="center" justifyContent="space-between">
                    <Text ml="1vw" fontSize="3.5vh" fontWeight="800">Usuarios</Text>
                    <form style={{display:usuarios?.length > 0 ? "flex" : "none", marginLeft:"auto", marginRight:"auto", height:"10%", alignItems:"center", width:"40%"}} >
                        <InputGroup>
                            <Input value={searchInput} onChange={(e)=>setSearchInput(e.target.value)} type="email" outline="none" _focus={{border:"1px solid #d8d8d8", boxShadow:"0px 0px 3px 1px #d8d8d8"}} w="100%" p="0.5vw" borderRadius="0.4vw" border="1px solid #b4b4b4" placeholder="Busca un usuario por ID, email.."/>
                            <InputRightElement display={(isSearch && !cargandoSearch) ? "flex" :  "none"} onClick={()=>{setSearchInput(""); setIsSearch(false); setSearchUsers(false);}} cursor="pointer" h="100%" pr="1%" alignItems="center">
                                <Image w="1.6vw" h="1.6vw" src={require("../assets/x.png")} />
                            </InputRightElement>
                        </InputGroup>
                        <Button onClick={(e)=>buscarUser(e)} type="submit" display="none" />
                    </form>
                    <Button onClick={()=>setModalAddUser(true)} transition="all 0.2s" cursor="pointer" _hover={{backgroundColor:"#38C95B"}} mr="1.5vw" borderRadius="1vh" p="1.3vh" bg="#56D675" border="none" >
                        <Text fontWeight="bold" color="#fff">Agregar Usuario</Text>
                    </Button>
                </Flex>
                {   cargandoSearch ?
                        <Spinner ml="auto" mr="auto" color="#646464" my="2vh" w="1.2vw" h="1.2vw"/>
                    : isSearch ?
                        Array.isArray(searchUsers) ?
                            <Flex border="1px solid #E8E8E8" flexDir="column" mt="2.5vh">
                                <Flex width="100%" >
                                    <Flex p="1vh" justifyContent="center" w="25%" borderRight="1px solid #E8E8E8">
                                        <Text color="#666666" fontWeight="bold">Nombre</Text>
                                    </Flex>
                                    <Flex p="1vh" justifyContent="center" w="25%" borderRight="1px solid #E8E8E8">
                                        <Text color="#666666" fontWeight="bold">Correo electronico</Text>
                                    </Flex>
                                    <Flex p="1vh" justifyContent="center" w="13%" borderRight="1px solid #E8E8E8">
                                        <Text color="#666666" fontWeight="bold">Cant. Pedidos</Text>
                                    </Flex>
                                    <Flex p="1vh" justifyContent="center" w="12%" borderRight="1px solid #E8E8E8">
                                        <Text color="#666666" fontWeight="bold">Saldo</Text>
                                    </Flex>
                                    <Flex alignItems="center" p="1vh" justifyContent="center" w="10%" borderRight="1px solid #E8E8E8">
                                        <Text color="#666666" fontWeight="bold">ID</Text>
                                    </Flex>
                                    <Flex alignItems="center" p="1vh" justifyContent="center" w="12%" borderRight="1px solid #E8E8E8">
                                        <Text color="#666666" fontWeight="bold">Creación</Text>
                                    </Flex>
                                </Flex>
                                { searchUsers.map((usuario)=>(
                                        <Flex key={usuario.uid} borderTop="1px solid #E8E8E8" width="100%">
                                            <Flex p="1vh" justifyContent="center" w="25%" borderRight="1px solid #E8E8E8">
                                                <Text color={usuario.delCuenta ? "#c91212" : "#000"}>{usuario.nombre}</Text>
                                            </Flex>
                                            <Flex p="1vh" justifyContent="center" w="25%" borderRight="1px solid #E8E8E8">
                                                <Text color={usuario.delCuenta ? "#c91212" : "#000"}>{usuario.email}</Text>
                                            </Flex>
                                            <Flex p="1vh" justifyContent="center" w="13%" borderRight="1px solid #E8E8E8">
                                                <Text color={usuario.delCuenta ? "#c91212" : "#000"}>{usuario.cantidadPedidosRealizados}</Text>
                                            </Flex>
                                            <Flex p="1vh" justifyContent="center" w="12%" borderRight="1px solid #E8E8E8">
                                                <Text color={usuario.delCuenta ? "#c91212" : "#000"}>${usuario.tuSaldo}</Text>
                                            </Flex>
                                            <Flex p="1vh" justifyContent="center" w="10%" borderRight="1px solid #E8E8E8">
                                                <Text color={usuario.delCuenta ? "#c91212" : "#000"}>{usuario.uid.replace("U-", "")}</Text>
                                            </Flex>
                                            <Flex p="1vh" justifyContent="center" w={"12%"} borderRight="1px solid #E8E8E8">
                                                <Text color={usuario.delCuenta ? "#c91212" : "#000"}>{getFecha(usuario.fechaCreado["_seconds"])}</Text>
                                            </Flex>
                                            <Flex display={usuario.delCuenta ? "none" : "flex"} w="3%" justifyContent="center" alignItems="center" onClick={()=>delUser(usuario.uid)} cursor="pointer">
                                                <Flex h="3.1vh" >
                                                    <svg xmlns="http://www.w3.org/2000/svg" height="100%" viewBox="0 -960 960 960" width="100%">
                                                        <path fill="#c71645" d="M256.478-105.869q-32.74 0-56.262-23.356-23.522-23.355-23.522-55.862v-560.391h-11q-16.706 0-28.158-11.502-11.451-11.501-11.451-28.283 0-16.781 11.451-28.107 11.452-11.326 28.158-11.326h173.262q0-16.957 11.451-28.566 11.452-11.609 28.158-11.609h202.87q16.636 0 28.405 11.769 11.769 11.77 11.769 28.406h172.697q16.706 0 28.158 11.501 11.451 11.502 11.451 28.283 0 16.782-11.451 28.108-11.452 11.326-28.158 11.326h-11v560.391q0 32.507-23.522 55.862-23.522 23.356-56.262 23.356H256.478Zm0-639.609v560.391h447.044v-560.391H256.478Zm103.174 444.391q0 14.29 10.197 24.406 10.198 10.116 24.609 10.116 14.412 0 24.607-10.116 10.196-10.116 10.196-24.406v-329.391q0-14.29-10.48-24.689-10.481-10.398-24.892-10.398t-24.324 10.398q-9.913 10.399-9.913 24.689v329.391Zm171.087 0q0 14.29 10.48 24.406 10.481 10.116 24.892 10.116t24.607-10.116q10.195-10.116 10.195-24.406v-329.391q0-14.29-10.311-24.689-10.312-10.398-24.892-10.398t-24.775 10.398q-10.196 10.399-10.196 24.689v329.391ZM256.478-745.478v560.391-560.391Z"/>
                                                    </svg>
                                                </Flex>
                                            </Flex>
                                        </Flex>
                                ))}
                            </Flex>
                        :   <Text mx="auto" color="#616161" mt="3.5vh">{searchUsers}</Text>
                    : usuarios === undefined ?
                        <Spinner ml="auto" mr="auto" color="#646464" my="2vh" w="1.2vw" h="1.2vw"/>
                    : usuarios.length > 0 ?
                        <Flex border="1px solid #E8E8E8" flexDir="column" mt="2.5vh">
                            <Flex width="100%" >
                                <Flex p="1vh" justifyContent="center" w="25%" borderRight="1px solid #E8E8E8">
                                    <Text color="#666666" fontWeight="bold">Nombre</Text>
                                </Flex>
                                <Flex p="1vh" justifyContent="center" w="25%" borderRight="1px solid #E8E8E8">
                                    <Text color="#666666" fontWeight="bold">Correo electronico</Text>
                                </Flex>
                                <Flex p="1vh" justifyContent="center" w="13%" borderRight="1px solid #E8E8E8">
                                    <Text color="#666666" fontWeight="bold">Cant. Pedidos</Text>
                                </Flex>
                                <Flex p="1vh" justifyContent="center" w="12%" borderRight="1px solid #E8E8E8">
                                    <Text color="#666666" fontWeight="bold">Saldo</Text>
                                </Flex>
                                <Flex alignItems="center" p="1vh" justifyContent="center" w="10%" borderRight="1px solid #E8E8E8">
                                    <Text color="#666666" fontWeight="bold">ID</Text>
                                </Flex>
                                <Flex alignItems="center" p="1vh" justifyContent="center" w="12%" borderRight="1px solid #E8E8E8">
                                    <Text color="#666666" fontWeight="bold">Creación</Text>
                                </Flex>
                            </Flex>
                           { usuarios.map((usuario)=>(
                                <Flex key={usuario.uid} borderTop="1px solid #E8E8E8" width="100%">
                                    <Flex p="1vh" justifyContent="center" w="25%" borderRight="1px solid #E8E8E8">
                                        <Text color={usuario.delCuenta ? "#c91212" : "#000"}>{usuario.nombre}</Text>
                                    </Flex>
                                    <Flex p="1vh" justifyContent="center" w="25%" borderRight="1px solid #E8E8E8">
                                        <Text color={usuario.delCuenta ? "#c91212" : "#000"}>{usuario.email}</Text>
                                    </Flex>
                                    <Flex p="1vh" justifyContent="center" w="13%" borderRight="1px solid #E8E8E8">
                                        <Text color={usuario.delCuenta ? "#c91212" : "#000"}>{usuario.cantidadPedidosRealizados}</Text>
                                    </Flex>
                                    <Flex p="1vh" justifyContent="center" w="12%" borderRight="1px solid #E8E8E8">
                                        <Text color={usuario.delCuenta ? "#c91212" : "#000"}>${usuario.tuSaldo}</Text>
                                    </Flex>
                                    <Flex p="1vh" justifyContent="center" w="10%" borderRight="1px solid #E8E8E8">
                                        <Text color={usuario.delCuenta ? "#c91212" : "#000"}>{usuario.uid.replace("U-", "")}</Text>
                                    </Flex>
                                    <Flex p="1vh" justifyContent="center" w={"12%"} borderRight="1px solid #E8E8E8">
                                        <Text color={usuario.delCuenta ? "#c91212" : "#000"}>{getFecha(usuario.fechaCreado["_seconds"])}</Text>
                                    </Flex>
                                    <Flex display={usuario.delCuenta ? "none" : "flex"} w="3%" justifyContent="center" alignItems="center" onClick={()=>delUser(usuario.uid)} cursor="pointer">
                                        <Flex h="3.1vh" >
                                            <svg xmlns="http://www.w3.org/2000/svg" height="100%" viewBox="0 -960 960 960" width="100%">
                                                <path fill="#c71645" d="M256.478-105.869q-32.74 0-56.262-23.356-23.522-23.355-23.522-55.862v-560.391h-11q-16.706 0-28.158-11.502-11.451-11.501-11.451-28.283 0-16.781 11.451-28.107 11.452-11.326 28.158-11.326h173.262q0-16.957 11.451-28.566 11.452-11.609 28.158-11.609h202.87q16.636 0 28.405 11.769 11.769 11.77 11.769 28.406h172.697q16.706 0 28.158 11.501 11.451 11.502 11.451 28.283 0 16.782-11.451 28.108-11.452 11.326-28.158 11.326h-11v560.391q0 32.507-23.522 55.862-23.522 23.356-56.262 23.356H256.478Zm0-639.609v560.391h447.044v-560.391H256.478Zm103.174 444.391q0 14.29 10.197 24.406 10.198 10.116 24.609 10.116 14.412 0 24.607-10.116 10.196-10.116 10.196-24.406v-329.391q0-14.29-10.48-24.689-10.481-10.398-24.892-10.398t-24.324 10.398q-9.913 10.399-9.913 24.689v329.391Zm171.087 0q0 14.29 10.48 24.406 10.481 10.116 24.892 10.116t24.607-10.116q10.195-10.116 10.195-24.406v-329.391q0-14.29-10.311-24.689-10.312-10.398-24.892-10.398t-24.775 10.398q-10.196 10.399-10.196 24.689v329.391ZM256.478-745.478v560.391-560.391Z"/>
                                            </svg>
                                        </Flex>
                                    </Flex>
                                </Flex>
                           ))}
                        </Flex>
                    : <Flex m="1%" ><Text color="#616161">Sin usuarios.</Text></Flex>
                }
                <Flex display={ultimoElemento !== false ? "block" : "none"} cursor="pointer" justifyContent="center" mx="auto" p="0.2%" my="1.2%" borderRadius="5%" bg="#e6e6e6" w="10%" onClick={()=>{!loadData && getUsuarios()}}>
                    { loadData ? <Spinner ml="auto" mr="auto" color="#646464" w="0.7vw" h="0.7vw"/> : <Text fontSize="2.3vh" textAlign="center">Ver mas</Text>} 
                </Flex>
            </Flex>
    </Box>
    )
}