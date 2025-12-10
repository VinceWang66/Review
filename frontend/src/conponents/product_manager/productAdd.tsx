import { Button, Input } from "antd";
import { Style } from "../../style/style";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function ProductAdd(){
    const navigate=useNavigate();
    const [products,setProducts]=useState({
        pname:"",
        description:"",
        price:"",
        stock:"",
        category:""
    })
    const [error,setError]=useState({
        pname:"",
        description:"",
        price:"",
        stock:"",
        category:""
    })
    const [canSubmit,setCanSubmit]=useState(true);

    const handlechange = (field:string, value:string)=>{
        setProducts(p=>({...p,[field]:value}));
        if (error[field as keyof typeof error]) {
            setError(prev => ({ ...prev, [field]: "" }));
        }
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>)=>{
        const {name, value} = e.target;
        const errorMessage=judge(name, value);
        setError(m=>({...m, [name]:errorMessage}))
    }

    const handleSubmit = (e: React.FormEvent)=>{
        e.preventDefault();
        const newError = {
            pname: judge("pname", products.pname),
            description: judge("description", products.description),
            price: judge("price", products.price),
            stock: judge("stock", products.stock),
            category: judge("category", products.category)
        };
        setError(newError);
        const hasError = Object.values(newError).some(err => err);
        if (hasError) {
            // alert("请按照要求填写");
            setCanSubmit(false);
            return;
        }
        setCanSubmit(true);
        navigate(`/products`)
    }
    const judge = (name:string, value:string)=>{
        switch(name){
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
                return "";
            case "stock":
                if (!value.trim()) return "商品库存不能为空";
                const stockNum = Number(value);
                if (isNaN(stockNum)) return "请输入有效的数字";
                if (!Number.isInteger(stockNum)) return "库存必须是整数";
                if (stockNum < 0) return "库存不能为负数";
                return "";
            case "category":
                if (!value.trim()) return "商品分类不能为空";
                if (value.length > 50) return "商品分类不能超过50个字";
                return "";
            default:
                return "";
        }
    }
    return(
        <div>
            <form onSubmit={handleSubmit}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                    <label style={{width:100}}>商品名称</label>
                    <Input 
                        name="pname"
                        placeholder="请输入商品名称"
                        value={products.pname}
                        onInput={(e:any)=> handlechange("pname", e.target.value)}
                        onBlur={handleBlur}
                    />
                </div>
                {error.pname && (
                    <div style={Style.error}>
                    {error.pname}
                    </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                    <label style={{width:100}}>商品描述</label>
                    <Input
                        name="description" 
                        placeholder="请输入商品描述"
                        onInput={(e:any)=> handlechange("description", e.target.value)}
                        onBlur={handleBlur}
                    />
                </div>
                {error.description && (
                    <div style={Style.error}>
                    {error.description}
                    </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                    <label style={{width:100}}>商品价格</label>
                    <Input 
                        name="price"
                        placeholder="请输入商品价格"
                        onInput={(e:any)=> handlechange("price", e.target.value)}
                        onBlur={handleBlur}
                    />
                </div>
                {error.price && (
                    <div style={Style.error}>
                    {error.price}
                    </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                    <label style={{width:100}}>商品库存</label>
                    <Input 
                        name="stock"
                        placeholder="请输入商品库存"
                        onInput={(e:any)=> handlechange("stock", e.target.value)}
                        onBlur={handleBlur}
                    />
                </div>
                {error.stock && (
                    <div style={Style.error}>
                    {error.stock}
                    </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                    <label style={{width:100}}>商品分类</label>
                    <Input 
                        name="category"
                        placeholder="请输入商品分类"
                        onInput={(e:any)=> handlechange("category", e.target.value)}
                        onBlur={handleBlur}
                    />
                </div>
                {error.category && (
                    <div style={Style.error}>
                    {error.category}
                    </div>
                )}
                <div style={Style.buttonContainer}>
                    <Button htmlType="submit" type="primary">提交商品</Button>
                    <Button onClick={()=>navigate(`/products`)}>取消</Button>
                </div>
                {!canSubmit && 
                    <div style={{textAlign: 'center' as const, ...Style.error}}>请按照要求填写内容</div>
                }
            </form>
        </div>
    )
}