import { Button } from "antd";
import { UserOutlined, AppstoreOutlined } from "@ant-design/icons";
import { TopNav } from "../product_manager/topNav";
import { Style } from "../../style/style";
import { useNavigate } from "react-router-dom";

export function Admin() {
  const navigate=useNavigate();
  return (
    <div style={{ ...Style.override, height: "100vh" }}>
      <TopNav />
      
      <div style={{
        display: "flex",
        justifyContent: "space-around", // 左右均匀分布
        alignItems: "center",
        height: "80vh",
        padding: "0 50px",
        marginTop:"5%"
      }}>
        
        {/* 左边：用户管理按钮 */}
        <div style={{
          width: "40%",
          height: "70%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <Button 
            type="primary"
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "20px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "32px",
              fontWeight: "bold"
            }}
            onClick={() => navigate("/user")}
          >
            {/* 超大图标 */}
            <UserOutlined style={{ 
              fontSize: "120px", 
              marginBottom: "30px" 
            }} />
            管理用户
          </Button>
        </div>

        {/* 右边：分类管理按钮 */}
        <div style={{
          width: "40%",
          height: "70%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <Button 
            type="primary"
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "20px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "32px",
              fontWeight: "bold"
            }}
            onClick={() => navigate("/category")}
          >
            {/* 超大图标 */}
            <AppstoreOutlined style={{ 
              fontSize: "120px", 
              marginBottom: "30px" 
            }} />
            管理分类
          </Button>
        </div>

      </div>
    </div>
  );
}