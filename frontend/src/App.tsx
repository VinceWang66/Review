import { useState } from 'react';
import './App.css'
import { Login } from './conponents/index/login'
import { Register } from './conponents/index/register'
import { Product } from './conponents/product_manager/product';

function App() {
  // const[islogin, setIslogin]=useState(true);
  // return islogin ? <Login onSwitch={()=>setIslogin(false)}/> : <Register onSwitch={()=>setIslogin(true)}/>;
  return <Product/>
}

export default App