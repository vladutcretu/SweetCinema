// React, depedencies & packages
import { useState } from "react"

// UI
import { Box, Heading, Stack, Text, Input, Button, Spinner } from "@chakra-ui/react"

// App
import { useStaffSetPass } from "@/hooks/users/staff/useStaffSetPass"

// Components here


const StaffSetPass = () => {
  const { setPasswordStaff, loading, error } = useStaffSetPass()
  const [password, setPassword] = useState("")

  const handleChange = (event) => {
    setPassword(event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setPasswordStaff(password)
    setPassword("")
  }

  if (loading) return <Spinner />
  if (error) return <Text color="red.400">{error}</Text>

  return (
    <Box px={6} py={10}>
      <Stack spacing={8}>
        <Heading mb={6}>Staff - Set Password</Heading>
        <Box
          bg="#7B7E82"
          borderRadius="lg"
          p={6}
          boxShadow="md"
        >
          <Text>You don't have a password for your account, please set it in order to access Staff Dashboard!</Text>
          <form onSubmit={handleSubmit}>
            <Stack align="inherit" maxW="max-content">
              <Input type="password" value={password} onChange={handleChange} required />
              <Button type="submit">{loading ? <Spinner size="sm" mr={2} /> : "Set password"}</Button>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Box>
  )
}
export default StaffSetPass