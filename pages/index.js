"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Lock, Share2, RefreshCw, Zap, Heart, Shield, Anchor, Wind, Grid, Eye, Sun, Moon, ArrowDown, ChevronRight, BookOpen, Key, Feather, Search } from 'lucide-react';
import Head from 'next/head';

// 下面这行是模拟等待，不需要 Supabase
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * ==========================================
 * 数据源配置：已按新结构拆分结果内容
 * ==========================================
 */
// ... 接原来的代码 ...

// ==========================================
// 2. 核心资料库
// ==========================================

const DIMENSIONS = [
  { id: 1, label: "确定" },
  { id: 2, label: "价值" },
  { id: 3, label: "掌控" },
  { id: 4, label: "偏爱" },
  { id: 5, label: "共鸣" },
  { id: 6, label: "空间" },
  { id: 7, label: "防御" },
  { id: 8, label: "秩序" },
];

const INTERSTITIALS = {
  12: "正在剥离表层意识...",
  24: "正在穿越心理防御机制...",
  36: "即将触达核心渴望...",
};

const QUESTIONS = [
  { id: 1, text: "在一段关系里，哪种“默认设定”最像你？", options: [{ t: "只要我能感觉到他是稳定的，我很多不安都可以自己消化掉。", v: 1 }, { t: "只要我对他来说是“有用的”，他遇事会想到我，我就很安心。", v: 2 }, { t: "只要相处的节奏大致在我能掌握的范围内，我就不会乱。", v: 3 }, { t: "只要我能明显感到自己是“被偏爱”的那个，我可以包容很多。", v: 4 }] },
  { id: 2, text: "如果要选一句“恋爱观”，你更认同哪一种？", options: [{ t: "我更在意的是，两个人能不能聊到心里那层东西。", v: 5 }, { t: "我希望恋爱里双方都有自己的空间，不需要时时刻刻黏在一起。", v: 6 }, { t: "我喜欢慢慢靠近，不急着给关系下定义。", v: 7 }, { t: "我希望很多事情可以提前说清楚、对齐期待，而不是凭感觉走。", v: 8 }] },
  { id: 3, text: "你和喜欢的人发生一点小误会，对话变得有点别扭。你更可能是？", options: [{ t: "当下不一定说什么，但那天心里会有一小团不安挂着。", v: 1 }, { t: "会稍微让自己退半步，先看对方后续怎么处理这个不对劲。", v: 7 }, { t: "更在意的是这次沟通哪一步出了差错，下次要怎么讲才不会再歪。", v: 8 }, { t: "情绪会先被点燃，之后越想越委屈，忍不住在心里翻细节。", v: 4 }] },
  { id: 4, text: "下面几种“被需要”的场景，你最容易被哪一种打动？", options: [{ t: "他很自然地把一些事情交给你做，好像下意识就信任你能搞定。", v: 2 }, { t: "他在别人面前提到你，“这件事她比我更懂”，让你觉得被放在了一个位置上。", v: 3 }, { t: "他主动来找你聊一件他心里的难题，只想听听你的看法。", v: 5 }, { t: "他在状态不好的那阵子，不吵不闹，但明显把你当成情绪的缓冲区。", v: 1 }] },
  { id: 5, text: "你觉得哪种相处细节最能让你放松下来，觉得“我们是有关系的”？", options: [{ t: "吵架完可以坐下来认真聊，把误会捋清楚，而不是留一堆没说开的话。", v: 8 }, { t: "即使各自忙自己的，但他会偶尔冒出来问一句“你今天怎么样”。", v: 1 }, { t: "你们不必天天黏在一起，但约见时彼此都很专心地在这段时间里。", v: 6 }, { t: "他不会频繁试探你，而是给你时间，让你以自己的速度打开。", v: 7 }] },
  { id: 6, text: "当你对一个人上心之后，你最真实的变化是哪一种？", options: [{ t: "会自然而然多替他考虑一些实际的事，比如行程、安排、细节之类。", v: 3 }, { t: "想要更了解他的情绪、想法，开始对他的内心世界变得很感兴趣。", v: 5 }, { t: "会比平时更容易因为他的状态开心或失落，但外表尽量维持正常。", v: 4 }, { t: "愿意在力所能及的范围里多帮他一点，让他遇事能想到你。", v: 2 }] },
  { id: 7, text: "如果你发现，对方最近明显没以前那么主动，你最可能的内心走向是？", options: [{ t: "先把自己的热度调低一点，试着让自己也慢下来。", v: 7 }, { t: "会认真观察他整体的行为变化，而不是只盯着消息频率。", v: 8 }, { t: "心里会发酸，会开始怀疑是不是自己哪里不够好了。", v: 4 }, { t: "会提醒自己：那我就把注意力拉回自己身上，多充实一下生活。", v: 6 }] },
  { id: 8, text: "在亲密关系里，你最不想放弃的一样东西是？", options: [{ t: "对这个人的在意，不是说断就能断的那种真诚。", v: 4 }, { t: "能切实地给到对方力量：他变好这件事，多少跟你有关。", v: 2 }, { t: "自己的节奏与边界感，不因为恋爱就完全失衡。", v: 6 }, { t: "你们之间那种可以好好说话、好好商量事情的能力。", v: 8 }] },
  { id: 9, text: "一天结束后，你回想起今天和他的相处，什么画面最容易让你心里一下子软掉？", options: [{ t: "聊到某个话题突然很合拍，你们不约而同说出差不多的话。", v: 5 }, { t: "他注意到你有点累，顺手帮你分担了一点小事，没说什么但你感受到了。", v: 1 }, { t: "本来你以为他会黏着你，结果他很自然地尊重你的安排，让你自由决定见不见。", v: 6 }, { t: "你随口说的一个小细节，他记住了，还配合着的节奏一起做了点调整。", v: 3 }] },
  { id: 10, text: "他突然发消息说：“这个周末要不要见一面，我可以去找你。”你第一反应更接近哪一种？", options: [{ t: "有点开心，也开始想：那我这边可以帮他安排点什么、照顾好他。", v: 2 }, { t: "会先看自己这段时间的状态，心里问一句：“我现在准备好了吗？”", v: 7 }, { t: "心里一阵激动，紧接着会有点慌：怕自己期待太多，怕他又临时变卦。", v: 4 }, { t: "脑子里先快速盘一遍时间、路程、住哪里这些现实问题，再决定要不要答应。", v: 8 }] },
  { id: 11, text: "如果用一句话形容你在聊天里的“常驻角色”，你觉得自己更像？", options: [{ t: "负责把话题往前带、适时换场、控制气氛的人。", v: 3 }, { t: "偶尔能抛出一句让他愣一下、觉得“你很懂”的人。", v: 5 }, { t: "时不时会关心一句：“你最近怎么样”，维持那种被惦记的感觉。", v: 1 }, { t: "不会一下子聊太多，比较习惯先听听对方，再慢慢打开自己。", v: 7 }] },
  { id: 12, text: "如果在一段长期关系里，你发现他整体是“比较依赖你的人”，而你自己的精力时好时坏，你更常的做法是？", options: [{ t: "会给自己留出一块相对固定的独处时间，不让整个人被关系占满。", v: 6 }, { t: "即使有点累，你还是会尽量出现，生怕他在需要你的时候找不到人。", v: 2 }, { t: "会找一个状态相对平稳的时候，认真和他聊一聊你们目前的相处节奏。", v: 8 }, { t: "多数时候还是会配合，但心里会慢慢积累一点疲惫或委屈，不太知道怎么提。", v: 4 }] },
  { id: 13, text: "如果对方认真跟你说：“我想和你更近一点。” 你内心的真实反应更像？", options: [{ t: "会先慢半拍，心里想的是：“你能不能给我一点时间适应。”", v: 7 }, { t: "下意识开始想：那之后的关系节奏、界限要怎么重新安排。", v: 3 }, { t: "有一点被触动，会开始留意你们精神和情绪层面合不合。", v: 5 }, { t: "会自然而然多为他考虑，想一想自己能在哪些方面撑住他。", v: 2 }] },
  { id: 14, text: "你听到他随口提起前任或过去的感情经历时，你更接近哪种状态？", options: [{ t: "表面淡定，心里其实会微微不舒服，但会努力压下去。", v: 1 }, { t: "某些细节会卡在心里，之后想到的时候还是会有一点在意。", v: 4 }, { t: "在意的是他现在有没有真的把边界划清，而不是他有没有过去。", v: 6 }, { t: "会比较关心他从那段关系里学到了什么，以及现在的态度有没有变化。", v: 8 }] },
  { id: 15, text: "如果你知道你们未来一段时间会是“见面不太方便”的状态，你更可能？", options: [{ t: "自然把靠近的速度放慢一点，让彼此都有空间缓冲这种不确定。", v: 7 }, { t: "很重视各自的生活安排，觉得不一定非要高频见面，只要节奏合理就好。", v: 6 }, { t: "更愿意在力所能及的范围内，多为他做一些实际的支持，让他感到你在。", v: 2 }, { t: "会更看重聊天里的深度与心灵贴近感，而不只是“有没有见面”。", v: 5 }] },
  { id: 16, text: "当一段关系里已经出现过几次不小的争执，你最在意的是之后可以怎么收尾？", options: [{ t: "哪怕吵过，也希望他能看见你的情绪，而不是只讨论对错。", v: 4 }, { t: "你需要有一次好好坐下来聊，把之前的问题梳理清楚，弄明白以后怎么做。", v: 8 }, { t: "争执本身可以接受，但希望最终能把相处方式调整到一个双方都能掌控的节奏上。", v: 3 }, { t: "希望在这些事情之后，你仍然能感受到他在意你、愿意把你留在他的生活里。", v: 1 }] },
  { id: 17, text: "有一天他忽然发来一大段很认真、很真诚的长消息，聊他的想法和对你的在意。你最像哪种反应？", options: [{ t: "看到那段话的时候，会有一种心落地的感觉，好像终于被安稳地接住了。", v: 1 }, { t: "你会反复看几遍，挑出几句特别戳你的，觉得“这个人和别人不太一样”。", v: 5 }, { t: "很感动，但也会在心里想：那接下来我们要怎么把关系的节奏调整到他说的那个状态。", v: 3 }, { t: "会觉得这段话很好，但你还是需要一点时间慢慢消化，不会立刻整个人扑过去。", v: 7 }] },
  { id: 18, text: "他最近压力很大，你能感觉到他有点撑着。以下哪种你更像你自己？", options: [{ t: "会想办法多替他扛一点，很自然地接过一些事情，让他轻松一点。", v: 2 }, { t: "不太会缠着他，而是把自己的存在感调到“他想起就能找到你”的程度。", v: 6 }, { t: "情绪上会变得比较敏感，容易因为他一句话、一个表情就开始胡思乱想。", v: 4 }, { t: "会在心里给这段时期做个标记，观察他怎么处理压力、怎么处理你们的关系。", v: 8 }] },
  { id: 19, text: "如果你们在计划一次旅行，你更在意哪一块？", options: [{ t: "整体路线、节奏、预算这些要大致在你掌控范围内，这样整趟行程才不会乱。", v: 3 }, { t: "行程可以简单一点，但希望每天结束的时候，你能感到“我们是在一起生活”。", v: 1 }, { t: "提前说好分工、花费、预期，不要到了当场才临时起冲突。", v: 8 }, { t: "希望行程里预留一部分给“随缘”，可以临时改主意、临时换地方。", v: 6 }] },
  { id: 20, text: "如果你发现他对别人的事情很上心、很热心帮忙，你内心更可能是哪种声音？", options: [{ t: "会有一点莫名的酸意，忍不住和自己在他心里的分量比一比。", v: 4 }, { t: "觉得他愿意对别人这么负责，那他需要的时候，你也可以成为那个人。", v: 2 }, { t: "会想看看他在不同关系里的边界和态度，借此判断你们的关系位置。", v: 7 }, { t: "比较好奇的是：在深层想法和情绪上，他是不是还是更愿意对你坦白。", v: 5 }] },
  { id: 21, text: "哪一句话更容易让你对一段关系“心里亮一下”？", options: [{ t: "“跟你聊天，我会不自觉想多想一点东西。”", v: 5 }, { t: "“很多事情我都习惯先问问你怎么想。”", v: 3 }, { t: "“我喜欢我们都有自己的生活，但也都保留一部分给彼此。”", v: 6 }, { t: "“你有情绪就说，我不会觉得你麻烦。”", v: 1 }] },
  { id: 22, text: "当他最近一段时间特别爱找你倾诉、分享细节，而你那几天刚好情绪和精力都不太在线，你更可能是？", options: [{ t: "会有意识地减少在线时间，给自己留一点缓冲，不让自己完全被拖着走。", v: 6 }, { t: "一开始还是照单全收，等撑不住的时候情绪可能一下子喷出来。", v: 4 }, { t: "心里会想：他这么找我说明很信任我，所以能挤出来的时间你都会尽量陪着。", v: 2 }, { t: "会挑一个你状态稍微好一点的时机，和他认真商量“我们要不要换一种聊天/陪伴方式”。", v: 3 }] },
  { id: 23, text: "关系刚起步的阶段，你自己最明显的特点是什么？", options: [{ t: "会下意识慢一点，试探这个人值不值得你把心交出去。", v: 7 }, { t: "会比较在意“我们到底算什么”，不太喜欢长期悬在模糊地带。", v: 8 }, { t: "聊天频率不一定高，但你会希望每天有一点彼此的存在感。", v: 1 }, { t: "你很容易被一些小细节影响心情，比如他回你消息的语气、时间点之类。", v: 4 }] },
  { id: 24, text: "在一段已经比较稳定的关系里，你最想长期经营的是哪一部分？", options: [{ t: "有一些你们约定好的规则和默契，让关系始终在一个清楚的框架里。", v: 8 }, { t: "让彼此在这段关系里都保留“可以慢慢靠近、慢慢变化”的空间。", v: 7 }, { t: "不断让你们之间有新的体验、新的对话，不至于变成纯粹的日常搭伙。", v: 5 }, { t: "让自己真正在对方的人生里发挥作用，而不只是一个“名义上的角色”。", v: 2 }] },
  { id: 25, text: "如果别人直接问你：“你谈恋爱，最图的到底是什么？”你心里最接近哪一种？", options: [{ t: "图一个心安的位置，不用反复怀疑自己是不是被放在心外。", v: 1 }, { t: "图一种聊得进去、说得透的精神陪伴，而不是只一起打发时间。", v: 5 }, { t: "图的是有人和你并行，但你的人生主线依然掌握在自己手里。", v: 6 }, { t: "图的是有一个可以和你一起商量、一起做决定的人，而不是完全随缘。", v: 3 }] },
  { id: 26, text: "如果他在某个夜里突然跟你说：“我其实一直都很喜欢你。”你第一反应会更像？", options: [{ t: "有点想笑出来，心里那句是：“那以后你有事就都来找我。”", v: 2 }, { t: "心会一下子紧起来，需要一点时间消化这句话，不会立刻给很大的回应。", v: 7 }, { t: "情绪一下子翻上来，既开心又不安，本能地开始回想你们之前的一举一动。", v: 4 }, { t: "先冷静地问自己：那如果接受这句话，接下来我们要怎么走、怎么相处。", v: 8 }] },
  { id: 27, text: "周末两天，你和他都有空。你心里最舒服的安排大概是？", options: [{ t: "大部分时间各自做自己的事，挑一段时间认真见一次就很好。", v: 6 }, { t: "先看一下他和你各自的安排，再拟一个大致的节奏，避免两个人都乱。", v: 3 }, { t: "约定一个比较固定的相处时间，让你觉得这段关系是“被预留出来的”。", v: 1 }, { t: "看他最近在哪方面最需要人，你更倾向把时间用在支持他、陪他上。", v: 2 }] },
  { id: 28, text: "你心里觉得“浪漫”的场景，更偏向哪一种？", options: [{ t: "深夜路灯下，你们聊着很抽象的话题，却都真心投入。", v: 5 }, { t: "他偶尔因为你和别人说的话、做的事吃点小醋，却又不是真的闹。", v: 4 }, { t: "他认真和你讨论未来：住哪里、怎么分工、怎么一起生活。", v: 8 }, { t: "他没有急着推进关系，而是在你能承受的范围里，一点一点向你靠近。", v: 7 }] },
  { id: 29, text: "如果他突然遇到一件比较大的难题，你更希望自己在这件事里扮演什么角色？", options: [{ t: "给到他方向感和选择方案的人，帮他理一理局面。", v: 3 }, { t: "让他知道，就算你帮不了多少忙，他依然可以放心做自己的决定。", v: 6 }, { t: "在具体的事情上尽可能帮他分担一点，让他真的轻一点。", v: 2 }, { t: "陪他一起想这件事对他意味着什么，而不只是“要不要去做”。", v: 5 }] },
  { id: 30, text: "在下面几种「不舒服的关系时刻」里，你最难忍的是哪一种？", options: [{ t: "你明显已经难过了，他却装作没看见，或者轻描淡写带过去。", v: 4 }, { t: "有一段时间他对你的态度忽冷忽热，你完全摸不到他心里的支点。", v: 1 }, { t: "他不停往前推，你却还没准备好，但对方看不见你的犹豫。", v: 7 }, { t: "很多事情不说清楚，身份、界限、预期都处在一种模糊又暧昧的状态。", v: 8 }] },
  { id: 31, text: "别人认真夸你在亲密关系里的优点，哪句话最像会戳中你？", options: [{ t: "“你会让人觉得，有你在，很多事不用一个人扛。”", v: 2 }, { t: "“跟你在一起从来不无聊，总能聊出点新东西来。”", v: 5 }, { t: "“你很会掌握气氛，不会让场面一下子失控。”", v: 3 }, { t: "“和你在一起不会有窒息感，你很尊重对方自己的节奏。”", v: 6 }] },
  { id: 32, text: "当你开始认真考虑「要不要继续这段关系」时，通常是因为——", options: [{ t: "你发现自己在这段关系里越来越紧绷，很难自然靠近。", v: 7 }, { t: "你们多次沟通都说不清重点，好像谁也听不懂谁。", v: 8 }, { t: "无论你怎么配合，对方都很少给到让你安心的回应。", v: 1 }, { t: "情绪上的委屈、吃醋、失望被一点点积累，但对方似乎并不了解这一层。", v: 4 }] },
  { id: 33, text: "当你对一段关系开始失去热情时，最可能的原因是？", options: [{ t: "他越来越不回应你的情绪，让你觉得自己像单向付出。", v: 1 }, { t: "你发现自己变得太依赖他，而他并没有真正需要你。", v: 2 }, { t: "你们的节奏完全错位，沟通变得杂乱、低效。", v: 3 }, { t: "你察觉自己在这段关系里再也体会不到新鲜或灵感的共鸣。", v: 5 }] },
  { id: 34, text: "如果你已经默认这段关系是要走很久的，那在一开始，你最看重的是它具备哪一种基础条件？", options: [{ t: "我们有能力在出现矛盾时，把话摊开来讲清楚、找到解决办法。", v: 8 }, { t: "即使变成长期关系，我们依然各自有自己的重心和生活圈。", v: 6 }, { t: "就算日子再日常，也还能保留一些好奇、探索和心动的小火花。", v: 5 }, { t: "在需要被安抚、被拥抱的时候，对方不会选择冷淡或回避。", v: 1 }] },
  { id: 35, text: "他开始对未来提一些规划，但你觉得节奏太快了。你更像哪种反应？", options: [{ t: "会明确说出来，让他知道你还需要点时间。", v: 7 }, { t: "先顺着他聊下去，再找机会慢慢引导节奏回到你能接受的范围。", v: 3 }, { t: "一边高兴他有计划，一边有点担心自己跟不上。", v: 4 }, { t: "想知道他规划背后的动机，是为了关系，还是只是情绪上的冲动。", v: 8 }] },
  { id: 36, text: "哪种夸奖最能让你觉得“他是真的懂我”？", options: [{ t: "“你总能在我情绪要爆的时候稳住我。”", v: 1 }, { t: "“你对别人的状态特别敏感，懂得照顾人。”", v: 2 }, { t: "“你说话的角度很特别，每次都能带我看到新的东西。”", v: 5 }, { t: "“和你相处的节奏很舒服，从来不会有压力。”", v: 6 }] },
  { id: 37, text: "你更容易在哪种情境下“动心”？", options: [{ t: "对方认真听你讲一个复杂的想法，还会接上几句让你觉得被理解。", v: 5 }, { t: "你们做一件小事时，他完全信任地把掌控权交给你。", v: 3 }, { t: "他在混乱的局面里依然能顾及你的情绪，让你觉得被放在心上。", v: 1 }, { t: "他没有急着表白，只是默默待在那，你心里反而更柔了。", v: 7 }] },
  { id: 38, text: "当他在情绪不好的时候想一个人待着，你更常是哪种反应？", options: [{ t: "会等一段时间再轻轻问一句，给他留点空间但不完全放任。", v: 6 }, { t: "会有点紧张，怕他在逃避你，但也不敢太逼近。", v: 4 }, { t: "你会主动说：“我在，不用硬撑。”", v: 2 }, { t: "心里会记录下这次的情绪点，之后找机会问他想被怎么对待。", v: 8 }] },
  { id: 39, text: "别人问你：“你觉得自己在关系里属于哪种人？”你更像会怎么答？", options: [{ t: "“我属于那种比较稳的人，我会留着底线，但不轻易撤。”", v: 1 }, { t: "“我喜欢慢一点，等感觉到彼此的诚意再打开。”", v: 7 }, { t: "“我希望我们能不断长出新的连接点，不被惯性困住。”", v: 5 }, { t: "“我习惯处理实际问题，不喜欢情绪化的拉扯。”", v: 3 }] },
  { id: 40, text: "当你感到被误解时，你更常的做法是？", options: [{ t: "不急着解释，等对方冷静后再慢慢说清楚。", v: 8 }, { t: "先让对方知道你在意，不想让这件事拖太久。", v: 1 }, { t: "有点难受，会默默退出一会儿，等自己状态回稳。", v: 7 }, { t: "容易急，想马上澄清，因为不喜欢模糊的东西。", v: 3 }] },
  { id: 41, text: "当关系稳定到平淡期，你最怕的其实是？", options: [{ t: "他不再在意你的感受，所有互动都变成习惯。", v: 1 }, { t: "自己还在为对方考虑，而他似乎早就把“需要”转移到别处。", v: 2 }, { t: "你们谁都不主动调整，节奏一点点散掉。", v: 3 }, { t: "心跳和火花都还在，却再也找不到最初那种心动的方式。", v: 5 }] },
  { id: 42, text: "如果有机会重新定义“亲密”，你希望它更像哪种样子？", options: [{ t: "不需要时时表达，但彼此知道对方始终在。", v: 6 }, { t: "有安全也有灵魂的流动，不只靠黏度维系。", v: 5 }, { t: "互相尊重彼此的空间，又能在关键时刻并肩。", v: 8 }, { t: "两个人都愿意在关系里承担与回应，而不是一个人拉着走。", v: 1 }] },
  { id: 43, text: "当你回顾一段没走下去的关系，最常想到的是？", options: [{ t: "我是不是太想照顾对方，忘了自己其实也需要被照顾。", v: 2 }, { t: "如果当时我们能好好沟通，也许就不会那样结束。", v: 8 }, { t: "我当时太容易被情绪带走，没有稳住局面。", v: 3 }, { t: "其实那段关系让我重新认识了自己想要什么样的灵魂连接。", v: 5 }] },
  { id: 44, text: "别人评价你恋爱时的样子，哪句话更贴近你？", options: [{ t: "“你看起来温柔，但内心其实有自己的标准和节奏。”", v: 7 }, { t: "“你喜欢有清晰方向的关系，不喜欢含糊不清。”", v: 8 }, { t: "“你对喜欢的人真的很好，能顾得很细。”", v: 2 }, { t: "“你总能在别人慌的时候让气氛稳下来。”", v: 1 }] },
  { id: 45, text: "当你情绪低落时，对方做哪件小事最能让你觉得被爱？", options: [{ t: "安静地陪着，不问太多，让你自己慢慢回到平静。", v: 6 }, { t: "给你留一句温柔的话，让你知道他有在意。", v: 1 }, { t: "主动帮你分担一点现实的负担，比如跑腿、安排、打理。", v: 2 }, { t: "陪你做点无聊的小事，然后你们一起笑出来。", v: 5 }] },
  { id: 46, text: "当别人问你“你想要的爱是什么样的”，你最想说的是？", options: [{ t: "能彼此成全，而不是彼此消耗。", v: 6 }, { t: "有被看见的安心，也有被需要的价值。", v: 1 }, { t: "不一定浪漫，但要真实、清楚、能一起做决定。", v: 8 }, { t: "我希望在爱里也能保持一点自己的独立。", v: 7 }] },
  { id: 47, text: "如果有一天对方情绪爆发，开始说出一些冲动的话，你的第一反应更可能是？", options: [{ t: "先稳住局面，不和他一起起情绪，等他冷静后再谈。", v: 3 }, { t: "有一点受伤，但也会理解那只是当下情绪。", v: 4 }, { t: "尝试找出他爆发的点，是累积的委屈还是误会。", v: 8 }, { t: "会更想去照顾他，而不是先争个对错。", v: 2 }] },
  { id: 48, text: "你希望自己在一段成熟的关系里，最终是怎样的人？", options: [{ t: "能在关系里给彼此情绪上的安全与力量。", v: 1 }, { t: "能被真诚地依靠，也能坦然地去依靠别人。", v: 2 }, { t: "能在亲密与独立之间切换自如，稳又不腻。", v: 6 }, { t: "能和对方一起成长，不被困在旧模式里。", v: 5 }] },
];

const RESULTS = {
  1: {
    title: "确定感",
    keyword: "稳固基石",
    quote: "我是你的，只属于你，永远都是。",
    accent: "#E7E5E4",
    sections: [
      { t: "你的底色", c: "我不需要你时时拥抱我，但我需要知道——你站在我这边。\n\n对你来说，亲密关系的核心，是能不能让你心里有一个稳稳落脚的地方。你不追求持续的惊喜，也不需要夸张的浪漫，你真正看重的是——对方的态度是否一致、回应是否连贯、靠近是否可靠。" },
      { t: "你的优势", c: "1. 稳定情绪场：你在关系里自带“基线”作用，你的稳定让对方更容易放松。\n2. 愿意承担：只要确认对方是对的人，你会持续投入，不轻易退缩。\n3. 长期主义：你擅长经营长期关系，而不是追求短暂的激情。" },
      { t: "隐性挑战", c: "你对“不明确”的敏感度极高。一旦对方的态度、回复、行为有一点不连贯，你很容易陷入反复确认的循环，哪怕嘴上说着“没事”，心里却在默默消化不安。" },
      { t: "给爱你的TA", c: "你的稳定，对TA来说比任何甜言蜜语都重要。你可以不用每天说很多好听的话，但态度要前后一致。忽冷忽热、突然消失，对TA来说都是实打实的不安全感来源。" },
      { t: "自我温柔", c: "你可以允许自己承认：“我其实很需要别人对我坚定一点。”这不是软弱，而是你真实的心理结构。当你想要确认、想要表达不安时，不要自我否定。你的敏感，是在保护那个曾经被忽略的小孩。" },
      { t: "祝福", c: "愿你慢慢经历一些足够稳定的人和事，让你相信：世界并不总是忽明忽暗，有人会选择长期、选择守在你这边。" }
    ]
  },
  2: {
    title: "被需要感",
    keyword: "价值确认",
    quote: "没有你，我只是一片废墟。",
    accent: "#FB923C",
    sections: [
      { t: "你的底色", c: "我愿意付出，但我希望你能让我看见，我的存在让你生活得更轻松一点。\n\n你享受的是那种“我能帮到你”“你愿意依赖我”的感觉，它让你确认自己不是一个可替代的角色。最伤你的不是不浪漫，而是“有你没你，好像都差不多”。" },
      { t: "你的优势", c: "1. 真实减压：你能真实地为对方减轻生活压力，提供落地的支持。\n2. 爱的具象化：对方能从你身上感受到“我不是一个人在扛”。\n3. 黏性与温度：你的在场会让对方觉得“我被照顾，也愿意被照顾”。" },
      { t: "隐性挑战", c: "你容易把“对方不需要你”误当成“你不重要”。当对方暂时独立，你会突然感到空落。你很难直接表达“希望你来找我”，宁愿默默等。" },
      { t: "给爱你的TA", c: "当TA说“我来吧”的时候，是在表达爱。接受TA的帮助、让TA参与你的生活，是一种很重要的“我看见你”的回应。如果你总说“不用不用”，TA会怀疑自己是不是多余的。" },
      { t: "自我温柔", c: "你可以慢慢练习把一句话说出口：“这一次，我也想被照顾一下。”你不需要时刻有用，才值得被留下。你值得因为“只是你这个人”，就被好好珍惜。" },
      { t: "祝福", c: "愿你遇见的人，不只需要你的付出和能力，也愿意在你累的时候，反过来为你撑一把伞。" }
    ]
  },
  3: {
    title: "掌控感",
    keyword: "同频共振",
    quote: "我抛开了所有理智，只求你结束我的痛苦。",
    accent: "#94A3B8",
    sections: [
      { t: "你的底色", c: "我不是要掌控你，我是要确保我们走在同一条路上。\n\n对你来说，亲密更像一条需要共同维护的航道。你关注方向是否一致、节奏是否协调。你不是想“控制对方”，而是希望关系是有逻辑、有成长空间的。" },
      { t: "你的优势", c: "1. 关系管理：你能抓住问题核心，不会让误会无限扩大。\n2. 清晰沟通：无论是界限还是期待，你都能推动双方达成共识。\n3. 提供方向：和你在一起，对方会觉得关系是往前走的。" },
      { t: "隐性挑战", c: "当节奏失控时，你比别人更容易焦虑。你容易成为那个“带着关系往前走”的人，感到身心疲惫。你太擅长分析，以至于委屈常常没有机会被看见。" },
      { t: "给爱你的TA", c: "TA不是想控制你，而是害怕关系失控。当TA提议“我们聊聊”，不是想吵架，而是想把关系拉回安全状态。你需要给TA一种“合作感”，而不是只让TA一个人扛。" },
      { t: "自我温柔", c: "你可以练习偶尔不当那个最清醒的人，允许自己说：“我现在也不知道怎么办，我们先抱一下。”你不是不可以掌控，只是你有权利不是每一次都要做那个负责一切的人。" },
      { t: "祝福", c: "愿你遇见可以和你一起扛事、一起做决定的人，而不是总让你一个人做那个“负责全局的大人”。" }
    ]
  },
  4: {
    title: "被偏爱感",
    keyword: "独特例外",
    quote: "你要永远为你驯服的东西负责。",
    accent: "#FB7185",
    sections: [
      { t: "你的底色", c: "我不需要世界偏爱我，但我希望你会。\n\n你真正需要的是一种“在你心里，我是例外”的确认。你会从微妙的细节里，辨认自己是否拥有独一份的意义。你比大多数人更能感受到感情里的温度变化。" },
      { t: "你的优势", c: "1. 深情专注：一旦认定，你会给对方非常明确、稳定的爱意。\n2. 敏锐体贴：你能察觉到别人察觉不到的细节。\n3. 独特经营：你会用心经营“你们之间的独特性”，让关系更动人。" },
      { t: "隐性挑战", c: "你对“差别对待”异常敏感。如果对方对别人多花一点心，你的心情会迅速被影响。你容易把小事变成“大信号”，一个忽略都会触发不安。" },
      { t: "给爱你的TA", c: "很多时候，TA要的不是“更多”，而是“和别人不一样”。这种“只给你”的信号，会让TA真正安定下来。别用“你想太多了”否定TA的敏感，主动表达在意是刚需。" },
      { t: "自我温柔", c: "当你因为细节难过时，别急着骂自己“小心眼”。承认“我只是害怕自己没那么重要”。试着给自己一点偏爱，而不是全靠别人来证明。你值得被偏爱。" },
      { t: "祝福", c: "愿你遇到的不是“普普通通对谁都好的人”，而是会在你面前，真心露出一点笨拙和特别的人。" }
    ]
  },
  5: {
    title: "精神共鸣",
    keyword: "灵魂契合",
    quote: "我们相遇在精神的旷野，无需言语便已相通。",
    accent: "#818CF8",
    sections: [
      { t: "你的底色", c: "亲密不只是靠近，而是被理解、被看见、被思想牵引。\n\n你渴望一种能与你一起思考、一起成长、一起对世界提出问题的关系。没有精神交流，你会觉得亲密关系像缺了核心。你追求的是“你一句话我就懂”的心灵接触。" },
      { t: "你的优势", c: "1. 思想活力：你不是在谈恋爱，而是在共同扩展世界。\n2. 深度理解：你真正会听、会理解，让对方有“被懂了”的体验。\n3. 持续焕新：和你在一起，关系不会陷入重复和枯燥。" },
      { t: "隐性挑战", c: "你对“浅层亲密”的耐受度很低。如果关系长期停留在生活表层，你会很快抽离。你容易把“不被理解”解读成“不被在意”。" },
      { t: "给爱你的TA", c: "TA需要和你聊“心里真正的东西”。哪怕只是聊聊困惑、价值观，对TA来说都非常关键。你不必很“有文化”，但要愿意真诚地思考和回应。" },
      { t: "自我温柔", c: "你对思考和意义的渴望，是一种珍贵的能力，而不是“太复杂”。如果对方跟不上，允许自己不把所有深度需求寄托在一个人身上。你值得被理解。" },
      { t: "祝福", c: "愿你这一生，不只遇见和你共享生活的人，也遇见可以和你共享思考与好奇心的人。" }
    ]
  },
  6: {
    title: "空间感",
    keyword: "自由呼吸",
    quote: "我爱你，却不愿用爱束缚你。",
    accent: "#38BDF8",
    sections: [
      { t: "你的底色", c: "靠近你不难，难的是用不吞没、不束缚的方式靠近。\n\n你对亲密的理解是在爱里保持自我完整。你愿意靠近，但必须保留足够的空间呼吸。只要这种空间被尊重，你的爱就会流得轻盈而稳定。" },
      { t: "你的优势", c: "1. 保持自我：你能让对方在关系里觉得“和你在一起，我还是我”。\n2. 尊重界限：你不会越界，也不会让别人轻易越界。\n3. 轻盈亲密：你不戏剧化、不过度要求，使关系保持舒展。" },
      { t: "隐性挑战", c: "你很难处理“被缠住”的时刻。任何过度关注都会让你想退开。你过于依赖“自己消化”，容易让对方误以为你“不够爱”。" },
      { t: "给爱你的TA", c: "给空间，不等于不在意。TA需要时间把自己调匀好，再回来面对你。别用“时刻在线”去检验爱，那只会让TA想后退。" },
      { t: "自我温柔", c: "你可以在关系开始就温和地告诉对方：“我在乎你，但我也很需要自己的空间。”这是保护自己，不是推开别人。你有权利拥有属于自己的轨道。" },
      { t: "祝福", c: "愿你始终保有那份做自己的勇气，愿你的关系里，你们不是彼此的牢笼，而是并行的光。" }
    ]
  },
  7: {
    title: "安全距离",
    keyword: "审慎靠近",
    quote: "待人如执烛，太近灼手，太远暗生。",
    accent: "#34D399",
    sections: [
      { t: "你的底色", c: "我不是不愿意靠近，我只是想安全地靠近。\n\n你的亲密节奏里有一种审慎，你需要在靠近前先确认值得托付。你不是冷淡，只是有自己的节奏：观察、确认、再靠近。一旦确认，你会比大多数人都长情。" },
      { t: "你的优势", c: "1. 慎重稳定：你不会轻易进入关系，但只要进入，就非常可靠。\n2. 分寸感：和你相处“刚刚好”，不被吞没，也不被忽略。\n3. 情绪保护：你不把情绪甩给别人，避免双方受伤。" },
      { t: "隐性挑战", c: "你太慢了，别人常常无法理解你的节奏。你对“被催促”特别敏感，容易把对方的热情误判为压力而退缩。" },
      { t: "给爱你的TA", c: "TA的慢，不等于没感觉。催得太急只会激活TA的保护机制。稳定、持续的小动作，比一次性的轰轰烈烈更重要。保持“持续的可靠”，TA才敢真正放下防备。" },
      { t: "自我温柔", c: "承认“我慢，是因为我把关系当真”，而不是自责“太冷”。你有权利慢慢相信别人，也有权利让别人慢慢学会怎么相信你。" },
      { t: "祝福", c: "愿你遇见那种不急、不逼、不催你交卷的人，愿有人愿意陪你在门口坐一会儿，等你准备好再打开门。" }
    ]
  },
  8: {
    title: "秩序感",
    keyword: "清晰结构",
    quote: "爱情是一种本能，要么生下来就会，要么永远都不会。",
    accent: "#60A5FA",
    sections: [
      { t: "你的底色", c: "亲密不是混乱的流动，而是共同打造的一种秩序。\n\n你对亲密关系的核心需求是清晰、结构和共同决策。你希望知道关系的位置、节奏和未来方向。这不是理性过度，而是一种成熟的互赖感。" },
      { t: "你的优势", c: "1. 建立结构：你擅长把混乱变成有序，把模糊变成明确。\n2. 解决问题：当关系不顺时，你不是逃避，而是想要一起找到答案。\n3. 安全踏实：在你这里，亲密是可以依赖的现实支持。" },
      { t: "隐性挑战", c: "你对“不明确性”零容忍。一旦对方态度模糊，你就会不安。你容易忽略情感流动，看得很清楚，但别人需要的可能是共情。" },
      { t: "给爱你的TA", c: "对TA来说，“说清楚”本身就是一种爱。TA不是在较真，而是为了减少折腾。长时间的模糊状态会严重消耗TA。愿意一起讨论规则，TA会觉得被尊重。" },
      { t: "自我温柔", c: "你的秩序感是你保护自己和关系的能力。允许关系里存在一部分“暂时没答案的空白”，但前提是对方在努力。你配得上一个愿意和你一起整理的人。" },
      { t: "祝福", c: "愿你遇见愿意和你一起把话说清楚、一起面对现实，一起规划未来的人。" }
    ]
  }
};

// ==========================================
// 3. 视觉组件 (SVG 雷达图 + CSS 动态图腾)
// ==========================================

const RadarChart = ({ scores }) => {
  const size = 220;
  const center = size / 2;
  const radius = 80;
  
  const points = DIMENSIONS.map((dim, i) => {
    const angle = (Math.PI * 2 * i) / 8 - Math.PI / 2;
    const val = Math.min((scores[dim.id] || 0) * 1.5, 12) / 12; // 放大比例
    const r = radius * (0.2 + 0.8 * val);
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="radar-wrapper">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* 网格 */}
        {[0.25, 0.5, 0.75, 1].map(level => (
          <polygon key={level}
            points={DIMENSIONS.map((_, i) => {
              const angle = (Math.PI * 2 * i) / 8 - Math.PI / 2;
              const r = radius * level;
              return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
            }).join(' ')}
            fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"
          />
        ))}
        {/* 数据层 */}
        <polygon points={points} fill="rgba(255, 255, 255, 0.15)" stroke="rgba(255, 255, 255, 0.9)" strokeWidth="2" />
        {/* 标签 */}
        {DIMENSIONS.map((dim, i) => {
          const angle = (Math.PI * 2 * i) / 8 - Math.PI / 2;
          const x = center + (radius + 20) * Math.cos(angle);
          const y = center + (radius + 20) * Math.sin(angle);
          return (
            <text key={i} x={x} y={y} fill="rgba(255,255,255,0.6)" fontSize="10" textAnchor="middle" alignmentBaseline="middle">
              {dim.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

const AbstractTotem = ({ id }) => {
  return (
    <div className={`totem type-${id}`}>
      <div className="t-circle-main"></div>
      <div className="t-circle-ripple"></div>
      <div className="t-particles"></div>
    </div>
  )
}

// ==========================================
// 4. 主程序
// ==========================================

export default function App() {
  const [view, setView] = useState('welcome'); 
  const [code, setCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [scores, setScores] = useState({ 1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0, 8:0 });
  const [finalResultId, setFinalResultId] = useState(null);
  const [fadeKey, setFadeKey] = useState(0);
  const [interstitialMsg, setInterstitialMsg] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // 验证 (极速版逻辑)
  const handleVerify = async () => {
    if (!code.trim()) return;
    setIsVerifying(true);
    setErrorMsg('');
    
    // 超时 Promise (15秒)
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("网络连接超时，请检查网络")), 15000)
    );

    // 请求 Promise
    const requestPromise = (async () => {
      const { data, error } = await supabase.from('codes').select('*').eq('code', code.trim()).single();
      if (error || !data) throw new Error('无效的兑换码');
      if (data.is_used) throw new Error('该兑换码已被使用');
      await supabase.from('codes').update({ is_used: true }).eq('id', data.id);
      return data;
    })();

    try {
      await Promise.race([requestPromise, timeoutPromise]);
      setView('quiz'); // 极速版：成功立即跳转，不加人为延迟
    } catch (err) {
      setErrorMsg(err.message || '网络异常');
    } finally {
      setIsVerifying(false);
    }
  };

  // 答题
  const handleAnswer = async (value) => {
    const newScores = { ...scores, [value]: scores[value] + 1 };
    setScores(newScores);
    const nextIndex = currentQIndex + 1;
    
    // 触发深潜模式
    if (INTERSTITIALS[nextIndex] && nextIndex < QUESTIONS.length) {
      setInterstitialMsg(INTERSTITIALS[nextIndex]);
      setView('interstitial');
      await wait(3000);
      setCurrentQIndex(nextIndex);
      setView('quiz');
      setFadeKey(k => k + 1);
    } 
    // 极速切题
    else if (nextIndex < QUESTIONS.length) {
      await wait(50); // 几乎零延迟
      setCurrentQIndex(nextIndex);
      setFadeKey(k => k + 1);
    } 
    // 结算
    else {
      finishQuiz(newScores);
    }
  };

  // 结算
  const finishQuiz = async (finalScores) => {
    setView('calculating');
    let maxScore = -1;
    let maxId = 1;
    Object.entries(finalScores).forEach(([id, score]) => {
      if (score > maxScore) {
        maxScore = score;
        maxId = id;
      }
    });
    setFinalResultId(maxId);
    await wait(3500); // 假装分析3.5秒，展示雷达动画
    setView('result');
  };

  // 滚动引导
  const scrollRef = useRef(null);
  const scrollToInput = () => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div className="app-root">
      <Head>
        <title>深度情感欲望测试</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@300;500;700&family=Inter:wght@200;400;600&display=swap" rel="stylesheet" />
      </Head>

      <div className="stars-bg"></div>

      {/* --- 长滚动首页 --- */}
      {view === 'welcome' && (
        <div className="view-welcome fade-in">
          {/* 第一屏：Hero */}
          <section className="hero-section">
            <div className="hero-content">
              <div className="logo-mark">INNER ECHO</div>
              <h1 className="main-title">内在情感欲望</h1>
              <p className="sub-title">DEEP PSYCHOLOGY TEST</p>
            </div>
            <div className="scroll-indicator" onClick={scrollToInput}>
              <span className="scroll-text">SCROLL TO DISCOVER</span>
              <div className="scroll-line"></div>
            </div>
          </section>

          {/* 第二屏：Concept */}
          <section className="concept-section">
            <div className="concept-block">
              <p className="poetic-line">“我们并不总是知道自己渴望什么，<br/>直到被真正看见的那一刻。”</p>
              <div className="features">
                <div className="feat-item">
                  <span className="f-num">48</span>
                  <span className="f-label">深度探针</span>
                </div>
                <div className="feat-item">
                  <span className="f-num">08</span>
                  <span className="f-label">情感维度</span>
                </div>
                <div className="feat-item">
                  <span className="f-num">15</span>
                  <span className="f-label">分钟旅程</span>
                </div>
              </div>
            </div>
          </section>

          {/* 第三屏：Login */}
          <section className="login-section" ref={scrollRef}>
            <div className="login-card glass-panel">
              <h2 className="login-title">开启潜意识之门</h2>
              <div className="input-wrap">
                <input 
                  type="text" 
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  placeholder="请输入专属兑换码"
                  className="access-input"
                />
                <button 
                  onClick={handleVerify} 
                  disabled={isVerifying}
                  className={`btn-start ${isVerifying ? 'processing' : ''}`}
                >
                  {isVerifying ? '正在连接...' : '进入'}
                </button>
              </div>
              {errorMsg && <p className="err-msg">{errorMsg}</p>}
            </div>
          </section>
        </div>
      )}

      {/* --- 验证加载 --- */}
      {view === 'loading_verify' && (
        <div className="view-fullscreen flex-center">
          <div className="loader-ring"></div>
          <p className="status-text">正在建立神经链接...</p>
        </div>
      )}

      {/* --- 答题页 --- */}
      {view === 'quiz' && (
        <div className="view-quiz fade-in">
          <div className="quiz-header">
            <div className="progress-num">{String(currentQIndex + 1).padStart(2,'0')} <span className="dim">/ 48</span></div>
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{width: `${(currentQIndex+1)/QUESTIONS.length*100}%`}}></div>
            </div>
          </div>

          <div key={fadeKey} className="question-card slide-up">
            <h2 className="q-text">{QUESTIONS[currentQIndex].text}</h2>
            <div className="opts-list">
              {QUESTIONS[currentQIndex].options.map((opt, idx) => (
                <button key={idx} onClick={() => handleAnswer(opt.v)} className="opt-item">
                  <span className="opt-idx">{['A','B','C','D'][idx]}</span>
                  <span className="opt-txt">{opt.t}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- 深潜引导 --- */}
      {view === 'interstitial' && (
        <div className="view-fullscreen flex-center fade-in-slow">
          <div className="deep-text">{interstitialMsg}</div>
          <div className="deep-line"></div>
        </div>
      )}

      {/* --- 结算分析 --- */}
      {view === 'calculating' && (
        <div className="view-fullscreen flex-center">
          <div className="radar-scan-anim"></div>
          <p className="status-text">正在构建欲望模型...</p>
          <div className="status-steps">
            <span>分析情感维度...</span>
            <span>匹配核心渴望...</span>
          </div>
        </div>
      )}

      {/* --- 结果页 --- */}
      {view === 'result' && finalResultId && (
        <div className="view-result fade-in-slow">
          <div className="result-container">
            
            {/* 顶部动态图腾 */}
            <div className="totem-header">
              <AbstractTotem id={finalResultId} />
              <div className="totem-meta">
                <p className="meta-code">TYPE-0{finalResultId}</p>
                <h1 className="meta-title" style={{color: RESULTS[finalResultId].accent}}>
                  {RESULTS[finalResultId].title}
                </h1>
                <p className="meta-quote">“{RESULTS[finalResultId].quote}”</p>
              </div>
            </div>

            {/* 专业雷达图 */}
            <div className="radar-section glass-panel">
              <h3 className="section-head">情感维度分布</h3>
              <RadarChart scores={scores} />
            </div>

            {/* 核心关键词 */}
            <div className="keyword-section glass-panel">
              <span className="kw-label">CORE KEYWORD</span>
              <span className="kw-value" style={{color: RESULTS[finalResultId].accent}}>
                {RESULTS[finalResultId].keyword}
              </span>
            </div>

            {/* 深度分析文本 */}
            <div className="analysis-section">
              {RESULTS[finalResultId].sections.map((sec, idx) => (
                <div key={idx} className="text-card glass-panel">
                  <h4 className="tc-title" style={{color: RESULTS[finalResultId].accent}}>
                    {sec.t}
                  </h4>
                  <p className="tc-content">{sec.c}</p>
                </div>
              ))}
            </div>

            <div className="footer-brand">
              INNER ECHO · DEEP PSYCHOLOGY
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          5. 极简 CSS 引擎 (Deep Space Theme)
         ========================================== */}
      <style jsx global>{`
        :root {
          --bg: #0B0E14;
          --text: #F3F4F6;
          --text-dim: #9CA3AF;
          --glass: rgba(255, 255, 255, 0.03);
          --glass-border: rgba(255, 255, 255, 0.08);
          --accent: #fff;
          --font-serif: "Noto Serif SC", serif;
          --font-sans: "Inter", sans-serif;
        }

        body {
          margin: 0;
          background: var(--bg);
          color: var(--text);
          font-family: var(--font-sans);
          overflow-x: hidden;
        }

        /* 动态星空背景 */
        .stars-bg {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background: 
            radial-gradient(circle at 15% 50%, rgba(76, 29, 149, 0.15), transparent 25%),
            radial-gradient(circle at 85% 30%, rgba(14, 165, 233, 0.1), transparent 25%);
          z-index: -1;
        }

        /* 动画类 */
        .fade-in { animation: fadeIn 1s ease-out forwards; }
        .fade-in-slow { animation: fadeIn 2s ease-out forwards; }
        .slide-up { animation: slideUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%,100% { opacity: 0.5; } 50% { opacity: 1; } }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* 通用布局 */
        .view-fullscreen {
          height: 100vh; width: 100vw; display: flex; flex-direction: column;
          align-items: center; justify-content: center;
        }
        .flex-center { display: flex; align-items: center; justify-content: center; }
        .glass-panel {
          background: var(--glass);
          backdrop-filter: blur(12px);
          border: 1px solid var(--glass-border);
          border-radius: 16px;
          padding: 24px;
        }

        /* --- 首页 (长滚动) --- */
        .view-welcome { overflow-y: auto; height: 100vh; scroll-behavior: smooth; }
        
        .hero-section {
          height: 100vh; display: flex; flex-direction: column;
          align-items: center; justify-content: center; position: relative;
        }
        .logo-mark { font-size: 12px; letter-spacing: 6px; opacity: 0.5; margin-bottom: 24px; }
        .main-title {
          font-family: var(--font-serif); font-size: 42px; font-weight: 300;
          letter-spacing: 2px; text-align: center; margin: 0 0 16px;
          background: linear-gradient(to bottom, #fff, #94a3b8);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .sub-title { font-size: 10px; letter-spacing: 4px; color: var(--text-dim); }
        
        .scroll-indicator {
          position: absolute; bottom: 40px; display: flex; flex-direction: column;
          align-items: center; gap: 12px; cursor: pointer; opacity: 0.6;
          animation: pulse 2s infinite;
        }
        .scroll-text { font-size: 9px; letter-spacing: 2px; }
        .scroll-line { width: 1px; height: 40px; background: linear-gradient(to bottom, #fff, transparent); }

        .concept-section {
          min-height: 60vh; display: flex; align-items: center; justify-content: center;
          padding: 60px 24px; text-align: center;
        }
        .poetic-line { font-family: var(--font-serif); font-size: 18px; line-height: 1.8; opacity: 0.8; margin-bottom: 60px; }
        .features { display: flex; gap: 40px; justify-content: center; }
        .feat-item { display: flex; flex-direction: column; gap: 8px; }
        .f-num { font-size: 32px; font-family: var(--font-serif); font-weight: 300; }
        .f-label { font-size: 10px; color: var(--text-dim); letter-spacing: 1px; }

        .login-section {
          min-height: 80vh; display: flex; align-items: center; justify-content: center; padding: 24px;
        }
        .login-card { width: 100%; max-width: 360px; text-align: center; padding: 48px 32px; }
        .login-title { font-family: var(--font-serif); font-weight: 300; margin-bottom: 32px; font-size: 24px; }
        .input-wrap { display: flex; flex-direction: column; gap: 16px; }
        .access-input {
          width: 100%; padding: 16px; background: rgba(0,0,0,0.3); border: 1px solid var(--glass-border);
          color: #fff; text-align: center; font-size: 16px; letter-spacing: 2px; border-radius: 4px;
          outline: none; transition: border 0.3s;
        }
        .access-input:focus { border-color: #fff; }
        .btn-start {
          width: 100%; padding: 16px; background: #fff; color: #000; border: none;
          font-size: 14px; letter-spacing: 4px; cursor: pointer; border-radius: 4px;
          transition: all 0.2s;
        }
        .btn-start:active { transform: scale(0.98); }
        .btn-start.processing { opacity: 0.7; cursor: not-allowed; }
        .err-msg { color: #ef4444; font-size: 12px; margin-top: 12px; }

        /* --- 答题页 --- */
        .view-quiz { max-width: 600px; margin: 0 auto; min-height: 100vh; padding: 40px 24px; display: flex; flex-direction: column; }
        .quiz-header { display: flex; align-items: center; gap: 20px; margin-bottom: 60px; }
        .progress-num { font-family: monospace; font-size: 14px; }
        .dim { opacity: 0.3; }
        .progress-bar-track { flex: 1; height: 1px; background: rgba(255,255,255,0.1); }
        .progress-bar-fill { height: 100%; background: #fff; transition: width 0.5s; }
        
        .q-text { font-family: var(--font-serif); font-size: 24px; line-height: 1.5; margin: 0 0 48px; font-weight: 300; }
        .opts-list { display: flex; flex-direction: column; gap: 12px; }
        .opt-item {
          text-align: left; padding: 20px; background: var(--glass);
          border: 1px solid var(--glass-border); color: var(--text);
          cursor: pointer; transition: all 0.1s; display: flex; gap: 16px;
          border-radius: 8px;
        }
        .opt-item:active { background: rgba(255,255,255,0.15); transform: scale(0.98); }
        .opt-idx { font-size: 10px; opacity: 0.5; margin-top: 4px; }
        .opt-txt { font-size: 15px; line-height: 1.5; opacity: 0.9; }

        /* --- 过渡页 --- */
        .deep-text { font-family: var(--font-serif); font-size: 20px; line-height: 2; text-align: center; margin-bottom: 40px; }
        .deep-line { width: 1px; height: 60px; background: linear-gradient(to bottom, transparent, #fff, transparent); animation: pulse 1.5s infinite; }
        
        .loader-ring, .radar-scan-anim {
          width: 48px; height: 48px; border: 1px solid rgba(255,255,255,0.2);
          border-top-color: #fff; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 24px;
        }
        .status-text { letter-spacing: 2px; font-size: 12px; opacity: 0.7; }
        .status-steps { margin-top: 16px; display: flex; flex-direction: column; gap: 8px; font-size: 10px; opacity: 0.4; text-align: center; }

        /* --- 结果页 --- */
        .view-result { padding: 40px 20px 80px; min-height: 100vh; }
        .result-container { max-width: 600px; margin: 0 auto; }
        
        .totem-header { text-align: center; margin-bottom: 60px; padding-top: 40px; }
        .totem { width: 120px; height: 120px; margin: 0 auto 32px; position: relative; border-radius: 50%; border: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; }
        .t-circle-main { width: 60px; height: 60px; background: #fff; border-radius: 50%; filter: blur(20px); opacity: 0.2; animation: pulse 3s infinite; }
        
        .meta-code { font-size: 10px; letter-spacing: 4px; opacity: 0.5; margin-bottom: 12px; }
        .meta-title { font-family: var(--font-serif); font-size: 36px; margin: 0 0 16px; font-weight: 300; }
        .meta-quote { font-style: italic; font-size: 14px; opacity: 0.7; }

        .radar-section { margin-bottom: 24px; display: flex; flex-direction: column; align-items: center; }
        .section-head { font-size: 10px; letter-spacing: 2px; opacity: 0.5; margin-bottom: 24px; text-transform: uppercase; }
        
        .keyword-section { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
        .kw-label { font-size: 10px; letter-spacing: 2px; opacity: 0.5; }
        .kw-value { font-size: 24px; font-family: var(--font-serif); }

        .text-card { margin-bottom: 16px; }
        .tc-title { font-size: 14px; margin: 0 0 12px; letter-spacing: 1px; }
        .tc-content { font-size: 14px; line-height: 1.8; opacity: 0.8; text-align: justify; margin: 0; }

        .footer-brand { text-align: center; margin-top: 60px; font-size: 10px; letter-spacing: 4px; opacity: 0.3; }
      `}</style>
    </div>
  );
}
