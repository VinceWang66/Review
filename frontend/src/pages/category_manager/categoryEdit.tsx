import { useNavigate, useParams } from "react-router-dom";
import { Button, Input, message } from "antd";
import { useEffect, useState } from "react";
import { getCategoryById, updateCategory } from "../../utils/api";
import { Style } from "../../style/style";

export function CategoryEdit() {
    const { id } = useParams<{ id: string }>();
    const cid = id ? parseInt(id) : null;
    const navigate = useNavigate();
    
    const [cname, setCname] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (cid === null) {
            message.error('分类ID无效');
            setLoading(false);
            return;
        }

        getCategoryById(cid)
            .then(category => {
                console.log('获取到的分类数据:', category);
                setCname(category.cname || "");
            })
            .catch(() => {
                message.error('获取分类数据失败，请稍后重试');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [cid]);

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
        
        const token = localStorage.getItem('token');
        if (!token) {
            message.error('请先登录');
            navigate('/login');
            return;
        }
        
        setSubmitting(true);

        const errorMessage = judge(cname);
        setError(errorMessage);

        if (errorMessage) {
            setSubmitting(false);
            message.error("请检查表单，确保分类名称正确填写");
            return;
        }

        try {
            if (cid === null) return;
            
            const categoryData = {
                cname: cname.trim()
            };

            console.log('准备提交的分类数据:', categoryData);

            const result = await updateCategory(cid, categoryData);
            
            if (result) {
                const isSuccess = result.success !== false && 
                                 !result.error && 
                                 !result.message?.includes("失败");
                
                if (isSuccess) {
                    message.success("分类更新成功！");
                    
                    setTimeout(() => {
                        navigate('/category');
                    }, 500);
                } else {
                    message.error(result?.message || "更新分类失败，请重试");
                }
            } else {
                message.error("更新分类失败，请重试");
            }

        } catch (error: any) {
            console.error("更新分类时发生错误:", error);
            
            if (error.message.includes('权限不足')) {
                message.error('您没有更新分类的权限，请联系管理员');
            } else if (error.message.includes('请先登录') || error.message.includes('403')) {
                message.error('登录已过期，请重新登录');
                setTimeout(() => {
                    navigate('/login');
                }, 1000);
            } else {
                message.error(`更新失败: ${error.message || "未知错误"}`);
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

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '40px' }}>加载中...</div>;
    }

    return (
        <div style={{ maxWidth: 500, margin: "0 auto", padding: "20px" }}>
            <h1 style={{ marginBottom: "24px" }}>编辑分类</h1>
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
                    <div style={{ color: '#ff4d4f', fontSize: '14px', marginBottom: '16px' }}>
                        {error}
                    </div>
                )}

                <div style={Style.buttonContainer}>
                    <Button
                        htmlType="submit"
                        type="primary"
                        loading={submitting}
                        disabled={submitting}
                    >
                        {submitting ? "更新中..." : "更新分类"}
                    </Button>
                    <Button
                        onClick={() => navigate(`/category`)}
                        disabled={submitting}
                    >
                        取消
                    </Button>
                </div>
            </form>
        </div>
    );
}