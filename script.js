const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;

// Theme (remembered between visits)
const root=document.documentElement;
try{const t=localStorage.getItem("theme");if(t)root.dataset.theme=t}catch(e){}
$("#theme").onclick=()=>{const t=root.dataset.theme==="dark"?"light":"dark";root.dataset.theme=t;try{localStorage.setItem("theme",t)}catch(e){}};

// Scroll progress bar
addEventListener("scroll",()=>{const h=document.documentElement;$("#progress").style.width=h.scrollTop/(h.scrollHeight-h.clientHeight)*100+"%"},{passive:true});

// Typing roles
const roles=["full-stack web apps","real-time collaboration tools","AI-powered apps","things people use"];
let ri=0,ci=0,del=false;const el=$("#typed");
(function type(){const w=roles[ri];
  if(reduce){el.textContent=w;return}
  el.textContent=w.slice(0,ci+=del?-1:1);
  let t=del?35:70;
  if(!del&&ci===w.length){del=true;t=1600}else if(del&&ci===0){del=false;ri=(ri+1)%roles.length;t=300}
  setTimeout(type,t)})();

// Animated counters
const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;io.unobserve(e.target);
  const n=+e.target.dataset.count,d=+e.target.dataset.dec||0,s=performance.now();
  (function f(now){const p=Math.min((now-s)/1200,1);e.target.textContent=(n*(1-Math.pow(1-p,3))).toFixed(d);if(p<1&&!reduce)requestAnimationFrame(f);else e.target.textContent=n.toFixed(d)})(s)}),{threshold:.6});
$$("[data-count]").forEach(c=>io.observe(c));

// Section reveal + active nav link
$$(".sec .card, .sec h2").forEach(e=>e.classList.add("rv"));
const rv=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");rv.unobserve(e.target)}}),{threshold:.12});
$$(".rv").forEach(e=>rv.observe(e));
const links=$$("nav a"),spy=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)links.forEach(a=>a.classList.toggle("on",a.hash==="#"+e.target.id))}),{rootMargin:"-45% 0px -50% 0px"});
$$("main section").forEach(s=>spy.observe(s));

// 3D tilt on cards
if(!reduce)$$(".tilt").forEach(c=>{
  c.addEventListener("pointermove",e=>{const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;c.style.transform=`perspective(900px) rotateY(${x*6}deg) rotateX(${-y*6}deg)`});
  c.addEventListener("pointerleave",()=>c.style.transform="")});

// Project filters
$$(".filters .pill").forEach(b=>b.onclick=()=>{
  $$(".filters .pill").forEach(x=>x.classList.toggle("on",x===b));
  $$(".proj").forEach(p=>p.classList.toggle("hide",b.dataset.f!=="all"&&!p.dataset.tags.split(" ").includes(b.dataset.f)))});

// Toast + copy email
const toast=m=>{const t=$("#toast");t.textContent=m;t.classList.add("show");clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove("show"),2200)};
const copy=()=>navigator.clipboard.writeText("vivekpatilwork1125@gmail.com").then(()=>toast("Email copied"),()=>toast("Copy failed"));
$("#copy").onclick=copy;

// Contact form opens the visitor's email app
$("#form").onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);
  location.href=`mailto:vivekpatilwork1125@gmail.com?subject=${encodeURIComponent("Portfolio message from "+f.get("name"))}&body=${encodeURIComponent(f.get("msg")+"\n\n"+f.get("name")+" ("+f.get("email")+")")}`;toast("Opening your email app")};

// Command palette (Ctrl/Cmd + K)
const cmds=[["About","#about"],["Skills","#skills"],["Experience & education","#education"],["Projects","#projects"],["Contact","#contact"],
 ["Open resume","documents/vivek_resume.pdf"],["Open GitHub","https://github.com/vivekpatil1125"],["Open LinkedIn","https://www.linkedin.com/in/vivekpatil1125"],
 ["Copy email",copy],["Toggle theme",()=>$("#theme").click()]];
const pal=$("#palette"),inp=$("#pal-input"),list=$("#pal-list");let sel=0,shown=[];
function draw(){const q=inp.value.toLowerCase();shown=cmds.filter(c=>c[0].toLowerCase().includes(q));sel=0;
  list.innerHTML=shown.map((c,i)=>`<li class="${i?"":"sel"}" data-i="${i}">${c[0]}<span>${typeof c[1]==="string"&&c[1][0]!=="#"?"↗":""}</span></li>`).join("")||"<li>No matches</li>"}
function run(i){const c=shown[i];if(!c)return;close();typeof c[1]==="function"?c[1]():c[1][0]==="#"?location.hash=c[1]:open(c[1],"_blank","noopener")}
function openP(){pal.hidden=false;inp.value="";draw();inp.focus()}function close(){pal.hidden=true}
$("#palette-btn").onclick=openP;
addEventListener("keydown",e=>{
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){e.preventDefault();pal.hidden?openP():close()}
  if(pal.hidden)return;
  if(e.key==="Escape")close();
  if(e.key==="ArrowDown"||e.key==="ArrowUp"){e.preventDefault();sel=(sel+(e.key==="ArrowDown"?1:-1)+shown.length)%shown.length;$$("li",list).forEach((l,i)=>l.classList.toggle("sel",i===sel))}
  if(e.key==="Enter")run(sel)});
inp.oninput=draw;list.onclick=e=>{const l=e.target.closest("li[data-i]");if(l)run(+l.dataset.i)};pal.onclick=e=>{if(e.target===pal)close()};