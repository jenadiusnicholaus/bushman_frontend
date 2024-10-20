const handleErrors = (errorResponse: any) => {
  // Reset errors array
  const errors: string[] = []

  // Log the entire error response for debugging
  console.log(errorResponse)

  // Check if the error response exists

  // Check if the error has a response from the server
  if (errorResponse) {
    const { status, data } = errorResponse
    console.log(status)

    // Handle different server error statuses

    // Check if data exists and is an object
    if (data && typeof data === 'object') {
      for (const field in data) {
        // Format error messages
        errors.push(`${field.replace(/_/g, ' ')}: ${data[field]}`)
      }
    } else {
      errors.push('Unexpected server response format.')
    }
  } else if (errorResponse.request) {
    // Handle cases where request was made but no response received
    errors.push('No response received from the server. Please check your network connection.')
  } else {
    // Handle other errors
    errors.push(`Error: ${errorResponse.message || 'An unknown error occurred.'}`)
  }

  return errors
}

export default handleErrors
