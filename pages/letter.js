"use client";

import React, { useState, useEffect } from 'react';
import { Mail, Sparkles, Search, X, Heart } from 'lucide-react';
import Head from 'next/head';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

// --- 1. 核心数据配置 (只保留展示需要的精简版) ---
const XIAOHONGSHU_KEYWORD = "柚子的心理小屋";

const RESULTS = {
  "确定感": { color: "#3b82f6", quote: "“万物皆流变，而我只要一种绝对的定数。”" },
  "被需要": { color: "#ea580c", quote: "“没有你，我只是一片废墟。”" },
  "掌控感": { color: "#be123c", quote: "“我抛开了所有理智，只求你结束我的痛苦。”" },
  "被偏爱": { color: "#db2777", quote: "“你要永远为你驯服的东西负责。”" },
  "精神共鸣": { color: "#9333ea", quote: "“我们相遇在精神的旷野，无需言语便已相通。”" },
  "自由感": { color: "#0284c7", quote: "“我爱你，却不愿用爱束缚你。”" },
  "安全距离": { color: "#0f766e", quote: "“待人如执烛，太近灼手，太远暗生。”" },
  "秩序感": { color: "#334155", quote: "“好的关系，是一起把日子过成有章法的温柔。”" }
};

const ALL_DIMENSIONS = ["确定感", "被需要", "掌控感", "被偏爱", "精神共鸣", "自由感", "安全距离", "秩序感"];

export default function LetterPage() {
  const [letterType, setLetterType] = useState(null); // 朋友的结果类型
  const [isOpen, setIsOpen] = useState(false); // 信封是否打开
  const [typedText, setTypedText] = useState(""); // 打字机文字
  const [chartData, setChartData] = useState([]); // 雷达图数据

  // 1. 进页面先看链接里带了什么参数
  useEffect(() => {
    // 获取网址里的 ?type=xxx
    const params = new URLSearchParams(window.location.search);
    const type = params.get('type');

    if (type && RESULTS[type]) {
      setLetterType(type);
      // 生成朋友的雷达图数据 (为了视觉效果，主属性拉满)
      setChartData(ALL_DIMENSIONS.map(dim => ({
        subject: dim,
        A: dim === type ? 8 : 4, 
        fullMark: 8
      })));
    } else {
      // 如果没参数（比如直接访问 /letter），默认回首页
      window.location.href = "/";
    }
  }, []);

  // 2. 拆信后的打字机动画
  useEffect(() => {
    if (isOpen && letterType) {
      const quote = RESULTS[letterType].quote;
      // 这里的文案是专门写给“被分享者”看的
      const fullText = `亲爱的，\n\n见信如晤。\n我刚刚做了一个很准的测试，\n窥探到了自己内心深处的渴望...\n\n我的欲望底色是：\n【 ${letterType} 】\n\n${quote}\n\n这一刻，我好像更懂自己了。\n\n而你呢？\n你也想看看，\n我们灵魂深处的契合度吗？`;
      
      let i = 0;
      const timer = setInterval(() => {
        setTypedText(fullText.slice(0, i));
        i++;
        if (i > fullText.length) clearInterval(timer);
      }, 50); // 打字速度 (50ms 一个字)
      return () => clearInterval(timer);
    }
  }, [isOpen, letterType]);

  // 3. 钩子：去小红书获取口令
  const handleGoToXiaohongshu = () => {
    navigator.clipboard.writeText(XIAOHONGSHU_KEYWORD).then(() => {
       alert(`已复制口令：${XIAOHONGSHU_KEYWORD}\n正在前往小红书，请粘贴搜索...`);
       window.location.href = "https://www.xiaohongshu.com"; 
    }).catch(() => {
       alert(`请去小红书搜索：${XIAOHONGSHU_KEYWORD}`);
    });
  };

  // 4. 钩子：我有码，回首页测
  const handleGoToTest = () => {
    window.location.href = "/";
  };

  if (!letterType) return <div className="min-h-screen bg-stone-900" />; // 加载中占位

  return (
    <div className="min-h-screen bg-stone-900 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <Head>
        <title>来自朋友的一封信</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10" />
      <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] rounded-full bg-rose-500/10 blur-[100px]" />

      {/* --- 场景 A: 信封未拆 --- */}
      {!isOpen ? (
        <div 
          onClick={() => setIsOpen(true)}
          className="cursor-pointer animate-bounce-slow flex flex-col items-center group"
        >
          <div className="relative">
            {/* 信封本体 */}
            <div className="w-72 h-48 bg-[#f3f0e7] rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-center border-t-4 border-rose-200 relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
               {/* 信封封口装饰 */}
               <div className="absolute top-0 w-0 h-0 border-l-[144px] border-r-[144px] border-t-[90px] border-l-transparent border-r-transparent border-t-rose-100/90 shadow-sm"></div>
               <div className="z-10 bg-rose-500 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg border-2 border-white/20">
                  <Mail className="w-6 h-6" />
               </div>
            </div>
          </div>
          
          <div className="mt-10 text-center space-y-3">
            <p className="text-rose-100/90 text-sm tracking-[0.2em] font-serif animate-pulse">
              有一封来自朋友的灵魂回信...
            </p>
            <p className="text-stone-500 text-xs border border-stone-700 px-3 py-1 rounded-full inline-block">
              点击拆启
            </p>
          </div>
        </div>
      ) : (
        /* --- 场景 B: 信纸展开 (最终导流页) --- */
        <div className="w-full max-w-md bg-[#fffcf8] rounded-xl shadow-2xl animate-slide-up relative min-h-[600px] flex flex-col overflow-hidden">
           {/* 顶部彩条 */}
           <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-rose-300 to-purple-300`} />
           
           {/* 关闭按钮 */}
           <button onClick={()=>window.location.href="/"} className="absolute top-4 right-4 text-stone-300 hover:text-stone-600">
             <X className="w-6 h-6"/>
           </button>

           <div className="p-8 flex-1 flex flex-col">
             {/* 1. 打字机文本区域 */}
             <div className="font-serif text-stone-700 leading-8 whitespace-pre-line text-sm mb-6 min-h-[200px]">
               {typedText}
               <span className="animate-pulse text-rose-400">|</span>
             </div>

             {/* 2. 朋友的雷达图 (等字打完一会再显示) */}
             <div className={`transition-opacity duration-1000 ${typedText.length > 30 ? 'opacity-100' : 'opacity-0'}`}>
                <div className="w-full h-[220px] bg-stone-50 rounded-2xl border border-stone-100 p-4 mb-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                        <PolarGrid stroke="#e5e7eb" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 10 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 8]} tick={false} axisLine={false} />
                        <Radar name="Friend" dataKey="A" stroke={RESULTS[letterType].color} fill={RESULTS[letterType].color} fillOpacity={0.4} />
                      </RadarChart>
                    </ResponsiveContainer>
                </div>
                <p className="text-center text-[10px] text-stone-400 mb-8">TA 的情感欲望图谱</p>
             </div>

             {/* 3. 底部双钩子 (最重要！) */}
             <div className={`mt-auto space-y-3 transition-all duration-1000 delay-500 ${typedText.length > 50 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                 <button 
                   onClick={handleGoToTest} 
                   className="w-full py-3.5 bg-stone-900 text-white rounded-xl text-sm font-bold shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform"
                 >
                   <Sparkles className="w-4 h-4" />
                   我也要测 (已有兑换码)
                 </button>

                 <button 
                   onClick={handleGoToXiaohongshu}
                   className="w-full py-3.5 bg-rose-50 text-rose-600 border border-rose-100 rounded-xl text-sm font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform"
                 >
                   <Search className="w-4 h-4" />
                   没有码？去小红书获取
                 </button>
             </div>
           </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .animate-slide-up { animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-bounce-slow { animation: bounce-slow 3s infinite ease-in-out; }
      `}</style>
    </div>
  );
}
