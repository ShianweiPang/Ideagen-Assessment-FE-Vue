import axios from 'axios'

const mysql = axios.create({
  baseURL: 'http://localhost:3000/api/',
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Retrieve all the data from a view created: v_sales_order_listing
 * 
 * @returns {object[]} 
 * @example
 * [{
    "object_id": Number,
    "customer_name": String,
    "status": String,
    "name": String,
    "country": String,
    "created_date": Datetime
  }...]
 */
export const GetData = async () => {
  const res = await mysql.get('getData')
  return res.data
}

/**
 * Get distinct product with object_id for Create New Record form
 * 
 * @returns {object[]} 
 * @example
 * [{
  "object_id": 1,
  "name": "Electronics"
  }...]
 */
export const GetDistinctProduct = async () => {
  const res = await mysql.get('getDistinctProduct')
  return res.data
}

/**
 * Insert a new record of sales order with following param
 * 
 * @param {object}
 * @example 
 * {
  "customerName": "Name",
  "status": "Status",
  "category": 2,
  "country": "Malaysia",
  "createdDate": "3/29/2025"
}
 * @returns {object} Message 
 */
export const InsertData = async (dataParams) => {
  const res = await mysql.post('addRecord', dataParams)
  return res.data
}

/**
 * Update a record data with PK = object_id
 * 
 * @param {object}
 * @example
 * {
  "customerName": "Name",
  "status": "Status",
  "category": 2,
  "country": "Malaysia",
  "updatedDate": "3/29/2025",
  "objectId": 56
}
 * @returns {object} Message 
 */
export const UpdateData = async (dataParams) => {
  const res = await mysql.post('updateRecord', dataParams)
  return res.data
}

/**
 * Delete a record with PK = object_id
 * 
 * @param {object}
 * @example
 * {
  "objectId": 57
}
 * @returns {object} Message 
 */
export const DeleteData = async (dataParams) => {
  const res = await mysql.post('deleteRecord', dataParams)
  return res.data
}
