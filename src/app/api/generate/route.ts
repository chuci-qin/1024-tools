import { NextRequest } from 'next/server';

// 风格描述映射
const styleDescriptions: Record<string, string> = {
  smart: '智能识别产品特点，自动匹配最佳风格',
  viral: '爆款热门风格，使用网络热词和流行表达',
  professional: '专业商务风格，突出产品专业性和品质',
  creative: '创意时尚风格，独特新颖的表达方式',
  friendly: '亲和温馨风格，像朋友分享一样自然',
  humorous: '幽默搞笑风格，轻松有趣的表达',
};

// 场景描述映射
const sceneDescriptions: Record<string, string> = {
  default: '通用场景',
  beauty: '美妆护肤',
  fashion: '穿搭时尚',
  home: '家居生活',
  fitness: '健身运动',
  food: '美食餐饮',
  digital: '数码科技',
  baby: '母婴育儿',
  antique: '古玩藏品',
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image, style, scene, wordCount, supplement, platform } = body;

    if (!image) {
      return new Response(JSON.stringify({ error: '请上传产品图片' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const apiKey = process.env.LLM_API_KEY;
    const model = process.env.LLM_CHATBOT_MODEL || 'gpt-4o-mini';

    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'API Key 未配置' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const styleDesc = styleDescriptions[style] || styleDescriptions.smart;
    const sceneDesc = sceneDescriptions[scene] || sceneDescriptions.default;
    const platformName = platform === 'xiaohongshu' ? '小红书' : '抖音';

    // 古玩藏品场景的特殊提示
    const antiqueHint = scene === 'antique' 
      ? `\n\n古玩藏品专业知识：
- 如果看到有3个古钱币叠放在一起，请提到"钱到家"这个名词，这是取自"乾隆道光嘉靖"三个年号的谐音，寓意财源广进、招财进宝
- 请适当融入古玩收藏的专业术语和文化内涵`
      : '';

    const systemPrompt = `你是一个专业的社交媒体文案写手，擅长为${platformName}平台创作爆款内容。

你的任务是根据用户提供的产品图片，生成吸引人的标题和文案。

要求：
1. 首先输出标题（一行，带1-2个emoji，20字以内）
2. 然后空一行
3. 接着输出正文文案（口语化、有感染力，约${wordCount}字）
4. 适当使用emoji和${platformName}流行的网络热词
5. 文案要突出产品卖点和使用场景
6. 末尾添加3-5个相关话题标签（#xxx格式）

风格要求：${styleDesc}
场景定位：${sceneDesc}${antiqueHint}

直接输出内容，不要任何额外说明。`;

    const userContent = supplement 
      ? `请根据这张产品图片生成${platformName}文案。\n\n补充信息：${supplement}`
      : `请根据这张产品图片生成${platformName}文案。`;

    // 调用 OpenAI API (Streaming)
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: systemPrompt },
          { 
            role: 'user', 
            content: [
              { 
                type: 'image_url', 
                image_url: { 
                  url: image,
                  detail: 'low'
                } 
              },
              { type: 'text', text: userContent }
            ]
          }
        ],
        max_completion_tokens: 1000,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenAI API Error:', errorData);
      return new Response(JSON.stringify({ error: `AI 服务错误: ${response.status}` }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 创建 TransformStream 来处理 SSE
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const transformStream = new TransformStream({
      async transform(chunk, controller) {
        const text = decoder.decode(chunk);
        const lines = text.split('\n').filter(line => line.trim() !== '');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              controller.enqueue(encoder.encode('data: [DONE]\n\n'));
              return;
            }
            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
              }
            } catch (e) {
              // 忽略解析错误
            }
          }
        }
      },
    });

    // 返回 SSE 流
    return new Response(response.body?.pipeThrough(transformStream), {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Generate API Error:', error);
    return new Response(JSON.stringify({ error: '生成失败，请稍后重试' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
