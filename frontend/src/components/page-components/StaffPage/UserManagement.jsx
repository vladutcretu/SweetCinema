// React, dependencies & packages
import { useState } from 'react'

// UI
import { Center, Field, Heading, Input } from '@chakra-ui/react'

// App
import { useReadUsers } from '@/hooks/users/staff/useReadUsers'
import { useUpdateStaffGroup } from '@/hooks/users/staff/useUpdateStaffGroup'
import { useUpdateStaffCity } from '@/hooks/users/staff/useUpdateStaffCity'
import useFormState from '@/hooks/useFormState'
import useSearchBar from '@/hooks/useSearchBar'
import SearchBar from '@/components/common/SearchBar'
import SubmitButton from '@/components/common/SubmitButton'
import ReusableTable from '@/components/common/ReusableTable'
import FormWrapper from '@/components/common/FormWrapper'

// Components here


const UserManagement = () => {
  const { users, loading: loadingUsers, error: errorUsers, refetch: getUsers } = useReadUsers()
  const { updateStaffGroup, loading: loadingUpdateUser, error: errorUpdateUser } = useUpdateStaffGroup()
  const { updateStaffCity, loading: loadingSetCashierCity, error: errorSetCashierCity } = useUpdateStaffCity()
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
      case 'city': return user.city
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
  const [action, setAction] = useState([])
  const handleButtonActions = (userId, action) => {
    setUserId(userId)
    if (action === "User") {
        setAction([])
    } else {
        setAction([action])
    }
  }
  const handleSubmitActions = async (event) => {
    event.preventDefault()
    const result = await updateStaffGroup(userId, action)
    if (result) await getUsers()
  }

  // Update city for Cashier
  const { formData: updatedForm, handleChange: handleChangeUpdate, resetForm } = useFormState({ id: "", city: "" })
  const handleSubmitUpdate = (event) => {
    event.preventDefault()
    updateStaffCity(updatedForm.id, updatedForm.city)
    resetForm()
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

      {/* Update city for Cashier */}
      <FormWrapper
        title={"Update city for Cashier"}
        onSubmit={handleSubmitUpdate}
        submitText={"Set city"}
        loading={loadingSetCashierCity}
        error={errorSetCashierCity}
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