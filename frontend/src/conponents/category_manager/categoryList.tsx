import { Button, Modal } from "antd";
import { Style } from "../../style/style";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function CategoryList(){
    const navigate=useNavigate();
    const [deleteId, setDeleteId]=useState<number|null>(null);
    const [categories,setCategories]=useState([{
        id: 1,
        name: '日用百货',
        number: 10
      },
      {
        id: 2,
        name: '数码产品',
        number: 10
      },
      {
        id: 3,
        name: '家用电器',
        number: 10
      },
      {
        id: 4,
        name: '厨房用具',
        number: 10
      }])
    return(
        <div style={Style.override}>
            <div style={{marginTop: 30}}><h1>商品列表</h1></div>
            <div style={Style.manager}>
                <Button onClick={()=>navigate(`/category/add`)} type="primary" style={{marginLeft:'5%',width:'64px'}}>添加分类</Button>
            </div>
            <div style={{
                border: '2px solid lightgrey',
                padding:'10px',
                marginLeft:'5%',
                width: '90%',
                minHeight: '300px'
            }}>
                {categories.map(category => (
                    <div
                    key={category.id} 
                    style={Style.product}>
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            marginBottom: '12px' 
                        }}>
                            <h2 style={{ margin: 0, color: '#1890ff' }}>{category.name}</h2>
                        </div>
                        
                        <div style={{ 
                            color: '#666', 
                            marginBottom: '16px',
                            lineHeight: '1.6'
                        }}>
                            共{category.number}件商品
                        </div>
                        
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div style={{ marginLeft:'auto' }}>
                                <Button 
                                    onClick={()=>navigate(`/category/edit/${category.id}`)}
                                    size="small" type="primary" style={{ marginRight: '8px' }}
                                >
                                    编辑
                                </Button>
                                <Button size="small" danger onClick={() => setDeleteId(category.id)}>
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
                    setCategories(cats => cats.filter(c => c.id !== deleteId));
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