const downloadPdf = (base64Pdf: string) => {
  const link = document.createElement('a')
  link.href = `data:application/pdf;base64,${base64Pdf}`
  link.download = 'download.pdf' // Specify the name of the file to download
  link.click()
}

export default downloadPdf
