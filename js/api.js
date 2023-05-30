/**
 * ==== API config ====
 */

const token = 'Zy8LESN18RYLHPxkpWjCtpf6blL2'

const apiPath = 'yachuh'
const apiUrl = 'https://livejs-api.hexschool.io/api/livejs/v1'
const customerURL = `/customer/${apiPath}`
const adminURL = `/admin/${apiPath}`

const baseApiEndpoint = apiUrl + customerURL
axios.defaults.baseURL = baseApiEndpoint

// product 相關 URL
const PRODUCTS = '/products'

/**
 * ==== APIs ====
 */

/* ---- GET ---- */
const getApi = async (url, config) => {
  const res = await axios.get(url, config)
  return res.data
}

// product 相關 api
export const getProductApi = () => getApi(PRODUCTS)
