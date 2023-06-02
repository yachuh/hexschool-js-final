import { getProductApi, getCartApi, addToCartApi, deleteCartAllApi, deleteCartProductApi, submitOrderApi } from './api.js '

let productsData = []
let cartsData = []
const productWrap = document.querySelector('.productWrap')
const shoppingCartTable = document.querySelector('.shoppingCart-table')

// Render products data
const renderProductList = async () => {
  try {
    const { status: isSuccess, message, products } = await getProductApi()
    if (!isSuccess) {
      console.log(message)
      return
    }
    // console.log('products:::', products)
    productsData = products

    let innerHTML = ''
    productsData.forEach(item => {
      const str = `<li class="productCard" data-product-id=${item.id}>
            <h4 class="productType">新品</h4>
            <img
              src=${item.images}
              alt=${item.title}
            />
            <a href="#" class="addCardBtn">加入購物車</a>
            <h3>${item.title}</h3>
            <del class="originPrice">NT$${item.origin_price}</del>
            <p class="nowPrice">NT$${item.price}</p>
          </li>`
      innerHTML += str
    })
    productWrap.innerHTML = innerHTML
  } catch (error) {
    console.log(error)
  }
}

// Render carts data
const renderCart = async () => {
  try {
    const { status: isSuccess, message, carts, finalTotal } = await getCartApi()
    if (!isSuccess) {
      console.log(message)
      return
    }

    // Handle cart has no data
    if (carts.length === 0) {
      shoppingCartTable.innerHTML = '目前沒有任何商品'
      return
    }
    // Handle cart has data
    cartsData = carts
    let innerHTML = `<tr>
              <th width="40%">品項</th>
              <th width="15%">單價</th>
              <th width="15%">數量</th>
              <th width="15%">金額</th>
              <th width="15%"></th>
            </tr>`
    cartsData.forEach(item => {
      const product = item.product
      const str = `<tr>
              <td>
                <div class="cardItem-title">
                  <img src=${product.images} alt=${product.title} />
                  <p>${product.title}</p>
                </div>
              </td>
              <td>${product.price}</td>
              <td>${item.quantity}</td>
              <td>NT$${(product.price * item.quantity)}</td>
              <td class="discardBtn">
                <a href="#" class="material-icons" data-cart-id=${item.id}> clear </a>
              </td>
            </tr>`
      innerHTML += str
    })
    innerHTML += `<tr>
              <td>
                <a href="#" class="discardAllBtn">刪除所有品項</a>
              </td>
              <td></td>
              <td></td>
              <td>
                <p>總金額</p>
              </td>
              <td>NT$${finalTotal}</td>
            </tr>`
    shoppingCartTable.innerHTML = innerHTML
  } catch (error) {
    console.log(error)
  }
}

// Initial render
function init () {
  renderProductList()
  renderCart()
}
init()

// Add product to cart
productWrap.addEventListener('click', addToCart)

async function addToCart (e) {
  e.preventDefault()

  // 判斷是否點擊「加入購物車」按鈕
  if (e.target.className === 'addCardBtn') {
    const productId = e.target.parentNode.dataset.productId
    console.log('productId:::', productId)

    let quantity = 1

    cartsData.forEach(item => {
      const { quantity: cartQuantity, product } = item
      // 若商品是已在購物車內，則 quantity += 原本在購物車內的數量
      if (product.id === productId) {
        quantity += cartQuantity
      }
    })

    try {
      const data = {
        data: {
          productId,
          quantity
        }
      }
      const { status: isSuccess, message } = await addToCartApi(data)
      if (!isSuccess) {
        console.log(message)
      } else {
        alert('新增成功！')
        renderCart()
      }
    } catch (error) {
      console.log(error)
    }
  }
}

/* ---- Cart ---- */
shoppingCartTable.addEventListener('click', (e) => {
  e.preventDefault()

  if (e.target.className === 'discardAllBtn') {
    deleteCartAll()
  } else if (e.target.dataset.cartId) {
    const id = e.target.dataset.cartId
    deleteCartProduct(id)
  }
})
// Delete all products in cart
async function deleteCartAll () {
  try {
    const { status: isSuccess, message } = await deleteCartAllApi()
    if (!isSuccess) {
      console.log(message)
    } else {
      renderCart()
      alert(message)
      console.log(message)
    }
  } catch (error) {
    console.log(error)
  }
}
// Delete single product in cart
async function deleteCartProduct (id) {
  try {
    const { status: isSuccess, message } = await deleteCartProductApi(id)
    if (!isSuccess) {
      console.log(message)
    } else {
      alert('刪除成功！')
      renderCart()
    }
  } catch (error) {
    console.log(error)
  }
}

/* ---- Submit order ---- */
const orderInfoBtn = document.querySelector('.orderInfo-btn')
// orderInfoBtn.addEventListener("click", submitOrder)
const orderInfoForm = document.querySelector('.orderInfo-form')
orderInfoForm.addEventListener('submit', submitOrder)

async function submitOrder (e) {
  e.preventDefault()
  const name = document.querySelector('#customerName').value
  const tel = document.querySelector('#customerPhone').value
  const email = document.querySelector('#customerEmail').value
  const address = document.querySelector('#customerAddress').value
  const payment = document.querySelector('#tradeWay').value

  // Check if cart has data
  if (cartsData.length === 0) {
    alert('購物車內沒有產品，所以無法送出訂單')
    return
  }
  // Check if the form is valid
  const isValid = await formValidation(orderInfoForm)

  const formData = {
    name,
    tel,
    email,
    address,
    payment
  }

  if (!isValid) {
    // Handle invalid form
    console.log('Form is invalid')
    return
  }
  // Proceed with form submission or further processing
  console.log('Form is valid')
  try {
    const data = {
      data: {
        user: formData
      }
    }
    const { status: isSuccess, message } = await submitOrderApi(data)
    if (!isSuccess) {
      console.log(message)
    }
    alert('訂單已成功送出！')
    orderInfoForm.reset() // Reset form value after submit
    renderCart() // Re-render cart after submit(will be empty)
  } catch (error) {
    console.log(error)
  }
}

function formValidation (form) {
  let isValidForm = true // Initialize the isValid flag

  const validateInput = (input) => {
    const name = input.getAttribute('name')
    const errorMessage = document.querySelector(`[data-message=${name}]`)
    errorMessage.innerHTML = ''

    const constraints = {
      姓名: {
        presence: {
          message: '必填'
        }
      },
      電話: {
        presence: {
          message: '必填'
        },
        numericality: {
          onlyInteger: true,
          message: '請輸入正確的電話'
        }
      },
      Email: {
        presence: {
          message: '必填'
        },
        email: {
          message: '請輸入正確的 email 格式'
        }
      },
      寄送地址: {
        presence: {
          message: '必填'
        }
      },
      交易方式: {
        presence: {
          message: '必填'
        }
      }
    }

    const errors = validate(form, constraints, { fullMessages: false })

    if (errors !== undefined) { // Handle errors
      orderInfoBtn.setAttribute('disabled', true) // Make submit button disabled
      const errorsArray = Object.entries(errors)
      errorsArray.forEach(error => { // show error message for each input
        const name = error[0]
        const errorText = error.flat()[1]
        const messageElement = form.querySelector(`[data-message="${name}"]`)
        messageElement.innerText = errorText
      })
      return false
    } else { // Handle no error
      orderInfoBtn.disabled = false
      return true
    }
  }

  form.addEventListener('change', e => {
    const input = e.target
    const isValid = validateInput(input)

    if (isValid) {
      console.log('Input is valid')
      isValidForm = true
    } else {
      console.log('Input is invalid')
      isValidForm = false
    }
  })

  return isValidForm // Return the final isValidForm flag
}
formValidation(orderInfoForm)
