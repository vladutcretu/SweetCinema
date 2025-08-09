// UI
import { Box, Heading, Stack, Text } from "@chakra-ui/react"

// App
import { useAuthContext } from "@/contexts/AuthContext"
import { useReadUser } from "@/hooks/users/useReadUser"
import { useUpdateUser } from "@/hooks/users/useUpdateUser"
import ForwardButton from "@/components/common/ForwardButton"
import SubmitButton from "@/components/common/SubmitButton"

// Components here


const Newsletter = () => {
  const { user: userId } = useAuthContext()
  const { user, loading: loadingUser, error: errorUser, refetch: readUser } = useReadUser(userId?.id)
  const { updateUser, loading: loadingUpdateUser, error: errorUpdateUser } = useUpdateUser()

  // Update newsletter status
  const handleUpdate = async (value) => {
    if (!userId?.id) return
    const result = await updateUser(userId?.id, { receive_newsletter: value })
    if (result) await readUser(userId?.id)
  }

  return (
    <Box px={6} py={10}>
      <Stack spacing={8}>
        <Heading mb={6}>Newsletter</Heading>
    
        <Box
          bg="#7B7E82"
          borderRadius="lg"
          p={6}
          boxShadow="md"
        >
          <Text>
            By subscribing to the newsletter, you will receive every Sunday, at 12:00 PM, 
            the program for the following week at the Happy Cinema in your city.
          </Text>

          <br />

          {!userId?.city_id && !user.city_name && ( 
            <>
              <Text>You do not have set a city for your account. Please do it in order to activate newsletter!</Text>
              <ForwardButton to={'/profile/'} text={'profile'}/>
            </>
          )}
          
          {userId?.city_id && user.city_name && (
            <>
              <Text><b>Receive newsletter for {user.city_name}?</b> {user.receive_newsletter === true ? "✅" : "❌"}</Text>
              {   
                user?.receive_newsletter === true ? (
                <SubmitButton 
                  onClick={() => handleUpdate(false)} 
                  loading={loadingUpdateUser} 
                  text={"Unubscribe"}
                />
              ) : (
                <SubmitButton 
                  onClick={() => handleUpdate(true)} 
                  loading={loadingUpdateUser} 
                  text={"Subscribe"}
                />
              )}
            </>
          )}
        </Box>
      </Stack>
    </Box>
  )
}
export default Newsletter