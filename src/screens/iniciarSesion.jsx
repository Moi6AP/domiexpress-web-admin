import { Flex, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";


export default function IniciarSesion (){

    const navigate = useNavigate();

    return (
        <Flex>
            <Text onClick={()=>navigate("/asdsad")}>brrrrrrr</Text>
        </Flex>
    )
}