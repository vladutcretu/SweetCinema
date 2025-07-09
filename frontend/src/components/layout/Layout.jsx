// UI
import { Box } from "@chakra-ui/react"

// App
import Footer from "./Footer"
import Header from "./Header"
import Navbar from "./Navbar"

// Components here


const Layout = ({ children }) => {
  return (
    <>
    <Header />
    <Navbar />
    <Box
      bg="#222222"
      fontFamily="Helvetica, Arial, sans-serif, system-ui"
      lineHeight="1.5"
      fontWeight="400"
      color="#FFFFFF"
      flex="1"
      p="2rem"
      w="100%"
      display="flex"
      flexDirection="column"
      minH="100vh"
    >
      {children}
    </Box>
    <Footer />
    </>
  )
}
export default Layout