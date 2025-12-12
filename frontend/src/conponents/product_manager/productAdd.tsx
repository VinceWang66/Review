import { Button, Input, message, Select } from "antd";
import { Style } from "../../style/style";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { addProduct, getCategories } from "../../utils/api";
import TextArea from "antd/es/input/TextArea";

export function ProductAdd(){
    const navigate = useNavigate();
    const [products, setProducts] = useState({
        pname: "",
        description: "",
        price: "",
        stock: "",
        categoryId: ""  // 用户输入的分类名称
    })
    const [error, setError] = useState({
        pname: "",
        description: "",
        price: "",
        stock: "",
        categoryId: ""
    })
    const [canSubmit, setCanSubmit] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const [categoryLoading, setCategoryLoading] = useState(false);

    useEffect(() => {
        setCategoryLoading(true);
        getCategories()
            .then(data => {
                console.log('获取到的分类数据:', data);
                setCategories(data);
                setCategoryLoading(false);
            })
            .catch(err => {
                console.error('获取分类失败:', err);
                message.error('获取商品分类失败');
                setCategoryLoading(false);
            });
    }, []);
    
    const handlechange = (field:string, value:string)=>{
        setProducts(p=>({...p,[field]:value}));
        if (error[field as keyof typeof error]) {
            setError(p => ({ ...p, [field]: "" }));
        }
    }

    const handleBlur = (field: string, value: string)=>{
        const errorMessage=judge(field, value);
        setError(m=>({...m, [field]:errorMessage}))
    }

    const handleCategoryChange = (value: string) => {
        handlechange("categoryId", value);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        console.log('提交时的token:', token ? '存在' : '不存在');
        console.log('提交时的token值:', token);
        if (!token) {
            message.error('请先登录');
            navigate('/login');
            return;
        }
        setSubmitting(true);

        // 验证所有字段
        const newError = {
            pname: judge("pname", products.pname),
            description: judge("description", products.description),
            price: judge("price", products.price),
            stock: judge("stock", products.stock),
            categoryId: products.categoryId ? "" : "请选择商品分类"  // 验证是否选择了分类
        };

        setError(newError);
        const hasError = Object.values(newError).some(err => err);

        if (hasError) {
            setCanSubmit(false);
            setSubmitting(false);
            message.error("请检查表单，确保所有必填项都已正确填写");
            return;
        }

        setCanSubmit(true);

        try {
            // 准备商品数据
            const stockNum = parseInt(products.stock);

            const productData = {
                pname: products.pname.trim(),
                description: products.description.trim(),
                price: products.price,
                stock: stockNum,
                categoryId: parseInt(products.categoryId)  // 使用选择的分类ID
            };

            console.log('准备提交的商品数据:', productData);

            // 调用API插入商品
            const result = await addProduct(productData);
            
            if (result) {
                // 判断成功的条件
                const isSuccess = result.success !== false && 
                                 !result.error && 
                                 !result.message?.includes("失败");
                
                if (isSuccess) {
                    message.success("商品添加成功！");
                    
                    // 清空表单
                    setProducts({
                        pname: "",
                        description: "",
                        price: "",
                        stock: "",
                        categoryId: ""
                    });
                    
                    // 延迟跳转，让用户看到成功消息
                    setTimeout(() => {
                        navigate('/products/seller');
                    }, 500);
                } else {
                    message.error(result?.message || "添加商品失败，请重试");
                }
            } else {
                message.error("添加商品失败，请重试");
            }

        } catch (error: any) {
            console.error("添加商品时发生错误:", error);
    
        // 区分权限不足和未登录
        if (error.message.includes('权限不足')) {
            message.error('您没有添加商品的权限，请联系管理员');
        } else if (error.message.includes('请先登录') || error.message.includes('403')) {
            message.error('登录已过期，请重新登录');
            setTimeout(() => {
                navigate('/login');
            }, 1000);
        } else {
            message.error(`添加失败: ${error.message || "未知错误"}`);
        }
            } finally {
                setSubmitting(false);
            }
        }

    const judge = (name: string, value: string) => {
        switch (name) {
            case "pname":
                if (!value.trim()) return "商品名称不能为空";
                if (value.length > 100) return "商品名称不能超过100个字";
                return "";
            case "description":
                if (value.length > 1000) return "商品描述不能超过1000个字";
                return "";
            case "price":
                if (!value.trim()) return "商品价格不能为空";
                const priceNum = Number(value);
                if (isNaN(priceNum) || priceNum < 0) return "价格必须是有效数字且不小于0";
                if (priceNum === 0) return "价格不能为0";
                return "";
            case "stock":
                if (!value.trim()) return "商品库存不能为空";
                const stockNum = Number(value);
                if (isNaN(stockNum)) return "请输入有效的数字";
                if (!Number.isInteger(stockNum)) return "库存必须是整数";
                if (stockNum < 0) return "库存不能为负数";
                return "";
            case "categoryId":
                if (!value) return "请选择商品分类";
                return "";
            default:
                return "";
        }
    }

    const categoryOptions = categories.map(category => ({
        value: category.cid.toString(),
        label: category.cname
    }));

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                    <label style={{ width: 100 }}>商品名称</label>
                    <Input
                        name="pname"
                        placeholder="请输入商品名称"
                        value={products.pname}
                        onInput={(e: any) => handlechange("pname", e.target.value)}
                        onBlur={() => handleBlur("pname", products.pname)}
                        disabled={submitting}
                    />
                </div>
                {error.pname && (
                    <div style={Style.error}>
                        {error.pname}
                    </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                    <label style={{ width: 100 }}>商品描述</label>
                    <TextArea
                        name="description"
                        placeholder="请输入商品描述"
                        value={products.description}
                        onInput={(e: any) => handlechange("description", e.target.value)}
                        onBlur={() => handleBlur("description", products.description)}
                        disabled={submitting}
                        autoSize={{ minRows: 3, maxRows: 6 }}  // 自动调整高度，3-6行
                        style={{ resize: 'vertical' }}  // 允许垂直拖动调整大小
                        showCount  // 显示字数统计
                        maxLength={1000}  // 与验证规则保持一致
                    />
                </div>
                {error.description && (
                    <div style={Style.error}>
                        {error.description}
                    </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                    <label style={{ width: 100 }}>商品价格</label>
                    <Input
                        name="price"
                        placeholder="请输入商品价格"
                        value={products.price}
                        onInput={(e: any) => handlechange("price", e.target.value)}
                        onBlur={() => handleBlur("price", products.price)}
                        disabled={submitting}
                    />
                </div>
                {error.price && (
                    <div style={Style.error}>
                        {error.price}
                    </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                    <label style={{ width: 100 }}>商品库存</label>
                    <Input
                        name="stock"
                        placeholder="请输入商品库存"
                        value={products.stock}
                        onInput={(e: any) => handlechange("stock", e.target.value)}
                        onBlur={() => handleBlur("stock", products.stock)}
                        disabled={submitting}
                    />
                </div>
                {error.stock && (
                    <div style={Style.error}>
                        {error.stock}
                    </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                    <label style={{ width: 100 }}>商品分类</label>
                    <Select
                        style={{ width: '100%' }}
                        placeholder="请选择商品分类"
                        value={products.categoryId || undefined}
                        onChange={handleCategoryChange}
                        loading={categoryLoading}
                        disabled={submitting}
                        options={categoryOptions}
                        showSearch
                        allowClear
                    />
                </div>
                {error.categoryId && (
                    <div style={Style.error}>
                        {error.categoryId}
                    </div>
                )}
                <div style={Style.buttonContainer}>
                    <Button 
                        htmlType="submit" 
                        type="primary" 
                        loading={submitting}
                        disabled={submitting}
                    >
                        {submitting ? "提交中..." : "提交商品"}
                    </Button>
                    <Button 
                        onClick={() => navigate(`/products/seller`)} 
                        disabled={submitting}
                    >
                        取消
                    </Button>
                </div>
                {!canSubmit &&
                    <div style={{ textAlign: 'center' as const, ...Style.error }}>请按照要求填写内容</div>
                }
            </form>
        </div>
    )
}