import { NextRequest, NextResponse } from 'next/server';

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
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image, style, scene, wordCount, supplement, platform } = body;

    if (!image) {
      return NextResponse.json(
        { error: '请上传产品图片' },
        { status: 400 }
      );
    }

    const apiKey = process.env.LLM_API_KEY;
    const model = process.env.LLM_CHATBOT_MODEL || 'gpt-4o-mini';

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API Key 未配置' },
        { status: 500 }
      );
    }

    const styleDesc = styleDescriptions[style] || styleDescriptions.smart;
    const sceneDesc = sceneDescriptions[scene] || sceneDescriptions.default;
    const platformName = platform === 'xiaohongshu' ? '小红书' : '抖音';

    const systemPrompt = `你是一个专业的社交媒体文案写手，擅长为${platformName}平台创作爆款内容。

你的任务是根据用户提供的产品图片，生成吸引人的标题和文案。

要求：
1. 标题要有吸引力，使用1-2个相关emoji，控制在20字以内
2. 文案要口语化、有感染力，像真实用户分享
3. 适当使用emoji和${platformName}流行的网络热词
4. 文案字数控制在${wordCount}字左右
5. 文案要突出产品卖点和使用场景
6. 末尾添加3-5个相关话题标签（#xxx格式）

风格要求：${styleDesc}
场景定位：${sceneDesc}

请严格按照以下JSON格式返回：
{
  "title": "生成的标题",
  "content": "生成的文案内容"
}`;

    const userContent = supplement 
      ? `请根据这张产品图片生成${platformName}文案。\n\n补充信息：${supplement}`
      : `请根据这张产品图片生成${platformName}文案。`;

    // 调用 OpenAI API
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
        max_tokens: 1000,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenAI API Error:', errorData);
      return NextResponse.json(
        { error: `AI 服务错误: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: 'AI 未返回有效内容' },
        { status: 500 }
      );
    }

    // 解析 JSON 响应
    try {
      // 尝试提取 JSON 部分
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0]);
        return NextResponse.json({
          title: result.title || '✨ 好物推荐',
          content: result.content || content,
        });
      }
    } catch (parseError) {
      // 如果解析失败，尝试分割标题和内容
      const lines = content.split('\n').filter((line: string) => line.trim());
      return NextResponse.json({
        title: lines[0] || '✨ 好物推荐',
        content: lines.slice(1).join('\n') || content,
      });
    }

    return NextResponse.json({
      title: '✨ 好物推荐',
      content: content,
    });

  } catch (error) {
    console.error('Generate API Error:', error);
    return NextResponse.json(
      { error: '生成失败，请稍后重试' },
      { status: 500 }
    );
  }
}

