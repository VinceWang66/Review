import { Button } from "antd";
import { Style } from "../../style/style";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../../utils/api";
import { TopNav } from "./topNav";

export function ProductList(){
    const navigate=useNavigate();
    const [products,setProducts]=useState<any[]>([]);
    const [error, setError]=useState('');
    const [loading,setLoading]=useState(true);

    useEffect(()=>{
        getProducts()
            .then(res=>{
                console.log('商品价格结构:', res[0].price);
                console.log('完整商品结构:', res[0]);
                setProducts(res);
                setError('');
            })
            .catch(err=>{
                console.error("获取商品失败", err)
                setError('获取商品列表失败，请稍后重试');
            })
            .finally(()=>{
                setLoading(false);
            })
    },[])

    const formatPrice = (priceObj: any) => {
        if (!priceObj || !priceObj.d) return '0.00';
        
        // Decimal128 格式: { s: 1, e: 1, d: [29, 9900000] }
        // d[0] 是整数部分，d[1] 是小数部分（可能有前导零）
        
        const integer = priceObj.d[0] || 0;
        const fraction = priceObj.d[1] || 0;
        
        // 组合成完整价格
        const price = parseFloat(`${integer}.${fraction.toString().padStart(7, '0')}`);
        return price.toFixed(2); // 保留两位小数
    };

    return(
        <div style={Style.override}>
            <TopNav />
            <div style={{marginTop: 100}}><h1>商品列表</h1></div>
            {error && (
                <div style={{
                    margin: '0 5% 20px 5%',
                    padding: '12px',
                    backgroundColor: '#fff2f0',
                    border: '1px solid #ffccc7',
                    borderRadius: '6px',
                    color: '#ff4d4f'
                }}>
                    ❌ {error}
                </div>
            )}
            {loading && (
                <div style={{
                    textAlign: 'center',
                    padding: '40px',
                    color: '#999'
                }}>
                    加载中...
                </div>
            )}
            <div style={{
                border: '2px solid lightgrey',
                padding:'10px',
                marginLeft:'5%',
                width: '90%',
                minHeight: '300px'
            }}>
                {products.map(product => (
                    <div
                    key={product.pid} 
                    style={Style.product}>
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            marginBottom: '12px' 
                        }}>
                            <h3 style={{ margin: 0, color: '#1890ff' }}>{product.pname}</h3>
                            <span style={{ 
                                fontSize: '20px', 
                                fontWeight: 'bold',
                                color: '#fa541c'
                            }}>
                                ¥{formatPrice(product.price)}
                            </span>
                        </div>
                        
                        <div style={{ 
                            color: '#666', 
                            marginBottom: '16px',
                            lineHeight: '1.6'
                        }}>
                            {product.description}
                        </div>
                        
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div>
                                <span style={{ color: '#999', marginRight: '20px' }}>
                                    库存: <strong>{product.stock}</strong>件
                                </span>
                                <span style={{ color: '#999' }}>
                                    分类: <strong>{product.category?.cname || '无分类'}</strong>
                                </span>
                            </div>
                            <div>
                                <Button 
                                    onClick={()=>{
                                        // const token = localStorage.getItem('token');
                                        // if (!token) {
                                        //     alert('请先登录才能购买');
                                        //     navigate('/login');
                                        //     return; // 直接返回，不跳转
                                        // }
                                        navigate(`/products/purchase/${product.pid}`)}
                                    }
                                    size="small" type="primary" style={{ marginRight: '8px' }}
                                >
                                    购买
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}