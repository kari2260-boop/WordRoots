#!/usr/bin/env node
/**
 * 自动配置数据库脚本
 * 使用 Supabase REST API 执行数据库迁移
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// 从 .env.local 读取配置
const envPath = path.join(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');

const SUPABASE_URL = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)?.[1]?.trim();
const SUPABASE_ANON_KEY = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/)?.[1]?.trim();

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ 无法从 .env.local 读取 Supabase 配置');
  process.exit(1);
}

console.log('🔧 开始配置数据库...');
console.log(`📍 Supabase URL: ${SUPABASE_URL}`);

// 读取 SQL 文件
const sqlPath = path.join(__dirname, '../supabase/schema.sql');
const sqlContent = fs.readFileSync(sqlPath, 'utf-8');

console.log('\n⚠️  注意：');
console.log('这个脚本需要 Service Role Key (不是 Anon Key) 才能执行 SQL。');
console.log('');
console.log('请按以下步骤手动执行：');
console.log('');
console.log('1. 打开 Supabase Dashboard: https://supabase.com/dashboard');
console.log('2. 选择你的项目');
console.log('3. 点击左侧 SQL Editor');
console.log('4. 点击 + New query');
console.log('5. 复制以下 SQL 内容：');
console.log('');
console.log('====================SQL开始====================');
console.log(sqlContent);
console.log('====================SQL结束====================');
console.log('');
console.log('6. 粘贴到 SQL Editor 并点击 Run');
console.log('');
console.log('✅ 执行成功后，数据库配置就完成了！');
