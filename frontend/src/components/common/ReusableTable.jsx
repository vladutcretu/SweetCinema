// UI
import { Text, Spinner, Table } from '@chakra-ui/react'

// Components here 


// Props example:
  // additionaErrors = {[<errorName>]}.filter(Boolean)
  // columns = [ {key: "index1", title: "text1"}, {key: "index2", title: "text2"} ]
  // renderCell = (object, column) => { 
    // switch (column.key) {
      // case "index1": return `${object.field1} stringText`
      // case "index2": return object.field2
      // default: return object[column.key]
  // const renderActions = (booking) => [ <Button /> ]

const ReusableTable = ({ 
    loading, 
    error, 
    additionalErrors = [],
    columns, // columns const to render header row
    data, 
    noDataMessage = "No results found!",
    renderCell = (item, column) => item[column.key], // renderCell const to render body rows
    renderActions, // renderActions const to render actions
    rowKey = "id"
}) => {
  // Manage loading state
  if (loading) return <Spinner />
  // Manage error(s) state
  const allErrors = error ? [error, ...additionalErrors] : additionalErrors
  if (allErrors.length > 0) {
    return (
      <div>
        {allErrors.map((error, index) => (
          <Text key={index} color="red.400">{error}</Text>
        ))}
      </div>
    )
  }
  // Manage no entries in received data
  if (!data?.length) return <Text>{noDataMessage}</Text>

  // Build table
  return (
    <Table.Root interactive showColumnBorder variant="outline">
      <Table.Header>
        <Table.Row>
          {/* Build header row for given columns parameter */}
          {columns.map((column) => (
            <Table.ColumnHeader key={column.key}>{column.title}</Table.ColumnHeader>
          ))}
          {/* If renderActions given build Action column */}
          {renderActions && <Table.ColumnHeader>Actions</Table.ColumnHeader>}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {/* Build body rows for given data paramter */}
        {data.map((item) => (
          <Table.Row key={item[rowKey]}>
            {columns.map((column) => (
              <Table.Cell key={column.key}>{renderCell(item, column)}</Table.Cell>
            ))}
            {/* If renderActions given render action buttons */} 
            {renderActions && <Table.Cell>{renderActions(item)}</Table.Cell>}
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  )
}
export default ReusableTable