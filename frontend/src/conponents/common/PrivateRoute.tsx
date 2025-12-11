import { type JSX } from 'react';
import { Navigate } from 'react-router-dom';

let hasAlerted = false; // 添加一个标志位

export function PrivateRoute({ children }: { children: JSX.Element }) {
  const isLogin = !!localStorage.getItem('token');
  
  if (!isLogin) {
    if (!hasAlerted) { // 只在第一次时alert
      alert("请先登录");
      hasAlerted = true;
    }
    return <Navigate to="/login" replace />;
  }
  
  hasAlerted = false; // 重置标志位
  return children;
}