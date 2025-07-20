// React, dependencies & packages
import { forwardRef, useState } from "react"

// UI
import { Box, Button, Flex, HStack, chakra, Portal } from "@chakra-ui/react"
import { Menu } from "@ark-ui/react"

// App
import { useReadCities } from "@/hooks/locations/city/useReadCities"
import { useCityContext } from "@/contexts/CityContext"
import { useAuthContext } from "@/contexts/AuthContext"
import Auth from "../auth/Auth"

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
  const [shouldFetchCities, setShouldFetchCities] = useState(false)
  // Get cities list
  const { cities, loading: citiesLoading, error: citiesError } = useReadCities(shouldFetchCities)
  // Save City data selected by user
  const { setSelectedCityId, selectedCityName, setSelectedCityName } = useCityContext()
  // Get user's auth status & account details from context
  const { isAuthenticated, user } = useAuthContext()

  const handleMenuOpen = () => {
    if (!shouldFetchCities) {
      setShouldFetchCities(true)
    }
  }

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
            <Menu.Root onOpenChange={(details) => { if (details.open) { handleMenuOpen() }}}>
            <Menu.Trigger asChild>
              <Button variant="plain" size="xl" colorScheme="whiteAlpha">
                {selectedCityName}
              </Button>
            </Menu.Trigger>

            <Portal>
              <Menu.Positioner>
                <CustomMenuContent>
                  {!citiesLoading && !citiesError && cities.map((city) => (
                    <Menu.Item
                      key={city.id}
                      onClick={() => {
                        setSelectedCityId(city.id)
                        setSelectedCityName(city.name)
                        location.reload()
                      }}
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

          {isAuthenticated && <NavLink href="/profile/">{user?.username}'s profile</NavLink>} 
          <NavLink><Auth /></NavLink>
        </Flex>
      </Flex>
    </Box>
  )
}

export default Navbar