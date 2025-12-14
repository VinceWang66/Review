import './App.css'
import { Login } from './pages/index/login'
import { Register } from './pages/index/register'
import { ProductList } from './pages/product_manager/productList';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ProductAdd } from './pages/product_manager/productAdd';
import { ProductEdit } from './pages/product_manager/productEdit';
import { ProductSellList } from './pages/product_manager/productSellList';
import { Purchase } from './pages/product_manager/purchase';
import { AdminRoute, PrivateRoute, SellerRoute } from './common/PrivateRoute';
import { Admin } from './pages/admin/admin';
import { CategoryList } from './pages/category_manager/categoryList';
import { UserList } from './pages/user_manager/userList';
import { UserAdd } from './pages/user_manager/userAdd';
import { UserEdit } from './pages/user_manager/userEdit';
import { CategoryAdd } from './pages/category_manager/categoryAdd';
import { CategoryEdit } from './pages/category_manager/categoryEdit';

function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/seller" element={<PrivateRoute><ProductSellList /></PrivateRoute>} />
        <Route path="/products/add" element={<SellerRoute><ProductAdd /></SellerRoute>} />
        <Route path="/products/edit/:id" element={<SellerRoute><ProductEdit /></SellerRoute>} />
        <Route path="/products/purchase/:id" element={<PrivateRoute><Purchase /></PrivateRoute>} />
        <Route path="/category" element={<AdminRoute><CategoryList/></AdminRoute>}/>
        <Route path="/category/add" element={<AdminRoute><CategoryAdd/></AdminRoute>} />
        <Route path="/category/edit/:id" element={<AdminRoute><CategoryEdit/></AdminRoute>} />
        <Route path="/user" element={<AdminRoute><UserList/></AdminRoute>} />
        <Route path="/user/add" element={<AdminRoute><UserAdd/></AdminRoute>} />
        <Route path="/user/edit/:id" element={<AdminRoute><UserEdit/></AdminRoute>} />
        <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
        <Route path="/" element={<ProductList />} /> {/* 默认首页 */}
      </Routes>
    </BrowserRouter>
  )
}

export default App