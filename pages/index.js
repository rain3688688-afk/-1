import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Lock, Share2, RefreshCw, Zap, Heart, Shield, Anchor, Wind, Grid, Eye, Sun, Moon, ArrowDown, ChevronRight, BookOpen, Key, Feather, Search } from 'lucide-react';

/**
 * ==========================================
 * 数据源区域
 * ==========================================
 */

// 章节配置
const PARTS_CONFIG = [
  { startIndex: 0, title: "Part 1：现实切片", quote: "“爱不仅仅是誓言，更是下意识的本能。”", desc: "先让我们从生活的琐碎里，捕捉你在亲密关系中那些最真实的条件反射。" },
  { startIndex: 16, title: "Part 2：情绪暗涌", quote: "“日常的表象之下，藏着我们未曾说出口的渴望。”", desc: "现在的你，已经脱去了社交伪装。让我们再往下潜一点，去触碰那些让你感到不安、委屈或满足的瞬间。" },
  { startIndex: 32, title: "Part 3：灵魂图腾", quote: "“语言无法抵达的地方，直觉可以。”", desc: "欢迎来到你内心的最深处。接下来的问题不需要逻辑，仅凭直觉，选出你第一眼看到的那个答案。" }
];

// 完整 48 题库
const QUESTIONS = [
  // --- Part 1 (Q1-Q16) ---
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
  
  // --- Part 2 (Q17-Q32) ---
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

  // --- Part 3 (Q33-Q48) ---
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

// 结果数据
const RESULTS = {
  "确定感": {
    type: "确定感",
    archetype: "风暴中的守夜人",
    icon: <Anchor className="w-8 h-8" />,
    quote: "万物皆流变，而我只要一种绝对的定数。",
    keywords: ["稳定", "契约", "长情"],
    cardStyle: "from-blue-700/40 to-indigo-900/40 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border-white/20",
    accentColor: "text-blue-700",
    tabs: {
      base: `在亲密关系中，你核心的情感诉求是 “稳定与可预期”，始终坚守着对长期联结的极致追求。相较于外在条件的光鲜或浪漫形式的轰轰烈烈，你更看重关系中的确定性—— 凡事有交代、件件有着落、事事有回音，这种清晰、可靠的互动模式，是你构建情感安全感的基石。\n\n你的情感底色厚重且带着强烈的契约精神，对感情的投入从不浅尝辄止，而是带着 “认定即终身” 的郑重。`,
      lightShadow: [
        { label: "稳定的情感支撑力 (光)", text: "你是关系中定海神针般的存在，具备极强的抗风险韧性。不会因短期矛盾或外界波动轻易放弃联结，始终以长期视角对待关系，能为对方提供可依赖的情感锚点。" },
        { label: "纯粹的情感忠诚度 (光)", text: "你的情感投入具有极强的排他性与专注度，拒绝 “骑驴找马”“留退路” 等模糊模式。一旦确立联结，便会毫无保留地全心投入。" },
        { label: "对模糊信号的过度敏感 (影)", text: "难以耐受关系中的信息空白，当对方出现沉默、回避等不确定行为时，易陷入过度解读与自我归因，将中性信号转化为被否定。" },
        { label: "以体谅为名的需求压抑 (影)", text: "因恐惧成为对方的 “负担”，常以 “懂事”“体谅” 为借口，刻意隐藏自身的情感需求与不安。" }
      ],
      partner: [
        "你的追问，从不是找茬，是在求一份安心。当你反复问“爱不爱我”时，别嫌烦——那一刻正被不安包裹。",
        "你的“报备”，是定心丸。不要求秒回，但怕突然失联。",
        "关键时刻，请坚定地偏向。任何犹豫、迟疑，在眼里都会变成“我不重要”的信号。"
      ],
      origins: "深度溯源：你对确定感的极致渴求，本质是焦虑型依恋模式的典型呈现。这种不可预测的养育环境，让你从小就被迫活在 “不确定” 里。你不知道下一次伸手是否会被回应，只能时刻绷紧神经。",
      reshape: "重塑建议：\n1. 练习事实归因：停止对模糊信号的灾难化解读。\n2. 建立爱的韧性认知：相信关系的稳定性不依赖即时回应。\n3. 构建自我价值支撑体系：把情绪重心从对方身上收回。"
    },
    blessing: "愿你在世事浮沉的人间，能遇见一个懂你敏感、护你不安的人。更愿你修炼出一颗稳稳的内心：最坚实的依靠从不是别人的承诺，而是自己给的底气。"
  },
  "被需要": {
    type: "被需要",
    archetype: "以付出为锚的守护者",
    icon: <Heart className="w-8 h-8" />,
    quote: "没有你，我只是一片废墟。",
    keywords: ["付出", "价值", "依赖"],
    cardStyle: "from-orange-600/40 to-red-800/40 shadow-[0_8px_32px_0_rgba(180,83,9,0.37)] border-white/20",
    accentColor: "text-orange-700",
    tabs: {
      base: `在亲密关系里，你最核心的需求是靠被对方依赖来确认自己的价值。对别人来说，爱可能是鲜花、情话和浪漫仪式，但对你而言，爱从来都是实打实的联结 —— 是“我能为你做什么”，是 “我的存在能让你少操心”。\n\n你的情感底色里，藏着一种付出才值得被爱的本能认知。你会本能地盯着对方的生活细节，想成为他生活里离不了的人。`,
      lightShadow: [
        { label: "靠谱的务实支撑力 (光)", text: "你是对方生活里最踏实的后盾，从来不会只说漂亮话。不管有事没事，我都在，能让他真真切切感受到安全感。" },
        { label: "暖心的情感联结力 (光)", text: "你总能通过付出和被依赖，把感情粘得很牢。你特别会察言观色，能捕捉到他没说出口的需求。" },
        { label: "价值感绑在“被需要”上 (影)", text: "你总不自觉把 “他需不需要我” 和 “我重不重要” 绑在一起。要是他暂时能自己处理事情，你就容易胡思乱想。" },
        { label: "过度承担把自己累垮 (影)", text: "因为悄悄担心他累着，也怕他不再需要自己，你会不自觉把好多活都揽过来，哪怕自己已经累得不行。" }
      ],
      partner: [
        "TA 说我来吧，其实是最直接的爱意表达。别随口说不用，在 TA 心里，接受帮助是对 TA 价值的肯定。",
        "主动向 TA 求助，是最珍贵的认可。你不必假装什么都能扛，偶尔说一句搞不定，会让 TA 瞬间感受到被信任。",
        "TA 的过度照顾，背后藏着怕失去你的不安。"
      ],
      origins: "深度溯源：你对被需要的极致渴求，本质是核心关系动机在早期成长中被塑形的结果。你可能记得，小时候只有当自己能帮上忙、会照顾人时，才能获得更多关注和肯定。一句你真懂事，就成了童年里最温暖的回馈。",
      reshape: "重塑建议：\n1. 先学会不付出，也敢安心被爱。你习惯了用自己能做什么来证明重要性，却忘了关系的核心是彼此需要。\n2. 坦然说我也需要被照顾，不用硬撑万能者。\n3. 拓展自我价值的边界，不止于被他人需要。"
    },
    blessing: "愿你遇见这样一个人：他会珍惜你为他做的每一件事，也会主动为你分担疲惫。往后余生，你既能享受 “被需要” 的踏实，也能拥有 “被偏爱” 的笃定。"
  },
  "掌控感": {
    type: "掌控感",
    archetype: "为关系掌舵的同行者",
    icon: <Zap className="w-8 h-8" />,
    quote: "我抛开了所有理智，只求你结束我的痛苦。",
    keywords: ["协同", "规划", "兜底"],
    cardStyle: "from-rose-700/40 to-red-900/40 shadow-[0_8px_32px_0_rgba(225,29,72,0.37)] border-white/20",
    accentColor: "text-rose-700",
    tabs: {
      base: `在亲密关系里，你最核心的需求从不是控制对方，而是关系的可预期、可沟通、可协同。亲密更像两人共掌舵的船，得提前校准航向、明确规则、同步节奏，你才能放下顾虑，放心交付自己。\n\n你对关系章法的执念，藏着对无序失控的恐惧。模糊的界限、反复的态度、没说清的期待，在你眼里都是隐患。`,
      lightShadow: [
        { label: "清晰的关系梳理力 (光)", text: "你总能一眼看穿矛盾的关键，不会让误会越积越深。不管是彼此的界限划分、相处节奏的调整，你都擅长把模糊的事说清楚。" },
        { label: "务实的问题突破力 (光)", text: "面对关系里的卡点，你从不会拖着或逃避。你行动力强，更愿意主动想办法、做调整，而不是任由问题发酵。" },
        { label: "对无序的极致焦虑 (影)", text: "一旦关系脱离预设的轨道 —— 比如对方做事没计划、总回避深入沟通，你会比常人更容易陷入慌乱，觉得整段关系都在摇晃。" },
        { label: "理性掩盖下的情绪忽视 (影)", text: "你太擅长用逻辑分析问题、解决矛盾，以至于自己的委屈、疲惫、失落常常被忽略。你习惯了先处理事情，再照顾情绪。" }
      ],
      partner: [
        "TA 不是想控制你，而是怕关系乱了阵脚。当 TA 主动说想聊聊，只是想和你一起把关系捋顺。",
        "TA 要的是一起扛的合作感，不是单方面的听话。你可以有自己的想法和节奏，但请坦诚说出来。",
        "你可以温柔地告诉 TA，先不着急解决问题，就单纯陪一陪。"
      ],
      origins: "深度溯源：你对掌控感的执念，从来不是天生爱操心，而是小时候在无序的环境里，慢慢被逼出来的一种生存本能。那种看着一切脱离轨道、没人托底的无力感，实在太让人害怕了。",
      reshape: "重塑建议：\n1. 接纳适度失控，关系不必事事精准。偶尔偏离预期不是出错，是弹性。\n2. 放下全能责任，学会把担子分出去。\n3. 允许自己不懂事，暴露脆弱从来不是软弱。"
    },
    blessing: "愿你遇见一个能和你并肩扛事、一起决策的人，不用再让你独自做那个 “负责全局的大人”。往后余生，既有掌舵的底气，也有被照顾的福气。"
  },
  "被偏爱": {
    type: "被偏爱",
    archetype: "渴求例外的驯养者",
    icon: <Sparkles className="w-8 h-8" />,
    quote: "你要永远为你驯服的东西负责。",
    keywords: ["例外", "专注", "独特"],
    cardStyle: "from-pink-600/40 to-fuchsia-800/40 shadow-[0_8px_32px_0_rgba(219,39,119,0.37)] border-white/20",
    accentColor: "text-pink-600",
    tabs: {
      base: `你愿意毫无保留地付出，也能带着真心耐心经营，但这份投入有个隐形前提 —— 你的爱意需要被 “特殊对待” 来回应。如果有一天，你发现他的温柔开始平均分配，对别人的在意不比对你少，对你的倾斜慢慢消失，你的情绪会瞬间绷紧。\n\n这不是嫉妒，也不是小气，是你赖以生存的 “例外感” 被稀释了。`,
      lightShadow: [
        { label: "深情且坚定的专注度 (光)", text: "一旦认定一个人，你会全身心投入，给出稳定又纯粹的爱意回馈。你的爱不是泛泛的好，而是带着 “只对你” 的专属感。" },
        { label: "细腻入微的洞察力 (光)", text: "你能捕捉到别人忽略的细节 —— 记得他随口提的喜好、察觉他没说出口的情绪。这种 “被真正看见” 的体贴，让关系充满温度。" },
        { label: "对差别对待的极致敏感 (影)", text: "对方对别人多一份耐心、多一句关心、多一次迁就，你心里的天平就会悄悄倾斜。不是小气，是怕自己的 “特别” 被稀释。" },
        { label: "陷入过度求证的内耗 (影)", text: "你会忍不住反复琢磨他的言行，哪怕是一句随口的话，都要从中寻找 “他到底有没有更在乎我” 的答案，越想越焦虑。" }
      ],
      partner: [
        "TA 要的从不是更多，而是独一份。不用送昂贵的礼物，但若你记得她随口提的喜好，或是在众人面前下意识护着她，才是最让她安心的偏爱。",
        "别用“你想太多”否定她的敏感。先抱抱她，比讲道理管用得多。",
        "主动表达偏爱是刚需，不是加分项。"
      ],
      origins: "深度溯源：你对偏爱的执着，并非贪心或矫情，而是核心情感欲望在早期成长中被反复强化的结果 —— 这份对独一份的渴求，往往源于那些自己的在意没被优先回应的成长时刻。",
      reshape: "重塑建议：\n1. 接纳敏感，它不是缺点。\n2. 自己先给足自己独一份的宠爱。别总等着别人来证明你的特别，你可以先主动偏爱自己。\n3. 学会直白表达需求，不用猜来猜去。"
    },
    blessing: "愿你遇见明目张胆的偏爱，有人把你放在心尖上，让你清清楚楚感受到，自己就是那个不可替代的例外。往后余生，被爱眷顾，更被自己偏爱。"
  },
  "精神共鸣": {
    type: "精神共鸣",
    archetype: "灵魂旷野的寻觅者",
    icon: <Eye className="w-8 h-8" />,
    quote: "我们相遇在精神的旷野，无需言语便已相通。",
    keywords: ["懂得", "同频", "深层"],
    cardStyle: "from-purple-600/40 to-violet-900/40 shadow-[0_8px_32px_0_rgba(147,51,234,0.37)] border-white/20",
    accentColor: "text-purple-700",
    tabs: {
      base: `在亲密关系里，你最核心的需求从不是占有或依赖，甚至不是流于表面的陪伴，而是一种灵魂层面的同频共振 —— 思想被看见、观点被呼应、内心深处的褶皱被温柔抚平。\n\n日常寒暄的温暖固然是关系的养分，却永远替代不了 “你一句话戳中我未说出口的心事” 的心灵碰撞。你对浅层关系有着近乎本能的疏离感，没有精神交流的亲密，对你来说像一个缺了核心的空壳。`,
      lightShadow: [
        { label: "思想共振的活力感 (光)", text: "你带对方的不只是爱情，更是共同成长的可能 —— 一起拓宽认知边界、探索世界，让关系始终保持向上的生命力。" },
        { label: "深层共情的理解力 (光)", text: "你懂得 “倾听” 的真正意义，不只是听表面的话，更能读懂背后的想法与情绪，让对方真切感受到 “被完全懂了” 的安心。" },
        { label: "浅层关系的低耐受度 (影)", text: "如果一段关系长期只停留在 “吃了没”“在干嘛” 的琐事寒暄，没有深入的思想交流，你会慢慢失去存在感，想要抽离。" },
        { label: "将“不理解”等同于“不在意” (影)", text: "对方未必不爱你，只是没能跟上你的思维深度，但这种 “聊不到一块” 的距离，在你心里会被放大成 “你不懂我，也不在乎我”。" }
      ],
      partner: [
        "TA 要的不只是日常报备，更是心里的真实回响。如果长期只停留在表面寒暄，TA 会慢慢觉得自己的灵魂没被接住。",
        "当 TA 和你聊起那些“无用”的话题，是悄悄递来靠近的信号。",
        "你不用懂多少深奥理论，但请别关闭对内心和世界的探索欲。"
      ],
      origins: "深度溯源：你对精神共鸣的执着，从不是 “太复杂” 的矫情，而是核心关系动机在童年被悄悄塑形的结果。小时候的你，或许总比同龄人多想一层，你试着把这些想法说出口，却很少被真正倾听。",
      reshape: "重塑建议：\n1. 接纳你的深度需求，它从不是缺点。\n2. 不把所有期待，都压在一个人身上。让不同的关系承接你不同层次的需求。\n3. 学会在普通日子里，发现藏着的连接。"
    },
    blessing: "愿你这一生，既能遇见共享柴米油盐的人，也能遇见共赴精神旷野的伙伴。也愿你在无人完全懂你的时刻，依然坚信：你的思考、你的独特，本身就是最珍贵的礼物。"
  },
  "自由感": {
    type: "自由感",
    archetype: "守望星空的风之子",
    icon: <Wind className="w-8 h-8" />,
    quote: "我爱你，却不愿用爱束缚你。",
    keywords: ["空间", "自在", "边界"],
    cardStyle: "from-sky-500/40 to-blue-700/40 shadow-[0_8px_32px_0_rgba(14,165,233,0.37)] border-white/20",
    accentColor: "text-sky-600",
    tabs: {
      base: `在亲密关系里，你最核心的需求从不是占有或依赖，而是 “在爱里守住自我” 的自由 —— 靠近不难，难的是不用时刻黏在一起、不用事事报备、不用为了迎合对方丢掉自己的节奏。\n\n你愿意真心投入，也喜欢分享生活里的喜怒哀乐，但必须保留一块完全属于自己的空间。只要这份空间被尊重，你的爱就会自然流淌；可一旦被过度关注、被实时追问、被情绪绑架，你的本能反应就是退一步。`,
      lightShadow: [
        { label: "让人舒展的松弛感 (光)", text: "你从不会要求对方 “秒回消息”“事事报备”，也不会干涉他的社交圈、兴趣爱好，让对方觉得和你在一起不用紧绷，能安心做自己。" },
        { label: "清晰坚定的边界感 (光)", text: "你懂得尊重自己的空间，也从不越界干涉别人的选择，不会用 “爱” 为名绑架对方的生活，这种分寸感让关系始终保持舒展。" },
        { label: "对“过度靠近”的本能抗拒 (影)", text: "只要对方表现出过度依赖、频繁追问、或是试图掌控你的节奏，哪怕没有恶意，你也会下意识想后退，容易让对方误以为你 “不够爱”。" },
        { label: "习惯“独自消化”的封闭性 (影)", text: "你太擅长自己处理情绪和问题，常常忘了对方也希望参与你的世界 —— 哪怕只是听你吐槽、陪你分担，你也会下意识说 “没事”。" }
      ],
      partner: [
        "我需要独处，从不是不爱你，而是只有把自己的情绪和节奏整理好，才能更好地爱你。",
        "别用时刻在线检验我的爱。秒回消息、频繁报备、每天黏在一起，这些从来都不是我爱你的证明。",
        "当我主动告诉你我的安排，其实是在把你放进我的生活节奏里。"
      ],
      origins: "深度溯源：你对自由感的执着，从来不是 “不爱黏人” 的天性，而是早年成长体验刻进心底的本能渴望 —— 那些 “不能按自己的想法来、只能听话” 的压抑时刻，早就在心里埋下了对 “自我空间” 的极度珍视。",
      reshape: "重塑建议：\n1. 接纳你的边界需求，它从不是冷漠。\n2. 温柔划定边界，不用刻意推开别人。主动说清自己的节奏。\n3. 试着适度敞开，不用一直独自硬扛。"
    },
    blessing: "愿你始终保有做自己的勇气和节奏，不用为了爱妥协，不用为了自由假装冷漠。往后余生，你既是自由的风，也能拥有安稳的岸，在爱里自在呼吸，在自我里闪闪发光。"
  },
  "安全距离": {
    type: "安全距离",
    archetype: "迷雾中的试探者",
    icon: <Shield className="w-8 h-8" />,
    quote: "待人如执烛，太近灼手，太远暗生。",
    keywords: ["审慎", "慢热", "保护"],
    cardStyle: "from-teal-600/40 to-emerald-800/40 shadow-[0_8px_32px_0_rgba(13,148,136,0.37)] border-white/20",
    accentColor: "text-teal-700",
    tabs: {
      base: `在亲密关系里，你最核心的需求从不是轰轰烈烈的奔赴，而是 “安全第一” 的踏实靠近 —— 你从不是冷淡，也不是慢热，只是心里自带一层 “安全缓冲带”，像洗手前慢慢试探水温，先确认没有刺痛，才敢再往前挪一步。\n\n你的亲密节奏里藏着独有的审慎：先悄悄观察、反复确认，直到笃定 “这个人值得托付”，才敢真正卸下防备。任何猛扑过来的热情、急着拉你进入深度关系、逼你立刻敞开心扉，都会让你下意识启动自我保护。`,
      lightShadow: [
        { label: "慎重长情的定心丸 (光)", text: "不轻易开启关系，一旦选择便全心投入、坚定不摇，从不会敷衍应付，是关系里最让人安心的 “定海神针”。" },
        { label: "亲疏有度的平衡感 (光)", text: "既不会黏腻到让人窒息，也不会疏远到让人不安，总能精准拿捏 “刚刚好” 的距离，让彼此在亲密中保留独立，在独立中感知联结。" },
        { label: "节奏错位的孤独感 (影)", text: "你的 “慢试探” 总与他人的 “快节奏” 错位，不是不愿靠近，而是很少有人能读懂你 “需要时间确认” 的谨慎。" },
        { label: "被催后的防御性退缩 (影)", text: "只要对方急于推进关系、用力催促，哪怕没有恶意，你也会下意识后退自保。可对方往往把这份退缩当成 “没兴趣”，让关系越走越远。" }
      ],
      partner: [
        "我的慢，从来不是没感觉，是怕真心错付才不敢太快。如果你催得太急、推得太猛，只会触发我的自我保护。",
        "我很难在带着情绪的氛围里说心里话。如果你能先放下评判，不着急反驳，我反而会慢慢卸下防备。",
        "一直都靠谱的踏实感，比一次性的盛大更重要。"
      ],
      origins: "深度溯源：你对安全距离的执着，从来不是 “高冷”，而是早年成长里，一次次 “靠近 = 受伤” 的经历，悄悄在心里种下了一颗 “怕疼” 的种子。与其冒着疼的风险靠近，不如先站在不远处观望。",
      reshape: "重塑建议：\n1. 接纳自己的节奏，不用自责太冷。\n2. 试着小步敞开心扉，不用一步到位。一点点打开自己，既不会让你感到压力，也能让对方慢慢读懂你的心意。\n3. 直白说出你的需要，不用让对方猜。"
    },
    blessing: "愿你遇见这样一个人：不催你交卷，不逼你前行，愿意陪着你慢慢来。也愿你有一天，能在真正安全的关系里，轻轻告诉自己：这次，我可以试着比从前再靠近那么一点点。"
  },
  "秩序感": {
    type: "秩序感",
    archetype: "构建未来的建筑师",
    icon: <Grid className="w-8 h-8" />,
    quote: "好的关系，是一起把日子过成有章法的温柔。",
    keywords: ["规则", "清晰", "共建"],
    cardStyle: "from-slate-600/40 to-zinc-800/40 shadow-[0_8px_32px_0_rgba(71,85,105,0.37)] border-white/20",
    accentColor: "text-slate-700",
    tabs: {
      base: `在亲密关系里，你是主动和对方搭建关系框架的共建者，核心需求从不是模糊的浪漫悸动，而是两人共同打磨的秩序感 —— 清晰的边界不越界，明确的期待不猜度，可落地的沟通不内耗，这些才是你敢放心交付真心的底气。\n\n你打心底不信随缘式相处能走得远，认定长期关系的根基必须扎在坦诚沟通、明确共识的土壤里。这不是理性过度的较真，而是怕够了混乱带来的消耗。`,
      lightShadow: [
        { label: "化繁为简的秩序力 (光)", text: "擅长把混乱的相处捋顺，将模糊的边界、零散的期待转化为清晰共识，为关系避开无效内耗，少走很多弯路。" },
        { label: "主动破局的沟通力 (光)", text: "遇事从不会逃避冷战，反而主动牵头沟通，愿意和对方一起拆解问题、寻找答案，不把矛盾留到隔夜。" },
        { label: "对模糊状态零容忍 (影)", text: "只要对方态度暧昧、回避沟通，或是用顺其自然敷衍，心里就会立刻陷入焦虑，难以踏实下来。" },
        { label: "急于解决却忽略情绪缓冲 (影)", text: "习惯遇事立刻推进解决，却忘了亲密关系需要情绪消化的空间，有时候对方要的是安慰，而非马上被梳理成条理。" }
      ],
      partner: [
        "对我来说，坦诚本身就是最踏实的爱。我不是故意较真，也不想控制什么，只是想和你一起少些不必要的内耗。",
        "长时间的模糊状态，会慢慢耗光我对关系的安全感。",
        "当我提议我们坐下来好好聊聊，请一定认真对待。我不是要审判谁，只是想重新对齐彼此的节奏和边界。"
      ],
      origins: "深度溯源：小时候的你，最怕没个准数的慌。这份秩序感，从来不是死板的坚持，而是你捂热不安的温柔方式 —— 用清晰的规则挡住突如其来的乱，用可控的流程抵消不知道怎么办的慌。",
      reshape: "重塑建议：\n1. 接纳自己的秩序需求，它从不是过度理性。\n2. 分清问题和情绪，给彼此缓冲空间。先问问自己：对方现在需要的是具体方案，还是只想被理解？\n3. 允许关系有暂时没答案的空白，但不接受逃避。"
    },
    blessing: "愿你遇见这样的同行者：不回避问题，不敷衍沟通，愿意和你一起把话说透、把日子捋顺。让秩序不再是负担，而是彼此安心的底气。"
  }
};

/**
 * ==========================================
 * 主组件逻辑
 * ==========================================
 */
export default function SoulScan_StainedGlass() {
  const [step, setStep] = useState('landing');
  const [showInput, setShowInput] = useState(false);
  const [code, setCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [scores, setScores] = useState({});
  const [results, setResults] = useState({ primary: null, secondary: null });
  const [currentPart, setCurrentPart] = useState(null);
  
  const [flippedCards, setFlippedCards] = useState({ primary: false, secondary: false });
  const [viewingResult, setViewingResult] = useState('primary'); 
  const [activeTab, setActiveTab] = useState('base');

  // --- 1. 登录交互 ---
  const handleVerify = () => {
    setErrorMsg('');
    if (!code.trim()) {
      setErrorMsg('请输入兑换码，不能为空');
      return;
    }
    
    // 模拟验证
    setIsLoading(true);
    setTimeout(() => {
      // 模拟简单校验：如果输入 "error" 则报错
      if (code.trim().toLowerCase() === 'error') {
        setErrorMsg('该兑换码无效或已被使用，请检查');
        setIsLoading(false);
        return;
      }
      
      setIsLoading(false);
      handlePartTransition(0);
    }, 1200);
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

  // --- 2. 答题 ---
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

  // --- 3. 结算 ---
  const finishQuiz = (finalScores) => {
    setStep('analyzing');
    const sortedScores = Object.entries(finalScores).sort((a, b) => b[1] - a[1]);
    const primaryKey = sortedScores[0][0];
    const secondaryKey = sortedScores.length > 1 ? sortedScores[1][0] : primaryKey;

    setTimeout(() => {
      setResults({ primary: primaryKey, secondary: secondaryKey });
      setStep('result');
    }, 2500);
  };

  // 渲染相关辅助
  const progress = ((currentQIndex + 1) / QUESTIONS.length) * 100;
  const displayResultKey = viewingResult === 'primary' ? results.primary : results.secondary;
  const displayData = RESULTS[displayResultKey];

  return (
    <div className="min-h-screen bg-[#FDFBF9] text-[#4A4A4A] font-sans selection:bg-rose-100 flex flex-col overflow-x-hidden">
      
      {/* 顶部栏 */}
      {step !== 'landing' && step !== 'partIntro' && (
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

      {/* --- Landing Page 落地页 --- */}
      {step === 'landing' && (
        <div className="flex-1 flex flex-col relative overflow-hidden">
          {/* 背景装饰 */}
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

      {/* --- Result --- */}
      {step === 'result' && (
        <div className="flex-1 flex flex-col animate-fade-in pt-24 px-6 pb-20 max-w-md mx-auto w-full">
          
          <p className="text-center text-[10px] text-stone-400 mb-8 tracking-[0.2em] uppercase">Tap Card to Reveal</p>

          <div className="space-y-8 mb-12">
            
            {/* 1. 主卡片 */}
            <div 
              className="relative w-full aspect-[4/5] perspective-1000 cursor-pointer group"
              onClick={() => {
                setFlippedCards(prev => ({...prev, primary: true}));
                setViewingResult('primary');
                setActiveTab('base');
              }}
            >
              <div className={`relative w-full h-full duration-1000 transform-style-3d transition-transform ${flippedCards.primary ? 'rotate-y-180' : ''}`}>
                
                {/* Back */}
                <div className={`absolute inset-0 backface-hidden bg-stone-900 rounded-[2rem] shadow-2xl border-[1px] border-white/10 flex flex-col items-center justify-center ${viewingResult === 'primary' && flippedCards.primary ? 'ring-2 ring-rose-200/50 ring-offset-2 ring-offset-[#FDFBF9]' : ''}`}>
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />
                  <Sun className="w-12 h-12 text-rose-200/80 mb-4 animate-pulse" />
                  <h3 className="text-rose-100/90 text-sm font-serif tracking-widest">主导欲望</h3>
                  <p className="text-white/30 text-[10px] mt-2 uppercase tracking-[0.2em]">Core Desire</p>
                </div>

                {/* Front (Stained Glass Effect) */}
                <div className={`absolute inset-0 backface-hidden rotate-y-180 rounded-[2rem] overflow-hidden flex flex-col justify-between text-white p-6 
                  bg-gradient-to-br ${RESULTS[results.primary].cardStyle} backdrop-blur-xl border border-white/30`}>
                  
                  {/* Glass Highlights */}
                  <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/30 rounded-full blur-3xl" />

                  <div className="relative z-10 flex justify-between items-start">
                    <span className="text-[10px] border border-white/40 px-2 py-0.5 rounded backdrop-blur-md bg-white/10">CORE</span>
                    <Sun className="w-4 h-4 text-white/90" />
                  </div>
                  
                  <div className="relative z-10 text-center mt-4">
                     <div className="w-16 h-16 mx-auto mb-4 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 shadow-inner">
                        {RESULTS[results.primary].icon}
                     </div>
                     <h2 className="text-3xl font-serif font-bold mb-1 drop-shadow-md">{results.primary}</h2>
                     <p className="text-xs font-light opacity-90 tracking-wide">{RESULTS[results.primary].archetype}</p>
                  </div>
                  
                  <div className="relative z-10 mt-auto">
                    <div className="bg-black/20 backdrop-blur-md p-3 rounded-xl border border-white/10">
                      <p className="text-xs italic font-serif leading-relaxed text-center opacity-95">
                        “{RESULTS[results.primary].quote}”
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. 副卡片 */}
            <div 
              className="relative w-full aspect-[4/2] perspective-1000 cursor-pointer group"
              onClick={() => {
                setFlippedCards(prev => ({...prev, secondary: true}));
                setViewingResult('secondary');
                setActiveTab('base');
              }}
            >
              <div className={`relative w-full h-full duration-1000 transform-style-3d transition-transform ${flippedCards.secondary ? 'rotate-y-180' : ''}`}>
                
                {/* Back */}
                <div className={`absolute inset-0 backface-hidden bg-stone-800 rounded-[2rem] shadow-xl border-[1px] border-white/5 flex flex-col items-center justify-center ${viewingResult === 'secondary' && flippedCards.secondary ? 'ring-2 ring-rose-200/50 ring-offset-2 ring-offset-[#FDFBF9]' : ''}`}>
                  <Moon className="w-8 h-8 text-purple-200/70 mb-2" />
                  <h3 className="text-purple-100/80 text-xs font-serif tracking-widest">潜意识欲望</h3>
                </div>

                {/* Front (Stained Glass) */}
                <div className={`absolute inset-0 backface-hidden rotate-y-180 rounded-[2rem] overflow-hidden flex items-center justify-between text-white p-6
                  bg-gradient-to-br ${RESULTS[results.secondary].cardStyle} backdrop-blur-xl border border-white/30`}>
                    
                    <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                    
                    <div className="relative z-10 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] border border-white/40 px-1.5 rounded bg-white/10 backdrop-blur-md">SUB</span>
                        <h2 className="text-xl font-serif font-bold drop-shadow-sm">{results.secondary}</h2>
                      </div>
                      <p className="text-[10px] opacity-90 mb-2 font-light">{RESULTS[results.secondary].archetype}</p>
                    </div>
                    
                    <div className="relative z-10 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 shadow-inner ml-4">
                       {RESULTS[results.secondary].icon}
                    </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. 详情区 (Tabs) */}
          {(flippedCards.primary || flippedCards.secondary) && displayData && (
            <div className="w-full animate-slide-up-delayed scroll-mt-24 mb-16" id="details-section">
              
              <div className="flex items-center justify-between mb-4 px-1">
                <h3 className={`font-serif font-bold text-base flex items-center gap-2 ${displayData.accentColor}`}>
                  {viewingResult === 'primary' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  {viewingResult === 'primary' ? '主导欲望解析' : '潜意识欲望解析'}
                </h3>
              </div>

              {/* Tab Nav */}
              <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar mb-1 px-1">
                {[
                  { id: 'base', label: '底色' },
                  { id: 'lightShadow', label: '光影' },
                  { id: 'partner', label: '致伴侣' },
                  { id: 'origins', label: '溯源' },
                  { id: 'reshape', label: '重塑' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all duration-300 ${
                      activeTab === tab.id 
                      ? 'bg-stone-800 text-white shadow-md' 
                      : 'bg-white text-stone-400 border border-stone-100'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Content Box */}
              <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-stone-200/50 border border-stone-50 min-h-[260px] relative overflow-hidden transition-all duration-500">
                <div className="absolute top-0 left-0 w-full h-1 bg-stone-100" />
                
                {activeTab === 'base' && (
                  <div className="animate-fade-in">
                    <h4 className="font-bold text-xs mb-3 text-stone-800 flex items-center gap-2 uppercase tracking-wider">
                       <BookOpen className="w-3 h-3" /> 亲密底色
                    </h4>
                    <p className="text-sm text-stone-600 leading-7 text-justify whitespace-pre-line">
                      {displayData.tabs.base}
                    </p>
                  </div>
                )}

                {activeTab === 'lightShadow' && (
                  <div className="animate-fade-in space-y-4">
                    {displayData.tabs.lightShadow.map((item, idx) => (
                      <div key={idx} className="bg-stone-50/80 p-4 rounded-xl border border-stone-100/50">
                        <h4 className={`text-xs font-bold mb-1.5 flex items-center gap-2 ${item.label.includes('(光)') ? 'text-amber-600' : 'text-slate-600'}`}>
                          {item.label.includes('(光)') ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
                          {item.label.split(' ')[0]}
                        </h4>
                        <p className="text-xs text-stone-600 leading-relaxed">{item.text}</p>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'partner' && (
                  <div className="animate-fade-in space-y-3">
                    <div className="flex items-center gap-2 mb-4 text-rose-500 font-bold text-xs bg-rose-50 w-fit px-3 py-1 rounded-full border border-rose-100">
                      <Share2 className="w-3 h-3" />
                      <span>转发给 TA，减少 80% 误会</span>
                    </div>
                    {displayData.tabs.partner.map((line, idx) => (
                      <div key={idx} className="flex gap-3 text-sm text-stone-600 bg-stone-50 p-4 rounded-xl border border-stone-100">
                        <span className={`font-serif italic text-lg ${displayData.accentColor}`}>{idx + 1}.</span>
                        <span className="leading-relaxed pt-0.5">{line}</span>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'origins' && (
                  <div className="animate-fade-in">
                    <h4 className="font-bold text-xs mb-3 text-stone-800 flex items-center gap-2 uppercase tracking-wider">
                       <Search className="w-3 h-3" /> 童年溯源
                    </h4>
                    <div className="text-sm text-stone-600 leading-7 bg-stone-50/50 p-5 rounded-xl border border-stone-100 text-justify">
                      {displayData.tabs.origins}
                    </div>
                  </div>
                )}

                {activeTab === 'reshape' && (
                  <div className="animate-fade-in">
                     <h4 className="font-bold text-xs mb-3 text-stone-800 flex items-center gap-2 uppercase tracking-wider">
                       <Zap className="w-3 h-3 text-emerald-500" /> 能量重塑
                    </h4>
                    <div className="text-sm text-stone-600 leading-7 bg-emerald-50/30 p-5 rounded-xl border border-emerald-50 text-justify whitespace-pre-line">
                      {displayData.tabs.reshape}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 4. 祝福 (卡片外，底部) */}
          {(flippedCards.primary || flippedCards.secondary) && displayData && (
             <div className="mt-8 mb-12 text-center animate-fade-in px-4">
               <Feather className="w-5 h-5 text-rose-300 mx-auto mb-4 opacity-80" />
               <p className="font-serif italic text-stone-600 text-sm leading-8">
                 {displayData.blessing}
               </p>
               <div className="w-8 h-[1px] bg-stone-200 mx-auto mt-6"></div>
             </div>
          )}

          {/* 5. 底部操作栏 */}
          {(flippedCards.primary || flippedCards.secondary) && (
             <div className="flex gap-3 pb-4">
                <button 
                  onClick={() => window.location.reload()}
                  className="flex-1 py-3.5 bg-white border border-stone-200 rounded-xl text-stone-500 text-sm font-bold flex items-center justify-center gap-2 hover:bg-stone-50 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  再测一次
                </button>
             </div>
          )}

        </div>
      )}

      {/* --- Footer (Unified) --- */}
      <footer className="py-6 text-center text-[10px] text-stone-300 tracking-widest uppercase border-t border-stone-100 mt-auto bg-white/50 backdrop-blur-sm">
        柚子的心理小屋 原创（小红书同名）
      </footer>

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
        .animate-slide-up { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-slide-up-delayed { animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards; opacity: 0; }
        .animate-fade-in { animation: slideUp 0.8s ease-out forwards; }
      `}</style>
    </div>
  );
}
