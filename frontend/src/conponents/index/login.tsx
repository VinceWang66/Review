import { Input, Button } from "antd";
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Style } from "../../style/style";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function Login(){
    const navigate = useNavigate();
    const[username,setUsername]=useState('');
    const[password,setPassword]=useState('');
    const[error,setError]=useState({
        username:"",
        password:"",
    })
    const [canSubmit,setCanSubmit]=useState<'write' | 'formatError' | 'submit' | 'loginError'>('write');//初始化提交状态为write
    const [loading, setLoading] = useState(false);
    
    const handleSubmit = async(e: React.FormEvent)=>{
        e.preventDefault();
        //清空之前的提交错误
        if (canSubmit === 'loginError') {
            setCanSubmit('write');
        }

        const newError = {
            username: judge("username", username),
            password: judge("password", password), 
        };
        setError(newError);

        const hasError = Object.values(newError).some(err => err);
        if (hasError) {
            setCanSubmit('formatError');//设置提交状态为不可提交的formatError
            return;
        }
        //设置提交状态为submit
        setCanSubmit('submit');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:3000/auth/login',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                },
                body: JSON.stringify({
                    username: username.trim(),
                    password: password.trim()
                }),
            });
            const data = await response.json();
            if(!response.ok){
                throw new Error(data.message || '登陆失败，请联系管理员处理');
            }
            if(data.accessToken){
                localStorage.setItem('token',data.accessToken);
                navigate('/');
            }else{
                throw new Error('未获取到Token，请联系管理员处理')
            }
        }catch(error:any){
            //设置提交状态为验证错误的loginError
            setCanSubmit('loginError');
            setError({username:"", password:""})
        }finally{
            setLoading(false);
        }
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

    const Submitjudge = ()=>{
        switch(canSubmit){
            case('write'):
                return "";
            case('submit'):
                return "";
            case('formatError'):
                return "请按照要求填写内容";
            case('loginError'):
                return "用户名或密码错误";
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
                onInput={(e:any)=>setUsername(e.target.value)}
            />
            {error.username && (
                <div style={Style.error}>
                {error.username}
                </div>
            )}
            <Input.Password
                name="password"
                size="large" placeholder="请输入密码" prefix={<LockOutlined />} style={Style.input}
                onInput={(e:any)=>setPassword(e.target.value)}
            />
            {error.password && (
                <div style={Style.error}>
                {error.password}
                </div>
            )}
            <div style={Style.buttonContainer}>
            <Button htmlType="submit" type="primary" size="large" style={Style.button} loading={loading}>登录</Button>
            <Button onClick={()=>navigate(`/register`)} size="large" style={Style.button}>注册</Button>
            </div>
            <div style={{textAlign: 'center' as const, ...Style.error}}>
                {Submitjudge()}
            </div>
        </form>
        </div>
        </>
    )
}