import { Button, Modal } from "antd";
import { Style } from "../../style/style";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TopNav } from "./topNav";
import { getProducts } from "../../utils/api";

export function ProductSellList(){
    const navigate=useNavigate();
    const [deleteId, setDeleteId]=useState<number|null>(null);
    const [error, setError]=useState('');
    const [loading,setLoading]=useState(true);
    const[products,setProducts]=useState<any[]>([]);
    
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

    return(
        <div style={Style.override}>
            <TopNav />
            <div style={{marginTop: 100}}><h1>商品列表</h1></div>
            <div style={Style.manager}>
                <Button onClick={()=>navigate(`/products/add`)} type="primary" style={{marginLeft:'5%',width:'64px'}}>添加商品</Button>
            </div>
            <div style={{
                border: '2px solid lightgrey',
                padding:'10px',
                marginLeft:'5%',
                width: '90%',
                minHeight: '300px'
            }}>
                {products.map(product => (
                    <div
                    key={product.id} 
                    style={Style.product}>
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            marginBottom: '12px' 
                        }}>
                            <h3 style={{ margin: 0, color: '#1890ff' }}>{product.name}</h3>
                            <span style={{ 
                                fontSize: '20px', 
                                fontWeight: 'bold',
                                color: '#fa541c'
                            }}>
                                ¥{product.price}
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
                                    分类: <strong>{product.category}</strong>
                                </span>
                            </div>
                            <div>
                                <Button 
                                    onClick={()=>navigate(`/products/edit/${product.id}`)}
                                    size="small" type="primary" style={{ marginRight: '8px' }}
                                >
                                    编辑
                                </Button>
                                <Button size="small" danger onClick={() => setDeleteId(product.id)}>
                                    删除
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <Modal
                title="确认删除"
                open={deleteId !== null}
                onOk={() => {
                    setProducts(cats => cats.filter(c => c.id !== deleteId));
                    setDeleteId(null);
                }}
                onCancel={() => setDeleteId(null)}
                okText="确认"
                cancelText="取消"
            >
                <p>确定要删除这个分类吗？</p>
            </Modal>
        </div>
    )
}