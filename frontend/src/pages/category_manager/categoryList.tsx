import { Button, message, Modal } from "antd";
import { Style } from "../../style/style";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCategories, deleteCategory } from "../../utils/api.ts";
import { TopNav } from "../product_manager/topNav.tsx";
import { ArrowLeftOutlined } from "@ant-design/icons";

export function CategoryList() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [categories, setCategories] = useState<Array<{ cid: number; cname: string; productCount: number }>>([]);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const categoriesRes = await getCategories();
                console.log('分类数据:', categoriesRes);

                setCategories(Array.isArray(categoriesRes) ? categoriesRes : []);
                setError('');
            } catch (err) {
                console.error("获取分类失败", err);
                setError('获取分类失败，请稍后重试');
                setCategories([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleDelete = async () => {
        if (!deleteId) return;

        setDeleteLoading(true);
        try {
            await deleteCategory(deleteId);

            setCategories(prev => prev.filter(c => c.cid !== deleteId));
            setDeleteId(null);
            message.success('删除成功');
        } catch (error: any) {
            if (error?.message?.includes('权限不足')) {
                message.error('您没有删除分类的权限');
            } else {
                message.error('删除失败：' + (error?.message || '未知错误'));
            }
        } finally {
            setDeleteLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={{
                textAlign: 'center',
                padding: '40px',
                color: '#999'
            }}>
                加载中...
            </div>
        );
    }

    if (error) {
        return (
            <div style={{
                margin: '20px 5%',
                padding: '12px',
                backgroundColor: '#fff2f0',
                border: '1px solid #ffccc7',
                borderRadius: '6px',
                color: '#ff4d4f'
            }}>
                ❌ {error}
            </div>
        );
    }

    return (
        <div style={Style.override}>
            <TopNav />
            <div style={{ marginTop: 100 }}>
                <div style={{
                position: 'relative',
                padding: '20px 5%',
                textAlign: 'center',
                borderBottom: '1px solid #f0f0f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'  // 保持标题居中
                }}>
                {/* 返回按钮在左边 */}
                <div style={{
                    position: 'absolute',
                    left: '5%'
                }}>
                    <Button 
                    type="link" 
                    onClick={() => navigate('/admin')}
                    icon={<ArrowLeftOutlined />}
                    style={{ 
                        padding: '0',
                        fontSize: '16px',
                        display: 'flex',
                        alignItems: 'center'
                    }}
                    >
                    返回
                    </Button>
                </div>
                
                {/* 标题居中 */}
                <h1 style={{ margin: 0 }}>分类管理</h1>
                </div>
            </div>
    
            <div style={{
                border: '2px solid lightgrey',
                padding: '10px',
                margin: '20px 5% 0 5%',
                width: '90%',
                minHeight: '30px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div>
                    <span style={{ fontSize: '14px', color: '#666' }}>
                        共 {categories.length} 个分类
                    </span>
                </div>
    
                <Button
                    type="primary"
                    onClick={() => navigate('/category/add')}
                >
                    添加分类
                </Button>
            </div>
    
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
                    加载分类列表中...
                </div>
            )}
    
            <div style={{
                border: '2px solid lightgrey',
                padding: '10px',
                margin: '0 5% 20px 5%',
                width: '90%',
                minHeight: '300px'
            }}>
                {categories.length === 0 && !loading ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '40px',
                        color: '#999'
                    }}>
                        暂无分类，点击"添加分类"按钮创建
                    </div>
                ) : (
                    categories.map(category => (
                        <div key={category.cid} style={Style.product}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginBottom: '12px'
                            }}>
                                <h2 style={{ margin: 0, color: '#1890ff' }}>
                                    {category.cname}
                                </h2>
                            </div>
    
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '16px'
                            }}>
                                <div>
                                    <span style={{ color: '#666' }}>
                                        ID: <strong>{category.cid}</strong>
                                    </span>
                                </div>
                                
                                {/* 商品数量显示在编辑删除按钮正上方，用红色 */}
                                <div style={{
                                    textAlign: 'right'
                                }}>
                                    <div style={{
                                        marginBottom: '8px'
                                    }}>
                                        <span style={{
                                            fontSize: '16px',
                                            fontWeight: 'bold',
                                            color: '#fa541c'
                                        }}>
                                            📦 共{category.productCount || 0}件商品
                                        </span>
                                    </div>
                                    
                                    <div>
                                        <Button
                                            onClick={() => navigate(`/category/edit/${category.cid}`)}
                                            size="small"
                                            type="primary"
                                            style={{ marginRight: '8px' }}
                                        >
                                            编辑
                                        </Button>
                                        <Button
                                            size="small"
                                            danger
                                            onClick={() => setDeleteId(category.cid)}
                                            disabled={category.productCount > 0}
                                        >
                                            删除
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
    
            <Modal
                title="确认删除"
                open={deleteId !== null}
                onOk={handleDelete}
                onCancel={() => setDeleteId(null)}
                confirmLoading={deleteLoading}
                okText="确认删除"
                cancelText="取消"
                okType="danger"
            >
                <p>确定要删除这个分类吗？</p>
                <p style={{ color: '#ff4d4f', fontSize: '12px', marginTop: '8px' }}>
                    此操作不可撤销！
                </p>
            </Modal>
        </div>
    );
}