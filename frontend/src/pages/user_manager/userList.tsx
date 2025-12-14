import { Button, message, Modal, Card, Row, Col, Tag } from "antd";
import { 
  UserAddOutlined, 
  EditOutlined, 
  DeleteOutlined,
  MailOutlined,
  UserOutlined,
  CalendarOutlined,
  ArrowLeftOutlined
} from "@ant-design/icons";
import { Style } from "../../style/style";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUsers, deleteUser } from "../../utils/api";
import { TopNav } from "../product_manager/topNav";

export function UserList() {
  const navigate = useNavigate();
  
  // 状态
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [users, setUsers] = useState<any[]>([]);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        const usersRes = await getUsers();
        console.log('用户数据:', usersRes);
        
        // 处理API返回格式
        const usersData = Array.isArray(usersRes) ? usersRes : [];
        
        setUsers(usersData);
        setError('');
      } catch (err) {
        console.error("获取用户失败", err);
        setError('获取用户列表失败');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // 删除用户
  const handleDelete = async () => {
    if (!deleteId) return;
    
    setDeleteLoading(true);
    try {
      await deleteUser(deleteId);
      
      // 更新列表
      setUsers(prev => prev.filter(u => u.uid !== deleteId));
      setDeleteId(null);
      message.success('用户删除成功');
    } catch (err: any) {
      console.error("删除失败", err);
      if (err?.response?.data?.message?.includes('管理员')) {
        message.error('无法删除管理员账户');
      } else {
        message.error('删除失败: ' + (err?.message || '未知错误'));
      }
    } finally {
      setDeleteLoading(false);
    }
  };
  
  // 获取角色标签颜色
  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      admin: 'red',
      seller: 'orange',
      user: 'blue'
    };
    return colors[role] || 'default';
  };
  
  // 格式化时间
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('zh-CN');
  };
  
  if (loading) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '40px', 
        color: '#999' 
      }}>
        加载用户列表...
      </div>
    );
  }
  
  if (error) {
    return (
      <div style={{
        margin: '20px 5%',
        padding: '12px',
        backgroundColor: '#fff2f0',
        border: '1px solid #ffccc7',
        borderRadius: '6px',
        color: '#ff4d4f'
      }}>
        ❌ {error}
      </div>
    );
  }
  
  return (
    <div style={Style.override}>
      <TopNav />
      <div style={{ marginTop: 100 }}>
        <div style={{
        position: 'relative',
        padding: '20px 5%',
        textAlign: 'center',
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'  // 保持标题居中
        }}>
        {/* 返回按钮在左边 */}
        <div style={{
            position: 'absolute',
            left: '5%'
        }}>
            <Button 
            type="link" 
            onClick={() => navigate('/admin')}
            icon={<ArrowLeftOutlined />}
            style={{ 
                padding: '0',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center'
            }}
            >
            返回
            </Button>
        </div>
        
        {/* 标题居中 */}
        <h1 style={{ margin: 0 }}>分类管理</h1>
        </div>
    </div>
      
      {/* 操作栏 */}
      <div style={{
        border: '2px solid lightgrey',
        padding: '10px',
        margin: '20px 5% 0 5%',
        width: '90%',
        minHeight: '30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* 左侧：用户统计 */}
        <div>
          <span style={{ fontSize: '14px', color: '#666' }}>
            共 {users.length} 个用户
          </span>
        </div>
        
        {/* 右侧：添加按钮 */}
        <Button 
          type="primary" 
          icon={<UserAddOutlined />}
          onClick={() => navigate('/user/add')}
        >
          添加用户
        </Button>
      </div>
      
      {/* 用户列表 - 网格卡片布局 */}
      <div style={{
        margin: '20px 5%',
        minHeight: '400px'
      }}>
        {users.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: '#999'
          }}>
            暂无用户数据
          </div>
        ) : (
          <Row gutter={[16, 16]}>
            {users.map((user: any) => (
              <Col xs={24} sm={12} lg={8} xl={6} key={user.uid}>
                <Card
                  hoverable
                  style={{ height: '100%' }}
                  actions={[
                    <EditOutlined 
                      key="edit" 
                      onClick={() => navigate(`/user/edit/${user.uid}`)}
                      style={{ color: '#1890ff' }}
                    />,
                    <DeleteOutlined 
                      key="delete" 
                      onClick={() => setDeleteId(user.uid)}
                      style={{ color: '#ff4d4f' }}
                    />
                  ]}
                >
                  <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                    {/* 用户头像 */}
                    <div style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      backgroundColor: '#1890ff',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                      color: 'white',
                      marginBottom: '12px'
                    }}>
                      {user.username?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    
                    <h3 style={{ margin: '8px 0', color: '#1890ff' }}>
                      {user.username}
                    </h3>
                    
                    {/* 角色标签 */}
                    <Tag color={getRoleColor(user.role)} style={{ borderRadius: '12px' }}>
                      {user.role === 'admin' ? '管理员' : 
                       user.role === 'seller' ? '商家' : '普通用户'}
                    </Tag>
                  </div>
                  
                  {/* 用户信息 */}
                  <div style={{ marginTop: '16px' }}>
                    <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
                      <UserOutlined style={{ marginRight: '8px', color: '#666' }} />
                      <span>ID: <strong>{user.uid}</strong></span>
                    </div>
                    
                    <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
                      <MailOutlined style={{ marginRight: '8px', color: '#666' }} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {user.email}
                      </span>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', fontSize: '12px', color: '#999' }}>
                      <CalendarOutlined style={{ marginRight: '6px' }} />
                      <span>创建: {formatDate(user.createdAt)}</span>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>
      
      {/* 删除确认Modal */}
      <Modal
        title="确认删除用户"
        open={deleteId !== null}
        onOk={handleDelete}
        onCancel={() => setDeleteId(null)}
        confirmLoading={deleteLoading}
        okText="确认删除"
        cancelText="取消"
        okType="danger"
      >
        <p>确定要删除这个用户吗？</p>
        <p style={{ color: '#ff4d4f', fontSize: '12px', marginTop: '8px' }}>
          此操作不可撤销，用户将被永久删除！
        </p>
      </Modal>
    </div>
  );
}