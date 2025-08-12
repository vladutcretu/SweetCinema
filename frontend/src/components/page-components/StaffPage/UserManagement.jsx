// React, dependencies & packages
import { useState } from 'react'

// UI
import { Center, Field, Heading, Input } from '@chakra-ui/react'

// App
import { useReadUsers } from '@/hooks/users/staff/useReadUsers'
import { useUpdateUser } from '@/hooks/users/useUpdateUser'
import useFormState from '@/hooks/useFormState'
import SubmitButton from '@/components/common/SubmitButton'
import ReusableTable from '@/components/common/ReusableTable'
import FormWrapper from '@/components/common/FormWrapper'

// Components here


const UserManagement = () => {
  const { 
    users,
    page, 
    setPage, 
    pageSize, 
    setPageSize,
    sortField, 
    setSortField,
    sortOrder,
    setSortOrder,
    loading: loadingUsers, 
    error: errorUsers, 
    refetch: readUsers 
  } = useReadUsers()
  const { updateUser, loading: loadingUpdateUser, error: errorUpdateUser } = useUpdateUser()

  // Build table
  const columns = [
    { key: 'id', title: 'ID', sortable: true },
    { key: 'user', title: 'User' },
    { key: 'role', title: 'Role / Staff / Superuser', sortable: true },
    { key: 'city', title: 'City' },
    { key: 'preferences', title: 'Preferences' }
  ]
  const renderCell = (user, column) => {
    switch (column.key) {
      case 'id': return user.id
      case 'user': return `${user.username} / ${user.email}`
      case 'role' : return `${user.role} / ${user.is_staff} / ${user.is_superuser}`
      case 'city': return user.city_name
      case 'preferences': return `Birthday: ${user.birthday}, Promotions: ${user.receive_promotions}, Newsletter: ${user.receive_newsletter}`
    }
  }
  const renderActions = (user) => (
    <form onSubmit={handleSubmitActions}>
      <SubmitButton
        onClick={() => handleButtonActions(user.id, { role: "manager" })}
        loading={loadingUpdateUser}
        text={"Manager"}
      />
      <SubmitButton
        onClick={() => handleButtonActions(user.id, { role: "planner" })}
        loading={loadingUpdateUser}
        text={"Planner"}
      />
      <SubmitButton
        onClick={() => handleButtonActions(user.id, { role: "cashier" })}
        loading={loadingUpdateUser}
        text={"Cashier"}
      />
      <SubmitButton
        onClick={() => handleButtonActions(user.id, { role: "standard" })}
        loading={loadingUpdateUser}
        text={"Standard"}
      />
    </form>
  )

  // Update user Group
  const [userId, setUserId] = useState("")
  const [role, setRole] = useState({})
  const handleButtonActions = (userId, role) => {
    setUserId(userId)
    setRole(role)
  }
  const handleSubmitActions = async (event) => {
    event.preventDefault()
    const result = await updateUser(userId, role)
    if (result) await readUsers()
  }

  // Update user City
  const { formData: updatedForm, handleChange: handleChangeUpdate, resetForm } = useFormState({ id: "", role: "", city_name: "" })
  const handleSubmitUpdate = async (event) => {
    event.preventDefault()
    const result = await updateUser(updatedForm.id, { city_name: updatedForm.city_name })
    if (result) {
      resetForm()
      await readUsers()
    }
  }

  return (
    <>
      <Center><Heading size="xl">User Management</Heading></Center>

      {/* User table & Update user role */}
      <ReusableTable
        loading={loadingUsers}
        error={errorUsers}
        additionalErrors={[errorUpdateUser].filter(Boolean)}
        data={users}
        columns={columns}
        renderCell={renderCell}
        renderActions={renderActions}
        noDataMessage="No users found!"
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        sortField={sortField}
        sortOrder={sortOrder}
        onSortChange={(field, order) => {
          setSortField(field)
          setSortOrder(order)
          setPage(1)
        }}
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
            name="city_name"
            value={updatedForm.city_name}
            onChange={handleChangeUpdate}
            placeholder="City name..."
            bg="white"
            color="black"
          />
        </FormWrapper>
    </>
  )
}
export default UserManagement