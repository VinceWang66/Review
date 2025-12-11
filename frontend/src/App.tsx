import './App.css'
import { Login } from './conponents/index/login'
import { Register } from './conponents/index/register'
import { ProductList } from './conponents/product_manager/productList';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ProductAdd } from './conponents/product_manager/productAdd';
import { ProductEdit } from './conponents/product_manager/productEdit';
import { CategoryList } from './conponents/category_manager/categoryList';
import { CategoryAdd } from './conponents/category_manager/categoryAdd';
import { CategoryEdit } from './conponents/category_manager/categoryEdit';
import { ProductSellList } from './conponents/product_manager/productSellList';
import { Purchase } from './conponents/product_manager/purchase';
import { PrivateRoute } from './conponents/common/PrivateRoute';
import { useEffect } from 'react';

function App() {
  
  useEffect(() => {
    const checkTokenExpiry = () => {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const isExpired = Date.now() > payload.exp * 1000;
            
            if (isExpired) {
                localStorage.removeItem('token');
                // 可选：提示用户重新登录
                if (window.location.pathname !== '/login') {
                    alert('登录已过期，请重新登录');
                    window.location.href = '/login';
                }
            }
        } catch {
            localStorage.removeItem('token');
        }
    };
    
    checkTokenExpiry();
}, []);
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/seller" element={<ProductSellList />} />
        <Route path="/products/add" element={<ProductAdd />} />
        <Route path="/products/edit/:id" element={<ProductEdit />} />
        <Route path="/products/purchase/:id" element={<PrivateRoute><Purchase /></PrivateRoute>} />
        <Route path="/category" element={<CategoryList/>}/>
        <Route path="/category/add" element={<CategoryAdd />} />
        <Route path="/category/edit/:id" element={<CategoryEdit />} />
        <Route path="/" element={<ProductList />} /> {/* 默认首页 */}
      </Routes>
    </BrowserRouter>
  )
}

export default App