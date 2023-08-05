import { Box, Flex, Select, Spinner, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import api from "../../utils/api";

export default function Servicios (){

    const [servicios, setServicios] = useState(undefined);
    const [ultimoElementoServicios, setUltimoElementoServicios] = useState(false);
    const [filtro, setFiltro] = useState(1);
    const [loadData, setLoadData] = useState(false);
    
    async function getServicios (){

        const filtroData = filtro == 1 ? "fecha" : filtro == 4 ? "fechaPersonalizada" : "masAntiguos";

        setLoadData(true);
        const res = await api("post", "/getServicios", {ultimoElemento: ultimoElementoServicios !== false ? ultimoElementoServicios : undefined, filtro:filtroData})
        setLoadData(false);
        if (res.result[0]) {
            setUltimoElementoServicios(res.result[2]);
            setServicios( (servicios == undefined) ? res.result[1] : [...servicios, ...res.result[1]]);
        } else {
            alert(res.result[1]);
        }
    }

    useEffect(()=>{
        (async()=>{
            if (filtro !== 3) {
                setUltimoElementoServicios(false);
                setServicios(undefined);
                setLoadData(true);

                const filtroData = filtro == 1 ? "fecha" : filtro == 4 ? "fechaPersonalizada" : "masAntiguos";  
                const res = await api("post", "/getServicios", {filtro:filtroData})
                setLoadData(false);
                if (res.result[0]) {
                    setUltimoElementoServicios(res.result[2]);
                    setServicios(res.result[1]);
                } else {
                    alert(res.result[1]);
                }
            } else {

            }
        })();
    }, [filtro]);

    return (
        <Flex pb={ultimoElementoServicios === false ? "2.4%" : "0" } borderRadius="0.5vw" width="80vw" p="1.2vw" border="1px solid #E8E8E8" flexDir="column" mt="4vh">
                <Flex alignItems="center" justifyContent="space-between">
                    <Text ml="1vw" fontSize="3.5vh" fontWeight="800">Servicios</Text>
                    <Box mr="2vw">
                        <Select value={filtro} onChange={(e)=>setFiltro(e.target.value)} borderRadius="1vh" border="1px solid #E8E8E8" fontSize="2.23vh" cursor="pointer">
                            <option value={1} style={{cursor:"pointer", fontSize:"2vh"}}>Mas recientes</option>
                            <option value={2} style={{cursor:"pointer", fontSize:"2vh"}}>Mas antiguos</option>
                            <option value={3} style={{cursor:"pointer", fontSize:"2vh"}}>En curso</option> 
                            <option value={4} style={{cursor:"pointer", fontSize:"2vh"}}>Fecha Personalizada</option>
                        </Select>
                    </Box>
                </Flex>
                <Flex>
                    {   servicios == undefined ?
                            <Spinner ml="auto" mr="auto" color="#646464" my="2vh" w="1.2vw" h="1.2vw"/>
                        : servicios.length > 0 ?
                            <Flex border="1px solid #E8E8E8" flexDir="column" mt="2.5vh">
                                <Flex width="100%" >
                                    <Flex p="1vh" justifyContent="center" w="25%" borderRight="1px solid #E8E8E8">
                                        <Text color="#666666" fontWeight="bold">Usuario</Text>
                                    </Flex>
                                    <Flex p="1vh" justifyContent="center" w="25%" borderRight="1px solid #E8E8E8">
                                        <Text color="#666666" fontWeight="bold">Repartidor</Text>
                                    </Flex>
                                    <Flex p="1vh" justifyContent="center" w="25%" borderRight="1px solid #E8E8E8">
                                        <Text color="#666666" fontWeight="bold">Cantidad de pedidos</Text>
                                    </Flex>
                                    <Flex p="1vh" justifyContent="center" w="25%" borderRight="1px solid #E8E8E8">
                                        <Text color="#666666" fontWeight="bold">Costo total</Text>
                                    </Flex> 
                                </Flex>
                                <Flex borderTop="1px solid #E8E8E8" width="100%">
                                    <Flex p="1vh" justifyContent="center" w="25%" borderRight="1px solid #E8E8E8">
                                        <Text></Text>
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
                        :   <Flex m="1%" ><Text color="#616161">Sin servicios.</Text></Flex>
                    }
                    {<Flex display={ultimoElementoServicios !== false ? "block" : "none"} cursor="pointer" mx="auto" fontSize="2.3vh" p="0.2%" my="1.2%" textAlign="center" borderRadius="5%" bg="#e6e6e6" w="10%" onClick={()=>{!loadData && getServicios()}}>
                        { loadData ? <Spinner ml="auto" mr="auto" color="#646464" w="0.7vw" h="0.7vw"/> : "Ver mas"} 
                    </Flex>}
                </Flex>
            </Flex>
    );
}