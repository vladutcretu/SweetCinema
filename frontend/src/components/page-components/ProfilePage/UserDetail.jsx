// React, dependencies & packages
import React, { useState } from 'react'

// UI
import { Box, Heading, SimpleGrid, Text, Stack, Field, Input, Button } from '@chakra-ui/react'

// App
import { useAuthContext } from '@/contexts/AuthContext'
import { useReadUser } from '@/hooks/users/useReadUser'
import { useUpdateUser } from '@/hooks/users/useUpdateUser'
import SubmitButton from '@/components/common/SubmitButton'
import ForwardButton from '@/components/common/ForwardButton'

// Components here


const UserDetail = () => {
  const { user: userId } = useAuthContext()
  const { user, loading: loadingUser, error: errorUser, refetch: readUser } = useReadUser(userId?.id)
  const { updateUser, loading: loadingUpdateUser, error: errorUpdateUser } = useUpdateUser()

  // Update user details
  const [showUpdateForm, setShowUpdateForm] = useState(false)
  const [formData, setFormData] = useState({
    city_name: user?.city_name,
    birthday: user?.birthday,
    receive_promotions: user?.receive_promotions ?? false,
  })

  const handleUpdateSubmit = async (event) => {
    event.preventDefault()
    const result = await updateUser(userId?.id, formData)
    if (result) {
      setShowUpdateForm(false)
      await readUser(userId?.id)
    }
  }

  return (
    <Box
      bg="#4B4E6D"
      borderRadius="lg"
      p={6}
      boxShadow="md"
      mt={3}
    >
      <Heading size="xl">Your preferences:</Heading>
        {(user.receive_promotions === false || user.city_name === null || user.brithday === null) ? (
          <Text>
            <b>{user.first_name}</b>, if you want to receive promotional emails from us please turn on promotions, 
            set a city and add a birthday!
          </Text>
        ) : (
          <Text>
            <b>{user.first_name}</b>, you will receive an email whenever a promotion or a discount code is available for you!
          </Text>
        )}

        <SimpleGrid columns={3} spacing={2}>
          <Text><b>Receive promotions?</b> {user?.receive_promotions === true ? "✅" : "❌"}</Text>
          <Text><b>City:</b> {user?.city_name ? user.city_name : "not set!"}</Text>
          <Text><b>Birthday:</b> {user.birthday ? user.birthday : "not set!"}</Text>
        </SimpleGrid>

        {/* Update details */}
        <Button mt={4} size="sm" onClick={() => setShowUpdateForm(!showUpdateForm)}>
          {showUpdateForm ? "Cancel Update" : "Update Preferences"}
        </Button>

        {showUpdateForm && (
          <Box mt={4} p={4} bg="#7B7E82" color="white" borderRadius="md">
            <form onSubmit={handleUpdateSubmit}>
              <Stack spacing={4}>

                {/* Receive promotions */}
                <Field.Root>
                  <Field.Label>Receive Promotions?</Field.Label>
                  <div>
                    <label>
                      <input
                        type="radio"
                        name="receive_promotions"
                        value="true"
                        checked={formData.receive_promotions === true}
                        onChange={() =>
                          setFormData({ ...formData, receive_promotions: true })
                        }
                      />
                        Yes
                      </label>
                      <label style={{ marginLeft: "1rem" }}>
                        <input
                          type="radio"
                          name="receive_promotions"
                          value="false"
                          checked={formData.receive_promotions === false}
                          onChange={() =>
                            setFormData({ ...formData, receive_promotions: false })
                          }
                        />
                        No
                      </label>
                  </div>
                </Field.Root>

                {/* City */}
                <Field.Root>
                  <Field.Label>City:</Field.Label>
                  <Input
                    type="text"
                    name="city_name"
                    placeholder="Write city name..."
                    value={formData.city}
                    onChange={(event) => setFormData({ ...formData, city_name: event.target.value })}
                    size="sm"
                  />
                </Field.Root>

                {/* Birthday */}
                {!user.birthday && (
                  <Field.Root>
                    <Field.Label>Birthday:</Field.Label>
                    <Input
                      type="date"
                      name="birthday"
                      value={formData.birthday}
                      onChange={(event) => setFormData({ ...formData, birthday: event.target.value })}
                      size="sm"
                    />
                  </Field.Root>
                )}

                {/* Submit button */}
                <SubmitButton loading={false} text="Save Changes" />
              </Stack>
            </form>
          </Box>
        )}

        {/* Newsletter show status and link to page */}
        <br /><br />
        <Text><b>Receive newsletter?</b> {user?.receive_newsletter === true ? "✅" : "❌"}</Text>
        <ForwardButton to={'/newsletter'} text={"Newsletter"}/>
    </Box>
  )
}
export default UserDetail