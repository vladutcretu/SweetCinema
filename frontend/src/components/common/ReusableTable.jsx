// UI
import { Text, Spinner, Stack, Table, Pagination, ButtonGroup, IconButton } from '@chakra-ui/react'
import { LuChevronLeft, LuChevronRight, LuArrowUp, LuArrowDown } from "react-icons/lu"

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
    data, // { count, next, previous, results }
    noDataMessage = "No results found!",
    renderCell = (item, column) => item[column.key], // renderCell const to render body rows
    renderActions, // renderActions const to render actions
    rowKey = "id",
    // Paginate
    page,
    pageSize,
    onPageChange,
    // Ordering
    sortField,
    sortOrder,
    onSortChange, // (field, order)
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
  if (!data?.results?.length) return <Text>{noDataMessage}</Text>

  // Manage ordering by field
  const handleSort = (col) => {
    if (!col.sortable) return
    let newOrder = "asc"
    if (sortField === col.key && sortOrder === "asc") newOrder = "desc"
    onSortChange(col.key, newOrder)
  }

  // Build table
  return (
    <Stack width="full" gap="5">
      <Table.Root interactive showColumnBorder variant="outline" size="sm">
        <Table.Header>
          <Table.Row>
            {/* Build header row for given columns parameter */}
            {columns.map((column) => (
              <Table.ColumnHeader 
                key={column.key}
                onClick={() => handleSort(column)}
                style={{cursor: column.sortable ? "pointer" : "default", userSelect: "none"}}
              >
                {column.title}
                {column.sortable && sortField === column.key && (
                  sortOrder === "asc" ? (
                    <LuArrowUp style={{ display: "inline", marginLeft: 4 }}/>
                  ) : (
                    <LuArrowDown style={{ display: "inline", marginLeft: 4 }} /> 
                  )
                )}
              </Table.ColumnHeader>
            ))}
            {/* If renderActions given build Action column */}
            {renderActions && <Table.ColumnHeader>Actions</Table.ColumnHeader>}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {/* Build body rows for given data paramter */}
          {data.results.map((item)=> (
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

      {/* Pagination */}
      <Pagination.Root
        count={data.count}
        pageSize={pageSize}
        page={page}
        onPageChange={(details) => onPageChange(details.page)}
      >
        <ButtonGroup variant="ghost" size="sm" wrap="wrap">
          <Pagination.PrevTrigger asChild>
            <IconButton isDisabled={!data.previous}>
              <LuChevronLeft />
            </IconButton>
          </Pagination.PrevTrigger>

          <Pagination.Items
            render={(p) => (
              <IconButton
                key={p.value}
                variant={p.value === page ? "outline" : "ghost"}
                onClick={() => onPageChange(p.value)}
              >
                {p.value}
              </IconButton>
            )}
          />

          <Pagination.NextTrigger asChild>
            <IconButton isDisabled={!data.next}>
              <LuChevronRight />
            </IconButton>
          </Pagination.NextTrigger>
        </ButtonGroup>
      </Pagination.Root>
    </Stack>
  )
}
export default ReusableTable