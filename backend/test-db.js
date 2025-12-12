const { PrismaClient } = require('@prisma/client');

async function test() {
  const prisma = new PrismaClient();
  
  try {
    console.log('1. 连接数据库...');
    await prisma.$connect();
    console.log('✅ 数据库连接成功');
    
    console.log('\n2. 查询用户表...');
    const users = await prisma.user.findMany();
    console.log(`✅ 查询成功，找到 ${users.length} 个用户`);
    
    if (users.length === 0) {
      console.log('\n3. 创建测试用户...');
      const newUser = await prisma.user.create({
        data: {
          username: 'test_' + Date.now(),
          password: 'test123',
          email: 'test@example.com',
          isseller: false
        }
      });
      console.log('✅ 用户创建成功:', newUser.username);
    }
    
    console.log('\n🎉 所有测试通过！');
    
  } catch (error) {
    console.error('\n❌ 错误:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

test();