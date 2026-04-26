const { useState, useEffect, useReducer, useMemo } = React;

let audioCtx = null;
const getAudioCtx = () => {
    if (!audioCtx && (window.AudioContext || window.webkitAudioContext)) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
};

const initAudio = () => {
    const ctx = getAudioCtx();
    if (ctx && ctx.state === 'suspended') { ctx.resume(); }
};

const playSound = (type) => {
    try {
        const ctx = getAudioCtx();
        if (!ctx) return;
        if (ctx.state === 'suspended') ctx.resume().catch(() => {});
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        const now = ctx.currentTime;
        if (type === 'ping') {
            osc.type = 'sine'; osc.frequency.setValueAtTime(600, now); osc.frequency.exponentialRampToValueAtTime(100, now + 0.5);
            gain.gain.setValueAtTime(0.1, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
            osc.start(now); osc.stop(now + 0.5);
        } else if (type === 'treat') {
            osc.type = 'triangle'; osc.frequency.setValueAtTime(880, now); gain.gain.setValueAtTime(0.1, now); gain.gain.linearRampToValueAtTime(0, now + 0.1); osc.start(now); osc.stop(now + 0.1);
            const osc2 = ctx.createOscillator(); const gain2 = ctx.createGain(); osc2.connect(gain2); gain2.connect(ctx.destination);
            osc2.type = 'triangle'; osc2.frequency.setValueAtTime(880, now + 0.15); gain2.gain.setValueAtTime(0.1, now + 0.15); gain2.gain.linearRampToValueAtTime(0, now + 0.25); osc2.start(now + 0.15); osc2.stop(now + 0.25);
        } else if (type === 'flatline') {
            osc.type = 'sawtooth'; osc.frequency.setValueAtTime(200, now); gain.gain.setValueAtTime(0.15, now); gain.gain.linearRampToValueAtTime(0, now + 2.5); osc.start(now); osc.stop(now + 2.5);
        } else if (type === 'move') {
            osc.type = 'sine'; osc.frequency.setValueAtTime(300, now); gain.gain.setValueAtTime(0.05, now); gain.gain.linearRampToValueAtTime(0, now + 0.05); osc.start(now); osc.stop(now + 0.05);
        } else if (type === 'alert') {
            osc.type = 'square'; osc.frequency.setValueAtTime(440, now); osc.frequency.linearRampToValueAtTime(880, now + 0.3); gain.gain.setValueAtTime(0.1, now); gain.gain.linearRampToValueAtTime(0, now + 0.3); osc.start(now); osc.stop(now + 0.3);
        } else if (type === 'error') {
            osc.type = 'sawtooth'; osc.frequency.setValueAtTime(150, now); gain.gain.setValueAtTime(0.1, now); gain.gain.linearRampToValueAtTime(0, now + 0.3); osc.start(now); osc.stop(now + 0.3);
        }
    } catch (e) { }
};

const IconWrapper = ({ children, size = 20, strokeWidth = 2, className = "", ...props }) => ( <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>{children}</svg> );
const ClipboardCheck = (p) => <IconWrapper {...p}><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/></IconWrapper>;
const Scan = (p) => <IconWrapper {...p}><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/></IconWrapper>;
const Stethoscope = (p) => <IconWrapper {...p}><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v6"/><path d="M16 15v6a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-6"/><circle cx="12" cy="20" r="2"/></IconWrapper>;
const DoorOpen = (p) => <IconWrapper {...p}><path d="M13 4h3a2 2 0 0 1 2 2v14"/><path d="M2 20h3"/><path d="M13 20h9"/><path d="M10 12v.01"/><path d="M13 4.562v16.157a1 1 0 0 1-1.242.97L5 20V5.562a2 2 0 0 1 1.515-1.94l4-1A2 2 0 0 1 13 4.561Z"/></IconWrapper>;
const CheckCircle = (p) => <IconWrapper {...p}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></IconWrapper>;
const ShieldAlert = (p) => <IconWrapper {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="M12 8v4"/><path d="M12 16h.01"/></IconWrapper>;
const X = (p) => <IconWrapper {...p}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></IconWrapper>;
const Users = (p) => <IconWrapper {...p}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></IconWrapper>;
const Droplet = (p) => <IconWrapper {...p}><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></IconWrapper>;
const Wind = (p) => <IconWrapper {...p}><path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/></IconWrapper>;
const Syringe = (p) => <IconWrapper {...p}><path d="m18 2 4 4"/><path d="m17 7 3-3"/><path d="M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 5"/><path d="m9 11 4 4"/><path d="m5 19-3 3"/></IconWrapper>;
const Activity = (p) => <IconWrapper {...p}><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></IconWrapper>;
const Bed = (p) => <IconWrapper {...p}><path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/></IconWrapper>;
const BookOpen = (p) => <IconWrapper {...p}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></IconWrapper>;
const BadgeInfo = (p) => <IconWrapper {...p}><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.78 4.78 4 4 0 0 1-6.74 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><line x1="12" x2="12" y1="8" y2="8"/><line x1="12" x2="12.01" y1="16" y2="16"/></IconWrapper>;
const FileText = (p) => <IconWrapper {...p}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></IconWrapper>;
const Menu = (p) => <IconWrapper {...p}><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></IconWrapper>;
const Minus = (p) => <IconWrapper {...p}><path d="M5 12h14"/></IconWrapper>;
const Plus = (p) => <IconWrapper {...p}><path d="M12 5v14"/><path d="M5 12h14"/></IconWrapper>;
const AlertTriangle = (p) => <IconWrapper {...p}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></IconWrapper>;
const Volume2 = (p) => <IconWrapper {...p}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></IconWrapper>;
const VolumeX = (p) => <IconWrapper {...p}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></IconWrapper>;
const Lightbulb = (p) => <IconWrapper {...p}><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-1 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></IconWrapper>;
const PersonStanding = (p) => <IconWrapper {...p}><circle cx="12" cy="5" r="1"/><path d="m9 20 3-6 3 6"/><path d="m6 8 6 2 6-2"/><path d="M12 10v4"/></IconWrapper>;
const Stretcher = (p) => <IconWrapper {...p}><rect width="20" height="8" x="2" y="10" rx="2"/><circle cx="6" cy="20" r="2"/><circle cx="18" cy="20" r="2"/><path d="M6 10V6h12v4"/></IconWrapper>;
const LogOut = (p) => <IconWrapper {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></IconWrapper>;
const TrendingUp = (p) => <IconWrapper {...p}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></IconWrapper>;
const Siren = (p) => <IconWrapper {...p}><path d="M7 12a5 5 0 0 1 5-5v0a5 5 0 0 1 5 5v6H7v-6Z"/><path d="M5 20a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v2H5v-2Z"/><path d="M21 12h1"/><path d="M18.5 4.5 18 5"/><path d="M2 12h1"/><path d="M12 2v1"/><path d="m4.929 4.929.707.707"/><path d="M12 7a5 5 0 0 0-5 5"/></IconWrapper>;
const ArrowRight = (p) => <IconWrapper {...p}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></IconWrapper>;

const LOGO_URL = "https://iili.io/KGQOvkl.md.png";
const MAX_TURNS = 12; 

const RANDOM_EVENTS = [
    { id: 'needlestick', title: 'Needlestick Injury', desc: 'A Nurse has sustained a needlestick injury and must report to Occ Health.', effect: 'One Nurse removed for 1 turn.' },
    { id: 'ct_overheat', title: 'Scanner Overheat', desc: 'The CT Scanner cooling system has failed.', effect: 'CT Scanner disabled for this turn.' },
    { id: 'norovirus', title: 'Norovirus Outbreak', desc: 'Ward 4 closed due to D&V.', effect: 'Ward Capacity reduced by 5.' },
    { id: 'med_student', title: 'Keen Med Student', desc: 'A final year student offers to help with bloods.', effect: 'Senior Doctor action reset.' },
    { id: 'rapid_offload', title: 'Rapid Offload', desc: 'Multiple ambulances arrive at once.', effect: '3 Extra Patients added to Ambulance Bay.' },
    { id: 'exit_block_icu', title: 'ICU Bed Crisis', desc: 'Intensive Care has declared critical capacity.', effect: 'ICU admissions blocked for this turn.' },
    { id: 'exit_block_ward', title: 'Ward Flow Block', desc: 'No porters available to move patients.', effect: 'Ward admissions blocked for this turn.' },
    { id: 'parental_presence', title: 'Distressed Parents', desc: 'Parents breached the police cordon.', effect: 'Requires 2 AP from Bronze Command to manage.' }
];

const SCENARIOS = {
    standard: { 
        name: "Standard Incident", 
        desc: "A major incident has been declared. Balanced mix of trauma and medical casualties.", 
        p1: 0.2, p2: 0.3, p3: 0.5, 
        methane: "M: Multi-vehicle crash. E: A46 Junction. T: RTC. H: Fuel leak. A: Northbound. N: 10+. E: Police on scene." 
    },
    chemical: { 
        name: "Chemical Attack", 
        desc: "CBRN incident. High number of airway risks (P1) requiring advanced skills.", 
        p1: 0.5, p2: 0.3, p3: 0.2, type: 'chem',
        methane: "M: Suspected Chemical Release. E: City Underground Station. T: Hazmat. H: Unknown vapour. A: Avoid main entrance. N: 20+. E: Fire brigade on scene." 
    },
    bus_crash: { 
        name: "Bus Crash", 
        desc: "Multi-vehicle collision. High volume of blunt trauma (Head/Chest/Abdo).", 
        p1: 0.3, p2: 0.4, p3: 0.3, type: 'trauma',
        methane: "M: Coach rolled over. E: M40 Motorway. T: Mass Casualty RTC. H: Trapped passengers. A: Southbound closed. N: 30+. E: HEMS deployed." 
    },
    collapse: { 
        name: "Structural Collapse", 
        desc: "Building collapse. Crush injuries and dust inhalation.", 
        p1: 0.25, p2: 0.4, p3: 0.35, type: 'crush',
        methane: "M: Shopping centre roof collapsed. E: High Street. T: Structural failure. H: Unstable debris. A: East side clear. N: 15+. E: USAR responding." 
    },
    paediatric: {
        name: "Paediatric Mass Casualty",
        desc: "School bus collision. High volume of paediatric patients. Requires child triage protocols.",
        p1: 0.3, p2: 0.4, p3: 0.3, type: 'paediatric',
        methane: "M: School bus crashed. E: Ring road. T: Mass Casualty RTC. H: None. A: Road blocked. N: 20+ children. E: Police on scene."
    }
};

const ROLE_TEMPLATES = {
    bronze_cmd: { type: 'command', theme: 'slate', icon: Activity, name: 'Bronze Cmd', ap: 4, desc: 'Operational Lead', ability: 'Rapid Offload', abilityCost: 'ALL', maxCooldown: 2, abilityEffect: 'Move Amb -> Triage', actionText: 'Review', canTriage: true, skills: ['triage', 'care'] },
    senior_doc: { type: 'command', theme: 'slate', icon: ClipboardCheck, name: 'Senior Doc', ap: 5, desc: 'Clinical Lead', ability: 'Rapid Triage', abilityCost: 2, maxCooldown: 2, abilityEffect: 'Reveal All Intake', actionText: 'Review', canTriage: true, canSecondaryTriage: true, canTreat: true, skills: ['advanced_trauma', 'care', 'triage'] },
    nurse_ic: { type: 'nursing', theme: 'blue', icon: Users, name: 'Nurse IC', ap: 4, desc: 'Coordination', ability: 'Rapid Offload', abilityCost: 'ALL', maxCooldown: 2, abilityEffect: 'Move Amb -> Triage', actionText: 'Coordinate', canTriage: true, skills: ['triage', 'care'] },
    nurse_staff: { type: 'nursing', theme: 'blue', icon: Syringe, name: 'ED Nurse', ap: 3, desc: 'Care & Triage', ability: 'Stabilise', abilityCost: 1, maxCooldown: 2, abilityEffect: 'Reset Deterioration', actionText: 'Care / Triage', canTriage: true, canTreat: true, skills: ['care', 'triage'] },
    resident: { type: 'medical', theme: 'emerald', icon: Stethoscope, name: 'ED Resident', ap: 4, desc: 'Treatment', ability: 'Fast Track', abilityCost: 2, maxCooldown: 2, abilityEffect: 'Instant Treat P3', actionText: 'Procedure', canTreat: true, skills: ['advanced_trauma', 'care', 'triage'] },
    anaesthetic_spr: { type: 'medical', theme: 'emerald', icon: Wind, name: 'Anaesthetic SpR', ap: 4, desc: 'Airway Management', ability: 'Advanced Airway', abilityCost: 4, maxCooldown: 3, abilityEffect: 'Treat complex P1 airway immediately', actionText: 'Intubate', canTreat: true, skills: ['advanced_trauma', 'care'] },
    radiology: { type: 'support', theme: 'purple', icon: Scan, name: 'Radiology Lead', ap: 3, desc: 'Diagnostics', ability: 'Rapid Scan', abilityCost: 1, maxCooldown: 1, abilityEffect: 'Scan waiting patient', actionText: 'Scan', canScan: true, skills: [] },
    bed_manager: { type: 'logistics', theme: 'amber', icon: Bed, name: 'Bed Mgr', ap: 3, desc: 'Flow', ability: 'Clear Block', abilityCost: 2, maxCooldown: 3, abilityEffect: 'Force open Wards/ICU', actionText: 'Manage Flow', skills: [] }
};

const generateRoster = (counts, bonus = null) => {
    const roles = [];
    roles.push({ id: 'bronze_cmd', ...ROLE_TEMPLATES.bronze_cmd });
    roles.push({ id: 'nurse_ic', ...ROLE_TEMPLATES.nurse_ic });
    roles.push({ id: 'radiology', ...ROLE_TEMPLATES.radiology });
    roles.push({ id: 'bed_manager', ...ROLE_TEMPLATES.bed_manager });
    let seniorCount = counts.senior + (bonus === 'doctor' ? 1 : 0);
    let nurseCount = counts.nurse + (bonus === 'nurse' ? 1 : 0);
    
    for (let i = 0; i < seniorCount; i++) roles.push({ id: `senior_doc_${i}`, ...ROLE_TEMPLATES.senior_doc, name: seniorCount > 1 ? `Senior Doc ${i+1}` : 'Senior Doc' });
    for (let i = 0; i < counts.resident; i++) roles.push({ id: `resident_${i}`, ...ROLE_TEMPLATES.resident, name: counts.resident > 1 ? `ED Res ${i+1}` : 'ED Resident' });
    for (let i = 0; i < nurseCount; i++) roles.push({ id: `nurse_staff_${i}`, ...ROLE_TEMPLATES.nurse_staff, name: nurseCount > 1 ? `ED Nurse ${i+1}` : 'ED Nurse' });
    if (bonus === 'anaesthetist') roles.push({ id: 'anaesthetic_spr', ...ROLE_TEMPLATES.anaesthetic_spr });
    
    return roles.map(r => ({ ...r, currentAp: r.ap, cooldown: 0, disabled: false, consecutiveActionTurns: 0 }));
};

const ZONES = [
    { id: 'amb', name: 'Ambulance Bay', capacity: 12, type: 'intake', style: 'zone-intake' },
    { id: 'triage', name: 'Triage', capacity: 6, type: 'process', style: 'zone-process' },
    { id: 'resus', name: 'Resus (P1)', capacity: 4, type: 'clinical', style: 'zone-clinical' },
    { id: 'majors', name: 'Majors (P2)', capacity: 10, type: 'clinical', style: 'zone-clinical' },
    { id: 'ct', name: 'CT Scan', capacity: 1, type: 'diagnostic', style: 'zone-diagnostic' },
    { id: 'minors', name: 'Minors (P3)', capacity: 15, type: 'clinical', style: 'zone-clinical' },
    { id: 'icu', name: 'ICU/HDU', capacity: 6, type: 'ward', style: 'zone-exit' },
    { id: 'ward', name: 'Wards', capacity: 30, type: 'ward', style: 'zone-exit' },
    { id: 'theatre', name: 'Theatres', capacity: 2, type: 'treatment', style: 'zone-clinical' },
    { id: 'discharged', name: 'Home', capacity: 999, type: 'exit', style: 'zone-exit' },
    { id: 'morgue', name: 'Mortuary', capacity: 999, type: 'exit', style: 'zone-exit' }
];

const NAMES = ["Smith", "Jones", "Taylor", "Brown", "Williams", "Wilson", "Johnson", "Davies"];
const MALE = ["James", "John", "Robert", "Michael"]; 
const FEMALE = ["Mary", "Patricia", "Jennifer", "Linda"];

const PATIENT_TEMPLATES = {
    standard: [
        { category: 'P1', injuryLoc: 'chest', text: 'GSW Chest. Needs Thoracotomy.', reqSkill: 'advanced_trauma', vitals: { hr: 140, sbp: 70, rr: 32, spo2: 88, gcs: 14 }, deteriorationProfile: 'rapid', treatments: [{id: 't1', label: 'Bilateral Thoracostomies', correct: true}, {id: 't2', label: 'Pelvic Binder', correct: false}, {id: 't3', label: 'Pericardiocentesis', correct: false}, {id: 't4', label: 'Needle Decompression', correct: false}] },
        { category: 'P1', injuryLoc: 'abdo', text: 'Blast Abdomen. Rigid.', reqSkill: 'advanced_trauma', vitals: { hr: 130, sbp: 85, rr: 24, spo2: 94, gcs: 15 }, deteriorationProfile: 'rapid', treatments: [{id: 't1', label: 'TXA & Mass Transfusion', correct: true}, {id: 't2', label: 'Thoracotomy', correct: false}, {id: 't3', label: 'RSI', correct: false}] },
        { category: 'P2', injuryLoc: 'head', text: 'TBI. Asymmetric pupils.', reqSkill: 'advanced_trauma', vitals: { hr: 60, sbp: 160, rr: 12, spo2: 96, gcs: 7 }, deteriorationProfile: 'moderate', treatments: [{id: 't1', label: 'RSI & Neuroprotection', correct: true}, {id: 't2', label: 'Burr Hole', correct: false}, {id: 't3', label: 'Administer Ketamine', correct: false}] },
        { category: 'P2', injuryLoc: 'leg', text: 'Femur Fracture (Open).', reqSkill: 'advanced_trauma', vitals: { hr: 110, sbp: 110, rr: 20, spo2: 98, gcs: 15 }, deteriorationProfile: 'slow', treatments: [{id: 't1', label: 'Splint & Antibiotics', correct: true}, {id: 't2', label: 'Amputation', correct: false}, {id: 't3', label: 'Fasciotomy', correct: false}] },
        { category: 'P3', injuryLoc: 'arm', text: 'Deep Laceration.', reqSkill: 'care', vitals: { hr: 80, sbp: 120, rr: 14, spo2: 99, gcs: 15 }, deteriorationProfile: 'stable', treatments: [{id: 't1', label: 'Suture & Dress', correct: true}, {id: 't2', label: 'Cast Application', correct: false}, {id: 't3', label: 'Tourniquet', correct: false}] },
        { category: 'P3', injuryLoc: 'head', text: 'Mild Concussion.', reqSkill: 'care', vitals: { hr: 76, sbp: 118, rr: 14, spo2: 100, gcs: 15 }, deteriorationProfile: 'stable', treatments: [{id: 't1', label: 'Neuro Obs & Analgesia', correct: true}, {id: 't2', label: 'CT Venogram', correct: false}, {id: 't3', label: 'Immediate Discharge', correct: false}] },
    ],
    chem: [
        { category: 'P1', injuryLoc: 'head', text: 'Organophosphate Poisoning. Salivating.', reqSkill: 'advanced_trauma', vitals: { hr: 40, sbp: 80, rr: 35, spo2: 88, gcs: 10 }, deteriorationProfile: 'rapid', treatments: [{id: 't1', label: 'Atropine Infusion', correct: true}, {id: 't2', label: 'Adrenaline', correct: false}, {id: 't3', label: 'Flumazenil', correct: false}] },
        { category: 'P1', injuryLoc: 'chest', text: 'Cyanide Exposure.', reqSkill: 'advanced_trauma', vitals: { hr: 130, sbp: 70, rr: 40, spo2: 80, gcs: 8 }, deteriorationProfile: 'rapid', treatments: [{id: 't1', label: 'Hydroxocobalamin', correct: true}, {id: 't2', label: 'Naloxone', correct: false}, {id: 't3', label: 'High Flow Oxygen', correct: false}] },
    ],
    crush: [
        { category: 'P1', injuryLoc: 'leg', text: 'Crush Injury. Compartment Syndrome.', reqSkill: 'advanced_trauma', vitals: { hr: 110, sbp: 100, rr: 20, spo2: 96, gcs: 15 }, deteriorationProfile: 'moderate', treatments: [{id: 't1', label: 'Fluids & Bicarbonate', correct: true}, {id: 't2', label: 'Fasciotomy', correct: false}, {id: 't3', label: 'TXA', correct: false}] },
        { category: 'P2', injuryLoc: 'chest', text: 'Dust Inhalation. Wheezy.', reqSkill: 'care', vitals: { hr: 90, sbp: 120, rr: 24, spo2: 92, gcs: 15 }, deteriorationProfile: 'slow', treatments: [{id: 't1', label: 'Nebulisers & Steroids', correct: true}, {id: 't2', label: 'Intubation', correct: false}, {id: 't3', label: 'Needle Decompression', correct: false}] },
    ],
    paediatric: [
        { category: 'P1', injuryLoc: 'head', text: 'Child RTC. Unresponsive.', reqSkill: 'advanced_trauma', vitals: { hr: 160, sbp: 80, rr: 40, spo2: 92, gcs: 6 }, deteriorationProfile: 'rapid', treatments: [{id: 't1', label: 'Paediatric RSI', correct: true}, {id: 't2', label: 'High Flow O2', correct: false}, {id: 't3', label: 'Adrenaline Bolus', correct: false}] },
        { category: 'P2', injuryLoc: 'leg', text: 'Child Crush Injury. Leg deformed.', reqSkill: 'advanced_trauma', vitals: { hr: 140, sbp: 90, rr: 30, spo2: 98, gcs: 15 }, deteriorationProfile: 'moderate', treatments: [{id: 't1', label: 'Splint & Analgesia', correct: true}, {id: 't2', label: 'Immediate Amputation', correct: false}] },
        { category: 'P3', injuryLoc: 'arm', text: 'Child Laceration. Crying.', reqSkill: 'care', vitals: { hr: 120, sbp: 100, rr: 24, spo2: 100, gcs: 15 }, deteriorationProfile: 'stable', treatments: [{id: 't1', label: 'Steri-strips & Play Therapy', correct: true}, {id: 't2', label: 'Procedural Sedation', correct: false}] }
    ]
};

const getPatientNeeds = (p) => {
    const needs = [];
    if (!p.triaged) {
        needs.push({ id: 'triage', label: 'Primary Triage', icon: ClipboardCheck, color: 'text-slate-600', bg: 'bg-slate-100', borderColor: 'border-slate-300' });
    } else if (!p.secondaryTriaged) {
        needs.push({ id: 'secondary_triage', label: 'Secondary Triage', icon: ClipboardCheck, color: 'text-blue-600', bg: 'bg-blue-100', borderColor: 'border-blue-300' });
    }
    
    if (p.triaged && p.secondaryTriaged && !p.treated) {
        const needsScan = (p.injuryLoc === 'head' || p.injuryLoc === 'abdo') && !p.scanned;
        if (needsScan) needs.push({ id: 'scan', label: 'CT Scan', icon: Scan, color: 'text-purple-600', bg: 'bg-purple-100', borderColor: 'border-purple-300' });
        if (!needsScan) {
            const label = p.reqSkill === 'advanced_trauma' ? 'Needs Doctor' : 'Treatment';
            needs.push({ id: 'treat', label: label, icon: Stethoscope, color: 'text-emerald-600', bg: 'bg-emerald-100', borderColor: 'border-emerald-300', reqSkill: p.reqSkill });
        }
    }
    return needs;
};

const getColorStyle = (theme) => ({
    slate: 'border-slate-500 hover:bg-slate-50 text-slate-800',
    blue: 'border-blue-500 hover:bg-blue-50 text-blue-800',
    emerald: 'border-emerald-500 hover:bg-emerald-50 text-emerald-800',
    purple: 'border-purple-500 hover:bg-purple-50 text-purple-800',
    amber: 'border-amber-500 hover:bg-amber-50 text-amber-800'
}[theme] || 'border-gray-500');

const getActiveStyle = (theme) => ({
    slate: 'bg-slate-800 text-white border-slate-800',
    blue: 'bg-blue-700 text-white border-blue-700',
    emerald: 'bg-emerald-700 text-white border-emerald-700',
    purple: 'bg-purple-700 text-white border-purple-700',
    amber: 'bg-amber-700 text-white border-amber-700'
}[theme] || 'bg-gray-800');

const formatTime = (mins) => { 
    const h = Math.floor(mins / 60); 
    const m = mins % 60; 
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`; 
};

const generateCertificate = (playerNames, score, stats) => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'landscape' });
    
    doc.setLineWidth(3);
    doc.setDrawColor(30, 58, 138);
    doc.rect(10, 10, 277, 190);
    doc.setLineWidth(1);
    doc.setDrawColor(200, 200, 200);
    doc.rect(15, 15, 267, 180);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(32);
    doc.setTextColor(30, 58, 138);
    doc.text("CERTIFICATE OF COMPETENCE", 148.5, 40, null, null, "center");
    
    doc.setFontSize(16);
    doc.setTextColor(100, 100, 100);
    doc.text("This is to certify that", 148.5, 60, null, null, "center");

    doc.setFont("helvetica", "bolditalic");
    doc.setFontSize(24);
    doc.setTextColor(0, 0, 0);
    doc.text(playerNames || "Commander", 148.5, 75, null, null, "center");
    doc.setLineWidth(0.5);
    doc.line(80, 77, 217, 77); 

    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.setTextColor(60, 60, 60);
    doc.text("Has successfully completed the WMEBEM Incident Command Simulation.", 148.5, 95, null, null, "center");
    
    doc.setFillColor(245, 247, 250);
    doc.roundedRect(70, 105, 157, 25, 3, 3, 'F');
    doc.setFontSize(12);
    const triagePct = stats.triageTotal > 0 ? Math.round((stats.triageCorrect / stats.triageTotal) * 100) : 0;
    doc.text(`Score: ${score}   |   Patients Discharged: ${stats.discharged}   |   Triage Accuracy: ${triagePct}%`, 148.5, 122, null, null, "center");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(30, 58, 138);
    doc.text("Evidence of Progression towards RCEM 2021 Curriculum:", 148.5, 145, null, null, "center");
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    
    const sloX = 60;
    const sloY = 155;
    const lineHeight = 7;
    
    doc.text(" SLO 6: Lead and manage the Emergency Department", sloX, sloY);
    doc.setFont("helvetica", "italic");
    doc.text("   - Key Capability: Demonstrate the principles of Major Incident Management", sloX, sloY + lineHeight);
    
    doc.setFont("helvetica", "normal");
    doc.text(" SLO 1: Care for physiologically stable and unstable patients of all ages", sloX, sloY + (lineHeight * 2));
    doc.setFont("helvetica", "italic");
    doc.text("   - Key Capability: Delivery of complex care in high-pressure environments", sloX, sloY + (lineHeight * 3));

    const date = new Date().toLocaleDateString();
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(`Date Issued: ${date}`, 20, 185);
    doc.text("Verified by WMEBEM Digital Simulation Tool", 277, 185, null, null, "right");

    doc.save("Incident_Command_Certificate.pdf");
};

const generateCSV = (patients) => {
    let csvContent = "data:text/csv;charset=utf-8,Patient Name,Final Category,Location,Timeline\n";
    patients.forEach(p => {
        const historyStr = p.history.map(h => `[${h.time}] ${h.msg}`).join(" | ");
        csvContent += `${p.name},${p.category},${p.location},"${historyStr}"\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "wmebem_aar_log.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

const TimelineBar = ({ currentTurn, maxTurns }) => {
    const blocks = Array.from({ length: maxTurns + 6 }, (_, i) => i + 1);
    return (
        <div className="timeline-container">
            {blocks.map(turnNum => {
                let statusClass = "timeline-block";
                if (turnNum < currentTurn) statusClass += " past";
                else if (turnNum === currentTurn) statusClass += " active";
                if (turnNum > maxTurns) statusClass += " stand-down";
                return <div key={turnNum} className={statusClass} title={`Turn ${turnNum}`} />;
            })}
        </div>
    );
};

const NotificationLogModal = ({ logs, onClose }) => (
    <div className="fixed inset-0 bg-slate-900/90 flex items-center justify-center z-[100] p-4 modal-enter" onClick={onClose}>
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg h-[60vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b flex justify-between items-center bg-slate-50">
                <h2 className="font-black text-lg text-slate-800 flex items-center gap-2"><BookOpen size={20}/> Incident Log</h2>
                <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full"><X size={20}/></button>
            </div>
            <div className="p-4 overflow-y-auto flex-1 bg-slate-100 flex flex-col gap-2 custom-scrollbar">
                {logs.length === 0 && <div className="text-center text-slate-400 mt-10">No updates received.</div>}
                {logs.map((log, i) => (
                    <div key={i} className="p-3 bg-white rounded border border-slate-200 shadow-sm text-sm font-mono text-slate-700">
                        {log}
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const NewsTicker = ({ messages, onClick }) => (
    <div className="ticker-wrap shrink-0 z-30 relative" onClick={onClick}>
        <div className="ticker text-xs font-mono font-bold flex gap-8 items-center text-red-100">
            {messages.length > 0 ? messages.map((m, i) => <span key={i} className="flex items-center gap-2"><Siren size={12} className="text-red-500 animate-pulse"/> {m}</span>) : <span>INCIDENT DECLARED - AWAITING UPDATES...</span>}
        </div>
    </div>
);

const Toast = ({ msg, type, onClose }) => {
    const styles = { error: "bg-red-600 text-white", info: "bg-blue-600 text-white", success: "bg-emerald-600 text-white", warning: "bg-amber-500 text-white" };
    useEffect(() => { const timer = setTimeout(onClose, 3000); return () => clearTimeout(timer); }, [onClose]);
    return ( 
        <div className={`pointer-events-auto px-4 py-3 rounded shadow-lg mb-2 flex items-center gap-3 toast-enter ${styles[type] || styles.info} max-w-sm`}> 
            {type === 'error' && <AlertTriangle size={18} />}
            {type === 'success' && <CheckCircle size={18} />}
            {type === 'warning' && <ShieldAlert size={18} />}
            {type === 'info' && <BadgeInfo size={18} />} 
            <span className="text-sm font-bold shadow-black drop-shadow-sm">{msg}</span> 
            <button onClick={onClose} className="ml-auto opacity-70 hover:opacity-100"><X size={16}/></button> 
        </div> 
    );
};

const ToastContainer = ({ toasts, removeToast }) => ( 
    <div className="fixed top-16 right-4 z-[9999] pointer-events-none flex flex-col items-end"> 
        {toasts.map(t => <Toast key={t.id} msg={t.msg} type={t.type} onClose={() => removeToast(t.id)} />)} 
    </div> 
);

const StickFigure = ({ injuryLoc, className }) => ( 
    <svg viewBox="0 0 100 100" className={`overflow-visible ${className}`}>
        <circle cx="50" cy="15" r="12" fill="none" stroke="currentColor" strokeWidth="6" />
        <line x1="50" y1="27" x2="50" y2="60" stroke="currentColor" strokeWidth="6" />
        <line x1="50" y1="35" x2="20" y2="50" stroke="currentColor" strokeWidth="6" />
        <line x1="50" y1="35" x2="80" y2="50" stroke="currentColor" strokeWidth="6" />
        <line x1="50" y1="60" x2="30" y2="95" stroke="currentColor" strokeWidth="6" />
        <line x1="50" y1="60" x2="70" y2="95" stroke="currentColor" strokeWidth="6" />
        {injuryLoc === 'head' && <circle cx="50" cy="15" r="15" stroke="#ef4444" strokeWidth="4" fill="none" className="animate-pulse" />}
        {injuryLoc === 'chest' && <circle cx="50" cy="40" r="12" stroke="#ef4444" strokeWidth="4" fill="none" className="animate-pulse" />}
        {injuryLoc === 'abdo' && <circle cx="50" cy="55" r="10" stroke="#ef4444" strokeWidth="4" fill="none" className="animate-pulse" />}
        {injuryLoc === 'arm' && <circle cx="20" cy="50" r="8" stroke="#ef4444" strokeWidth="4" fill="none" className="animate-pulse" />}
        {injuryLoc === 'leg' && <circle cx="30" cy="90" r="8" stroke="#ef4444" strokeWidth="4" fill="none" className="animate-pulse" />}
    </svg>
);

const VitalsDisplay = ({ vitals, isTriaged }) => {
    if (!isTriaged) return <div className="text-slate-400 text-[10px] italic text-center py-2 bg-slate-800/20 rounded">Vitals obscured pending triage</div>;
    const getVitalClass = (val, type) => {
        if (type === 'hr') return (val > 120 || val < 50) ? 'vital-red' : (val > 100 ? 'vital-amber' : 'vital-normal');
        if (type === 'sbp') return (val < 90) ? 'vital-red' : (val < 100 ? 'vital-amber' : 'vital-normal');
        if (type === 'rr') return (val > 30 || val < 10) ? 'vital-red' : (val > 22 ? 'vital-amber' : 'vital-normal');
        if (type === 'gcs') return (val < 13) ? 'vital-red' : (val < 15 ? 'vital-amber' : 'vital-normal');
        return 'text-slate-400';
    };
    return ( 
        <div className="grid grid-cols-5 gap-2 text-[12px] font-mono bg-slate-900/50 p-2 rounded border border-slate-700/50">
            <div className="text-center"><span className="text-slate-500 block text-[9px] uppercase">GCS</span><span className={`text-base font-bold ${getVitalClass(vitals.gcs, 'gcs')}`}>{vitals.gcs}</span></div>
            <div className="text-center"><span className="text-slate-500 block text-[9px] uppercase">HR</span><span className={`text-base font-bold ${getVitalClass(vitals.hr, 'hr')}`}>{vitals.hr}</span></div>
            <div className="text-center"><span className="text-slate-500 block text-[9px] uppercase">BP</span><span className={`text-base font-bold ${getVitalClass(vitals.sbp, 'sbp')}`}>{vitals.sbp}</span></div>
            <div className="text-center"><span className="text-slate-500 block text-[9px] uppercase">RR</span><span className={`text-base font-bold ${getVitalClass(vitals.rr, 'rr')}`}>{vitals.rr}</span></div>
            <div className="text-center"><span className="text-slate-500 block text-[9px] uppercase">SpO2</span><span className={`text-base font-bold ${getVitalClass(vitals.spo2, 'spo2')}`}>{vitals.spo2}%</span></div>
        </div> 
    );
};

const Counter = ({ label, value, onChange, min, max }) => (
    <div className="flex justify-between items-center bg-slate-50 p-3 rounded border border-slate-200">
        <span className="text-sm font-bold text-slate-700">{label}</span>
        <div className="flex items-center gap-3">
            <button type="button" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} className="w-8 h-8 rounded bg-white border flex items-center justify-center hover:bg-slate-100 disabled:opacity-50 text-slate-600 cursor-pointer"><Minus size={16}/></button>
            <span className="w-6 text-center font-bold">{value}</span>
            <button type="button" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} className="w-8 h-8 rounded bg-white border flex items-center justify-center hover:bg-slate-100 disabled:opacity-50 text-slate-600 cursor-pointer"><Plus size={16}/></button>
        </div>
    </div>
);

const TutorialOverlay = ({ step, children }) => (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-[100] pointer-events-none w-full max-w-lg px-4">
        <div className="bg-slate-900 border-4 border-blue-500 p-6 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] text-center animate-bounce">
            <div className="flex items-center justify-center gap-2 mb-2 text-blue-400 font-black uppercase tracking-wide text-sm"><Lightbulb size={20} /> Training Protocol: Step {step}/7</div>
            <div className="text-white font-bold text-lg leading-tight">{children}</div>
        </div>
    </div>
);

const PathwayProgress = ({ patient }) => {
    const isDischarged = ['discharged','ward','icu','morgue'].includes(patient.location);
    const needsScan = (patient.injuryLoc === 'head' || patient.injuryLoc === 'abdo');
    
    return (
        <div className="flex items-center justify-center gap-1 mt-2 border-t border-black/10 pt-1">
            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${patient.triaged ? 'bg-emerald-500 text-white' : 'bg-blue-500 text-white animate-pulse'}`}><ClipboardCheck size={10} /></div>
            <div className={`h-0.5 w-3 ${patient.triaged ? 'bg-emerald-500' : 'bg-gray-200'}`}></div>

            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${patient.secondaryTriaged ? 'bg-emerald-500 text-white' : (patient.triaged ? 'bg-blue-500 text-white animate-pulse' : 'bg-gray-200 text-gray-400')}`}><ClipboardCheck size={10} /></div>
            <div className={`h-0.5 w-3 ${patient.secondaryTriaged ? 'bg-emerald-500' : 'bg-gray-200'}`}></div>
            
            {needsScan && (
                <>
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${patient.scanned ? 'bg-emerald-500 text-white' : (patient.secondaryTriaged ? 'bg-purple-500 text-white animate-pulse' : 'bg-gray-200 text-gray-400')}`}><Scan size={10} /></div>
                    <div className={`h-0.5 w-3 ${patient.scanned ? 'bg-emerald-500' : 'bg-gray-200'}`}></div>
                </>
            )}
            
            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${patient.treated ? 'bg-emerald-500 text-white' : ((patient.secondaryTriaged && (!needsScan || patient.scanned)) ? 'bg-blue-500 text-white animate-pulse' : 'bg-gray-200 text-gray-400')}`}><Stethoscope size={10} /></div>
            <div className={`h-0.5 w-3 ${patient.treated ? 'bg-emerald-500' : 'bg-gray-200'}`}></div>
            
            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${isDischarged ? 'bg-emerald-500 text-white' : (patient.treated ? 'bg-amber-500 text-white animate-pulse' : 'bg-gray-200 text-gray-400')}`}><DoorOpen size={10} /></div>
        </div>
    );
};

const PatientCard = ({ patient, onSelect, isSelected, onDragStart, tutorialStep }) => {
    const getColorClass = (cat) => {
        if (!patient.triaged) return "neutral-bg";
        if(cat === 'P1') return "p1-bg"; if(cat === 'P2') return "p2-bg"; if(cat === 'P3') return "p3-bg"; return "dead-bg";
    };
    const isRevealed = patient.location !== 'amb' || patient.triaged;
    const isPreAlert = patient.location === 'amb' && patient.category === 'P1';
    const isDeteriorating = patient.deteriorating;
    const isP1Critical = patient.triaged && patient.category === 'P1' && !patient.treated;
    const isTarget = tutorialStep === 2 && patient.uniqueId === 99999;

    return (
        <div draggable onDragStart={(e) => onDragStart(e, patient.uniqueId)} onClick={(e) => { e.stopPropagation(); onSelect(patient.uniqueId); }} onTouchStart={(e) => { e.stopPropagation(); onSelect(patient.uniqueId); }}
            className={`p-2 rounded-md shadow-sm border cursor-pointer mb-2 transition-all relative group 
            ${getColorClass(patient.category)} 
            ${isSelected ? 'ring-4 ring-blue-500 ring-offset-1 scale-105 z-10' : 'hover:scale-[1.02] border-black/10'} 
            ${isP1Critical ? 'pulse-critical' : ''}
            ${isTarget ? 'tutorial-highlight tutorial-pointer-down' : ''}
            `}>
            <div className="flex justify-between items-start mb-1">
                <span className="font-black text-slate-900 text-xs truncate w-24">{patient.name}</span>
                {isRevealed ? ( 
                    <span className={`px-1.5 rounded text-[10px] font-black border border-black/10 shadow-sm ${patient.category === 'P1' ? 'bg-red-600 text-white' : 'bg-white/90'}`}>{patient.category}</span> 
                ) : ( 
                    <span className="px-1.5 bg-gray-200 rounded text-[10px] font-bold text-gray-500">?</span> 
                )}
            </div>
            
            {isRevealed && <PathwayProgress patient={patient} />}
            
            {isPreAlert && !patient.triaged && <div className="absolute top-1 right-1 bg-red-600 text-white text-[9px] font-black px-1 rounded shadow-sm prealert-flash z-20 border border-white">PRE-ALERT</div>}
            {isDeteriorating && <div className="absolute top-8 right-1 text-red-600 animate-bounce"><TrendingUp size={16} /></div>}
            {isP1Critical && patient.turnsWaiting > 0 && (
                <div className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] px-1 rounded shadow animate-bounce">
                    CRITICAL
                </div>
            )}
        </div>
    );
};

const ZoneDisplay = ({ zone, patients, onSelect, selectedPatientId, onDrop, onZoneClick, activeEvent, blockState, tutorialStep, highlightScan }) => {
    const zPatients = patients.filter(p => p.location === zone.id);
    const isBlockedEvent = activeEvent?.id === 'ct_overheat' && zone.id === 'ct';
    const isFlowBlock = blockState && blockState[zone.id];
    const isBlocked = isBlockedEvent || isFlowBlock;

    let cap = zone.capacity;
    if (activeEvent?.id === 'norovirus' && zone.id === 'ward') cap -= 5;
    
    const handleClick = (e) => { e.stopPropagation(); if (!isBlocked && selectedPatientId && onZoneClick) onZoneClick(zone.id); };
    const isDropTarget = selectedPatientId && !isBlocked;

    const isScanTarget = zone.id === 'ct' && highlightScan;
    const isFull = zPatients.length >= cap;

    return (
        <div onDragOver={e => !isBlocked && e.preventDefault()} onDrop={e => !isBlocked && onDrop(e, zone.id)} onClick={handleClick} onTouchStart={handleClick}
            className={`border rounded-lg flex flex-col shadow-sm overflow-hidden zone-card ${zone.style} ${isDropTarget ? 'ring-2 ring-emerald-400 ring-opacity-50 animate-pulse' : ''} ${selectedPatientId ? 'dimmed cursor-pointer' : ''} ${isBlocked ? 'opacity-50 pointer-events-none bg-slate-100' : ''} ${isScanTarget ? 'glow-zone-purple' : ''} ${isFull ? 'ring-capacity' : ''} h-auto relative flex-1 min-h-[120px]`}>
            {isBlocked && <div className="absolute inset-0 flex items-center justify-center bg-slate-800/80 z-10 font-bold text-white text-xs uppercase tracking-widest flex-col gap-2"><ShieldAlert size={24} className="text-red-400" /> BLOCKED</div>}
            <div className="px-2 py-1 border-b flex justify-between items-center bg-white/50">
                <span className="font-bold text-[10px] uppercase text-slate-500 truncate">{zone.name}</span>
                <span className={`text-[10px] font-bold px-1.5 rounded ${isFull ? 'bg-red-100 text-red-600' : 'bg-slate-100'}`}>{zPatients.length}/{cap}</span>
            </div>
            <div className="p-2 flex flex-col gap-1 overflow-y-auto max-h-[250px] custom-scrollbar relative z-10">
                {zPatients.map(p => ( <PatientCard key={p.uniqueId} patient={p} isSelected={selectedPatientId === p.uniqueId} onSelect={onSelect} onDragStart={(e, id) => e.dataTransfer.setData("patientId", id)} tutorialStep={tutorialStep} /> ))}
                {zPatients.length === 0 && <div className="h-full flex items-center justify-center opacity-20 py-4 pointer-events-none"><Siren size={24}/></div>}
            </div>
        </div>
    );
};

const ActionHUD = ({ patient, role, onAction, onAbility, onClose, activeEvent, isActiveTriage, tutorialStep }) => {
    if (!patient) return null;
    const needs = getPatientNeeds(patient);
    const triageCost = activeEvent?.id === 'it_failure' ? 2 : 1;
    
    const canTriage = needs.some(n => n.id === 'triage') && role.canTriage;
    const canSecondaryTriage = needs.some(n => n.id === 'secondary_triage') && role.canSecondaryTriage;
    const canScan = needs.some(n => n.id === 'scan') && role.canScan && activeEvent?.id !== 'ct_overheat';
    const canTreat = needs.some(n => n.id === 'treat') && role.canTreat && (!patient.reqSkill || role.skills.includes(patient.reqSkill));
    
    let mainActionText = "No Action"; let isMainActionEnabled = false; let mainActionColor = "bg-slate-600";
    let actionType = null;
    let isTarget = false;

    if (canTriage) { 
        mainActionText = `Primary Triage (${triageCost} AP)`; isMainActionEnabled = true; mainActionColor = "bg-blue-600 hover:bg-blue-500"; 
        actionType = 'triage';
        if(tutorialStep === 3) isTarget = true;
    }
    else if (canSecondaryTriage) {
        mainActionText = "Secondary Triage (1 AP)"; isMainActionEnabled = true; mainActionColor = "bg-blue-600 hover:bg-blue-500";
        actionType = 'secondary_triage';
    }
    else if (canScan) { mainActionText = "Perform CT Scan (1 AP)"; isMainActionEnabled = true; mainActionColor = "bg-purple-600 hover:bg-purple-500"; actionType = 'scan'; }
    else if (canTreat) { 
        mainActionText = "Administer Treatment (1 AP)"; 
        isMainActionEnabled = true; 
        mainActionColor = "bg-emerald-600 hover:bg-emerald-500"; 
        actionType = 'treat';
        if(tutorialStep === 5) isTarget = true;
    }
    else if (needs.some(n => n.id === 'secondary_triage')) { mainActionText = "Requires Doctor Review"; mainActionColor = "bg-slate-700 text-slate-400"; }
    else if (needs.some(n => n.id === 'scan')) { mainActionText = activeEvent?.id === 'ct_overheat' ? "Scanner Broken" : "Needs CT Scan First"; mainActionColor = "bg-slate-700 text-slate-400"; }
    else if (needs.some(n => n.id === 'treat')) { mainActionText = patient.reqSkill === 'advanced_trauma' ? "Requires Doctor (Trauma)" : "Requires Clinical Role"; mainActionColor = "bg-slate-700 text-slate-400"; }
    else if (patient.treated) { mainActionText = "Patient Stable"; mainActionColor = "bg-emerald-800 text-emerald-200"; }

    return (
        <div className="w-full bg-slate-900/95 backdrop-blur-md text-white border-t border-slate-700 shadow-2xl z-50 hud-enter flex flex-col lg:flex-row h-auto lg:h-[240px] shrink-0">
            <div className="p-4 flex items-center gap-4 border-b lg:border-b-0 lg:border-r border-slate-700 w-full lg:w-1/2 bg-slate-800/50 shrink-0">
                <StickFigure injuryLoc={patient.injuryLoc} className="h-16 w-16 lg:h-20 lg:w-20 text-slate-300" />
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-black px-2 py-0.5 rounded text-slate-900 ${patient.triaged ? (patient.category === 'P1' ? 'bg-red-300' : patient.category === 'P2' ? 'bg-amber-300' : 'bg-green-300') : 'bg-gray-200'}`}>{patient.triaged ? patient.category : 'Unknown'}</span>
                        <h2 className="text-xl lg:text-2xl font-bold truncate">{patient.name}</h2>
                    </div>
                    <p className="text-slate-400 text-sm mb-2">{patient.age} {patient.gender} • {patient.secondaryTriaged ? patient.text : 'Awaiting Full Assessment...'}</p>
                    <VitalsDisplay vitals={patient.vitals} isTriaged={patient.triaged || isActiveTriage} />
                </div>
                <button onClick={onClose} className="lg:hidden p-2 text-slate-500 hover:text-white"><X size={20}/></button>
            </div>
            
            <div className="p-4 w-full lg:w-1/2 flex flex-col gap-2 bg-slate-800/30 shrink-0 justify-center">
                <div className="flex justify-between items-center text-xs text-slate-400 uppercase font-bold mb-1">
                    <span>Role: {role.name}</span>
                    <span className={role.currentAp === 0 ? "text-red-400" : "text-emerald-400"}>AP: {role.currentAp} / {role.ap}</span>
                </div>
                <button onClick={() => onAction(actionType)} disabled={!isMainActionEnabled || role.currentAp < (actionType === 'triage' && activeEvent?.id === 'it_failure' ? 2 : 1)} className={`flex-1 py-4 rounded-xl font-bold text-base shadow-lg transition-all flex items-center justify-center gap-2 ${mainActionColor} disabled:opacity-50 disabled:cursor-not-allowed ${isTarget ? 'tutorial-highlight tutorial-pointer-up bg-white text-blue-600' : ''}`}>
                    {(canTriage || canSecondaryTriage) && <ClipboardCheck size={20} />}
                    {canScan && <Scan size={20} />}
                    {canTreat && <Stethoscope size={20} />}
                    {mainActionText}
                </button>
                <button onClick={onAbility} disabled={role.cooldown > 0 || role.currentAp < (role.abilityCost === 'ALL' ? 1 : role.abilityCost)} className="py-3 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 border border-slate-600">
                    <ShieldAlert size={18} />{role.ability}: {role.abilityEffect}
                    {role.cooldown > 0 && <span className="text-amber-400 ml-1">(Wait {role.cooldown})</span>}
                </button>
            </div>
            <button onClick={onClose} className="absolute top-0 right-0 p-2 text-slate-500 hover:text-white hidden lg:block"><X size={16}/></button>
        </div>
    );
};

const TreatmentModal = ({ patient, onClose, onSelectTreatment, tutorialStep }) => {
    return (
        <div className="fixed inset-0 bg-slate-900/90 flex items-center justify-center z-[100] p-4 modal-enter">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 flex flex-col relative">
                <div className="px-6 py-4 border-b flex justify-between items-center bg-slate-50">
                    <div className="flex items-center gap-2">
                        <Stethoscope size={18} className="text-emerald-600" />
                        <h2 className="text-sm font-black text-slate-800 uppercase tracking-wide">Targeted Intervention</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X size={20} className="text-slate-400" /></button>
                </div>
                <div className="p-6 bg-slate-50/50">
                    <p className="text-sm text-slate-600 mb-6 text-center">Select the primary clinical intervention for this casualty. Incorrect treatments will cause immediate deterioration.</p>
                    
                    <div className="space-y-3">
                        {patient.treatments.map((t) => {
                            const isTarget = tutorialStep === 6 && t.correct;
                            return (
                                <button key={t.id} onClick={() => onSelectTreatment(t)} className={`w-full text-left p-4 bg-white border-2 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 rounded-xl transition-all font-bold text-slate-800 shadow-sm flex justify-between items-center group ${isTarget ? 'tutorial-highlight tutorial-pointer-right' : ''}`}>
                                    {t.label}
                                    <ArrowRight size={16} className="text-slate-300 group-hover:text-emerald-500" />
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

const TriageModal = ({ patient, onClose, onConfirm, scenarioType }) => {
    const [step, setStep] = useState(0); 
    const [isChild, setIsChild] = useState(scenarioType === 'paediatric');
    if (!patient) return null;

    const renderStep = () => {
        if (step === 0) {
            return (
                <div className="animate-fadeIn flex flex-col h-full">
                    <div className="flex-1 flex flex-col items-center justify-center">
                        <h3 className="text-xl font-black text-slate-900 mb-2 text-center">Patient Age Category</h3>
                        <p className="text-slate-500 text-center mb-8">Select the appropriate triage pathway.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 shrink-0">
                        <button onClick={() => { setIsChild(false); setStep(1); }} className="py-4 bg-slate-700 hover:bg-slate-800 text-white rounded-xl font-bold text-lg shadow-lg">Adult (Over 12)</button>
                        <button onClick={() => { setIsChild(true); setStep(1); }} className="py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg shadow-lg">Child (Under 12)</button>
                    </div>
                </div>
            );
        }
        if (step === 1) {
            return (
                <div className="animate-fadeIn flex flex-col h-full">
                    <div className="flex-1 flex flex-col items-center justify-center">
                        <div className="flex gap-6 mb-6">
                            <div className={`flex flex-col items-center p-4 rounded-xl border-2 cursor-default ${patient.mobility === 'walking' ? 'bg-green-50 border-green-500' : 'bg-gray-50 border-gray-200 opacity-50'}`}>
                                <PersonStanding size={64} className={patient.mobility === 'walking' ? 'text-green-600' : 'text-gray-400'} />
                                <span className="font-bold text-sm mt-2 text-gray-600">Walking</span>
                            </div>
                            <div className={`flex flex-col items-center p-4 rounded-xl border-2 cursor-default ${patient.mobility !== 'walking' ? 'bg-red-50 border-red-500' : 'bg-gray-50 border-gray-200 opacity-50'}`}>
                                <Stretcher size={64} className={patient.mobility !== 'walking' ? 'text-red-600' : 'text-gray-400'} />
                                <span className="font-bold text-sm mt-2 text-gray-600">Stretcher</span>
                            </div>
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-2 text-center">Mobility Assessment</h3>
                        <p className="text-slate-500 text-center mb-8">Is the patient walking?</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 shrink-0">
                        <button onClick={() => onConfirm('P3')} className="py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-lg shadow-lg flex flex-col items-center justify-center"><span>YES</span><span className="text-xs opacity-80 font-normal">Priority 3</span></button>
                        <button onClick={() => setStep(2)} className="py-4 bg-slate-700 hover:bg-slate-800 text-white rounded-xl font-bold text-lg shadow-lg">NO / UNABLE</button>
                    </div>
                </div>
            );
        }
        if (step === 2) {
            const rr = patient.vitals.rr;
            const isP1 = isChild ? (rr < 15 || rr > 40) : (rr < 10 || rr > 29);
            return (
                <div className="animate-fadeIn flex flex-col h-full">
                    <div className="flex-1 flex flex-col items-center justify-center">
                        <div className="w-32 h-32 rounded-full bg-white border-4 border-slate-100 shadow-inner flex flex-col items-center justify-center mb-4 relative overflow-hidden">
                            <div className={`absolute inset-0 opacity-10 ${isP1 ? 'bg-red-500 animate-pulse' : 'bg-blue-500'}`}></div>
                            <span className="text-4xl font-black text-slate-800">{rr}</span>
                            <span className="text-[10px] uppercase font-bold text-slate-400">Breaths/min</span>
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-2 text-center">Respiratory Assessment</h3>
                        <p className="text-slate-500 text-center max-w-[200px]">Is Respiratory Rate {isChild ? '15-40' : '10-29'}?</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 shrink-0">
                        <button onClick={() => setStep(3)} className="py-4 bg-slate-700 hover:bg-slate-800 text-white rounded-xl font-bold text-lg shadow-lg">YES</button>
                        <button onClick={() => onConfirm('P1')} className="py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-lg shadow-lg flex flex-col items-center justify-center"><span>NO</span><span className="text-xs opacity-80 font-normal">Priority 1</span></button>
                    </div>
                </div>
            );
        }
        if (step === 3) {
            const hr = patient.vitals.hr;
            const isP1 = isChild ? (hr >= 140) : (hr >= 120);
            return (
                <div className="animate-fadeIn flex flex-col h-full">
                    <div className="flex-1 flex flex-col items-center justify-center">
                        <div className="w-32 h-32 rounded-full bg-white border-4 border-slate-100 shadow-inner flex flex-col items-center justify-center mb-4 relative overflow-hidden">
                            <div className={`absolute inset-0 opacity-10 ${isP1 ? 'bg-red-500 animate-pulse' : 'bg-amber-500'}`}></div>
                            <span className="text-4xl font-black text-slate-800">{hr}</span>
                            <span className="text-[10px] uppercase font-bold text-slate-400">Beats/min</span>
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-2 text-center">Circulation Assessment</h3>
                        <p className="text-slate-500 text-center max-w-[200px]">Is Heart Rate &lt; {isChild ? '140' : '120'}?</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 shrink-0">
                        <button onClick={() => onConfirm('P2')} className="py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-lg shadow-lg flex flex-col items-center justify-center"><span>YES</span><span className="text-xs opacity-80 font-normal">Priority 2</span></button>
                        <button onClick={() => onConfirm('P1')} className="py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-lg shadow-lg flex flex-col items-center justify-center"><span>NO</span><span className="text-xs opacity-80 font-normal">Priority 1</span></button>
                    </div>
                </div>
            );
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/90 flex items-center justify-center z-[100] p-4 modal-enter">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm h-[500px] overflow-hidden border border-slate-200 flex flex-col relative">
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                <div className="px-6 py-4 border-b flex justify-between items-center bg-slate-50">
                    <div className="flex items-center gap-2">
                        <div className="bg-slate-200 p-1.5 rounded text-slate-600"><ClipboardCheck size={18} /></div>
                        <div>
                            <h2 className="text-sm font-black text-slate-800 uppercase tracking-wide leading-none">MITT Triage</h2>
                            <p className="text-[10px] text-slate-500 font-bold">NHS England Protocol</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X size={20} className="text-slate-400 hover:text-slate-700" /></button>
                </div>
                <div className="flex-1 p-6 bg-slate-50/50">
                    {renderStep()}
                </div>
                <div className="px-8 py-6 bg-white border-t flex justify-center gap-3">
                    {[0, 1, 2, 3].map(i => (
                        <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-blue-600' : (i < step ? 'w-2 bg-green-500' : 'w-2 bg-slate-200')}`}></div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const MethaneBrief = ({ scenario, onDeploy }) => {
    const [bonus, setBonus] = useState(null);

    return (
        <div className="fixed inset-0 bg-slate-900 flex items-center justify-center z-[100] p-4 animate-fade-in text-white">
            <div className="max-w-2xl w-full bg-slate-800 rounded-2xl overflow-hidden shadow-2xl border border-slate-700">
                <div className="bg-red-600 p-6 flex items-center gap-4">
                    <Siren size={32} className="animate-pulse" />
                    <div>
                        <h1 className="text-2xl font-black uppercase tracking-widest">Ambulance Control Dispatch</h1>
                        <p className="font-bold opacity-90">Pre-Hospital Intelligence</p>
                    </div>
                </div>
                <div className="p-8">
                    <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl font-mono text-sm leading-relaxed mb-8 text-emerald-400 shadow-inner">
                        <span className="text-slate-500 block mb-2 font-bold uppercase tracking-widest text-[10px]">Incoming Transmission</span>
                        <p>{scenario.methane}</p>
                    </div>
                    
                    <h3 className="text-lg font-bold mb-4 uppercase tracking-wide text-slate-300">Anticipate Resources</h3>
                    <p className="text-sm text-slate-400 mb-4">You have authority to call in one emergency reserve before patients arrive.</p>
                    
                    <div className="grid grid-cols-4 gap-4 mb-8">
                        <button onClick={() => setBonus('doctor')} className={`p-4 rounded-xl border-2 text-center transition-all ${bonus === 'doctor' ? 'border-blue-500 bg-blue-900/30' : 'border-slate-600 hover:border-slate-500'}`}>
                            <Stethoscope size={24} className="mx-auto mb-2 text-blue-400"/>
                            <span className="font-bold text-sm block">Extra Doctor</span>
                        </button>
                        <button onClick={() => setBonus('nurse')} className={`p-4 rounded-xl border-2 text-center transition-all ${bonus === 'nurse' ? 'border-emerald-500 bg-emerald-900/30' : 'border-slate-600 hover:border-slate-500'}`}>
                            <Syringe size={24} className="mx-auto mb-2 text-emerald-400"/>
                            <span className="font-bold text-sm block">Extra Nurse</span>
                        </button>
                        <button onClick={() => setBonus('blood')} className={`p-4 rounded-xl border-2 text-center transition-all ${bonus === 'blood' ? 'border-red-500 bg-red-900/30' : 'border-slate-600 hover:border-slate-500'}`}>
                            <Droplet size={24} className="mx-auto mb-2 text-red-400"/>
                            <span className="font-bold text-sm block">Extra Blood (+10)</span>
                        </button>
                        <button onClick={() => setBonus('anaesthetist')} className={`p-4 rounded-xl border-2 text-center transition-all ${bonus === 'anaesthetist' ? 'border-purple-500 bg-purple-900/30' : 'border-slate-600 hover:border-slate-500'}`}>
                            <Wind size={24} className="mx-auto mb-2 text-purple-400"/>
                            <span className="font-bold text-sm block">Anaesthetic SpR</span>
                        </button>
                    </div>
                    
                    <button onClick={() => onDeploy(bonus)} disabled={!bonus} className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-black text-lg uppercase tracking-widest transition-colors shadow-lg">
                        Deploy Department
                    </button>
                </div>
            </div>
        </div>
    );
};

const EventModal = ({ event, onClose }) => (
    <div className="fixed inset-0 bg-slate-900/80 flex items-center justify-center z-[100] p-4 modal-enter">
        <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full text-center">
            <AlertTriangle size={48} className="mx-auto text-red-600 mb-4" />
            <h2 className="text-xl font-bold text-slate-800 mb-2">{event.title}</h2>
            <p className="text-slate-600 mb-6">{event.desc}</p>
            <button onClick={onClose} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors">Acknowledge</button>
        </div>
    </div>
);

const GameOver = ({ reason, stats, onRestart, gameOverType, MAX_TURNS, deathDetails, patients }) => (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full">
            <h1 className={`text-3xl font-black mb-2 text-center ${gameOverType === 'win' ? 'text-emerald-600' : 'text-red-600'}`}>{gameOverType === 'win' ? 'INCIDENT MANAGED' : 'INCIDENT FAILED'}</h1>
            <p className="text-slate-600 mb-6 text-center">{reason}</p>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-100 p-4 rounded-lg border border-slate-200 text-center">
                    <span className="block text-[10px] uppercase font-bold text-slate-500">Final Score</span>
                    <span className="block text-2xl font-black text-slate-800">{stats.score}</span>
                </div>
                <div className="bg-slate-100 p-4 rounded-lg border border-slate-200 text-center">
                    <span className="block text-[10px] uppercase font-bold text-slate-500">Discharged</span>
                    <span className="block text-2xl font-black text-slate-800">{stats.discharged}</span>
                </div>
                <div className="bg-slate-100 p-4 rounded-lg border border-slate-200 text-center">
                    <span className="block text-[10px] uppercase font-bold text-slate-500">Triage Accuracy</span>
                    <span className="block text-2xl font-black text-slate-800">{stats.triageTotal > 0 ? Math.round((stats.triageCorrect / stats.triageTotal) * 100) : 0}%</span>
                </div>
            </div>

            <div className="mb-6 border border-slate-200 rounded-lg overflow-hidden">
                <div className="bg-slate-50 px-4 py-2 border-b font-bold text-sm text-slate-800 flex items-center gap-2">
                    <AlertTriangle size={16} /> After Action Review (AAR)
                </div>
                <div className="p-4 bg-white max-h-40 overflow-y-auto custom-scrollbar">
                    {deathDetails.length === 0 ? (
                        <p className="text-sm text-emerald-600 font-bold">No mortality events recorded.</p>
                    ) : (
                        <ul className="space-y-2">
                            {deathDetails.map((d, i) => (
                                <li key={i} className="text-sm text-red-600 border-b border-slate-100 pb-2">
                                    <span className="font-bold">{d.patientName}</span> died on Turn {d.turn}. <br/>
                                    <span className="text-slate-600 text-xs">Cause: {d.reason}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
                {gameOverType === 'win' && (
                    <button onClick={() => generateCertificate("Commander", stats.score, stats)} className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors col-span-2">
                        Download Certificate
                    </button>
                )}
                <button onClick={() => generateCSV(patients)} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors col-span-2">
                    Export Detailed Incident Log (CSV)
                </button>
            </div>
            <button onClick={onRestart} className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-lg transition-colors">
                Return to Main Menu
            </button>
        </div>
    </div>
);

const Modal = ({ title, onClose, children }) => (
    <div className="fixed inset-0 bg-slate-900/80 flex items-center justify-center z-[100] p-4 modal-enter">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
            <div className="p-4 border-b flex justify-between items-center bg-slate-50 rounded-t-xl">
                <h2 className="font-black text-lg text-slate-800">{title}</h2>
                <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X size={20} className="text-slate-500" /></button>
            </div>
            <div className="p-6 overflow-y-auto custom-scrollbar">{children}</div>
        </div>
    </div>
);

const UserGuide = () => (
    <div className="space-y-4 text-sm text-slate-700">
        <h3 className="font-bold text-base text-slate-900">How to Play</h3>
        <ul className="list-disc pl-5 space-y-2">
            <li>Select staff roles from the left menu to view their Action Points (AP) and special abilities.</li>
            <li>Click on waiting patients to assess them. Use AP to perform Primary Triage.</li>
            <li>Assign a senior doctor to perform Secondary Triage to reveal specific treatment needs.</li>
            <li>Drag and drop patients between zones to manage department flow.</li>
            <li>Ensure Priority 1 (P1) patients are treated quickly to avoid deterioration.</li>
            <li>Use special abilities to overcome blocks and random events.</li>
            <li>Discharge stable patients to free up beds and increase your score.</li>
            <li>Avoid using all Action Points for a staff member multiple turns in a row. They will lose AP due to fatigue.</li>
        </ul>
    </div>
);

const initialGameState = {
    gameState: 'start', turn: 1, score: 100, deaths: 0, discharged: 0,
    roleStates: [], futureRoster: [], currentRoleId: null, patients: [],
    resources: { blood: 20, vents: 8 }, simTime: 12 * 60,
    activeEvent: null, gameOverType: null, modalContent: null,
    selectedScenario: 'standard', difficulty: 'standard', phase: 'active', blockState: { icu: false, ward: false },
    deathDetails: [], triageStats: { total: 0, correct: 0 }, notifications: []
};

function gameReducer(state, action) {
    switch (action.type) {
        case 'START_GAME':
            return { ...initialGameState, ...action.payload };
        case 'UPDATE_STATE':
            return { ...state, ...action.payload };
        case 'END_GAME':
            return { ...state, gameState: 'gameover', gameOverType: action.payload.type, modalContent: action.payload.reason };
        case 'UNDO':
            return action.payload ? { ...action.payload } : state;
        default:
            return state;
    }
}

const App = () => {
    const [state, dispatch] = useReducer(gameReducer, initialGameState);
    const [playerCount, setPlayerCount] = useState(1);
    const [staffCounts, setStaffCounts] = useState({ senior: 1, resident: 2, nurse: 3 });
    const [difficulty, setDifficulty] = useState('standard');
    const [isPrefilled, setIsPrefilled] = useState(false);
    const [isActiveTriageMode, setIsActiveTriageMode] = useState(false); 
    const [triageTarget, setTriageTarget] = useState(null); 
    const [treatmentTarget, setTreatmentTarget] = useState(null);
    const [selectedPatientId, setSelectedPatientId] = useState(null);
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [historyStack, setHistoryStack] = useState([]);
    const [isMuted, setIsMuted] = useState(false);
    const [tutorialStep, setTutorialStep] = useState(0); 
    const [toasts, setToasts] = useState([]);
    const [tickerMsgs, setTickerMsgs] = useState(["MAJOR INCIDENT DECLARED"]);

    const addTicker = (msg) => {
        setTickerMsgs(prev => [msg, ...prev].slice(0, 5));
        dispatch({ type: 'UPDATE_STATE', payload: { notifications: [msg, ...(state.notifications || [])] } });
    };

    const playAudio = (type) => { if (!isMuted) playSound(type); };
    
    const currentRole = state.roleStates.find(r => r.id === state.currentRoleId);
    const selectedPatient = state.patients.find(p => p.uniqueId === selectedPatientId);

    const highlightSenior = useMemo(() => {
        return state.patients.some(p => p.category === 'P1' && p.triaged && (!p.treated || !p.secondaryTriaged) && !['morgue', 'discharged'].includes(p.location));
    }, [state.patients]);

    const highlightRadiology = useMemo(() => {
        return state.patients.some(p => p.triaged && p.secondaryTriaged && !p.treated && !p.scanned && (p.injuryLoc === 'head' || p.injuryLoc === 'abdo'));
    }, [state.patients]);

    const addToast = (msg, type = 'info') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, msg, type }]);
        if(type === 'error') playAudio('error');
    };
    const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));

    const pushHistory = () => {
        const snapshot = JSON.stringify(state);
        setHistoryStack(prev => [...prev.slice(-9), snapshot]);
    };

    const handleUndo = () => {
        if (historyStack.length === 0) return;
        try {
            const prev = JSON.parse(historyStack[historyStack.length - 1]);
            dispatch({ type: 'UNDO', payload: prev });
            setHistoryStack(prevStack => prevStack.slice(0, -1));
            setSelectedPatientId(null);
            addToast("Action Undone", "info");
        } catch(e) { console.error("Undo error", e); }
    };

    const addHistory = (patient, msg) => ({ ...patient, history: [{ time: formatTime(state.simTime), msg }, ...(patient.history || [])] });

    const loadGame = () => {
        try {
            const savedState = localStorage.getItem('wmebem_save');
            if (savedState) {
                dispatch({ type: 'UPDATE_STATE', payload: JSON.parse(savedState) });
                addToast("Game loaded successfully", "success");
            }
        } catch (e) {
            addToast("Failed to load save", "error");
        }
    };

    const handleTriageConfirm = (category) => {
        if (!triageTarget) return;
        const isCorrect = triageTarget.category === category;
        performTriage(triageTarget, isCorrect, true);
        setTriageTarget(null);
    };

    useEffect(() => {
        if (tutorialStep === 0) return;
        if (tutorialStep === 1 && state.currentRoleId === 'nurse_ic') setTutorialStep(2);
        if (tutorialStep === 2 && selectedPatientId === 99999) setTutorialStep(3);
        if (tutorialStep === 3 && selectedPatient?.triaged) setTutorialStep(4);
        if (tutorialStep === 4 && state.currentRoleId?.startsWith('nurse_staff')) setTutorialStep(5);
        if (tutorialStep === 5 && state.difficulty === 'advanced' && treatmentTarget) setTutorialStep(6);
        if (tutorialStep === 5 && state.difficulty !== 'advanced' && selectedPatient?.treated) setTutorialStep(7);
        if (tutorialStep === 6 && selectedPatient?.treated) setTutorialStep(7);
        if (tutorialStep === 7 && state.discharged > 0) {
            setTimeout(() => {
                addToast("Tutorial Complete!", 'success');
                setTutorialStep(0);
                dispatch({ type: 'START_GAME', payload: initialGameState });
            }, 3000);
        }
    }, [state.currentRoleId, selectedPatientId, state.patients, tutorialStep, treatmentTarget, state.discharged, state.difficulty]);

    const handleRoleClick = (r) => {
        if (tutorialStep > 0) {
            if (tutorialStep === 1 && r.id !== 'nurse_ic') return;
            if (tutorialStep === 4 && !r.id.startsWith('nurse_staff')) return;
        }
        if(!r.disabled) { 
            dispatch({ type: 'UPDATE_STATE', payload: { currentRoleId: r.id } }); 
            if(window.innerWidth < 1024) setSidebarOpen(false); 
        }
    };

    const handlePatientSelect = (id) => {
        if (tutorialStep > 0 && (tutorialStep !== 2 || id !== 99999)) return;
        setSelectedPatientId(id);
    };

    const deductAp = (cost) => { 
        dispatch({ 
            type: 'UPDATE_STATE', 
            payload: { roleStates: state.roleStates.map(r => r.id === state.currentRoleId ? { ...r, currentAp: Math.max(0, r.currentAp - cost) } : r) } 
        }); 
    };

    const handleActionClick = (actionType) => {
        if(!selectedPatient || !currentRole || currentRole.disabled) return;
        
        if (tutorialStep > 0) {
            if (tutorialStep === 3 && actionType !== 'triage') return;
            if (tutorialStep === 5 && actionType !== 'treat') return;
        }

        pushHistory();
        
        if (actionType === 'triage') {
            const triageCost = state.activeEvent?.id === 'it_failure' ? 2 : 1;
            if (currentRole.currentAp < triageCost) { addToast(`Not enough AP! (${triageCost} required)`, "error"); return; }
            if (selectedPatient.location === 'amb' && state.patients.filter(p=>p.location==='triage').length >= ZONES.find(z=>z.id==='triage').capacity) {
                addToast("Triage Bay is full! Cannot offload.", 'error');
                return;
            }
            if (isActiveTriageMode && !selectedPatient.triaged) { setTriageTarget(selectedPatient); return; }
            performTriage(selectedPatient, true, false);
        } else if (actionType === 'secondary_triage') {
            if (currentRole.currentAp < 1) { addToast("Not enough AP!", "error"); return; }
            const newPatients = state.patients.map(p => p.uniqueId === selectedPatientId ? addHistory({ ...p, secondaryTriaged: true }, "Secondary Triage Performed") : p);
            dispatch({ type: 'UPDATE_STATE', payload: { patients: newPatients, score: state.score + 5 } });
            deductAp(1);
            addToast("Secondary Triage Completed", "success");
        } else if (actionType === 'scan') {
            if (currentRole.currentAp < 1) { addToast("Not enough AP!", "error"); return; }
            const newPatients = state.patients.map(p => p.uniqueId === selectedPatientId ? addHistory({ ...p, scanned: true }, "CT Scan Completed") : p);
            dispatch({ type: 'UPDATE_STATE', payload: { patients: newPatients } });
            deductAp(1);
            addToast("Scan Completed via CT", "success");
        } else if (actionType === 'treat') {
            if (currentRole.currentAp < 1) { addToast("Not enough AP!", "error"); return; }
            if (selectedPatient.reqSkill === 'advanced_trauma' && !currentRole.skills.includes('advanced_trauma')) { addToast("Requires Senior Doctor skill", "error"); return; }
            if ((selectedPatient.injuryLoc==='head'||selectedPatient.injuryLoc==='abdo') && !selectedPatient.scanned) { addToast("Patient requires CT Scan first", "warning"); return; }
            
            if (state.difficulty === 'advanced') {
                setTreatmentTarget(selectedPatient);
            } else {
                handleTreatmentConfirm({ label: selectedPatient.treatmentAction, correct: true }, selectedPatient);
            }
        }
    };

    const performTriage = (patient, isCorrect, isManual) => {
        const triageCost = state.activeEvent?.id === 'it_failure' ? 2 : 1;
        let logMsg = `Primary Triage (${currentRole.name})`;
        let scoreMod = state.score;
        let newTriageStats = { ...state.triageStats, total: state.triageStats.total + 1 };

        if (isManual) {
            if (isCorrect) {
                 scoreMod += 5; logMsg += " - Correct"; addToast("Correct Triage! (+5)", 'success');
                 newTriageStats.correct += 1;
            } else {
                 scoreMod -= 5; logMsg += ` - Incorrect`; addToast(`Incorrect! Patient is ${patient.category}`, 'error');
            }
        } else {
             newTriageStats.correct += 1;
        }
        
        let targetLocation = patient.location;
        if (patient.location === 'amb') {
            targetLocation = 'triage';
            playAudio('move');
        }

        const newPatients = state.patients.map(p => p.uniqueId === patient.uniqueId ? addHistory({ ...p, triaged: true, secondaryTriaged: state.difficulty === 'novice', location: targetLocation }, logMsg) : p);
        deductAp(triageCost);
        dispatch({ type: 'UPDATE_STATE', payload: { patients: newPatients, score: scoreMod, triageStats: newTriageStats } });
    };

    const handleTreatmentConfirm = (treatment, directTarget = null) => {
        const targetPatient = directTarget || treatmentTarget;
        if (!targetPatient) return;
        
        if (tutorialStep > 0 && (tutorialStep === 6 && !treatment.correct)) {
            addToast("Select the correct treatment for the tutorial.", "warning");
            return;
        }

        let targetZoneId = targetPatient.category === 'P1' ? 'resus' : (targetPatient.category === 'P2' ? 'majors' : 'minors');
        if (targetPatient.location !== targetZoneId) {
            const zoneCap = ZONES.find(z => z.id === targetZoneId).capacity;
            const currentInZone = state.patients.filter(p => p.location === targetZoneId).length;
            if (currentInZone >= zoneCap) {
                addToast(`Cannot treat: ${ZONES.find(z => z.id === targetZoneId).name} is full!`, 'error');
                if(!directTarget) setTreatmentTarget(null);
                return;
            }
        } else {
            targetZoneId = targetPatient.location; 
        }

        let newBlood = state.resources.blood;
        if (targetPatient.category === 'P1') {
            if (newBlood < 1) { addToast("Insufficient Blood Supply", "error"); if(!directTarget) setTreatmentTarget(null); return; }
            newBlood--;
        }

        if (treatment.correct) {
            const newPatients = state.patients.map(p => p.uniqueId === targetPatient.uniqueId ? addHistory({ ...p, treated: true, deteriorating: false, location: targetZoneId }, treatment.label) : p);
            dispatch({ type: 'UPDATE_STATE', payload: { patients: newPatients, resources: { ...state.resources, blood: newBlood }, score: state.score + 10 } });
            playAudio('treat');
            addToast("Correct Treatment Administered", "success");
        } else {
            const newVitals = { ...targetPatient.vitals, hr: targetPatient.vitals.hr + 30, sbp: targetPatient.vitals.sbp - 20 };
            const newPatients = state.patients.map(p => p.uniqueId === targetPatient.uniqueId ? addHistory({ ...p, vitals: newVitals, deteriorating: true, location: targetZoneId }, `Incorrect Rx: ${treatment.label}`) : p);
            dispatch({ type: 'UPDATE_STATE', payload: { patients: newPatients, resources: { ...state.resources, blood: newBlood }, score: state.score - 10 } });
            addToast("Incorrect Treatment! Patient Deteriorating.", "error");
        }
        
        deductAp(1);
        if(!directTarget) setTreatmentTarget(null);
    };

    const handleAbility = () => {
        if(!currentRole || currentRole.disabled || currentRole.currentAp < (currentRole.abilityCost === 'ALL' ? 1 : currentRole.abilityCost) || currentRole.cooldown > 0) return;
        pushHistory();

        if (currentRole.ability === 'Clear Block') {
            deductAp(currentRole.abilityCost);
            dispatch({ type: 'UPDATE_STATE', payload: { blockState: { icu: false, ward: false }, roleStates: state.roleStates.map(r => r.id === state.currentRoleId ? { ...r, cooldown: currentRole.maxCooldown } : r) } });
            addToast("Hospital Flow Block Cleared", "success");
            return;
        }
        
        if (currentRole.ability === 'Rapid Offload') {
            const ambPatients = state.patients.filter(p => p.location === 'amb');
            if (ambPatients.length === 0) { addToast("Ambulance Bay Empty", "info"); return; }
            const triageZone = ZONES.find(z => z.id === 'triage');
            const spaces = triageZone.capacity - state.patients.filter(p => p.location === 'triage').length;
            if (spaces <= 0) { addToast("Triage Bay Full!", "error"); return; }
            
            const toMove = ambPatients.slice(0, spaces);
            const newPatients = state.patients.map(p => toMove.find(tm => tm.uniqueId === p.uniqueId) ? addHistory({ ...p, location: 'triage', triaged: true, secondaryTriaged: state.difficulty === 'novice' }, "Rapid MITT Assessment") : p);
            deductAp(currentRole.currentAp);
            dispatch({ type: 'UPDATE_STATE', payload: { patients: newPatients, roleStates: state.roleStates.map(r => r.id === state.currentRoleId ? { ...r, cooldown: currentRole.maxCooldown } : r) } });
            playAudio('move');
            addToast(`Rapidly Offloaded ${toMove.length} patients`, "success");
            return;
        }
        
        if(currentRole.id.startsWith('senior_doc')) { 
            deductAp(currentRole.abilityCost);
            dispatch({ type: 'UPDATE_STATE', payload: { patients: state.patients.map(p => p.location === 'amb' ? addHistory({...p, triaged: true, secondaryTriaged: true, location: 'triage'}, `Rapid Triage & Secondary Check`) : p), roleStates: state.roleStates.map(r => r.id === state.currentRoleId ? { ...r, cooldown: currentRole.maxCooldown } : r) } }); 
            addToast("Rapid Triage Complete", "info"); 
        }
        else if(currentRole.id.startsWith('nurse_staff')) {
            if(!selectedPatientId) { addToast("Select a Patient first", "warning"); return; }
            deductAp(currentRole.abilityCost);
            dispatch({ type: 'UPDATE_STATE', payload: { patients: state.patients.map(p => p.uniqueId === selectedPatientId ? addHistory({ ...p, deteriorating: false, turnsWaiting: 0 }, "Stabilised by Nurse") : p), roleStates: state.roleStates.map(r => r.id === state.currentRoleId ? { ...r, cooldown: currentRole.maxCooldown } : r) } });
            playAudio('treat'); addToast(`Patient Stabilised`, "success");
        }
        else if(currentRole.id.startsWith('resident')) {
            const p3 = state.patients.find(p => p.category === 'P3' && !p.treated && p.location === 'minors');
            if(p3) { 
                deductAp(currentRole.abilityCost);
                dispatch({ type: 'UPDATE_STATE', payload: { patients: state.patients.map(p => p.uniqueId === p3.uniqueId ? addHistory({ ...p, treated: true }, "Fast Track Treatment") : p), roleStates: state.roleStates.map(r => r.id === state.currentRoleId ? { ...r, cooldown: currentRole.maxCooldown } : r) } }); 
                playAudio('treat'); addToast("Fast Track Treatment Complete", "success"); 
            } else { addToast("No P3 patients in Minors", "info"); }
        }
        else if(currentRole.id === 'radiology') {
            const target = state.patients.find(p => (p.location === 'resus' || p.location === 'majors') && !p.treated && !p.scanned && (p.injuryLoc === 'head' || p.injuryLoc === 'abdo'));
            if(target) { 
                deductAp(currentRole.abilityCost);
                dispatch({ type: 'UPDATE_STATE', payload: { patients: state.patients.map(p => p.uniqueId === target.uniqueId ? addHistory({ ...p, scanned: true }, "Rapid Scan Transfer") : p), roleStates: state.roleStates.map(r => r.id === state.currentRoleId ? { ...r, cooldown: currentRole.maxCooldown } : r) } }); 
                addToast("Patient Rapidly Scanned", "info"); 
            } else { addToast("No suitable patients need scanning", "info"); }
        }
        else if(currentRole.id === 'anaesthetic_spr') {
            const target = state.patients.find(p => p.category === 'P1' && !p.treated && (p.injuryLoc === 'head' || p.injuryLoc === 'chest'));
            if(target) {
                deductAp(currentRole.abilityCost);
                dispatch({ type: 'UPDATE_STATE', payload: { patients: state.patients.map(p => p.uniqueId === target.uniqueId ? addHistory({ ...p, treated: true, deteriorating: false, location: 'resus' }, "Advanced Airway Managed") : p), roleStates: state.roleStates.map(r => r.id === state.currentRoleId ? { ...r, cooldown: currentRole.maxCooldown } : r) } });
                playAudio('treat'); addToast("Advanced Airway Secured", "success");
            } else { addToast("No suitable P1 airway risks", "info"); }
        }
    };

    const handleDrop = (e, zoneId) => {
        if (e && e.preventDefault) e.preventDefault();
        
        if (tutorialStep > 0 && tutorialStep !== 7) return;

        const pid = e && e.dataTransfer ? Number(e.dataTransfer.getData("patientId")) : selectedPatientId;
        const p = state.patients.find(pt => pt.uniqueId === pid);
        if (state.activeEvent?.id === 'ct_overheat' && zoneId === 'ct') { addToast("CT Scanner is broken!", "error"); return; }
        if (state.blockState[zoneId]) { addToast(`${ZONES.find(z=>z.id===zoneId).name} is blocked! Use Bed Manager.`, "error"); return; }

        if(p && currentRole && currentRole.currentAp > 0 && !currentRole.disabled && p.location !== zoneId) {
            pushHistory();
            const zoneName = ZONES.find(z => z.id === zoneId)?.name || zoneId;
            let newDischarged = state.discharged;
            let newScore = state.score;
            let newDeaths = state.deaths;
            let newDeathDetails = [...state.deathDetails];

            if (zoneId === 'discharged') {
                newDischarged++;
                if (p.treated) { newScore += 20; addToast("Patient Discharged safely", "success"); } 
                else { newScore -= 20; addToast("Unsafe Discharge (-20 Score)", "error"); }
            } else if (zoneId === 'morgue') {
                if (p.category !== 'dead' && !p.history.some(h=>h.msg.includes('DIED'))) {
                     newDeaths++; newScore -= 50; addToast("Patient moved to Morgue prematurely!", "error");
                     newDeathDetails.push({ patientName: p.name, turn: state.turn, reason: 'Premature transfer to mortuary without physiological cause.' });
                }
            }

            const newPatients = state.patients.map(pt => pt.uniqueId === pid ? addHistory({ ...pt, location: zoneId }, `Moved to ${zoneName}`) : pt);
            dispatch({ type: 'UPDATE_STATE', payload: { patients: newPatients, discharged: newDischarged, score: newScore, deaths: newDeaths, deathDetails: newDeathDetails } });
            deductAp(1); setSelectedPatientId(pid); playAudio('move');
        } else if (currentRole && currentRole.currentAp <= 0) {
             addToast("No Action Points remaining!", "error");
        }
    };
    
    const handleZoneClick = (zoneId) => { if (selectedPatientId) handleDrop(null, zoneId); };

    const handleMethaneDeploy = (bonusChoice) => {
        initAudio();
        const generatedRoles = generateRoster(staffCounts, bonusChoice);
        let activeRoles = generatedRoles;
        let futureRoles = [];

        if (state.difficulty === 'advanced') {
            activeRoles = generatedRoles.slice(0, 3); 
            futureRoles = generatedRoles.slice(3);
        }

        const initialTime = 12 * 60;
        const incidentPatients = [];
        const scenarioConfig = SCENARIOS[state.selectedScenario];
        for(let i=0; i<6; i++) {
            const r = Math.random();
            let cat = 'P3';
            if (r < scenarioConfig.p1) cat = 'P1';
            else if (r < scenarioConfig.p1 + scenarioConfig.p2) cat = 'P2';
            let pool = PATIENT_TEMPLATES.standard;
            if (scenarioConfig.type === 'chem' && Math.random() > 0.3) pool = PATIENT_TEMPLATES.chem;
            if (scenarioConfig.type === 'crush' && Math.random() > 0.3) pool = PATIENT_TEMPLATES.crush;
            if (scenarioConfig.type === 'paediatric' && Math.random() > 0.3) pool = PATIENT_TEMPLATES.paediatric;
            
            let options = pool.filter(p => p.category === cat);
            if (options.length === 0) options = pool;
            const base = options[Math.floor(Math.random() * options.length)];
            incidentPatients.push(createPatient(base, formatTime(initialTime), { category: cat }));
        }
        const finalPatients = isPrefilled ? [...generatePrefillPatients(formatTime(initialTime)), ...incidentPatients] : incidentPatients;
        const initialBlood = bonusChoice === 'blood' ? 30 : 20;

        dispatch({ 
            type: 'START_GAME', 
            payload: { 
                roleStates: activeRoles, 
                futureRoster: futureRoles,
                currentRoleId: activeRoles[0].id, 
                patients: finalPatients,
                resources: { blood: initialBlood, vents: 8 },
                difficulty: state.difficulty,
                gameState: 'playing'
            } 
        });
        localStorage.removeItem('wmebem_save');
        addTicker("MAJOR INCIDENT DECLARED");
        if (state.difficulty === 'advanced') {
            addTicker("OPERATING ON SKELETON STAFF. RECALL INITIATED.");
        }
    };

    const createPatient = (template, timeStr, overrideProps = {}) => {
        const isMale = Math.random() > 0.5;
        const gender = isMale ? 'M' : 'F';
        const name = `${(isMale ? MALE : FEMALE)[Math.floor(Math.random() * 4)]} ${NAMES[Math.floor(Math.random() * NAMES.length)]}`;
        
        let mobility = 'stretcher';
        if (template.category === 'P3') mobility = 'walking';
        if (overrideProps.category === 'P3') mobility = 'walking';
        
        return { 
            ...template, 
            name, 
            age: state.selectedScenario === 'paediatric' && Math.random() > 0.3 ? Math.floor(Math.random()*12)+2+'y' : Math.floor(Math.random()*60)+18+'y', 
            gender, 
            uniqueId: overrideProps.id || Date.now() + Math.random(), 
            location: 'amb', 
            triaged: false, 
            secondaryTriaged: false,
            treated: false, 
            scanned: false, 
            deteriorating: false,
            mobility, 
            history: [{ time: timeStr, msg: 'Arrived via Ambulance' }], 
            ...overrideProps 
        };
    };

    const spawnPatients = (count, currentSimTime) => {
        const scenarioConfig = SCENARIOS[state.selectedScenario];
        const newP = Array(count).fill(0).map(() => {
            const r = Math.random();
            let cat = 'P3';
            if (r < scenarioConfig.p1) cat = 'P1';
            else if (r < scenarioConfig.p1 + scenarioConfig.p2) cat = 'P2';

            let pool = PATIENT_TEMPLATES.standard;
            if (scenarioConfig.type === 'chem' && Math.random() > 0.3) pool = PATIENT_TEMPLATES.chem;
            if (scenarioConfig.type === 'crush' && Math.random() > 0.3) pool = PATIENT_TEMPLATES.crush;
            if (scenarioConfig.type === 'paediatric' && Math.random() > 0.3) pool = PATIENT_TEMPLATES.paediatric;
            
            let options = pool.filter(p => p.category === cat);
            if (options.length === 0) options = pool; 
            const base = options[Math.floor(Math.random() * options.length)];
            return createPatient(base, formatTime(currentSimTime), { category: cat });
        });
        dispatch({ type: 'UPDATE_STATE', payload: { patients: [...state.patients, ...newP] } });
        playAudio('ping');
    };

    const generatePrefillPatients = (timeStr) => {
        const prefill = [];
        const add = (zone, count, treated) => {
            for(let i=0; i<count; i++) {
                const base = PATIENT_TEMPLATES.standard[Math.floor(Math.random() * PATIENT_TEMPLATES.standard.length)];
                prefill.push(createPatient(base, timeStr, { location: zone, triaged: true, secondaryTriaged: true, treated: treated, history: [{ time: "08:00", msg: "Handover: Patient in department" }] }));
            }
        };
        add('resus', 1, false); add('majors', 4, false); add('minors', 5, true); add('ward', 15, true); add('icu', 3, true);
        return prefill;
    };

    const deterioratePatients = (patientList) => {
        let deterioratedCount = 0;
        const newList = patientList.map(p => {
            if (p.treated || p.category === 'P3' || ['discharged','morgue'].includes(p.location)) return p;
            
            const profile = p.deteriorationProfile || 'moderate';
            let threshold = 0.7;
            if (profile === 'rapid') threshold = 0.4;
            if (profile === 'stable') threshold = 0.9;

            if (Math.random() > threshold) {
                deterioratedCount++;
                const newVitals = { ...p.vitals };
                newVitals.hr += Math.floor(Math.random() * 15) + 5;
                newVitals.sbp -= Math.floor(Math.random() * 10) + 5;
                return { 
                    ...p, 
                    vitals: newVitals, 
                    deteriorating: true,
                    location: (newVitals.hr > 180 || newVitals.sbp < 50) ? 'morgue' : p.location
                };
            }
            return p;
        });
        if(deterioratedCount > 0) addTicker(`${deterioratedCount} PATIENTS DETERIORATING - CHECK VITALS!`);
        return newList;
    };

    const startTutorial = () => {
        initAudio();
        const generatedRoles = generateRoster({ senior: 0, resident: 0, nurse: 1 });
        const tutPatient = createPatient(PATIENT_TEMPLATES.standard[4], "12:00", { id: 99999, category: 'P3' });
        
        dispatch({ 
            type: 'START_GAME', 
            payload: { 
                roleStates: generatedRoles.map(r => ({...r, currentAp: 4})), 
                currentRoleId: null, 
                patients: [tutPatient],
                activeEvent: null,
                phase: 'active',
                difficulty: 'advanced',
                gameState: 'playing'
            } 
        });
        setIsActiveTriageMode(false);
        setTutorialStep(1);
        localStorage.removeItem('wmebem_save');
        addToast("Tutorial Started", "info");
    };

    const checkGameOver = (currentPatients, currentDeaths) => {
        if (currentDeaths > 0) return "A priority one patient died due to delayed treatment.";
        if (currentPatients.filter(p => p.location === 'amb').length > 12) return "Ambulance Bay Overflow. The department has collapsed.";
        if (currentPatients.some(p => p.location === 'morgue' && !p.history.some(h => h.msg.includes("DIED")))) return "Patient died from physiological deterioration.";
        return null;
    };

    const triggerEvent = (currentRoles) => {
        if (state.difficulty === 'novice') return { event: null, roles: currentRoles, blocks: { icu: false, ward: false } };

        if (Math.random() > 0.7) {
            const event = RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)];
            
            if (event.id === 'parental_presence' && state.selectedScenario !== 'paediatric') return { event: null, roles: currentRoles, blocks: { icu: false, ward: false } };

            playAudio('alert');
            addTicker(`ALERT: ${event.title.toUpperCase()}`);
            
            let newBlocks = { ...state.blockState };
            if (event.id === 'exit_block_icu') newBlocks.icu = true;
            if (event.id === 'exit_block_ward') newBlocks.ward = true;

            if (event.id === 'needlestick') { 
                const nurses = currentRoles.filter(r => r.id.startsWith('nurse_staff')); 
                if (nurses.length > 0) { 
                    const target = nurses[Math.floor(Math.random() * nurses.length)]; 
                    return { event, roles: currentRoles.map(r => r.id === target.id ? { ...r, disabled: true, currentAp: 0 } : r), blocks: newBlocks }; 
                } 
            } 
            else if (event.id === 'rapid_offload' && state.phase === 'active') { spawnPatients(3, state.simTime); }
            else if (event.id === 'med_student') { return { event, roles: currentRoles.map(r => r.id.startsWith('senior_doc') ? { ...r, currentAp: r.currentAp + 2 } : r), blocks: newBlocks }; }
            else if (event.id === 'parental_presence') {
                return { event, roles: currentRoles.map(r => r.id === 'bronze_cmd' ? { ...r, currentAp: Math.max(0, r.currentAp - 2) } : r), blocks: newBlocks };
            }
            
            return { event, roles: currentRoles, blocks: newBlocks };
        } 
        return { event: null, roles: currentRoles, blocks: { icu: false, ward: false } };
    };

    const nextTurn = () => {
        pushHistory();

        const isStandDown = state.turn >= MAX_TURNS;
        const newPhase = isStandDown ? 'stand_down' : 'active';
        
        let nextPatients = deterioratePatients(state.patients);
        
        const failure = checkGameOver(nextPatients, state.deaths);
        if (failure) { dispatch({ type: 'END_GAME', payload: { type: 'lose', reason: failure } }); return; }
        
        const activePatients = nextPatients.filter(p => !['discharged','morgue'].includes(p.location));
        if (newPhase === 'stand_down') {
            if (activePatients.length === 0) {
                dispatch({ type: 'END_GAME', payload: { type: 'win', reason: `Department successfully cleared during Stand Down.` } });
                return;
            }
            if (state.turn >= MAX_TURNS + 6) {
                dispatch({ type: 'END_GAME', payload: { type: 'abandoned', reason: `Failed to clear the department within the Stand Down timeframe.` } });
                return;
            }
            if (state.turn === MAX_TURNS) addTicker("MAJOR INCIDENT STOOD DOWN - CLEAR THE DEPARTMENT");
        }
        
        const newTime = state.simTime + 15; 
        
        let newRoles = state.roleStates.map(r => {
            let usedAp = r.ap - r.currentAp;
            let consec = usedAp > 0 ? (r.consecutiveActionTurns || 0) + 1 : 0;
            let penalty = consec >= 3 ? 1 : 0;
            return { ...r, currentAp: Math.max(0, r.ap - penalty), disabled: false, cooldown: Math.max(0, r.cooldown - 1), consecutiveActionTurns: consec };
        });

        let newFutureRoster = [...(state.futureRoster || [])];
        if (state.turn === 3 && newFutureRoster.length > 0) {
            newRoles = [...newRoles, ...newFutureRoster.map(r => ({...r, currentAp: r.ap}))];
            newFutureRoster = [];
            addToast("Rostered staff have arrived on scene!", "info");
            addTicker("RESERVE STAFF ARRIVED ON SCENE");
        }

        const eventResult = triggerEvent(newRoles);
        
        if (newPhase === 'active') {
            const scenarioConfig = SCENARIOS[state.selectedScenario];
            const newP = Array(Math.floor(Math.random() * 3) + 1).fill(0).map(() => {
                const r = Math.random();
                let cat = 'P3';
                if (r < scenarioConfig.p1) cat = 'P1';
                else if (r < scenarioConfig.p1 + scenarioConfig.p2) cat = 'P2';
                let pool = PATIENT_TEMPLATES.standard;
                if (scenarioConfig.type === 'chem' && Math.random() > 0.3) pool = PATIENT_TEMPLATES.chem;
                if (scenarioConfig.type === 'crush' && Math.random() > 0.3) pool = PATIENT_TEMPLATES.crush;
                if (scenarioConfig.type === 'paediatric' && Math.random() > 0.3) pool = PATIENT_TEMPLATES.paediatric;
                let options = pool.filter(p => p.category === cat);
                if (options.length === 0) options = pool; 
                const base = options[Math.floor(Math.random() * options.length)];
                return createPatient(base, formatTime(newTime), { category: cat });
            });
            nextPatients = [...nextPatients, ...newP];
            playAudio('ping');
        }

        let newDeaths = state.deaths;
        let newDeathDetails = [...state.deathDetails];
        let deathReason = null;
        
        const finalPatients = nextPatients.map(p => {
            if(p.category === 'P1' && !p.treated && !['morgue','discharged'].includes(p.location)) {
                const turnsWaiting = (p.turnsWaiting || 0) + 1;
                if(turnsWaiting > 2) { 
                    playAudio('flatline'); 
                    newDeaths++; 
                    deathReason = "A priority one patient died due to delayed treatment.";
                    newDeathDetails.push({ patientName: p.name, turn: state.turn + 1, reason: `Treatment delayed for ${turnsWaiting} turns.` });
                    return addHistory({ ...p, location: 'morgue' }, "DIED: Treatment delay"); 
                }
                return { ...p, turnsWaiting };
            }
            if (p.location === 'morgue' && !p.history.some(h => h.msg.includes('DIED'))) {
                newDeaths++; 
                deathReason = "Patient died from physiological deterioration.";
                newDeathDetails.push({ patientName: p.name, turn: state.turn + 1, reason: `Physiological decompensation.` });
                return addHistory({ ...p, location: 'morgue' }, "DIED: Physiology collapsed"); 
            }
            return p;
        });

        if (deathReason) {
            dispatch({ type: 'END_GAME', payload: { type: 'lose', reason: deathReason } });
            dispatch({ type: 'UPDATE_STATE', payload: { deathDetails: newDeathDetails, deaths: newDeaths } });
            return;
        }

        dispatch({ 
            type: 'UPDATE_STATE', 
            payload: { 
                turn: state.turn + 1, 
                simTime: newTime, 
                roleStates: eventResult.roles, 
                futureRoster: newFutureRoster,
                activeEvent: eventResult.event, 
                blockState: eventResult.blocks,
                patients: finalPatients,
                deaths: newDeaths,
                deathDetails: newDeathDetails,
                phase: newPhase
            } 
        });
    };

    if (state.gameState === 'start') {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center border-t-8 border-blue-800">
                    <img src={LOGO_URL} className="h-24 mx-auto mb-6 object-contain" />
                    <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">INCIDENT<span className="text-blue-600">COMMAND</span></h1>
                    <p className="text-slate-500 mb-6 font-medium">WMEBEM Digital Simulation</p>
                    <div className="mb-6 space-y-4 text-left">
                        {localStorage.getItem('wmebem_save') && <button type="button" onClick={loadGame} className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold mb-4 cursor-pointer">Resume Simulation</button>}
                        
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide text-center">Difficulty Tier</label>
                            <div className="grid grid-cols-3 gap-2">
                                <button type="button" onClick={() => setDifficulty('novice')} className={`p-2 rounded border text-xs font-bold cursor-pointer ${difficulty === 'novice' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>Novice</button>
                                <button type="button" onClick={() => setDifficulty('standard')} className={`p-2 rounded border text-xs font-bold cursor-pointer ${difficulty === 'standard' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>Standard</button>
                                <button type="button" onClick={() => setDifficulty('advanced')} className={`p-2 rounded border text-xs font-bold cursor-pointer ${difficulty === 'advanced' ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>Advanced</button>
                            </div>
                            <p className="text-[10px] text-gray-500 mt-2 text-center italic h-8">
                                {difficulty === 'novice' && 'Basic gameplay. Generic treatment actions. No random events.'}
                                {difficulty === 'standard' && 'Introduces random events and hospital exit blocks.'}
                                {difficulty === 'advanced' && 'Adds METHANE pre-deployment and specific targeted clinical interventions.'}
                            </p>
                        </div>

                        <div className="border-t pt-4">
                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide text-center">Scenario Selection</label>
                            <div className="grid grid-cols-2 gap-2">
                                {Object.entries(SCENARIOS).map(([key, val]) => (
                                    <button type="button" key={key} onClick={() => dispatch({ type: 'UPDATE_STATE', payload: { selectedScenario: key } })} className={`p-2 rounded border text-xs font-bold cursor-pointer ${state.selectedScenario === key ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>{val.name}</button>
                                ))}
                            </div>
                        </div>

                        <div className="border-t pt-4 space-y-2">
                            <Counter label="Senior Docs" value={staffCounts.senior} onChange={(v)=>setStaffCounts({...staffCounts, senior: v})} min={1} max={3} />
                            <Counter label="Residents" value={staffCounts.resident} onChange={(v)=>setStaffCounts({...staffCounts, resident: v})} min={1} max={6} />
                            <Counter label="Nurses" value={staffCounts.nurse} onChange={(v)=>setStaffCounts({...staffCounts, nurse: v})} min={1} max={8} />
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <button type="button" onClick={() => {
                            if (difficulty === 'advanced') {
                                dispatch({ type: 'UPDATE_STATE', payload: { gameState: 'methane', difficulty } });
                            } else {
                                dispatch({ type: 'UPDATE_STATE', payload: { difficulty } });
                                const generatedRoles = generateRoster(staffCounts);
                                const initialTime = 12 * 60;
                                const incidentPatients = [];
                                const scenarioConfig = SCENARIOS[state.selectedScenario];
                                for(let i=0; i<6; i++) {
                                    const r = Math.random();
                                    let cat = 'P3';
                                    if (r < scenarioConfig.p1) cat = 'P1';
                                    else if (r < scenarioConfig.p1 + scenarioConfig.p2) cat = 'P2';
                                    let pool = PATIENT_TEMPLATES.standard;
                                    if (scenarioConfig.type === 'chem' && Math.random() > 0.3) pool = PATIENT_TEMPLATES.chem;
                                    if (scenarioConfig.type === 'crush' && Math.random() > 0.3) pool = PATIENT_TEMPLATES.crush;
                                    if (scenarioConfig.type === 'paediatric' && Math.random() > 0.3) pool = PATIENT_TEMPLATES.paediatric;
                                    let options = pool.filter(p => p.category === cat);
                                    if (options.length === 0) options = pool;
                                    const base = options[Math.floor(Math.random() * options.length)];
                                    incidentPatients.push(createPatient(base, formatTime(initialTime), { category: cat }));
                                }
                                dispatch({ 
                                    type: 'START_GAME', 
                                    payload: { 
                                        roleStates: generatedRoles, 
                                        currentRoleId: generatedRoles[0].id, 
                                        patients: incidentPatients,
                                        resources: { blood: 20, vents: 8 },
                                        difficulty,
                                        gameState: 'playing'
                                    } 
                                });
                                localStorage.removeItem('wmebem_save');
                            }
                        }} className="w-full py-4 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform active:scale-95 cursor-pointer">Initialise New Incident</button>
                        <button type="button" onClick={startTutorial} className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-md shadow transition-all cursor-pointer">Launch Training Protocol</button>
                    </div>
                </div>
            </div>
        );
    }

    if (state.gameState === 'methane') {
        return <MethaneBrief scenario={SCENARIOS[state.selectedScenario]} onDeploy={handleMethaneDeploy} />;
    }

    if (state.gameState === 'gameover') return <GameOver reason={state.modalContent} stats={{score: state.score, discharged: state.discharged, deaths: state.deaths, triageTotal: state.triageStats.total, triageCorrect: state.triageStats.correct}} onRestart={() => dispatch({ type: 'UPDATE_STATE', payload: initialGameState })} gameOverType={state.gameOverType} MAX_TURNS={MAX_TURNS} deathDetails={state.deathDetails} patients={state.patients} />;

    return (
        <>
            {tutorialStep > 0 && <div className="fixed inset-0 bg-slate-900/40 z-50 pointer-events-auto"></div>}
            
            <div className="h-screen flex flex-col bg-slate-100 text-slate-800 font-sans overflow-hidden">
                <ToastContainer toasts={toasts} removeToast={removeToast} />
                
                {tutorialStep > 0 && (
                    <TutorialOverlay step={tutorialStep}>
                        {tutorialStep === 1 && "Welcome Commander. Let's process a casualty. Select the Nurse In Charge from the staff list."}
                        {tutorialStep === 2 && "Select the waiting patient in the Ambulance Bay."}
                        {tutorialStep === 3 && "Tap the Primary Triage button to assess them and move them into the department."}
                        {tutorialStep === 4 && "They are Priority 3. They need minor treatment. Select an ED Nurse from the staff list."}
                        {tutorialStep === 5 && "Tap Administer Treatment. The system will automatically find them a bed in Minors."}
                        {tutorialStep === 6 && "Select the correct intervention. A deep laceration requires Suture & Dress."}
                        {tutorialStep === 7 && "The patient is stable. Drag them to the Discharge zone (or tap the patient then tap the Discharge zone)."}
                    </TutorialOverlay>
                )}

                <div className={`h-14 ${state.phase === 'stand_down' ? 'bg-amber-400' : 'bg-white'} border-b px-4 flex items-center justify-between shrink-0 z-20 relative shadow-sm transition-colors`}>
                    <div className="flex items-center gap-3">
                        <img src={LOGO_URL} className="logo-h" />
                        <div className="flex flex-col">
                            <span className="font-bold text-sm hidden sm:inline">Turn {state.turn} {state.phase === 'stand_down' ? '(STAND DOWN)' : `/ ${MAX_TURNS}`} ({formatTime(state.simTime)})</span>
                            <TimelineBar currentTurn={state.turn} maxTurns={MAX_TURNS} />
                        </div>
                    </div>
                    
                    <div className="flex-1 mx-4 hidden md:block max-w-xl">
                        <NewsTicker messages={tickerMsgs} onClick={() => dispatch({ type: 'UPDATE_STATE', payload: { modalContent: 'log' } })} />
                    </div>

                    <div className="flex items-center gap-4 font-bold text-sm">
                            <div className="flex gap-2 items-center">
                                <button type="button" onClick={() => setIsMuted(!isMuted)} className="text-slate-500 hover:text-slate-800 p-1 cursor-pointer">{isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}</button>
                                <button type="button" onClick={() => dispatch({ type: 'UPDATE_STATE', payload: { modalContent: 'guide' } })} className="hidden lg:flex text-xs font-bold text-blue-600 hover:text-blue-800 items-center gap-1 px-3 py-1 rounded hover:bg-blue-50 transition-colors cursor-pointer"><BookOpen size={16} /> Guide</button>
                            </div>
                        <div className="flex flex-col items-center leading-none mx-2"><span className="text-[10px] text-slate-500 uppercase">Score</span><span className="font-bold text-lg text-emerald-700">{state.score}</span></div>
                        <button type="button" onClick={nextTurn} disabled={tutorialStep > 0} className="bg-slate-900 text-white px-6 py-2 rounded shadow hover:bg-slate-800 font-bold cursor-pointer transition-all disabled:opacity-50">Next Turn</button>
                    </div>
                </div>
                <div className="flex flex-1 overflow-hidden relative">
                    <div className={`absolute inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 transition duration-200 ease-in-out w-64 bg-white border-r flex flex-col shrink-0 z-30 shadow-2xl lg:shadow-none`}>
                        <div className="p-4 border-b bg-slate-50 grid grid-cols-2 gap-2 text-center text-xs font-bold relative z-10">
                            <div className="bg-white border rounded p-2 shadow-sm">
                                <Droplet size={16} className="mx-auto text-red-500 mb-1"/>
                                <div className="text-lg font-black">{state.resources.blood}</div>
                                <div className="text-[10px] text-slate-400 uppercase">Blood</div>
                            </div>
                            <div className="bg-white border rounded p-2 shadow-sm">
                                <Wind size={16} className="mx-auto text-blue-500 mb-1"/>
                                <div className="text-lg font-black">{state.resources.vents}</div>
                                <div className="text-[10px] text-slate-400 uppercase">Vents</div>
                            </div>
                        </div>
                        
                        <div className="p-3 border-b font-bold text-xs text-slate-400 uppercase tracking-widest flex justify-between items-center relative z-10 bg-white">
                            <span>Staff Rostering</span>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2 space-y-1 relative z-10">
                            {state.roleStates.map(r => { 
                                const RoleIcon = r.icon; 
                                const isSelected = state.currentRoleId === r.id;
                                const isTutorialTarget = (tutorialStep === 1 && r.id === 'nurse_ic') || (tutorialStep === 4 && r.id.startsWith('nurse_staff'));
                                
                                const isSeniorTarget = highlightSenior && r.id.startsWith('senior_doc') && r.currentAp > 0;
                                const isRadiologyTarget = highlightRadiology && r.id === 'radiology' && r.currentAp > 0;
                                const fatiguePenalty = r.consecutiveActionTurns >= 2;

                                return ( 
                                    <div 
                                        key={r.id} 
                                        onClick={() => handleRoleClick(r)} 
                                        className={`w-full text-left px-3 py-2 rounded border-l-4 transition-all mb-1 group cursor-pointer relative
                                            ${isSelected ? getActiveStyle(r.theme) + ' shadow-md' : getColorStyle(r.theme) + ' bg-white border-transparent'} 
                                            ${r.disabled ? 'opacity-50 bg-slate-100 cursor-not-allowed' : ''} 
                                            ${isTutorialTarget ? 'tutorial-highlight tutorial-pointer-right' : ''}
                                            ${isSeniorTarget ? 'pulse-border-red' : ''}
                                            ${isRadiologyTarget ? 'pulse-border-purple' : ''}
                                        `}
                                    >
                                        <div className="flex justify-between items-center relative z-10">
                                            <div className="flex items-center gap-2">
                                                <div className={`p-1 rounded ${isSelected ? 'bg-white/20' : 'bg-gray-100 group-hover:bg-white'}`}><RoleIcon size={16} strokeWidth={2.5} /></div>
                                                <div>
                                                    <span className="font-bold text-sm block">{r.name}</span>
                                                    <span className={`text-[10px] ${fatiguePenalty ? 'text-red-400 font-bold' : 'opacity-75'}`}>{r.disabled ? 'UNAVAILABLE' : (fatiguePenalty ? 'FATIGUED' : r.actionText)}</span>
                                                </div>
                                            </div>
                                            <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${r.currentAp === 0 ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}>
                                                {r.currentAp} AP
                                            </span>
                                        </div>
                                        
                                        {isSelected && !r.disabled && (
                                            <div className="mt-3 pt-2 border-t border-white/20 text-[10px] space-y-2 animate-fadeIn relative z-10">
                                                <div>
                                                    <span className="uppercase tracking-wider opacity-60 font-bold block mb-1">Ability: {r.ability}</span>
                                                    <div className="bg-black/20 p-1.5 rounded italic leading-tight mb-2">
                                                        {r.abilityEffect}
                                                    </div>
                                                        <button 
                                                        onClick={(e) => { e.stopPropagation(); handleAbility(); }}
                                                        disabled={r.currentAp < (r.abilityCost === 'ALL' ? 1 : r.abilityCost) || r.cooldown > 0 || tutorialStep > 0}
                                                        className={`w-full py-2 bg-slate-700 hover:bg-slate-600 text-white rounded border border-slate-500 font-bold text-xs flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed`}
                                                        >
                                                        <ShieldAlert size={12} /> Use Ability {r.cooldown > 0 && `(Wait ${r.cooldown})`}
                                                        </button>
                                                </div>
                                            </div>
                                        )}
                                    </div> 
                                )
                            })}
                        </div>
                    </div>
                    
                    <div className="flex-1 bg-slate-200 p-3 overflow-x-auto relative flex flex-col" onClick={() => { if(tutorialStep === 0) setSelectedPatientId(null); }}>
                        <button type="button" onClick={()=>setSidebarOpen(true)} className="lg:hidden absolute top-3 left-3 z-20 bg-white p-2 rounded shadow cursor-pointer"><Menu size={20}/></button>
                        
                        <div className="flex gap-4 h-full min-w-[1024px] pb-24 lg:pb-0">
                            <div className="w-64 flex flex-col gap-2 shrink-0">
                                <div className="text-[10px] font-black text-red-400 uppercase tracking-widest text-center flex items-center justify-center gap-2"><Siren size={12}/> Intake</div>
                                <ZoneDisplay zone={ZONES[0]} patients={state.patients} onSelect={handlePatientSelect} selectedPatientId={selectedPatientId} onDrop={handleDrop} onZoneClick={handleZoneClick} activeEvent={state.activeEvent} blockState={state.blockState} tutorialStep={tutorialStep} />
                                <ZoneDisplay zone={ZONES[1]} patients={state.patients} onSelect={handlePatientSelect} selectedPatientId={selectedPatientId} onDrop={handleDrop} onZoneClick={handleZoneClick} activeEvent={state.activeEvent} blockState={state.blockState} tutorialStep={tutorialStep} />
                            </div>

                            <div className="flex items-center justify-center"><ArrowRight className="text-slate-300" size={24}/></div>

                            <div className="w-64 flex flex-col gap-2 shrink-0">
                                <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest text-center flex items-center justify-center gap-2"><Stethoscope size={12}/> Clinical</div>
                                <ZoneDisplay zone={ZONES[2]} patients={state.patients} onSelect={handlePatientSelect} selectedPatientId={selectedPatientId} onDrop={handleDrop} onZoneClick={handleZoneClick} activeEvent={state.activeEvent} blockState={state.blockState} tutorialStep={tutorialStep} />
                                <ZoneDisplay zone={ZONES[3]} patients={state.patients} onSelect={handlePatientSelect} selectedPatientId={selectedPatientId} onDrop={handleDrop} onZoneClick={handleZoneClick} activeEvent={state.activeEvent} blockState={state.blockState} tutorialStep={tutorialStep} />
                                <ZoneDisplay zone={ZONES[5]} patients={state.patients} onSelect={handlePatientSelect} selectedPatientId={selectedPatientId} onDrop={handleDrop} onZoneClick={handleZoneClick} activeEvent={state.activeEvent} blockState={state.blockState} tutorialStep={tutorialStep} />
                            </div>

                            <div className="flex items-center justify-center"><ArrowRight className="text-slate-300" size={24}/></div>

                            <div className="w-56 flex flex-col gap-2 shrink-0">
                                <div className="text-[10px] font-black text-purple-400 uppercase tracking-widest text-center flex items-center justify-center gap-2"><Scan size={12}/> Inv / Tx</div>
                                <ZoneDisplay zone={ZONES[4]} patients={state.patients} onSelect={handlePatientSelect} selectedPatientId={selectedPatientId} onDrop={handleDrop} onZoneClick={handleZoneClick} activeEvent={state.activeEvent} blockState={state.blockState} tutorialStep={tutorialStep} highlightScan={highlightRadiology} />
                                <ZoneDisplay zone={ZONES[8]} patients={state.patients} onSelect={handlePatientSelect} selectedPatientId={selectedPatientId} onDrop={handleDrop} onZoneClick={handleZoneClick} activeEvent={state.activeEvent} blockState={state.blockState} tutorialStep={tutorialStep} />
                            </div>

                            <div className="flex items-center justify-center"><ArrowRight className="text-slate-300" size={24}/></div>

                            <div className="w-64 flex flex-col gap-2 shrink-0">
                                <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest text-center flex items-center justify-center gap-2"><DoorOpen size={12}/> Disposition</div>
                                <div className="flex-1 flex flex-col gap-2">
                                    <ZoneDisplay zone={ZONES[7]} patients={state.patients} onSelect={handlePatientSelect} selectedPatientId={selectedPatientId} onDrop={handleDrop} onZoneClick={handleZoneClick} activeEvent={state.activeEvent} blockState={state.blockState} tutorialStep={tutorialStep} />
                                    <ZoneDisplay zone={ZONES[6]} patients={state.patients} onSelect={handlePatientSelect} selectedPatientId={selectedPatientId} onDrop={handleDrop} onZoneClick={handleZoneClick} activeEvent={state.activeEvent} blockState={state.blockState} tutorialStep={tutorialStep} />
                                    <div className={`h-32 rounded-xl border-2 border-dashed bg-white flex flex-col items-center justify-center transition-colors relative z-10 ${tutorialStep === 7 ? 'tutorial-highlight tutorial-pointer-down border-emerald-500 text-emerald-600' : 'border-slate-300 text-slate-400 hover:bg-slate-50'}`} 
                                        onDragOver={e => e.preventDefault()} 
                                        onDrop={e => handleDrop(e, 'discharged')}
                                        onClick={() => handleZoneClick('discharged')}
                                        onTouchStart={() => handleZoneClick('discharged')}>
                                        <LogOut size={24} className="mb-2"/>
                                        <span className="font-bold uppercase tracking-widest text-xs">Tap to Discharge</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {selectedPatient && currentRole && (
                        <div className="shrink-0 border-t border-slate-700 shadow-2xl z-40 relative">
                            <ActionHUD patient={selectedPatient} role={currentRole} onClose={() => setSelectedPatientId(null)} onAction={handleActionClick} onAbility={handleAbility} activeEvent={state.activeEvent} isActiveTriage={isActiveTriageMode} tutorialStep={tutorialStep} />
                        </div>
                    )}
                </div>
            </div>
            {state.activeEvent && !state.activeEvent.acknowledged && <EventModal event={state.activeEvent} onClose={() => { const e = {...state.activeEvent, acknowledged: true}; dispatch({ type: 'UPDATE_STATE', payload: { activeEvent: e } }); }} />}
            {state.modalContent === 'guide' && <Modal title="WMEBEM Simulation Guide" onClose={() => dispatch({ type: 'UPDATE_STATE', payload: { modalContent: null } })}><UserGuide /></Modal>}
            {state.modalContent === 'log' && <NotificationLogModal logs={state.notifications} onClose={() => dispatch({ type: 'UPDATE_STATE', payload: { modalContent: null } })} />}
            {triageTarget && <TriageModal patient={triageTarget} onClose={() => setTriageTarget(null)} onConfirm={handleTriageConfirm} scenarioType={state.selectedScenario} />}
            {treatmentTarget && <TreatmentModal patient={treatmentTarget} onClose={() => setTreatmentTarget(null)} onSelectTreatment={handleTreatmentConfirm} tutorialStep={tutorialStep} />}
        </>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
