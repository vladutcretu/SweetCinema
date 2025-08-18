// React, depedencies & packages
import { useState } from "react"

// UI
import { Box, Heading, Stack, Text, Input, Button, Spinner } from "@chakra-ui/react"

// App
import { useVerifyPass } from "@/hooks/users/staff/useVerifyPass"
import { useResetPass } from "@/hooks/users/staff/useResetPass"
import SubmitButton from "@/components/common/SubmitButton"

// Components here


const StaffVerifyPass = () => {
  const { verifyPasswordStaff, loading, error } = useVerifyPass()
  const { resetPasswordStaff, loading: loadingReset, error: errorReset} = useResetPass()
  const [password, setPassword] = useState("")
    
  const handleChange = (event) => {
    setPassword(event.target.value)
  }
    
  const handleSubmit = (event) => {
    event.preventDefault()
    verifyPasswordStaff(password)
    setPassword("")
  }
    
  if (loading) return <Spinner />
  if (error || errorReset) return <Text color="red.400">{error || errorReset}</Text>
    
  return (
    <Box px={6} py={10}>
      <Stack spacing={8}>
        <Heading mb={6}>Staff - Verify Password</Heading>
        <Box
          bg="#7B7E82"
          borderRadius="lg"
          p={6}
          boxShadow="md"
        >
          <Text>Please enter the password to access Staff Dashboard!</Text>
          <form onSubmit={handleSubmit}>
            <Stack align="inherit" maxW="max-content">
              <Input type="password" value={password} onChange={handleChange} required />
              <Button type="submit">{loading ? <Spinner size="sm" mr={2} /> : "Verify password"}</Button>
            </Stack>
          </form>
          <br />
          <Stack align="inherit" maxW="max-content">
            <Text>Did you forget your password or you want to change it?</Text>
            <SubmitButton 
              onClick={() => resetPasswordStaff()}
              loading={loadingReset} 
              text={"Change / Recover password"}
            />
          </Stack>
        </Box>
      </Stack>
    </Box>
  )
}
export default StaffVerifyPass