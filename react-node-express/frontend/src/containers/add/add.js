//主界面路由组件
import React, {Component, useState, useEffect} from 'react'

// import NewProduct  from "../../components/Books/AddBook";
import ProductList from "../../page/Book/BookList";

function Add() {
  const [loadedProducts, setLoadedProducts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  
  useEffect(()=>{
    const fetchProducts = async ()=>{
      setIsLoading(true)
      const response = await fetch('http://localhost:5000/products')
      
      const responseData = await response.json()
      setLoadedProducts(responseData.products)
      setIsLoading(false)
    }
    
    fetchProducts()
  }, [])
  
  const addProductHandler = async (productName, productPrice) =>{
    try {
      const newProduct = {
        title: productName,
        price: +productPrice
      }
      let hasErr = false
      const response = await fetch('http://localhost:5000/product', {
        method: 'POST',
        body: JSON.stringify(newProduct),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      if(!response.ok) hasErr = true
      const responseData = await response.json()
      if(hasErr) {
        throw new Error(responseData.message)
      }
      
      setLoadedProducts(prevProducts => {//思考：为什么参数要用回调，而不是直接传入数组？函数式更新：与 class 组件中的 setState 方法不同，useState 不会自动合并更新对象。你可以用函数式的 setState 结合展开运算符来达到合并更新对象的效果。
        return prevProducts.concat({
          ...newProduct,
          id: responseData.product.id
        })
      })
    }catch (e) {
      alert(e.message || 'sth went wrong')
    }
  }
  return (
      <React.Fragment>
        <main>
          {/*<NewProduct onAddProduct={addProductHandler}/>*/}
          {isLoading && <p className="loader">Loading...</p>}
          {!isLoading && <ProductList items={loadedProducts}/>}
        </main>
      </React.Fragment>
  )
}

export default Add