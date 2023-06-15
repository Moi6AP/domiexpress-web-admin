import { Flex, Spinner, Text } from "@chakra-ui/react";
import Modal from "./modal";

export default function Cargando (props){

    return (
        <Modal position="absolute" isOpen={props.isOpen}>
            <Flex p="1vh" flexDir="column" w="10vw" alignItems="center" >
                <Text mb="1.5vh">{props.txt}</Text>
                <Spinner w="1.3vw" h="1.3vw" />
            </Flex>
        </Modal>
    )
}