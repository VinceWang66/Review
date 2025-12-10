import { Input, Button } from "antd";
import { EditOutlined, LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { useState } from "react";
import { Style } from "../../style/style";

export function Register({onSwitch}:{onSwitch:()=>void}){
    const[username,setUsername]=useState('');
    const[password,setPassword]=useState('');
    const[email,setEmail]=useState('');
    const[error,setError]=useState({
        username:"",
        password:"",
        email:""
    })
    const [canSubmit,setCanSubmit]=useState(true);

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>)=>{
        const {name, value} = e.target;
        const errorMessage=judge(name, value);
        setError(m=>({...m, [name]:errorMessage}))
    }

    const handleSubmit = (e: React.FormEvent)=>{
        e.preventDefault();
        const newError = {
            username: judge("username", username), // 同一个函数
            password: judge("password", password), // 同一个函数
            email: judge("email", email)           // 同一个函数
        };
        setError(newError);
        const hasError = Object.values(newError).some(err => err);
        if (hasError) {
            // alert("请按照要求填写");
            setCanSubmit(false);
            return;
        }
        setCanSubmit(true);
        onSwitch();
    }
    const judge = (name:string, value:string)=>{
        switch(name){
            case "username":
                if(!value.trim()){
                    return "用户名不能为空"
                }else if(value.length<2){
                    return "用户名不能少于两位"
                }else if(value.length>20){
                    return "用户名不能多于20字符"
                }else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
                    return "用户名只能包含字母、数字和下划线";
                }else{
                    return "";
                }
            case "password":
                if (!value.trim()) {
                    return "密码不能为空";
                } else if (value.length < 6) {
                    return "密码不能小于6位";
                } else if (value.length > 30) {
                    return "密码不能超过30个字符";
                } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
                    return "密码只能包含字母、数字和下划线";
                } else {
                    return "";
                }
            case "email":
                if (!value.trim()) {
                    return "邮箱不能为空";
                } else if (!/^\S+@\S+\.\S+$/.test(value)) {
                    return "邮箱格式不正确";
                } else {
                    return "";
                }
            default:
                return "";
        }
    }

    return(
        <>
        <div>
            <EditOutlined style={Style.icon}/>
        </div>
        <div style={Style.formContainer}>
            <form onSubmit={handleSubmit}>
                <Input 
                    name="username"
                    size="large" placeholder="请输入用户名" prefix={<UserOutlined/>} style={Style.input}
                    onBlur={handleBlur}
                    onChange={e=>setUsername(e.target.value)}
                />
                {error.username && (
                    <div style={Style.error}>
                    {error.username}
                    </div>
                )}
                <Input 
                    name="password"
                    size="large" placeholder="请输入密码" prefix={<LockOutlined />} style={Style.input}
                    onBlur={handleBlur}
                    onChange={e=>setPassword(e.target.value)} 
                />
                {error.password && (
                    <div style={Style.error}>
                    {error.password}
                    </div>
                )}
                <Input 
                    name="email"
                    size="large" placeholder="请输入邮箱" prefix={<MailOutlined />} style={Style.input}
                    onBlur={handleBlur}
                    onChange={e=>setEmail(e.target.value)}  
                />
                {error.email && (
                    <div style={Style.error}>
                    {error.email}
                    </div>
                )}
                <div style={Style.buttonContainer}>
                <Button htmlType="submit" type="primary" size="large" style={Style.button}>注册</Button>
                <Button onClick={onSwitch} size="large" style={{backgroundColor:"lightgrey", ...Style.button}}>返回登陆</Button>
                </div>
                {!canSubmit && 
                    <div style={{textAlign: 'center' as const, ...Style.error}}>请按照要求填写内容</div>
                }
            </form>
        </div>
        </>
    )
}