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

    // 古玩藏品场景 - 直接返回mock串流（三鸟币文案）
    if (scene === 'antique') {
      const mockContent = `🪙 哟，这可是"船上飞了三只鸟"啊！

好家伙，宝友们看看这是什么——三鸟币！一眼过去，这东西就不简单。你们知道吗，普通帆船币天上飞两只鸟，这玩意儿飞了三只，这第三只鸟，可值老钱了！😏

来，咱们仔细瞅瞅这枚币：

🚢 正面：帆船、海浪、旭日东升，这是1932-1934年国民政府发的孙中山帆船壹圆银币。但你往天上看——一、二、三，三只鸟！ 普通版才俩，这多出来的一只，那可是当年模具的"特殊待遇"，存世量极少。

👀 字口：你看这"壹圆"两个字，深峻有力，笔画清晰，这压力到位了。

✨ 包浆：这层皮壳，灰中带点五彩光，一看就是传世老东西，不是那种洗得贼亮的"澡堂子货"。

⚠️ 坑在哪：三鸟币仿品巨多！市面上十个有九个是高仿。真想玩这个，必须送盒子（NGC/PCGS），不然水太深，容易交学费。

💰 价值：真品三鸟，品相一般的都得小几千到上万，高分盒子币？那是几万到几十万的行情，看到没，这第三只鸟，飞的是钱啊！

说真的，玩银元的，谁不想有一枚三鸟？这玩意儿就是帆船币里的"天花板版别"，摆在那就是身份的象征。缘分到了，它就是你的；缘分没到，看看也过瘾！

🎤 宝友们，你们手里有三鸟吗？真的假的？评论区亮出来，咱们一起掌掌眼！

#三鸟币 #孙中山帆船银元 #古钱币收藏 #听泉鉴宝 #开门到代`;

      // 创建mock串流
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          // 开始前先停顿2秒，模拟AI思考
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // 逐字符发送，模拟打字效果
          for (const char of mockContent) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: char })}\n\n`));
            // 添加延迟模拟打字效果（40ms，更慢更自然）
            await new Promise(resolve => setTimeout(resolve, 40));
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        },
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
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
场景定位：${sceneDesc}

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
