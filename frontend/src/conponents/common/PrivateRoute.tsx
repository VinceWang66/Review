// src/components/PrivateRoute.tsx
import { type JSX } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

// let hasAlerted = false;
const getAlertedFlag = () => sessionStorage.getItem('hasAlerted') === 'true';
const setAlertedFlag = (value: boolean) => sessionStorage.setItem('hasAlerted', value.toString());

// 路径权限配置
const PATH_PERMISSIONS: Record<string, string[]> = {
  '/products/seller': ['seller', 'admin'],
  '/products/add': ['seller', 'admin'],
  '/products/edit/:id': ['seller', 'admin'],
  '/admin': ['admin'],
  // 默认路径不需要特殊权限
  '/products': [],
  '/': [],
  '/login': [],
  '/register': [],
};

/**
 * 从token解析用户信息
 */
const getUserInfoFromToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      role: payload.role,
      isseller: payload.isseller,
    };
  } catch {
    return null;
  }
};

/**
 * 检查路径是否匹配动态路由
 */
const matchDynamicPath = (currentPath: string, permissionPath: string): boolean => {
  if (permissionPath.includes('/:id')) {
    // 将动态路径转换为正则表达式
    const regexPattern = permissionPath.replace(/:\w+/g, '[^/]+');
    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(currentPath);
  }
  return currentPath === permissionPath;
};

export function PrivateRoute({ 
  children, 
  requiredRole 
}: { 
  children: JSX.Element;
  requiredRole?: string;  // 可选：直接指定需要的角色
}) {
  const location = useLocation();
  const currentPath = location.pathname;
  const isLogin = !!localStorage.getItem('token');
  
  // 1. 检查登录
  if (!isLogin) {
    if (!getAlertedFlag()) {
        alert("请先登录");
        setAlertedFlag(true);
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
}
  
  const userInfo = getUserInfoFromToken();
  
  // 2. 检查token是否有效
  if (!userInfo) {
    localStorage.removeItem('token');
    setAlertedFlag(false);  // 添加这行
    return <Navigate to="/login" replace />;
  }

  // 3. 确定需要的权限
  let requiredRoles: string[] = [];
  
  if (requiredRole) {
    // 如果直接指定了角色
    requiredRoles = [requiredRole];
  } else {
    // 根据路径查找需要的权限
    for (const [path, roles] of Object.entries(PATH_PERMISSIONS)) {
      if (matchDynamicPath(currentPath, path)) {
        requiredRoles = roles;
        break;
      }
    }
  }
  
  // 4. 检查权限（如果需要特殊权限）
  if (requiredRoles.length > 0) {
    const hasPermission = requiredRoles.some(role => {
      if (role === 'seller') {
        return userInfo.role === 'seller' || userInfo.isseller === true;
      }
      return userInfo.role === role;
    });

    const role = requiredRoles.map((r)=>{
      const roleMap: Record<string, string> = {
        'seller': '商家',
        'admin': '管理员',
        'user': '用户'
      };
      return roleMap[r] || r;
    });
    

    if (!hasPermission) {
      alert(`需要${role.join('或')}权限`);
      return <Navigate to="/" replace />;
    }
  }
  
  // hasAlerted = false;
  setAlertedFlag(false);
  return children;
}

// 快捷导出常用权限路由
export const SellerRoute = ({ children }: { children: JSX.Element }) => (
  <PrivateRoute requiredRole="seller">{children}</PrivateRoute>
);

export const AdminRoute = ({ children }: { children: JSX.Element }) => (
  <PrivateRoute requiredRole="admin">{children}</PrivateRoute>
);