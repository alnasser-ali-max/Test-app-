import { useState, useEffect, useRef, useCallback } from "react";

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;700;900&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Cairo', sans-serif; background: #05050f; }

  @keyframes orb-float {
    0%,100% { transform: translateY(0) scale(1); }
    50%      { transform: translateY(-22px) scale(1.04); }
  }
  @keyframes spin        { to { transform: rotate(360deg); } }
  @keyframes pulse-ring  {
    0%,100% { transform: scale(1);    box-shadow: 0 0 0   0 #06b6d455; }
    50%      { transform: scale(1.18); box-shadow: 0 0 0 18px #06b6d400; }
  }
  @keyframes morph {
    0%,100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
    25%      { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
    50%      { border-radius: 40% 60% 50% 50% / 30% 50% 70% 50%; }
    75%      { border-radius: 60% 40% 40% 60% / 70% 40% 60% 30%; }
  }
  @keyframes shimmer { to { background-position: -200% 0; } }
  @keyframes ripple-anim { to { transform: scale(4); opacity: 0; } }
  @keyframes orbit-spin  { to { transform: rotate(360deg); } }
  @keyframes fade-up {
    from { opacity: 0; transform: translateY(32px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes slide-in-left {
    from { opacity: 0; transform: translateX(-40px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes flip-in {
    from { opacity: 0; transform: perspective(600px) rotateY(-80deg); }
    to   { opacity: 1; transform: perspective(600px) rotateY(0); }
  }
  @keyframes spring-in {
    0%   { opacity: 0; transform: scale(.5); }
    60%  { transform: scale(1.12); }
    80%  { transform: scale(.95); }
    100% { opacity: 1; transform: scale(1); }
  }
  @keyframes stagger-dot {
    0%,80%,100% { transform: scale(0); opacity: .3; }
    40%         { transform: scale(1);   opacity: 1;   }
  }
  @keyframes gradient-pan {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
`;

const T = {
  bg:"#05050f",surface:"#0e0c1e",border:"#ffffff10",
  gold:"#c9a84c",gold2:"#f0d080",purple:"#7c3aed",
  cyan:"#06b6d4",rose:"#f43f5e",text:"#e8e0ff",muted:"#6b6880",
};

function Card({ label, title, note, delay=0, entryAnim="fade-up", children }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setTimeout(() => setVis(true), delay); io.disconnect(); }
    }, { threshold: .15 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [delay]);
  return (
    <div ref={ref} style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:16, padding:"32px 24px", display:"flex", flexDirection:"column", alignItems:"center", gap:14, textAlign:"center", opacity:vis?1:0, animation:vis?`${entryAnim} .55s ease both`:"none", transition:"box-shadow .3s, transform .3s" }}
      onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-6px)";e.currentTarget.style.boxShadow="0 20px 50px #7c3aed22";}}
      onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="";}}>
      {children}
      <div style={{fontSize:11,fontWeight:700,letterSpacing:".14em",textTransform:"uppercase",color:T.muted}}>{label}</div>
      <div style={{fontSize:15,fontWeight:700,color:T.text}}>{title}</div>
      {note&&<div style={{fontSize:12,color:T.muted}}>{note}</div>}
    </div>
  );
}

function Spinner() {
  return <div style={{width:70,height:70,border:`3px solid #ffffff10`,borderTopColor:T.gold,borderRadius:"50%",animation:"spin 1s linear infinite"}}/>;
}
function Pulse() {
  return <div style={{width:30,height:30,background:T.cyan,borderRadius:"50%",animation:"pulse-ring 1.4s ease-in-out infinite"}}/>;
}
function Blob() {
  return <div style={{width:90,height:90,background:`linear-gradient(135deg,${T.purple},${T.rose})`,animation:"morph 4s ease-in-out infinite"}}/>;
}
function Skeleton() {
  const bar=(w,d)=><div style={{width:w,height:14,borderRadius:6,background:"linear-gradient(90deg,#ffffff08 25%,#ffffff16 50%,#ffffff08 75%)",backgroundSize:"200% 100%",animation:`shimmer 1.6s ${d}s infinite`}}/>;
  return <div style={{width:"100%",display:"flex",flexDirection:"column",gap:10}}>{bar("100%",0)}{bar("85%",.1)}{bar("65%",.2)}</div>;
}
function RippleButton() {
  const [ripples,setRipples]=useState([]);
  const add=useCallback((e)=>{
    const r=e.currentTarget.getBoundingClientRect(),size=Math.max(r.width,r.height),id=Date.now();
    setRipples(x=>[...x,{id,x:e.clientX-r.left-size/2,y:e.clientY-r.top-size/2,size}]);
    setTimeout(()=>setRipples(x=>x.filter(i=>i.id!==id)),560);
  },[]);
  return (
    <button onClick={add} style={{position:"relative",overflow:"hidden",background:`linear-gradient(135deg,${T.purple},#a855f7)`,color:"#fff",fontFamily:"Cairo,sans-serif",fontSize:14,fontWeight:700,padding:"12px 28px",border:"none",borderRadius:99,cursor:"pointer"}}>
      اضغط هنا
      {ripples.map(r=><span key={r.id} style={{position:"absolute",borderRadius:"50%",background:"#ffffff40",width:r.size,height:r.size,left:r.x,top:r.y,transform:"scale(0)",animation:"ripple-anim .55s linear",pointerEvents:"none"}}/>)}
    </button>
  );
}
function Counter() {
  const [val,setVal]=useState(0),ref=useRef(null);
  useEffect(()=>{
    const io=new IntersectionObserver(([e])=>{
      if(e.isIntersecting){io.disconnect();const end=98500,dur=2200,s=performance.now();const step=n=>{const p=Math.min((n-s)/dur,1);setVal(Math.floor(p*end));if(p<1)requestAnimationFrame(step);};requestAnimationFrame(step);}
    },{threshold:.5});
    io.observe(ref.current);return()=>io.disconnect();
  },[]);
  return <div ref={ref} style={{fontSize:52,fontWeight:900,background:`linear-gradient(135deg,${T.gold2},${T.gold})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",minWidth:110,textAlign:"center"}}>{val.toLocaleString("en")}</div>;
}
function Orbit() {
  const dots=[{color:T.gold,dur:"1.8s",origin:"50% 46px",top:-6},{color:T.cyan,dur:"2.6s",origin:"50% -34px",bottom:-6,rev:true},{color:T.rose,dur:"3.4s",origin:"50% 46px",top:-6}];
  return (
    <div style={{position:"relative",width:80,height:80}}>
      <div style={{position:"absolute",inset:0,border:"2px dashed #ffffff18",borderRadius:"50%"}}/>
      {dots.map((d,i)=><div key={i} style={{position:"absolute",left:"calc(50% - 6px)",...(d.top!==undefined?{top:d.top}:{bottom:d.bottom}),width:12,height:12,borderRadius:"50%",background:d.color,transformOrigin:d.origin,animation:`orbit-spin ${d.dur} linear infinite${d.rev?" reverse":""}`}}/>)}
    </div>
  );
}
function ProgressBar() {
  const [pct,setPct]=useState(0),ref=useRef(null);
  useEffect(()=>{
    const io=new IntersectionObserver(([e])=>{if(e.isIntersecting){io.disconnect();let v=0;const t=setInterval(()=>{v+=1.2;if(v>=78){setPct(78);clearInterval(t);}else setPct(Math.round(v));},18);}},{threshold:.5});
    io.observe(ref.current);return()=>io.disconnect();
  },[]);
  return (
    <div ref={ref} style={{width:"100%"}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:6,fontSize:12,color:T.muted}}><span>أداء النظام</span><span style={{color:T.gold,fontWeight:700}}>{pct}%</span></div>
      <div style={{background:"#ffffff0a",borderRadius:99,height:8,overflow:"hidden"}}><div style={{height:"100%",width:`${pct}%`,background:`linear-gradient(90deg,${T.purple},${T.gold})`,borderRadius:99,transition:"width .04s linear"}}/></div>
    </div>
  );
}
function StaggerDots() {
  return <div style={{display:"flex",gap:10,alignItems:"center"}}>{[0,.2,.4].map((d,i)=><div key={i} style={{width:16,height:16,borderRadius:"50%",background:[T.gold,T.cyan,T.rose][i],animation:`stagger-dot 1.4s ${d}s ease-in-out infinite`}}/>)}</div>;
}
function GradientText() {
  return <div style={{fontSize:28,fontWeight:900,background:`linear-gradient(270deg,${T.rose},${T.purple},${T.cyan},${T.gold})`,backgroundSize:"400% 400%",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",animation:"gradient-pan 4s ease infinite"}}>Next.js ✦ قوة React</div>;
}

export default function App() {
  useEffect(()=>{
    const s=document.createElement("style");s.textContent=GLOBAL_CSS;document.head.appendChild(s);
    return()=>document.head.removeChild(s);
  },[]);

  const cards=[
    {label:"Animation #1",title:"Spinner دوّار",note:"border-top + rotate",anim:"fade-up",child:<Spinner/>},
    {label:"Animation #2",title:"نبضة Pulse",note:"scale + box-shadow",anim:"slide-in-left",child:<Pulse/>},
    {label:"Animation #3",title:"Blob متشكّل",note:"border-radius morphing",anim:"flip-in",child:<Blob/>},
    {label:"Animation #4",title:"Skeleton Loader",note:"gradient shimmer",anim:"spring-in",child:<Skeleton/>},
    {label:"Animation #5",title:"تأثير Ripple",note:"React state دوائر",anim:"fade-up",child:<RippleButton/>},
    {label:"Animation #6",title:"عداد React",note:"requestAnimationFrame",anim:"fade-up",child:<Counter/>},
    {label:"Animation #7",title:"مدار Orbit",note:"transform-origin دوران",anim:"spring-in",child:<Orbit/>},
    {label:"Animation #8",title:"Progress Bar",note:"React state + transition",anim:"slide-in-left",child:<ProgressBar/>},
    {label:"Animation #9",title:"Stagger Dots",note:"animation-delay تتابع",anim:"flip-in",child:<StaggerDots/>},
    {label:"Animation #10",title:"Gradient Pan",note:"background-position 4 ألوان",anim:"fade-up",child:<GradientText/>},
  ];

  return (
    <div style={{background:T.bg,minHeight:"100vh",fontFamily:"Cairo,sans-serif",color:T.text,direction:"rtl"}}>
      <div style={{position:"relative",minHeight:340,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",padding:"60px 24px 40px",gap:14,overflow:"hidden"}}>
        <div style={{position:"absolute",width:420,height:420,background:"#7c3aed44",borderRadius:"50%",filter:"blur(80px)",top:-140,left:-80,animation:"orb-float 6s ease-in-out infinite",pointerEvents:"none"}}/>
        <div style={{position:"absolute",width:300,height:300,background:"#06b6d433",borderRadius:"50%",filter:"blur(80px)",bottom:-80,right:-40,animation:"orb-float 6s ease-in-out -3s infinite",pointerEvents:"none"}}/>
        <span style={{display:"inline-block",background:"#ffffff0a",border:`1px solid ${T.gold}`,color:T.gold,fontSize:11,fontWeight:700,letterSpacing:".12em",textTransform:"uppercase",padding:"4px 14px",borderRadius:99}}>Next.js — React Powered</span>
        <h1 style={{fontSize:"clamp(28px,6vw,52px)",fontWeight:900,lineHeight:1.15,background:`linear-gradient(135deg,${T.gold2},${T.gold},${T.purple})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>قوة الحركات<br/>بـ React State</h1>
        <p style={{fontSize:15,color:T.muted,maxWidth:480}}>10 حركات مع Stagger مختلف لكل كارد، Ripple تفاعلي، Progress بـ State.</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))",gap:20,padding:"0 24px 60px",maxWidth:1100,margin:"0 auto"}}>
        {cards.map((c,i)=><Card key={i} label={c.label} title={c.title} note={c.note} delay={i*80} entryAnim={c.anim}>{c.child}</Card>)}
      </div>
    </div>
  );
}
