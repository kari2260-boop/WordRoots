const fetch = require('node-fetch');

async function testCustomAPI() {
  console.log('🧪 测试自定义 API 连接...\n');

  const apiKey = 'sk-UQsnpfuLJYL2jIGYVkbjMcSdFcsUF04imYD4aY5OWI82araI';
  const baseURL = 'https://www.fucheers.top/v1';

  try {
    console.log('📡 发送测试请求到:', `${baseURL}/chat/completions`);

    const response = await fetch(`${baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: '你好，请用一句话介绍你自己。'
          }
        ],
        max_tokens: 100
      })
    });

    console.log('📊 响应状态:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API 错误:', errorText);
      return;
    }

    const data = await response.json();
    console.log('\n✅ API 连接成功！');
    console.log('🤖 AI 回复:', data.choices?.[0]?.message?.content);
    console.log('\n✨ 配置正确，可以使用了！');

  } catch (error) {
    console.error('❌ 连接失败:', error.message);
    console.log('\n可能的原因:');
    console.log('1. API 地址不正确（需要确认是否需要 /v1 后缀）');
    console.log('2. API Key 无效');
    console.log('3. 网络连接问题');
  }
}

testCustomAPI();
