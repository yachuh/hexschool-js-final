import { getOrdersApi, delAllOrdersApi, delOrderApi, changeOrderStatusApi } from './api.js'
const orderList = document.querySelector('.js-orderList')

function init () {
  renderOrderList()
}
init()

/* ---- Render OrderList ---- */
async function getAllOrders () {
  try {
    const { status: isSuccess, message, orders } = await getOrdersApi()
    if (!isSuccess) {
      console.log(message)
      return
    }
    return orders
  } catch (error) {
    console.log(error)
  }
}

async function renderOrderList () {
  const orders = await getAllOrders()

  let content = ''

  if (orders.length === 0) { // Handle order is empty
    content = '<p>目前沒有任何訂單</p>'
    return
  }
  // Handle order is not empty, print order detail
  orders.forEach(order => {
    const { id, user: { name, tel, address, email }, products, createdAt, paid } = order

    // Prepare product string
    let productsStr = ''
    products.forEach(product => { // Get all products from an order
      const str = `<p>${product.title} * ${product.quantity}</p>`
      productsStr += str
    })

    // Transform timestamp to date format: yyyy/mm/dd
    const date = new Date(createdAt * 1000)
    const createdDate = date.toLocaleDateString()

    // Print out Order string
    const str = `<tr>
                <td>${id}</td>
                <td>
                  <p>${name}</p>
                  <p>${tel}</p>
                </td>
                <td>${address}</td>
                <td>${email}</td>
                <td>
                  ${productsStr}
                </td>
                <td>${createdDate}</td>
                <td class="orderStatus">
                  <a href="#" class="orderStatusBtn" data-order-id=${id} data-paid=${paid}>${paid ? '已處理' : '未處理'}</a>
                </td>
                <td>
                  <input type="button" class="delSingleOrder-Btn" value="刪除" data-order-id=${id}/>
                </td>
              </tr>`
    content += str
  })
  orderList.innerHTML = content
  renderChart(orders)
}

/* ---- OrderList features ---- */
orderList.addEventListener('click', (e) => {
  e.preventDefault()
  const target = e.target
  if (target.classList.contains('discardAllBtn')) { // Click in Delete All Btn
    deleteAllOrders() // Delete All Orders
  } else if (target.classList.contains('delSingleOrder-Btn')) { // Click on Delete Single Order Btn
    const id = target.dataset.orderId
    deleteOrder(id) // Delete Single Order
  } else if (target.classList.contains('orderStatusBtn')) { // Click on Order Status Btn
    const data = {
      data: {
        id: target.dataset.orderId,
        paid: !(target.dataset.paid === 'true') // If data-paid is 'true'(string), set to false
      }
    }
    console.log('payload:::', data)
    changeOrderStatus(data)
  }
})

// Delete all orders function
async function deleteAllOrders () {
  console.log('click')
  try {
    const { status: isSuccess, message } = await delAllOrdersApi()
    if (!isSuccess) {
      console.log(message)
      return
    }
    renderOrderList()
    alert(message)
  } catch (error) {
    console.log(error)
  }
}

// Delete single order function
async function deleteOrder (id) {
  try {
    const { status: isSuccess, message } = await delOrderApi(id)
    if (!isSuccess) {
      console.log(message)
    }
    renderOrderList()
    alert('訂單已刪除')
  } catch (error) {
    console.log(error)
  }
}

// Change Order Status function
async function changeOrderStatus (data) {
  try {
    const { status: isSuccess, message } = await changeOrderStatusApi(data)
    if (!isSuccess) {
      console.log(message)
    }
    renderOrderList()
    alert('訂單已修改！')
  } catch (error) {
    console.log(error)
  }
}

/* ---- C3 Chart ---- */
async function renderChart (orders) {
  console.log('renderChart() input:::', orders)

  // Transform data into c3 chart format
  let data = [] // array [ ['Charles 系列儲物組合',780], ['Jordan 雙人床架／雙人加大',9900] ]
  const orderData = {} // obj { 'Charles 系列儲物組合': 780, 'Jordan 雙人床架／雙人加大': 9900 }

  orders.forEach(order => {
    const { products } = order
    products.forEach(product => {
      const { title, price, quantity } = product
      if (orderData[title] === undefined) {
        orderData[title] = price * quantity // add product & price to orderData
      } else {
        orderData[title] += price * quantity // addup the price to the product
      }
      // console.log('orderData:::', orderData)
    })
  })

  data = Object.entries(orderData) // array
  console.log('data:::', data)

  // Sorting data in descending order based on revenue
  data.sort((a, b) => {
    return b[1] - a[1]
  })
  console.log('descending order data:::', data)

  // Handle if product > 3, includes the rest in '其他'
  const length = data.length
  if (length > 3) {
    const splicedData = data.splice(length - 3, length - 3)
    let splicedDataAmount = 0
    splicedData.forEach(data => {
      splicedDataAmount += data[1]
    })
    // console.log('splicedData:::', splicedData)
    // console.log('splicedDataAmount:::', splicedDataAmount)
    const otherData = ['其他', splicedDataAmount]
    data.push(otherData)
  }

  const chart = c3.generate({
    bindto: '#chart',
    data: {
      columns: data,
      type: 'pie'
    },
    // size: {
    //   width: 350,
    //   height: 350
    // },
    color: {
      pattern: ['#2C1C52', '#4E2F99', '#9774E2', '#D7C4FC']
    }
  })
}
