import { Box, Flex } from "@chakra-ui/react"

export default function Modal (props){
    
    return (
        <Flex zIndex={props.load && 1500} display={props.isOpen ? "flex" : "none"} justifyContent="center" alignItems="center" position="absolute" left="0" top="0" height="100%" width="100vw" >
            <Box onClick={()=>{props.onClose && props.onClose()}} zIndex="1" top="0" left="0" bottom="0" right="0" bg="rgba(0, 0, 0, 0.5)" position="absolute" />
            <Flex boxShadow="0px 0px 6px 1px #6F6F6F" zIndex="100" borderRadius="0.7vh" bg="#fff" p="1vw">
                { props.children } 
            </Flex>
        </Flex>
    )
}