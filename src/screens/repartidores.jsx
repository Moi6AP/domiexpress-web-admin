import { Box, Button, Flex, MenuItemOption, Select, Spinner, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { api } from "../utils/api";
import axios from "axios";

export default function Repartidores (){

    const [repartidores, setRepartidores] = useState(undefined);
    const [ultimoElemento, setUltimoElemento] = useState(false);
    
    async function getRepartidores (){
        try {
             await axios.post(api+"/getRepartidores", ultimoElemento !== false && {ultimoElemento:ultimoElemento})
             .then((res)=>{
                if (res.data.result[0]) {
                    setUltimoElemento(res.data.result[2]);
                    setRepartidores( repartidores == undefined ? res.data.result[1] : [...repartidores, ...res.data.result[1]]);
                }
             });
        } catch (error) {
         
        }
     }

     useEffect(()=>{
         getRepartidores()
     }, []);

    return (
        <Box overflowX="hidden" overflowY="scroll" height="100%" width="82vw" p="2vh">
            <Flex borderRadius="0.5vw" width="80vw" p="1.2vw" border="1px solid #E8E8E8" flexDir="column" mt="4vh">
                <Flex alignItems="center" justifyContent="flex-start">
                    <Text ml="1vw" fontSize="3.5vh" fontWeight="800">Solicitudes de Verificación</Text>
                </Flex>
                {   repartidores === undefined ?
                        <Spinner ml="auto" mr="auto" color="#646464" my="2vh" w="1.2vw" h="1.2vw"/>
                    :
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
                                    <Text color="#666666" fontWeight="bold">Fecha de Creación</Text>
                                </Flex>
                            </Flex>
                           { repartidores.map((repartidor)=>(
                                <Flex key={repartidor.uid} borderTop="1px solid #E8E8E8" width="100%">
                                    <Flex p="1vh" justifyContent="center" w="25%" borderRight="1px solid #E8E8E8">
                                        <Text>Moises</Text>
                                    </Flex>
                                    <Flex p="1vh" justifyContent="center" w="25%" borderRight="1px solid #E8E8E8">
                                        <Text>Maicol Perez</Text>
                                    </Flex>
                                    <Flex p="1vh" justifyContent="center" w="25%" borderRight="1px solid #E8E8E8">
                                        <Text>4</Text>
                                    </Flex>
                                    <Flex p="1vh" justifyContent="center" w="25%" borderRight="1px solid #E8E8E8">
                                        <Text>$123.034</Text>
                                    </Flex>
                                </Flex>
                           ))}
                        </Flex>
                }
            </Flex>
            <Flex borderRadius="0.5vw" width="80vw" p="1.2vw" border="1px solid #E8E8E8" flexDir="column" mt="4vh">
                <Flex alignItems="center" justifyContent="space-between">
                    <Text ml="1vw" fontSize="3.5vh" fontWeight="800">Repartidores</Text>
                    <Button transition="all 0.2s" cursor="pointer" _hover={{backgroundColor:"#38C95B"}} mr="1.5vw" borderRadius="1vh" p="1.3vh" bg="#56D675" border="none" >
                        <Text fontWeight="bold" color="#fff">Agregar Usuario</Text>
                    </Button>
                </Flex>
                {   repartidores === undefined ?
                        <Spinner ml="auto" mr="auto" color="#646464" my="2vh" w="1.2vw" h="1.2vw"/>
                    :
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
                                    <Text color="#666666" fontWeight="bold">Fecha de Creación</Text>
                                </Flex>
                            </Flex>
                           { repartidores.map((repartidor)=>(
                                <Flex key={repartidor.uid} borderTop="1px solid #E8E8E8" width="100%">
                                    <Flex p="1vh" justifyContent="center" w="25%" borderRight="1px solid #E8E8E8">
                                        <Text>{repartidor.displayName}</Text>
                                    </Flex>
                                    <Flex p="1vh" justifyContent="center" w="25%" borderRight="1px solid #E8E8E8">
                                        <Text>Maicol Perez</Text>
                                    </Flex>
                                    <Flex p="1vh" justifyContent="center" w="25%" borderRight="1px solid #E8E8E8">
                                        <Text>4</Text>
                                    </Flex>
                                    <Flex p="1vh" justifyContent="center" w="25%" borderRight="1px solid #E8E8E8">
                                        <Text>$123.034</Text>
                                    </Flex>
                                </Flex>
                           ))}
                        </Flex>
                }
            </Flex>
    </Box>
    )
}