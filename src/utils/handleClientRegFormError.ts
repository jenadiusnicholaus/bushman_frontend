const handleErrors = (errorResponse: any) => {
  // Reset errors object
  const errors = []

  // Assign new error messages
  if (errorResponse && errorResponse.response && errorResponse.response.data) {
    const data = errorResponse.response.data
    for (const field in data) {
      errors.push(`${field.replace(/_/g, ' ')}: ${data[field]}`)
    }
  }
  return errors
}

export default handleErrors
