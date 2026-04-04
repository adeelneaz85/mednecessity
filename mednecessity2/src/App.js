import { useState, useCallback, useRef } from "react";

// ─── ICD / CPT Knowledge Base ────────────────────────────────────────────────
const ANS_ICD_CODES = [
  { code: "G90.3",  description: "Multi-System Autonomic Failure" },
  { code: "G90.09", description: "Other Idiopathic Peripheral Autonomic Neuropathy" },
  { code: "G90.1",  description: "Familial Dysautonomia [Riley-Day]" },
  { code: "G90.2",  description: "Horner's Syndrome" },
  { code: "G90.50", description: "Complex Regional Pain Syndrome" },
  { code: "G90.8",  description: "Other Disorders of Autonomic Nervous System" },
  { code: "G90.9",  description: "Disorder of Autonomic Nervous System, Unspecified" },
  { code: "R55",    description: "Syncope and Collapse" },
  { code: "I95.1",  description: "Orthostatic Hypotension" },
  { code: "G62.9",  description: "Polyneuropathy, Unspecified" },
  { code: "G60.0",  description: "Hereditary Motor and Sensory Neuropathy" },
  { code: "E11.40", description: "Type 2 Diabetes with Diabetic Neuropathy" },
  { code: "E11.43", description: "Type 2 Diabetes with Diabetic Autonomic Neuropathy" },
  { code: "E10.43", description: "Type 1 Diabetes with Diabetic Autonomic Neuropathy" },
  { code: "G35",    description: "Multiple Sclerosis" },
  { code: "G23.9",  description: "Parkinson's Disease (ANS involvement)" },
];
const ABI_ICD_CODES = [
  { code: "I73.9",   description: "Peripheral Vascular Disease, Unspecified" },
  { code: "I70.209", description: "Atherosclerosis of Native Arteries, Unspecified Extremity" },
  { code: "I70.219", description: "Atherosclerosis — Intermittent Claudication" },
  { code: "I70.229", description: "Atherosclerosis — Rest Pain" },
  { code: "I70.249", description: "Atherosclerosis with Gangrene" },
  { code: "I74.9",   description: "Embolism / Thrombosis of Arteries" },
  { code: "R02",     description: "Gangrene (Not Elsewhere Classified)" },
  { code: "I73.01",  description: "Raynaud's Syndrome with Gangrene" },
  { code: "E11.51",  description: "Type 2 Diabetes with Diabetic Peripheral Angiopathy" },
  { code: "E10.51",  description: "Type 1 Diabetes with Diabetic Peripheral Angiopathy" },
  { code: "Z82.49",  description: "Family History of Ischemic Heart Disease" },
  { code: "I10",     description: "Essential Hypertension (ABI screening)" },
  { code: "E78.5",   description: "Hyperlipidemia (ABI screening)" },
  { code: "Z87.891", description: "Personal History of Nicotine Dependence (PAD risk)" },
];
const ANS_CPT_CODES = [
  { code: "95923", description: "ANS — Thermoregulatory Sweat Test",                reimbursement: "$185–$220" },
  { code: "95924", description: "ANS — Cardiovagal Innervation (Deep Breathing)",   reimbursement: "$145–$175" },
  { code: "95925", description: "ANS — Sympathetic Adrenergic (QSART/Tilt Table)", reimbursement: "$160–$195" },
  { code: "95926", description: "ANS — Sympathetic Cholinergic (Sweat Measure)",   reimbursement: "$150–$185" },
  { code: "95943", description: "ANS — Complete Battery (Cardiovagal + Adrenergic)",reimbursement: "$280–$340" },
  { code: "93000", description: "ECG Interpretation (ANS workup)",                  reimbursement: "$25–$45"   },
  { code: "99213", description: "E&M Level 3 — Follow Up",                          reimbursement: "$92–$125"  },
  { code: "99214", description: "E&M Level 4 — Established Patient",                reimbursement: "$135–$175" },
];
const ABI_CPT_CODES = [
  { code: "93922", description: "ABI — Unilateral Non-Invasive Extremity Study",    reimbursement: "$85–$115"  },
  { code: "93923", description: "ABI — Bilateral Non-Invasive Extremity Study",     reimbursement: "$120–$165" },
  { code: "93924", description: "ABI — Non-Invasive Physiologic Study (Complete)",  reimbursement: "$145–$195" },
  { code: "93925", description: "Duplex Scan Lower Extremity Arteries (Bilateral)", reimbursement: "$185–$235" },
  { code: "93926", description: "Duplex Scan Lower Extremity Arteries (Unilateral)",reimbursement: "$120–$155" },
  { code: "99213", description: "E&M Level 3 — Follow Up",                          reimbursement: "$92–$125"  },
  { code: "99214", description: "E&M Level 4 — Established Patient",                reimbursement: "$135–$175" },
  { code: "93000", description: "ECG (Baseline Cardiovascular)",                    reimbursement: "$25–$45"   },
];
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

// ─── CCD/CCDA XML Parser (Epic + eCW) ────────────────────────────────────────
function parseCCDA(xmlString) {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlString, "application/xml");
    if (doc.querySelector("parsererror")) return null;
    const getText = (el, sel) => { const n = el.querySelector(sel); return n ? n.textContent.trim() : ""; };

    const patient = doc.querySelector("patient");
    let patientName = "", patientDOB = "", mrn = "", gender = "";
    if (patient) {
      const given = getText(patient, "given"), family = getText(patient, "family");
      patientName = [family, given].filter(Boolean).join(", ");
      const dob = getText(patient, "birthTime");
      if (dob.length >= 8) patientDOB = `${dob.slice(4,6)}/${dob.slice(6,8)}/${dob.slice(0,4)}`;
      gender = doc.querySelector("administrativeGenderCode")?.getAttribute("displayName") || "";
    }
    const idEl = doc.querySelector("patientRole id");
    if (idEl) mrn = idEl.getAttribute("extension") || idEl.getAttribute("root") || "";

    let provider = "";
    const author = doc.querySelector("author assignedAuthor");
    if (author) {
      const ag = getText(author, "given"), af = getText(author, "family");
      provider = [ag, af].filter(Boolean).join(" ") || getText(author, "representedOrganization name");
    }

    let visitDate = "";
    const et = doc.querySelector("ClinicalDocument > effectiveTime");
    if (et) { const v = et.getAttribute("value") || ""; if (v.length >= 8) visitDate = `${v.slice(4,6)}/${v.slice(6,8)}/${v.slice(0,4)}`; }

    const problems = [];
    doc.querySelectorAll("observation").forEach(obs => {
      const v = obs.querySelector("value"), t = obs.querySelector("text");
      if (v) {
        const code = v.getAttribute("code") || "";
        const display = v.getAttribute("displayName") || (t ? t.textContent.trim() : "");
        const sys = v.getAttribute("codeSystem") || "";
        if (code && (sys.includes("2.16.840.1.113883.6.90") || /^[A-Z]\d/.test(code)))
          problems.push({ code, display });
      }
    });

    const medications = [];
    doc.querySelectorAll("substanceAdministration").forEach(m => {
      const name = getText(m, "originalText") || getText(m, "name");
      if (name) medications.push(name);
    });

    const vitals = {};
    doc.querySelectorAll("observation").forEach(obs => {
      const c = obs.querySelector("code"), v = obs.querySelector("value");
      if (!c || !v) return;
      const loinc = c.getAttribute("code") || "", val = v.getAttribute("value") || "", unit = v.getAttribute("unit") || "";
      const disp  = (c.getAttribute("displayName") || "").toLowerCase();
      if (loinc === "8480-6" || disp.includes("systolic"))   vitals.bpSystolic  = `${val} ${unit}`.trim();
      if (loinc === "8462-4" || disp.includes("diastolic"))  vitals.bpDiastolic = `${val} ${unit}`.trim();
      if (loinc === "29463-7"|| disp.includes("weight"))     vitals.weight      = `${val} ${unit}`.trim();
      if (loinc === "8302-2" || disp.includes("height"))     vitals.height      = `${val} ${unit}`.trim();
      if (loinc === "8867-4" || disp.includes("heart rate")) vitals.heartRate   = `${val} ${unit}`.trim();
      if (loinc === "59408-5"|| disp.includes("oxygen"))     vitals.o2sat       = `${val}${unit}`.trim();
    });

    const narrativeText = [];
    doc.querySelectorAll("section text, section title").forEach(t => narrativeText.push(t.textContent));

    const allText = [patientName, gender,
      problems.map(p => `${p.code} ${p.display}`).join(" "),
      medications.join(" "), narrativeText.join(" ")].join(" ");

    return { patientName, patientDOB, gender, mrn, provider, visitDate,
             problems, medications, allergies: [], vitals, allText, source: "CCD/CCDA (Epic/eCW)" };
  } catch { return null; }
}

// ─── HL7 v2 Parser (eCW) ─────────────────────────────────────────────────────
function parseHL7(raw) {
  try {
    const lines = raw.split(/\r?\n/).filter(Boolean);
    if (!lines[0].startsWith("MSH")) return null;
    const seg = id => lines.find(l => l.startsWith(id + "|")) || "";
    const field = (line, n) => (line.split("|")[n] || "").trim();
    const comp  = (str, n)  => (str.split("^")[n]  || "").trim();
    const pid = seg("PID"), pv1 = seg("PV1");
    const dg1 = lines.filter(l => l.startsWith("DG1|"));

    const nf = field(pid, 5);
    const patientName = [comp(nf,0), comp(nf,1)].filter(Boolean).join(", ");
    const dobRaw = field(pid, 7);
    const patientDOB = dobRaw.length >= 8 ? `${dobRaw.slice(4,6)}/${dobRaw.slice(6,8)}/${dobRaw.slice(0,4)}` : "";
    const mrn = field(pid, 3);
    const vdRaw = field(pv1, 44) || field(pv1, 45) || "";
    const visitDate = vdRaw.length >= 8 ? `${vdRaw.slice(4,6)}/${vdRaw.slice(6,8)}/${vdRaw.slice(0,4)}` : "";
    const pvDoc = field(pv1, 7);
    const provider = [comp(pvDoc,2), comp(pvDoc,1)].filter(Boolean).join(" ");
    const problems = dg1.map(l => ({ code: comp(field(l,3),0), display: comp(field(l,3),1)||field(l,4) })).filter(p=>p.code);
    const allText = [patientName, problems.map(p=>`${p.code} ${p.display}`).join(" ")].join(" ");

    return { patientName, patientDOB, gender:"", mrn, provider, visitDate,
             problems, medications: [], allergies: [], vitals: {}, allText, source: "HL7 v2 (eCW)" };
  } catch { return null; }
}

// ─── CSV Batch Parser (eCW / Epic Schedule) ───────────────────────────────────
function parseCSVBatch(raw) {
  const lines = raw.trim().split(/\r?\n/);
  if (lines.length < 2) return null;
  const headers = lines[0].split(",").map(h => h.replace(/"/g,"").trim().toLowerCase());
  const col = (row, ...names) => {
    for (const n of names) {
      const i = headers.findIndex(h => h.includes(n));
      if (i >= 0) return (row[i] || "").replace(/"/g,"").trim();
    }
    return "";
  };
  const patients = [];
  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(",");
    if (row.length < 2) continue;
    const last = col(row,"last","lname","surname"), first = col(row,"first","fname","given");
    const name = last && first ? `${last}, ${first}` : col(row,"patient name","patient","name");
    patients.push({
      patientName: name || `Patient ${i}`,
      patientDOB:  col(row,"dob","birth","born"),
      visitDate:   col(row,"visit","appt","appointment","date","scheduled"),
      provider:    col(row,"provider","physician","doctor","npi"),
      mrn:         col(row,"mrn","chart","id","account"),
      gender:      col(row,"gender","sex"),
      problems: [], medications: [], allergies: [], vitals: {},
      allText: lines[i], source: "CSV Batch",
    });
  }
  return patients.length ? patients : null;
}

// ─── Eligibility Engine ───────────────────────────────────────────────────────
function detectEligibility(text) {
  const lower = text.toLowerCase();
  return {
    ansKeywords: ANS_KEYWORDS.filter(kw => lower.includes(kw)),
    abiKeywords: ABI_KEYWORDS.filter(kw => lower.includes(kw)),
  };
}
function confidence(keywords) {
  if (keywords.length >= 5) return { level:"HIGH",     pct:92, color:"#00d26a" };
  if (keywords.length >= 3) return { level:"MODERATE", pct:74, color:"#f5a623" };
  if (keywords.length >= 1) return { level:"LOW",      pct:48, color:"#ff6b6b" };
  return                           { level:"NONE",     pct:0,  color:"#555"    };
}
function matchICD(problems, text, type) {
  const lower = text.toLowerCase();
  const pool  = type === "ANS" ? ANS_ICD_CODES : ABI_ICD_CODES;
  const fromDoc = (problems||[]).filter(p => pool.some(c => c.code.startsWith(p.code.split(".")[0])))
    .map(p => ({ code:p.code, description:p.display||pool.find(c=>c.code===p.code)?.description||p.code }));
  const fromKW  = pool.filter(c =>
    lower.includes(c.code.toLowerCase()) ||
    c.description.toLowerCase().split(" ").some(w => w.length > 3 && lower.includes(w))
  );
  return [...new Map([...fromDoc,...fromKW].map(c=>[c.code,c])).values()].slice(0,6);
}
function buildResult(parsed) {
  const { ansKeywords, abiKeywords } = detectEligibility(parsed.allText || "");
  const ansConf = confidence(ansKeywords), abiConf = confidence(abiKeywords);
  return {
    ...parsed,
    ansEligible: ansConf.level !== "NONE",
    abiEligible: abiConf.level !== "NONE",
    ansConf, abiConf, ansKeywords, abiKeywords,
    ansICD: matchICD(parsed.problems, parsed.allText, "ANS").slice(0,6),
    abiICD: matchICD(parsed.problems, parsed.allText, "ABI").slice(0,6),
    ansCPT: ANS_CPT_CODES.slice(0, ansConf.level==="HIGH" ? 5 : 3),
    abiCPT: ABI_CPT_CODES.slice(0, abiConf.level==="HIGH" ? 5 : 3),
    timestamp: new Date().toISOString(),
  };
}

// ─── AI Medical Necessity ──────────────────────────────────────────────────────
async function getAIInsight(rec) {
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({
        model:"claude-sonnet-4-20250514", max_tokens:1000,
        system:`You are a medical billing and clinical documentation specialist focused on ANS (Autonomic Nervous System) testing and ABI (Ankle-Brachial Index) studies. Provide concise medical necessity justification referencing ICD-10 and CPT codes. Format: 1) Clinical Findings Summary 2) ANS Medical Necessity (if applicable) 3) ABI Medical Necessity (if applicable) 4) Billing & Documentation Tips. Under 300 words.`,
        messages:[{ role:"user", content:
          `Patient: ${rec.patientName}, DOB: ${rec.patientDOB}, Visit: ${rec.visitDate}, Provider: ${rec.provider}
Source: ${rec.source||"Manual"}
EMR Diagnoses: ${(rec.problems||[]).map(p=>`${p.code} ${p.display}`).join("; ")||"none"}
Medications: ${(rec.medications||[]).slice(0,10).join(", ")||"none"}
ANS indicators: ${rec.ansKeywords.join(", ")||"none"}
ABI indicators: ${rec.abiKeywords.join(", ")||"none"}
Matched ANS ICD: ${rec.ansICD.map(c=>c.code).join(", ")}
Matched ABI ICD: ${rec.abiICD.map(c=>c.code).join(", ")}
Provide medical necessity analysis.` }]
      })
    });
    const data = await res.json();
    return data.content?.find(b=>b.type==="text")?.text || "AI insight unavailable.";
  } catch { return "AI insight unavailable — manual review recommended."; }
}

// ─── Export Helpers ────────────────────────────────────────────────────────────
function exportTXT(rec, aiInsight) {
  const t = [
    "MEDICAL NECESSITY REPORT","=".repeat(60),
    `Patient : ${rec.patientName}`, `DOB     : ${rec.patientDOB}`,
    `MRN     : ${rec.mrn||"N/A"}`, `Visit   : ${rec.visitDate}`,
    `Provider: ${rec.provider}`,   `Source  : ${rec.source||"Manual"}`, "",
    `ANS ELIGIBLE : ${rec.ansEligible?"YES ("+rec.ansConf.level+")":"NO"}`,
    `ABI ELIGIBLE : ${rec.abiEligible?"YES ("+rec.abiConf.level+")":"NO"}`, "",
    "EMR DIAGNOSES:", ...(rec.problems||[]).map(p=>`  ${p.code} — ${p.display}`), "",
    "RECOMMENDED ICD-10 — ANS:", ...rec.ansICD.map(c=>`  ${c.code} — ${c.description}`), "",
    "RECOMMENDED ICD-10 — ABI:", ...rec.abiICD.map(c=>`  ${c.code} — ${c.description}`), "",
    "RECOMMENDED CPT — ANS:", ...rec.ansCPT.map(c=>`  ${c.code} — ${c.description}  [${c.reimbursement}]`), "",
    "RECOMMENDED CPT — ABI:", ...rec.abiCPT.map(c=>`  ${c.code} — ${c.description}  [${c.reimbursement}]`), "",
    "AI MEDICAL NECESSITY NOTE:", aiInsight, "",
    `Generated: ${new Date().toLocaleString()} | MedNecessity AI`,
  ].join("\n");
  dl(t, `MedNecessity_${rec.patientName.replace(/\s/g,"_")}.txt`, "text/plain");
}
function exportCSV(patients) {
  const hdr = ["Patient","DOB","MRN","Visit","Provider","Source","ANS Eligible","ANS Conf","ABI Eligible","ABI Conf","EMR ICD Codes","ANS ICD Codes","ABI ICD Codes","ANS CPT","ABI CPT"];
  const rows = patients.map(r=>[
    r.patientName,r.patientDOB,r.mrn||"",r.visitDate,r.provider,r.source||"",
    r.ansEligible?"YES":"NO",r.ansConf.level,
    r.abiEligible?"YES":"NO",r.abiConf.level,
    (r.problems||[]).map(p=>p.code).join("|"),
    r.ansICD.map(c=>c.code).join("|"), r.abiICD.map(c=>c.code).join("|"),
    r.ansCPT.map(c=>c.code).join("|"), r.abiCPT.map(c=>c.code).join("|"),
  ]);
  dl([hdr,...rows].map(r=>r.map(v=>`"${v}"`).join(",")).join("\n"),
    `MedNecessity_${new Date().toISOString().slice(0,10)}.csv`, "text/csv");
}
function dl(content, name, type) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([content],{type}));
  a.download = name; a.click();
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [inputTab, setInputTab] = useState("emr");
  const [emrText,  setEmrText]  = useState("");
  const [patientName, setPatientName] = useState("");
  const [patientDOB,  setPatientDOB]  = useState("");
  const [visitDate,   setVisitDate]   = useState("");
  const [provider,    setProvider]    = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result,   setResult]   = useState(null);
  const [aiInsight,setAiInsight]= useState("");
  const [aiLoading,setAiLoading]= useState(false);
  const [queue,    setQueue]    = useState([]);
  const [batchList,setBatchList]= useState([]);
  const [importLog,setImportLog]= useState(null);
  const [batchRunning,setBatchRunning] = useState(false);
  const [batchDone,   setBatchDone]   = useState(0);
  const importRef = useRef();

  const analyze = useCallback(async (override) => {
    const base = override || { patientName, patientDOB, visitDate, provider,
      problems:[], medications:[], allergies:[], vitals:{}, allText:emrText, source:"Manual Entry", mrn:"" };
    if (!base.allText?.trim()) return;
    setIsAnalyzing(true); setResult(null); setAiInsight("");
    await new Promise(r=>setTimeout(r,900));
    const rec = buildResult(base);
    setResult(rec); setIsAnalyzing(false);
    setQueue(prev=>[rec,...prev].slice(0,200));
    setAiLoading(true);
    setAiInsight(await getAIInsight(rec));
    setAiLoading(false);
  }, [emrText, patientName, patientDOB, visitDate, provider]);

  const handleImport = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const raw = ev.target.result;
      if (raw.trim().startsWith("<?xml") || raw.trim().startsWith("<ClinicalDocument") || raw.includes("ClinicalDocument")) {
        const p = parseCCDA(raw);
        if (p) {
          setPatientName(p.patientName); setPatientDOB(p.patientDOB);
          setVisitDate(p.visitDate);     setProvider(p.provider);
          setEmrText(p.allText);
          setImportLog({type:"success",source:p.source,name:p.patientName,dob:p.patientDOB,
            mrn:p.mrn,problems:p.problems.length,meds:p.medications.length,
            vitals:Object.keys(p.vitals).length,parsed:p});
          setInputTab("emr"); return;
        }
      }
      if (raw.startsWith("MSH|")) {
        const p = parseHL7(raw);
        if (p) {
          setPatientName(p.patientName); setPatientDOB(p.patientDOB);
          setVisitDate(p.visitDate);     setProvider(p.provider);
          setEmrText(p.allText);
          setImportLog({type:"success",source:p.source,name:p.patientName,dob:p.patientDOB,
            mrn:p.mrn,problems:p.problems.length,meds:p.medications.length,vitals:0});
          setInputTab("emr"); return;
        }
      }
      if (raw.includes(",")) {
        const patients = parseCSVBatch(raw);
        if (patients && patients.length > 1) {
          setBatchList(patients);
          setImportLog({type:"batch",source:"CSV Batch",count:patients.length});
          setInputTab("batch"); return;
        }
      }
      setEmrText(raw);
      setImportLog({type:"plain",source:"Plain text"});
      setInputTab("emr");
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const runBatch = async () => {
    setBatchRunning(true); setBatchDone(0);
    const results = [];
    for (let i=0; i<batchList.length; i++) {
      const rec = buildResult(batchList[i]);
      results.push(rec);
      setQueue(prev=>[rec,...prev].slice(0,500));
      setBatchDone(i+1);
      await new Promise(r=>setTimeout(r,60));
    }
    setBatchRunning(false);
    exportCSV(results);
  };

  const clearAll = () => {
    setEmrText(""); setResult(null); setAiInsight(""); setImportLog(null);
    setPatientName(""); setPatientDOB(""); setVisitDate(""); setProvider("");
    setBatchList([]);
  };

  return (
    <div style={S.root}>
      <header style={S.header}>
        <div style={S.logo}>
          <span style={S.logoMark}>⚕</span>
          <div>
            <div style={S.logoTitle}>MedNecessity AI</div>
            <div style={S.logoSub}>ANS · ABI · ICD-10 · CPT · Epic &amp; eCW EMR Import</div>
          </div>
        </div>
        <div style={S.stats}>
          {[["Charts",queue.length],["ANS ✓",queue.filter(p=>p.ansEligible).length],["ABI ✓",queue.filter(p=>p.abiEligible).length]].map(([l,v])=>(
            <div key={l} style={S.statPill}><b style={S.statN}>{v}</b>{l}</div>
          ))}
        </div>
      </header>

      <div style={S.layout}>
        {/* LEFT */}
        <div style={S.left}>
          <div style={S.card}>
            <div style={S.cardHd}>👤 Patient Information</div>
            <div style={S.grid2}>
              {[["Patient Name","text",patientName,setPatientName,"Last, First"],
                ["Date of Birth","date",patientDOB,setPatientDOB,""],
                ["Visit / Appt Date","date",visitDate,setVisitDate,""],
                ["Provider / NPI","text",provider,setProvider,"Dr. Smith / NPI"]
              ].map(([label,type,val,setter,ph])=>(
                <div key={label} style={S.fg}>
                  <label style={S.lbl}>{label}</label>
                  <input style={S.inp} type={type} value={val} onChange={e=>setter(e.target.value)} placeholder={ph} />
                </div>
              ))}
            </div>
          </div>

          <div style={S.card}>
            <div style={S.tabRow}>
              {[["emr","📋 Chart Note"],["import","📥 EMR Import"],["batch","📊 Batch"]].map(([id,lbl])=>(
                <button key={id} style={{...S.tab,...(inputTab===id?S.tabOn:{})}} onClick={()=>setInputTab(id)}>{lbl}</button>
              ))}
            </div>

            {inputTab==="emr" && <>
              <div style={S.cardHd}>📄 Paste Chart / SOAP Note</div>
              {importLog?.type==="success" && (
                <div style={S.banner}>
                  <div style={S.bannerTitle}>✓ {importLog.source} parsed</div>
                  <div style={S.bannerMeta}>
                    <b>{importLog.name}</b> · DOB: {importLog.dob} · MRN: {importLog.mrn||"—"}<br/>
                    {importLog.problems} diagnoses · {importLog.meds} medications · {importLog.vitals} vitals
                  </div>
                </div>
              )}
              {importLog?.type==="plain" && (
                <div style={{...S.banner,borderColor:"#f5a62344"}}>
                  <div style={{...S.bannerTitle,color:"#f5a623"}}>⚠ Plain text loaded — fill patient info above</div>
                </div>
              )}
              <textarea style={S.textarea} value={emrText} onChange={e=>setEmrText(e.target.value)}
                placeholder={"Paste full EMR note, SOAP note, or problem list here...\n\nOr use 📥 EMR Import to upload CCD/CCDA (XML), HL7, or CSV from eClinicalWorks or Epic."} />
            </>}

            {inputTab==="import" && <>
              <div style={S.cardHd}>📥 Import Directly from EMR</div>
              <div style={S.importGrid}>
                {[
                  {emr:"Epic",           fmt:"CCD/CCDA XML",   ext:".xml",icon:"🏥",hint:"Chart Review → Share → Download CCD"},
                  {emr:"eClinicalWorks", fmt:"CCD/CCDA XML",   ext:".xml",icon:"🖥",hint:"Patient Hub → Export → Continuity of Care"},
                  {emr:"eClinicalWorks", fmt:"HL7 v2 Message", ext:".hl7",icon:"📨",hint:"Reports → Patient Export → HL7 Format"},
                  {emr:"Epic / eCW",     fmt:"Schedule CSV",   ext:".csv",icon:"📊",hint:"Export daily schedule for batch processing"},
                  {emr:"Any EMR",        fmt:"Plain Text",     ext:".txt",icon:"📄",hint:"Copy-paste or plain text chart file"},
                ].map(({emr,fmt,ext,icon,hint})=>(
                  <div key={emr+fmt} style={S.impCard} onClick={()=>importRef.current?.click()}>
                    <div style={{fontSize:24,marginBottom:5}}>{icon}</div>
                    <div style={{fontSize:12,fontWeight:700,color:"#4a9eff"}}>{emr}</div>
                    <div style={{fontSize:11,color:"#c0cce8",marginTop:2}}>{fmt}</div>
                    <div style={{fontSize:10,color:"#4a5880",marginTop:4,lineHeight:1.5}}>{hint}</div>
                    <div style={{fontSize:10,fontFamily:"'JetBrains Mono',monospace",color:"#7c5cfc",marginTop:4}}>{ext}</div>
                  </div>
                ))}
              </div>
              <input ref={importRef} type="file" accept=".xml,.hl7,.csv,.txt,.rtf,.ccd,.ccda"
                style={{display:"none"}} onChange={handleImport} />
              <button style={S.btnImport} onClick={()=>importRef.current?.click()}>
                ⬆ Upload EMR File (CCD/CCDA · HL7 · CSV · TXT)
              </button>
              <div style={S.impNote}>
                <b>How to export from your EMR:</b><br/>
                <span style={{color:"#4a9eff"}}>Epic →</span> Chart Review → Share → Download as CCD (XML)<br/>
                <span style={{color:"#4a9eff"}}>eCW →</span> Patient Hub → Export → Continuity of Care Document<br/>
                <span style={{color:"#4a9eff"}}>Batch →</span> Export daily appointment schedule as CSV
              </div>
            </>}

            {inputTab==="batch" && <>
              <div style={S.cardHd}>📊 Batch Patient Processing</div>
              {batchList.length===0 ? (
                <div style={{textAlign:"center",padding:"24px 12px"}}>
                  <div style={{fontSize:36,marginBottom:10}}>📂</div>
                  <div style={{color:"#8899bb",fontWeight:600,marginBottom:4}}>No batch file loaded</div>
                  <div style={{color:"#4a5880",fontSize:12,marginBottom:14}}>Upload a CSV schedule export from eCW or Epic</div>
                  <button style={S.btnImport} onClick={()=>setInputTab("import")}>Go to Import →</button>
                </div>
              ) : <>
                <div style={{...S.banner,marginBottom:10}}>
                  <div style={S.bannerTitle}>✓ {batchList.length} patients loaded from CSV</div>
                  <div style={S.bannerMeta}>Click Run Batch to process all and auto-export CSV.</div>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:4,marginBottom:12}}>
                  {batchList.slice(0,8).map((p,i)=>(
                    <div key={i} style={S.bRow}>
                      <span style={{color:"#4a5880",fontWeight:600,fontSize:11}}>{i+1}</span>
                      <span style={{flex:1,color:"#c0cce8",fontSize:12}}>{p.patientName}</span>
                      <span style={{color:"#5a6880",fontSize:11}}>{p.visitDate||"—"}</span>
                    </div>
                  ))}
                  {batchList.length>8 && <div style={{color:"#4a5880",fontSize:11,padding:"4px 8px"}}>+{batchList.length-8} more…</div>}
                </div>
                {batchRunning ? (
                  <div>
                    <div style={{height:5,background:"#1a2235",borderRadius:3,overflow:"hidden"}}>
                      <div style={{height:"100%",background:"linear-gradient(90deg,#7c5cfc,#0ea5e9)",borderRadius:3,width:`${(batchDone/batchList.length)*100}%`,transition:"width .3s"}} />
                    </div>
                    <div style={{color:"#8899bb",fontSize:12,marginTop:5,textAlign:"center"}}>Processing {batchDone}/{batchList.length}…</div>
                  </div>
                ) : (
                  <button style={S.btnPrimary} onClick={runBatch}>⚡ Run Batch — {batchList.length} Patients → Export CSV</button>
                )}
              </>}
            </>}

            {inputTab!=="batch" && (
              <div style={S.btnRow}>
                <button style={S.btnPrimary} onClick={()=>analyze()} disabled={isAnalyzing||!emrText.trim()}>
                  {isAnalyzing?<><span style={{animation:"spin 1s linear infinite",display:"inline-block"}}>◌</span> Analyzing…</>:"⚡ Run Eligibility Analysis"}
                </button>
                <button style={S.btnSec} onClick={clearAll}>Clear</button>
              </div>
            )}
          </div>

          {queue.length>0 && (
            <div style={S.card}>
              <div style={S.cardHd}>👥 Patient Queue ({queue.length})</div>
              <div style={{display:"flex",flexDirection:"column",gap:5}}>
                {queue.slice(0,10).map((p,i)=>(
                  <div key={i} style={S.qItem} onClick={()=>{setResult(p);setAiInsight("");}}>
                    <div style={{flex:1}}>
                      <div style={{fontSize:13,fontWeight:500,color:"#e2e8f8"}}>{p.patientName}</div>
                      <div style={{fontSize:10,color:"#4a5880"}}>{p.source} · {p.visitDate||"—"}</div>
                    </div>
                    <div style={{display:"flex",gap:4}}>
                      {p.ansEligible&&<span style={S.bANS}>ANS</span>}
                      {p.abiEligible&&<span style={S.bABI}>ABI</span>}
                    </div>
                  </div>
                ))}
                {queue.length>1&&<button style={{...S.btnSec,marginTop:4,fontSize:11}} onClick={()=>exportCSV(queue)}>⬇ Export All {queue.length} as CSV</button>}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div style={S.right}>
          {!result&&!isAnalyzing&&<EmptyState />}
          {isAnalyzing&&<LoadingState />}
          {result&&!isAnalyzing&&(
            <ResultPanel rec={result} aiInsight={aiInsight} aiLoading={aiLoading}
              onTXT={()=>exportTXT(result,aiInsight)} onCSV={()=>exportCSV([result])} onClear={clearAll} />
          )}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}body{background:#080c14}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes shimmer{0%{background-position:-300px 0}100%{background-position:300px 0}}
        @keyframes ring{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.18);opacity:.5}}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#0d1220}::-webkit-scrollbar-thumb{background:#2a3450;border-radius:2px}
        input[type=date]::-webkit-calendar-picker-indicator{filter:invert(.5)}
      `}</style>
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────
function ResultPanel({rec,aiInsight,aiLoading,onTXT,onCSV,onClear}) {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:16,animation:"fadeUp .4s ease"}}>
      <div style={S.summBar}>
        <div>
          <div style={{fontSize:18,fontWeight:700,color:"#f0f4ff"}}>{rec.patientName}</div>
          <div style={{fontSize:11,color:"#5a6880",marginTop:2}}>
            DOB: {rec.patientDOB||"—"} · MRN: {rec.mrn||"—"} · Visit: {rec.visitDate||"—"} · {rec.provider||"—"}
            <span style={S.srcBadge}>{rec.source}</span>
          </div>
        </div>
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          {["ANS","ABI"].map(t=>{
            const eligible = rec[`${t.toLowerCase()}Eligible`];
            const conf = rec[`${t.toLowerCase()}Conf`];
            return (
              <div key={t} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 13px",borderRadius:9,fontSize:13,fontWeight:600,
                ...(eligible?{background:"#00d26a18",border:"1px solid #00d26a44",color:"#00d26a"}
                            :{background:"#ff6b6b18",border:"1px solid #ff6b6b44",color:"#ff6b6b"})}}>
                {eligible?"✓":"✗"} {t} Eligible
                <span style={{fontSize:10,opacity:.8,background:"rgba(0,0,0,.25)",padding:"1px 6px",borderRadius:4}}>{conf.level}</span>
              </div>
            );
          })}
        </div>
      </div>

      {(rec.problems||[]).length>0&&(
        <div style={S.card}>
          <div style={S.cardHd}>🏥 Diagnoses Extracted from EMR ({rec.problems.length})</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
            {rec.problems.map((p,i)=>(
              <div key={i} style={S.probChip}>
                <span style={{fontFamily:"'JetBrains Mono',monospace",color:"#4a9eff",fontWeight:600}}>{p.code}</span>
                <span style={{color:"#8899bb",marginLeft:6,fontSize:11}}>{p.display}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {rec.vitals&&Object.keys(rec.vitals).length>0&&(
        <div style={S.card}>
          <div style={S.cardHd}>📊 Vitals from EMR</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
            {Object.entries(rec.vitals).map(([k,v])=>(
              <div key={k} style={S.vChip}>
                <span style={{fontSize:10,color:"#4a5880",textTransform:"uppercase"}}>{k.replace(/([A-Z])/g," $1")}</span>
                <span style={{color:"#e2e8f8",fontFamily:"'JetBrains Mono',monospace",fontSize:13,marginLeft:5}}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        {["ANS","ABI"].map(t=>{
          const conf = rec[`${t.toLowerCase()}Conf`];
          const kws  = rec[`${t.toLowerCase()}Keywords`];
          return (
            <div key={t} style={S.confCard}>
              <div style={{fontSize:11,fontWeight:600,color:"#8899bb",textTransform:"uppercase",letterSpacing:".8px",marginBottom:10}}>{t} Confidence</div>
              <div style={{height:6,background:"#111827",borderRadius:3,overflow:"hidden",marginBottom:8}}>
                <div style={{height:"100%",borderRadius:3,background:conf.color,width:`${conf.pct}%`,transition:"width 1s ease"}} />
              </div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:6}}>
                <span style={{fontWeight:700,color:conf.color}}>{conf.level} ({conf.pct}%)</span>
                <span style={{color:"#4a5880"}}>{kws.length} indicators</span>
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                {kws.slice(0,8).map(kw=>(
                  <span key={kw} style={{fontSize:10,background:"#111827",border:"1px solid #1e2840",borderRadius:4,padding:"2px 6px",color:"#6a7a9a"}}>{kw}</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        {rec.ansEligible&&<CodeTable title="ANS — ICD-10 Codes" codes={rec.ansICD} color="#7c5cfc" icon="🧠" />}
        {rec.abiEligible&&<CodeTable title="ABI — ICD-10 Codes" codes={rec.abiICD} color="#0ea5e9" icon="🦵" />}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        {rec.ansEligible&&<CodeTable title="ANS — CPT Billing" codes={rec.ansCPT} color="#7c5cfc" icon="💊" isCPT />}
        {rec.abiEligible&&<CodeTable title="ABI — CPT Billing" codes={rec.abiCPT} color="#0ea5e9" icon="🩺" isCPT />}
      </div>

      <div style={S.aiBox}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
          <span style={{color:"#7c5cfc",fontSize:18}}>✦</span>
          <span style={{fontSize:12,fontWeight:700,color:"#c0b4ff",textTransform:"uppercase",letterSpacing:".7px",flex:1}}>AI Medical Necessity Documentation</span>
          {aiLoading&&<span style={{fontSize:11,color:"#7c5cfc",animation:"pulse 1.5s infinite"}}>Generating…</span>}
        </div>
        {aiLoading ? <Skeleton /> : aiInsight ? (
          <div style={{display:"flex",flexDirection:"column",gap:4}}>
            {aiInsight.split("\n").map((line,i)=>(
              <p key={i} style={line.match(/^\d\)/)?{fontSize:13,fontWeight:600,color:"#a8b8e8",marginTop:6}:{fontSize:13,color:"#8899bb",lineHeight:1.7}}>{line}</p>
            ))}
          </div>
        ):null}
      </div>

      <div style={{display:"flex",gap:8,paddingBottom:20,flexWrap:"wrap"}}>
        <button style={S.expBtn} onClick={onTXT}>⬇ Export Report (.txt)</button>
        <button style={S.expBtn} onClick={onCSV}>📊 Export CSV</button>
        <button style={{...S.btnSec,marginLeft:"auto"}} onClick={onClear}>+ New Patient</button>
      </div>
    </div>
  );
}

function CodeTable({title,codes,color,icon,isCPT}) {
  if (!codes.length) return null;
  return (
    <div style={{...S.card,borderTop:`2px solid ${color}44`}}>
      <div style={{display:"flex",alignItems:"center",gap:7,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:".7px",marginBottom:10,color}}>{icon} {title}</div>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
        <thead><tr>
          <th style={{textAlign:"left",padding:"4px 6px",fontSize:10,textTransform:"uppercase",color,borderBottom:"1px solid #1e2840"}}>Code</th>
          <th style={{textAlign:"left",padding:"4px 6px",fontSize:10,textTransform:"uppercase",color:"#4a5880",borderBottom:"1px solid #1e2840"}}>Description</th>
          {isCPT&&<th style={{textAlign:"right",padding:"4px 6px",fontSize:10,textTransform:"uppercase",color:"#4a5880",borderBottom:"1px solid #1e2840"}}>Est. Reimb.</th>}
        </tr></thead>
        <tbody>
          {codes.map((c,i)=>(
            <tr key={c.code} style={{background:i%2===0?"transparent":"#111827"}}>
              <td style={{padding:"5px 6px",fontFamily:"'JetBrains Mono',monospace",color,fontWeight:600,whiteSpace:"nowrap"}}>{c.code}</td>
              <td style={{padding:"5px 6px",color:"#c0cce8",lineHeight:1.4}}>{c.description}</td>
              {isCPT&&<td style={{padding:"5px 6px",textAlign:"right",color:"#a8ff8a",fontFamily:"'JetBrains Mono',monospace",whiteSpace:"nowrap"}}>{c.reimbursement}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Skeleton() {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:8}}>
      {[100,80,93,67,85].map((w,i)=>(
        <div key={i} style={{height:12,borderRadius:6,width:`${w}%`,background:"linear-gradient(90deg,#1a2240 25%,#2a3460 50%,#1a2240 75%)",backgroundSize:"400px 100%",animation:`shimmer 1.5s infinite`,animationDelay:`${i*.1}s`}} />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",textAlign:"center",padding:48}}>
      <div style={{fontSize:62,marginBottom:14}}>🧬</div>
      <div style={{fontSize:19,fontWeight:700,color:"#c0cce8",marginBottom:8}}>MedNecessity AI Engine</div>
      <div style={{fontSize:13,color:"#5a6880",maxWidth:500,lineHeight:1.85,marginBottom:26}}>
        Paste a chart note, import a CCD/CCDA XML from Epic or eCW, upload an HL7 file,<br/>or batch-process a full day's schedule from a CSV export.
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,textAlign:"left",maxWidth:480}}>
        {["CCD/CCDA XML (Epic & eCW)","HL7 v2 Messages (eCW)","CSV Schedule Batch Import","Auto ICD-10 Code Extraction",
          "Autonomic Neuropathy Detection","Peripheral Arterial Disease Flags","CPT Billing Recommendations","AI Medical Necessity Letter"].map(c=>(
          <div key={c} style={{fontSize:12,color:"#4a9eff",background:"#0a1628",border:"1px solid #1e2840",borderRadius:6,padding:"6px 10px"}}>✓ {c}</div>
        ))}
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",gap:20}}>
      <div style={{position:"relative",width:80,height:80}}>
        <div style={{position:"absolute",inset:0,borderRadius:"50%",border:"2px solid #7c5cfc",animation:"ring 1.5s ease-in-out infinite"}} />
        <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,color:"#7c5cfc"}}>⚕</div>
      </div>
      <div style={{fontSize:16,fontWeight:600,color:"#c0cce8"}}>Analyzing EMR Data…</div>
      <div style={{display:"flex",flexDirection:"column",gap:6}}>
        {["Parsing clinical indicators","Extracting EMR diagnoses","Mapping ICD-10 codes","Selecting CPT billing codes"].map((s,i)=>(
          <div key={s} style={{fontSize:12,color:"#4a5880",animation:"pulse 1.5s ease-in-out infinite",animationDelay:`${i*.3}s`}}>● {s}</div>
        ))}
      </div>
    </div>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────
const S = {
  root:   {fontFamily:"'DM Sans',sans-serif",background:"#080c14",minHeight:"100vh",color:"#e2e8f8"},
  header: {display:"flex",justifyContent:"space-between",alignItems:"center",padding:"13px 22px",background:"#0d1220",borderBottom:"1px solid #1e2840",position:"sticky",top:0,zIndex:100},
  logo:   {display:"flex",alignItems:"center",gap:11},
  logoMark:{fontSize:26,background:"linear-gradient(135deg,#7c5cfc,#0ea5e9)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"},
  logoTitle:{fontSize:17,fontWeight:700,letterSpacing:"-.3px",color:"#f0f4ff"},
  logoSub:{fontSize:10,color:"#4a5880",letterSpacing:".5px",textTransform:"uppercase"},
  stats:  {display:"flex",gap:8},
  statPill:{background:"#111827",border:"1px solid #1e2840",borderRadius:20,padding:"4px 12px",fontSize:12,color:"#8899bb"},
  statN:  {color:"#e2e8f8",fontWeight:700,marginRight:4},
  layout: {display:"flex",height:"calc(100vh - 57px)"},
  left:   {width:390,minWidth:350,borderRight:"1px solid #1e2840",overflowY:"auto",padding:14,display:"flex",flexDirection:"column",gap:11},
  right:  {flex:1,overflowY:"auto",padding:20},
  card:   {background:"#0d1220",border:"1px solid #1e2840",borderRadius:12,padding:15},
  cardHd: {fontSize:11,fontWeight:600,color:"#8899bb",textTransform:"uppercase",letterSpacing:".8px",marginBottom:11},
  grid2:  {display:"grid",gridTemplateColumns:"1fr 1fr",gap:9},
  fg:     {display:"flex",flexDirection:"column",gap:4},
  lbl:    {fontSize:10,color:"#5a6880",textTransform:"uppercase",letterSpacing:".5px"},
  inp:    {background:"#111827",border:"1px solid #1e2840",borderRadius:7,padding:"7px 9px",color:"#e2e8f8",fontSize:13,outline:"none",fontFamily:"inherit"},
  tabRow: {display:"flex",gap:4,marginBottom:12},
  tab:    {flex:1,padding:"6px 8px",borderRadius:7,border:"1px solid #1e2840",background:"transparent",color:"#5a6880",cursor:"pointer",fontSize:11,fontFamily:"inherit",fontWeight:500},
  tabOn:  {background:"#161f33",color:"#e2e8f8",borderColor:"#2a3a60"},
  textarea:{width:"100%",height:155,background:"#111827",border:"1px solid #1e2840",borderRadius:8,padding:11,color:"#e2e8f8",fontSize:12,resize:"vertical",outline:"none",fontFamily:"'DM Sans',sans-serif",lineHeight:1.6},
  btnRow: {display:"flex",gap:8,marginTop:11},
  btnPrimary:{flex:1,padding:"10px 14px",background:"linear-gradient(135deg,#7c5cfc,#0ea5e9)",border:"none",borderRadius:9,color:"#fff",fontWeight:700,cursor:"pointer",fontSize:13,fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:6},
  btnSec: {padding:"10px 13px",background:"#111827",border:"1px solid #1e2840",borderRadius:9,color:"#8899bb",cursor:"pointer",fontSize:13,fontFamily:"inherit"},
  btnImport:{width:"100%",padding:"10px",background:"#111827",border:"1px dashed #2a3a60",borderRadius:9,color:"#8899bb",cursor:"pointer",fontSize:13,fontFamily:"inherit",marginTop:8},
  banner: {background:"#0a1a12",border:"1px solid #00d26a33",borderRadius:8,padding:"10px 12px",marginBottom:10},
  bannerTitle:{fontSize:12,fontWeight:600,color:"#00d26a"},
  bannerMeta: {fontSize:11,color:"#4a7a5a",marginTop:3,lineHeight:1.6},
  importGrid:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:4},
  impCard:{background:"#111827",border:"1px solid #1e2840",borderRadius:9,padding:"10px 12px",cursor:"pointer"},
  impNote:{fontSize:11,color:"#4a5880",lineHeight:1.8,marginTop:8,padding:"10px 12px",background:"#0a1020",borderRadius:8,border:"1px solid #1a2235"},
  bRow:   {display:"grid",gridTemplateColumns:"20px 1fr auto",gap:8,alignItems:"center",background:"#111827",borderRadius:6,padding:"5px 8px"},
  qItem:  {display:"flex",alignItems:"center",gap:8,padding:"8px 10px",background:"#111827",borderRadius:8,cursor:"pointer",border:"1px solid #1a2235"},
  bANS:   {fontSize:10,fontWeight:700,padding:"2px 6px",borderRadius:4,background:"#7c5cfc22",color:"#c0a0ff",border:"1px solid #7c5cfc44"},
  bABI:   {fontSize:10,fontWeight:700,padding:"2px 6px",borderRadius:4,background:"#0ea5e922",color:"#70d0ff",border:"1px solid #0ea5e944"},
  summBar:{background:"#0d1220",border:"1px solid #1e2840",borderRadius:12,padding:"13px 17px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12},
  srcBadge:{marginLeft:8,background:"#1a2840",border:"1px solid #2a3a60",borderRadius:4,padding:"1px 7px",fontSize:10,color:"#4a9eff"},
  confCard:{background:"#0d1220",border:"1px solid #1e2840",borderRadius:12,padding:14},
  probChip:{background:"#111827",border:"1px solid #1e2840",borderRadius:6,padding:"4px 9px",fontSize:12,display:"flex",alignItems:"center"},
  vChip:  {background:"#111827",border:"1px solid #1e2840",borderRadius:6,padding:"5px 10px",fontSize:12,display:"flex",alignItems:"center",gap:4},
  aiBox:  {background:"#0a0e1a",border:"1px solid #2a1f5a",borderRadius:12,padding:17},
  expBtn: {padding:"9px 17px",background:"linear-gradient(135deg,#7c5cfc22,#0ea5e922)",border:"1px solid #2a3a60",borderRadius:9,color:"#c0cce8",cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:"inherit"},
};
