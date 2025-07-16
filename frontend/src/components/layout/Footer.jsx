// UI
import { Box, chakra, Container, Stack, Text, VisuallyHidden, Link, Flex} from "@chakra-ui/react";
import { FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

// Components here


const FooterLink = ({ children, href }) => (
  <Box
    as="a"
    href={href}
    color="white"
    textDecoration="none"
    _hover={{ bg: "#222222" }}
  >
    {children}
  </Box>
)

const SocialButton = ({ children, href, label }) => {
  return (
    <chakra.button
      as={"a"}
      href={href}
      color={"white"}
      textDecoration={"none"}
      rounded={"full"}
      w={8}
      h={8}
      cursor={"pointer"}
      display={"inline-flex"}
      alignItems={"center"}
      justifyContent={"center"}
      transition={"background 0.3s ease"}
      _hover={{ bg: "#222222" }}
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </chakra.button>
  )
}



const Footer = () => {
  return (
    <Box bg={"#7B7E82"} color={"white"}>
      <Container as={Stack} maxW={"6xl"} py={6} spacing={4}>
        <Flex
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align="center"
          gap={4}
        >

          {/* Footer Links */}
          <Stack direction={"row"} spacing={6}>
            <FooterLink href="#">About Us</FooterLink>
            <FooterLink href="#">Contact</FooterLink>
            <FooterLink href="#">Rules</FooterLink>
            <FooterLink href="#">Help & FAQ</FooterLink>
            <FooterLink href="#">Privacy</FooterLink>
            <FooterLink href="#">Cookies</FooterLink>
          </Stack>

          {/* Social Buttons */}
          <Stack direction={"row"} spacing={6}>
            <SocialButton label={"YouTube"} href={"#"}>
              <FaYoutube />
            </SocialButton>
            <SocialButton label={"Instagram"} href={"#"}>
              <FaInstagram />
            </SocialButton>
            <SocialButton label={"Twitter"} href={"#"}>
              <FaTwitter />
            </SocialButton>
          </Stack>
        </Flex>

        {/* Author text */}
        <Box pt={4} textAlign="center">
          <Text color="white" textDecoration="none">
            &copy; {new Date().getFullYear()} Sweet Cinema project developed by{" "}
            <Link
              href="https://github.com/vladutcretu"
              isExternal
              color="white"
              textDecoration="none"
              _hover={{ bg: "#222222" }}
            >
              Vladut Cretu
            </Link>
          </Text>
        </Box>

      </Container>
    </Box>
  )
}

export default Footer