const getStatusColor = (status: any) => {
  const statusMapping: any = {
    pending: 'secondary',
    provision_sales: 'warning',
    confirmed: 'success',
    declined: 'danger',
    cancelled: 'danger',
    completed: 'success',
  }
  return statusMapping[status] || 'default'
}

export default getStatusColor
