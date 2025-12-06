"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Lock, Share2, RefreshCw, Zap, Heart, Shield, Anchor, Wind, Grid, Eye, Sun, Moon, Download, ChevronRight, BookOpen, Key, Feather, Search, X, Copy, Image as ImageIcon } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

// =========================================================================
// ⚠️【复制说明】请在你的本地项目中，取消下面 3 行代码的注释，并删除下方的 [预览模拟] 代码块
// =========================================================================

// import Head from 'next/head';
// import { createClient } from '@supabase/supabase-js';
// import html2canvas from 'html2canvas';

// =========================================================================
// 🚧 [预览模拟] 开始 (上线时请删除从这里到 "预览模拟结束" 的所有代码)
// =========================================================================
const html2canvas = async (element, options) => {
  console.log("Mock: html2canvas 生成海报...");
  return { toDataURL: () => "data:image/png;base64,mock" }; // 模拟返回图片
};

// 模拟 Supabase (你在本地跑时，删掉这个 mockSupabase，用真实的 createClient)
const mockSupabase = {
  from: (table) => ({
    select: (columns) => ({
      eq: (column, value) => ({
        single: async () => {
            // 模拟验证兑换码成功
            if (table === 'codes') return { data: { used_count: 0, max_uses: 1, code: value }, error: null };
            return { data: null, error: null };
        }
      }),
      insert: async (data) => ({
          select: () => ({
              single: async () => ({ data: { id: 'mock-uuid-1234' }, error: null })
          })
      })
    }),
    update: (data) => ({
        eq: (column, value) => Promise.resolve({ error: null })
    }),
    insert: (data) => ({
        select: () => ({
            single: async () => {
                console.log("Mock: 数据已存入 Supabase", data);
                return { data: { id: 'mock-result-id-5678' }, error: null };
            }
        })
    })
  })
};
const supabase = mockSupabase; 
// =========================================================================
// 🚧 [预览模拟] 结束
// =========================================================================


// --- 真实 Supabase 初始化 (上线时请取消注释并使用这个) ---
// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
// const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
// const supabase = createClient(supabaseUrl, supabaseKey);


// --- 章节配置 ---
const PARTS_CONFIG = [
  { startIndex: 0, title: "Part 1：现实切片", quote: "“爱不仅仅是誓言，更是下意识的本能。”", desc: "先让我们从生活的琐碎里，捕捉你在亲密关系中那些最真实的条件反射。" },
  { startIndex: 16, title: "Part 2：情绪暗涌", quote: "“日常的表象之下，藏着我们未曾说出口的渴望。”", desc: "现在的你，已经脱去了社交伪装。让我们再往下潜一点，去触碰那些让你感到不安、委屈或满足的瞬间。" },
  { startIndex: 32, title: "Part 3：灵魂图腾", quote: "“语言无法抵达的地方，直觉可以。”", desc: "欢迎来到你内心的最深处。接下来的问题不需要逻辑，仅凭直觉，选出你第一眼看到的那个答案。" }
];

// --- 完整题目数据 (48题) ---
const QUESTIONS = [
  // --- Part 1 ---
  { id: 1, question: "周末下午，伴侣突然失联了3个小时，发消息也没回。那一刻，你最真实的反应是？", options: [{ text: "下意识翻聊天记录，看是不是我说错话了？", type: "确定感" }, { text: "挺好的，刚好没人管我，专心做自己的事。", type: "自由感" }, { text: "推测原因，准备联系上后问清楚去向。", type: "掌控感" }, { text: "心里堵得慌。如果他够在意我，怎么舍得让我空等？", type: "被偏爱" }] },
  { id: 2, question: "伴侣最近工作压力极大，回家情绪低落一言不发。此时你心里的念头是？", options: [{ text: "看着心疼。倒杯水、切水果，让他知道有人照顾。", type: "被需要" }, { text: "他应该很烦。那我就识趣点躲远点，等他缓过来。", type: "安全距离" }, { text: "死气沉沉的沉默很难受。希望能聊聊。", type: "精神共鸣" }, { text: "在意接下来的安排：今晚怎么吃？计划还作数吗？", type: "秩序感" }] },
  { id: 3, question: "因为一件琐事发生了激烈的争吵，甚至有些冷场。你心里那个过不去的点主要是？", options: [{ text: "态度冷冰冰。那种随时要放弃我的感觉最让我害怕。", type: "确定感" }, { text: "没复盘。到底谁对谁错，以后按谁的来？", type: "秩序感" }, { text: "心软了。看他气得脸色发白，输赢不重要，想哄哄他。", type: "被需要" }, { text: "无法沟通。不立刻解决问题翻篇，我就没法安心做事。", type: "掌控感" }] },
  { id: 4, question: "你冷不丁冒出一个有点奇怪的脑洞，随口讲给伴侣听。此时你最期待的反应是？", options: [{ text: "哪怕听不懂，只要愿意放下手机认真听我说完，我就满足。", type: "被偏爱" }, { text: "瞬间接住梗，还能延伸出新观点。那一刻觉得“只有你懂我”。", type: "精神共鸣" }, { text: "我说我的，你听你的，不必强行同步。", type: "自由感" }, { text: "只敢说一半。怕说出来对方接不住，反而尴尬。", type: "安全距离" }] },
  { id: 5, question: "伴侣想看你的手机，或者询问你过去的详细情感经历。你的本能反应是？", options: [{ text: "哪怕没秘密也反感。这是隐私，被审视的感觉很不舒服。", type: "自由感" }, { text: "随便看。如果你看了能更安心，那我求之不得。", type: "确定感" }, { text: "看可以，但要公平。如果我也能看你的，那就没问题。", type: "秩序感" }, { text: "看可以，但不想被误解。不希望你片面定义现在的我。", type: "精神共鸣" }] },
  { id: 6, question: "伴侣偶尔有些迷糊，犯了个不大不小的错。你下意识的第一反应通常是？", options: [{ text: "下意识去兜底。直接上手帮他善后。", type: "被需要" }, { text: "觉得被忽视了。你是不是没把我的事放心上？", type: "被偏爱" }, { text: "复盘原因。想知道哪个环节出了问题，确保下次不再发生。", type: "掌控感" }, { text: "无所谓。谁还没个犯错的时候，大家都轻松点最好。", type: "安全距离" }] },
  { id: 7, question: "谈到“未来”这个话题时，什么情况最让你感到不安？", options: [{ text: "没有计划，说“顺其自然”。这种没规划的日子让我没底。", type: "秩序感" }, { text: "态度不坚定。表现出一丝犹豫，我就怀疑他没打算长久。", type: "确定感" }, { text: "想到未来几十年都要和一个人绑死，我就本能地想逃。", type: "自由感" }, { text: "怕未来各过各的。变成两个合租的陌生人。", type: "被需要" }] },
  { id: 8, question: "当你自己情绪崩溃、非常脆弱的时候，你最希望对方做什么？", options: [{ text: "别问“怎么了”。当没看见，让我躲一会儿。", type: "安全距离" }, { text: "只要抱着我，让我感觉“这一刻你也一样难过”。", type: "精神共鸣" }, { text: "帮我分析烂摊子怎么收场，解决那个搞崩我的问题。", type: "掌控感" }, { text: "就算我无理取闹，也请站在我这边。我只需要偏袒。", type: "被偏爱" }] },
  { id: 9, question: "到了纪念日，如果伴侣准备的礼物让你觉得有点失望，那个失望的点通常是？", options: [{ text: "不够用心。看不出我是那个被特殊对待的人。", type: "被偏爱" }, { text: "没意义。跟我不搭界，说明他根本不懂我的喜好。", type: "精神共鸣" }, { text: "不实用。破坏了开销计划，不如买点实用的。", type: "秩序感" }, { text: "不平衡。我总是记着你的喜好，你对我却一无所知。", type: "被需要" }] },
  { id: 10, question: "带伴侣去参加你的朋友聚会。整个过程中，你最舒服的状态是？", options: [{ text: "连体婴。哪怕跟别人聊天，我也希望眼神能对上。", type: "确定感" }, { text: "得体模式。在意他能不能融入，别冷场也别出格。", type: "掌控感" }, { text: "放养模式。各玩各的，不用我时刻照顾他的情绪。", type: "自由感" }, { text: "低调模式。正常社交就好，别让我们成为全场焦点。", type: "安全距离" }] },
  { id: 11, question: "两个人一起出去旅行，最容易让你心里炸毛的瞬间是？", options: [{ text: "人为失误搞砸计划。赶不上车/景点关门，让我瞬间暴躁。", type: "掌控感" }, { text: "行程变来变去。我需要知道今天到底要干嘛。", type: "秩序感" }, { text: "被行程表催着走。非要打卡、几点起床，这像军训。", type: "自由感" }, { text: "同路不同频。我想感叹风景，他只关心吃什么。", type: "精神共鸣" }] },
  { id: 12, question: "同居或长相处时，伴侣有一些让你看不惯的生活习惯。你通常会怎么想？", options: [{ text: "没有规矩。如果大家都随心所欲，这个家就乱套了。", type: "秩序感" }, { text: "他不重视我。说过好几次了还这样，根本没把我放心上。", type: "确定感" }, { text: "别管我就行。我不强迫他，他也别反过来管我。", type: "自由感" }, { text: "还是我来吧。骂归骂，最后还是默默帮他收拾了。", type: "被需要" }] },
  { id: 13, question: "伴侣无意中提起了一个优秀的异性朋友，言语间带着欣赏。你心里的第一反应是？", options: [{ text: "酸溜溜的。你为什么要当着我的面夸别人？", type: "被偏爱" }, { text: "警铃大作。那个人是不是比我更适合他？", type: "确定感" }, { text: "想搞清楚界限。确认关系是否在可控范围内。", type: "掌控感" }, { text: "无所谓装傻。不想深究，也不想表现得像个嫉妒狂。", type: "安全距离" }] },
  { id: 14, question: "在一起久了，关系进入平淡模式，每天除了吃饭睡觉没别的话题。你会觉得？", options: [{ text: "慢性死亡。没有思想交流，只剩空壳。", type: "精神共鸣" }, { text: "有点失落。好像我这个人在不在家对他没差别了。", type: "被需要" }, { text: "求之不得。不用费劲维系激情，各干各的最舒服。", type: "自由感" }, { text: "这很正常。稳定的、可预测的生活节奏让我踏实。", type: "秩序感" }] },
  { id: 15, question: "你有一个非常痴迷的小爱好，但伴侣完全不感兴趣。你希望他的态度是？", options: [{ text: "别干涉我。这是我的自留地，请离远点。", type: "安全距离" }, { text: "尊重我的投入。别总质疑我不务正业。", type: "掌控感" }, { text: "试着懂我一点。明白为什么这个东西能打动我。", type: "精神共鸣" }, { text: "陪我一起玩。哪怕不喜欢，也希望能为了我参与一下。", type: "被偏爱" }] },
  { id: 16, question: "大吵一架终于和好了。为了让这页彻底翻过去，你最需要的一个“收尾动作”是？", options: [{ text: "反复确认。“你真的不生气了吗？我们真的没事了吗？”", type: "确定感" }, { text: "某种补偿行为。比如给他做顿好吃的。", type: "被需要" }, { text: "彻底不提。赶紧回归正常，把这尴尬的一页揭过去。", type: "安全距离" }, { text: "得到一个小惊喜。买个礼物或者带我吃顿好的。", type: "被偏爱" }] },
  
  // --- Part 2 ---
  { id: 17, question: "在一段关系里，最让你感到心慌、不踏实的那种时刻，其实是？", options: [{ text: "不知道下一秒会发生什么。内心悬空的感觉最折磨人。", type: "确定感" }, { text: "感觉透不过气。那种被严密包裹的窒息感，让我只想逃。", type: "自由感" }, { text: "事情脱离了轨迹。局面完全乱套，无法把握方向。", type: "掌控感" }, { text: "像在演独角戏。面对面心却连不上的孤独感。", type: "精神共鸣" }] },
  { id: 18, question: "当你在感情里觉得特别委屈时，脑海里那个挥之不去的念头是？", options: [{ text: "“好像我没什么价值。” 觉得自己很多余。", type: "被需要" }, { text: "“我就知道会受伤。” 本能地想立刻缩回去。", type: "安全距离" }, { text: "“这不公平。” 为什么总是我在妥协？", type: "秩序感" }, { text: "“原来我和别人没区别。” 我并没有被放在例外的位置上。", type: "被偏爱" }] },
  { id: 19, question: "你理想中最好的爱，给你的直接感觉应该是？", options: [{ text: "轻松。没有压力，没有强制要求。", type: "自由感" }, { text: "踏实。不管发生什么，都知道你不会走。", type: "确定感" }, { text: "默契。不用费劲解释，你也懂。", type: "精神共鸣" }, { text: "清晰。一切都在计划中稳步推进。", type: "掌控感" }] },
  { id: 20, question: "当伴侣非常用力地黏着你、时刻都要和你在一起时，你的真实感受是？", options: [{ text: "很踏实。说明你真的很依赖我，我是不可替代的。", type: "被需要" }, { text: "很想躲。高密度的亲密让我觉得是种打扰。", type: "安全距离" }, { text: "有点烦。如果连正常生活节奏都被打乱了，我会觉得你不懂事。", type: "秩序感" }, { text: "很受用。这种非我不可的劲儿，最能证明你爱我。", type: "被偏爱" }] },
  { id: 21, question: "两个人坐在一起不说话时，你心里的真实活动是？", options: [{ text: "很难受。这种精神上的断连，让我觉得像陌生人。", type: "精神共鸣" }, { text: "很慌张。猜他为什么不说话？是不是生气了？", type: "确定感" }, { text: "很舒服。互不干扰，这种松弛感才是最高级的。", type: "自由感" }, { text: "很想找点事做。不喜欢这种不知道该干嘛的冷场。", type: "掌控感" }] },
  { id: 22, question: "如果你在这段关系里付出了很多，你最害怕的结果是？", options: [{ text: "怕你是真的不需要。怕我给的东西对你是个负担。", type: "被需要" }, { text: "怕这只是我的一厢情愿。只有我一人在投入。", type: "秩序感" }, { text: "怕你把这当成理所应当。连一点特殊的感动都没有。", type: "被偏爱" }, { text: "怕被赖上。怕你索取更多，让我背上沉重义务。", type: "安全距离" }] },
  { id: 23, question: "当听到“永远”这个词的时候，你下意识的反应是？", options: [{ text: "松了一口气。它能压住我心里所有的不安。", type: "确定感" }, { text: "压力好大。还没发生的事就先锁死，很沉重。", type: "自由感" }, { text: "听听就行。没有行动支撑就是空头支票。", type: "掌控感" }, { text: "很多余。真正的契合是不需要用时间来担保的。", type: "精神共鸣" }] },
  { id: 24, question: "在激烈的争吵中，最让你感到绝望、甚至想放弃的一瞬间是？", options: [{ text: "是他推开我的时候。说“不用你管”。", type: "被需要" }, { text: "是他开始胡搅蛮缠的时候。没有任何道理可讲。", type: "秩序感" }, { text: "是他站在我对立面的时候。帮理不帮亲。", type: "被偏爱" }, { text: "是他逼我立刻说话的时候。被逼到死角的窒息感。", type: "安全距离" }] },
  { id: 25, question: "哪怕此时此刻什么都没发生，但只要想到这件事，你就会觉得非常有安全感：", options: [{ text: "我知道你会坚定地站在我这边。不权衡利弊。", type: "确定感" }, { text: "我知道一切都在计划内。没有突发状况打乱生活。", type: "掌控感" }, { text: "我知道我是不可替代的。我能给你别人给不了的支撑。", type: "被需要" }, { text: "我知道我随时可以做自己。不需要伪装。", type: "自由感" }] },
  { id: 26, question: "如果回想一段失败的感情，最让你觉得“意难平”或者“很受伤”的点可能是？", options: [{ text: "“我居然不是特别的。” 我和其他人也没什么两样。", type: "被偏爱" }, { text: "“我们从未真正交流过。” 像住在同屋檐下的陌生人。", type: "精神共鸣" }, { text: "“付出没有回报。” 最后是一笔烂账，觉得很亏。", type: "秩序感" }, { text: "“我不该全盘托出。” 后悔把脆弱展示给你看。", type: "安全距离" }] },
  { id: 27, question: "你会因为什么事情而产生强烈的嫉妒心或占有欲？", options: [{ text: "当他遇到麻烦却不找我时。", type: "被需要" }, { text: "当他对谁都很好的时候。", type: "被偏爱" }, { text: "当他有事瞒着我时。", type: "掌控感" }, { text: "当他和别人聊得更嗨时。", type: "精神共鸣" }] },
  { id: 28, question: "伴侣出差或不在家，留你一个人独处一周。你的真实感受是？", options: [{ text: "像放假一样爽。完全属于自己的时间太珍贵了。", type: "自由感" }, { text: "逐渐开始慌张。没人说话，忍不住确认他还在意我。", type: "确定感" }, { text: "非常自在。互不打扰反而觉得关系更健康。", type: "安全距离" }, { text: "有点无所适从。不需要顾别人，反而觉得不真实。", type: "被需要" }] },
  { id: 29, question: "如果伴侣做了这件事，你会瞬间下头，甚至考虑分手？", options: [{ text: "言而无信。承诺的不兑现，没法过。", type: "秩序感" }, { text: "拒绝沟通。说“想太多”或者直接回避。", type: "精神共鸣" }, { text: "制造混乱。做事毫无章法搞得生活一团糟。", type: "掌控感" }, { text: "权衡利弊。为了别的东西牺牲了我的利益。", type: "被偏爱" }] },
  { id: 30, question: "如果给你自己写一份“恋爱使用说明书”，你最希望标注的核心法则是？", options: [{ text: "“请坚定地选择我。” 别犹豫，别摇摆。", type: "确定感" }, { text: "“请允许我做自己。” 别打着为我好的名义改造我。", type: "自由感" }, { text: "“请看见我的付出。” 别把一切都当成空气。", type: "被需要" }, { text: "“请给我一点时间。” 别一上来就掏心掏肺。", type: "安全距离" }] },
  { id: 31, question: "如果让你用一个词来定义你理想中的“关系形态”，你希望你们是？", options: [{ text: "合伙人。账目分明，分工明确，高效努力。", type: "秩序感" }, { text: "船长与领航员。有明确方向，有问题迅速解决。", type: "掌控感" }, { text: "灵魂伴侣。不用磨合的默契，眼神一对就知道。", type: "精神共鸣" }, { text: "两条平行的河。有交集，又互不吞没。", type: "自由感" }] },
  { id: 32, question: "在你看来，一个人爱你的最高级表现是？", options: [{ text: "例外。他对世界冷漠，唯独对我不一样。", type: "被偏爱" }, { text: "托底。无论我变成什么样，他永远站在我身后。", type: "确定感" }, { text: "依赖。愿意把最脆弱的一面给我看，只让我照顾。", type: "被需要" }, { text: "尊重。懂得站在安全线以外守护我。", type: "安全距离" }] },

  // --- Part 3 ---
  { id: 33, question: "如果要把你向往的亲密关系画成一幅画，它最像什么？", options: [{ text: "深深扎进土里的树根。地下紧紧纠缠。", type: "确定感" }, { text: "两朵飘在天上的云。聚散都随风。", type: "自由感" }, { text: "一条笔直的高速公路。全速驶向同一个终点。", type: "掌控感" }, { text: "两面互相照映的镜子。看着你就能看见自己。", type: "精神共鸣" }] },
  { id: 34, question: "如果要把自己比喻成一种动物，在爱人面前，你更像？", options: [{ text: "温顺的大金毛。你感受到陪伴我就满足。", type: "被需要" }, { text: "被驯服的小狐狸。我只认你这一个“驯养员”。", type: "被偏爱" }, { text: "屯松果的松鼠。未雨绸缪，规划好过冬。", type: "秩序感" }, { text: "林间的小鹿。生性敏感，试探着靠近。", type: "安全距离" }] },
  { id: 35, question: "闭上眼，你觉得最让你感到安稳的那个空间是？", options: [{ text: "暴雨夜的屋子。你在身边，门窗紧闭。", type: "确定感" }, { text: "巨大的落地窗。视野通透，没有围栏。", type: "自由感" }, { text: "深夜书房。安静私密，只有书和思想。", type: "精神共鸣" }, { text: "私有王国。关上门，这里就是我们的国度。", type: "掌控感" }] },
  { id: 36, question: "如果关系出现危机，你觉得那场景最像什么？", options: [{ text: "荒原。我的爱变成了没有回声的荒草。", type: "被需要" }, { text: "沼泽。越挣扎陷得越深，无法抽身。", type: "安全距离" }, { text: "废墟。规则崩塌，满地狼藉。", type: "秩序感" }, { text: "大卖场。被放在货架上打折出售。", type: "被偏爱" }] },
  { id: 37, question: "如果“誓言”是一个具体的物品，你希望它是什么？", options: [{ text: "磐石。够重够硬，镇住所有变数。", type: "确定感" }, { text: "风铃。风来时响，风走时静，不束缚。", type: "自由感" }, { text: "契约。白纸黑字，不可违背的守则。", type: "掌控感" }, { text: "潮汐。是引力，不言自明的必然性。", type: "精神共鸣" }] },
  { id: 38, question: "你最喜欢的亲密关系，它的“温度”应该是？", options: [{ text: "滚烫的 100°C。沸腾的热情，全心全意。", type: "被需要" }, { text: "微凉的 20°C。清爽不黏人，长久。", type: "安全距离" }, { text: "恒温的 26°C。不要忽冷忽热，要稳定。", type: "秩序感" }, { text: "只暖一人的 37°C。隐秘私有，只我有资格触碰。", type: "被偏爱" }] },
  { id: 39, question: "如果爱是一件必须随身携带的物品，你觉得它最像？", options: [{ text: "贴身的护身符。遇到不安时它就在。", type: "确定感" }, { text: "降噪耳机。戴上它，世界嘈杂消失。", type: "精神共鸣" }, { text: "瑞士军刀。精密有力，解决所有难题。", type: "掌控感" }, { text: "一张空白机票。给我探索世界的底气。", type: "自由感" }] },
  { id: 40, question: "如果有一天真的要分开，你希望那是？", options: [{ text: "燃尽。流干了最后一滴泪才甘心离场。", type: "被需要" }, { text: "退潮。自然而然退去，像没发生过。", type: "安全距离" }, { text: "清算。把账算清，把话说开。", type: "秩序感" }, { text: "绝版。你再也遇不到像我这样对你好的人。", type: "被偏爱" }] },
  { id: 41, question: "你最喜欢的恋爱氛围，像哪种天气？", options: [{ text: "多云有风。空气流动，清清爽爽。", type: "自由感" }, { text: "初雪。世界安静，纯粹浪漫。", type: "被偏爱" }, { text: "晴朗无云。能见度高，一眼看到地平线。", type: "秩序感" }, { text: "深夜雷雨。与世隔绝，只有我们俩。", type: "精神共鸣" }] },
  { id: 42, question: "如果你闭上眼触摸“爱”，手感应该是？", options: [{ text: "晒热的石头。厚实、干燥、有分量。", type: "确定感" }, { text: "湿软的陶泥。柔软、依恋，填满空隙。", type: "被需要" }, { text: "流动的溪水。清凉、无重力，不带来负担。", type: "安全距离" }, { text: "紧绷的缰绳。粗糙有力，握住就能控制。", type: "掌控感" }] },
  { id: 43, question: "你觉得一段好的亲密关系，闻起来应该像？", options: [{ text: "薄荷或海盐。清冽透气，肺部扩张。", type: "自由感" }, { text: "草莓尖尖。第一口咬下去的甜，特供的。", type: "被偏爱" }, { text: "刚晒干的棉被。干净干燥，井井有条。", type: "秩序感" }, { text: "旧书页/焚香。沉静悠长，闻到时间。", type: "精神共鸣" }] },
  { id: 44, question: "你希望爱人是哪种光源？", options: [{ text: "壁炉里的火。需要我添柴，但照亮屋子。", type: "被需要" }, { text: "灯塔。固定的。无论去哪回头都在。", type: "确定感" }, { text: "月光。温柔清冷，不灼伤我。", type: "安全距离" }, { text: "手里的火把。靠我亲手点燃，劈开黑暗。", type: "掌控感" }] },
  { id: 45, question: "如果把与爱人的相处节奏比作一段旋律，你希望它是？", options: [{ text: "时钟的声音。滴答滴答，精准规律。", type: "秩序感" }, { text: "随口的哼唱。没固定曲调，轻轻松松。", type: "自由感" }, { text: "山谷里的回音。微弱声音也能得到回应。", type: "精神共鸣" }, { text: "为你独奏。全世界是背景，只有我们。", type: "被偏爱" }] },
  { id: 46, question: "如果爱必须伴随一种痛，你宁愿是？", options: [{ text: "生长痛。骨骼拉伸，关系是成长的。", type: "被需要" }, { text: "钝痛。好过“不知道明天你还在不在”的撕裂。", type: "确定感" }, { text: "幻痛。宁愿隔着距离怀念，也不愿互相伤害。", type: "安全距离" }, { text: "剥离痛。撕开伪装，暴露软肋。", type: "精神共鸣" }] },
  { id: 47, question: "如果要把你们共度的时间比作一样东西，它应该是？", options: [{ text: "流沙。抓越紧流越快，不如摊开手。", type: "自由感" }, { text: "沙漏。时间可控，流完也能倒过来。", type: "掌控感" }, { text: "琥珀。封存最美瞬间，不被侵蚀。", type: "被偏爱" }, { text: "年轮。一圈一圈，扎扎实实。", type: "秩序感" }] },
  { id: 48, question: "最后，请凭直觉填空：爱是______。", options: [{ text: "定数。唯一不会更改的答案。", type: "确定感" }, { text: "认出。茫茫人海辨认出彼此是同类。", type: "精神共鸣" }, { text: "成全。不捆绑，拥有更广阔天空。", type: "自由感" }, { text: "治愈。看见你的破碎，甘愿做药。", type: "被需要" }] }
];

// --- 结果页Tab配置 ---
const RESULT_TABS = [
  { id: 'base', label: '亲密底色', icon: BookOpen },
  { id: 'lightShadow', label: '光影图谱', icon: Sun },
  { id: 'partner', label: '伴侣指南', icon: Heart },
  { id: 'reshape', label: '自我重塑', icon: Feather },
];

export default function SoulScan_MasterBedroom() {
  const [step, setStep] = useState('landing');
  const [showInput, setShowInput] = useState(false);
  const [code, setCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [scores, setScores] = useState({});
  const [results, setResults] = useState({ primary: null });
  const [currentPart, setCurrentPart] = useState(null);
  
  // 动画状态
  const [flipped, setFlipped] = useState(false);
  const [isExploding, setIsExploding] = useState(false); // 爆炸白光
  const [showFinal, setShowFinal] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [activeTab, setActiveTab] = useState('base');
  const [saving, setSaving] = useState(false);
  const [resultId, setResultId] = useState(null); // 存储存入数据库后的ID

  // 弹窗状态
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareType, setShareType] = useState(null); // 'poster' | 'link'

  // --- 1. 登录交互 ---
  const handleVerify = async () => {
    setErrorMsg('');
    const inputCode = code.trim();

    if (!inputCode) {
      setErrorMsg('请输入兑换码，不能为空');
      return;
    }

    setIsLoading(true);

    try {
      // 检查兑换码
      const { data, error } = await supabase
        .from('codes')
        .select('*')
        .eq('code', inputCode)
        .single();

      if (error || !data) {
        throw new Error('未找到该兑换码');
      }

      if (data.used_count >= data.max_uses) {
        throw new Error('该兑换码已被使用，请购买新码');
      }

      // 更新使用次数
      const { error: updateError } = await supabase
        .from('codes')
        .update({ used_count: data.used_count + 1 })
        .eq('code', inputCode);

      if (updateError) {
        throw new Error('系统繁忙，请重试');
      }
      
      setIsLoading(false);
      handlePartTransition(0);

    } catch (err) {
      console.error(err);
      setIsLoading(false);
      setErrorMsg(err.message || '兑换码无效或已被使用');
    }
  };

  const handlePartTransition = (index) => {
    const part = PARTS_CONFIG.find(p => p.startIndex === index);
    if (part) {
      setCurrentPart(part);
      setStep('partIntro');
    } else {
      setStep('quiz');
    }
  };

  const handleAnswer = (type) => {
    const newScores = { ...scores, [type]: (scores[type] || 0) + 1 };
    setScores(newScores);

    const nextIndex = currentQIndex + 1;
    if (nextIndex < QUESTIONS.length) {
      setCurrentQIndex(nextIndex);
      handlePartTransition(nextIndex);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      finishQuiz(newScores);
    }
  };

  const finishQuiz = async (finalScores) => {
    setStep('analyzing');
    
    // 1. 算出最高分
    const sortedScores = Object.entries(finalScores).sort((a, b) => b[1] - a[1]);
    const primaryKey = sortedScores[0][0];

    // 2. 准备雷达图数据
    const radarData = ALL_DIMENSIONS.map(type => ({
      subject: type,
      A: finalScores[type] || 0,
      fullMark: 8
    }));

    // 3. 尝试同步到 Supabase (静默失败，不阻断流程)
    try {
      const { data, error } = await supabase
        .from('test_results')
        .insert([
          { 
            primary_type: primaryKey, 
            scores: finalScores 
          }
        ])
        .select()
        .single();

      if (data) {
        console.log("Result saved:", data.id);
        setResultId(data.id);
      }
    } catch (err) {
      console.error("Save failed:", err);
    }

    setTimeout(() => {
      setResults({ primary: primaryKey });
      setChartData(radarData);
      setStep('result_card');
    }, 2500);
  };

  // 翻转卡牌动画逻辑：点击 -> 翻转 -> 摇晃 -> 爆炸 -> 切换页面
  const handleCardClick = () => {
    if (flipped) return;
    setFlipped(true); // 1. 开始翻转 (1s)
    
    setTimeout(() => {
        // 2. 翻转结束后，开始摇晃蓄力
        // 摇晃动画已经在 className 中通过 flipped 控制
        
        setTimeout(() => {
            setIsExploding(true); // 3. 触发白光爆炸
            
            setTimeout(() => {
                setShowFinal(true); // 4. 切换到结果页
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 600); 
        }, 1200); // 摇晃持续时间
    }, 800); // 翻转大部分完成后
  };

  // 生成海报
  const handleSavePoster = async () => {
    const element = document.getElementById('poster-area');
    if (!element) return;
    
    setSaving(true);
    try {
      const canvas = await html2canvas(element, {
        useCORS: true,
        scale: 2, 
        backgroundColor: '#ffffff',
      });
      
      const link = document.createElement('a');
      link.download = `我的情感欲望-${results.primary}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      setShareType('poster');
      setShowShareModal(true);
    } catch (err) {
      console.error('Poster generation failed', err);
      alert('保存失败，请尝试截屏分享');
    }
    setSaving(false);
  };

  // 复制链接
  const handleCopyLink = () => {
    if (!resultId) {
        alert("正在生成专属链接，请稍等...");
        return;
    }
    const shareUrl = `${window.location.origin}/share/${resultId}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
        setShareType('link');
        setShowShareModal(true);
    });
  };

  const progress = ((currentQIndex + 1) / QUESTIONS.length) * 100;
  const displayData = results.primary ? RESULTS[results.primary] : null;

  return (
    <div className="min-h-screen bg-[#FDFBF9] text-[#4A4A4A] font-sans selection:bg-rose-100 flex flex-col overflow-x-hidden">
      
      {/* 顶部栏 */}
      {step !== 'landing' && step !== 'partIntro' && !showFinal && (
        <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-stone-100 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-rose-400" />
            <span className="font-serif font-bold tracking-widest text-stone-800 text-xs">SOUL SCAN</span>
          </div>
          {step === 'quiz' && (
            <span className="text-[10px] font-mono text-stone-400 bg-stone-100 px-2 py-1 rounded">
              {currentQIndex + 1} / {QUESTIONS.length}
            </span>
          )}
        </nav>
      )}

      {/* --- Landing Page --- */}
      {step === 'landing' && (
        <div className="flex-1 flex flex-col relative overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-rose-200/40 to-orange-100/40 blur-[80px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-tl from-blue-200/40 to-purple-100/40 blur-[80px]" />

          <div className="flex-1 flex flex-col justify-center items-center px-8 z-10 animate-fade-in">
            <div className="mb-8 p-4 bg-white/50 backdrop-blur-sm rounded-2xl shadow-sm border border-white/60">
               <Lock className="w-8 h-8 text-stone-700 opacity-80" />
            </div>
            
            <div className="text-center space-y-4 mb-12">
              <h1 className="text-4xl font-serif font-bold text-stone-800 tracking-wide">
                情感欲望图鉴
              </h1>
              <p className="text-sm font-light text-stone-500 tracking-[0.2em] uppercase">
                Unlock Your Hidden Desires
              </p>
              <p className="text-sm text-stone-600 leading-relaxed max-w-xs mx-auto pt-4">
                48道潜意识扫描，揭示你的双重欲望。<br/>
                探索那些未被说出口的渴望。
              </p>
            </div>

            <div className="w-full max-w-xs space-y-4 min-h-[140px]">
              {!showInput ? (
                <button 
                  onClick={() => setShowInput(true)}
                  className="w-full bg-stone-900 text-white py-4 rounded-xl font-bold text-sm shadow-xl hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Key className="w-4 h-4" />
                  我已有兑换码
                </button>
              ) : (
                <div className="space-y-3 animate-slide-up">
                  <input 
                    type="text" 
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="请输入你在小红书获得的兑换码"
                    className="w-full p-4 bg-white/80 border border-stone-200 rounded-xl outline-none text-center focus:ring-2 focus:ring-rose-200 transition-all placeholder:text-xs"
                  />
                  <button 
                    onClick={handleVerify}
                    disabled={isLoading}
                    className="w-full bg-stone-900 text-white py-4 rounded-xl font-bold text-sm shadow-lg hover:bg-stone-800 transition-colors flex items-center justify-center gap-2"
                  >
                    {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : '开始解锁'}
                  </button>
                  {errorMsg && (
                    <p className="text-xs text-red-500 text-center bg-red-50 py-2 rounded-lg">
                      {errorMsg}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="mt-16 text-center">
              <p className="text-xs text-stone-400 mb-2">如何获得兑换码？</p>
              <div className="inline-flex items-center gap-1 text-xs text-rose-500 bg-rose-50 px-3 py-1.5 rounded-full cursor-pointer hover:bg-rose-100 transition-colors">
                <Search className="w-3 h-3" />
                <span>前往小红书搜索【柚子的心理小屋】</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- Part Intro --- */}
      {step === 'partIntro' && currentPart && (
        <div className="flex-1 bg-stone-900 flex flex-col justify-center items-center text-center p-8 animate-fade-in relative overflow-hidden">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10" />
           <div className="relative z-10 max-w-sm">
             <span className="text-rose-300/80 text-[10px] tracking-[0.4em] uppercase mb-6 block">Chapter</span>
             <h2 className="text-2xl font-serif font-bold mb-6 text-rose-50 tracking-wide">{currentPart.title}</h2>
             <div className="w-8 h-1 bg-rose-500/50 mx-auto mb-8 rounded-full"></div>
             <p className="text-lg font-serif italic text-white/90 mb-8 leading-relaxed px-4">
               {currentPart.quote}
             </p>
             <p className="text-xs text-stone-400 leading-6 mb-12 px-6">
               {currentPart.desc}
             </p>
             <button 
               onClick={() => setStep('quiz')}
               className="group flex items-center gap-2 mx-auto text-rose-200 border border-rose-200/20 px-8 py-3 rounded-full hover:bg-rose-200/10 transition-all text-xs tracking-widest"
             >
               CONTINUE
               <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
             </button>
           </div>
        </div>
      )}

      {/* --- Quiz --- */}
      {step === 'quiz' && (
        <div className="flex-1 flex flex-col pt-24 px-6 animate-slide-up max-w-md mx-auto w-full">
          <div className="w-full h-1 bg-stone-100 rounded-full mb-10 overflow-hidden">
            <div 
              className="h-full bg-rose-400 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex-1 flex flex-col justify-center pb-20">
             <div className="mb-2">
               <span className="text-[10px] font-bold tracking-widest uppercase text-rose-400 bg-rose-50 px-2 py-1 rounded inline-block mb-4">
                 {currentQIndex < 16 ? 'Reality' : currentQIndex < 32 ? 'Emotion' : 'Soul'}
               </span>
               <h2 className="text-lg font-serif font-medium leading-relaxed text-stone-800">
                 {QUESTIONS[currentQIndex].question}
               </h2>
             </div>
             
             <div className="space-y-3 mt-8">
               {QUESTIONS[currentQIndex].options.map((opt, idx) => (
                 <button
                   key={idx}
                   onClick={() => handleAnswer(opt.type)}
                   className="w-full text-left p-5 bg-white border border-stone-100 rounded-2xl shadow-sm hover:border-rose-300 hover:shadow-md hover:bg-rose-50/30 transition-all duration-200 active:scale-[0.98] group relative overflow-hidden"
                 >
                   <div className="relative z-10 flex items-start gap-3">
                     <div className="w-4 h-4 rounded-full border border-stone-300 mt-0.5 group-hover:border-rose-400 group-hover:bg-rose-400 flex-shrink-0 transition-colors" />
                     <span className="text-sm text-stone-600 group-hover:text-stone-900 leading-relaxed">
                       {opt.text}
                     </span>
                   </div>
                 </button>
               ))}
             </div>
          </div>
        </div>
      )}

      {/* --- Analysis --- */}
      {step === 'analyzing' && (
        <div className="flex-1 flex flex-col justify-center items-center text-center bg-stone-900 text-white">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 border-2 border-stone-800 rounded-full" />
            <div className="absolute inset-0 border-2 border-rose-400 rounded-full border-t-transparent animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-rose-300 animate-pulse" />
            </div>
          </div>
          <h3 className="mt-8 text-base font-serif font-bold text-rose-50 tracking-wide">生成欲望图谱...</h3>
          <p className="text-[10px] text-stone-500 mt-2 font-mono tracking-widest uppercase">Calculating</p>
        </div>
      )}

      {/* --- Result Step 1: Card Flip + Explosion --- */}
      {step === 'result_card' && !showFinal && (
        <div className="flex-1 flex flex-col items-center justify-center animate-fade-in p-6 bg-stone-900 relative overflow-hidden h-screen">
          
          {/* 白光爆炸遮罩 */}
          <div className={`absolute inset-0 z-50 bg-white pointer-events-none transition-opacity duration-500 ${isExploding ? 'opacity-100' : 'opacity-0'}`}></div>

          <p className={`text-center text-[10px] text-stone-400 mb-8 tracking-[0.2em] uppercase transition-opacity duration-300 ${flipped ? 'opacity-0' : 'opacity-100'}`}>
             Tap to Reveal
          </p>
          
          <div 
            className="relative w-full max-w-sm aspect-[4/5] perspective-1000 cursor-pointer"
            onClick={handleCardClick}
          >
            {/* 卡牌容器 */}
            <div className={`relative w-full h-full duration-1000 transform-style-3d transition-transform ${flipped ? 'rotate-y-180' : ''} ${flipped && !isExploding ? 'animate-violent-shake' : ''}`}>
              
              {/* Back (封面) */}
              <div className="absolute inset-0 backface-hidden bg-stone-800 rounded-[2rem] shadow-2xl border border-white/10 flex flex-col items-center justify-center">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />
                <Sparkles className="w-16 h-16 text-rose-200/50 mb-6 animate-pulse" />
                <h3 className="text-rose-100/90 text-lg font-serif tracking-widest">点击揭晓</h3>
              </div>

              {/* Front (翻转后暂留，即将爆炸) */}
              <div className={`absolute inset-0 backface-hidden rotate-y-180 rounded-[2rem] overflow-hidden flex flex-col justify-between text-white p-8 
                bg-gradient-to-br ${RESULTS[results.primary].cardStyle} backdrop-blur-xl border border-white/30`}>
                <div className="absolute inset-0 bg-white/10 mix-blend-overlay" />
                
                <div className="relative z-10 text-center mt-20">
                    <div className="w-20 h-20 mx-auto mb-6 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 shadow-inner">
                      {RESULTS[results.primary].icon}
                    </div>
                    <h2 className="text-4xl font-serif font-bold mb-2 drop-shadow-md">{results.primary}</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- Result Step 2: Final Share Page (Poster) --- */}
      {showFinal && displayData && (
        <div className="flex-1 flex flex-col animate-fade-in bg-white pb-32">
          
          {/* 这个区域会被截图 */}
          <div id="poster-area" className="bg-white">
              {/* Header Area with Radar */}
              <div className={`pt-12 pb-10 px-6 rounded-b-[3rem] shadow-xl bg-gradient-to-b ${displayData.cardStyle} text-white relative overflow-hidden`}>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10" />
                <div className="absolute top-[-20%] right-[-20%] w-[80%] h-[80%] rounded-full bg-white/10 blur-[60px]" />
                
                <div className="relative z-10 flex flex-col items-center">
                  <p className="text-[10px] font-medium opacity-80 tracking-[0.3em] mb-3 uppercase border border-white/20 px-3 py-1 rounded-full bg-white/5 backdrop-blur-md">
                    你的情感欲望是
                  </p>
                  <h1 className="text-5xl font-serif font-bold mb-2 drop-shadow-lg tracking-wider text-center">
                    {results.primary}
                  </h1>
                  <p className="text-sm opacity-80 font-serif italic mb-8 tracking-widest">{displayData.archetype}</p>

                  {/* Radar Chart */}
                  <div className="w-full max-w-xs h-[300px] bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 p-4 shadow-inner relative">
                      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-3xl pointer-events-none"></div>
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                          <defs>
                            <linearGradient id="radarFill" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={displayData.radarColor || "#fff"} stopOpacity={0.8}/>
                              <stop offset="95%" stopColor={displayData.radarColor || "#fff"} stopOpacity={0.1}/>
                            </linearGradient>
                          </defs>
                          <PolarGrid stroke="rgba(255,255,255,0.15)" />
                          <PolarAngleAxis dataKey="subject" tick={{ fill: 'white', fontSize: 10, fontWeight: 500 }} />
                          <PolarRadiusAxis angle={30} domain={[0, 8]} tick={false} axisLine={false} />
                          <Radar
                            name="My Desire"
                            dataKey="A"
                            stroke={displayData.radarColor || "#fff"}
                            strokeWidth={2}
                            fill="url(#radarFill)"
                            fillOpacity={1}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                  </div>

                  {/* Verdict Quote */}
                  <div className="mt-8 px-4 w-full">
                    <div className="relative py-4 border-t border-white/20 border-b">
                      <p className="text-sm font-serif italic text-center leading-7 opacity-95 px-4">
                        {displayData.quote}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bookmark Tabs & Content */}
              <div className="px-6 py-6 -mt-4 relative z-20">
                {/* Tabs */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6 pb-2">
                    {RESULT_TABS.map(tab => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-300
                                ${isActive 
                                    ? `bg-stone-900 text-white shadow-lg scale-105` 
                                    : 'bg-white text-stone-500 border border-stone-100'}`}
                            >
                                <Icon className="w-3 h-3" />
                                {tab.label}
                            </button>
                        )
                    })}
                </div>

                {/* Content Area */}
                <div className="min-h-[300px]">
                    {/* 1. 亲密底色 */}
                    {activeTab === 'base' && (
                        <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm animate-fade-in">
                            <h4 className="font-serif font-bold text-lg mb-4 text-stone-800 flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-rose-500" />
                                你的亲密底色
                            </h4>
                            <p className="text-sm text-stone-600 leading-7 text-justify whitespace-pre-line">
                                {displayData.base}
                            </p>
                        </div>
                    )}

                    {/* 2. 光影图谱 */}
                    {activeTab === 'lightShadow' && (
                        <div className="space-y-4 animate-fade-in">
                            <div className="bg-amber-50/50 p-5 rounded-2xl border border-amber-100">
                                <h4 className="text-sm font-bold mb-4 flex items-center gap-2 text-amber-700">
                                    <Sun className="w-4 h-4" /> 你的光（天赋优势）
                                </h4>
                                <div className="space-y-3">
                                    {displayData.lightShadow.filter(i => i.type === 'light').map((item, idx) => (
                                        <div key={idx} className="bg-white p-3 rounded-xl border border-amber-100/50 shadow-sm">
                                            <span className="text-xs font-bold block mb-1 text-amber-800">{item.label}</span>
                                            <span className="text-xs text-stone-500 leading-relaxed block">{item.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                                <h4 className="text-sm font-bold mb-4 flex items-center gap-2 text-slate-700">
                                    <Moon className="w-4 h-4" /> 你的影（隐性挑战）
                                </h4>
                                <div className="space-y-3">
                                    {displayData.lightShadow.filter(i => i.type === 'shadow').map((item, idx) => (
                                        <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                                            <span className="text-xs font-bold block mb-1 text-slate-700">{item.label}</span>
                                            <span className="text-xs text-stone-500 leading-relaxed block">{item.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 3. 伴侣指南 */}
                    {activeTab === 'partner' && (
                        <div className="bg-rose-50/30 p-6 rounded-2xl border border-rose-100 animate-fade-in">
                            <h4 className="font-serif font-bold text-lg mb-6 text-stone-800 flex items-center gap-2">
                                <Heart className="w-5 h-5 text-rose-500" />
                                给他/她的说明书
                            </h4>
                            <div className="space-y-4">
                                {displayData.partner.map((text, idx) => (
                                    <div key={idx} className="flex gap-3 items-start">
                                        <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                                            {idx + 1}
                                        </div>
                                        <p className="text-sm text-stone-600 leading-6">{text}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 pt-6 border-t border-rose-100 text-center">
                                <p className="text-xs text-rose-400 italic">“把这段发给TA，减少你们80%的争吵”</p>
                            </div>
                        </div>
                    )}

                    {/* 4. 自我重塑 */}
                    {activeTab === 'reshape' && (
                        <div className="space-y-4 animate-fade-in">
                            <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm">
                                <h4 className="font-bold text-sm mb-3 text-stone-800 flex items-center gap-2">
                                    <Search className="w-4 h-4 text-purple-500" /> 深度溯源
                                </h4>
                                <p className="text-sm text-stone-600 leading-7 whitespace-pre-line">
                                    {displayData.self.origins}
                                </p>
                            </div>
                            <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-2xl border border-purple-100 shadow-sm">
                                <h4 className="font-bold text-sm mb-3 text-purple-900 flex items-center gap-2">
                                    <Feather className="w-4 h-4 text-purple-600" /> 能量重塑
                                </h4>
                                <p className="text-sm text-stone-700 leading-7 whitespace-pre-line">
                                    {displayData.self.reshape}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-12 text-center pb-8">
                    <p className="font-serif italic text-stone-500 text-sm leading-8 max-w-xs mx-auto">
                      {displayData.blessing}
                    </p>
                    <div className="w-12 h-[1px] bg-stone-200 mx-auto mt-8"></div>
                    <p className="text-[10px] text-stone-300 mt-4 tracking-widest uppercase">柚子的心理小屋 · 原创出品</p>
                </div>
              </div>
          </div>

          {/* 底部悬浮操作栏 */}
          <div className="fixed bottom-0 left-0 w-full p-6 bg-white/90 backdrop-blur-lg border-t border-stone-100 z-50 flex gap-3 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
            {/* 按钮 1: 生成海报 */}
            <button 
              onClick={handleSavePoster}
              disabled={saving}
              className="flex-1 py-3.5 bg-stone-900 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform shadow-lg active:scale-95"
            >
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
              {saving ? '生成中...' : '生成结果海报'}
            </button>

            {/* 按钮 2: 复制链接 */}
            <button 
              onClick={handleCopyLink}
              className="flex-1 py-3.5 bg-white text-stone-900 border border-stone-200 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-stone-50 transition-colors shadow-sm active:scale-95"
            >
              <Share2 className="w-4 h-4" />
              复制分享链接
            </button>
          </div>

          {/* Share Modal 弹窗 */}
          {showShareModal && (
              <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in">
                  <div className="bg-white rounded-3xl p-6 w-full max-w-xs shadow-2xl scale-100 animate-slide-up relative">
                      <button 
                          onClick={() => setShowShareModal(false)}
                          className="absolute top-4 right-4 p-1 bg-stone-100 rounded-full text-stone-400 hover:bg-stone-200"
                      >
                          <X className="w-4 h-4" />
                      </button>

                      {shareType === 'poster' ? (
                          <div className="text-center">
                              <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-500">
                                  <ImageIcon className="w-6 h-6" />
                              </div>
                              <h3 className="font-bold text-lg text-stone-900 mb-2">海报已生成！</h3>
                              <p className="text-sm text-stone-500 leading-relaxed mb-6">
                                  海报已保存到相册。这张海报不含二维码和链接，非常适合发布到 <span className="font-bold text-rose-500">小红书</span> 笔记中，安全不违规 ✨
                              </p>
                              <button onClick={() => setShowShareModal(false)} className="w-full py-3 bg-stone-900 text-white rounded-xl font-bold text-sm">
                                  好的，去发笔记
                              </button>
                          </div>
                      ) : (
                          <div className="text-center">
                              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-500">
                                  <Copy className="w-6 h-6" />
                              </div>
                              <h3 className="font-bold text-lg text-stone-900 mb-2">链接已复制！</h3>
                              <p className="text-sm text-stone-500 leading-relaxed mb-6">
                                  你可以发送给 <span className="font-bold text-blue-500">微信/QQ好友</span>。好友点开后能看到更精美的动态结果页，但他看不到你的详细深度分析（那是你的隐私）🔒
                              </p>
                              <button onClick={() => setShowShareModal(false)} className="w-full py-3 bg-stone-900 text-white rounded-xl font-bold text-sm">
                                  好的，去分享
                              </button>
                          </div>
                      )}
                  </div>
              </div>
          )}

        </div>
      )}

      <style jsx global>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        /* 剧烈晃动动画 - 优化版 */
        @keyframes violent-shake {
          0% { transform: rotateY(180deg) translate(0, 0) rotate(0deg); }
          10% { transform: rotateY(180deg) translate(-2px, -2px) rotate(-1deg); }
          20% { transform: rotateY(180deg) translate(2px, 2px) rotate(1deg); }
          30% { transform: rotateY(180deg) translate(-3px, 1px) rotate(-1deg); }
          40% { transform: rotateY(180deg) translate(3px, -1px) rotate(1deg); }
          50% { transform: rotateY(180deg) translate(-2px, 2px) rotate(-1deg); }
          60% { transform: rotateY(180deg) translate(2px, -2px) rotate(1deg); }
          70% { transform: rotateY(180deg) translate(1px, 1px) rotate(-1deg); }
          80% { transform: rotateY(180deg) translate(-1px, -1px) rotate(1deg); }
          90% { transform: rotateY(180deg) translate(1px, 1px) rotate(0deg); }
          100% { transform: rotateY(180deg) translate(0, 0) rotate(0deg); }
        }

        .animate-slide-up { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-fade-in { animation: slideUp 0.8s ease-out forwards; }
        
        /* 延迟触发摇晃，配合翻转 */
        .animate-violent-shake {
          animation: violent-shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>
    </div>
  );
}
