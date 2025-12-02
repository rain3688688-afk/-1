import React, { useMemo, useState } from "react";
import {
  Sparkles,
  Lock,
  Share2,
  RefreshCw,
  Zap,
  Heart,
  Shield,
  Anchor,
  Wind,
  Grid,
  Eye,
  Sun,
  Moon,
  ChevronRight,
  BookOpen,
  Key,
  Feather,
  Search,
} from "lucide-react";

/**
 * ==========================================
 * 数据源配置：已按新结构拆分结果内容
 * ==========================================
 */

const PARTS_CONFIG = [
  {
    startIndex: 0,
    title: "Part 1：现实切片",
    quote: "“爱不仅仅是誓言，更是下意识的本能。”",
    desc: "先让我们从生活的琐碎里，捕捉你在亲密关系中那些最真实的条件反射。",
  },
  {
    startIndex: 16,
    title: "Part 2：情绪暗涌",
    quote: "“日常的表象之下，藏着我们未曾说出口的渴望。”",
    desc: "现在的你，已经脱去了社交伪装。让我们再往下潜一点，去触碰那些让你感到不安、委屈或满足的瞬间。",
  },
  {
    startIndex: 32,
    title: "Part 3：灵魂图腾",
    quote: "“语言无法抵达的地方，直觉可以。”",
    desc: "欢迎来到你内心的最深处。接下来的问题不需要逻辑，仅凭直觉，选出你第一眼看到的那个答案。",
  },
];

const QUESTIONS = [
  {
    id: 1,
    question: "周末下午，伴侣突然失联了3个小时，发消息也没回。那一刻，你最真实的反应是？",
    options: [
      { text: "下意识翻聊天记录，看是不是我说错话了？", type: "确定感" },
      { text: "挺好的，刚好没人管我，专心做自己的事。", type: "自由感" },
      { text: "推测原因，准备联系上后问清楚去向。", type: "掌控感" },
      { text: "心里堵得慌。如果他够在意我，怎么舍得让我空等？", type: "被偏爱" },
    ],
  },
  {
    id: 2,
    question: "伴侣最近工作压力极大，回家情绪低落一言不发。此时你心里的念头是？",
    options: [
      { text: "看着心疼。倒杯水、切水果，让他知道有人照顾。", type: "被需要" },
      { text: "他应该很烦。那我就识趣点躲远点，等他缓过来。", type: "安全距离" },
      { text: "死气沉沉的沉默很难受。希望能聊聊。", type: "精神共鸣" },
      { text: "在意接下来的安排：今晚怎么吃？计划还作数吗？", type: "秩序感" },
    ],
  },
  {
    id: 3,
    question: "因为一件琐事发生了激烈的争吵，甚至有些冷场。你心里那个过不去的点主要是？",
    options: [
      { text: "态度冷冰冰。那种随时要放弃我的感觉最让我害怕。", type: "确定感" },
      { text: "没复盘。到底谁对谁错，以后按谁的来？", type: "秩序感" },
      { text: "心软了。看他气得脸色发白，输赢不重要，想哄哄他。", type: "被需要" },
      { text: "无法沟通。不立刻解决问题翻篇，我就没法安心做事。", type: "掌控感" },
    ],
  },
  {
    id: 4,
    question: "你冷不丁冒出一个有点奇怪的脑洞，随口讲给伴侣听。此时你最期待的反应是？",
    options: [
      { text: "哪怕听不懂，只要愿意放下手机认真听我说完，我就满足。", type: "被偏爱" },
      { text: "瞬间接住梗，还能延伸出新观点。那一刻觉得“只有你懂我”。", type: "精神共鸣" },
      { text: "我说我的，你听你的，不必强行同步。", type: "自由感" },
      { text: "只敢说一半。怕说出来对方接不住，反而尴尬。", type: "安全距离" },
    ],
  },
  {
    id: 5,
    question: "伴侣想看你的手机，或者询问你过去的详细情感经历。你的本能反应是？",
    options: [
      { text: "哪怕没秘密也反感。这是隐私，被审视的感觉很不舒服。", type: "自由感" },
      { text: "随便看。如果你看了能更安心，那我求之不得。", type: "确定感" },
      { text: "看可以，但要公平。如果我也能看你的，那就没问题。", type: "秩序感" },
      { text: "看可以，但不想被误解。不希望你片面定义现在的我。", type: "精神共鸣" },
    ],
  },
  {
    id: 6,
    question: "伴侣偶尔有些迷糊，犯了个不大不小的错。你下意识的第一反应通常是？",
    options: [
      { text: "下意识去兜底。直接上手帮他善后。", type: "被需要" },
      { text: "觉得被忽视了。你是不是没把我的事放心上？", type: "被偏爱" },
      { text: "复盘原因。想知道哪个环节出了问题，确保下次不再发生。", type: "掌控感" },
      { text: "无所谓。谁还没个犯错的时候，大家都轻松点最好。", type: "安全距离" },
    ],
  },
  {
    id: 7,
    question: "谈到“未来”这个话题时，什么情况最让你感到不安？",
    options: [
      { text: "没有计划，说“顺其自然”。这种没规划的日子让我没底。", type: "秩序感" },
      { text: "态度不坚定。表现出一丝犹豫，我就怀疑他没打算长久。", type: "确定感" },
      { text: "想到未来几十年都要和一个人绑死，我就本能地想逃。", type: "自由感" },
      { text: "怕未来各过各的。变成两个合租的陌生人。", type: "被需要" },
    ],
  },
  {
    id: 8,
    question: "当你自己情绪崩溃、非常脆弱的时候，你最希望对方做什么？",
    options: [
      { text: "别问“怎么了”。当没看见，让我躲一会儿。", type: "安全距离" },
      { text: "只要抱着我，让我感觉“这一刻你也一样难过”。", type: "精神共鸣" },
      { text: "帮我分析烂摊子怎么收场，解决那个搞崩我的问题。", type: "掌控感" },
      { text: "就算我无理取闹，也请站在我这边。我只需要偏袒。", type: "被偏爱" },
    ],
  },
  {
    id: 9,
    question: "到了纪念日，如果伴侣准备的礼物让你觉得有点失望，那个失望的点通常是？",
    options: [
      { text: "不够用心。看不出我是那个被特殊对待的人。", type: "被偏爱" },
      { text: "没意义。跟我不搭界，说明他根本不懂我的喜好。", type: "精神共鸣" },
      { text: "不实用。破坏了开销计划，不如买点实用的。", type: "秩序感" },
      { text: "不平衡。我总是记着你的喜好，你对我却一无所知。", type: "被需要" },
    ],
  },
  {
    id: 10,
    question: "带伴侣去参加你的朋友聚会。整个过程中，你最舒服的状态是？",
    options: [
      { text: "连体婴。哪怕跟别人聊天，我也希望眼神能对上。", type: "确定感" },
      { text: "得体模式。在意他能不能融入，别冷场也别出格。", type: "掌控感" },
      { text: "放养模式。各玩各的，不用我时刻照顾他的情绪。", type: "自由感" },
      { text: "低调模式。正常社交就好，别让我们成为全场焦点。", type: "安全距离" },
    ],
  },
  // ……（中间 38 题你原样保留即可）
  // 为了不把聊天窗口炸穿，我这里不重复贴 48 题全量；
  // 你只要把你原来的 QUESTIONS 从第 11 到 48 题原封不动粘回来就行 ✅
];

const RESULTS = {
  确定感: {
    type: "确定感",
    archetype: "风暴中的守夜人",
    icon: <Anchor className="w-8 h-8" />,
    quote: "万物皆流变，而我只要一种绝对的定数。",
    keywords: ["稳定", "契约", "长情"],
    cardStyle: "from-blue-700/60 to-indigo-900/60 shadow-[0_0_40px_-5px_rgba(59,130,246,0.5)] border-blue-200/40",
    accentColor: "text-blue-700",
    tabs: {
      base:
        `在亲密关系中，你核心的情感诉求是 “稳定与可预期”，始终坚守着对长期联结的极致追求。相较于外在条件的光鲜或浪漫形式的轰轰烈烈，你更看重关系中的确定性—— 凡事有交代、件件有着落、事事有回音，这种清晰、可靠的互动模式，是你构建情感安全感的基石。\n\n你的情感底色厚重且带着强烈的契约精神，对感情的投入从不浅尝辄止，而是带着 “认定即终身” 的郑重。`,
      lightShadow: [
        { label: "稳定的情感支撑力 (光)", text: "你是关系中定海神针般的存在，具备极强的抗风险韧性。不会因短期矛盾或外界波动轻易放弃联结，始终以长期视角对待关系，能为对方提供可依赖的情感锚点。" },
        { label: "纯粹的情感忠诚度 (光)", text: "你的情感投入具有极强的排他性与专注度，拒绝 “骑驴找马”“留退路” 等模糊模式。一旦确立联结，便会毫无保留地全心投入。" },
        { label: "对模糊信号的过度敏感 (影)", text: "难以耐受关系中的信息空白，当对方出现沉默、回避等不确定行为时，易陷入过度解读与自我归因，将中性信号转化为被否定。" },
        { label: "以体谅为名的需求压抑 (影)", text: "因恐惧成为对方的 “负担”，常以 “懂事”“体谅” 为借口，刻意隐藏自身的情感需求与不安。" },
      ],
      partner: [
        "你的追问，从不是找茬，是在求一份安心。当你反复问“爱不爱我”时，别嫌烦——那一刻正被不安包裹。",
        "你的“报备”，是定心丸。不要求秒回，但怕突然失联。",
        "关键时刻，请坚定地偏向。任何犹豫、迟疑，在眼里都会变成“我不重要”的信号。",
      ],
      origins: "深度溯源：你对确定感的极致渴求，本质是焦虑型依恋模式的典型呈现。这种不可预测的养育环境，让你从小就被迫活在 “不确定” 里。你不知道下一次伸手是否会被回应，只能时刻绷紧神经。",
      reshape:
        "重塑建议：\n1. 练习事实归因：停止对模糊信号的灾难化解读。\n2. 建立爱的韧性认知：相信关系的稳定性不依赖即时回应。\n3. 构建自我价值支撑体系：把情绪重心从对方身上收回。",
    },
    blessing: "愿你在世事浮沉的人间，能遇见一个懂你敏感、护你不安的人。更愿你修炼出一颗稳稳的内心：最坚实的依靠从不是别人的承诺，而是自己给的底气。",
  },

  // ✅ 下面 7 个结果你把你原来的 RESULTS 其余部分原封不动粘回来即可
  // 被需要、掌控感、被偏爱、精神共鸣、自由感、安全距离、秩序感
};

export default function SoulScan_StainedGlass() {
  const [step, setStep] = useState("landing");
  const [showInput, setShowInput] = useState(false);
  const [code, setCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [scores, setScores] = useState({});
  const [results, setResults] = useState({ primary: null, secondary: null });
  const [currentPart, setCurrentPart] = useState(null);

  const [flippedCards, setFlippedCards] = useState({ primary: false, secondary: false });
  const [viewingResult, setViewingResult] = useState("primary");
  const [activeTab, setActiveTab] = useState("base");

  const progress = useMemo(() => ((currentQIndex + 1) / QUESTIONS.length) * 100, [currentQIndex]);
  const displayResultKey = viewingResult === "primary" ? results.primary : results.secondary;
  const displayData = displayResultKey ? RESULTS[displayResultKey] : null;

  const handlePartTransition = (index) => {
    const part = PARTS_CONFIG.find((p) => p.startIndex === index);
    if (part) {
      setCurrentPart(part);
      setStep("partIntro");
    } else {
      setStep("quiz");
    }
  };

  // --- 1. 登录交互 ---
  const handleVerify = () => {
    setErrorMsg("");
    if (!code.trim()) {
      setErrorMsg("请输入兑换码，不能为空");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      if (code.trim().toLowerCase() === "error") {
        setErrorMsg("该兑换码无效或已被使用，请检查");
        setIsLoading(false);
        return;
      }
      setIsLoading(false);
      handlePartTransition(0);
    }, 800);
  };

  // --- 2. 答题 ---
  const handleAnswer = (type) => {
    const newScores = { ...scores, [type]: (scores[type] || 0) + 1 };
    setScores(newScores);

    const nextIndex = currentQIndex + 1;
    if (nextIndex < QUESTIONS.length) {
      setCurrentQIndex(nextIndex);
      handlePartTransition(nextIndex);
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else {
      finishQuiz(newScores);
    }
  };

  // --- 3. 结算 ---
  const finishQuiz = (finalScores) => {
    setStep("analyzing");
    const sortedScores = Object.entries(finalScores).sort((a, b) => b[1] - a[1]);
    const primaryKey = sortedScores?.[0]?.[0] ?? "确定感";
    const secondaryKey = sortedScores?.[1]?.[0] ?? primaryKey;

    setTimeout(() => {
      setResults({ primary: primaryKey, secondary: secondaryKey });
      setStep("result");
    }, 1200);
  };

  // ✅ Result 页防炸：results 还没到位时先显示 Loading
  const resultReady =
    step !== "result" ||
    (results.primary && RESULTS[results.primary] && results.secondary && RESULTS[results.secondary]);

  return (
    <div className="min-h-screen bg-[#FDFBF9] text-[#4A4A4A] font-sans selection:bg-rose-100 flex flex-col overflow-x-hidden">
      {/* 顶部栏 */}
      {step !== "landing" && step !== "partIntro" && (
        <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-stone-100 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-rose-400" />
            <span className="font-serif font-bold tracking-widest text-stone-800 text-xs">SOUL SCAN</span>
          </div>
          {step === "quiz" && (
            <span className="text-[10px] font-mono text-stone-400 bg-stone-100 px-2 py-1 rounded">
              {currentQIndex + 1} / {QUESTIONS.length}
            </span>
          )}
        </nav>
      )}

      {/* Landing */}
      {step === "landing" && (
        <div className="flex-1 flex flex-col relative overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-rose-200/40 to-orange-100/40 blur-[80px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-tl from-blue-200/40 to-purple-100/40 blur-[80px]" />

          <div className="flex-1 flex flex-col justify-center items-center px-8 z-10 animate-fade-in">
            <div className="mb-8 p-4 bg-white/50 backdrop-blur-sm rounded-2xl shadow-sm border border-white/60">
              <Lock className="w-8 h-8 text-stone-700 opacity-80" />
            </div>

            <div className="text-center space-y-4 mb-12">
              <h1 className="text-4xl font-serif font-bold text-stone-800 tracking-wide">情感欲望图鉴</h1>
              <p className="text-sm font-light text-stone-500 tracking-[0.2em] uppercase">Unlock Your Hidden Desires</p>
              <p className="text-sm text-stone-600 leading-relaxed max-w-xs mx-auto pt-4">
                48道潜意识扫描，揭示你的双重欲望。<br />
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
                    {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : "开始解锁"}
                  </button>
                  {errorMsg && <p className="text-xs text-red-500 text-center bg-red-50 py-2 rounded-lg">{errorMsg}</p>}
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

      {/* Part Intro */}
      {step === "partIntro" && currentPart && (
        <div className="flex-1 bg-stone-900 flex flex-col justify-center items-center text-center p-8 animate-fade-in relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10" />
          <div className="relative z-10 max-w-sm">
            <span className="text-rose-300/80 text-[10px] tracking-[0.4em] uppercase mb-6 block">Chapter</span>
            <h2 className="text-2xl font-serif font-bold mb-6 text-rose-50 tracking-wide">{currentPart.title}</h2>
            <div className="w-8 h-1 bg-rose-500/50 mx-auto mb-8 rounded-full"></div>
            <p className="text-lg font-serif italic text-white/90 mb-8 leading-relaxed px-4">{currentPart.quote}</p>
            <p className="text-xs text-stone-400 leading-6 mb-12 px-6">{currentPart.desc}</p>
            <button
              onClick={() => setStep("quiz")}
              className="group flex items-center gap-2 mx-auto text-rose-200 border border-rose-200/20 px-8 py-3 rounded-full hover:bg-rose-200/10 transition-all text-xs tracking-widest"
            >
              CONTINUE
              <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      )}

      {/* Quiz */}
      {step === "quiz" && (
        <div className="flex-1 flex flex-col pt-24 px-6 animate-slide-up max-w-md mx-auto w-full">
          <div className="w-full h-1 bg-stone-100 rounded-full mb-10 overflow-hidden">
            <div className="h-full bg-rose-400 transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
          </div>

          <div className="flex-1 flex flex-col justify-center pb-20">
            <div className="mb-2">
              <span className="text-[10px] font-bold tracking-widest uppercase text-rose-400 bg-rose-50 px-2 py-1 rounded inline-block mb-4">
                {currentQIndex < 16 ? "Reality" : currentQIndex < 32 ? "Emotion" : "Soul"}
              </span>
              <h2 className="text-lg font-serif font-medium leading-relaxed text-stone-800">{QUESTIONS[currentQIndex].question}</h2>
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
                    <span className="text-sm text-stone-600 group-hover:text-stone-900 leading-relaxed">{opt.text}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Analyzing */}
      {step === "analyzing" && (
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

      {/* Result */}
      {step === "result" && !resultReady && (
        <div className="flex-1 flex items-center justify-center pt-24">
          <div className="text-sm text-stone-500 flex items-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin" /> Loading result...
          </div>
        </div>
      )}

      {step === "result" && resultReady && (
        <div className="flex-1 flex flex-col animate-fade-in pt-24 px-6 pb-20 max-w-md mx-auto w-full">
          <p className="text-center text-[10px] text-stone-400 mb-8 tracking-[0.2em] uppercase">Tap Card to Reveal</p>

          <div className="space-y-8 mb-12">
            {/* 主卡 */}
            <div
              className="relative w-full aspect-[4/5] perspective-1000 cursor-pointer group"
              onClick={() => {
                setFlippedCards((prev) => ({ ...prev, primary: true }));
                setViewingResult("primary");
                setActiveTab("base");
              }}
            >
              <div className={`relative w-full h-full duration-1000 transform-style-3d transition-transform ${flippedCards.primary ? "rotate-y-180" : ""}`}>
                <div
                  className={`absolute inset-0 backface-hidden bg-stone-900 rounded-[2rem] shadow-2xl border-[1px] border-white/10 flex flex-col items-center justify-center ${
                    viewingResult === "primary" && flippedCards.primary ? "ring-2 ring-rose-200/50 ring-offset-2 ring-offset-[#FDFBF9]" : ""
                  }`}
                >
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />
                  <Sun className="w-12 h-12 text-rose-200/80 mb-4 animate-pulse" />
                  <h3 className="text-rose-100/90 text-sm font-serif tracking-widest">主导欲望</h3>
                  <p className="text-white/30 text-[10px] mt-2 uppercase tracking-[0.2em]">Core Desire</p>
                </div>

                <div
                  className={`absolute inset-0 backface-hidden rotate-y-180 rounded-[2rem] overflow-hidden flex flex-col justify-between text-white p-6 bg-gradient-to-br ${
                    RESULTS[results.primary].cardStyle
                  } backdrop-blur-xl border border-white/30`}
                >
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
                      <p className="text-xs italic font-serif leading-relaxed text-center opacity-95">“{RESULTS[results.primary].quote}”</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 副卡 */}
            <div
              className="relative w-full aspect-[4/2] perspective-1000 cursor-pointer group"
              onClick={() => {
                setFlippedCards((prev) => ({ ...prev, secondary: true }));
                setViewingResult("secondary");
                setActiveTab("base");
              }}
            >
              <div className={`relative w-full h-full duration-1000 transform-style-3d transition-transform ${flippedCards.secondary ? "rotate-y-180" : ""}`}>
                <div
                  className={`absolute inset-0 backface-hidden bg-stone-800 rounded-[2rem] shadow-xl border-[1px] border-white/5 flex flex-col items-center justify-center ${
                    viewingResult === "secondary" && flippedCards.secondary ? "ring-2 ring-rose-200/50 ring-offset-2 ring-offset-[#FDFBF9]" : ""
                  }`}
                >
                  <Moon className="w-8 h-8 text-purple-200/70 mb-2" />
                  <h3 className="text-purple-100/80 text-xs font-serif tracking-widest">潜意识欲望</h3>
                </div>

                <div
                  className={`absolute inset-0 backface-hidden rotate-y-180 rounded-[2rem] overflow-hidden flex items-center justify-between text-white p-6 bg-gradient-to-br ${
                    RESULTS[results.secondary].cardStyle
                  } backdrop-blur-xl border border-white/30`}
                >
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

          {/* 详情 Tabs */}
          {(flippedCards.primary || flippedCards.secondary) && displayData && (
            <div className="w-full animate-slide-up-delayed scroll-mt-24 mb-16" id="details-section">
              <div className="flex items-center justify-between mb-4 px-1">
                <h3 className={`font-serif font-bold text-base flex items-center gap-2 ${displayData.accentColor}`}>
                  {viewingResult === "primary" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  {viewingResult === "primary" ? "主导欲望解析" : "潜意识欲望解析"}
                </h3>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar mb-1 px-1">
                {[
                  { id: "base", label: "底色" },
                  { id: "lightShadow", label: "光影" },
                  { id: "partner", label: "致伴侣" },
                  { id: "origins", label: "溯源" },
                  { id: "reshape", label: "重塑" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all duration-300 ${
                      activeTab === tab.id ? "bg-stone-800 text-white shadow-md" : "bg-white text-stone-400 border border-stone-100"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-stone-200/50 border border-stone-50 min-h-[260px] relative overflow-hidden transition-all duration-500">
                <div className="absolute top-0 left-0 w-full h-1 bg-stone-100" />

                {activeTab === "base" && (
                  <div className="animate-fade-in">
                    <h4 className="font-bold text-xs mb-3 text-stone-800 flex items-center gap-2 uppercase tracking-wider">
                      <BookOpen className="w-3 h-3" /> 亲密底色
                    </h4>
                    <p className="text-sm text-stone-600 leading-7 text-justify whitespace-pre-line">{displayData.tabs.base}</p>
                  </div>
                )}

                {activeTab === "lightShadow" && (
                  <div className="animate-fade-in space-y-4">
                    {displayData.tabs.lightShadow.map((item, idx) => (
                      <div key={idx} className="bg-stone-50/80 p-4 rounded-xl border border-stone-100/50">
                        <h4 className={`text-xs font-bold mb-1.5 flex items-center gap-2 ${item.label.includes("(光)") ? "text-amber-600" : "text-slate-600"}`}>
                          {item.label.includes("(光)") ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
                          {item.label.split(" ")[0]}
                        </h4>
                        <p className="text-xs text-stone-600 leading-relaxed">{item.text}</p>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "partner" && (
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

                {activeTab === "origins" && (
                  <div className="animate-fade-in">
                    <h4 className="font-bold text-xs mb-3 text-stone-800 flex items-center gap-2 uppercase tracking-wider">
                      <Search className="w-3 h-3" /> 童年溯源
                    </h4>
                    <div className="text-sm text-stone-600 leading-7 bg-stone-50/50 p-5 rounded-xl border border-stone-100 text-justify">
                      {displayData.tabs.origins}
                    </div>
                  </div>
                )}

                {activeTab === "reshape" && (
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

          {/* 祝福 */}
          {(flippedCards.primary || flippedCards.secondary) && displayData && (
            <div className="mt-8 mb-12 text-center animate-fade-in px-4">
              <Feather className="w-5 h-5 text-rose-300 mx-auto mb-4 opacity-80" />
              <p className="font-serif italic text-stone-600 text-sm leading-8">{displayData.blessing}</p>
              <div className="w-8 h-[1px] bg-stone-200 mx-auto mt-6"></div>
            </div>
          )}

          {(flippedCards.primary || flippedCards.secondary) && (
            <div className="flex gap-3 pb-4">
              <button
                onClick={() => (typeof window !== "undefined" ? window.location.reload() : null)}
                className="flex-1 py-3.5 bg-white border border-stone-200 rounded-xl text-stone-500 text-sm font-bold flex items-center justify-center gap-2 hover:bg-stone-50 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                再测一次
              </button>
            </div>
          )}
        </div>
      )}

      <footer className="py-6 text-center text-[10px] text-stone-300 tracking-widest uppercase border-t border-stone-100 mt-auto bg-white/50 backdrop-blur-sm">
        柚子的心理小屋 原创（小红书同名）
      </footer>

      {/* ✅ Vite/React 通用 style（替代 styled-jsx） */}
      <style>{`
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
