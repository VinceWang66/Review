import { Input, Button } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined, EditOutlined, LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { useState } from "react";
import { Style } from "../../style/style";
import { useNavigate } from "react-router-dom";

export function Register(){
    const navigate=useNavigate();
    const[username,setUsername]=useState('');
    const[password,setPassword]=useState('');
    const[email,setEmail]=useState('');
    const[error,setError]=useState({
        username:"",
        password:"",
        email:""
    })
    const [validated, setValidated] = useState({
        username: false,
        password: false,
        email: false
    });
    const [canSubmit,setCanSubmit]=useState('write');
    const [loading,setLoading]=useState(false);

    const handleBlur = async (e: React.FocusEvent<HTMLInputElement>)=>{
        const {name, value} = e.target;
        const errorMessage=judge(name, value);
        setValidated(p => ({ ...p, [name]: true }));
        setError(m=>({...m, [name]:errorMessage}))
        if (name === 'username' && value.trim().length >= 2 && !errorMessage) {
            try {
                const response = await fetch(
                    `http://localhost:3000/auth/check-username?username=${encodeURIComponent(value.trim())}`
                );
                const data = await response.json();
                
                if (!data.available) {
                    setError(prev => ({
                        ...prev,
                        username: data.message || '用户名已存在'
                    }));
                }
            } catch (error) {
                console.error('检查用户名失败:', error);
            }
        }
        
        // 额外检查邮箱是否存在
        if (name === 'email' && /^\S+@\S+\.\S+$/.test(value) && !errorMessage) {
            try {
                const response = await fetch(
                    `http://localhost:3000/auth/check-email?email=${encodeURIComponent(value.trim())}`
                );
                const data = await response.json();
                
                if (!data.available) {
                    setError(prev => ({
                        ...prev,
                        email: data.message || '邮箱已被注册'
                    }));
                }
            } catch (error) {
                console.error('检查邮箱失败:', error);
            }
        }
    }

    const handleSubmit = async (e: React.FormEvent)=>{
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
            setCanSubmit('formatError');
            return;
        }
        
        setLoading(true);

        try {
            const response = await fetch('http://localhost:3000/users/register',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                },
                body: JSON.stringify({
                    username: username.trim(),
                    password: password.trim(),
                    email: email.trim(),
                }),
            });
            const data = await response.json();
            if(!response.ok){
                throw new Error(data.message || '注册失败，请联系管理员处理');
            }
            setCanSubmit('submit');
        
            // 2. 500ms后提示并跳转
            setTimeout(() => {
                alert('注册成功！请登录');
                navigate('/login');
            }, 500);
        }catch(error:any){
            //设置提交状态为验证错误的loginError
            setCanSubmit('RegisterError');
            const errorMessage = error.message || '注册失败，请重试';
    
            if (errorMessage.includes('用户') || errorMessage.includes('username')) {
                setError(prev => ({ ...prev, username: errorMessage }));
            } else if (errorMessage.includes('邮箱') || errorMessage.includes('email')) {
                setError(prev => ({ ...prev, email: errorMessage }));
            } else if (errorMessage.includes('密码') || errorMessage.includes('password')) {
                setError(prev => ({ ...prev, password: errorMessage }));
            } else {
                // 通用错误只显示在邮箱字段
                setError(prev => ({ ...prev, email: errorMessage }));
            }
        }finally{
            setLoading(false);
        }
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

    const SubmitJudge = () =>{
        switch(canSubmit){
            case 'write':
                return "";
            case 'formatError':
                return "请按照要求填写内容";
            case 'registerError':
                return "注册失败";
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
                    onInput={(e:any)=>setUsername(e.target.value)}
                    suffix={
                        validated.username ? 
                            (error.username?
                                <CloseCircleOutlined style={{color: 'red'}}/>:
                                <CheckCircleOutlined style={{color:'green'}}/>
                            ) : null 
                    }
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
                    onInput={(e:any)=>setPassword(e.target.value)}
                    suffix={
                        validated.password ? 
                            (error.password?
                                <CloseCircleOutlined style={{color: 'red'}}/>:
                                <CheckCircleOutlined style={{color:'green'}}/>
                            ) : null 
                    }
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
                    onInput={(e:any)=>setEmail(e.target.value)}
                    suffix={
                        validated.email ? 
                            (error.email?
                                <CloseCircleOutlined style={{color: 'red'}}/>:
                                <CheckCircleOutlined style={{color:'green'}}/>
                            ) : null 
                    }
                />
                {error.email && (
                    <div style={Style.error}>
                    {error.email}
                    </div>
                )}
                <div style={Style.buttonContainer}>
                <Button htmlType="submit" type="primary" size="large" style={Style.button} loading={loading}>注册</Button>
                <Button onClick={()=>navigate(`/login`)} size="large" style={{backgroundColor:"lightgrey", ...Style.button}}>返回登陆</Button>
                </div>
                <div style={{textAlign: 'center' as const, ...Style.error}}>{SubmitJudge()}</div>
                {canSubmit==='submit' && <div style={{textAlign: 'center' as const, ...Style.right}}>注册成功</div>}
            </form>
        </div>
        </>
    )
}