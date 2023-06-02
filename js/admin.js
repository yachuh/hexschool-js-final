import { getOrdersApi, delAllOrdersApi, delOrderApi, changeOrderStatusApi } from './api.js'
const orderList = document.querySelector('.js-orderList')

/* ---- Render OrderList ---- */
renderOrderList()

async function getAllOrders () {
  try {
    const { status: isSuccess, message, orders } = await getOrdersApi()
    if (!isSuccess) {
      console.log(message)
      return
    }
    console.log('orders:::', orders)
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
  } else { // Handle order is not empty, print order detail
    orders.forEach(order => {
      const { id, user: { name, tel, address, email }, products, createdAt, paid } = order

      // Prepare product string
      let productsStr = ''
      products.forEach(product => { // Get all products from an order
        const str = `<p>${product.title} * ${product.quantity}</p>`
        productsStr += str
      })

      // Transform timestamp to date format
      const date = new Date(createdAt)
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
  }

  orderList.innerHTML = content
}

/* ---- OrderList features ---- */
orderList.addEventListener('click', (e) => {
  const target = e.target
  if (target.classList.contains('discardAllBtn')) { // Click in Delete All Btn
    deleteAllOrders()
  } else if (target.classList.contains('delSingleOrder-Btn')) { // Click on Delete Single Order Btn
    const id = target.dataset.orderId
    deleteOrder(id)
  } else if (target.classList.contains('orderStatusBtn')) { // Click on Order Status Btn
    const data = {
      data: {
        id: target.dataset.orderId,
        paid: !(target.dataset.paid === 'true')
      }
    }
    console.log('payload:::', data)
    changeOrderStatus(data)
  }
})
// Delete all orders
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
// Delete single order
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

// Change Order Status
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
