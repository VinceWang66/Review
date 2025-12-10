import { Input, Button } from "antd";
import { EditOutlined, LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';

export function Register(){
    return(
        <>
        <div>
            <EditOutlined style={{ position:"relative", fontSize:'128px', color:'lightblue', bottom:102}}/>
        </div>
        <form>
            <Input size="large" placeholder="请输入用户名" prefix={<UserOutlined/>} style={{position:"relative", bottom:72}}/>
            <Input size="large" placeholder="请输入密码" prefix={<LockOutlined />} style={{position:"relative", bottom:42}}/>
            <Input size="large" placeholder="请输入邮箱" prefix={<MailOutlined />} style={{position:"relative", bottom:12}}/>
            <Button type="primary" size="large" style={{width:128, position:"relative", top:32}}>注册</Button>
        </form>
        </>
    )
}