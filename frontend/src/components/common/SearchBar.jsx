// UI
import { Field, Input, Stack } from "@chakra-ui/react"

// Components here


const SearchBar = ({ value, onChange, text }) => {
  return (
    <Stack align="inherit" maxW="max-content">
      <Field.Root>
        <Input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={`Type ${text}...`}
          bg="white"
          color="black"
          size="xs"
        />
      </Field.Root>
    </Stack>
  )
}
export default SearchBar