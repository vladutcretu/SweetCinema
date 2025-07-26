// React, dependencies & packages
import { useState } from 'react'

// UI
import { Center, Field, Heading, Input } from '@chakra-ui/react'

// App
import { useReadUsers } from '@/hooks/users/staff/useReadUsers'
import { useUpdateUser } from '@/hooks/users/staff/useUpdateUser'
import useFormState from '@/hooks/useFormState'
import useSearchBar from '@/hooks/useSearchBar'
import SearchBar from '@/components/common/SearchBar'
import SubmitButton from '@/components/common/SubmitButton'
import ReusableTable from '@/components/common/ReusableTable'
import FormWrapper from '@/components/common/FormWrapper'

// Components here


const UserManagement = () => {
  const { users, loading: loadingUsers, error: errorUsers, refetch: readUsers } = useReadUsers()
  const { updateUser, loading: loadingUpdateUser, error: errorUpdateUser } = useUpdateUser()
  const { searchTerm, handleChangeSearch, filteredData: filteredUsers } = useSearchBar(users, "username")

  // Build table
  const columns = [
    { key: 'id', title: 'ID' },
    { key: 'user', title: 'Email' },
    { key: 'groups', title: 'Groups' },
    { key: 'city', title: 'City' }
  ]
  const renderCell = (user, column) => {
    switch (column.key) {
      case 'id': return user.id
      case 'user': return `${user.username} / ${user.email}`
      case 'groups': return user.groups.join(", ")
      case 'city': return user.city_id
    }
  }
  const renderActions = (user) => (
    <form onSubmit={handleSubmitActions}>
      <SubmitButton
        onClick={() => handleButtonActions(user.id, "Manager")}
        loading={loadingUpdateUser}
        text={"Manager"}
      />
      <SubmitButton
        onClick={() => handleButtonActions(user.id, "Employee")}
        loading={loadingUpdateUser}
        text={"Employee"}
      />
      <SubmitButton
        onClick={() => handleButtonActions(user.id, "Cashier")}
        loading={loadingUpdateUser}
        text={"Cashier"}
      />
      <SubmitButton
        onClick={() => handleButtonActions(user.id, "User")}
        loading={loadingUpdateUser}
        text={"User"}
      />
    </form>
  )

  // Update user Group
  const [userId, setUserId] = useState("")
  const [group, setGroup] = useState([])
  const handleButtonActions = (userId, group) => {
    setUserId(userId)
    if (group === "User") {
        setGroup([])
    } else {
        setGroup([group])
    }
  }
  const handleSubmitActions = async (event) => {
    event.preventDefault()
    const result = await updateUser(userId, group)
    if (result) await readUsers()
  }

  // Update user City
  const { formData: updatedForm, handleChange: handleChangeUpdate, resetForm } = useFormState({ id: "", group: "", city: "" })
  const handleSubmitUpdate = async (event) => {
    event.preventDefault()
    const result = await updateUser(updatedForm.id, group, updatedForm.city)
    if (result) {
      resetForm()
      await readUsers()
    }
  }

  return (
    <>
      <Center><Heading size="xl">User Management</Heading></Center>

      {/* Search Bar */}
      <SearchBar value={searchTerm} onChange={handleChangeSearch} text={"username"} />

      {/* User table & Update user group */}
      <ReusableTable
        loading={loadingUsers}
        error={errorUsers}
        additionalErrors={[errorUpdateUser].filter(Boolean)}
        data={filteredUsers}
        columns={columns}
        renderCell={renderCell}
        renderActions={renderActions}
        noDataMessage="No users found!"
      />

      {/* Update city */}
      <FormWrapper
        title={"Update city"}
        onSubmit={handleSubmitUpdate}
        submitText={"Set city"}
        loading={loadingUpdateUser}
        error={errorUpdateUser}
      >
        <Field.Label>User ID:</Field.Label>
          <Input
            type="number"
            min={1}
            name="id"
            value={updatedForm.id}
            onChange={handleChangeUpdate}
            bg="white"
            color="black"
          />
        <Field.Label>City name:</Field.Label>
          <Input
            type="text"
            name="city"
            value={updatedForm.city}
            onChange={handleChangeUpdate}
            placeholder="London"
            bg="white"
            color="black"
          />
        </FormWrapper>
    </>
  )
}
export default UserManagement