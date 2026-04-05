import { useState, useCallback, useRef } from "react";

// ─── USERS ────────────────────────────────────────────────────────────────────
const USERS = [
  { username: "adeel",      password: "WellnessTech2024!", role: "Admin",   name: "Adeel Niaz"        },
  { username: "backoffice", password: "MedNec2024!",       role: "Staff",   name: "Back Office Staff"  },
  { username: "manager",    password: "Manager2024!",      role: "Manager", name: "Practice Manager"   },
];

// ─── WT LOGO ──────────────────────────────────────────────────────────────────
function WTLogo({ size = 56 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="wtg1" x1="0" y1="0" x2="56" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00d4ff"/><stop offset="50%" stopColor="#0ea5e9"/><stop offset="100%" stopColor="#7c5cfc"/>
        </linearGradient>
        <linearGradient id="wtg2" x1="0" y1="0" x2="56" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.2"/><stop offset="100%" stopColor="#7c5cfc" stopOpacity="0.2"/>
        </linearGradient>
      </defs>
      <path d="M28 2 L52 15.5 L52 40.5 L28 54 L4 40.5 L4 15.5 Z" fill="url(#wtg2)" stroke="url(#wtg1)" strokeWidth="1.5"/>
      <path d="M13 18 L18 36 L23 24 L28 36 L33 18" stroke="url(#wtg1)" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <path d="M33 22 L46 22 M39.5 22 L39.5 38" stroke="url(#wtg1)" strokeWidth="2.8" strokeLinecap="round" fill="none"/>
      <path d="M10 44 L18 44 L21 39 L24 49 L27 41 L30 44 L46 44" stroke="url(#wtg1)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.8"/>
    </svg>
  );
}

function Particles() {
  const dots = Array.from({length:20},(_,i)=>({x:Math.random()*100,y:Math.random()*100,size:Math.random()*3+1,delay:Math.random()*4,duration:Math.random()*3+3,color:i%3===0?"#00d4ff":i%3===1?"#7c5cfc":"#0ea5e9"}));
  return (
    <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none"}}>
      {dots.map((d,i)=>(<div key={i} style={{position:"absolute",left:`${d.x}%`,top:`${d.y}%`,width:d.size,height:d.size,borderRadius:"50%",background:d.color,opacity:0.4,animation:`floatDot ${d.duration}s ease-in-out ${d.delay}s infinite alternate`}}/>))}
      <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",opacity:0.04}} xmlns="http://www.w3.org/2000/svg"><defs><pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M 60 0 L 0 0 0 60" fill="none" stroke="#00d4ff" strokeWidth="1"/></pattern></defs><rect width="100%" height="100%" fill="url(#grid)"/></svg>
      <div style={{position:"absolute",top:"20%",left:"15%",width:300,height:300,borderRadius:"50%",background:"radial-gradient(circle,#7c5cfc22 0%,transparent 70%)",animation:"orbPulse 6s ease-in-out infinite"}}/>
      <div style={{position:"absolute",bottom:"20%",right:"15%",width:250,height:250,borderRadius:"50%",background:"radial-gradient(circle,#00d4ff18 0%,transparent 70%)",animation:"orbPulse 8s ease-in-out 2s infinite"}}/>
    </div>
  );
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [username,setUsername]=useState(""); const [password,setPassword]=useState("");
  const [error,setError]=useState(""); const [loading,setLoading]=useState(false); const [showPw,setShowPw]=useState(false); const [focused,setFocused]=useState("");
  const handleLogin = async () => {
    if (!username||!password){setError("Please enter username and password.");return;}
    setLoading(true);setError("");
    await new Promise(r=>setTimeout(r,900));
    const user=USERS.find(u=>u.username.toLowerCase()===username.toLowerCase()&&u.password===password);
    if(user){onLogin(user);}else{setError("Invalid username or password.");setLoading(false);}
  };
  return (
    <div style={LS.root}>
      <Particles/>
      <div style={LS.leftPanel}>
        <div style={LS.brandWrap}>
          <WTLogo size={72}/>
          <div style={LS.brandName}>Wellness Tech</div>
          <div style={LS.brandTagline}>Healthcare Intelligence Platform</div>
          <div style={LS.brandDivider}/>
          <div style={LS.featureList}>
            {[{icon:"🧠",label:"ANS Testing Eligibility"},{icon:"🦵",label:"ABI Vascular Screening"},{icon:"📋",label:"ICD-10 Auto-Mapping"},{icon:"💊",label:"CPT Billing by Insurance"},{icon:"✦",label:"AI Medical Necessity Letters"},{icon:"🏥",label:"Epic & eCW EMR Import"}].map(({icon,label})=>(
              <div key={label} style={LS.featureItem}><span style={LS.featureIcon}>{icon}</span><span style={LS.featureLabel}>{label}</span></div>
            ))}
          </div>
        </div>
        <div style={LS.brandFooter}><div style={LS.brandFooterText}>Powered by Wellness Tech USA</div><div style={LS.brandFooterSub}>wellnesstechusa.com</div></div>
      </div>
      <div style={LS.rightPanel}>
        <div style={LS.card}>
          <div style={LS.mobileLogoRow}><WTLogo size={40}/><div><div style={{fontSize:16,fontWeight:700,color:"#f0f4ff"}}>Wellness Tech</div><div style={{fontSize:10,color:"#4a5880",textTransform:"uppercase",letterSpacing:".5px"}}>Healthcare Intelligence</div></div></div>
          <div style={LS.cardHeader}><div style={LS.cardTitle}>Welcome Back</div><div style={LS.cardSub}>Sign in to MedNecessity AI</div></div>
          <div style={LS.form}>
            <div style={LS.fg}><label style={LS.lbl}>Username</label><div style={{position:"relative"}}><span style={LS.inputIcon}>👤</span><input style={{...LS.inp,paddingLeft:38,...(focused==="user"?LS.inpFocused:{})}} value={username} onChange={e=>setUsername(e.target.value)} placeholder="Enter your username" autoComplete="username" onFocus={()=>setFocused("user")} onBlur={()=>setFocused("")} onKeyDown={e=>e.key==="Enter"&&handleLogin()}/></div></div>
            <div style={LS.fg}><label style={LS.lbl}>Password</label><div style={{position:"relative"}}><span style={LS.inputIcon}>🔑</span><input style={{...LS.inp,paddingLeft:38,paddingRight:44,...(focused==="pw"?LS.inpFocused:{})}} type={showPw?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter your password" autoComplete="current-password" onFocus={()=>setFocused("pw")} onBlur={()=>setFocused("")} onKeyDown={e=>e.key==="Enter"&&handleLogin()}/><button style={LS.eyeBtn} onClick={()=>setShowPw(!showPw)}>{showPw?"🙈":"👁"}</button></div></div>
            {error&&<div style={LS.error}><span>⚠</span> {error}</div>}
            <button style={{...LS.btn,...(loading?LS.btnLoading:{})}} onClick={handleLogin} disabled={loading}>
              {loading?<><span style={{animation:"spin 1s linear infinite",display:"inline-block",marginRight:8}}>◌</span>Authenticating…</>:<><span>Sign In</span><span style={LS.btnArrow}>→</span></>}
            </button>
          </div>
          <div style={LS.footer}>
            <div style={LS.footerBadges}><span style={LS.footerBadge}>🔒 HIPAA Compliant</span><span style={LS.footerBadge}>🛡 Secure Access</span><span style={LS.footerBadge}>⚕ Clinical Grade</span></div>
            <div style={LS.footerCopy}>© 2025 Wellness Tech USA · All rights reserved</div>
          </div>
        </div>
      </div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}body{background:#020810;font-family:'DM Sans',sans-serif}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeLeft{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}}
        @keyframes floatDot{from{transform:translateY(0) scale(1);opacity:.3}to{transform:translateY(-20px) scale(1.5);opacity:.7}}
        @keyframes orbPulse{0%,100%{transform:scale(1);opacity:.6}50%{transform:scale(1.2);opacity:1}}
        @keyframes borderGlow{0%,100%{box-shadow:0 4px 24px #0ea5e930}50%{box-shadow:0 4px 32px #0ea5e960}}
        @media(max-width:768px){.ls-left{display:none!important}.ls-right{width:100%!important;max-width:100%!important;padding:24px 20px!important}.ls-mobile-logo{display:flex!important}}
      `}</style>
    </div>
  );
}
const LS = {
  root:{minHeight:"100vh",background:"linear-gradient(135deg,#020810 0%,#050d1a 50%,#020810 100%)",display:"flex",alignItems:"stretch",position:"relative",overflow:"hidden"},
  leftPanel:{flex:1,display:"flex",flexDirection:"column",justifyContent:"space-between",padding:"48px 52px",borderRight:"1px solid #0ea5e915",background:"linear-gradient(160deg,#0a1628 0%,#050d1a 100%)",className:"ls-left"},
  brandWrap:{animation:"fadeLeft .7s ease"},brandLogo:{marginBottom:20},
  brandName:{fontFamily:"'Syne',sans-serif",fontSize:36,fontWeight:800,background:"linear-gradient(135deg,#00d4ff,#0ea5e9,#7c5cfc)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",letterSpacing:"-.5px",lineHeight:1.1},
  brandTagline:{fontSize:14,color:"#4a7a9a",marginTop:6,marginBottom:32,letterSpacing:".3px"},
  brandDivider:{width:48,height:2,background:"linear-gradient(90deg,#00d4ff,#7c5cfc)",borderRadius:2,marginBottom:32},
  featureList:{display:"flex",flexDirection:"column",gap:14},
  featureItem:{display:"flex",alignItems:"center",gap:12},
  featureIcon:{width:32,height:32,borderRadius:8,background:"linear-gradient(135deg,#0ea5e915,#7c5cfc15)",border:"1px solid #1e3050",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,flexShrink:0},
  featureLabel:{fontSize:13,color:"#8899bb",fontWeight:500},
  brandFooter:{borderTop:"1px solid #0ea5e915",paddingTop:24},brandFooterText:{fontSize:12,color:"#4a6080",fontWeight:600},brandFooterSub:{fontSize:11,color:"#2a4060",marginTop:2},
  rightPanel:{width:480,display:"flex",alignItems:"center",justifyContent:"center",padding:"40px 32px"},
  card:{width:"100%",animation:"fadeUp .6s ease"},
  mobileLogoRow:{display:"none",alignItems:"center",gap:12,marginBottom:28,paddingBottom:24,borderBottom:"1px solid #1e2840"},
  cardHeader:{marginBottom:32},cardTitle:{fontFamily:"'Syne',sans-serif",fontSize:28,fontWeight:800,color:"#f0f4ff",letterSpacing:"-.5px"},cardSub:{fontSize:14,color:"#4a6080",marginTop:6},
  form:{display:"flex",flexDirection:"column",gap:18},fg:{display:"flex",flexDirection:"column",gap:7},
  lbl:{fontSize:11,color:"#6a88aa",textTransform:"uppercase",letterSpacing:".8px",fontWeight:600},
  inputIcon:{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",fontSize:15,opacity:.6,pointerEvents:"none"},
  inp:{width:"100%",background:"#0a1628",border:"1px solid #1a3050",borderRadius:11,padding:"13px 14px",color:"#e2e8f8",fontSize:14,outline:"none",fontFamily:"inherit",transition:"all .2s"},
  inpFocused:{border:"1px solid #0ea5e9",boxShadow:"0 0 0 3px #0ea5e915",background:"#0d1e36"},
  eyeBtn:{position:"absolute",right:13,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",fontSize:16,padding:4,opacity:.7},
  error:{display:"flex",alignItems:"center",gap:8,background:"#ff6b6b0f",border:"1px solid #ff6b6b33",borderRadius:10,padding:"11px 14px",fontSize:13,color:"#ff9a9a"},
  btn:{padding:"14px",background:"linear-gradient(135deg,#0ea5e9,#7c5cfc)",border:"none",borderRadius:11,color:"#fff",fontWeight:700,fontSize:15,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginTop:4,transition:"all .2s",animation:"borderGlow 3s ease infinite"},
  btnLoading:{opacity:.8,cursor:"not-allowed"},btnArrow:{fontSize:18,fontWeight:300,marginLeft:4},
  footer:{marginTop:28,paddingTop:20,borderTop:"1px solid #0d1e30"},
  footerBadges:{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12},footerBadge:{fontSize:10,color:"#4a6080",background:"#0a1628",border:"1px solid #1a3050",borderRadius:20,padding:"4px 10px"},
  footerCopy:{fontSize:11,color:"#2a4060",textAlign:"center"},
};

// ─── ICD CODES — From Wellness Tech Combination Codes Excel (944 validated combinations) ──
const ANS_ICD_CODES = [
  { code:"G90.3",   description:"Multi-System Autonomic Failure" },
  { code:"G90.09",  description:"Other Idiopathic Peripheral Autonomic Neuropathy" },
  { code:"G90.50",  description:"Complex Regional Pain Syndrome, Unspecified" },
  { code:"G90.511", description:"Complex Regional Pain Syndrome I, Right Upper Limb" },
  { code:"G90.512", description:"Complex Regional Pain Syndrome I, Left Upper Limb" },
  { code:"G90.513", description:"Complex Regional Pain Syndrome I, Upper Limb Bilateral" },
  { code:"G90.521", description:"Complex Regional Pain Syndrome I, Right Lower Limb" },
  { code:"G90.522", description:"Complex Regional Pain Syndrome I, Left Lower Limb" },
  { code:"G90.523", description:"Complex Regional Pain Syndrome I, Lower Limb Bilateral" },
  { code:"G90.59",  description:"Complex Regional Pain Syndrome I, Other Specified Site" },
  { code:"I95.1",   description:"Orthostatic Hypotension" },
  { code:"R55",     description:"Syncope and Collapse" },
  { code:"R61",     description:"Generalized Hyperhidrosis (Autonomic Dysfunction)" },
  { code:"R00.0",   description:"Tachycardia, Unspecified (Autonomic Dysfunction)" },
  { code:"E11.41",  description:"Type 2 Diabetes with Diabetic Mononeuropathy" },
  { code:"E11.42",  description:"Type 2 Diabetes with Diabetic Polyneuropathy" },
];
const ABI_ICD_CODES = [
  { code:"I73.9",   description:"Peripheral Vascular Disease, Unspecified" },
  { code:"I73.00",  description:"Raynaud's Syndrome without Gangrene" },
  { code:"I73.89",  description:"Other Specified Peripheral Vascular Diseases" },
  { code:"I70.0",   description:"Atherosclerosis of Aorta" },
  { code:"I70.201", description:"Atherosclerosis of Native Arteries, Right Leg" },
  { code:"I70.202", description:"Atherosclerosis of Native Arteries, Left Leg" },
  { code:"I70.203", description:"Atherosclerosis of Native Arteries, Bilateral Legs" },
  { code:"I70.208", description:"Atherosclerosis of Native Arteries, Other Extremity" },
  { code:"I70.211", description:"Atherosclerosis with Intermittent Claudication, Right Leg" },
  { code:"I70.212", description:"Atherosclerosis with Intermittent Claudication, Left Leg" },
  { code:"I70.213", description:"Atherosclerosis with Intermittent Claudication, Bilateral" },
  { code:"I70.221", description:"Atherosclerosis with Rest Pain, Right Leg" },
  { code:"I70.222", description:"Atherosclerosis with Rest Pain, Left Leg" },
  { code:"I70.231", description:"Atherosclerosis with Ulceration, Right Leg" },
  { code:"I70.232", description:"Atherosclerosis with Ulceration, Left Leg" },
  { code:"I70.241", description:"Atherosclerosis with Gangrene, Right Leg" },
  { code:"I70.242", description:"Atherosclerosis with Gangrene, Left Leg" },
  { code:"I70.8",   description:"Atherosclerosis of Other Arteries" },
  { code:"I70.92",  description:"Chronic Total Occlusion of Artery of Extremity" },
  { code:"I71.33",  description:"Abdominal Aortic Aneurysm, Ruptured" },
  { code:"I71.41",  description:"Abdominal Aortic Aneurysm, without Rupture" },
  { code:"I72.1",   description:"Aneurysm of Renal Artery" },
  { code:"I72.4",   description:"Aneurysm of Artery of Lower Extremity" },
  { code:"I72.8",   description:"Aneurysm of Other Specified Arteries" },
  { code:"I74.09",  description:"Embolism and Thrombosis of Abdominal Aorta" },
  { code:"I74.2",   description:"Embolism and Thrombosis of Arteries of Upper Extremity" },
  { code:"I74.3",   description:"Embolism and Thrombosis of Arteries of Lower Extremity" },
  { code:"I74.5",   description:"Embolism and Thrombosis of Iliac Artery" },
  { code:"I77.1",   description:"Stricture of Artery" },
  { code:"I25.85",  description:"Coronary Artery Disease — Chronic Coronary Syndrome" },
  { code:"E11.51",  description:"Type 2 Diabetes with Diabetic Peripheral Angiopathy" },
  { code:"E11.59",  description:"Type 2 Diabetes with Other Circulatory Complications" },
  { code:"E10.52",  description:"Type 1 Diabetes with Diabetic Peripheral Angiopathy" },
  { code:"E10.59",  description:"Type 1 Diabetes with Other Circulatory Complications" },
  { code:"E08.52",  description:"Drug/Chemical Diabetes with Diabetic Peripheral Angiopathy" },
  { code:"E09.51",  description:"Drug-Induced Diabetes with Diabetic Peripheral Angiopathy" },
  { code:"E13.59",  description:"Other Diabetes with Other Circulatory Complications" },
];

// Validated trigger code sets from 944 combination codes (Excel import)
const ANS_TRIGGER_CODES = new Set([
  "E11.41","E11.42","E66.9","E78.5","G90.09","G90.3","G90.50",
  "G90.511","G90.512","G90.513","G90.521","G90.522","G90.523","G90.59",
  "I10","I95.1","R00.0","R42","R55","R61"
]);
const ABI_TRIGGER_CODES = new Set([
  "D64.9","E03.9","E08.52","E09.51","E10.52","E10.59","E11.22","E11.29",
  "E11.49","E11.51","E11.59","E11.65","E11.69","E11.8","E11.9","E13.59",
  "E13.9","E55.9","E66.01","E66.8","E66.9","E78.4","E78.49","E78.5",
  "F17.210","G45.8","G45.9","I10","I11.9","I12.9","I25.10","I25.85",
  "I48.11","I48.91","I50.32","I63.10","I63.49","I63.9","I65.22",
  "I70.0","I70.201","I70.202","I70.203","I70.208","I70.211","I70.212",
  "I70.213","I70.218","I70.221","I70.222","I70.231","I70.232","I70.241",
  "I70.242","I70.261","I70.262","I70.263","I70.268","I70.301","I70.401",
  "I70.411","I70.412","I70.421","I70.431","I70.461","I70.501","I70.511",
  "I70.521","I70.523","I70.531","I70.561","I70.601","I70.612","I70.691",
  "I70.791","I70.8","I70.92","I71.33","I71.41","I72.1","I72.4","I72.8",
  "I73.00","I73.89","I73.9","I74.09","I74.2","I74.3","I74.5","I77.1",
  "I83.90","I89.0","I96","K21.9","M15.9","M17.11","M19.90","M25.561",
  "M25.562","M54.9","N18.31","N18.32","N18.4","N18.6","R09.89","R20.0",
  "R26.81","R26.9","R51.9","R60.0","R73.03","Z48.812"
]);

// ✅ CORRECTED from Wellness Tech Billing Protocol Sheet
const ANS_CPT_CODES = [
  { code:"95921",    description:"ANS — Cardiovagal Innervation (Heart Rate Variability / Deep Breathing)", reimbursement:"$145–$175" },
  { code:"95923",    description:"ANS — Sympathetic Adrenergic / Cholinergic Testing (QSART / Sweat)",       reimbursement:"$185–$220" },
  { code:"99213",    description:"E&M Level 3 — Established Patient Follow Up",                              reimbursement:"$92–$125"  },
  { code:"99214",    description:"E&M Level 4 — Established Patient (Moderate Complexity)",                  reimbursement:"$135–$175" },
];
const ABI_CPT_CODES = [
  { code:"93923",    description:"ABI — Non-Invasive Physiologic Studies Bilateral (2 Units)",               reimbursement:"$120–$165" },
  { code:"93923-59", description:"ABI — Non-Invasive Physiologic Studies w/ Modifier 59 (2nd study)",        reimbursement:"$120–$165" },
  { code:"99213",    description:"E&M Level 3 — Established Patient Follow Up",                              reimbursement:"$92–$125"  },
  { code:"99214",    description:"E&M Level 4 — Established Patient (Moderate Complexity)",                  reimbursement:"$135–$175" },
];

// ─── INSURANCE BILLING RULES ──────────────────────────────────────────────────
const INSURANCE_RULES = [
  { payer:"Wellmed",                                                    ansCode:"❌ None — Do NOT bill ANS",  abiCode:"93923 × 2 Units",          note:"Bill ABI only — even if both performed", color:"#ff6b6b" },
  { payer:"Wellcare",                                                   ansCode:"95921 + 95923",              abiCode:"93923 × 2 Units",          note:"Bill both ANS and ABI",                  color:"#00d26a" },
  { payer:"Ambetter / Community HealthChoice / Centene",               ansCode:"95921 + 95923",              abiCode:"93923 × 2 Units",          note:"Bill both ANS and ABI",                  color:"#00d26a" },
  { payer:"All Other Insurance",                                        ansCode:"95921 + 95923",              abiCode:"93923 + 93923-Mod 59",     note:"Bill ANS + ABI twice (2nd with Mod 59)", color:"#4a9eff" },
];
// ⚠️ Do NOT bill ANS-ABI with Annual Wellness Visit same day

const ANS_KEYWORDS = [
  "autonomic","dysautonomia","syncope","orthostatic","hypotension","neuropathy",
  "diabetic neuropathy","autonomic neuropathy","pots","postural tachycardia",
  "heart rate variability","hrv","sweating","anhidrosis","hyperhidrosis",
  "vasovagal","fainting","dizziness","lightheadedness","multiple sclerosis",
  "parkinson","small fiber","peripheral neuropathy","cardiovagal","adrenergic",
  "valsalva","tilt table","qsart","diabetes","diabetic","type 1","type 2",
  "polyneuropathy","complex regional pain","crps","raynaud","g90","e11.4","e10.4",
];
const ABI_KEYWORDS = [
  "peripheral artery","peripheral vascular","pad","pvd","claudication",
  "intermittent claudication","rest pain","gangrene","ischemia","limb ischemia",
  "arterial","atherosclerosis","hypertension","hyperlipidemia","cholesterol",
  "smoking","tobacco","nicotine","diabetes","diabetic","angiopathy","wound healing",
  "non-healing wound","ulcer","toe ulcer","foot ulcer","poor circulation",
  "cold extremity","cold feet","cold legs","absent pulse","weak pulse",
  "femoral","popliteal","dorsalis pedis","posterior tibial","ankle brachial",
  "abi","vascular insufficiency","i73","i70","e11.5","e10.5",
];

// ─── PARSERS ──────────────────────────────────────────────────────────────────
function parseCCDA(xmlString) {
  try {
    const parser=new DOMParser(); const doc=parser.parseFromString(xmlString,"application/xml");
    if(doc.querySelector("parsererror"))return null;
    const getText=(el,sel)=>{const n=el.querySelector(sel);return n?n.textContent.trim():"";};
    const patient=doc.querySelector("patient"); let patientName="",patientDOB="",mrn="",gender="";
    if(patient){const given=getText(patient,"given"),family=getText(patient,"family");patientName=[family,given].filter(Boolean).join(", ");const dob=getText(patient,"birthTime");if(dob.length>=8)patientDOB=`${dob.slice(4,6)}/${dob.slice(6,8)}/${dob.slice(0,4)}`;gender=doc.querySelector("administrativeGenderCode")?.getAttribute("displayName")||"";}
    const idEl=doc.querySelector("patientRole id");if(idEl)mrn=idEl.getAttribute("extension")||idEl.getAttribute("root")||"";
    let provider="";const author=doc.querySelector("author assignedAuthor");if(author){const ag=getText(author,"given"),af=getText(author,"family");provider=[ag,af].filter(Boolean).join(" ")||getText(author,"representedOrganization name");}
    let visitDate="";const et=doc.querySelector("ClinicalDocument > effectiveTime");if(et){const v=et.getAttribute("value")||"";if(v.length>=8)visitDate=`${v.slice(4,6)}/${v.slice(6,8)}/${v.slice(0,4)}`;}
    const problems=[];doc.querySelectorAll("observation").forEach(obs=>{const v=obs.querySelector("value"),t=obs.querySelector("text");if(v){const code=v.getAttribute("code")||"";const display=v.getAttribute("displayName")||(t?t.textContent.trim():"");const sys=v.getAttribute("codeSystem")||"";if(code&&(sys.includes("2.16.840.1.113883.6.90")||/^[A-Z]\d/.test(code)))problems.push({code,display});}});
    const medications=[];doc.querySelectorAll("substanceAdministration").forEach(m=>{const name=getText(m,"originalText")||getText(m,"name");if(name)medications.push(name);});
    const vitals={};doc.querySelectorAll("observation").forEach(obs=>{const c=obs.querySelector("code"),v=obs.querySelector("value");if(!c||!v)return;const loinc=c.getAttribute("code")||"",val=v.getAttribute("value")||"",unit=v.getAttribute("unit")||"";const disp=(c.getAttribute("displayName")||"").toLowerCase();if(loinc==="8480-6"||disp.includes("systolic"))vitals.bpSystolic=`${val} ${unit}`.trim();if(loinc==="8462-4"||disp.includes("diastolic"))vitals.bpDiastolic=`${val} ${unit}`.trim();if(loinc==="29463-7"||disp.includes("weight"))vitals.weight=`${val} ${unit}`.trim();if(loinc==="8302-2"||disp.includes("height"))vitals.height=`${val} ${unit}`.trim();if(loinc==="8867-4"||disp.includes("heart rate"))vitals.heartRate=`${val} ${unit}`.trim();if(loinc==="59408-5"||disp.includes("oxygen"))vitals.o2sat=`${val}${unit}`.trim();});
    const narrativeText=[];doc.querySelectorAll("section text, section title").forEach(t=>narrativeText.push(t.textContent));
    const allText=[patientName,gender,problems.map(p=>`${p.code} ${p.display}`).join(" "),medications.join(" "),narrativeText.join(" ")].join(" ");
    return{patientName,patientDOB,gender,mrn,provider,visitDate,problems,medications,allergies:[],vitals,allText,source:"CCD/CCDA (Epic/eCW)"};
  }catch{return null;}
}
function parseHL7(raw) {
  try {
    const lines=raw.split(/\r?\n/).filter(Boolean);if(!lines[0].startsWith("MSH"))return null;
    const seg=id=>lines.find(l=>l.startsWith(id+"|"))||"";const field=(line,n)=>(line.split("|")[n]||"").trim();const comp=(str,n)=>(str.split("^")[n]||"").trim();
    const pid=seg("PID"),pv1=seg("PV1");const dg1=lines.filter(l=>l.startsWith("DG1|"));
    const nf=field(pid,5);const patientName=[comp(nf,0),comp(nf,1)].filter(Boolean).join(", ");
    const dobRaw=field(pid,7);const patientDOB=dobRaw.length>=8?`${dobRaw.slice(4,6)}/${dobRaw.slice(6,8)}/${dobRaw.slice(0,4)}`:"";
    const mrn=field(pid,3);const vdRaw=field(pv1,44)||field(pv1,45)||"";const visitDate=vdRaw.length>=8?`${vdRaw.slice(4,6)}/${vdRaw.slice(6,8)}/${vdRaw.slice(0,4)}`:"";
    const pvDoc=field(pv1,7);const provider=[comp(pvDoc,2),comp(pvDoc,1)].filter(Boolean).join(" ");
    const problems=dg1.map(l=>({code:comp(field(l,3),0),display:comp(field(l,3),1)||field(l,4)})).filter(p=>p.code);
    const allText=[patientName,problems.map(p=>`${p.code} ${p.display}`).join(" ")].join(" ");
    return{patientName,patientDOB,gender:"",mrn,provider,visitDate,problems,medications:[],allergies:[],vitals:{},allText,source:"HL7 v2 (eCW)"};
  }catch{return null;}
}

// ✅ FIXED: Smart file parser — handles Word docs, PDFs, any text file, single vs batch
function isRealCSV(raw, ext) {
  // Only treat as CSV if:
  // 1. File extension is .csv, AND
  // 2. First line looks like a proper header row (short fields, no special chars), AND
  // 3. All rows have a consistent number of comma-separated columns (3+), AND
  // 4. Does NOT contain clinical note patterns (special chars, long narrative sentences)
  if (ext !== "csv") return false;

  const lines = raw.trim().split(/\r?\n/).filter(l => l.trim());
  if (lines.length < 3) return false; // need at least header + 2 data rows

  // Check for special characters common in Word docs — disqualify immediately
  if (/[◆•●■▪►◄→←↑↓★☆♦♣♠♥]/.test(raw)) return false;

  // First line must look like a header: short comma-separated values, no long sentences
  const firstLine = lines[0];
  const cols = firstLine.split(",");
  if (cols.length < 3) return false; // need at least 3 columns
  if (cols.some(c => c.trim().split(" ").length > 4)) return false; // headers shouldn't be long sentences

  // All rows should have a consistent column count close to the header
  const headerCount = cols.length;
  const consistent = lines.slice(1, 6).every(l => {
    const c = l.split(",").length;
    return Math.abs(c - headerCount) <= 2; // allow slight variation
  });
  if (!consistent) return false;

  // Must have a patient/name/dob-like header
  const headerLower = firstLine.toLowerCase();
  const hasPatientHeader = headerLower.includes("patient") || headerLower.includes("name") ||
                           headerLower.includes("dob") || headerLower.includes("mrn") ||
                           headerLower.includes("appt") || headerLower.includes("visit");
  return hasPatientHeader;
}

function parseAnyFile(raw, filename) {
  const ext = (filename || "").split(".").pop().toLowerCase();

  // Strip special Word/PDF characters that corrupt plain text
  const cleaned = raw.replace(/[◆•●■▪►◄→←↑↓★☆♦♣♠♥\u25C6\u2022\u25CF\u25A0\uFFFD]/g, " ")
                     .replace(/\r\n/g, "\n");

  // 1. Try CCD/CCDA XML
  if (cleaned.trim().startsWith("<?xml") || cleaned.includes("ClinicalDocument")) {
    const p = parseCCDA(cleaned);
    if (p) return { type: "single", data: p };
  }

  // 2. Try HL7 v2
  if (cleaned.startsWith("MSH|")) {
    const p = parseHL7(cleaned);
    if (p) return { type: "single", data: p };
  }

  // 3. Only treat as CSV batch if it passes strict validation
  if (isRealCSV(raw, ext)) {
    const patients = parseCSVBatch(raw);
    if (patients && patients.length > 1) return { type: "batch", data: patients };
  }

  // 4. Everything else = single patient chart note (Word doc, PDF, TXT, progress note)
  const sourceLabel = ext === "docx" || ext === "doc" ? "Word Document"
                    : ext === "pdf"                   ? "PDF Export"
                    : ext === "csv"                   ? "Text File (CSV)"
                    : ext === "txt"                   ? "Text File"
                    : "Uploaded File";

  return {
    type: "single",
    data: {
      patientName: extractPatientName(cleaned) || "",
      patientDOB:  extractDOB(cleaned)         || "",
      visitDate:   extractDate(cleaned)         || "",
      provider:    extractProvider(cleaned)     || "",
      mrn:         extractMRN(cleaned)          || "",
      problems: [], medications: [], allergies: [], vitals: {},
      allText: cleaned,
      source: sourceLabel,
    }
  };
}

// Smart text extractors for unstructured notes
function extractPatientName(text) {
  const m = text.match(/(?:patient(?:\s+name)?|name)\s*:?\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,2})/i);
  return m ? m[1].trim() : "";
}
function extractDOB(text) {
  const m = text.match(/(?:dob|date of birth|born)\s*:?\s*(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})/i);
  return m ? m[1].trim() : "";
}
function extractDate(text) {
  const m = text.match(/(?:date|visit|appointment|appt)\s*:?\s*(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})/i);
  return m ? m[1].trim() : "";
}
function extractProvider(text) {
  const m = text.match(/(?:provider|physician|doctor|dr\.?|md)\s*:?\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,2})/i);
  return m ? m[1].trim() : "";
}
function extractMRN(text) {
  const m = text.match(/(?:mrn|chart\s*#?|patient\s*id|account)\s*:?\s*([A-Z0-9-]{4,20})/i);
  return m ? m[1].trim() : "";
}

function parseCSVBatch(raw) {
  const lines=raw.trim().split(/\r?\n/);if(lines.length<2)return null;
  const headers=lines[0].split(",").map(h=>h.replace(/"/g,"").trim().toLowerCase());
  const col=(row,...names)=>{for(const n of names){const i=headers.findIndex(h=>h.includes(n));if(i>=0)return(row[i]||"").replace(/"/g,"").trim();}return"";};
  const patients=[];
  for(let i=1;i<lines.length;i++){
    const row=lines[i].split(",");if(row.length<2)continue;
    const last=col(row,"last","lname","surname"),first=col(row,"first","fname","given");
    const name=last&&first?`${last}, ${first}`:col(row,"patient name","patient","name");
    patients.push({patientName:name||`Patient ${i}`,patientDOB:col(row,"dob","birth","born"),visitDate:col(row,"visit","appt","appointment","date","scheduled"),provider:col(row,"provider","physician","doctor","npi"),mrn:col(row,"mrn","chart","id","account"),gender:col(row,"gender","sex"),problems:[],medications:[],allergies:[],vitals:{},allText:lines[i],source:"CSV Batch"});
  }
  return patients.length?patients:null;
}

// ─── ELIGIBILITY ENGINE ───────────────────────────────────────────────────────
function detectEligibility(text) {
  const lower=text.toLowerCase();
  return{ansKeywords:ANS_KEYWORDS.filter(kw=>lower.includes(kw)),abiKeywords:ABI_KEYWORDS.filter(kw=>lower.includes(kw))};
}
function confidence(keywords) {
  if(keywords.length>=5)return{level:"HIGH",    pct:92,color:"#00d26a"};
  if(keywords.length>=3)return{level:"MODERATE",pct:74,color:"#f5a623"};
  if(keywords.length>=1)return{level:"LOW",     pct:48,color:"#ff6b6b"};
  return                      {level:"NONE",    pct:0, color:"#555"   };
}
function matchICD(problems,text,type) {
  const lower=text.toLowerCase();
  const pool=type==="ANS"?ANS_ICD_CODES:ABI_ICD_CODES;
  const triggerSet=type==="ANS"?ANS_TRIGGER_CODES:ABI_TRIGGER_CODES;

  // 1. From EMR problem list — direct ICD code match
  const fromDoc=(problems||[])
    .filter(p=>{
      const pCode=(p.code||"").trim();
      return pool.some(c=>c.code===pCode||c.code.startsWith(pCode.split(".")[0])) || triggerSet.has(pCode);
    })
    .map(p=>({
      code:p.code,
      description:p.display||pool.find(c=>c.code===p.code)?.description||p.code
    }));

  // 2. From trigger codes found in text (ICD codes mentioned in notes)
  const fromTrigger=pool.filter(c=>lower.includes(c.code.toLowerCase()));

  // 3. From keyword matching in description
  const fromKW=pool.filter(c=>
    c.description.toLowerCase().split(" ").some(w=>w.length>4&&lower.includes(w))
  );

  return[...new Map([...fromDoc,...fromTrigger,...fromKW].map(c=>[c.code,c])).values()].slice(0,8);
}

// Check if ANY trigger code from the validated combo set appears in the problem list
function hasTriggerCode(problems, type) {
  const triggerSet = type==="ANS" ? ANS_TRIGGER_CODES : ABI_TRIGGER_CODES;
  return (problems||[]).some(p => {
    const code = (p.code||"").trim();
    return triggerSet.has(code) || [...triggerSet].some(t => code.startsWith(t.split(".")[0]) && t.split(".")[0].length >= 3);
  });
}
function buildResult(parsed) {
  const{ansKeywords,abiKeywords}=detectEligibility(parsed.allText||"");
  const ansConf=confidence(ansKeywords),abiConf=confidence(abiKeywords);

  // Also check problem list against validated trigger code sets
  const ansFromCodes=hasTriggerCode(parsed.problems,"ANS");
  const abiFromCodes=hasTriggerCode(parsed.problems,"ABI");

  // Eligible if keywords found OR validated ICD trigger code present in problem list
  const ansEligible=ansConf.level!=="NONE"||ansFromCodes;
  const abiEligible=abiConf.level!=="NONE"||abiFromCodes;

  // Boost confidence if codes matched directly from problem list
  const finalAnsConf = ansFromCodes && ansConf.level==="NONE" ? {level:"MODERATE",pct:74,color:"#f5a623"} : ansConf;
  const finalAbiConf = abiFromCodes && abiConf.level==="NONE" ? {level:"MODERATE",pct:74,color:"#f5a623"} : abiConf;

  return{
    ...parsed,
    ansEligible, abiEligible,
    ansConf:finalAnsConf, abiConf:finalAbiConf,
    ansKeywords, abiKeywords,
    ansFromCodes, abiFromCodes,
    ansICD:matchICD(parsed.problems,parsed.allText,"ANS").slice(0,8),
    abiICD:matchICD(parsed.problems,parsed.allText,"ABI").slice(0,8),
    ansCPT:ANS_CPT_CODES, abiCPT:ABI_CPT_CODES,
    timestamp:new Date().toISOString()
  };
}
async function getAIInsight(rec) {
  try {
    const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:`You are a medical billing specialist for Wellness Tech focused on ANS and ABI testing. Use the correct CPT codes: ANS=95921+95923, ABI=93923×2. Note insurance rules: Wellmed=ABI only (no ANS), Wellcare/Ambetter=both ANS+ABI, All other=ANS+ABI with Mod 59 on second ABI. Do NOT bill ANS-ABI with Annual Wellness Visit. Format: 1) Clinical Findings 2) ANS Eligibility & Medical Necessity 3) ABI Eligibility & Medical Necessity 4) Insurance-Specific Billing Recommendation. Under 300 words.`,messages:[{role:"user",content:`Patient: ${rec.patientName}, DOB: ${rec.patientDOB}, Visit: ${rec.visitDate}\nSource: ${rec.source||"Manual"}\nEMR Diagnoses: ${(rec.problems||[]).map(p=>`${p.code} ${p.display}`).join("; ")||"none"}\nANS indicators: ${rec.ansKeywords.join(", ")||"none"}\nABI indicators: ${rec.abiKeywords.join(", ")||"none"}`}]})});
    const data=await res.json();return data.content?.find(b=>b.type==="text")?.text||"AI insight unavailable.";
  }catch{return"AI insight unavailable — manual review recommended.";}
}
function dl(content,name,type){const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([content],{type}));a.download=name;a.click();}
function exportTXT(rec,aiInsight) {
  const t=["MEDICAL NECESSITY REPORT","=".repeat(60),`Patient : ${rec.patientName}`,`DOB     : ${rec.patientDOB}`,`MRN     : ${rec.mrn||"N/A"}`,`Visit   : ${rec.visitDate}`,`Provider: ${rec.provider}`,`Source  : ${rec.source||"Manual"}`,"",`ANS ELIGIBLE : ${rec.ansEligible?"YES ("+rec.ansConf.level+")":"NO"}`,`ABI ELIGIBLE : ${rec.abiEligible?"YES ("+rec.abiConf.level+")":"NO"}`,"","EMR DIAGNOSES:",...(rec.problems||[]).map(p=>`  ${p.code} — ${p.display}`),"","RECOMMENDED ICD-10 — ANS:",...rec.ansICD.map(c=>`  ${c.code} — ${c.description}`),"","RECOMMENDED ICD-10 — ABI:",...rec.abiICD.map(c=>`  ${c.code} — ${c.description}`),"","RECOMMENDED CPT — ANS (95921 + 95923):",...rec.ansCPT.map(c=>`  ${c.code} — ${c.description}  [${c.reimbursement}]`),"","RECOMMENDED CPT — ABI (93923 × 2):",...rec.abiCPT.map(c=>`  ${c.code} — ${c.description}  [${c.reimbursement}]`),"","INSURANCE BILLING RULES:","  Wellmed: ABI only (93923 x2) — DO NOT bill ANS","  Wellcare / Ambetter / Centene: Both ANS (95921+95923) + ABI (93923 x2)","  All Other Insurance: ANS (95921+95923) + ABI (93923 + 93923-Mod 59)","  ⚠️  Do NOT bill ANS-ABI with Annual Wellness Visit same day","","AI MEDICAL NECESSITY NOTE:",aiInsight,"",`Generated: ${new Date().toLocaleString()} | MedNecessity AI — Wellness Tech`].join("\n");
  dl(t,`MedNecessity_${rec.patientName.replace(/\s/g,"_")}.txt`,"text/plain");
}
function exportCSV(patients) {
  const hdr=["Patient","DOB","MRN","Visit","Provider","Source","ANS Eligible","ANS Conf","ABI Eligible","ABI Conf","EMR ICD","ANS CPT","ABI CPT"];
  const rows=patients.map(r=>[r.patientName,r.patientDOB,r.mrn||"",r.visitDate,r.provider,r.source||"",r.ansEligible?"YES":"NO",r.ansConf.level,r.abiEligible?"YES":"NO",r.abiConf.level,(r.problems||[]).map(p=>p.code).join("|"),r.ansICD.map(c=>c.code).join("|"),r.abiICD.map(c=>c.code).join("|")]);
  dl([hdr,...rows].map(r=>r.map(v=>`"${v}"`).join(",")).join("\n"),`MedNecessity_${new Date().toISOString().slice(0,10)}.csv`,"text/csv");
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const[user,setUser]=useState(null);
  if(!user)return<LoginScreen onLogin={setUser}/>;
  return<MainApp user={user} onLogout={()=>setUser(null)}/>;
}

function MainApp({user,onLogout}) {
  const[page,setPage]=useState("engine"); // engine | dashboard | billing
  const[inputTab,setInputTab]=useState("emr");
  const[emrText,setEmrText]=useState("");
  const[patientName,setPatientName]=useState("");
  const[patientDOB,setPatientDOB]=useState("");
  const[visitDate,setVisitDate]=useState("");
  const[provider,setProvider]=useState("");
  const[isAnalyzing,setIsAnalyzing]=useState(false);
  const[result,setResult]=useState(null);
  const[aiInsight,setAiInsight]=useState("");
  const[aiLoading,setAiLoading]=useState(false);
  const[queue,setQueue]=useState([]);
  const[batchList,setBatchList]=useState([]);
  const[importLog,setImportLog]=useState(null);
  const[batchRunning,setBatchRunning]=useState(false);
  const[batchDone,setBatchDone]=useState(0);
  const importRef=useRef();

  const analyze=useCallback(async(override)=>{
    const base=override||{patientName,patientDOB,visitDate,provider,problems:[],medications:[],allergies:[],vitals:{},allText:emrText,source:"Manual Entry",mrn:""};
    if(!base.allText?.trim())return;
    setIsAnalyzing(true);setResult(null);setAiInsight("");
    await new Promise(r=>setTimeout(r,900));
    const rec=buildResult(base);setResult(rec);setIsAnalyzing(false);
    setQueue(prev=>[rec,...prev].slice(0,200));
    setAiLoading(true);setAiInsight(await getAIInsight(rec));setAiLoading(false);
    setPage("engine");
  },[emrText,patientName,patientDOB,visitDate,provider]);

  const handleImport=(e)=>{
    const file=e.target.files[0];if(!file)return;
    const reader=new FileReader();
    reader.onload=(ev)=>{
      const raw=ev.target.result;
      const parsed=parseAnyFile(raw,file.name);
      if(parsed.type==="batch"){
        setBatchList(parsed.data);setImportLog({type:"batch",source:"CSV Batch",count:parsed.data.length});setInputTab("batch");
      } else {
        const p=parsed.data;
        if(p.patientName)setPatientName(p.patientName);
        if(p.patientDOB)setPatientDOB(p.patientDOB);
        if(p.visitDate)setVisitDate(p.visitDate);
        if(p.provider)setProvider(p.provider);
        setEmrText(p.allText);
        setImportLog({type:"success",source:p.source,name:p.patientName||"(name not detected)",dob:p.patientDOB||"",mrn:p.mrn||"",problems:(p.problems||[]).length,meds:(p.medications||[]).length,vitals:Object.keys(p.vitals||{}).length});
        setInputTab("emr");
      }
    };
    reader.readAsText(file);e.target.value="";
  };

  const runBatch=async()=>{
    setBatchRunning(true);setBatchDone(0);const results=[];
    for(let i=0;i<batchList.length;i++){const rec=buildResult(batchList[i]);results.push(rec);setQueue(prev=>[rec,...prev].slice(0,500));setBatchDone(i+1);await new Promise(r=>setTimeout(r,60));}
    setBatchRunning(false);exportCSV(results);
  };

  const clearAll=()=>{setEmrText("");setResult(null);setAiInsight("");setImportLog(null);setPatientName("");setPatientDOB("");setVisitDate("");setProvider("");setBatchList([]);};

  return(
    <div style={S.root}>
      <header style={S.header}>
        <div style={S.logo}>
          <WTLogo size={30}/>
          <div>
            <div style={S.logoTitle} className="mn-logo-title">MedNecessity AI</div>
            <div style={S.logoSub} className="mn-logo-sub">ANS · ABI · ICD-10 · CPT · Epic &amp; eCW</div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          {/* Nav tabs */}
          <div style={S.navTabs} className="mn-nav-tabs">
            {[["engine","⚡ Engine"],["dashboard","📊 Dashboard"],["billing","💳 Billing Rules"]].map(([id,lbl])=>(
              <button key={id} style={{...S.navTab,...(page===id?S.navTabOn:{})}} onClick={()=>setPage(id)}>{lbl}</button>
            ))}
          </div>
          <div style={S.stats} className="mn-header-stats">
            {[["Charts",queue.length],["ANS",queue.filter(p=>p.ansEligible).length],["ABI",queue.filter(p=>p.abiEligible).length]].map(([l,v])=>(
              <div key={l} style={S.statPill}><b style={S.statN}>{v}</b>{l}</div>
            ))}
          </div>
          <div style={S.userPill}>
            <div style={{...S.userAvatar}}>{user.name[0]}</div>
            <span style={S.userName} className="mn-user-name">{user.name}</span>
            <span style={S.userRole} className="mn-user-role">{user.role}</span>
          </div>
          <button style={S.logoutBtn} className="mn-logout" onClick={onLogout}>Sign Out</button>
        </div>
      </header>

      {/* DASHBOARD PAGE */}
      {page==="dashboard"&&<DashboardPage queue={queue} onSelect={(p)=>{setResult(p);setAiInsight("");setPage("engine");}}/>}

      {/* BILLING RULES PAGE */}
      {page==="billing"&&<BillingRulesPage/>}

      {/* ENGINE PAGE */}
      {page==="engine"&&(
        <div style={S.layout} className="mn-layout">
          <div style={S.left} className="mn-left">
            <div style={S.card} className="mn-card">
              <div style={S.cardHd}>👤 Patient Information</div>
              <div style={S.grid2} className="mn-grid2">
                {[["Patient Name","text",patientName,setPatientName,"Last, First"],["Date of Birth","date",patientDOB,setPatientDOB,""],["Visit / Appt Date","date",visitDate,setVisitDate,""],["Provider / NPI","text",provider,setProvider,"Dr. Smith / NPI"]].map(([label,type,val,setter,ph])=>(
                  <div key={label} style={S.fg}><label style={S.lbl}>{label}</label><input style={S.inp} type={type} value={val} onChange={e=>setter(e.target.value)} placeholder={ph}/></div>
                ))}
              </div>
            </div>

            <div style={S.card} className="mn-card">
              <div style={S.tabRow}>
                {[["emr","📋 Chart Note"],["import","📥 Import"],["batch","📊 Batch"]].map(([id,lbl])=>(
                  <button key={id} style={{...S.tab,...(inputTab===id?S.tabOn:{})}} className="mn-tab" onClick={()=>setInputTab(id)}>{lbl}</button>
                ))}
              </div>

              {inputTab==="emr"&&<>
                <div style={S.cardHd}>📄 Paste Chart / SOAP Note</div>
                {importLog?.type==="success"&&<div style={S.banner}><div style={S.bannerTitle}>✓ {importLog.source} loaded</div><div style={S.bannerMeta}><b>{importLog.name}</b>{importLog.dob?` · DOB: ${importLog.dob}`:""}{importLog.mrn?` · MRN: ${importLog.mrn}`:""}<br/>{importLog.problems>0?`${importLog.problems} diagnoses · `:""}{importLog.meds>0?`${importLog.meds} medications · `:""}<span style={{color:"#8899bb"}}>Review chart text below then run analysis</span></div></div>}
                {importLog?.type==="plain"&&<div style={{...S.banner,borderColor:"#f5a62344"}}><div style={{...S.bannerTitle,color:"#f5a623"}}>⚠ File loaded — review and run analysis</div></div>}
                <textarea style={S.textarea} className="mn-textarea" value={emrText} onChange={e=>setEmrText(e.target.value)} placeholder={"Paste full EMR note, SOAP note, progress note, or problem list here...\n\nOr use 📥 Import to upload:\n• Word docs (.docx/.doc)\n• PDF exports (.pdf)\n• CCD/CCDA XML from Epic or eCW\n• HL7 files · CSV schedules · Text files"}/>
              </>}

              {inputTab==="import"&&<>
                <div style={S.cardHd}>📥 Import from Any Source</div>
                <div style={S.importGrid} className="mn-import-grid">
                  {[{emr:"Word Doc",fmt:"Progress Notes",ext:".docx/.doc",icon:"📝",hint:"Save as .txt then upload — full note text extracted"},
                    {emr:"Epic",fmt:"CCD/CCDA XML",ext:".xml",icon:"🏥",hint:"Chart Review → Share → Download CCD"},
                    {emr:"eClinicalWorks",fmt:"CCD/CCDA XML",ext:".xml",icon:"🖥",hint:"Patient Hub → Export → Continuity of Care"},
                    {emr:"eClinicalWorks",fmt:"HL7 v2",ext:".hl7",icon:"📨",hint:"Reports → Patient Export → HL7 Format"},
                    {emr:"Any EMR",fmt:"Schedule CSV",ext:".csv",icon:"📊",hint:"Export daily schedule for batch processing"},
                    {emr:"Any",fmt:"Plain Text / PDF",ext:".txt/.pdf",icon:"📄",hint:"Any text export or plain note file"},
                  ].map(({emr,fmt,ext,icon,hint})=>(
                    <div key={emr+fmt} style={S.impCard} onClick={()=>importRef.current?.click()}>
                      <div style={{fontSize:22,marginBottom:4}}>{icon}</div>
                      <div style={{fontSize:11,fontWeight:700,color:"#4a9eff"}}>{emr}</div>
                      <div style={{fontSize:10,color:"#c0cce8",marginTop:1}}>{fmt}</div>
                      <div style={{fontSize:9,color:"#4a5880",marginTop:3,lineHeight:1.4}}>{hint}</div>
                      <div style={{fontSize:9,fontFamily:"'JetBrains Mono',monospace",color:"#7c5cfc",marginTop:3}}>{ext}</div>
                    </div>
                  ))}
                </div>
                <input ref={importRef} type="file" accept=".xml,.hl7,.csv,.txt,.rtf,.ccd,.ccda,.doc,.docx,.pdf" style={{display:"none"}} onChange={handleImport}/>
                <button style={S.btnImport} onClick={()=>importRef.current?.click()}>⬆ Upload Any File (Word · PDF · XML · HL7 · CSV · TXT)</button>
                <div style={S.impNote}><b>💡 Tip for Word docs:</b> Open in Word → File → Save As → Plain Text (.txt) → Upload here. All note content will be extracted automatically.</div>
              </>}

              {inputTab==="batch"&&<>
                <div style={S.cardHd}>📊 Batch Patient Processing</div>
                {batchList.length===0?(
                  <div style={{textAlign:"center",padding:"20px 12px"}}>
                    <div style={{fontSize:36,marginBottom:8}}>📂</div>
                    <div style={{color:"#8899bb",fontWeight:600,marginBottom:4}}>No batch file loaded</div>
                    <div style={{color:"#4a5880",fontSize:12,marginBottom:12}}>Upload a CSV schedule export from eCW or Epic</div>
                    <button style={S.btnImport} onClick={()=>setInputTab("import")}>Go to Import →</button>
                  </div>
                ):<>
                  <div style={{...S.banner,marginBottom:10}}><div style={S.bannerTitle}>✓ {batchList.length} patients loaded</div><div style={S.bannerMeta}>Click Run Batch to process all and export CSV.</div></div>
                  <div style={{display:"flex",flexDirection:"column",gap:4,marginBottom:10}}>
                    {batchList.slice(0,6).map((p,i)=>(<div key={i} style={S.bRow}><span style={{color:"#4a5880",fontWeight:600,fontSize:11}}>{i+1}</span><span style={{flex:1,color:"#c0cce8",fontSize:12}}>{p.patientName}</span><span style={{color:"#5a6880",fontSize:11}}>{p.visitDate||"—"}</span></div>))}
                    {batchList.length>6&&<div style={{color:"#4a5880",fontSize:11,padding:"4px 8px"}}>+{batchList.length-6} more…</div>}
                  </div>
                  {batchRunning?(
                    <div><div style={{height:5,background:"#1a2235",borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",background:"linear-gradient(90deg,#7c5cfc,#0ea5e9)",borderRadius:3,width:`${(batchDone/batchList.length)*100}%`,transition:"width .3s"}}/></div><div style={{color:"#8899bb",fontSize:12,marginTop:5,textAlign:"center"}}>Processing {batchDone}/{batchList.length}…</div></div>
                  ):(<button style={S.btnPrimary} onClick={runBatch}>⚡ Run Batch — {batchList.length} Patients → Export CSV</button>)}
                </>}
              </>}

              {inputTab!=="batch"&&(
                <div style={S.btnRow}>
                  <button style={S.btnPrimary} onClick={()=>analyze()} disabled={isAnalyzing||!emrText.trim()}>
                    {isAnalyzing?<><span style={{animation:"spin 1s linear infinite",display:"inline-block"}}>◌</span> Analyzing…</>:"⚡ Run Eligibility Analysis"}
                  </button>
                  <button style={S.btnSec} onClick={clearAll}>Clear</button>
                </div>
              )}
            </div>

            {queue.length>0&&(
              <div style={S.card} className="mn-card" id="mn-queue">
                <div style={S.cardHd}>👥 Patient Queue ({queue.length})</div>
                <div style={{display:"flex",flexDirection:"column",gap:5}}>
                  {queue.slice(0,8).map((p,i)=>(<div key={i} style={S.qItem} onClick={()=>{setResult(p);setAiInsight("");window.scrollTo(0,0);}}><div style={{flex:1}}><div style={{fontSize:13,fontWeight:500,color:"#e2e8f8"}}>{p.patientName||"Unknown"}</div><div style={{fontSize:10,color:"#4a5880"}}>{p.source} · {p.visitDate||"—"}</div></div><div style={{display:"flex",gap:4}}>{p.ansEligible&&<span style={S.bANS}>ANS</span>}{p.abiEligible&&<span style={S.bABI}>ABI</span>}</div></div>))}
                  {queue.length>1&&<button style={{...S.btnSec,marginTop:4,fontSize:11}} onClick={()=>exportCSV(queue)}>⬇ Export All {queue.length} as CSV</button>}
                </div>
              </div>
            )}
          </div>

          <div style={S.right} className="mn-right">
            {!result&&!isAnalyzing&&<EmptyState/>}
            {isAnalyzing&&<LoadingState/>}
            {result&&!isAnalyzing&&(<ResultPanel rec={result} aiInsight={aiInsight} aiLoading={aiLoading} onTXT={()=>exportTXT(result,aiInsight)} onCSV={()=>exportCSV([result])} onClear={clearAll}/>)}
          </div>
        </div>
      )}

      {/* Mobile Bottom Nav */}
      <nav className="mn-bottom-nav">
        {[{icon:"⚡",label:"Engine",pg:"engine"},{icon:"📊",label:"Dashboard",pg:"dashboard"},{icon:"💳",label:"Billing",pg:"billing"},{icon:"📥",label:"Import",action:()=>{setPage("engine");setInputTab("import");}},{icon:"👥",label:"Queue",action:()=>{setPage("engine");document.getElementById("mn-queue")?.scrollIntoView({behavior:"smooth"});}}].map(({icon,label,pg,action})=>(
          <button key={label} className={`mn-bottom-nav-btn${page===pg?" active":""}`} onClick={action||(()=>setPage(pg))}>
            <span className="icon">{icon}</span>{label}
          </button>
        ))}
      </nav>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}body{background:#080c14;-webkit-text-size-adjust:100%}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes shimmer{0%{background-position:-300px 0}100%{background-position:300px 0}}
        @keyframes ring{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.18);opacity:.5}}
        input,textarea,button{-webkit-appearance:none;font-family:inherit}
        input[type=date]::-webkit-calendar-picker-indicator{filter:invert(.5)}
        @media(max-width:768px){
          .mn-layout{flex-direction:column!important;height:auto!important;padding-bottom:70px}
          .mn-left{width:100%!important;min-width:unset!important;border-right:none!important;border-bottom:1px solid #1e2840!important;padding:10px!important}
          .mn-right{padding:10px!important}
          .mn-header-stats{display:none!important}
          .mn-nav-tabs{display:none!important}
          .mn-logo-sub{display:none!important}
          .mn-logo-title{font-size:14px!important}
          .mn-grid2{grid-template-columns:1fr 1fr!important}
          .mn-code-section{grid-template-columns:1fr!important}
          .mn-conf-row{grid-template-columns:1fr 1fr!important}
          .mn-summ-bar{flex-direction:column!important;gap:8px!important}
          .mn-export-row{flex-direction:column!important;gap:8px!important}
          .mn-export-row button{width:100%!important}
          .mn-tab{font-size:10px!important;padding:6px 4px!important}
          .mn-textarea{height:100px!important}
          .mn-import-grid{grid-template-columns:1fr 1fr!important}
          .mn-bottom-nav{display:flex!important}
          .mn-user-name,.mn-user-role{display:none!important}
          .mn-logout{font-size:10px!important;padding:5px 10px!important}
          .mn-card{padding:10px!important}
          .mn-empty{padding:20px 10px!important}
        }
        @media(max-width:420px){
          .mn-grid2{grid-template-columns:1fr!important}
          .mn-conf-row{grid-template-columns:1fr!important}
          .mn-import-grid{grid-template-columns:1fr 1fr!important}
        }
        .mn-bottom-nav{display:none;position:fixed;bottom:0;left:0;right:0;background:#0d1220;border-top:1px solid #1e2840;z-index:200;padding:6px 0 max(8px,env(safe-area-inset-bottom))}
        .mn-bottom-nav-btn{flex:1;display:flex;flex-direction:column;align-items:center;gap:2px;padding:4px 6px;background:none;border:none;color:#5a6880;cursor:pointer;font-size:9px;text-transform:uppercase;letter-spacing:.5px;font-weight:600}
        .mn-bottom-nav-btn.active{color:#0ea5e9}
        .mn-bottom-nav-btn .icon{font-size:18px}
      `}</style>
    </div>
  );
}

// ─── DASHBOARD PAGE ───────────────────────────────────────────────────────────
function DashboardPage({queue,onSelect}) {
  const ans=queue.filter(p=>p.ansEligible).length;
  const abi=queue.filter(p=>p.abiEligible).length;
  const both=queue.filter(p=>p.ansEligible&&p.abiEligible).length;
  const neither=queue.filter(p=>!p.ansEligible&&!p.abiEligible).length;
  const high=queue.filter(p=>p.ansConf?.level==="HIGH"||p.abiConf?.level==="HIGH").length;
  return(
    <div style={{padding:20,overflowY:"auto",height:"calc(100vh - 57px)",paddingBottom:80}}>
      <div style={{fontSize:18,fontWeight:700,color:"#f0f4ff",marginBottom:4}}>📊 Practice Dashboard</div>
      <div style={{fontSize:12,color:"#4a5880",marginBottom:20}}>{queue.length} patients analyzed this session</div>
      {queue.length===0?(
        <div style={{textAlign:"center",padding:"60px 20px",color:"#4a5880"}}>
          <div style={{fontSize:48,marginBottom:12}}>📊</div>
          <div style={{fontSize:16,fontWeight:600,color:"#8899bb",marginBottom:6}}>No data yet</div>
          <div style={{fontSize:13}}>Run eligibility analysis on patients to see your dashboard.</div>
        </div>
      ):<>
        {/* Stats row */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12,marginBottom:20}}>
          {[
            {label:"Total Analyzed",value:queue.length,color:"#4a9eff",icon:"👥"},
            {label:"ANS Eligible",value:ans,color:"#7c5cfc",icon:"🧠"},
            {label:"ABI Eligible",value:abi,color:"#0ea5e9",icon:"🦵"},
            {label:"Both ANS+ABI",value:both,color:"#00d26a",icon:"✓"},
            {label:"High Confidence",value:high,color:"#f5a623",icon:"⭐"},
            {label:"Not Eligible",value:neither,color:"#ff6b6b",icon:"✗"},
          ].map(({label,value,color,icon})=>(
            <div key={label} style={{background:"#0d1220",border:`1px solid ${color}33`,borderTop:`3px solid ${color}`,borderRadius:12,padding:"14px 16px"}}>
              <div style={{fontSize:24,marginBottom:4}}>{icon}</div>
              <div style={{fontSize:28,fontWeight:700,color}}>{value}</div>
              <div style={{fontSize:11,color:"#5a6880",marginTop:2}}>{label}</div>
            </div>
          ))}
        </div>
        {/* Patient list */}
        <div style={{background:"#0d1220",border:"1px solid #1e2840",borderRadius:12,overflow:"hidden"}}>
          <div style={{padding:"12px 16px",borderBottom:"1px solid #1e2840",fontSize:11,fontWeight:600,color:"#8899bb",textTransform:"uppercase",letterSpacing:".8px"}}>All Patients This Session</div>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
              <thead><tr style={{background:"#111827"}}>
                {["Patient","Visit","Source","ANS","ABI","Confidence",""].map(h=>(<th key={h} style={{textAlign:"left",padding:"8px 12px",fontSize:10,textTransform:"uppercase",color:"#4a5880",borderBottom:"1px solid #1e2840"}}>{h}</th>))}
              </tr></thead>
              <tbody>
                {queue.map((p,i)=>(
                  <tr key={i} style={{borderBottom:"1px solid #1a2235",cursor:"pointer"}} onClick={()=>onSelect(p)}>
                    <td style={{padding:"9px 12px",color:"#e2e8f8",fontWeight:500}}>{p.patientName||"Unknown"}</td>
                    <td style={{padding:"9px 12px",color:"#8899bb"}}>{p.visitDate||"—"}</td>
                    <td style={{padding:"9px 12px",color:"#4a5880",fontSize:11}}>{p.source}</td>
                    <td style={{padding:"9px 12px"}}>{p.ansEligible?<span style={{color:"#00d26a",fontWeight:700}}>✓ YES</span>:<span style={{color:"#ff6b6b"}}>✗ NO</span>}</td>
                    <td style={{padding:"9px 12px"}}>{p.abiEligible?<span style={{color:"#00d26a",fontWeight:700}}>✓ YES</span>:<span style={{color:"#ff6b6b"}}>✗ NO</span>}</td>
                    <td style={{padding:"9px 12px"}}>
                      <span style={{color:p.ansEligible?p.ansConf.color:p.abiConf.color,fontSize:11,fontWeight:600}}>
                        {p.ansEligible?p.ansConf.level:p.abiEligible?p.abiConf.level:"NONE"}
                      </span>
                    </td>
                    <td style={{padding:"9px 12px"}}><span style={{color:"#4a9eff",fontSize:11}}>View →</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </>}
    </div>
  );
}

// ─── BILLING RULES PAGE ───────────────────────────────────────────────────────
function BillingRulesPage() {
  return(
    <div style={{padding:20,overflowY:"auto",height:"calc(100vh - 57px)",paddingBottom:80}}>
      <div style={{fontSize:18,fontWeight:700,color:"#f0f4ff",marginBottom:4}}>💳 Billing Protocol</div>
      <div style={{fontSize:12,color:"#4a5880",marginBottom:20}}>Wellness Tech — Insurance-Specific CPT Coding Rules</div>

      <div style={{background:"#ff6b6b18",border:"1px solid #ff6b6b44",borderRadius:10,padding:"12px 16px",marginBottom:20,fontSize:13,color:"#ff9a9a"}}>
        ⚠️ <b>IMPORTANT:</b> Do NOT bill ANS-ABI claim with Annual Wellness Visit (AWV) on the same day. Write-off ANS-ABI procedures balance if billed with O/V + AWV same day.
      </div>

      <div style={{display:"grid",gap:12,marginBottom:24}}>
        {INSURANCE_RULES.map((rule,i)=>(
          <div key={i} style={{background:"#0d1220",border:`1px solid ${rule.color}33`,borderLeft:`4px solid ${rule.color}`,borderRadius:12,padding:"16px 18px"}}>
            <div style={{fontSize:14,fontWeight:700,color:"#f0f4ff",marginBottom:10}}>{rule.payer}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:10}}>
              <div style={{background:"#111827",borderRadius:8,padding:"10px 12px"}}>
                <div style={{fontSize:10,color:"#4a5880",textTransform:"uppercase",letterSpacing:".5px",marginBottom:4}}>ANS CPT</div>
                <div style={{fontSize:13,fontWeight:600,color:rule.payer==="Wellmed"?"#ff6b6b":"#7c5cfc"}}>{rule.ansCode}</div>
              </div>
              <div style={{background:"#111827",borderRadius:8,padding:"10px 12px"}}>
                <div style={{fontSize:10,color:"#4a5880",textTransform:"uppercase",letterSpacing:".5px",marginBottom:4}}>ABI CPT</div>
                <div style={{fontSize:13,fontWeight:600,color:"#0ea5e9"}}>{rule.abiCode}</div>
              </div>
            </div>
            <div style={{fontSize:12,color:rule.color,fontWeight:500}}>📌 {rule.note}</div>
          </div>
        ))}
      </div>

      <div style={{background:"#0d1220",border:"1px solid #1e2840",borderRadius:12,padding:"16px 18px",marginBottom:16}}>
        <div style={{fontSize:13,fontWeight:700,color:"#f0f4ff",marginBottom:12}}>✅ Correct CPT Codes</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <div>
            <div style={{fontSize:11,color:"#7c5cfc",fontWeight:700,marginBottom:8,textTransform:"uppercase",letterSpacing:".5px"}}>🧠 ANS Testing</div>
            {ANS_CPT_CODES.map(c=>(<div key={c.code} style={{padding:"6px 0",borderBottom:"1px solid #1a2235"}}><span style={{fontFamily:"'JetBrains Mono',monospace",color:"#7c5cfc",fontWeight:600}}>{c.code}</span><span style={{color:"#8899bb",fontSize:11,marginLeft:8}}>{c.description.slice(0,45)}…</span></div>))}
          </div>
          <div>
            <div style={{fontSize:11,color:"#0ea5e9",fontWeight:700,marginBottom:8,textTransform:"uppercase",letterSpacing:".5px"}}>🦵 ABI Testing</div>
            {ABI_CPT_CODES.map(c=>(<div key={c.code} style={{padding:"6px 0",borderBottom:"1px solid #1a2235"}}><span style={{fontFamily:"'JetBrains Mono',monospace",color:"#0ea5e9",fontWeight:600}}>{c.code}</span><span style={{color:"#8899bb",fontSize:11,marginLeft:8}}>{c.description.slice(0,45)}…</span></div>))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── RESULT PANEL ─────────────────────────────────────────────────────────────
function ResultPanel({rec,aiInsight,aiLoading,onTXT,onCSV,onClear}) {
  return(
    <div style={{display:"flex",flexDirection:"column",gap:14,animation:"fadeUp .4s ease"}}>
      <div style={S.summBar} className="mn-summ-bar">
        <div>
          <div style={{fontSize:17,fontWeight:700,color:"#f0f4ff"}}>{rec.patientName||"Unknown Patient"}</div>
          <div style={{fontSize:11,color:"#5a6880",marginTop:2}}>DOB: {rec.patientDOB||"—"} · MRN: {rec.mrn||"—"} · Visit: {rec.visitDate||"—"} · {rec.provider||"—"}<span style={S.srcBadge}>{rec.source}</span></div>
        </div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {["ANS","ABI"].map(t=>{const eligible=rec[`${t.toLowerCase()}Eligible`];const conf=rec[`${t.toLowerCase()}Conf`];return(<div key={t} style={{display:"flex",alignItems:"center",gap:5,padding:"7px 12px",borderRadius:9,fontSize:12,fontWeight:600,...(eligible?{background:"#00d26a18",border:"1px solid #00d26a44",color:"#00d26a"}:{background:"#ff6b6b18",border:"1px solid #ff6b6b44",color:"#ff6b6b"})}}>{eligible?"✓":"✗"} {t} Eligible<span style={{fontSize:10,opacity:.8,background:"rgba(0,0,0,.25)",padding:"1px 5px",borderRadius:4}}>{conf.level}</span></div>);})}
        </div>
      </div>

      {(rec.problems||[]).length>0&&(<div style={S.card}><div style={S.cardHd}>🏥 Diagnoses from EMR ({rec.problems.length})</div><div style={{display:"flex",flexWrap:"wrap",gap:6}}>{rec.problems.map((p,i)=>(<div key={i} style={S.probChip}><span style={{fontFamily:"'JetBrains Mono',monospace",color:"#4a9eff",fontWeight:600}}>{p.code}</span><span style={{color:"#8899bb",marginLeft:6,fontSize:11}}>{p.display}</span></div>))}</div></div>)}

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}} className="mn-conf-row">
        {["ANS","ABI"].map(t=>{const conf=rec[`${t.toLowerCase()}Conf`];const kws=rec[`${t.toLowerCase()}Keywords`];return(<div key={t} style={S.confCard}><div style={{fontSize:11,fontWeight:600,color:"#8899bb",textTransform:"uppercase",letterSpacing:".8px",marginBottom:8}}>{t} Confidence</div><div style={{height:6,background:"#111827",borderRadius:3,overflow:"hidden",marginBottom:6}}><div style={{height:"100%",borderRadius:3,background:conf.color,width:`${conf.pct}%`,transition:"width 1s ease"}}/></div><div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:5}}><span style={{fontWeight:700,color:conf.color}}>{conf.level} ({conf.pct}%)</span><span style={{color:"#4a5880"}}>{kws.length} indicators</span></div><div style={{display:"flex",flexWrap:"wrap",gap:3}}>{kws.slice(0,6).map(kw=>(<span key={kw} style={{fontSize:9,background:"#111827",border:"1px solid #1e2840",borderRadius:4,padding:"1px 5px",color:"#6a7a9a"}}>{kw}</span>))}</div></div>);})}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}} className="mn-code-section">
        {rec.ansEligible&&<CodeTable title="ANS — ICD-10" codes={rec.ansICD} color="#7c5cfc" icon="🧠"/>}
        {rec.abiEligible&&<CodeTable title="ABI — ICD-10" codes={rec.abiICD} color="#0ea5e9" icon="🦵"/>}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}} className="mn-code-section">
        {rec.ansEligible&&<CodeTable title="ANS — CPT (95921+95923)" codes={rec.ansCPT} color="#7c5cfc" icon="💊" isCPT/>}
        {rec.abiEligible&&<CodeTable title="ABI — CPT (93923×2)" codes={rec.abiCPT} color="#0ea5e9" icon="🩺" isCPT/>}
      </div>

      {/* Insurance billing reminder */}
      <div style={{background:"#0a1628",border:"1px solid #1e3050",borderRadius:10,padding:"12px 14px"}}>
        <div style={{fontSize:11,fontWeight:700,color:"#4a9eff",textTransform:"uppercase",letterSpacing:".5px",marginBottom:8}}>💳 Insurance Billing Reminder</div>
        <div style={{display:"flex",flexDirection:"column",gap:5}}>
          {INSURANCE_RULES.map((r,i)=>(<div key={i} style={{fontSize:11,color:"#8899bb",display:"flex",gap:8,alignItems:"flex-start"}}><span style={{color:r.color,flexShrink:0,fontWeight:700}}>{r.payer}:</span><span>{r.ansCode} | ABI: {r.abiCode}</span></div>))}
          <div style={{fontSize:11,color:"#ff9a9a",marginTop:4}}>⚠️ Do NOT bill ANS-ABI with Annual Wellness Visit same day</div>
        </div>
      </div>

      <div style={S.aiBox}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}><span style={{color:"#7c5cfc",fontSize:16}}>✦</span><span style={{fontSize:11,fontWeight:700,color:"#c0b4ff",textTransform:"uppercase",letterSpacing:".7px",flex:1}}>AI Medical Necessity Documentation</span>{aiLoading&&<span style={{fontSize:11,color:"#7c5cfc",animation:"pulse 1.5s infinite"}}>Generating…</span>}</div>
        {aiLoading?<Skeleton/>:aiInsight?(<div style={{display:"flex",flexDirection:"column",gap:4}}>{aiInsight.split("\n").map((line,i)=>(<p key={i} style={line.match(/^\d\)/)?{fontSize:12,fontWeight:600,color:"#a8b8e8",marginTop:5}:{fontSize:12,color:"#8899bb",lineHeight:1.7}}>{line}</p>))}</div>):null}
      </div>

      <div style={{display:"flex",gap:8,paddingBottom:20,flexWrap:"wrap"}} className="mn-export-row">
        <button style={S.expBtn} onClick={onTXT}>⬇ Export Report (.txt)</button>
        <button style={S.expBtn} onClick={onCSV}>📊 Export CSV</button>
        <button style={{...S.btnSec,marginLeft:"auto"}} onClick={onClear}>+ New Patient</button>
      </div>
    </div>
  );
}

function CodeTable({title,codes,color,icon,isCPT}) {
  if(!codes.length)return null;
  return(<div style={{...S.card,borderTop:`2px solid ${color}44`}}><div style={{display:"flex",alignItems:"center",gap:6,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:".7px",marginBottom:8,color}}>{icon} {title}</div><table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}><thead><tr><th style={{textAlign:"left",padding:"3px 5px",fontSize:9,textTransform:"uppercase",color,borderBottom:"1px solid #1e2840"}}>Code</th><th style={{textAlign:"left",padding:"3px 5px",fontSize:9,textTransform:"uppercase",color:"#4a5880",borderBottom:"1px solid #1e2840"}}>Description</th>{isCPT&&<th style={{textAlign:"right",padding:"3px 5px",fontSize:9,textTransform:"uppercase",color:"#4a5880",borderBottom:"1px solid #1e2840"}}>Est. Reimb.</th>}</tr></thead><tbody>{codes.map((c,i)=>(<tr key={c.code} style={{background:i%2===0?"transparent":"#111827"}}><td style={{padding:"4px 5px",fontFamily:"'JetBrains Mono',monospace",color,fontWeight:600,whiteSpace:"nowrap",fontSize:11}}>{c.code}</td><td style={{padding:"4px 5px",color:"#c0cce8",lineHeight:1.4,fontSize:11}}>{c.description}</td>{isCPT&&<td style={{padding:"4px 5px",textAlign:"right",color:"#a8ff8a",fontFamily:"'JetBrains Mono',monospace",whiteSpace:"nowrap",fontSize:11}}>{c.reimbursement}</td>}</tr>))}</tbody></table></div>);
}
function Skeleton(){return(<div style={{display:"flex",flexDirection:"column",gap:7}}>{[100,80,93,67,85].map((w,i)=>(<div key={i} style={{height:11,borderRadius:5,width:`${w}%`,background:"linear-gradient(90deg,#1a2240 25%,#2a3460 50%,#1a2240 75%)",backgroundSize:"400px 100%",animation:"shimmer 1.5s infinite",animationDelay:`${i*.1}s`}}/>))}</div>);}
function EmptyState(){return(<div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",textAlign:"center",padding:40}} className="mn-empty"><div style={{fontSize:56,marginBottom:12}}>🧬</div><div style={{fontSize:17,fontWeight:700,color:"#c0cce8",marginBottom:6}}>MedNecessity AI Engine</div><div style={{fontSize:12,color:"#5a6880",maxWidth:460,lineHeight:1.85,marginBottom:20}}>Paste a chart note or upload any file — Word doc, PDF, CCD/CCDA, HL7, or CSV schedule.</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,textAlign:"left",maxWidth:420}} className="mn-empty-caps">{["Word Docs & PDFs","CCD/CCDA (Epic/eCW)","HL7 v2 (eCW)","CSV Batch Import","ANS Eligibility Detection","ABI Eligibility Detection","CPT Code Recommendations","AI Medical Necessity Letter"].map(c=>(<div key={c} style={{fontSize:11,color:"#4a9eff",background:"#0a1628",border:"1px solid #1e2840",borderRadius:6,padding:"5px 9px"}}>✓ {c}</div>))}</div></div>);}
function LoadingState(){return(<div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",gap:16}}><div style={{position:"relative",width:70,height:70}}><div style={{position:"absolute",inset:0,borderRadius:"50%",border:"2px solid #7c5cfc",animation:"ring 1.5s ease-in-out infinite"}}/><div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,color:"#7c5cfc"}}>⚕</div></div><div style={{fontSize:15,fontWeight:600,color:"#c0cce8"}}>Analyzing Chart Data…</div><div style={{display:"flex",flexDirection:"column",gap:5}}>{["Reading clinical indicators","Mapping ICD-10 codes","Applying billing rules","Generating AI documentation"].map((s,i)=>(<div key={s} style={{fontSize:11,color:"#4a5880",animation:"pulse 1.5s ease-in-out infinite",animationDelay:`${i*.3}s`}}>● {s}</div>))}</div></div>);}

const S={
  root:{fontFamily:"'DM Sans',sans-serif",background:"#080c14",minHeight:"100vh",color:"#e2e8f8"},
  header:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 18px",background:"#0d1220",borderBottom:"1px solid #1e2840",position:"sticky",top:0,zIndex:100,flexWrap:"wrap",gap:8},
  logo:{display:"flex",alignItems:"center",gap:10},
  logoTitle:{fontSize:16,fontWeight:700,letterSpacing:"-.3px",color:"#f0f4ff"},
  logoSub:{fontSize:9,color:"#4a5880",letterSpacing:".5px",textTransform:"uppercase"},
  navTabs:{display:"flex",gap:4},
  navTab:{padding:"5px 12px",borderRadius:7,border:"1px solid #1e2840",background:"transparent",color:"#5a6880",cursor:"pointer",fontSize:11,fontFamily:"inherit",fontWeight:500},
  navTabOn:{background:"#161f33",color:"#e2e8f8",borderColor:"#2a3a60"},
  stats:{display:"flex",gap:6},
  statPill:{background:"#111827",border:"1px solid #1e2840",borderRadius:20,padding:"3px 10px",fontSize:11,color:"#8899bb"},
  statN:{color:"#e2e8f8",fontWeight:700,marginRight:3},
  userPill:{display:"flex",alignItems:"center",gap:7,background:"#111827",border:"1px solid #1e2840",borderRadius:20,padding:"4px 10px"},
  userAvatar:{width:20,height:20,borderRadius:"50%",background:"linear-gradient(135deg,#7c5cfc,#0ea5e9)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"#fff"},
  userName:{fontSize:11,color:"#c0cce8",fontWeight:600},
  userRole:{fontSize:9,color:"#4a5880",background:"#0d1220",padding:"1px 5px",borderRadius:4},
  logoutBtn:{padding:"5px 11px",background:"transparent",border:"1px solid #2a3a60",borderRadius:7,color:"#8899bb",cursor:"pointer",fontSize:11,fontFamily:"inherit"},
  layout:{display:"flex",height:"calc(100vh - 57px)"},
  left:{width:375,minWidth:340,borderRight:"1px solid #1e2840",overflowY:"auto",padding:12,display:"flex",flexDirection:"column",gap:10},
  right:{flex:1,overflowY:"auto",padding:16},
  card:{background:"#0d1220",border:"1px solid #1e2840",borderRadius:12,padding:14},
  cardHd:{fontSize:10,fontWeight:600,color:"#8899bb",textTransform:"uppercase",letterSpacing:".8px",marginBottom:10},
  grid2:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8},
  fg:{display:"flex",flexDirection:"column",gap:3},
  lbl:{fontSize:9,color:"#5a6880",textTransform:"uppercase",letterSpacing:".5px"},
  inp:{background:"#111827",border:"1px solid #1e2840",borderRadius:7,padding:"7px 9px",color:"#e2e8f8",fontSize:12,outline:"none",fontFamily:"inherit"},
  tabRow:{display:"flex",gap:3,marginBottom:10},
  tab:{flex:1,padding:"6px 6px",borderRadius:7,border:"1px solid #1e2840",background:"transparent",color:"#5a6880",cursor:"pointer",fontSize:11,fontFamily:"inherit",fontWeight:500},
  tabOn:{background:"#161f33",color:"#e2e8f8",borderColor:"#2a3a60"},
  textarea:{width:"100%",height:140,background:"#111827",border:"1px solid #1e2840",borderRadius:8,padding:10,color:"#e2e8f8",fontSize:12,resize:"vertical",outline:"none",fontFamily:"'DM Sans',sans-serif",lineHeight:1.6},
  btnRow:{display:"flex",gap:7,marginTop:10},
  btnPrimary:{flex:1,padding:"10px 12px",background:"linear-gradient(135deg,#7c5cfc,#0ea5e9)",border:"none",borderRadius:9,color:"#fff",fontWeight:700,cursor:"pointer",fontSize:13,fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:5},
  btnSec:{padding:"10px 12px",background:"#111827",border:"1px solid #1e2840",borderRadius:9,color:"#8899bb",cursor:"pointer",fontSize:12,fontFamily:"inherit"},
  btnImport:{width:"100%",padding:"9px",background:"#111827",border:"1px dashed #2a3a60",borderRadius:9,color:"#8899bb",cursor:"pointer",fontSize:12,fontFamily:"inherit",marginTop:7},
  banner:{background:"#0a1a12",border:"1px solid #00d26a33",borderRadius:8,padding:"9px 11px",marginBottom:9},
  bannerTitle:{fontSize:11,fontWeight:600,color:"#00d26a"},
  bannerMeta:{fontSize:10,color:"#4a7a5a",marginTop:2,lineHeight:1.6},
  importGrid:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginBottom:4},
  impCard:{background:"#111827",border:"1px solid #1e2840",borderRadius:9,padding:"9px 10px",cursor:"pointer"},
  impNote:{fontSize:10,color:"#4a5880",lineHeight:1.7,marginTop:7,padding:"9px 10px",background:"#0a1020",borderRadius:8,border:"1px solid #1a2235"},
  bRow:{display:"grid",gridTemplateColumns:"20px 1fr auto",gap:7,alignItems:"center",background:"#111827",borderRadius:6,padding:"5px 7px"},
  qItem:{display:"flex",alignItems:"center",gap:7,padding:"7px 9px",background:"#111827",borderRadius:8,cursor:"pointer",border:"1px solid #1a2235"},
  bANS:{fontSize:9,fontWeight:700,padding:"2px 5px",borderRadius:4,background:"#7c5cfc22",color:"#c0a0ff",border:"1px solid #7c5cfc44"},
  bABI:{fontSize:9,fontWeight:700,padding:"2px 5px",borderRadius:4,background:"#0ea5e922",color:"#70d0ff",border:"1px solid #0ea5e944"},
  summBar:{background:"#0d1220",border:"1px solid #1e2840",borderRadius:12,padding:"12px 15px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10},
  srcBadge:{marginLeft:7,background:"#1a2840",border:"1px solid #2a3a60",borderRadius:4,padding:"1px 6px",fontSize:9,color:"#4a9eff"},
  confCard:{background:"#0d1220",border:"1px solid #1e2840",borderRadius:12,padding:12},
  probChip:{background:"#111827",border:"1px solid #1e2840",borderRadius:6,padding:"3px 8px",fontSize:11,display:"flex",alignItems:"center"},
  aiBox:{background:"#0a0e1a",border:"1px solid #2a1f5a",borderRadius:12,padding:14},
  expBtn:{padding:"8px 14px",background:"linear-gradient(135deg,#7c5cfc22,#0ea5e922)",border:"1px solid #2a3a60",borderRadius:9,color:"#c0cce8",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"inherit"},
};
