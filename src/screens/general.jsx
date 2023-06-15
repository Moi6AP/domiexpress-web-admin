import { Box, Button, Flex, MenuItemOption, Select, Spinner, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { api } from "../utils/api";
import axios from "axios";

export default function General ({general}){

    const [infoGeneral, setInfoGeneral] = useState({usuarios:undefined, repartidores:undefined, pedidosTotal:undefined, pedidosEnCurso:undefined});
    const [usersAdmin, setUsersAdmin] = useState(undefined);
    const [costoServicios, setCostoServicios] = useState(undefined);
    const [servicios, setServicios] = useState(undefined);


    async function getPedidos (){

    }

    async function getRepartidores (){
       try {
            await axios.post(api+"/getRepartidores")
            .then((res)=>{
                
            });
       } catch (error) {
        
       }
    }

    useEffect(()=>{
        getRepartidores()
    }, []);

    return (
        <Box overflowX="hidden" overflowY="scroll" height="100%" width="82vw" p="2vh">
            <Flex>
                <Flex width="10vw" justifyContent="center" alignItems="center" borderRadius="0.5vw" p="2vh" border="1px solid #E8E8E8">
                    <span style={{width:"2vw"}} className="material-symbols-outlined">sports_motorsports</span> 
                    <Box ml="0.5vw">
                        <Text fontWeight="500" color="#8A8A8A" >Repartidores</Text>
                        <Flex justifyContent="center">
                            {infoGeneral.repartidores === undefined ?  
                                <Spinner color="#646464" mt="1vh" w="1vw" h="1vw"/>
                                : <Text color="#4B4B4B" fontSize="3.5vh" fontWeight="bold">203</Text>}
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
                                : <Text color="#4B4B4B" fontSize="3.5vh" fontWeight="bold">343</Text>}
                        </Flex>
                    </Box>
                </Flex>
                <Flex ml="1.5vw" width="15vw" justifyContent="center" alignItems="center" borderRadius="0.5vw" p="2vh" border="1px solid #E8E8E8">
                    <span style={{width:"2vw"}} className="material-symbols-outlined">shield_person</span> 
                    <Box ml="0.5vw">
                        <Text fontWeight="500" color="#8A8A8A" >Usuarios Admin</Text>
                        <Flex justifyContent="center">
                            {infoGeneral.repartidores === undefined ?  
                                <Spinner color="#646464" mt="1vh" w="1vw" h="1vw"/>
                                : <Text color="#4B4B4B" fontSize="3.5vh" fontWeight="bold">3</Text>}
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
                                : <Text color="#4B4B4B" fontSize="3.5vh" fontWeight="bold">256</Text>}
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
                                : <Text color="#4B4B4B" fontSize="3.5vh" fontWeight="bold">26</Text>}
                        </Flex>
                    </Box>
                </Flex>
            </Flex>

            <Flex borderRadius="0.5vw" width="80vw" p="1.2vw" border="1px solid #E8E8E8" flexDir="column" mt="4vh">
                <Flex alignItems="center" justifyContent="space-between">
                    <Text ml="1vw" fontSize="3.5vh" fontWeight="800">Usuarios Administradores</Text>
                    <Button transition="all 0.2s" cursor="pointer" _hover={{backgroundColor:"#38C95B"}} mr="1.5vw" borderRadius="1vh" p="1.3vh" bg="#56D675" border="none" >
                        <Text fontWeight="bold" color="#fff">Agregar Usuario</Text>
                    </Button>
                </Flex>
                {   usersAdmin == undefined ?
                        <Spinner ml="auto" mr="auto" color="#646464" my="2vh" w="1.2vw" h="1.2vw"/>
                    :
                        <Flex border="1px solid #E8E8E8" flexDir="column" mt="2.5vh">
                            <Flex width="100%" >
                                <Flex p="1vh" justifyContent="center" w="25%" borderRight="1px solid #E8E8E8">
                                    <Text color="#666666" fontWeight="bold">Usuario</Text>
                                </Flex>
                                <Flex p="1vh" justifyContent="center" w="25%" borderRight="1px solid #E8E8E8">
                                    <Text color="#666666" fontWeight="bold">Repartidor</Text>
                                </Flex>
                                <Flex p="1vh" justifyContent="center" w="25%" borderRight="1px solid #E8E8E8">
                                    <Text color="#666666" fontWeight="bold">Pedidos</Text>
                                </Flex>
                                <Flex p="1vh" justifyContent="center" w="25%" borderRight="1px solid #E8E8E8">
                                    <Text color="#666666" fontWeight="bold">Costo</Text>
                                </Flex>
                            </Flex>
                            <Flex borderTop="1px solid #E8E8E8" width="100%">
                                <Flex p="1vh" justifyContent="center" w="25%" borderRight="1px solid #E8E8E8">
                                    <Text>Moises Avila</Text>
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
                        </Flex>
                }
            </Flex>

            <Flex borderRadius="0.5vw" width="80vw" p="1.2vw" border="1px solid #E8E8E8" flexDir="column" mt="4vh">
                <Flex alignItems="center" justifyContent="space-between">
                    <Text ml="1vw" fontSize="3.5vh" fontWeight="800">Costo de los Servicios</Text>
                    <Button transition="all 0.2s" cursor="pointer" _hover={{backgroundColor:"#38C95B"}} mr="1.5vw" borderRadius="1vh" p="1.3vh" bg="#56D675" border="none" >
                        <Text fontWeight="bold" color="#fff">Agregar costo</Text>
                    </Button>
                </Flex>
                {   costoServicios == undefined ?
                        <Spinner ml="auto" mr="auto" color="#646464" my="2vh" w="1.2vw" h="1.2vw"/>
                    :
                        <Flex overflowX="scroll" mt="1.5vh" border="1px solid #E8E8E8" width="100%" >
                            <Flex p="1vh" justifyContent="center" w="25%" borderRight="1px solid #E8E8E8">
                                <Text color="#666666" fontWeight="bold">10km - $12.000</Text>
                            </Flex>
                            <Flex p="1vh" justifyContent="center" w="25%" borderRight="1px solid #E8E8E8">
                                <Text color="#666666" fontWeight="bold">20km - $15.000</Text>
                            </Flex>
                            <Flex p="1vh" justifyContent="center" w="25%" borderRight="1px solid #E8E8E8">
                                <Text color="#666666" fontWeight="bold">25km - $17.000</Text>
                            </Flex>
                            <Flex p="1vh" justifyContent="center" w="25%" borderRight="1px solid #E8E8E8">
                                <Text color="#666666" fontWeight="bold">45km - $25.000</Text>
                            </Flex>
                        </Flex>   
                }
            </Flex>

            <Flex borderRadius="0.5vw" width="80vw" p="1.2vw" border="1px solid #E8E8E8" flexDir="column" mt="4vh">
                <Flex alignItems="center" justifyContent="space-between">
                    <Text ml="1vw" fontSize="3.5vh" fontWeight="800">Servicios</Text>
                    <Box mr="2vw">
                        <Select borderRadius="1vh" border="1px solid #E8E8E8" fontSize="2.23vh" cursor="pointer">
                            <option style={{cursor:"pointer", fontSize:"2vh"}}>En curso</option>
                            <option style={{cursor:"pointer", fontSize:"2vh"}}>Fecha Personalizada</option>
                        </Select>
                    </Box>
                </Flex>
                {   servicios == undefined ?
                        <Spinner ml="auto" mr="auto" color="#646464" my="2vh" w="1.2vw" h="1.2vw"/>
                    :
                        <Flex border="1px solid #E8E8E8" flexDir="column" mt="2.5vh">
                            <Flex width="100%" >
                                <Flex p="1vh" justifyContent="center" w="25%" borderRight="1px solid #E8E8E8">
                                    <Text color="#666666" fontWeight="bold">Usuario</Text>
                                </Flex>
                                <Flex p="1vh" justifyContent="center" w="25%" borderRight="1px solid #E8E8E8">
                                    <Text color="#666666" fontWeight="bold">Repartidor</Text>
                                </Flex>
                                <Flex p="1vh" justifyContent="center" w="25%" borderRight="1px solid #E8E8E8">
                                    <Text color="#666666" fontWeight="bold">Pedidos</Text>
                                </Flex>
                                <Flex p="1vh" justifyContent="center" w="25%" borderRight="1px solid #E8E8E8">
                                    <Text color="#666666" fontWeight="bold">Costo</Text>
                                </Flex>
                            </Flex>
                            <Flex borderTop="1px solid #E8E8E8" width="100%">
                                <Flex p="1vh" justifyContent="center" w="25%" borderRight="1px solid #E8E8E8">
                                    <Text>Moises Avila</Text>
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
                            <Flex borderTop="1px solid #E8E8E8" width="100%">
                                <Flex p="1vh" justifyContent="center" w="25%" borderRight="1px solid #E8E8E8">
                                    <Text>Moises Avila</Text>
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
                            <Flex borderTop="1px solid #E8E8E8" width="100%">
                                <Flex p="1vh" justifyContent="center" w="25%" borderRight="1px solid #E8E8E8">
                                    <Text>Moises Avila</Text>
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
                        </Flex>      
                }
            </Flex>
        </Box>
    )
}