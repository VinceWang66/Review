import { Button, Select } from "antd";
import { Style } from "../../style/style";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCategories, getProducts } from "../../utils/api";
import { TopNav } from "./topNav";

export function ProductList(){
    const navigate=useNavigate();
    const [products,setProducts]=useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [error, setError]=useState('');
    const [loading,setLoading]=useState(true);

    useEffect(() => {
        // 同时获取商品和分类
        Promise.all([
            getProducts(),
            getCategories()
        ])
        .then(([productsRes, categoriesRes]) => {
            console.log('商品数据:', productsRes);
            console.log('分类数据:', categoriesRes);
            setProducts(productsRes);
            setCategories(categoriesRes);
            setError('');
        })
        .catch(err => {
            console.error("获取数据失败", err);
            setError('获取数据失败，请稍后重试');
        })
        .finally(() => {
            setLoading(false);
        });
    }, []);

    // 筛选商品
    const filteredProducts = selectedCategory 
        ? products.filter(product => product.categoryId === selectedCategory)
        : products;

    // 获取当前选中分类的名称
    const getSelectedCategoryName = () => {
        if (!selectedCategory) return '全部商品';
        const category = categories.find(c => c.id === selectedCategory);
        return category ? category.cname : '未知分类';
    };

    const formatPrice = (priceObj: any) => {
        if (!priceObj || !priceObj.d) return '0.00';
        
        const integer = priceObj.d[0] || 0;
        const fraction = priceObj.d[1] || 0;
        
        const price = parseFloat(`${integer}.${fraction.toString().padStart(7, '0')}`);
        return price.toFixed(2);
    };

    return(
        <div style={Style.override}>
            <TopNav />
            <div style={{marginTop: 100}}>
                <div style={{
                    position: 'relative',
                    padding: '20px 5%',
                    textAlign: 'center',
                    borderBottom: '1px solid #f0f0f0'
                }}>
                    {/* 分类筛选框在左下角 */}
                    <div style={{
                        position: 'absolute',
                        left: '5%',
                        bottom: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <label style={{ color: '#666', fontSize: '14px' }}>类别：</label>
                        <Select
                            style={{ width: 120 }}
                            placeholder={<span style={{ color: '#000' }}>全部商品</span>}
                            value={selectedCategory === null ? undefined : selectedCategory}
                            onChange={(value) => {
                                console.log('Select 选择的值:', value);
                                setSelectedCategory(value);
                            }}
                            options={[
                                { value: null, label: '全部商品' },
                                ...categories.map(category => ({
                                    value: category.cid,
                                    label: category.cname
                                }))
                            ]}
                        />
                    </div>
                    
                    {/* 标题居中 */}
                    <h1 style={{ margin: 0 }}>商品列表</h1>
                    
                    {/* 显示当前筛选状态 */}
                    <div style={{
                        position: 'absolute',
                        right: '5%',
                        bottom: '10px',
                        fontSize: '14px',
                        color: '#666'
                    }}>
                        当前显示: {getSelectedCategoryName()} ({filteredProducts.length} 件)
                    </div>
                </div>
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
                {filteredProducts.length === 0 && !loading ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '40px',
                        color: '#999'
                    }}>
                        {selectedCategory ? '该分类下暂无商品' : '暂无商品'}
                    </div>
                ) : (
                    filteredProducts.map(product => (
                        <div key={product.pid} style={Style.product}>
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
                                lineHeight: '1.6',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2, // 限制显示2行
                                WebkitBoxOrient: 'vertical'
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
                                        onClick={()=> navigate(`/products/purchase/${product.pid}`)}
                                        size="small" type="primary" style={{ marginRight: '8px' }}
                                    >
                                        购买
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}