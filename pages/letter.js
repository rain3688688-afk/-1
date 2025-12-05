"use client";

import React, { useState, useEffect } from 'react';
import { Mail, Sparkles, Search, X } from 'lucide-react';
import Head from 'next/head';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

const XIAOHONGSHU_KEYWORD = "柚子的心理小屋";
const ALL_DIMENSIONS = ["确定感", "被需要", "掌控感", "被偏爱", "精神共鸣", "自由感", "安全距离", "秩序感"];

// 简化的结果配色映射
const RESULT_COLORS = {
  "确定感": "#3b82f6", "被需要": "#ea580c", "掌控感": "#be123c", "被偏爱": "#db2777",
  "精神共鸣": "#9333ea", "自由感": "#0284c7", "安全距离": "#0f766e", "秩序感": "#334155"
};

export default function LetterPage() {
  const [letterType, setLetterType] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const type = params.get('type');
    if (type && RESULT_COLORS[type]) {
      setLetterType(type);
      setChartData(ALL_DIMENSIONS.map(dim => ({
        subject: dim, A: dim === type ? 8 : 4, fullMark: 8
      })));
    } else {
      window.location.href = "/";
    }
  }, []);

  useEffect(() => {
    if (isOpen && letterType) {
      const fullText = `亲爱的，\n\n见信如晤。\n我刚刚做了一个很准的测试，\n窥探到了自己内心深处的渴望...\n\n我的欲望底色是：\n【 ${letterType} 】\n\n这一刻，我好像更懂自己了。\n\n而你呢？\n你也想看看，\n我们灵魂深处的契合度吗？`;
      let i = 0;
      const timer = setInterval(() => {
        setTypedText(fullText.slice(0, i));
        i++;
        if (i > fullText.length) clearInterval(timer);
      }, 50);
      return () => clearInterval(timer);
    }
  }, [isOpen, letterType]);

  const handleGoToXiaohongshu = () => {
    navigator.clipboard.writeText(XIAOHONGSHU_KEYWORD);
    alert(`已复制口令：${XIAOHONGSHU_KEYWORD}\n请前往小红书搜索购买`);
    window.location.href = "https://www.xiaohongshu.com"; 
  };

  if (!letterType) return <div className="min-h-screen bg-stone-900" />;

  return (
    <div className="min-h-screen bg-stone-900 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <Head><script src="https://cdn.tailwindcss.com"></script></Head>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10" />
      
      {!isOpen ? (
        <div onClick={() => setIsOpen(true)} className="cursor-pointer animate-bounce-slow flex flex-col items-center group">
          <div className="w-72 h-48 bg-[#f3f0e7] rounded-lg shadow-2xl flex items-center justify-center border-t-4 border-rose-200 relative overflow-hidden">
             <div className="absolute top-0 w-0 h-0 border-l-[144px] border-r-[144px] border-t-[90px] border-l-transparent border-r-transparent border-t-rose-100/90 shadow-sm"></div>
             <div className="z-10 bg-rose-500 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg"><Mail className="w-6 h-6" /></div>
          </div>
          <p className="text-rose-100/80 text-center mt-8 text-sm tracking-widest animate-pulse">有一封来自朋友的灵魂回信...</p>
        </div>
      ) : (
        <div className="w-full max-w-md bg-[#fffcf8] rounded-xl p-8 shadow-2xl animate-slide-up relative min-h-[500px] flex flex-col">
           <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-rose-300 to-purple-300 rounded-t-xl" />
           <div className="font-serif text-stone-700 leading-8 whitespace-pre-line mb-8 text-sm">{typedText}</div>
           <div className={`transition-opacity duration-1000 ${typedText.length > 20 ? 'opacity-100' : 'opacity-0'}`}>
              <div className="w-full h-[200px] bg-stone-50 rounded-xl mb-8">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 10 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 8]} tick={false} axisLine={false} />
                    <Radar name="Friend" dataKey="A" stroke={RESULT_COLORS[letterType]} fill={RESULT_COLORS[letterType]} fillOpacity={0.5} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3">
                 <button onClick={()=>window.location.href="/"} className="w-full py-3.5 bg-stone-900 text-white rounded-xl text-sm font-bold shadow-lg flex items-center justify-center gap-2"><Sparkles className="w-4 h-4" /> 我也有码，开始测试</button>
                 <button onClick={handleGoToXiaohongshu} className="w-full py-3.5 bg-rose-50 text-rose-600 border border-rose-100 rounded-xl text-sm font-bold flex items-center justify-center gap-2"><Search className="w-4 h-4" /> 没有码？去小红书获取</button>
              </div>
           </div>
        </div>
      )}
      <style jsx global>{`
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .animate-slide-up { animation: slideUp 0.8s ease-out forwards; }
        .animate-bounce-slow { animation: bounce-slow 3s infinite ease-in-out; }
      `}</style>
    </div>
  );
}
