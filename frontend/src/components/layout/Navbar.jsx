// React, dependencies & packages
import { useState, forwardRef } from "react"

// UI
import { Box, Button, Flex, HStack, chakra, Portal } from "@chakra-ui/react"
import { Menu } from "@ark-ui/react"

// Components here


const CustomMenuContent = forwardRef((props, ref) => (
  <Menu.Content {...props}>
    <chakra.div
      ref={ref}
      bg="#6B6570"
      color="white"
      borderRadius="md"
      boxShadow="lg"
      py={2}
      minW="150px"
      {...props}
    >
      {props.children}
    </chakra.div>
  </Menu.Content>
))

const NavLink = ({ children, href = "#" }) => (
  <Box
    as="a"
    color="white"
    textDecoration="none"
    rounded="md"
    px={2}
    py={1}
    _hover={{ bg: "#222222" }}
    href={href}
  >
    {children}
  </Box>
)

const Navbar = () => {
  const [selectedCityName, setSelectedCityName] = useState("Choose City");

  const cities = [
    { id: 1, name: "Cluj" },
    { id: 2, name: "Bucuresti" },
    { id: 3, name: "Timisoara" },
    { id: 4, name: "Iasi" },
  ];

  return (
    <Box bg="#7B7E82" w="100%" p={4} color="white">
      <Flex h={12} alignItems="center" justifyContent="space-between">
        <HStack spacing={8} alignItems="center">
          <HStack as="nav" spacing={4} display={{ base: "none", md: "flex" }}>
            <NavLink href="/showtimes">Shows</NavLink>
            <NavLink href="/pricing">Pricing</NavLink>
            <NavLink href="/sweetcard">Sweet Card</NavLink>
            <NavLink href="/newsletter">Newsletter</NavLink>
          </HStack>
        </HStack>

        <Flex alignItems="center" gap={4}>
          <Menu.Root>
            <Menu.Trigger asChild>
              <Button variant="plain" size="sm" colorScheme="whiteAlpha">
                {selectedCityName}
              </Button>
            </Menu.Trigger>

            <Portal>
              <Menu.Positioner>
                <CustomMenuContent>
                  {cities.map((city) => (
                    <Menu.Item
                      key={city.id}
                      onClick={() => setSelectedCityName(city.name)}
                    >
                      <Box
                        px={4}
                        py={2}
                        _hover={{ bg: "#222222" }}
                        cursor="pointer"
                      >
                        {city.name}
                      </Box>
                    </Menu.Item>
                  ))}
                </CustomMenuContent>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>

          <NavLink href="/login">Log In</NavLink>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar