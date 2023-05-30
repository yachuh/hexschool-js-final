import { getProductApi } from './api.js '

// 取得產品列表
const renderProductList = async () => {
  const productWrap = document.querySelector('.productWrap')

  const data = await getProductApi()
  const products = data.products

  let content = ''
  products.forEach(item => {
    const str = `<li class="productCard">
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
    content += str
  })
  productWrap.innerHTML = content
}

renderProductList()
