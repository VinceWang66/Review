import { useNavigate } from "react-router-dom"
import { Style } from "../../style/style";
import { Button, Input } from "antd";
import { useState } from "react";

export function CategoryEdit(){
    // const { id } =useParams<{id:string}>();
    const navigate = useNavigate();
    const [cname, setCname] = useState("");
    const [error, setError] = useState("");
    const [canSubmit, setCanSubmit] = useState(true);

    const handleChange = (value: string) => {
        setCname(value);
        if (error) setError("");
    }

    const handleBlur = () => {
        const errorMessage = judge(cname);
        setError(errorMessage);
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const errorMessage = judge(cname);
        setError(errorMessage);
        
        if (errorMessage) {
            setCanSubmit(false);
            return;
        }
        setCanSubmit(true);
        navigate("/category"); // 跳转到分类列表页
    }
    
    const judge = (value: string) => {
        if (!value.trim()) return "分类名称不能为空";
        if (value.length > 20) return "分类名称不能超过20个字";
        return "";
    }

    return(
        <div style={{ maxWidth: 500, margin: "0 auto", padding: "20px" }}>
            <h1 style={{ marginBottom: "24px" }}>添加新分类</h1>
            <form onSubmit={handleSubmit}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                    <label style={{width:100}}>分类名称</label>
                    <Input 
                        placeholder="请输入分类名称"
                        value={cname}
                        onInput={(e:any) => handleChange(e.target.value)}
                        onBlur={handleBlur}
                    />
                </div>
                {error && (
                    <div style={Style.error}>{error}</div>
                )}
                
                <div style={Style.buttonContainer}>
                    <Button htmlType="submit" type="primary">提交分类</Button>
                    <Button onClick={() => navigate("/category")}>取消</Button>
                </div>
                
                {!canSubmit && error && (
                    <div style={{textAlign: 'center' as const, ...Style.error}}>
                        请按照要求填写内容
                    </div>
                )}
            </form>
        </div>
    )
}