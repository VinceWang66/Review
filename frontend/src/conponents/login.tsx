import { Input, Button } from "antd";
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Style } from "../style/style";
import { useState } from "react";

export function Login({onSwitch}:{onSwitch:()=>void}){
    const[username,setUsername]=useState('');
    const[password,setPassword]=useState('');
    const[error,setError]=useState({
        username:"",
        password:"",
    })
    const [canSubmit,setCanSubmit]=useState(true);

    const handleSubmit = (e: React.FormEvent)=>{
        e.preventDefault();
        const newError = {
            username: judge("username", username),
            password: judge("password", password), 
        };
        setError(newError);
        const hasError = Object.values(newError).some(err => err);
        if (hasError) {
            // alert("请按照要求填写");
            setCanSubmit(false);
            return;
        }
        setCanSubmit(true);
    }
    const judge = (name:string, value:string)=>{
        switch(name){
            case "username":
                if(!value.trim()){
                    return "用户名不能为空"
                }else{
                    return "";
                }
            case "password":
                if (!value.trim()) {
                    return "密码不能为空";
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
            <UserOutlined style={Style.icon}/>
        </div>
        <div style={Style.formContainer}>
        <form onSubmit={handleSubmit}>
            <Input 
                name="username"
                size="large" placeholder="请输入用户名" prefix={<UserOutlined/>} style={Style.input}
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
                onChange={e=>setPassword(e.target.value)}
            />
            {error.password && (
                <div style={Style.error}>
                {error.password}
                </div>
            )}
            <div style={Style.buttonContainer}>
            <Button htmlType="submit" type="primary" size="large" style={Style.button}>登录</Button>
            <Button onClick={onSwitch} size="large" style={Style.button}>注册</Button>
            </div>
            {!canSubmit && 
                <div style={{textAlign: 'center' as const, ...Style.error}}>请按照要求填写内容</div>
            }
        </form>
        </div>
        </>
    )
}