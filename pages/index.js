'use client'

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

// ==========================================
// 1. 系统配置 & 工具
// ==========================================
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 本地存储 Key
const STORAGE_KEY = 'inner_echo_progress_v2';

// 维度定义 (ID映射)
const DIMENSIONS = [
  { id: 1, label: "确定感", keyword: "稳固基石" },
  { id: 2, label: "被需要", keyword: "价值确认" },
  { id: 3, label: "掌控感", keyword: "清晰节奏" },
  { id: 4, label: "被偏爱", keyword: "极致例外" },
  { id: 5, label: "共鸣感", keyword: "灵魂契合" },
  { id: 6, label: "自由感", keyword: "舒展呼吸" },
  { id: 7, label: "安全感", keyword: "审慎自护" }, // 文档中的安全距离
  { id: 8, label: "秩序感", keyword: "结构规则" },
];

// ==========================================
// 2. 核心数据 (题目 & 结果)
// ==========================================

// 48道完整题目
const QUESTIONS = [
  // --- Part 1: 现实切片 (Q1-16) ---
  { id: 1, text: "周末下午，伴侣突然失联了3个小时，发消息也没回。那一刻，你最真实的反应是？", options: [{ t: "下意识地去翻之前的聊天记录，看是不是我说错话了？这种不知道发生什么的感觉最折磨人。", v: 1 }, { t: "挺好的，刚好没人管我。我可以专心做自己的事，不用一直切出去回消息。", v: 6 }, { t: "第一反应是推测原因，准备等联系上后，哪怕不吵架，也要问清楚去向，防止下次再这样。", v: 3 }, { t: "心里会有点堵得慌。也不是多大事，就是觉得如果他够在意我，怎么舍得让我空等这么久？", v: 4 }] },
  { id: 2, text: "伴侣最近工作压力极大，回到家情绪很低落，坐在沙发上一言不发。此时你心里最真实的念头是？", options: [{ t: "看着挺心疼的。我不一定能帮上忙，但至少给他倒杯水、切点水果，让他知道身边有人照顾着。", v: 2 }, { t: "他现在应该很烦，不想说话。那我就识趣点，躲远点玩手机，别去撞枪口，等他缓过来了再说。", v: 7 }, { t: "这种死气沉沉的沉默让我很难受。我还是希望能聊聊，哪怕只说几句，让我知道他脑子里到底在想什么也好。", v: 5 }, { t: "我比较在意接下来的安排：今晚是就在家吃还是出去？既然心情不好，原本的计划还作数吗？", v: 8 }] },
  { id: 3, text: "因为一件琐事发生了激烈的争吵，甚至有些冷场。你心里那个过不去的点主要是？", options: [{ t: "吵架可以，但能不能别用那种冷冰冰的态度对我？那种好像随时要放弃我的感觉，比吵架本身更让我害怕。", v: 1 }, { t: "情绪发泄完了吗？完了我们就复盘一下。到底谁对了谁错了，以后这种情况按谁的来？别稀里糊涂就过去了。", v: 8 }, { t: "看他气得脸色发白或者不说话的样子，我突然就心软了。输赢不重要，我甚至想先低头哄哄他。", v: 2 }, { t: "这种无法沟通的局面让我很烦躁。如果不立刻把问题解决掉、翻篇，我就没法继续安心做别的事。", v: 3 }] },
  { id: 4, text: "你冷不丁冒出一个有点奇怪的脑洞，随口讲给伴侣听。此时你最期待/最真实的反应是？", options: [{ t: "哪怕他没听懂，但只要他愿意放下手机、转过身来认真听我说完这些废话，我就觉得很满足，因为他在乎我。", v: 4 }, { t: "他能瞬间接住这个梗，甚至还能顺着我的逻辑延伸出新的观点。那一刻我会觉得“天哪，这个世界上只有你懂我”。", v: 5 }, { t: "我不强求他懂，更别为了迎合我而硬聊。我最舒服的状态是：我说我的，你听你的，哪怕观点完全不同也没关系。", v: 6 }, { t: "其实我通常只敢说一半。对于那些特别真实、特别私人的怪想法，我还是习惯自己留着，怕说出来对方接不住，反而尴尬。", v: 7 }] },
  { id: 5, text: "伴侣想看你的手机，或者询问你过去的详细情感经历。你的本能反应是？", options: [{ t: "哪怕没秘密，我也很反感。这是我的隐私，每个人都该有自己的小世界，这种被审视的感觉让我很不舒服。", v: 6 }, { t: "随便看。甚至如果你看了能更安心、更信任我，那我求之不得。我不希望我们之间有任何猜疑。", v: 1 }, { t: "看可以，但要公平。如果我也能看你的，或者我们也交换秘密，那就没问题。规则对等就行。", v: 8 }, { t: "看可以，但我不想被误解。那些都是过去的事了，我不希望你只盯着几个名字或事件，就片面地定义现在的我。", v: 5 }] },
  { id: 6, text: "伴侣偶尔有些迷糊，犯了个不大不小的错（比如买错了东西、记错了时间）。你下意识的第一反应通常是？", options: [{ t: "下意识地去兜底。看他搞砸了，我第一反应不是生气，而是直接上手帮他善后。", v: 2 }, { t: "觉得被忽视了。第一反应是：“你是不是没把我的事放心上？”如果你足够在意我，就不该犯这种错。", v: 4 }, { t: "复盘原因。我会本能地想知道哪个环节出了问题。这种不在计划内的失误让我很难受，我想确保下次别再发生。", v: 3 }, { t: "无所谓。“谁还没个犯错的时候，多大点事。”我也不希望如果我犯错了对方揪着不放。大家都轻松点最好。", v: 7 }] },
  { id: 7, text: "谈到“未来”这个话题时，什么情况最让你感到不安？", options: [{ t: "没有计划，没有具体打算，就说“顺其自然”。这种没规划的日子让我很没底。", v: 8 }, { t: "他的态度不坚定。如果他表现出一丝犹豫，或者说“以后的事以后再说”，我就会怀疑他是不是没打算长久。", v: 1 }, { t: "一想到未来几十年都要和一个人绑死，还要面对柴米油盐的琐碎，我就本能地想逃，怕自己会慢慢枯萎。", v: 6 }, { t: "我怕未来大家都很忙，各过各的。让我觉得我们不是爱人，而是正在变成两个合租的陌生人。", v: 2 }] },
  { id: 8, text: "当你自己情绪崩溃、非常脆弱的时候，你最希望对方做什么？", options: [{ t: "别一直问“怎么了”。就当没看见，让我自己躲一会儿，等我好了再出来。", v: 7 }, { t: "不需要讲道理。只要抱着我，让我感觉“这一刻你也一样难过”，我就被治愈了。", v: 5 }, { t: "帮我分析一下现在的烂摊子该怎么收场。与其哄我，不如帮我一起把那个搞崩我的问题解决掉。", v: 3 }, { t: "就算我无理取闹，也请先站在我这边。别跟我讲客观公正，这时候我只需要偏袒。", v: 4 }] },
  { id: 9, text: "到了纪念日或生日，如果伴侣准备的礼物（或安排）让你觉得有点失望，那个失望的点通常是？", options: [{ t: "觉得不够用心。并不是要多贵，而是这东西随便谁都能买到，完全看不出我是那个被特殊对待的人。", v: 4 }, { t: "觉得没意义。他送的东西跟我完全不搭界，说明他根本不了解我最近在关注什么，也不懂我的喜好。", v: 5 }, { t: "觉得不实用或浪费。这种华而不实的东西，破坏了我们的开销计划，还不如买点家里正缺的实用的。", v: 8 }, { t: "觉得不平衡。我总是习惯把你的喜好记在备忘录里，但你对我却一无所知。我难过你没有给我同等的在意。", v: 2 }] },
  { id: 10, text: "带伴侣去参加你的朋友聚会。整个过程中，你最舒服的状态是？", options: [{ t: "“连体婴”模式。我不希望把他晾在一边。哪怕跟别人聊天，我也希望我们是站在一起的，或者眼神时不时能对上。", v: 1 }, { t: "“得体”模式。我比较在意他能不能融入。希望他表现大方、说话得体，别冷场也别出格。", v: 3 }, { t: "“放养”模式。最好是各玩各的。我聊我的天，他找他的乐子，不用我时刻照顾他的情绪。", v: 6 }, { t: "“低调”模式。正常社交就好，千万别让我们成为全场的焦点。", v: 7 }] },
  { id: 11, text: "两个人一起出去旅行，最容易让你心里炸毛的瞬间是？", options: [{ t: "由于对方磨蹭或出错，导致赶不上车/景点关门。这种因为人为失误搞砸计划的感觉，会让我瞬间暴躁。", v: 3 }, { t: "行程变来变去。一会儿要去这一会儿要去那，完全没有章法。我需要知道今天到底要干嘛，而不是在街上瞎晃。", v: 8 }, { t: "被行程表催着走。出来玩就是为了放松，如果非要打卡、几点必须起床，那这就不是旅行，是军训。", v: 6 }, { t: "同路不同频。我想跟他感叹一下风景的震撼，他却一脸漠然，或者只关心等会儿吃什么。", v: 5 }] },
  { id: 12, text: "同居或长相处时，伴侣有一些让你看不惯的生活习惯（比如乱丢袜子、熬夜）。你通常会怎么想？", options: [{ t: "“没有规矩。”家里必须有基本的整洁标准，如果大家都随心所欲，这个家就乱套了。", v: 8 }, { t: "“他不重视我。”我都说过好几次了让他改，他还是这样。是不是我说的话他根本没放在心上？", v: 1 }, { t: "“别管我就行。”只要他不强迫我也跟着他乱，或者别反过来管我，我懒得因为这点破事吵架。", v: 6 }, { t: "“还是我来吧。”骂归骂，最后还是我默默帮他收拾了。", v: 2 }] },
  { id: 13, text: "伴侣无意中提起了一个优秀的异性朋友，言语间带着欣赏。你心里的第一反应是？", options: [{ t: "酸溜溜的。哪怕知道没事，心里也膈应：你为什么要当着我的面夸别人？难道我不够好吗？", v: 4 }, { t: "警铃大作。我会开始对比：那个人是不是比我更适合他？我是不是有被替代的风险？这种危机感让我很不安。", v: 1 }, { t: "想搞清楚界限。我不反感交友，但我需要确认他们现在到底是什么关系？有没有越界？这一切是否在可控范围内？", v: 3 }, { t: "无所谓、装傻。只要别影响我就行。我不太想深究他们的过去，也不想表现得像个嫉妒狂，太难看了。", v: 7 }] },
  { id: 14, text: "在一起久了，关系进入一种“左手摸右手”的平淡模式，每天除了吃饭睡觉没别的话题。你会觉得？", options: [{ t: "这是一种慢性死亡。如果没有了思想交流，没有了火花，这段关系只剩下一个空壳，哪怕日子安稳，也让我觉得索然无味。", v: 5 }, { t: "有点失落。以前他总是围着我转，现在他回家就玩手机，好像我这个人在不在家对他来说都没差别了。", v: 2 }, { t: "求之不得。终于到了这一步！不用每天费劲维系激情，各干各的事，这种空气般的相处才是最舒服的。", v: 6 }, { t: "这很正常。激情总会褪去，现在这种稳定的、可预测的生活节奏，反而让我觉得很踏实，日子就是这样过的。", v: 8 }] },
  { id: 15, text: "你有一个非常痴迷的小爱好（比如拼模型、追星、某种运动），但伴侣完全不感兴趣。你希望他的态度是？", options: [{ t: "别干涉我。这是我的自留地，请你也离远点。不需要你理解，只要别在我玩的时候在旁边指手画脚就行。", v: 7 }, { t: "尊重我的投入。我花在这个上面的时间、金钱是经过计算的，我有分寸。别总质疑我不务正业。", v: 3 }, { t: "试着懂我一点。你可以不玩，但如果你能明白为什么这个东西能打动我，我会很开心。", v: 5 }, { t: "陪我一起玩。哪怕你不喜欢，我也希望你能为了我试着参与一下。看着你陪我做我喜欢的事，我会觉得很幸福。", v: 4 }] },
  { id: 16, text: "大吵一架终于和好了。为了让这页彻底翻过去，你最需要的一个“收尾动作”是？", options: [{ t: "反复确认。我可能会忍不住再问几次：“你真的不生气了吗？”直到听到肯定的回答。", v: 1 }, { t: "某种补偿行为。比如给他做顿好吃的，或者对他格外好一点。", v: 2 }, { t: "彻底不提。既然和好了，就赶紧回归正常，把这尴尬的一页揭过去最好。", v: 7 }, { t: "得到一个小惊喜。不管谁对谁错，如果他能在这个时候给我买个小礼物或者带我吃顿好的就好了。", v: 4 }] },

  // --- Part 2: 情绪暗涌 (Q17-32) ---
  { id: 17, text: "在一段关系里，最让你感到心慌、不踏实的那种时刻，其实是？", options: [{ t: "不知道下一秒会发生什么。这种内心悬空的感觉最折磨人，我宁愿你直接判我死刑，也不要让我猜你到底还爱不爱我。", v: 1 }, { t: "感觉透不过气。不管我走到哪、干什么，好像都有双眼睛盯着我，那种被严密包裹的窒息感，让我只想逃。", v: 6 }, { t: "事情脱离了轨迹。明明说好的事突然变了，或者局面完全乱套了，这种无法把握方向的感觉让我非常焦躁。", v: 3 }, { t: "像在演独角戏。无论我表达什么，都像掉进了黑洞，没有任何反馈。这种两个人面对面、心却连不上的孤独感，比激烈的争吵更让我绝望。", v: 5 }] },
  { id: 18, text: "当你在感情里觉得特别委屈时，脑海里那个挥之不去的念头是？", options: [{ t: "“好像我没什么价值。”我做了这么多，你却觉得理所当然，甚至根本不需要。那种觉得自己很多余的感觉最伤人。", v: 2 }, { t: "“我就知道会受伤。”只要一靠近就会有风险，我刚才那一瞬间的脆弱被你无视了，这让我本能地想立刻缩回去。", v: 7 }, { t: "“这不公平。”为什么总是我在妥协？为什么规则对我不适用？这种不对等的付出让我觉得非常憋屈。", v: 8 }, { t: "“原来我和别人没区别。”我以为对你来说我是特别的，但刚才那个细节告诉我，我并没有被你放在那个例外的位置上。", v: 4 }] },
  { id: 19, text: "你理想中最好的爱，给你的直接感觉应该是？", options: [{ t: "轻松。没有压力，没有强制要求。我想粘你的时候就粘，想一个人待着你也觉得没问题，不用时刻紧绷着。", v: 6 }, { t: "踏实。不管发生什么，我都清楚地知道你不会走。那种心里有底、不用患得患失的感觉，最让我舒服。", v: 1 }, { t: "默契。是一种不用费劲解释的轻松。我可以把脑子里最真实、甚至最奇怪的想法直接抛给你，不用担心你接不住。", v: 5 }, { t: "清晰。我们知道未来去哪，也知道现在该干嘛。一切都在计划中稳步推进，这种井井有条的感觉最好。", v: 8 }] },
  { id: 20, text: "当伴侣非常用力地黏着你、时刻都要和你在一起时，你的真实感受是？", options: [{ t: "很踏实。这说明你真的很依赖我。我很享受这种“被你完全信任、完全依靠”的感觉，这证明了我在你生活里是不可替代的。", v: 2 }, { t: "很想躲。太近了，这种高密度的亲密让我觉得不自在，甚至是种打扰。我需要一点时间回血，别逼太紧。", v: 7 }, { t: "有点烦。亲密可以，但要有分寸。如果连我的工作和正常生活节奏都被打乱了，我会觉得你很不懂事。", v: 8 }, { t: "很受用。嘴上可能说“烦死了”，但心里其实暗爽。这种非我不可的劲儿，最能证明你爱我。", v: 4 }] },
  { id: 21, text: "两个人坐在一起不说话时，你心里的真实活动是？", options: [{ t: "很难受。如果连话都懒得说，那我们在一起还有什么意思？这种精神上的断连，让我觉得我们像陌生人。", v: 5 }, { t: "很慌张。我会忍不住猜：他为什么不说话？是不是生气了？是不是对我厌倦了？这种未知让我坐立难安。", v: 1 }, { t: "很舒服。各玩各的手机，互不干扰，这种松弛感才是最高级的相处。", v: 6 }, { t: "很想找点事做。我不喜欢这种不知道该干嘛的冷场。与其尴尬地坐着，不如找个话题或者安排点事，打破这个僵局。", v: 8 }] },
  { id: 22, text: "如果你在这段关系里付出了很多，你最害怕的结果是？", options: [{ t: "怕你是真的不需要。我不怕累，但我怕我给你的东西，对你来说是个负担，或者是可有可无的废品。", v: 2 }, { t: "怕这只是我的一厢情愿。感情是双向的，如果只有我一个人在投入，那这就不是爱，是消耗。", v: 8 }, { t: "怕你把这当成理所应当。我对你好是因为我爱你，但如果你连一点特殊的感动都没有，我会瞬间心寒。", v: 4 }, { t: "怕被赖上。我怕我一旦开了头，你就会索取更多，我不想因此背上某种很重的义务。", v: 7 }] },
  { id: 23, text: "当听到“永远”这个词的时候，你下意识的反应是？", options: [{ t: "松了一口气。虽然知道未来很难说，但我现在就是太需要这句话了。它能压住我心里所有的不安。", v: 1 }, { t: "压力好大。还没发生的事就先锁死，这让我觉得很沉重。比起承诺“永远”，我更希望“当下开心就好”。", v: 6 }, { t: "听听就行。别光说好听的，关键看你怎么做。没有具体行动支撑的“永远”，对我来说就是一张空头支票。", v: 3 }, { t: "很多余。真正的契合是不需要用时间来担保的。如果我们真的同频，“永远”就是一个自然而然的结果。", v: 5 }] },
  { id: 24, text: "在激烈的争吵中，最让你感到绝望、甚至想放弃的一瞬间是？", options: [{ t: "是他推开我的时候。当他说“不用你管”或者“离我远点”时，我觉得自己像个被丢弃的垃圾。", v: 2 }, { t: "是他开始胡搅蛮缠的时候。当逻辑失效，沟通变成纯粹的情绪发泄，没有任何道理可讲，我觉得这架吵得毫无意义。", v: 8 }, { t: "是他站在我对立面的时候。哪怕我有错，但当你表示帮理不帮亲的时候，我觉得全世界都背叛了我。", v: 4 }, { t: "是他逼我立刻说话的时候。你越逼问“你说话啊”，我越想把自己封闭起来。那种被逼到死角的窒息感，最让我绝望。", v: 7 }] },
  { id: 25, text: "哪怕此时此刻什么都没发生，但只要想到这件事，你就会觉得非常有安全感：", options: [{ t: "我知道你会坚定地站在我这边。不管发生什么风雨，我都清楚地知道你不会权衡利弊，也不会动摇。", v: 1 }, { t: "我知道一切都在计划内。我们的财务、未来规划都是清晰可见的，没有那些乱七八糟的突发状况来打乱生活。", v: 3 }, { t: "我知道我是不可替代的。不是生活上的依赖，而是我能给你别人给不了的快乐或支撑，我在你生命有独特位置。", v: 2 }, { t: "我知道我随时可以做自己。我不需要为了维持关系而伪装或讨好，在你面前我不用戴面具。", v: 6 }] },
  { id: 26, text: "如果回想一段失败的感情，最让你觉得“意难平”或者“很受伤”的点可能是？", options: [{ t: "“我居然不是特别的。”原来我费尽心思去爱，最后在你眼里，我和前任、和其他人也没什么两样。", v: 4 }, { t: "“我们从未真正交流过。”哪怕在一起很久，你也没懂过我哪怕一次。我们像两个住在同一个屋檐下的陌生人。", v: 5 }, { t: "“付出没有回报。”我投入了那么多时间和精力，最后却是一笔烂账，这种严重的不对等让我觉得很亏。", v: 8 }, { t: "“我不该全盘托出。”我后悔把自己最脆弱的一面展示给你看，结果成了你后来攻击我的武器。", v: 7 }] },
  { id: 27, text: "你会因为什么事情而产生强烈的嫉妒心或占有欲？", options: [{ t: "当他遇到麻烦却不找我时。明明我是你最亲近的人，你却去找了外人解决。", v: 2 }, { t: "当他对谁都很好的时候。如果你的温柔没有门槛，那它在我这里就一文不值。", v: 4 }, { t: "当他有事瞒着我时。我不一定要干涉，但我必须知情，被蒙在鼓里让我抓狂。", v: 3 }, { t: "当他和别人聊得更嗨时。看到他和别人聊那些跟我聊不起来的话题，还两眼放光，我会觉得属于我的领地被侵犯了。", v: 5 }] },
  { id: 28, text: "伴侣出差或不在家，留你一个人独处一周。你的真实感受是？", options: [{ t: "像放假一样爽。终于不用照顾别人的情绪，不用配合别人的时间。我想几点睡几点睡，这种完全属于自己的时间太珍贵了。", v: 6 }, { t: "逐渐开始慌张。没人说话，家里太安静，我会开始忍不住看手机，期待他发消息过来，确认他还在意我。", v: 1 }, { t: "非常自在。我本来就需要很多独处时间来充电。这种互不打扰的状态，反而让我觉得我们的关系更健康了。", v: 7 }, { t: "有点无所适从。我习惯了把你放在优先级里，时刻想着你的事。突然只需要顾我自己，这种轻飘飘、没重量的感觉，反而让我觉得生活特别不真实。", v: 2 }] },
  { id: 29, text: "如果伴侣做了这件事，你会瞬间下头，甚至考虑分手？", options: [{ t: "言而无信。说好的事变卦，承诺的不兑现。如果连基本的契约精神都没有，这日子没法过。", v: 8 }, { t: "拒绝沟通。当我想聊聊问题，你却说“想太多”或者直接回避。这种拒绝进入我内心的态度，是我的死穴。", v: 5 }, { t: "制造混乱。总是惹麻烦让我收拾烂摊子，或者做事毫无章法搞得生活一团糟，这种“猪队友”我带不动。", v: 3 }, { t: "权衡利弊。如果在关键时刻，你犹豫了，或者为了别的东西牺牲了我的利益，那我绝对不会原谅。", v: 4 }] },
  { id: 30, text: "如果给你自己写一份“恋爱使用说明书”，你最希望标注的核心法则是？", options: [{ t: "“请坚定地选择我。”别犹豫，别摇摆，让我看到你选择我的决心，而不是总让我猜。", v: 1 }, { t: "“请允许我做自己。”别打着“为你好”的名义来改造我，爱我就请接受我原本的样子，包括我的缺点。", v: 6 }, { t: "“请看见我的付出。”看见我的付出，看见我的辛苦。别把一切都当成空气，夸我一句有那么难吗？", v: 2 }, { t: "“请给我一点时间。”别一上来就掏心掏肺，也别逼我马上回应。给我点时间，我才能慢慢打开。", v: 7 }] },

  // --- Part 3: 灵魂图腾 (Q31-48) ---
  { id: 31, text: "如果让你用一个词来定义你理想中的“关系形态”，你希望你们是？", options: [{ t: "合伙人。账目分明，分工明确，大家遵守同一个规则，为了共同的未来高效努力。", v: 8 }, { t: "船长与领航员。有明确的方向，有问题能迅速解决。无论风浪多大，这艘船必须在我们的控制之中。", v: 3 }, { t: "灵魂伴侣。哪怕一句话不说，眼神一对就知道对方在想什么。这种不需要磨合的默契，是我唯一的追求。", v: 5 }, { t: "两条平行的河。我们流向同一个大海，但我们有各自的河道。既有交集，又互不吞没，保持各自的完整。", v: 6 }] },
  { id: 32, text: "在你看来，一个人爱你的最高级表现是？", options: [{ t: "例外。他对世界冷漠，唯独对我不一样。这种“排他性”的温柔，才是最高级的爱。", v: 4 }, { t: "托底。无论我变成什么样，或者闯了什么祸，我知道他永远会站在我身后，不会抛弃我。", v: 1 }, { t: "依赖。他愿意把最脆弱、最无助的一面展示给我看，只让我一个人照顾他，这说明他完全把心交给了我。", v: 2 }, { t: "尊重。他从不强迫我改变，也不窥探我的隐私。他懂得站在安全线以外守护我，这种分寸感最打动我。", v: 7 }] },
  { id: 33, text: "如果要把你向往的亲密关系画成一幅画，它最像什么？", options: [{ t: "深深扎进土里的树根。无论地表风雨多大，地下永远紧紧纠缠，谁也拔不走。", v: 1 }, { t: "两朵飘在天上的云。我们在同一片天空，偶尔重叠，偶尔分开，聚散都随风，轻盈且自由。", v: 6 }, { t: "一条笔直的高速公路。视野开阔，路标清晰，我们握着方向盘，全速驶向同一个终点。", v: 3 }, { t: "两面互相照映的镜子。我看着你，就能看见最深处的自己。这种无声的映照，就是最深的懂得。", v: 5 }] },
  { id: 34, text: "如果要把自己比喻成一种动物，在爱人面前，你更像？", options: [{ t: "温顺的大金毛。我不需要做什么惊天动地的事，你随时感受到陪伴和暖意，我就觉得很满足。", v: 2 }, { t: "被驯服的小狐狸。世上有千千万万只狐狸，但我才对你来说是独一无二的。我只认你这一个“驯养员”。", v: 4 }, { t: "屯松果的松鼠。我喜欢未雨绸缪，一点点把我们的窝填满，规划好过冬的粮食。这种踏实感，是我爱你的方式。", v: 8 }, { t: "林间的小鹿。我生性敏感，如果你愿意站在原地安静地等，我会慢慢试探着靠近你。", v: 7 }] },
  { id: 35, text: "闭上眼，你觉得最让你感到安稳的那个空间是？", options: [{ t: "暴雨夜的屋子。外面狂风大作，屋内灯火通明。你在身边，门窗紧闭，这就是全世界最安全的地方。", v: 1 }, { t: "巨大的落地窗。视野通透，没有围栏。我不希望被墙壁困住，我需要随时能走出去的呼吸感。", v: 6 }, { t: "深夜书房。安静，私密，只有书和思想。我们可以一整晚不睡觉，只谈论灵魂，这是精神的庇护所。", v: 5 }, { t: "私有王国。关上门，这里就是我们的国度。外面的混乱无效，只有我们制定的规则。", v: 3 }] },
  { id: 36, text: "如果关系出现危机，你觉得那场景最像什么？", options: [{ t: "荒原。我拼命呼喊，想要付出，却发现周围空无一人，我的爱变成了没有回声的荒草。", v: 2 }, { t: "沼泽。我被拽住了，越挣扎陷得越深。那种无法抽身的黏腻感，是我最大的噩梦。", v: 7 }, { t: "废墟。原本搭建好的规则、承诺全部崩塌，满地狼藉，一切都失去了原本的逻辑。", v: 8 }, { t: "大卖场。我被放在货架上，和别人打折出售。那种廉价感和可替代感，会瞬间摧毁我。", v: 4 }] },
  { id: 37, text: "如果“誓言”是一个具体的物品，你希望它是什么？", options: [{ t: "磐石。够重、够硬、搬不走。誓言不该是轻飘飘的话，而是一块压在那里的石头，以此镇住生活中所有的变数。", v: 1 }, { t: "风铃。悦耳，但不沉重。风来时它会响，风走时它静止。它美在当下的回应，而不是永久的束缚。", v: 6 }, { t: "契约。白纸黑字。它代表的不是浪漫，而是两个清醒的成年人，在理智状态下达成的、不可违背的守则。", v: 3 }, { t: "潮汐。是引力，不是努力。月亮不需要对大海发誓，潮水也会如约而至。这种不言自明的必然性，才是誓言。", v: 5 }] },
  { id: 38, text: "你最喜欢的亲密关系，它的“温度”应该是？", options: [{ t: "滚烫的 100°C。我喜欢那种沸腾的热情，那种全心全意扑上去的炙热，哪怕会被烫伤也在所不惜。", v: 2 }, { t: "微凉的 20°C。像秋天的风，清爽、不黏人。既不冷漠，也不让人觉得燥热难耐，这才是最长久的。", v: 7 }, { t: "恒温的 26°C。我不要忽冷忽热，我要的是稳定。不管是春夏秋冬，永远保持在这个最舒适的刻度。", v: 8 }, { t: "只暖一人的 37°C。它是隐秘的、私有的，是只有我才有资格触碰的特权。", v: 4 }] },
  { id: 39, text: "如果爱是一件必须随身携带的物品，你觉得它最像？", options: [{ t: "贴身的护身符。平时可能感觉不到它的存在，但遇到危险或不安时，摸到它就在那里。", v: 1 }, { t: "降噪耳机。戴上它，世界的嘈杂瞬间消失，只能听到我们想听的旋律。", v: 5 }, { t: "瑞士军刀。精密、锋利、多功能。不管生活抛来什么乱七八糟的难题，我们都能拿它解决。", v: 3 }, { t: "一张空白机票。没有目的地，没有返程日。爱给了我底气，让我去探索更广阔的世界。", v: 6 }] },
  { id: 40, text: "如果有一天真的要分开，你希望那是？", options: [{ t: "燃尽。我像蜡烛一样流干了最后一滴泪，直到再也没有东西可以给你了，我才甘心离场。", v: 2 }, { t: "退潮。没有激烈的争吵，只是自然而然地退去。水面恢复平静，像什么都没发生过一样。", v: 7 }, { t: "清算。我们坐下来，把账算清，把话说开。有一个明确的句号，而不是一个潦草的省略号。", v: 8 }, { t: "绝版。我走之后，你会永远怀念我，因为你再也遇不到像我这样对你好的人了。", v: 4 }] },
  { id: 41, text: "你最喜欢的恋爱氛围，像哪种天气？", options: [{ t: "多云有风。空气是流动的，云是散漫的。没有暴晒的太阳，也没有压抑的雨，清清爽爽，适合散步。", v: 6 }, { t: "初雪。世界突然变得很安静，只剩下白色。这种纯粹、浪漫、又有点稀缺的氛围，最让我心动。", v: 4 }, { t: "晴朗无云。能见度极高，一眼能看到地平线。没有突如其来的雷阵雨，一切都清晰、明朗、可预测。", v: 8 }, { t: "深夜雷雨。窗外狂风暴雨，我们躲在屋里。这种与世隔绝、只有我们俩相依为命的深刻感，最让我着迷。", v: 5 }] },
  { id: 42, text: "如果你闭上眼触摸“爱”，手感应该是？", options: [{ t: "晒热的石头。厚实、干燥、有温度。它并不柔软，但有一种沉甸甸的分量。", v: 1 }, { t: "湿软的陶泥。柔软、依恋。它会填满我指缝的每一处空隙，完全顺应我的力度。", v: 2 }, { t: "流动的溪水。清凉、无重力。它流经我的皮肤，带来触感却不带来负担。", v: 7 }, { t: "紧绷的缰绳。粗糙、有力、有摩擦感。它连接着前方的力量，握住它，我就能控制方向。", v: 3 }] },
  { id: 43, text: "你觉得一段好的亲密关系，闻起来应该像？", options: [{ t: "薄荷或海盐。清冽、透气。吸进去能让肺部扩张，而不是那种甜腻到让人头晕的香水味。", v: 6 }, { t: "草莓尖尖。是那第一口咬下去的甜，带着露水，是特供的、精选的、只留给我的那部分。", v: 4 }, { t: "刚晒干的棉被。干净、干燥、阳光的味道。没有发霉的阴影，只有一种井井有条的生活气息。", v: 8 }, { t: "旧书页/焚香。沉静、悠长。不是为了取悦感官，而是能让人瞬间静下来，闻到时间的味道。", v: 5 }] },
  { id: 44, text: "你希望爱人是哪种光源？", options: [{ t: "壁炉里的火。它需要我不停地添柴，但它能照亮整个屋子。我是那个守护火种的人。", v: 2 }, { t: "灯塔。它是固定的。不管我航行到哪里，只要回头看，那一束光永远在那个位置扫射，从未熄灭。", v: 1 }, { t: "月光。它是温柔的，但也是清冷的。它照亮我，但不会像正午的太阳那样灼伤我。", v: 7 }, { t: "手里的火把。它不靠天赐，而是靠我亲手点燃。我不祈求天亮，我要亲自为你劈开黑暗、照亮前路。", v: 3 }] },
  { id: 45, text: "如果把与爱人的相处节奏比作一段旋律，你希望它是？", options: [{ t: "时钟的声音。滴答滴答，精准、规律。我们按时吃饭，按时睡觉，按部就班地走完这一生。", v: 8 }, { t: "随口的哼唱。没有固定的曲调，也不为了表演。就像散步时随口哼出的小调，断断续续、轻轻松松。", v: 6 }, { t: "山谷里的回音。你发出的每一个声音，无论多微弱，都能在我这里得到回应。因为我们也正好想唱同一首歌。", v: 5 }, { t: "为你独奏。聚光灯打在你身上，而我在为你演奏。那一刻，全世界都是背景音，只有我们是彼此的主角。", v: 4 }] },
  { id: 46, text: "如果爱必须伴随一种痛，你宁愿是？", options: [{ t: "生长痛。像骨骼拉伸一样，虽然酸痛，但说明我们在付出、在羁绊，关系是成长的。", v: 2 }, { t: "钝痛。哪怕关系变得乏味、沉重，也好过那种“不知道明天你还在不在”的剧烈撕裂痛。", v: 1 }, { t: "幻痛。哪怕分开了，你也像我身体的一部分。但我宁愿隔着距离怀念，也不愿靠太近互相伤害。", v: 7 }, { t: "剥离痛。像撕开粘在身上的面具和伪装。那种把最真实的软肋赤裸裸暴露给你的恐惧和疼痛，是我们抵达灵魂深处的代价。", v: 5 }] },
  { id: 47, text: "如果要把你们共度的时间比作一样东西，它应该是？", options: [{ t: "流沙。抓得越紧流得越快，不如摊开手掌。让它自然流淌，顺其自然。", v: 6 }, { t: "沙漏。时间是可控的，哪怕流完了，我们也有能力把它倒过来，重新开始下一轮。", v: 3 }, { t: "琥珀。把最美的那一瞬间封存起来，永远晶莹剔透，不被外界的灰尘侵蚀。", v: 4 }, { t: "年轮。一圈一圈，扎扎实实。不管发生什么，每一年都会留下一圈清晰的印记。", v: 8 }] },
  { id: 48, text: "最后，请凭直觉填空：爱是______。", options: [{ t: "定数。是万物流变的世界里，唯一不会更改、也不会撤回的那个答案。", v: 1 }, { t: "认出。是我们在嘈杂的茫茫人海里，精准地辨认出——彼此是唯一的同类。", v: 5 }, { t: "成全。是我们并不互相捆绑，却因此在彼此身边，拥有了更广阔的天空。", v: 6 }, { t: "治愈。是看见了你的破碎，而我甘愿成为那贴唯一有效的药。", v: 2 }] }
];

// 结果文案数据
const RESULTS = {
  1: {
    title: "确定感",
    keyword: "稳固基石",
    quote: "万物皆流变，而我只要一种绝对的定数。",
    accent: "#E7E5E4", // 灰白，岩石色
    sections: [
      { t: "你的亲密底色", c: "在亲密关系中，你核心的情感诉求是“稳定与可预期”。相较于外在条件或轰轰烈烈的浪漫，你更看重凡事有交代、件件有着落。这种清晰、可靠的互动模式，是你构建安全感的基石。 \n\n你对“不确定性”极度敏感。任何模糊的信号、延迟的回应，都可能触发你内心的不安。你反复确认，本质上是为了在流动的关系中，寻找一个永远不会变的锚点。" },
      { t: "你的光影图谱", c: "【光】你是关系的定海神针。你具备极强的抗风险韧性，认定即终身。你的情感投入具有极强的排他性，拒绝模糊模式。 \n\n【影】你难以忍受信息空白。当对方沉默时，你容易过度解读，将中性信号转化为“被否定”。你常以“懂事”为名压抑需求，表面说没事，内心却在内耗。" },
      { t: "爱你的人需要知道", c: "1. 你的追问从不是找茬，是在求安心。哪怕只是抱抱你说“我在”，都比讲道理管用。 \n2. 报备是你的定心丸。不要求秒回，但怕突然失联。一句“忙完找你”就能救你于水火。 \n3. 关键时刻请坚定偏向你。任何犹豫，在你眼里都会变成“我不重要”的信号。" },
      { t: "如何更温柔地爱自己", c: "你对确定感的渴求，源于童年不稳定的回应模式。这不是因为你不够好，而是因为你太想留住爱。 \n\n试着练习“事实归因”：当对方沉默时，告诉自己“他可能只是累了”，而不是“他厌倦我了”。相信关系的韧性，爱不是持续不断的电流，而是即便有间隙也不会断裂的纽带。" },
      { t: "祝福", c: "愿你遇见一个懂你敏感、护你不安的人——他不必许你永远，却能在你慌张试探时，给你一份“我一直都在”的笃定。" }
    ]
  },
  2: {
    title: "被需要",
    keyword: "价值确认",
    quote: "没有你，我只是一片废墟。",
    accent: "#FB923C", // 暖橙，温暖色
    sections: [
      { t: "你的亲密底色", c: "你最核心的需求是靠“被对方依赖”来确认自己的价值。比起甜言蜜语，你更在意自己的存在能让对方生活变轻松。你本能地盯着对方的细节：加班了煮饭，遇事了帮忙。 \n\n这背后藏着你最怕的事——怕自己可有可无。如果不被需要，你就会觉得不被爱，那种没着没落的感觉比吵架还难受。" },
      { t: "你的光影图谱", c: "【光】你是最踏实的后盾。从来不只说漂亮话，而是实打实地行动。你总能捕捉到他没说出口的疲惫，主动搭把手。 \n\n【影】你把价值感绑在了“被需要”上。一旦他独立搞定事情，你会失落。你不敢直说“我也想被照顾”，宁愿默默付出等着被发现，最后变成了委屈。" },
      { t: "爱你的人需要知道", c: "1. 当他主动帮你分担时，别拒绝。接受他的帮助，是对他价值的肯定。 \n2. 主动求助是珍贵的认可。偶尔说一句“我搞不定，陪陪我”，会让他瞬间感受到被信任的重量。 \n3. 你的过度照顾是怕失去。让他知道，他需要的是你这个人，而不是你不停的付出。" },
      { t: "如何更温柔地爱自己", c: "你可能从小就学会了“懂事才能被爱”。但请记得，你也可以只是单纯做自己。 \n\n试着先学会不付出也敢安心被爱。哪怕你今天什么都不做，只是静静待着，你依然值得被爱。坦然说“我也需要照顾”，这不自私，这是关系健康的开始。" },
      { t: "祝福", c: "愿你遇见一个人，他会依赖你的照顾，也会把你的需求放在心上。他会告诉你：“有你帮忙很好，但没有你，我也一样在乎你”。" }
    ]
  },
  3: {
    title: "掌控感",
    keyword: "清晰节奏",
    quote: "我抛开了所有理智，只求你结束我的痛苦。",
    accent: "#94A3B8", // 冷灰蓝，控制色
    sections: [
      { t: "你的亲密底色", c: "你最核心的需求是关系的可预期、可沟通。你不是想控制对方，而是想控制“关系的风向”。模糊的界限、反复的态度在你眼里都是隐患。 \n\n你渴望的是双向协作：不用你单方面定规则，而是对方愿意一起对齐目标。你要的不是掌控权，而是“我们始终站在同一边”的笃定。" },
      { t: "你的光影图谱", c: "【光】你有清晰的关系梳理力。不管是界限还是未来，你都能推动双方达成共识。你是靠谱的托底者，有你在，关系永远有方向。 \n\n【影】你对“无序”极致焦虑。一旦脱轨，你会本能地抓紧。你习惯了独自掌舵，身心俱疲却不敢放手，理性往往掩盖了你自己的委屈。" },
      { t: "爱你的人需要知道", c: "1. 他不是想控制你，是怕乱了阵脚。当他想聊聊，只是想把关系捋顺。 \n2. 他要的是合作感。你可以有自己的节奏，但请告诉他，别让他觉得自己在独自扛。 \n3. 告诉他“先不解决问题，单纯陪陪我”。这能让他放下理性的焦虑，回归情感。" },
      { t: "如何更温柔地爱自己", c: "你的掌控欲是小时候在无序环境里逼出来的生存本能。但现在，你可以试着允许关系有“不掌控”的空间。 \n\n接纳适度失控，太紧绷的绳子容易断。放下全能责任，把担子分出去。承认自己的无力不是软弱，你也需要被人在情绪上接住。" },
      { t: "祝福", c: "愿你遇见一个能并肩扛事的人，不用再让你独自做那个“负责全局的大人”。愿你有掌舵的底气，也有被照顾的福气。" }
    ]
  },
  4: {
    title: "被偏爱",
    keyword: "极致例外",
    quote: "你要永远为你驯服的东西负责。",
    accent: "#FB7185", // 玫红，热烈色
    sections: [
      { t: "你的亲密底色", c: "你追求的不是大众化的好，而是“独一份”的特权。如果他对你和对别人一样好，那这份爱对你来说就毫无意义。你要的是成为他唯一的例外。 \n\n你比谁都敏感于温度的波动。一旦感觉到“特殊待遇”被稀释，你的安全感就会崩塌。这不是矫情，是你确认爱的唯一方式。" },
      { t: "你的光影图谱", c: "【光】你深情且专注。一旦认定，你的爱带着极强的专属感。你擅长创造独特的记忆，让关系充满偶像剧般的心动。 \n\n【影】你对差别对待极致敏感。别人多得一份关注，你心里天平就歪了。你容易陷入求证的内耗，一旦感觉不再特别，会防御性地退缩。" },
      { t: "爱你的人需要知道", c: "1. 她要的不是更多，是独一份。记得她随口提的小事，就是在说“你最重要”。 \n2. 别说“你想多了”。先抱抱她，承认她的在意，比讲道理管用。 \n3. 主动表达偏爱是刚需。偶尔直白地说一句“你在我心里不一样”，能救她的命。" },
      { t: "如何更温柔地爱自己", c: "你对偏爱的执着，源于小时候在意没被优先回应的遗憾。但别总等着别人证明，先学会自己偏爱自己。 \n\n接纳你的敏感，不用骂自己小心眼。想吃的东西自己去吃，想做的事自己去做。你自己给足了自己独一份的宠爱，就不必在那份“不确定”里患得患失。" },
      { t: "祝福", c: "愿你遇见明目张胆的偏爱，有人把你放在心尖上，让你清清楚楚感受到，自己就是那个不可替代的例外。" }
    ]
  },
  5: {
    title: "精神共鸣",
    keyword: "灵魂契合",
    quote: "我们相遇在精神的旷野，无需言语便已相通。",
    accent: "#818CF8", // 靛蓝，深邃色
    sections: [
      { t: "你的亲密底色", c: "你无法忍受“同床异梦”的孤独。对你来说，如果不能在思想和灵魂深处对话，那在一起就没有任何意义。你渴望的是那种“无需多言”的默契。 \n\n你对浅层关系有本能的疏离。你怕的不是没话题，而是话题永远停留在“吃了没”。一旦遇到能接住你奇思妙想的人，你会毫无保留地投入。" },
      { t: "你的光影图谱", c: "【光】你是最好的思想伴侣。你能带给对方认知的拓展和成长的活力。你真正懂得倾听，能读懂背后的情绪。 \n\n【影】你对浅层关系低耐受。如果长期只聊琐事，你会想抽离。你容易把“听不懂”等同于“不在乎”，对精神错位极其敏感。" },
      { t: "爱你的人需要知道", c: "1. 那些看似无用的话题，是她靠近的信号。她只是想看看你愿不愿意陪她在精神上站一会儿。 \n2. 别用“想那么多干嘛”敷衍她。哪怕你给不出答案，认真听完并分享感受，对她来说就是珍惜。 \n3. 琐事寒暄填不满她的心，她需要的是心里的真实回响。" },
      { t: "如何更温柔地爱自己", c: "你对共鸣的执着，是因为小时候“心里千言万语没人懂”。但请允许灵魂“多元栖息”。 \n\n不把所有期待压在一个人身上。深刻的话题可以分给书和朋友，伴侣给不了的，不代表爱不在。学会在普通日子里发现连接，平淡里的心意，也值得被珍惜。" },
      { t: "祝福", c: "愿你遇见共赴精神旷野的伙伴。愿有人愿意认真听你说完所有奇思妙想，和你一起对世界保持好奇。" }
    ]
  },
  6: {
    title: "自由感",
    keyword: "舒展呼吸",
    quote: "我爱你，却不愿用爱束缚你。",
    accent: "#38BDF8", // 天蓝，自由色
    sections: [
      { t: "你的亲密底色", c: "你最核心的需求是“不被束缚”。靠近不难，难的是不用时刻报备、不用丢掉自己的节奏。你必须保留一块完全属于自己的空间。 \n\n对你来说，最好的爱是“我需要时你在，我想独处时你不扰”。这份“不吞没”的自在，才是你最踏实的亲密。" },
      { t: "你的光影图谱", c: "【光】你有让人舒服的松弛感。你不控制、不勒索，也不把情绪丢给对方。你的爱像春风，轻盈又不沉重。 \n\n【影】你对“过度靠近”本能抗拒。一旦感觉被绑架，你会提前撤退。你太习惯独自消化，容易让对方觉得“走不进你心里”。" },
      { t: "爱你的人需要知道", c: "1. 我需要独处不是不爱你。只有调整好节奏，我才能更好地爱你。 \n2. 别用时刻在线检验我。秒回和黏腻不是我爱你的证明。 \n3. 当我告诉你我的安排，其实是把你放进了生活里。一句“好，我等你”，比什么都让我安心。" },
      { t: "如何更温柔地爱自己", c: "你对自由的执着，是小时候被过度管束后的自我保护。但请接纳你的边界需求，这从不是冷漠。 \n\n温柔划定边界，不用刻意推开。主动说“我需要一小时独处”，比突然消失更好。试着适度敞开，不用一直硬扛，真正爱你的人会尊重你的节奏。" },
      { t: "祝福", c: "愿你始终保有做自己的勇气。愿你遇见懂你节奏的人，你们是并行的光，各自有轨道，却能相互照亮。" }
    ]
  },
  7: {
    title: "安全距离",
    keyword: "审慎自护",
    quote: "待人如执烛，太近灼手，太远暗生。",
    accent: "#34D399", // 薄荷绿，安全色
    sections: [
      { t: "你的亲密底色", c: "你不是冷淡，只是自带“安全缓冲带”。你通过观察、确认，直到笃定“值得托付”才敢卸下防备。任何猛扑过来的热情，都会让你下意识后退。 \n\n你对关系的态度是“宁缺毋滥”。确定前有多审慎，确定后就有多坚定。" },
      { t: "你的光影图谱", c: "【光】你是最长情的定心丸。一旦选择便全心投入。你能拿捏“刚刚好”的距离，不黏腻也不疏远，情绪克制稳健。 \n\n【影】你的慢常被误解为“不上心”。被催促时你会防御性退缩。你总想着“再看看”，容易把关系困在观察期的内耗里。" },
      { t: "爱你的人需要知道", c: "1. 我的慢是怕真心错付。如果你推得太猛，我会本能把心关上。 \n2. 别在情绪里逼我说话。放下评判，我才敢开口。 \n3. 持续的靠谱比瞬间的盛大重要。让我感觉到“你一直都在”，我才敢靠近。" },
      { t: "如何更温柔地爱自己", c: "你不是高冷，是小时候“靠近=受伤”的经历让你怕疼。但请允许自己慢慢靠近。 \n\n不用自责太冷，你有权利按自己的节奏来。试着小步敞开，不用一步到位，只分享一点点真心话。直白说出“我需要时间”，不用让对方猜。" },
      { t: "祝福", c: "愿你遇见一个不催你交卷的人。他能读懂你慢热背后的赤诚，静静陪你在门口坐一会儿，等你准备好再把你拉进门。" }
    ]
  },
  8: {
    title: "秩序感",
    keyword: "结构规则",
    quote: "好的关系，是一起把日子过成有章法的温柔。",
    accent: "#60A5FA", // 矢车菊蓝，理性色
    sections: [
      { t: "你的亲密底色", c: "你是关系的共建者。你核心的需求是清晰的边界、明确的期待和可落地的沟通。你认定长期关系的根基必须扎在“坦诚”和“共识”的土壤里。 \n\n你怕够了混乱和内耗。当关系出现模糊态度，你会焦虑。你需要的是愿意一起共建规则的伙伴，而非顺其自然的敷衍。" },
      { t: "你的光影图谱", c: "【光】你有化繁为简的秩序力，能避开无效内耗。你主动破局，不逃避冷战。你的亲密是实实在在的支撑。 \n\n【影】你对模糊状态零容忍。急于解决问题时容易忽略情绪缓冲。你理性太强，有时会让对方觉得“不被懂”。" },
      { t: "爱你的人需要知道", c: "1. 坦诚是最大的爱。愿意和你商量规则，就是被尊重的证明。 \n2. 长时间的模糊会耗光安全感。别用“顺其自然”敷衍。 \n3. 当我提议好好聊聊，请认真对待。这是我想解决问题，不是想审判你。" },
      { t: "如何更温柔地爱自己", c: "你对秩序的依赖，是小时候在混乱环境里抓到的救命稻草。但请允许关系有温柔的留白。 \n\n分清问题和情绪，下次先接住对方的情绪，再聊方案。允许暂时没答案，只要对方不逃避，慢一点没关系。你的秩序感是保护，不是枷锁。" },
      { t: "祝福", c: "愿你遇见愿意和你把话说透、把日子捋顺的人。不用你独自扛起混乱，而是一起把琐碎梳理成暖意。" }
    ]
  }
};

// ==========================================
// 3. 辅助组件
// ==========================================
const AbstractTotem = ({ id, small }) => (
  <div className={`totem type-${id} ${small ? 'small' : ''}`}>
    <div className="t-circle-main"></div><div className="t-circle-ripple"></div><div className="t-particles"></div>
  </div>
);

// 展开收起卡片
const CollapsibleCard = ({ title, content, accent, isSpecial }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // 给伴侣的特殊卡片样式
  if (isSpecial) {
    return (
      <div className="text-card glass-panel special-card">
        <div className="special-header" style={{borderBottomColor: 'rgba(255,255,255,0.1)'}}>
          <h4 className="tc-title" style={{color: accent}}>💌 {title}</h4>
          <span className="copy-hint">可截图转发给TA</span>
        </div>
        <p className="tc-content" style={{whiteSpace: 'pre-line'}}>{content}</p>
      </div>
    )
  }

  return (
    <div className="text-card glass-panel">
      <h4 className="tc-title" style={{color: accent}}>{title}</h4>
      <div className={`tc-content-wrapper ${isOpen ? 'open' : ''}`}>
        <p className="tc-content" style={{whiteSpace: 'pre-line'}}>{content}</p>
      </div>
      <button className="expand-btn" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '收起' : '展开阅读'}
        <span className={`arrow ${isOpen ? 'up' : ''}`}>▼</span>
      </button>
    </div>
  );
};

// ==========================================
// 4. 主程序
// ==========================================
export default function App() {
  const [view, setView] = useState('welcome'); 
  const [code, setCode] = useState(''); 
  const [errorMsg, setErrorMsg] = useState('');
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [scores, setScores] = useState({ 1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0, 8:0 });
  const [results, setResults] = useState(null); // { primary: id, secondary: id, pScore, sScore }
  
  const [fadeKey, setFadeKey] = useState(0); 
  const [interstitialMsg, setInterstitialMsg] = useState('');
  
  // 结果页的状态
  const [activeTab, setActiveTab] = useState('primary'); // 'primary' | 'secondary'

  // 初始化：检查本地存储，看是否是“继续答题”或“查看结果”
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      if (data.status === 'completed') {
        setResults(data.results);
        setScores(data.scores);
        setView('result'); // 直接看结果
      } else if (data.status === 'in_progress') {
        // 如果有进行中的，在首页显示“继续”按钮，这里通过状态标记
        setScores(data.scores);
        setCurrentQIndex(data.currentQIndex);
        // 标记一下，View 还是 welcome，但在 welcome 里判断显示不同按钮
      }
    }
  }, []);

  // 验证兑换码
  const handleVerify = async () => {
    if (!code.trim()) return; setView('loading_verify'); setErrorMsg('');
    try {
      const { data, error } = await supabase.from('codes').select('*').eq('code', code.trim()).single();
      if (error || !data) throw new Error('兑换码无效，请检查输入');
      if (data.is_used) throw new Error('该兑换码已被使用');
      
      // 标记使用
      await supabase.from('codes').update({ is_used: true }).eq('id', data.id);
      await wait(1500); 
      
      // 开始新测试
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ 
        status: 'in_progress', 
        currentQIndex: 0, 
        scores: { 1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0, 8:0 } 
      }));
      setView('intro');
    } catch (err) { setErrorMsg(err.message || '网络异常，请重试'); setView('redeem'); }
  };

  // 开始/继续答题
  const startQuiz = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      if (data.status === 'in_progress') {
        setCurrentQIndex(data.currentQIndex);
        setScores(data.scores);
      }
    }
    setView('quiz');
  };

  // 处理答题
  const handleAnswer = async (value) => {
    const newScores = { ...scores, [value]: scores[value] + 1 };
    const nextIndex = currentQIndex + 1;
    
    // 实时存档
    setScores(newScores);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      status: 'in_progress',
      currentQIndex: nextIndex,
      scores: newScores
    }));

    // 过场动画逻辑
    if (nextIndex === 16) { // Part 1 结束
      setInterstitialMsg("第一阶段结束... \n正在剥离社交伪装");
      setView('interstitial'); await wait(2500);
      setCurrentQIndex(nextIndex); setView('quiz'); setFadeKey(k => k + 1);
    } else if (nextIndex === 32) { // Part 2 结束
      setInterstitialMsg("正在潜入潜意识深处... \n触摸那些未曾开口的渴望");
      setView('interstitial'); await wait(2500);
      setCurrentQIndex(nextIndex); setView('quiz'); setFadeKey(k => k + 1);
    } else if (nextIndex < QUESTIONS.length) {
      // 普通切题
      await wait(250); // 小延迟让用户看到点击反馈
      setCurrentQIndex(nextIndex); setFadeKey(k => k + 1);
    } else {
      // 结束
      calculateAndFinish(newScores);
    }
  };

  // 计算结果 (Top 1 & Top 2)
  const calculateAndFinish = async (finalScores) => {
    setView('calculating');
    
    // 排序找出前两名
    const sorted = Object.entries(finalScores).sort((a, b) => b[1] - a[1]);
    const primaryId = parseInt(sorted[0][0]);
    const secondaryId = parseInt(sorted[1][0]);
    
    // 计算百分比 (总分48)
    const pScore = Math.round((sorted[0][1] / 48) * 100);
    const sScore = Math.round((sorted[1][1] / 48) * 100);

    const resultData = {
      primary: primaryId,
      secondary: secondaryId,
      pScore,
      sScore
    };

    setResults(resultData);
    
    // 存最终结果
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      status: 'completed',
      results: resultData,
      scores: finalScores
    }));

    await wait(3000);
    setView('result');
  };

  // 重新测试 (清空本地存储)
  const resetTest = () => {
    if(confirm('确定要重新开始吗？之前的记录将清空。')) {
      localStorage.removeItem(STORAGE_KEY);
      setScores({ 1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0, 8:0 });
      setCurrentQIndex(0);
      setView('welcome');
    }
  };

  return (
    <div className="app-root">
      <div className="stars-bg"></div>

      {/* ================= 1. 落地页 ================= */}
      {view === 'welcome' && (
        <div className="view-container fade-in">
          <div className="hero-card glass-panel">
            <div className="logo-mark">柚子的心理小屋</div>
            <h1 className="main-title">情感欲望测量</h1>
            <p className="sub-title">DEEP PSYCHOLOGY TEST</p>
            <div className="hero-desc">
              <p>探索潜意识深处的爱之本能</p>
              <span className="tag">48道深度探针</span>
              <span className="tag">8种欲望图谱</span>
            </div>
            
            {/* 智能按钮：继续 or 开始 */}
            {localStorage.getItem(STORAGE_KEY) && JSON.parse(localStorage.getItem(STORAGE_KEY)).status === 'in_progress' ? (
              <button onClick={startQuiz} className="btn-primary">继续上次测试</button>
            ) : localStorage.getItem(STORAGE_KEY) && JSON.parse(localStorage.getItem(STORAGE_KEY)).status === 'completed' ? (
              <button onClick={() => {
                const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
                setResults(data.results);
                setScores(data.scores);
                setView('result');
              }} className="btn-primary">查看我的报告</button>
            ) : (
              <button onClick={() => setView('redeem')} className="btn-primary">我已有兑换码</button>
            )}
            
            <button onClick={() => alert('请前往小红书搜索【柚子的心理小屋】获取')} className="btn-link">如何获得兑换码？</button>
          </div>
        </div>
      )}

      {/* ================= 2. 兑换码输入 ================= */}
      {view === 'redeem' && (
        <div className="view-fullscreen flex-center fade-in">
          <div className="login-card glass-panel">
            <h2 className="login-title">解锁测试</h2>
            <input 
              type="text" 
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="请输入兑换码"
              className="access-input"
            />
            <button onClick={handleVerify} className="btn-primary" style={{marginTop:'16px'}}>开始解锁</button>
            <button onClick={() => setView('welcome')} className="btn-text">返回</button>
            {errorMsg && <p className="err-msg">{errorMsg}</p>}
          </div>
        </div>
      )}

      {/* ================= 3. 说明页 ================= */}
      {view === 'intro' && (
        <div className="view-container fade-in">
          <div className="intro-card glass-panel">
            <h3>测试说明</h3>
            <div className="step-list">
              <div className="step-item"><span>Part 1</span>现实切片 · 条件反射</div>
              <div className="step-item"><span>Part 2</span>情绪暗涌 · 潜意识</div>
              <div className="step-item"><span>Part 3</span>灵魂图腾 · 直觉</div>
            </div>
            <p className="note">全程约需 10-15 分钟。<br/>请关闭大脑逻辑，仅凭直觉秒选。</p>
            <button onClick={startQuiz} className="btn-primary">开始探索内心</button>
          </div>
        </div>
      )}

      {/* ================= 4. 答题页 (一题一屏) ================= */}
      {view === 'quiz' && QUESTIONS[currentQIndex] && (
        <div className="view-quiz fade-in">
          {/* 顶部进度 */}
          <div className="quiz-top-bar">
            <div className="stage-tag">
              {currentQIndex < 16 ? 'Part 1 现实切片' : currentQIndex < 32 ? 'Part 2 情绪暗涌' : 'Part 3 灵魂图腾'}
            </div>
            <div className="q-num">{currentQIndex + 1} <span className="dim">/ {QUESTIONS.length}</span></div>
          </div>
          <div className="progress-line">
            <div className="fill" style={{width: `${(currentQIndex)/QUESTIONS.length*100}%`}}></div>
          </div>

          {/* 题目卡片 */}
          <div key={fadeKey} className="question-container slide-up">
            <h2 className="q-text">{QUESTIONS[currentQIndex].text}</h2>
            <div className="opts-list">
              {QUESTIONS[currentQIndex].options.map((opt, idx) => (
                <button key={idx} onClick={() => handleAnswer(opt.v)} className="opt-card">
                  <span className="opt-txt">{opt.t}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= 5. 过场/加载 ================= */}
      {(view === 'interstitial' || view === 'loading_verify' || view === 'calculating') && (
        <div className="view-fullscreen flex-center fade-in">
          <div className="loader-ring"></div>
          <p className="status-text" style={{whiteSpace: 'pre-line'}}>
            {view === 'loading_verify' && '正在验证...'}
            {view === 'calculating' && '正在构建情感图谱...'}
            {view === 'interstitial' && interstitialMsg}
          </p>
        </div>
      )}

      {/* ================= 6. 结果页 (重头戏) ================= */}
      {view === 'result' && results && (
        <div className="view-result fade-in-slow">
          <div className="result-wrapper">
            
            {/* A. 首屏概览卡片 */}
            <div className="result-header-card glass-panel" style={{borderColor: RESULTS[results.primary].accent}}>
              <p className="rh-label">你的最强情感欲望是</p>
              <h1 className="rh-title" style={{color: RESULTS[results.primary].accent}}>
                {RESULTS[results.primary].title}
              </h1>
              <p className="rh-quote">“{RESULTS[results.primary].quote}”</p>
              <div className="totem-box">
                 <AbstractTotem id={results.primary} />
              </div>
            </div>

            {/* B. 欲望结构 (主/副对比) */}
            <div className="ratio-card glass-panel">
              <h3 className="section-title">欲望结构分布</h3>
              <div className="ratio-bars">
                <div className="rb-row">
                  <span className="rb-label">主：{RESULTS[results.primary].title}</span>
                  <div className="rb-track">
                    <div className="rb-fill" style={{width: `${results.pScore}%`, background: RESULTS[results.primary].accent}}></div>
                  </div>
                  <span className="rb-val">{results.pScore}%</span>
                </div>
                <div className="rb-row">
                  <span className="rb-label">副：{RESULTS[results.secondary].title}</span>
                  <div className="rb-track">
                    <div className="rb-fill" style={{width: `${results.sScore}%`, background: RESULTS[results.secondary].accent, opacity: 0.7}}></div>
                  </div>
                  <span className="rb-val">{results.sScore}%</span>
                </div>
              </div>
            </div>

            {/* C. 切换卡片 (主/副画像预览) */}
            <div className="dual-card glass-panel">
              <div className="dual-tabs">
                <button 
                  className={`tab ${activeTab === 'primary' ? 'active' : ''}`}
                  onClick={() => setActiveTab('primary')}
                >
                  主欲望
                </button>
                <button 
                  className={`tab ${activeTab === 'secondary' ? 'active' : ''}`}
                  onClick={() => setActiveTab('secondary')}
                >
                  副欲望
                </button>
              </div>
              
              <div className="dual-content fade-in">
                {activeTab === 'primary' ? (
                  <>
                    <h4 className="dc-keyword" style={{color: RESULTS[results.primary].accent}}>
                      {RESULTS[results.primary].keyword}
                    </h4>
                    <p className="dc-desc">{RESULTS[results.primary].sections[0].c.substring(0, 60)}...</p>
                    <div className="dc-hint">↓ 下滑查看完整深度解析</div>
                  </>
                ) : (
                  <>
                    <h4 className="dc-keyword" style={{color: RESULTS[results.secondary].accent}}>
                      {RESULTS[results.secondary].keyword}
                    </h4>
                    <p className="dc-desc">{RESULTS[results.secondary].sections[0].c.substring(0, 60)}...</p>
                    <div className="dc-hint">副欲望在潜意识中影响着你的反应模式</div>
                  </>
                )}
              </div>
            </div>

            {/* D. 详细报告 (可折叠长文) - 只展示主欲望的 */}
            <div className="details-section">
              <h3 className="section-title-center">深度解析报告</h3>
              
              {RESULTS[results.primary].sections.map((sec, idx) => (
                <CollapsibleCard 
                  key={idx}
                  title={sec.t}
                  content={sec.c}
                  accent={RESULTS[results.primary].accent}
                  isSpecial={sec.t.includes('爱你的人')}
                />
              ))}
            </div>

            {/* E. 底部操作 */}
            <div className="footer-actions">
               <button onClick={resetTest} className="btn-text">重新测试</button>
               <p className="brand-mark">柚子的心理小屋 原创内容</p>
            </div>

          </div>
        </div>
      )}

      {/* ================= CSS 样式引擎 ================= */}
      <style jsx global>{`
        :root {
          --bg: #0B0E14;
          --text: #F3F4F6;
          --text-dim: #9CA3AF;
          --glass: rgba(255, 255, 255, 0.05);
          --glass-border: rgba(255, 255, 255, 0.1);
          --primary: #fff;
          --font-main: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          --font-serif: "Times New Roman", serif;
        }

        body {
          background: var(--bg); color: var(--text); font-family: var(--font-main);
          margin: 0; padding: 0; overflow-x: hidden; -webkit-font-smoothing: antialiased;
        }

        /* 动画 */
        .fade-in { animation: fadeIn 0.6s ease-out forwards; }
        .fade-in-slow { animation: fadeIn 1.2s ease-out forwards; }
        .slide-up { animation: slideUp 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity: 0.6; } 50% { opacity: 1; } }

        /* 通用容器 */
        .view-container { min-height: 100vh; padding: 20px; display: flex; align-items: center; justify-content: center; }
        .view-fullscreen { position: fixed; inset: 0; z-index: 99; background: var(--bg); }
        .flex-center { display: flex; flex-direction: column; align-items: center; justify-content: center; }
        
        .glass-panel {
          background: var(--glass); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
          border: 1px solid var(--glass-border); border-radius: 20px;
          padding: 24px; box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        }

        /* 按钮体系 */
        .btn-primary {
          width: 100%; padding: 16px; background: #fff; color: #000; border: none;
          font-size: 16px; font-weight: 600; border-radius: 12px; cursor: pointer;
          transition: opacity 0.2s; margin-top: 20px;
        }
        .btn-primary:active { opacity: 0.8; }
        .btn-text { background: none; border: none; color: var(--text-dim); font-size: 14px; margin-top: 16px; text-decoration: underline; cursor: pointer; }
        .btn-link { background: none; border: none; color: var(--text-dim); font-size: 12px; margin-top: 12px; opacity: 0.6; }

        /* 1. 落地页 */
        .hero-card { text-align: center; max-width: 360px; width: 100%; padding: 40px 24px; }
        .logo-mark { font-size: 12px; letter-spacing: 2px; opacity: 0.6; margin-bottom: 20px; }
        .main-title { font-family: var(--font-serif); font-size: 36px; margin: 0 0 10px; font-weight: 300; }
        .sub-title { font-size: 10px; letter-spacing: 4px; color: var(--text-dim); margin-bottom: 30px; }
        .hero-desc { margin-bottom: 30px; font-size: 14px; line-height: 1.6; opacity: 0.9; }
        .tag { display: inline-block; font-size: 10px; padding: 4px 8px; border: 1px solid var(--glass-border); border-radius: 100px; margin: 0 4px; opacity: 0.7; }
        .access-input { width: 100%; padding: 16px; background: rgba(0,0,0,0.3); border: 1px solid var(--glass-border); color: #fff; text-align: center; font-size: 18px; border-radius: 12px; outline: none; box-sizing: border-box; }
        .err-msg { color: #ef4444; font-size: 12px; margin-top: 12px; text-align: center; }

        /* 3. 说明页 */
        .intro-card { max-width: 360px; width: 100%; }
        .intro-card h3 { text-align: center; font-weight: 400; margin-bottom: 24px; }
        .step-list { display: flex; flex-direction: column; gap: 16px; margin-bottom: 30px; }
        .step-item { display: flex; align-items: center; font-size: 14px; opacity: 0.9; }
        .step-item span { font-size: 10px; border: 1px solid rgba(255,255,255,0.3); padding: 2px 6px; border-radius: 4px; margin-right: 12px; width: 45px; text-align: center; }
        .note { font-size: 12px; text-align: center; opacity: 0.5; line-height: 1.5; }

        /* 4. 答题页 */
        .view-quiz { max-width: 600px; margin: 0 auto; min-height: 100vh; padding: 20px 24px; display: flex; flex-direction: column; }
        .quiz-top-bar { display: flex; justify-content: space-between; align-items: center; margin-top: 10px; margin-bottom: 12px; }
        .stage-tag { font-size: 12px; opacity: 0.5; }
        .q-num { font-family: monospace; font-size: 14px; }
        .progress-line { width: 100%; height: 2px; background: rgba(255,255,255,0.1); border-radius: 2px; margin-bottom: 30px; }
        .progress-line .fill { height: 100%; background: #fff; transition: width 0.3s; }
        
        .q-text { font-size: 20px; line-height: 1.5; font-weight: 400; margin-bottom: 32px; min-height: 60px; }
        .opts-list { display: flex; flex-direction: column; gap: 16px; }
        .opt-card {
          text-align: left; padding: 20px; background: var(--glass);
          border: 1px solid var(--glass-border); color: var(--text);
          cursor: pointer; border-radius: 16px; transition: all 0.2s;
          font-size: 16px; line-height: 1.5;
        }
        .opt-card:active { background: rgba(255,255,255,0.15); transform: scale(0.98); }
        
        .loader-ring { width: 40px; height: 40px; border: 2px solid rgba(255,255,255,0.1); border-top-color: #fff; border-radius: 50%; animation: spin 0.8s linear infinite; margin-bottom: 20px; }
        .status-text { text-align: center; font-size: 14px; opacity: 0.7; line-height: 1.6; }

        /* 6. 结果页 */
        .view-result { padding: 0 16px 60px; min-height: 100vh; overflow-y: auto; }
        .result-wrapper { max-width: 600px; margin: 0 auto; display: flex; flex-direction: column; gap: 16px; padding-top: 20px; }
        
        /* A. 概览 */
        .result-header-card { text-align: center; padding: 40px 20px; border-top: 4px solid #fff; }
        .rh-label { font-size: 12px; opacity: 0.6; letter-spacing: 1px; margin-bottom: 12px; }
        .rh-title { font-family: var(--font-serif); font-size: 32px; margin: 0 0 16px; }
        .rh-quote { font-style: italic; font-size: 14px; opacity: 0.8; margin-bottom: 30px; }
        .totem-box { height: 100px; display: flex; justify-content: center; align-items: center; }

        /* B. 比例条 */
        .ratio-card { padding: 20px; }
        .section-title { font-size: 12px; opacity: 0.5; margin: 0 0 16px; text-transform: uppercase; letter-spacing: 1px; }
        .rb-row { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
        .rb-label { width: 80px; font-size: 12px; opacity: 0.9; }
        .rb-track { flex: 1; height: 8px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden; }
        .rb-fill { height: 100%; border-radius: 4px; }
        .rb-val { width: 30px; font-size: 12px; text-align: right; opacity: 0.6; font-family: monospace; }

        /* C. 双卡片切换 */
        .dual-card { padding: 0; overflow: hidden; }
        .dual-tabs { display: flex; border-bottom: 1px solid var(--glass-border); }
        .tab { flex: 1; padding: 16px; background: none; border: none; color: var(--text-dim); font-size: 14px; cursor: pointer; transition: all 0.3s; }
        .tab.active { color: #fff; background: rgba(255,255,255,0.05); font-weight: 600; }
        .dual-content { padding: 24px; text-align: center; }
        .dc-keyword { font-size: 20px; margin: 0 0 12px; }
        .dc-desc { font-size: 14px; opacity: 0.8; line-height: 1.6; margin-bottom: 20px; min-height: 60px; }
        .dc-hint { font-size: 10px; opacity: 0.4; }

        /* D. 详细报告 */
        .details-section { margin-top: 20px; display: flex; flex-direction: column; gap: 12px; }
        .section-title-center { text-align: center; font-size: 12px; opacity: 0.4; letter-spacing: 2px; margin-bottom: 12px; }
        
        .text-card { position: relative; padding: 20px; transition: all 0.3s; }
        .tc-title { margin: 0 0 12px; font-size: 16px; font-weight: 500; }
        .tc-content-wrapper { max-height: 80px; overflow: hidden; transition: max-height 0.4s ease; position: relative; }
        .tc-content-wrapper.open { max-height: 1000px; }
        .tc-content-wrapper:not(.open)::after {
          content: ''; position: absolute; bottom: 0; left: 0; width: 100%; height: 40px;
          background: linear-gradient(to bottom, transparent, #15181e); /* 模拟渐变遮罩 */
        }
        .tc-content { font-size: 14px; line-height: 1.7; opacity: 0.85; margin: 0; }
        .expand-btn {
          width: 100%; background: none; border: none; border-top: 1px solid var(--glass-border);
          color: var(--text-dim); padding-top: 12px; margin-top: 12px; font-size: 12px; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 4px;
        }
        .arrow { font-size: 8px; transition: transform 0.3s; }
        .arrow.up { transform: rotate(180deg); }

        /* 特殊卡片：给伴侣 */
        .special-card { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.2); }
        .special-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 12px; margin-bottom: 12px; }
        .special-header .tc-title { margin: 0; }
        .copy-hint { font-size: 10px; opacity: 0.5; border: 1px solid rgba(255,255,255,0.3); padding: 2px 6px; border-radius: 4px; }

        /* 底部 */
        .footer-actions { margin-top: 40px; text-align: center; padding-bottom: 40px; }
        .brand-mark { font-size: 10px; opacity: 0.3; margin-top: 20px; letter-spacing: 1px; }

        /* 图腾动画小组件 */
        .totem { width: 80px; height: 80px; position: relative; display: flex; align-items: center; justify-content: center; }
        .t-circle-main { width: 40px; height: 40px; background: #fff; border-radius: 50%; opacity: 0.2; animation: pulse 3s infinite; filter: blur(10px); }
      `}</style>
    </div>
  );
}
