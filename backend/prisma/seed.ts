import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 初始化管理员账户...')
  
  const adminPassword = await bcrypt.hash('admin123', 10)
  
  try {
    const admin = await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {
        // 如果管理员已存在，更新密码（可选）
        password: adminPassword,
        role: 'admin'
      },
      create: {
        username: 'admin',
        password: adminPassword,
        email: 'admin@example.com',
        isseller: false,
        role: 'admin'
      }
    })
    console.log(`✅ 管理员账户: ${admin.email}`)
    console.log(`   用户名: admin`)
    console.log(`   密码: admin123`)
    console.log(`   角色: ${admin.role}`)
  } catch (error) {
    console.error('❌ 创建管理员失败:', error)
  }
}

main()
  .catch((e) => {
    console.error('种子数据执行失败:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })