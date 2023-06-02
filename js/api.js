/**
 * ==== API config ====
 */

const apiPath = 'yc'
const AUTH_TOKEN = 'Zy8LESN18RYLHPxkpWjCtpf6blL2'

const baseURL = 'https://livejs-api.hexschool.io/api/livejs/v1'
const customerURL = `/customer/${apiPath}`
const adminURL = `/admin/${apiPath}`

// Config Defaults
const baseApiEndpoint = baseURL + customerURL
axios.defaults.baseURL = baseApiEndpoint

// Custom Instance for admin APIs
const axiosAdmin = axios.create({
  baseURL: baseURL + adminURL
})
axiosAdmin.defaults.headers.common.Authorization = AUTH_TOKEN

// URLs
const PRODUCTS = '/products'
const CARTS = '/carts'
const ORDERS = '/orders'

// GET
const getApi = async (url, config) => {
  const res = await axios.get(url, config)
  return res.data
}

const getApiAdmin = async (url, config) => {
  const res = await axiosAdmin.get(url, config)
  return res.data
}
// POST
const postApi = async (url, payload) => {
  const res = await axios.post(url, payload)
  return res.data
}
// DELETE
const deleteApi = async (url, config) => {
  const res = await axios.delete(url, config)
  return res.data
}

const deleteApiAdmin = async (url, config) => {
  const res = await axiosAdmin.delete(url, config)
  return res.data
}

// PUT
const putApiAdmin = async (url, payload) => {
  const res = await axiosAdmin.put(url, payload)
  return res.data
}

/**
 * ==== APIs ====
 */

/* ---- index.html ---- */
// products
export const getProductApi = () => getApi(PRODUCTS)

// carts
export const getCartApi = () => getApi(CARTS)
export const addToCartApi = (data) => postApi(CARTS, data)
export const deleteCartAllApi = () => deleteApi(CARTS)
export const deleteCartProductApi = (id) => deleteApi(`CARTS/${id}`)
export const submitOrderApi = (data) => postApi(ORDERS, data)

/* ---- admin.html ---- */
export const getOrdersApi = () => getApiAdmin(ORDERS)
export const delAllOrdersApi = () => deleteApiAdmin(ORDERS)
export const delOrderApi = (id) => deleteApiAdmin(`ORDERS/${id}`)
export const changeOrderStatusApi = (data) => putApiAdmin(ORDERS, data)
