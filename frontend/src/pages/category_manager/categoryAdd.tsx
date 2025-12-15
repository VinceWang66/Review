import { Button, Input, message } from "antd";
import { Style } from "../../style/style";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { addCategory } from "../../utils/api";

export function CategoryAdd() {
    const navigate = useNavigate();
    const [cname, setCname] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [canSubmit, setCanSubmit] = useState(true);

    const handleChange = (value: string) => {
        setCname(value);
        if (error) setError("");
    };

    const handleBlur = () => {
        const errorMessage = judge(cname);
        setError(errorMessage);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // 添加 token 检查
        const token = localStorage.getItem('token');
        console.log('添加分类 - 提交时的token:', token);
        if (!token) {
            message.error('请先登录');
            navigate('/login');
            return;
        }
        
        setSubmitting(true);
    
        const errorMessage = judge(cname);
        setError(errorMessage);
    
        if (errorMessage) {
            setCanSubmit(false);
            setSubmitting(false);
            message.error("请检查表单，确保分类名称正确填写");
            return;
        }
    
        setCanSubmit(true);
    
        try {
            // 准备分类数据
            const categoryData = {
                cname: cname.trim()
            };
    
            console.log('准备提交的分类数据:', categoryData);
    
            // 调用 API 添加分类 - 移除了模拟延迟
            const result = await addCategory(categoryData);
            
            console.log('addCategory 返回结果:', result);
            
            // 检查返回结果
            if (result && (result.cid || result.id || result.cname)) {
                message.success("分类添加成功！");
    
                // 清空表单
                setCname("");
    
                // 延迟跳转
                setTimeout(() => {
                    navigate("/category");
                }, 500);
            } else {
                console.log('返回数据不完整:', result);
                message.error(result?.message || "添加分类失败，请重试");
            }
    
        } catch (error: any) {
            console.error("添加分类时发生错误:", error);
            console.error("错误详情:", error);
            
            // 区分不同错误类型
            if (error.message?.includes('权限不足')) {
                message.error('您没有添加分类的权限，请联系管理员');
            } else if (error.message?.includes('请先登录') || error.message?.includes('403')) {
                message.error('登录已过期，请重新登录');
                setTimeout(() => {
                    navigate('/login');
                }, 1000);
            } else if (error.message?.includes('唯一') || error.message?.includes('已存在')) {
                message.error('分类名称已存在，请使用其他名称');
            } else {
                message.error(`添加失败: ${error.message || "未知错误"}`);
            }
        } finally {
            setSubmitting(false);
        }
    };

    const judge = (value: string) => {
        if (!value.trim()) return "分类名称不能为空";
        if (value.length > 20) return "分类名称不能超过20个字";
        return "";
    };

    return (
        <div style={{ maxWidth: 500, margin: "0 auto", padding: "20px" }}>
            <h1 style={{ marginBottom: "24px" }}>添加新分类</h1>
            <form onSubmit={handleSubmit}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                    <label style={{ width: 100 }}>分类名称</label>
                    <Input
                        placeholder="请输入分类名称"
                        value={cname}
                        onInput={(e: any) => handleChange(e.target.value)}
                        onBlur={handleBlur}
                        disabled={submitting}
                    />
                </div>
                {error && (
                    <div style={Style.error}>{error}</div>
                )}

                <div style={Style.buttonContainer}>
                    <Button
                        htmlType="submit"
                        type="primary"
                        loading={submitting}
                        disabled={submitting}
                    >
                        {submitting ? "提交中..." : "添加分类"}
                    </Button>
                    <Button
                        onClick={() => navigate("/category")}
                        disabled={submitting}
                    >
                        取消
                    </Button>
                </div>

                {!canSubmit && error && (
                    <div style={{ textAlign: 'center' as const, ...Style.error }}>
                        请按照要求填写内容
                    </div>
                )}
            </form>
        </div>
    );
}