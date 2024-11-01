// import { defineStore } from 'pinia'
// import axios from 'axios'

// export const useAccountsStore = defineStore('accounts-store', {
//   state: () => {
//     return {}
//   },

//   actions: {
//     async createAccounts() {
//       //   const axios = require('axios')
//       let data = JSON.stringify({
//         currency: 'USD',
//         payment_type: 'PERIODIC',
//         date: '2023-10-10',
//         reference_number: 'REF123456',
//         exchange_rate: 1,
//         transaction_mode: 'SALES_INVOICE',
//         transaction_type: 'DR',
//         transaction_id: '1',
//         cheque_number: 'CHQ123',
//         control_number: 'CTRL123',
//         remarks: 'This is a test transaction.',
//         amount: 1000,
//         narration: 'Sale for goods',
//         accountable_id: 2,
//         accountable_type_id: 2,
//       })

//       let config = {
//         method: 'get',
//         maxBodyLength: Infinity,
//         url: 'http://localhost:8080/api/v1.0/accounts/accounts-vset/',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization:
//             'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzMwNTQ0MDU0LCJpYXQiOjE3MzA0NTc2NTQsImp0aSI6IjdhYTM2OGFhOGQwNTQ2ODI4N2Y4ZWRhYjY5ZDNmNjUxIiwidXNlcl9pZCI6MX0.rTjYnjLF5E20RLtAW4C05i2JXH4o5czcEWhWuZKVZK8',
//         },
//         data: data,
//       }

//       axios
//         .request(config)
//         .then((response) => {
//           console.log(JSON.stringify(response.data))
//         })
//         .catch((error) => {
//           console.log(error)
//         })
//     },
//   },
// })
