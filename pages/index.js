import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// 初始化 Supabase 客户端
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Home() {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');

  const handleVerify = async () => {
    if (!code) return;
    setStatus('loading');
    setMessage('');

    try {
      // 1. 去 Supabase 查这个码是否存在
      const { data, error } = await supabase
        .from('codes')
        .select('*')
        .eq('code', code)
        .single();

      if (error || !data) {
        setStatus('error');
        setMessage('无效的兑换码，请检查输入');
        return;
      }

      // 2. 检查是否已使用
      if (data.is_used) {
        setStatus('error');
        setMessage('该兑换码已被使用');
        return;
      }

      // 3. 标记为已使用 (更新数据库)
      const { error: updateError } = await supabase
        .from('codes')
        .update({ is_used: true })
        .eq('id', data.id);

      if (updateError) {
        setStatus('error');
        setMessage('系统繁忙，请重试');
        return;
      }

      // 4. 成功！跳转到测评页 (这里演示直接显示结果，你可以改成跳转)
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setMessage('发生未知错误');
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
      <h1>测评系统入口</h1>
      
      {status !== 'success' ? (
        <div style={{ marginTop: '20px' }}>
          <p>请输入您购买的兑换码开始测评</p>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.trim())}
            placeholder="请输入兑换码"
            style={{ padding: '10px', fontSize: '16px', width: '200px', marginRight: '10px' }}
          />
          <button 
            onClick={handleVerify} 
            disabled={status === 'loading'}
            style={{ padding: '10px 20px', fontSize: '16px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            {status === 'loading' ? '验证中...' : '开始测评'}
          </button>
          {message && <p style={{ color: 'red', marginTop: '10px' }}>{message}</p>}
        </div>
      ) : (
        <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#e6fffa', borderRadius: '10px' }}>
          <h2 style={{ color: '#0070f3' }}>验证成功！🎉</h2>
          <p>这里是您的测评内容...</p>
          <p>(在真实项目中，这里会跳转到答题页面)</p>
        </div>
      )}
    </div>
  );
}
