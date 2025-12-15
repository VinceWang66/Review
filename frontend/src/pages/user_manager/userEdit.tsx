import { useNavigate, useParams } from "react-router-dom";
import { Button, Input, message, Select } from "antd";
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { useEffect, useState } from "react";
import { getUserById, updateUser } from "../../utils/api";
import { Style } from "../../style/style";

export function UserEdit() {
    const { id } = useParams<{ id: string }>();
    const uid = id ? parseInt(id) : null;
    const navigate = useNavigate();
    
    const [user, setUser] = useState({
        username: "",
        password: "",
        email: "",
        role: "user",
        isseller: false
    });
    const [error, setError] = useState({
        username: "",
        password: "",
        email: "",
        role: ""
    });
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (uid === null) {
            message.error('用户ID无效');
            setLoading(false);
            return;
        }

        getUserById(uid)
            .then(userData => {
                console.log('获取到的用户数据:', userData);
                setUser({
                    username: userData.username || "",
                    password: "", // 密码不显示
                    email: userData.email || "",
                    role: userData.role || "user",
                    isseller: userData.isseller || false
                });
            })
            .catch(() => {
                message.error('获取用户数据失败，请稍后重试');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [uid]);

    const handleChange = (field: string, value: string) => {
        setUser(p => ({ ...p, [field]: value }));
        if (error[field as keyof typeof error]) {
            setError(p => ({ ...p, [field]: "" }));
        }
    };

    const handleRoleChange = (value: string) => {
        setUser(p => ({ 
            ...p, 
            role: value,
            isseller: value === "seller"
        }));
    };

    const handleBlur = (field: string, value: string) => {
        const errorMessage = judge(field, value);
        setError(m => ({ ...m, [field]: errorMessage }));
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

        // 验证所有字段
        const newError = {
            username: judge("username", user.username),
            password: judge("password", user.password),
            email: judge("email", user.email),
            role: user.role ? "" : "请选择用户角色"
        };

        setError(newError);
        const hasError = Object.values(newError).some(err => err);

        if (hasError) {
            setSubmitting(false);
            message.error("请检查表单，确保所有必填项都已正确填写");
            return;
        }

        try {
            if (uid === null) return;
            
            // 准备用户数据 - 如果密码为空，则不更新密码
            const userData: any = {
                username: user.username.trim(),
                email: user.email.trim(),
                role: user.role
            };
            
            // 只有密码不为空时才更新密码
            if (user.password.trim()) {
                userData.password = user.password.trim();
            }

            console.log('准备提交的用户数据:', userData);

            const result = await updateUser(uid, userData);
            
            if (result) {
                const isSuccess = result.success !== false && 
                                 !result.error && 
                                 !result.message?.includes("失败");
                
                if (isSuccess) {
                    message.success("用户更新成功！");
                    
                    setTimeout(() => {
                        navigate('/user');
                    }, 500);
                } else {
                    message.error(result?.message || "更新用户失败，请重试");
                }
            } else {
                message.error("更新用户失败，请重试");
            }

        } catch (error: any) {
            console.error("更新用户时发生错误:", error);
            
            if (error.message.includes('权限不足')) {
                message.error('您没有更新用户的权限，请联系管理员');
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

    const judge = (name: string, value: string) => {
        switch (name) {
            case "username":
                if (!value.trim()) return "用户名不能为空";
                if (value.length < 2) return "用户名不能少于2个字符";
                if (value.length > 20) return "用户名不能超过20个字符";
                if (!/^[a-zA-Z0-9_]+$/.test(value)) return "用户名只能包含字母、数字和下划线";
                return "";
            case "password":
                // 密码可以为空（不更新密码）
                if (value.trim() && value.length < 6) return "密码不能少于6个字符";
                if (value.trim() && value.length > 30) return "密码不能超过30个字符";
                if (value.trim() && !/^[a-zA-Z0-9_]+$/.test(value)) return "密码只能包含字母、数字和下划线";
                return "";
            case "email":
                if (!value.trim()) return "邮箱不能为空";
                if (!/^\S+@\S+\.\S+$/.test(value)) return "邮箱格式不正确";
                return "";
            default:
                return "";
        }
    };

    const roleOptions = [
        { value: "user", label: "普通用户" },
        { value: "seller", label: "商家" },
        { value: "admin", label: "管理员" }
    ];

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '40px' }}>加载中...</div>;
    }

    return (
        <div style={{ maxWidth: 500, margin: "0 auto", padding: "20px" }}>
            <h1 style={{ marginBottom: "24px" }}>编辑用户</h1>
            <form onSubmit={handleSubmit}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                    <label style={{ width: 100 }}>用户名</label>
                    <Input
                        prefix={<UserOutlined />}
                        placeholder="请输入用户名"
                        value={user.username}
                        onInput={(e: any) => handleChange("username", e.target.value)}
                        onBlur={() => handleBlur("username", user.username)}
                        disabled={submitting}
                    />
                </div>
                {error.username && (
                    <div style={{ color: '#ff4d4f', fontSize: '14px', marginBottom: '16px' }}>
                        {error.username}
                    </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                    <label style={{ width: 100 }}>密码</label>
                    <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="留空表示不修改密码"
                        value={user.password}
                        onInput={(e: any) => handleChange("password", e.target.value)}
                        onBlur={() => handleBlur("password", user.password)}
                        disabled={submitting}
                    />
                </div>
                {error.password && (
                    <div style={{ color: '#ff4d4f', fontSize: '14px', marginBottom: '16px' }}>
                        {error.password}
                    </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                    <label style={{ width: 100 }}>邮箱</label>
                    <Input
                        prefix={<MailOutlined />}
                        placeholder="请输入邮箱"
                        value={user.email}
                        onInput={(e: any) => handleChange("email", e.target.value)}
                        onBlur={() => handleBlur("email", user.email)}
                        disabled={submitting}
                    />
                </div>
                {error.email && (
                    <div style={{ color: '#ff4d4f', fontSize: '14px', marginBottom: '16px' }}>
                        {error.email}
                    </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                    <label style={{ width: 100 }}>用户角色</label>
                    <Select
                        style={{ width: '100%' }}
                        placeholder="请选择用户角色"
                        value={user.role}
                        onChange={handleRoleChange}
                        disabled={submitting}
                        options={roleOptions}
                    />
                </div>
                {error.role && (
                    <div style={{ color: '#ff4d4f', fontSize: '14px', marginBottom: '16px' }}>
                        {error.role}
                    </div>
                )}

                {user.role === "seller" && (
                    <div style={{
                        marginBottom: '16px',
                        padding: '8px 12px',
                        backgroundColor: '#e6f7ff',
                        border: '1px solid #91d5ff',
                        borderRadius: '4px',
                        color: '#1890ff'
                    }}>
                        ℹ️ 商家用户可以发布和管理商品
                    </div>
                )}

                <div style={Style.buttonContainer}>
                    <Button
                        htmlType="submit"
                        type="primary"
                        loading={submitting}
                        disabled={submitting}
                    >
                        {submitting ? "更新中..." : "更新用户"}
                    </Button>
                    <Button
                        onClick={() => navigate(`/user`)}
                        disabled={submitting}
                    >
                        取消
                    </Button>
                </div>
            </form>
        </div>
    );
}