/**
 * ==== API config ====
 */

const token = 'Zy8LESN18RYLHPxkpWjCtpf6blL2'

const apiPath = 'yc'
const apiUrl = 'https://livejs-api.hexschool.io/api/livejs/v1'
const customerURL = `/customer/${apiPath}`
const adminURL = `/admin/${apiPath}`

const baseApiEndpoint = apiUrl + customerURL
axios.defaults.baseURL = baseApiEndpoint

// URLs
const PRODUCTS = '/products'
const CARTS = '/carts'
const ORDERS = '/orders'

/**
 * ==== APIs ====
 */

// GET
const getApi = async (url, config) => {
  const res = await axios.get(url, config)
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

/* ---- product 相關 api ---- */
export const getProductApi = () => getApi(PRODUCTS)

// cart 相關 api
export const getCartApi = () => getApi(CARTS)
export const addToCartApi = (data) => postApi(CARTS, data)
export const deleteCartAllApi = () => deleteApi(CARTS)
export const deleteCartProductApi = (id) => deleteApi(`CARTS/${id}`)
export const submitOrderApi = (data) => postApi(ORDERS, data)
