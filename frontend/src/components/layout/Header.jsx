// UI
import { Box, Text } from "@chakra-ui/react"

// Components here


const HeaderLink = ({ children, href }) => (
  <Box
    as="a"
    href={href}
    color="white"
    textDecoration="none"
  >
    {children}
  </Box>
)

const Header = () => {
  return (
    <Box
      as="header"
      bg="#222222"
      w="100%"
      h="100px"
      display="flex"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      boxShadow="md"
    >
      <Text
        fontSize={{ base: "2xl", md: "3xl" }}
        fontWeight="bold"
        color="white"
        letterSpacing="wide"
      >
        <HeaderLink href={"/"}>Sweet Cinema</HeaderLink>
      </Text>
    </Box>
  )
}

export default Header