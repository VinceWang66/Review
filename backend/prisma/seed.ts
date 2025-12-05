import { PrismaClient } from '@prisma/client';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  console.log('开始填充测试数据...');

  // 1. 创建用户（买家和卖家）
  const seller1 = await prisma.user.upsert({
    where: { email: 'seller1@example.com' },
    update: {},
    create: {
      username: 'tech_seller',
      password: 'hashed_password_123',
      email: 'seller1@example.com',
      isseller: true,
    },
  });

  const seller2 = await prisma.user.upsert({
    where: { email: 'seller2@example.com' },
    update: {},
    create: {
      username: 'fashion_seller',
      password: 'hashed_password_456',
      email: 'seller2@example.com',
      isseller: true,
    },
  });

  const buyer1 = await prisma.user.upsert({
    where: { email: 'buyer1@example.com' },
    update: {},
    create: {
      username: 'john_doe',
      password: 'hashed_password_789',
      email: 'buyer1@example.com',
      isseller: false,
    },
  });

  const buyer2 = await prisma.user.upsert({
    where: { email: 'buyer2@example.com' },
    update: {},
    create: {
      username: 'jane_smith',
      password: 'hashed_password_abc',
      email: 'buyer2@example.com',
      isseller: false,
    },
  });

  console.log('用户创建完成');

  // 2. 创建商品分类
  const electronicsCategory = await prisma.category.upsert({
    where: { cname: 'Electronics' },
    update: {},
    create: {
      cname: 'Electronics',
    },
  });

  const clothingCategory = await prisma.category.upsert({
    where: { cname: 'Clothing' },
    update: {},
    create: {
      cname: 'Clothing',
    },
  });

  const booksCategory = await prisma.category.upsert({
    where: { cname: 'Books' },
    update: {},
    create: {
      cname: 'Books',
    },
  });

  const homeCategory = await prisma.category.upsert({
    where: { cname: 'Home & Kitchen' },
    update: {},
    create: {
      cname: 'Home & Kitchen',
    },
  });

  console.log('分类创建完成');

  // 3. 创建商品
  const laptop = await prisma.product.upsert({
    where: { pname: 'MacBook Pro 16-inch' },
    update: {},
    create: {
      pname: 'MacBook Pro 16-inch',
      description: 'Latest Apple MacBook Pro with M3 Pro chip, 16GB RAM, 512GB SSD',
      stock: 50,
      price: 2399.99,
      categoryId: electronicsCategory.cid,
      sellerId: seller1.uid,
    },
  });

  const smartphone = await prisma.product.upsert({
    where: { pname: 'iPhone 15 Pro' },
    update: {},
    create: {
      pname: 'iPhone 15 Pro',
      description: 'Apple iPhone 15 Pro with A17 Pro chip, 256GB storage',
      stock: 100,
      price: 999.99,
      categoryId: electronicsCategory.cid,
      sellerId: seller1.uid,
    },
  });

  const tshirt = await prisma.product.upsert({
    where: { pname: 'Premium Cotton T-Shirt' },
    update: {},
    create: {
      pname: 'Premium Cotton T-Shirt',
      description: '100% cotton premium t-shirt, available in multiple colors',
      stock: 200,
      price: 29.99,
      categoryId: clothingCategory.cid,
      sellerId: seller2.uid,
    },
  });

  const jeans = await prisma.product.upsert({
    where: { pname: 'Slim Fit Jeans' },
    update: {},
    create: {
      pname: 'Slim Fit Jeans',
      description: 'Stylish slim fit jeans, stretchable material',
      stock: 150,
      price: 79.99,
      categoryId: clothingCategory.cid,
      sellerId: seller2.uid,
    },
  });

  const novel = await prisma.product.upsert({
    where: { pname: 'The Great Gatsby' },
    update: {},
    create: {
      pname: 'The Great Gatsby',
      description: 'Classic novel by F. Scott Fitzgerald',
      stock: 300,
      price: 12.99,
      categoryId: booksCategory.cid,
      sellerId: seller1.uid,
    },
  });

  const cookbook = await prisma.product.upsert({
    where: { pname: 'Modern Cooking Guide' },
    update: {},
    create: {
      pname: 'Modern Cooking Guide',
      description: 'Comprehensive guide to modern cooking techniques',
      stock: 80,
      price: 34.99,
      categoryId: booksCategory.cid,
      sellerId: seller2.uid,
    },
  });

  const coffeeMaker = await prisma.product.upsert({
    where: { pname: 'Premium Coffee Maker' },
    update: {},
    create: {
      pname: 'Premium Coffee Maker',
      description: 'Automatic coffee maker with programmable settings',
      stock: 60,
      price: 89.99,
      categoryId: homeCategory.cid,
      sellerId: seller1.uid,
    },
  });

  console.log('商品创建完成');

  // 4. 创建订单
  const order1 = await prisma.order.create({
    data: {
      totalAmount: 129.98,
      status: 'completed',
      userId: buyer1.uid,
      items: {
        create: [
          {
            quantity: 1,
            productId: tshirt.pid,
          },
          {
            quantity: 1,
            productId: novel.pid,
          },
        ],
      },
    },
  });

  const order2 = await prisma.order.create({
    data: {
      totalAmount: 1079.98,
      status: 'pending',
      userId: buyer2.uid,
      items: {
        create: [
          {
            quantity: 1,
            productId: smartphone.pid,
          },
          {
            quantity: 2,
            productId: tshirt.pid,
          },
        ],
      },
    },
  });

  const order3 = await prisma.order.create({
    data: {
      totalAmount: 2479.98,
      status: 'shipped',
      userId: buyer1.uid,
      items: {
        create: [
          {
            quantity: 1,
            productId: laptop.pid,
          },
          {
            quantity: 1,
            productId: coffeeMaker.pid,
          },
        ],
      },
    },
  });

  console.log('订单创建完成');

  // 5. 更新商品库存（模拟购买后的库存变化）
  await prisma.product.update({
    where: { pid: tshirt.pid },
    data: { stock: tshirt.stock - 3 }, // 被购买了3件
  });

  await prisma.product.update({
    where: { pid: smartphone.pid },
    data: { stock: smartphone.stock - 1 },
  });

  await prisma.product.update({
    where: { pid: laptop.pid },
    data: { stock: laptop.stock - 1 },
  });

  await prisma.product.update({
    where: { pid: novel.pid },
    data: { stock: novel.stock - 1 },
  });

  await prisma.product.update({
    where: { pid: coffeeMaker.pid },
    data: { stock: coffeeMaker.stock - 1 },
  });

  console.log('库存更新完成');

  // 6. 打印汇总信息
  const userCount = await prisma.user.count();
  const productCount = await prisma.product.count();
  const orderCount = await prisma.order.count();
  const categoryCount = await prisma.category.count();

  console.log('==============================');
  console.log('测试数据填充完成！');
  console.log('==============================');
  console.log(`创建了 ${userCount} 个用户（其中 ${await prisma.user.count({ where: { isseller: true } })} 个卖家）`);
  console.log(`创建了 ${categoryCount} 个商品分类`);
  console.log(`创建了 ${productCount} 个商品`);
  console.log(`创建了 ${orderCount} 个订单`);
  console.log(`创建了 ${await prisma.orderItem.count()} 个订单项`);
  console.log('==============================');

  // 7. 打印一些示例数据供测试使用
  console.log('\n示例用户信息：');
  console.log(`卖家1 - 用户名: ${seller1.username}, 邮箱: ${seller1.email}`);
  console.log(`买家1 - 用户名: ${buyer1.username}, 邮箱: ${buyer1.email}`);

  console.log('\n示例商品信息：');
  console.log(`电子产品 - ${laptop.pname}: ¥${laptop.price}, 库存: ${laptop.stock - 1}`);
  console.log(`服装 - ${tshirt.pname}: ¥${tshirt.price}, 库存: ${tshirt.stock - 3}`);

  console.log('\n示例订单信息：');
  console.log(`订单1 - 状态: ${order1.status}, 总金额: ¥${order1.totalAmount}`);
  console.log(`订单3 - 状态: ${order3.status}, 总金额: ¥${order3.totalAmount}`);
}

// execute the main function
main()
  .catch((e) => {
    console.error('填充数据时出错:', e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
    console.log('\nPrisma Client 已断开连接');
  });