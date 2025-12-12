import { useNavigate, useParams } from "react-router-dom";
import { Style } from "../../style/style";
import { useEffect, useState } from "react";
import { getProductsById } from "../../utils/api";
import { Button, Input } from "antd";

export function Purchase(){
    const { id } = useParams<{id:string}>();
    const pid = id ? parseInt(id) : null;

    const navigate = useNavigate();
    const [product, setProduct] = useState<any>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    // useEffect(() => {
    //     const token = localStorage.getItem('token');
    //     if (!token) {
    //         alert('请先登录');
    //         navigate('/login');
    //         return;
    //     }
    //     try {
    //         const payload = JSON.parse(atob(token.split('.')[1]));
    //         if (Date.now() > payload.exp * 1000) {
    //             localStorage.removeItem('token');
    //             alert('登录已过期，请重新登录');
    //             navigate('/login');
    //             return;
    //         }
    //     } catch {
    //         localStorage.removeItem('token');
    //         alert('登录信息无效');
    //         navigate('/login');
    //         return;
    //     }
    // }, [navigate]);

    useEffect(() => {
        if (pid === null) {
            setError('商品ID无效');
            setLoading(false);
            return;
        }
        getProductsById(pid)
            .then(res => {
                if (res && res.price) {
                    console.log('价格对象:', res.price);
                    setProduct(res);
                } else {
                    setError('商品数据不完整');
                    setProduct(null);
                }
            })
            .catch(err => {
                console.error("获取商品失败", err);
                setError('获取商品列表失败，请稍后重试');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [pid]);

    const handlePurchase = async () => {
        if (!product) return;
        if (quantity > product.stock) {
            alert('库存不足');
            return;
        }
        
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:3000/products/${product.pid}/purchase`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ quantity })
            });
        
            if (response.ok) {
                setProduct({
                    ...product,
                    stock: product.stock - quantity
                });
                alert('购买成功！');
                setQuantity(1);
            } else {
                throw new Error('购买失败');
            }
            
        } catch (error: any) {
            alert(error.message || '购买失败');
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (priceObj: any) => {
        if (!priceObj || !priceObj.d) return '0.00';
        const integer = priceObj.d[0] || 0;
        const fraction = priceObj.d[1] || 0;
        const price = parseFloat(`${integer}.${fraction.toString().padStart(7, '0')}`);
        return price.toFixed(2);
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            {error && (
                <div style={Style.errorStyle}>
                    ❌ {error}
                </div>
            )}
            {loading && (
                <div style={Style.loadingStyle}>
                    加载中...
                </div>
            )}
            {product && !loading && (
                <div style={Style.containerStyle}>
                    {/* 左侧商品信息 */}
                    <div style={Style.leftPanelStyle}>
                        <h1 style={Style.productNameStyle}>{product.pname}</h1>
                        
                        {/* 分类放在描述上面 */}
                        <div style={{ marginBottom: '16px' }}>
                            <span style={{ color: '#666' }}>分类: </span>
                            <strong style={{ color: '#1890ff' }}>{product.category?.cname || '无分类'}</strong>
                        </div>
                        
                        {/* 带滚轮的商品描述 */}
                        <div style={{
                            border: '1px solid #f0f0f0',
                            borderRadius: '6px',
                            padding: '16px',
                            marginBottom: '20px',
                            maxHeight: '200px',
                            overflowY: 'auto',
                            backgroundColor: '#fafafa'
                        }}>
                            <div style={{ color: '#666', lineHeight: '1.6' }}>
                                {product.description}
                            </div>
                        </div>
                    </div>
                    
                    {/* 右侧购买操作 */}
                    <div style={Style.rightPanelStyle}>
                        {/* 价格 */}
                        <div style={Style.priceSectionStyle}>
                            <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>价格</div>
                            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#fa541c' }}>
                                ¥{formatPrice(product.price)}
                            </div>
                        </div>
                        
                        {/* 库存 */}
                        <div style={Style.stockSectionStyle}>
                            <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>库存</div>
                            <div style={{ 
                                fontSize: '18px', 
                                fontWeight: 'bold', 
                                color: product.stock > 0 ? '#52c41a' : '#ff4d4f' 
                            }}>
                                {product.stock}件
                            </div>
                        </div>
                        
                        {/* 购买数量 - 居中对齐 */}
                        <div style={Style.quantitySectionStyle}>
                            <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>购买数量</div>
                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                gap: '12px' 
                            }}>
                                <Button 
                                    shape="circle" 
                                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                    disabled={quantity <= 1}
                                >
                                    -
                                </Button>
                                <Input 
                                    value={quantity.toString()}
                                    onInput={(e: any) => {
                                        const inputValue = e.target.value;
                                        if (/^\d*$/.test(inputValue)) {
                                            const val = parseInt(inputValue) || 0;
                                            if (val >= 1 && val <= product.stock) {
                                                setQuantity(val);
                                            }
                                        }
                                    }}
                                    onBlur={() => {
                                        if (quantity < 1) setQuantity(1);
                                        if (quantity > product.stock) setQuantity(product.stock);
                                    }}
                                    style={{ 
                                        width: '80px', 
                                        textAlign: 'center' as const
                                    }}
                                />
                                <Button 
                                    shape="circle"
                                    onClick={() => setQuantity(prev => Math.min(product.stock, prev + 1))}
                                    disabled={quantity >= product.stock}
                                >
                                    +
                                </Button>
                            </div>
                        </div>
                        
                        {/* 小计 */}
                        <div style={Style.totalSectionStyle}>
                            <div style={{ fontSize: '16px', color: '#666' }}>小计</div>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                                ¥{(parseFloat(formatPrice(product.price)) * quantity).toFixed(2)}
                            </div>
                        </div>
                        
                        {/* 按钮 */}
                        <div style={Style.buttonGroupStyle}>
                            <Button 
                                type="primary" 
                                size="large"
                                style={{ height: '50px', fontSize: '16px' }}
                                onClick={handlePurchase}
                                disabled={product.stock === 0}
                            >
                                {product.stock === 0 ? '已售罄' : '立即购买'}
                            </Button>
                            <Button 
                                size="large"
                                style={{ height: '50px', fontSize: '16px', backgroundColor: '#f5f5f5' }}
                                onClick={() => navigate('/products')}
                            >
                                返回商品列表
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}