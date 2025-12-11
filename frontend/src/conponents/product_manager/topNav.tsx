import { Button } from "antd";
import { Style } from "../../style/style";
import { ShopOutlined, LogoutOutlined, ShoppingOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";

export function TopNav(){
    const navigate = useNavigate();
    const getUserInfo = () => {
        const token = localStorage.getItem('token');
        if (!token) return null;
        
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return {
                userId: payload.userId,
                role: payload.role,
                isseller: payload.isseller
            };
        } catch {
            return null;
        }
    };

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
                    flexShrink: 0 // 防止被压缩
                }}>
                    {localStorage.getItem('token') && (
                    <Button 
                        icon={<ShopOutlined />}
                        type="text"
                        size="middle"
                        style={{ color: '#666' }}
                        onClick={() => {
                            const userInfo = getUserInfo();
                            if (!userInfo) {
                                alert('请先登录');
                                navigate('/login');
                                return;
                            }
                            
                            if (userInfo.role === 'seller' || userInfo.role === 'admin' || userInfo.isseller === true) {
                                navigate('/products/seller');
                            } else {
                                alert('您不是商家，无权访问商家端');
                            }
                        }}
                    >
                        商家端
                    </Button>
                )}
                    {localStorage.getItem('token') ? (
                    <Button 
                        icon={<LogoutOutlined />}
                        type="text"
                        size="middle"
                        style={{ color: '#ff4d4f' }}
                        onClick={() => {
                            localStorage.removeItem('token');
                            alert('已退出登录');
                            window.location.href = '/login'; // 直接刷新页面
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