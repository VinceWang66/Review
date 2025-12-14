import { Button, Input, message, Select } from "antd";
import { Style } from "../../style/style";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { addUser } from "../../utils/api";

export function UserAdd() {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        username: "",
        password: "",
        email: "",
        role: "user",  // 默认角色为用户
        isseller: false
    });
    const [error, setError] = useState({
        username: "",
        password: "",
        email: "",
        role: ""
    });
    const [canSubmit, setCanSubmit] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (field: string, value: string) => {
        setUser(p => ({ ...p, [field]: value }));
        if (error[field as keyof typeof error]) {
            setError(p => ({ ...p, [field]: "" }));
        }
    };

    const handleBlur = (field: string, value: string) => {
        const errorMessage = judge(field, value);
        setError(m => ({ ...m, [field]: errorMessage }));
    };

    const handleRoleChange = (value: string) => {
        setUser(p => ({ 
            ...p, 
            role: value,
            isseller: value === "seller"  // 如果是商家角色，自动设置isseller为true
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // 检查登录状态
        const token = localStorage.getItem('token');
        console.log('添加用户 - 提交时的token:', token);
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
            setCanSubmit(false);
            setSubmitting(false);
            message.error("请检查表单，确保所有必填项都已正确填写");
            return;
        }
    
        setCanSubmit(true);
    
        try {
            // 准备用户数据
            const userData = {
                username: user.username.trim(),
                password: user.password.trim(),
                email: user.email.trim(),
                role: user.role,
                isseller: user.role === "seller"
            };
    
            console.log('准备提交的用户数据:', userData);
    
            // 调用添加用户的API
            const result = await addUser(userData);
            
            console.log('addUser 返回结果:', result);
            
            // 检查返回结果
            if (result && (result.uid || result.id || result.username)) {
                message.success("用户添加成功！");
                
                // 清空表单
                setUser({
                    username: "",
                    password: "",
                    email: "",
                    role: "user",
                    isseller: false
                });
                
                // 延迟跳转
                setTimeout(() => {
                    navigate('/user');
                }, 500);
            } else {
                console.log('返回数据不完整:', result);
                message.error(result?.message || "添加用户失败，请重试");
            }
    
        } catch (error: any) {
            console.error("添加用户时发生错误:", error);
            console.error("错误详情:", error);
            
            // 区分不同错误类型
            if (error.message?.includes('权限不足')) {
                message.error('您没有添加用户的权限，请联系管理员');
            } else if (error.message?.includes('请先登录') || error.message?.includes('403')) {
                message.error('登录已过期，请重新登录');
                setTimeout(() => {
                    navigate('/login');
                }, 1000);
            } else if (error.message?.includes('已存在')) {
                if (error.message.includes('用户名')) {
                    message.error('用户名已存在，请使用其他用户名');
                    setError(p => ({ ...p, username: '用户名已存在' }));
                } else if (error.message.includes('邮箱')) {
                    message.error('邮箱已被注册，请使用其他邮箱');
                    setError(p => ({ ...p, email: '邮箱已被注册' }));
                }else {
                    message.error(error.message); 
                }
            } else {
                message.error(`添加失败: ${error.message || "未知错误"}`);
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
                if (!value.trim()) return "密码不能为空";
                if (value.length < 6) return "密码不能少于6个字符";
                if (value.length > 30) return "密码不能超过30个字符";
                if (!/^[a-zA-Z0-9_]+$/.test(value)) return "密码只能包含字母、数字和下划线";
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

    return (
        <div style={{ maxWidth: 500, margin: "0 auto", padding: "20px" }}>
            <h1 style={{ marginBottom: "24px" }}>添加新用户</h1>
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
                    <div style={Style.error}>
                        {error.username}
                    </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                    <label style={{ width: 100 }}>密码</label>
                    <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="请输入密码"
                        value={user.password}
                        onInput={(e: any) => handleChange("password", e.target.value)}
                        onBlur={() => handleBlur("password", user.password)}
                        disabled={submitting}
                    />
                </div>
                {error.password && (
                    <div style={Style.error}>
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
                    <div style={Style.error}>
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
                    <div style={Style.error}>
                        {error.role}
                    </div>
                )}

                {/* 如果选择商家角色，显示提示 */}
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
                        {submitting ? "提交中..." : "添加用户"}
                    </Button>
                    <Button
                        onClick={() => navigate(`/user`)}
                        disabled={submitting}
                    >
                        取消
                    </Button>
                </div>

                {!canSubmit && (
                    <div style={{ textAlign: 'center' as const, ...Style.error }}>
                        请按照要求填写内容
                    </div>
                )}
            </form>
        </div>
    );
}