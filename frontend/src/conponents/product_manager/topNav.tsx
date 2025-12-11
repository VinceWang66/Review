import { Button } from "antd";
import { Style } from "../../style/style";
import { ShopOutlined, LogoutOutlined, ShoppingOutlined, UserOutlined, SettingOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";

export function TopNav(){
    const navigate = useNavigate();
    
    const getUserInfo = () => {
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

    // 获取当前路径
    const currentPath = window.location.pathname;
    const isSellerPage = currentPath.includes('/products/seller');
    const isAdminPage = currentPath.includes('/admin');
    
    const userInfo = getUserInfo();

    return(
        <div style={Style.safari}>
            {/* 左侧：应用名称/logo */}
            <div style={Style.logo}
                onClick={() => navigate('/')}
            >
                <ShoppingOutlined />
                电商平台
            </div>
            
            {/* 右侧：操作按钮 */}
            <div style={{ 
                display: 'flex', 
                gap: '12px',
                flexShrink: 0
            }}>
                {/* 切换按钮 */}
                {localStorage.getItem('token') && (
                    <>
                        {/* 1. 在用户端：显示商家端 */}
                        {!isSellerPage && !isAdminPage && (
                            <Button 
                                icon={<ShopOutlined />}
                                type="text"
                                size="middle"
                                style={{ color: '#666' }}
                                onClick={() => navigate('/products/seller')}
                            >
                                商家端
                            </Button>
                        )}
                        
                        {/* 2. 在商家端：显示用户端和管理端 */}
                        {isSellerPage && (
                            <>
                                <Button 
                                    icon={<SettingOutlined />}
                                    type="text"
                                    size="middle"
                                    style={{ color: '#52c41a' }}
                                    onClick={() => navigate('/products')}
                                >
                                    用户端
                                </Button>
                                <Button 
                                    icon={<ShopOutlined />}
                                    type="text"
                                    size="middle"
                                    style={{ color: '#722ed1' }}
                                    onClick={() => {
                                        // 检查是否是管理员
                                        if (userInfo?.role === 'admin') {
                                            navigate('/admin');
                                        } else {
                                            alert('需要管理员权限');
                                        }
                                    }}
                                >
                                    管理端
                                </Button>
                            </>
                        )}
                        
                        {/* 3. 在管理端：显示商家端和用户端 */}
                        {isAdminPage && (
                            <>
                                <Button 
                                    icon={<ShopOutlined />}
                                    type="text"
                                    size="middle"
                                    style={{ color: '#666' }}
                                    onClick={() => navigate('/products/seller')}
                                >
                                    商家端
                                </Button>
                                <Button 
                                    icon={<SettingOutlined />}
                                    type="text"
                                    size="middle"
                                    style={{ color: '#52c41a' }}
                                    onClick={() => navigate('/products')}
                                >
                                    用户端
                                </Button>
                            </>
                        )}
                    </>
                )}
                
                {/* 登录/登出按钮 */}
                {localStorage.getItem('token') ? (
                    <Button 
                        icon={<LogoutOutlined />}
                        type="text"
                        size="middle"
                        style={{ color: '#ff4d4f' }}
                        onClick={() => {
                            localStorage.removeItem('token');
                            alert('已退出登录');
                            window.location.href = '/login';
                        }}
                    >
                        登出
                    </Button>
                ) : (
                    <Button 
                        icon={<UserOutlined />}
                        type="text"
                        size="middle"
                        style={{ color: '#1890ff' }}
                        onClick={() => navigate('/login')}
                    >
                        登录
                    </Button>
                )}
            </div>
        </div>
    )
}