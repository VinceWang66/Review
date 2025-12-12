## 数据库ER图

![数据库ER图](./docs/images/database-erd.png)
**图例说明：**
- **主键**：蓝色字段，唯一标识记录
- **外键关系**：表间的连线，箭头指向主表
- **NN**：字段非空约束（NOT NULL）
- **数据类型**：varchar、integer、decimal等

## 核心关系说明

### 用户系统
- **用户表(users)**：存储所有用户信息，`isseller`字段标识卖家身份
- **角色控制**：`role`字段区分用户权限（user/seller/admin）

### 商品系统
- **商品表(products)**：卖家(`sellerId`)发布商品到分类(`categoryId`)
- **分类表(categories)**：商品的一级分类管理

### 订单系统
- **订单表(orders)**：买家(`userId`)创建订单，记录总额和状态
- **订单项表(order_items)**：关联订单和商品，记录购买数量

## 业务规则

### 用户权限
- 普通用户(`isseller=false`)：仅能购买商品
- 卖家(`isseller=true`)：可发布和管理自有商品
- 管理员(`role='admin'`)：全系统管理权限

### 订单状态流
待支付(pending) → 处理中(processing) → 已发货(shipped) → 已完成(completed)

### 库存管理
- 下单时验证商品库存(`stock`)
- 支付成功后扣减库存