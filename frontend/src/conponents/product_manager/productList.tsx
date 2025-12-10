import { Button, Modal } from "antd";
import { Style } from "../../style/style";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function ProductList(){
    const navigate=useNavigate();
    const [deleteId, setDeleteId]=useState<number|null>(null);
    const[products,setProducts]=useState([{
        id: 1,
        name: 'iPhone 15 Pro',
        price: 8999,
        description: 'A17 Pro芯片，钛金属设计，4800万像素主摄，USB-C接口',
        stock: 128,
        category: '电子产品'
      },
      {
        id: 2,
        name: 'MacBook Air',
        price: 9999,
        description: 'M3芯片，超薄设计，18小时电池续航',
        stock: 56,
        category: '笔记本电脑'
      },
      {
        id: 3,
        name: 'AirPods Pro',
        price: 1899,
        description: '主动降噪，空间音频，MagSafe充电盒',
        stock: 200,
        category: '音频设备'
      },
      {
        id: 4,
        name: 'AirPods Pro2',
        price: 18999,
        description: '牛啊牛啊',
        stock: 2000,
        category: '音频设备'
      }])
    return(
        <div style={Style.override}>
            <div style={{marginTop: 30}}><h1>商品列表</h1></div>
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