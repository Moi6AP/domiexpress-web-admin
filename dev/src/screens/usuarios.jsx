import { Box, Button, Flex, Spinner, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import api from "../utils/api";
import { getFecha } from "../utils/funciones";

export default function Repartidores (){

    const [usuarios, setUsuarios] = useState(undefined);
    const [ultimoElemento, setUltimoElemento] = useState(false);

    const [loadData, setLoadData] = useState(false);
    
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

     useEffect(()=>{
        getUsuarios()
     }, []);

    return (
        <Box overflowX="hidden" overflowY="scroll" height="100%" width="82vw" p="2vh">
            <Flex pb={ultimoElemento === false ? "2.4%" : "0" } borderRadius="0.5vw" width="80vw" p="1.2vw" border="1px solid #E8E8E8" flexDir="column" mt="4vh">
                <Flex alignItems="center" justifyContent="space-between">
                    <Text ml="1vw" fontSize="3.5vh" fontWeight="800">Usuarios</Text>
                    <Button transition="all 0.2s" cursor="pointer" _hover={{backgroundColor:"#38C95B"}} mr="1.5vw" borderRadius="1vh" p="1.3vh" bg="#56D675" border="none" >
                        <Text fontWeight="bold" color="#fff">Agregar Usuario</Text>
                    </Button>
                </Flex>
                {   usuarios === undefined ?
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
                                <Flex p="1vh" justifyContent="center" w="25%" borderRight="1px solid #E8E8E8">
                                    <Text color="#666666" fontWeight="bold">Pedidos Realizados</Text>
                                </Flex>
                                <Flex p="1vh" justifyContent="center" w="25%" borderRight="1px solid #E8E8E8">
                                    <Text color="#666666" fontWeight="bold">Saldo</Text>
                                </Flex>
                                <Flex p="1vh" justifyContent="center" w="25%" borderRight="1px solid #E8E8E8">
                                    <Text color="#666666" fontWeight="bold">Fecha de Creación</Text>
                                </Flex>
                            </Flex>
                           { usuarios.map((repartidor)=>(
                                <Flex key={repartidor.uid} borderTop="1px solid #E8E8E8" width="100%">
                                    <Flex p="1vh" justifyContent="center" w="20%" borderRight="1px solid #E8E8E8">
                                        <Text>{repartidor.nombre}</Text>
                                    </Flex>
                                    <Flex p="1vh" justifyContent="center" w="20%" borderRight="1px solid #E8E8E8">
                                        <Text>{repartidor.email}</Text>
                                    </Flex>
                                    <Flex p="1vh" justifyContent="center" w="20%" borderRight="1px solid #E8E8E8">
                                        <Text>{repartidor.cantidadPedidosRealizados}</Text>
                                    </Flex>
                                    <Flex p="1vh" justifyContent="center" w="20%" borderRight="1px solid #E8E8E8">
                                        <Text>{repartidor.saldo}</Text>
                                    </Flex>
                                    <Flex p="1vh" justifyContent="center" w="20%" borderRight="1px solid #E8E8E8">
                                        <Text>{getFecha(repartidor.fechaCreado["_seconds"])}</Text>
                                    </Flex>
                                </Flex>
                           ))}
                        </Flex>
                    : <Flex m="1%" ><Text color="#616161">Sin usuarios.</Text></Flex>
                }
                <Text display={ultimoElemento !== false ? "block" : "none"} cursor="pointer" mx="auto" fontSize="2.3vh" p="0.2%" my="1.2%" textAlign="center" borderRadius="5%" bg="#e6e6e6" w="10%" onClick={()=>{!loadData && getUsuarios()}}>
                    { loadData ? <Spinner ml="auto" mr="auto" color="#646464" w="0.7vw" h="0.7vw"/> : "Ver mas"} 
                </Text>
            </Flex>
    </Box>
    )
}