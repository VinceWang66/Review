import { type JSX } from 'react';
import { Navigate } from 'react-router-dom';

export function PrivateRoute({ children }: { children: JSX.Element }) {
  const isLogin = !!localStorage.getItem('token');
  if (!isLogin) {
    // 只有未登录时才 alert
    alert("请先登录");
    return <Navigate to="/login" replace />;
  }
  return children;
}