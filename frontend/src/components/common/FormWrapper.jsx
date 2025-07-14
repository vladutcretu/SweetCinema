// UI
import { Heading, Stack, Field, Text } from "@chakra-ui/react"
import SubmitButton from "./SubmitButton"

// Components here


const FormWrapper = ({
    title, 
    onSubmit,
    submitText,
    loading,
    error,
    children
}) => {
  return (
    <Stack align="inherit" maxW="max-content" mt={10}>
      <Heading size="md">{title}</Heading>
        <form onSubmit={onSubmit}>
          <Field.Root>
            {children}
            <SubmitButton loading={loading} text={submitText} />
            {error && <Text color="red.400">{error}</Text>}
          </Field.Root>
        </form>
    </Stack>
  )
}
export default FormWrapper