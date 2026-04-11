import { useState, useEffect, useRef, useCallback } from "react";

const COUNTRIES = [
  "🇴🇲", "🇹🇳", "🇩🇪", "🇫🇷", "🇦🇹", "🇧🇪", "🇸🇦", "🇮🇹", "🇻🇦", "🇨🇭", "🇨🇿",
  "🇱🇺", "🇪🇸", "🇭🇷", "🇲🇨", "🇬🇧", "🇫🇮", "🇪🇪", "🇳🇴", "🇦🇱", "🇬🇷", "🇳🇱"
];

const chapters = [
  {
    id: "birth", year: "1993",
    title: "Born Under Arabian Skies", titleAr: "وُلِدَ تحت سماء عُمان",
    sub: "Muscat, Oman 🇴🇲 · مسقط، عُمان",
    en: "In a land where the desert whispers to the sea, a child opened his eyes for the first time. Muscat wrapped him in warmth, frankincense, and the echo of the adhan — a soul beginning its journey under the infinite grace of the Creator.",
    ar: "في أرضٍ حيث تُعانق الصحراء البحر، فتح طفلٌ عينيه لأول مرة. مسقط لفّته بالدفء واللبان وصدى الأذان — روحٌ تبدأ رحلتها تحت رحمة الخالق الواسعة.",
    emoji: "👶", flag: "🇴🇲",
    bgEmojis: ["🕌", "🌙", "⭐", "🐪", "🌊", "🏜️"],
    pal: { bg: "#0d1b2a", bg2: "#1b2838", bg3: "#2d1b4e", accent: "#d4a574", glow: "#d4a57444" },
  },
  {
    id: "oman", year: "1993–97",
    title: "Golden Desert Years", titleAr: "سنوات الصحراء الذهبية",
    sub: "Ages 0–4 · Oman 🇴🇲 · الطفولة في عُمان",
    en: "Four years of barefoot mornings on warm sand. Chasing sunsets between date palms, falling asleep to mother's lullabies. The world was simple, infinite, and kind — a childhood steeped in the golden light of the East.",
    ar: "أربع سنوات من صباحات حافية على رمال دافئة. ملاحقة الغروب بين النخيل والنوم على تهاليل الأم. كان العالم بسيطاً ولا نهائياً — طفولة غارقة في نور الشرق الذهبي.",
    emoji: "🌅", flag: "🇴🇲",
    bgEmojis: ["🌴", "☀️", "🐚", "🦎", "🌺", "🏖️"],
    pal: { bg: "#3d1f04", bg2: "#5a3510", bg3: "#7a5530", accent: "#f0c27f", glow: "#f0c27f44" },
  },
  {
    id: "move", year: "1997",
    title: "Crossing Continents", titleAr: "عبور القارات",
    sub: "Oman → Tunisia 🇹🇳 · من عُمان إلى تونس",
    en: "At four years old, the family crossed the map — from the Gulf to the Mediterranean. Béni Khalled, Nabeul. A small town of jasmine and olive groves. New colors, new scents, same heart, as the horizon of life began to expand.",
    ar: "في الرابعة من عمره، عبرت العائلة الخريطة — من الخليج إلى المتوسط. بني خلاد، نابل. بلدة صغيرة من الياسمين والزيتون. ألوان جديدة، روائح جديدة، والقلب هو القلب، بينما بدأ أفق الحياة في الاتساع.",
    emoji: "✈️", flag: "🇹🇳",
    bgEmojis: ["🗺️", "✈️", "🧳", "🌍", "🧭", "🕊️"],
    pal: { bg: "#0a2818", bg2: "#0d4028", bg3: "#1a5a3a", accent: "#4ade80", glow: "#4ade8044" },
  },
  {
    id: "preschool", year: "1998–99",
    title: "First Colors", titleAr: "الألوان الأولى",
    sub: "Ages 5–6 · Pre-school 🇹🇳 · الروضة",
    en: "Crayons on paper, sticky fingers, bare feet in schoolyards. Learning the alphabet in Arabic and French, making friends who spoke with laughter. A young Fares drew houses with too many windows, looking out at a world full of wonder.",
    ar: "ألوان شمع على ورق، أصابع لزجة، أقدام حافية في ساحة المدرسة. تعلّم الحروف بالعربية والفرنسية وصداقات تتكلم بالضحك. فارس الصغير كان يرسم بيوتاً بنوافذ كثيرة، يطلّ منها على عالم مليء بالعجائب.",
    emoji: "🎨", flag: "🇹🇳",
    bgEmojis: ["✏️", "🖍️", "🎈", "🧸", "🎪", "📐"],
    pal: { bg: "#2a1050", bg2: "#401870", bg3: "#5a2090", accent: "#e879f9", glow: "#e879f944" },
  },
  {
    id: "primary", year: "1999–2005",
    title: "Arbi Zarrouk Primary School", titleAr: "أيام المدرسة الإبتدائية العربي زروق",
    sub: "Ages 6–12 · Primary School 🇹🇳 · المدرسة الابتدائية",
    en: "Six years of chalk dust and bell rings. Walking to school through narrow streets, the smell of fresh bread, and friendships forged over shared sandwiches. In the quiet of the classroom, math became his secret language of logic and order.",
    ar: "ست سنوات من غبار الطباشير ورنين الجرس. المشي إلى المدرسة عبر الأزقة، رائحة الخبز الطازج، وصداقات صُنعت فوق ساندويتشات مُقتسمة. في هدوء الفصل، صارت الرياضيات لغته السرية للمنطق والنظام.",
    emoji: "📚", flag: "🇹🇳",
    bgEmojis: ["📖", "✍️", "🏫", "📝", "🎒", "📏"],
    pal: { bg: "#0c1c38", bg2: "#1a3058", bg3: "#284878", accent: "#60a5fa", glow: "#60a5fa44" },
  },
  {
    id: "college", year: "2005–08",
    title: "The Ninth Trial", titleAr: "امتحان التاسعة",
    sub: "Ages 12–15 · Collège 🇹🇳 · الإعدادي",
    en: "The bridge years. Harder lessons, stricter voices, the weight of a national exam on young shoulders. The 9ème wasn't just a test — it was a rite of passage into a more disciplined self. He crossed it with focus and resolve.",
    ar: "سنوات العبور. دروس أصعب، أصوات أكثر صرامة، وثقل امتحان وطني على أكتاف شابة. التاسعة لم تكن مجرد اختبار — كانت طقس عبور إلى ذات أكثر انضباطاً. اجتازها بتركيز وعزيمة.",
    emoji: "🏫", flag: "🇹🇳",
    bgEmojis: ["📐", "🔬", "🧪", "📊", "🎯", "⚡"],
    pal: { bg: "#0a2828", bg2: "#104848", bg3: "#186060", accent: "#2dd4bf", glow: "#2dd4bf44" },
  },
  {
    id: "highschool", year: "2008–12",
    title: "Numbers & Glory", titleAr: "الأرقام والمجد",
    sub: "Ages 15–19 · Lycée · Mathematics 🇹🇳 · الباكالوريا رياضيات",
    en: "Four years in the world of integrals and equations. Nahj El Manzeh — where a boy sharpened into a young man. The Baccalauréat came, and he conquered it with honors, opening the doors to a future built on excellence and effort.",
    ar: "أربع سنوات في عالم التكاملات والمعادلات. نهج المنزه — حيث صُقل الفتى رجلاً. جاء الباكالوريا وانتصر عليه بامتياز، ليفتح أبواب المستقبل المبني على التفوق والجهد.",
    emoji: "🎓", flag: "🇹🇳",
    bgEmojis: ["∑", "∫", "π", "📐", "🏆", "🎓"],
    pal: { bg: "#280a0a", bg2: "#4a1818", bg3: "#702828", accent: "#f87171", glow: "#f8717144" },
  },
  {
    id: "insat", year: "2012–18",
    title: "The Engineer", titleAr: "المُهندس",
    sub: "Ages 19–25 · INSAT Tunis 🇹🇳 · الهندسة",
    en: "Five years at INSAT, in the heart of Tunis. Late nights, rigorous exams, and lifelong bonds. Graduation day arrived — a diploma in hand, a testament to years of dedication and the pride in his parents' eyes.",
    ar: "خمس سنوات في المعهد الوطني، في قلب العاصمة. ليالٍ طويلة، امتحانات صارمة، وروابط تدوم. جاء يوم التخرج — الشهادة في اليد، شاهدة على سنوات من التفاني والفخر في عيون الوالدين.",
    emoji: "⚗️", flag: "🇹🇳",
    bgEmojis: ["⚗️", "🔬", "🧪", "⚙️", "🎓", "🏛️"],
    pal: { bg: "#0a0a28", bg2: "#181848", bg3: "#282870", accent: "#818cf8", glow: "#818cf844" },
  },
  {
    id: "pivot", year: "2018",
    title: "The Great Pivot", titleAr: "المنعطف الكبير",
    sub: "A Leap of Faith · قفزة إيمان",
    en: "A safe job offer. A comfortable path. And a voice inside that said: 'This is not where you belong.' He turned it down, choosing the uncertain over the conventional. He trusted in the path less traveled. Bismillah.",
    ar: "عرض عمل مريح. طريق آمن. وصوت في الداخل قال: 'هذا ليس مكانك.' رفضه، مختاراً المجهول على المألوف. توكّل على الطريق الأقل سلوكاً. بسم الله.",
    emoji: "⚡", flag: "",
    bgEmojis: ["🔀", "💡", "⚡", "🔥", "🛤️", "🎯"],
    pal: { bg: "#000000", bg2: "#1a0808", bg3: "#300808", accent: "#ff6b6b", glow: "#ff6b6b44" },
  },
  {
    id: "dev", year: "2018–21",
    title: "The Reinvention", titleAr: "إعادة الاختراع",
    sub: "Tunisia 🇹🇳 · البداية الجديدة",
    en: "He rewired himself. From labs to keyboards, from molecules to code. Three years of relentless learning and becoming, transforming into a architect of digital possibilities, driven by a new passion for creation.",
    ar: "أعاد تشكيل نفسه. من المختبرات إلى لوحات المفاتيح، من الجزيئات إلى البرمجة. ثلاث سنوات من التعلم المستمر، ليتحول إلى مهندس للاحتمالات الرقمية، مدفوعاً بشغف جديد للبناء.",
    emoji: "💻", flag: "🇹🇳",
    bgEmojis: ["💻", "⌨️", "🖥️", "📱", "🔧", "🚀"],
    pal: { bg: "#0a1428", bg2: "#0f2040", bg3: "#183058", accent: "#38bdf8", glow: "#38bdf844" },
  },
  {
    id: "paris", year: "2021",
    title: "City of Light", titleAr: "مدينة النور",
    sub: "Paris, France 🇫🇷 · باريس، فرنسا",
    en: "A one-way ticket. The City of Light welcomed a new dreamer. Leaving behind the familiar home for the magnificent unknown, carrying with him the values of his past and the ambition for a global future.",
    ar: "تذكرة ذهاب بلا عودة. مدينة النور استقبلت حالماً جديداً. ترك الوطن المألوف نحو المجهول العظيم، حاملاً معه قيم الماضي وطموح المستقبل العالمي.",
    emoji: "🗼", flag: "🇫🇷",
    bgEmojis: ["🗼", "🥐", "🇫🇷", "🌉", "🏛️", "🌹"],
    pal: { bg: "#0f0a28", bg2: "#1c1450", bg3: "#2a1c70", accent: "#fbbf24", glow: "#fbbf2444" },
  },
  {
    id: "france", year: "2021–26",
    title: "Building & Exploring", titleAr: "البناء والاستكشاف",
    sub: "France 🇫🇷 · Growth · نمو",
    en: "Five years of growth and wanderlust. 22 countries across 3 continents — from Nordic fjords to Mediterranean shores. Each destination adding a new layer to the map of his soul and a new perspective to his craft.",
    ar: "خمس سنوات من النمو وحب الترحال. 22 بلداً عبر 3 قارات — من مضايق الشمال إلى شواطئ المتوسط. كل وجهة أضافت طبقة جديدة لخريطة روحه ومنظوراً جديداً لحرفته.",
    emoji: "🌍", flag: "🇫🇷",
    bgEmojis: ["🌍", "✈️", "🧳", "📸", "⛰️", "🌊"],
    pal: { bg: "#0a2018", bg2: "#0d3020", bg3: "#165030", accent: "#4ade80", glow: "#4ade8044" },
    showTravel: true,
  },
];

/* ═══════════ COMPONENTS ═══════════ */

function Particles({ color, count = 45 }) {
  const ref = useRef(null), raf = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    const fit = () => { c.width = innerWidth; c.height = innerHeight; };
    fit(); addEventListener("resize", fit);
    const ps = Array.from({ length: count }, () => ({
      x: Math.random() * c.width, y: Math.random() * c.height,
      r: Math.random() * 2 + 0.5, dx: (Math.random() - 0.5) * 0.3,
      dy: -(Math.random() * 0.35 + 0.08), o: Math.random() * 0.38 + 0.1, ph: Math.random() * 6.28
    }));
    const loop = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      for (const p of ps) {
        p.x += p.dx; p.y += p.dy; p.ph += 0.012;
        if (p.x < -5) p.x = c.width + 5; if (p.x > c.width + 5) p.x = -5;
        if (p.y < -5) p.y = c.height + 5; if (p.y > c.height + 5) p.y = -5;
        const g = Math.sin(p.ph) * 0.3 + 0.7;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * g, 0, 6.28);
        ctx.fillStyle = color; ctx.globalAlpha = p.o * g;
        ctx.shadowBlur = 8; ctx.shadowColor = color; ctx.fill();
      }
      ctx.globalAlpha = 1; ctx.shadowBlur = 0;
      raf.current = requestAnimationFrame(loop);
    };
    loop();
    return () => { cancelAnimationFrame(raf.current); removeEventListener("resize", fit); };
  }, [color, count]);
  return <canvas ref={ref} style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2 }} />;
}

function LifeGauge({ years = 33, max = 100, animate = true, accent = "#d4a574", delay = 1 }) {
  const pct = typeof max === 'number' ? (years / max) * 100 : 50;
  return (
    <div style={{ width: "85%", maxWidth: "300px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
        <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "0.5rem", color: "#ffffff33", letterSpacing: "2px" }}>LIFE</span>
        <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "0.5rem", color: accent, letterSpacing: "1px" }}>{years} / {max}</span>
      </div>
      <div style={{ width: "100%", height: "7px", borderRadius: "99px", background: "#ffffff08", border: "1px solid #ffffff08", overflow: "hidden", position: "relative" }}>
        <div style={{
          height: "100%", borderRadius: "99px",
          background: `linear-gradient(90deg, ${accent}77, ${accent})`,
          width: animate ? `${pct}%` : "0%",
          transition: animate ? `width 3s ${delay}s cubic-bezier(0.16,1,0.3,1)` : "none",
          boxShadow: `0 0 10px ${accent}55`,
          position: "relative",
        }}>
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(90deg, transparent 0%, #ffffff30 50%, transparent 100%)",
            animation: animate ? `shimmerSlide 2s ${delay + 2.5}s ease-in-out infinite` : "none",
          }} />
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "3px", padding: "0 1px" }}>
        {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(d => (
          <div key={d} style={{ width: "1px", height: "3px", background: d <= years ? "#ffffff18" : "#ffffff08" }} />
        ))}
      </div>
    </div>
  );
}

function Atmosphere({ icons, accent }) {
  const spots = [{ left: "6%", top: "10%" }, { right: "7%", top: "14%" }, { left: "14%", bottom: "20%" }, { right: "12%", bottom: "12%" }, { left: "48%", top: "6%" }, { right: "28%", bottom: "30%" }];
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 1 }}>
      {icons.map((ic, i) => (
        <div key={i} style={{
          position: "absolute", ...spots[i % spots.length],
          fontSize: `${38 + Math.random() * 50}px`, opacity: 0.05,
          filter: `blur(5px) drop-shadow(0 0 14px ${accent})`,
          animation: `floatGentle ${5 + i * 1.5}s ease-in-out ${-i * 1.2}s infinite alternate`,
          transform: `rotate(${Math.random() * 20 - 10}deg)`,
        }}>{ic}</div>
      ))}
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse at 28% 22%,${accent}07 0%,transparent 55%),radial-gradient(ellipse at 72% 78%,${accent}05 0%,transparent 48%)`,
      }} />
    </div>
  );
}

function TravelGrid({ active }) {
  return (
    <div style={{
      marginTop: "1.1rem", opacity: active ? 1 : 0,
      transform: active ? "translateY(0)" : "translateY(14px)",
      transition: "all 0.8s 0.8s cubic-bezier(0.16,1,0.3,1)",
    }}>
      <div style={{ display: "flex", justifyContent: "center", gap: "1.1rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
        {[{ v: "22", l: "بلد · Countries" }, { v: "3", l: "قارات · Continents" }, { v: "11.3%", l: "من العالم · of Earth" }].map((s, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.4rem", fontWeight: 700, color: "#4ade80", textShadow: "0 0 12px #4ade8033" }}>{s.v}</div>
            <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "0.48rem", letterSpacing: "1.5px", color: "#ffffff44" }}>{s.l}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "4px", maxWidth: "280px", margin: "0 auto" }}>
        {COUNTRIES.map((f, i) => (<span key={i} style={{ fontSize: "1rem", animation: active ? `fadeSlideUp 0.3s ${0.9 + i * 0.04}s both` : "none" }}>{f}</span>))}
      </div>
    </div>
  );
}

/* ─── SLIDE ─── */
function Slide({ ch, active, idx, total }) {
  const p = ch.pal;
  return (
    <div style={{
      position: "relative", width: "100vw", height: "100vh", flexShrink: 0, overflow: "hidden",
      background: `linear-gradient(150deg,${p.bg} 0%,${p.bg2} 45%,${p.bg3} 100%)`,
    }}>
      <Atmosphere icons={ch.bgEmojis} accent={p.accent} />
      <Particles color={p.accent} count={38} />
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 3, overflow: "hidden" }}>
        <div style={{ position: "absolute", width: "48vmax", height: "48vmax", borderRadius: "50%", border: `1px solid ${p.accent}0e`, top: "50%", left: "50%", transform: "translate(-50%,-50%)", animation: "orbitSpin 50s linear infinite" }} />
        <div style={{ position: "absolute", width: "68vmax", height: "68vmax", borderRadius: "50%", border: `1px solid ${p.accent}08`, top: "50%", left: "50%", transform: "translate(-50%,-50%)", animation: "orbitSpin 70s linear infinite reverse" }} />
      </div>
      <div style={{ position: "absolute", inset: 0, zIndex: 4, pointerEvents: "none", background: "radial-gradient(ellipse at center,transparent 35%,rgba(0,0,0,0.5) 100%)" }} />

      <div style={{
        position: "relative", zIndex: 10, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        height: "100%", padding: "4.5rem 1.5rem 3.2rem",
        overflowY: "auto", WebkitOverflowScrolling: "touch",
      }}>
        <div style={{
          maxWidth: "470px", textAlign: "center",
          opacity: active ? 1 : 0.1,
          transform: active ? "scale(1) translateY(0)" : "scale(0.9) translateY(28px)",
          transition: "all 0.9s cubic-bezier(0.16,1,0.3,1)",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "7px", marginBottom: "0.7rem", animation: active ? "fadeSlideUp 0.7s 0.1s both" : "none" }}>
            {ch.flag && <span style={{ fontSize: "1.15rem" }}>{ch.flag}</span>}
            <span style={{ padding: "3px 13px", borderRadius: "999px", border: `1.5px solid ${p.accent}55`, color: p.accent, fontSize: "0.58rem", letterSpacing: "2px", fontFamily: "'IBM Plex Mono',monospace", background: `${p.accent}08` }}>{ch.year}</span>
          </div>
          <div style={{ fontSize: "2.4rem", marginBottom: "0.4rem", filter: `drop-shadow(0 0 18px ${p.glow})`, animation: active ? "fadeSlideUp 0.7s 0.18s both, gentlePulse 4s 1s ease-in-out infinite" : "none" }}>{ch.emoji}</div>
          <div style={{ fontFamily: "'Aref Ruqaa',serif", fontSize: "clamp(1rem,2.8vw,1.4rem)", color: `${p.accent}bb`, direction: "rtl", marginBottom: "0.12rem", animation: active ? "fadeSlideUp 0.7s 0.24s both" : "none" }}>{ch.titleAr}</div>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(1.4rem,4.8vw,2.2rem)", fontWeight: 700, fontStyle: "italic", color: "#f0ece6", margin: "0 0 0.25rem", lineHeight: 1.1, textShadow: `0 0 35px ${p.glow}`, animation: active ? "fadeSlideUp 0.7s 0.3s both" : "none" }}>{ch.title}</h2>
          <div style={{ fontSize: "0.58rem", color: "#ffffff50", letterSpacing: "2px", fontFamily: "'IBM Plex Mono',monospace", marginBottom: "0.8rem", animation: active ? "fadeSlideUp 0.7s 0.35s both" : "none" }}>{ch.sub}</div>
          <div style={{ width: "36px", height: "1.5px", margin: "0 auto 0.8rem", background: `linear-gradient(90deg,transparent,${p.accent},transparent)`, animation: active ? "fadeSlideUp 0.7s 0.38s both" : "none" }} />
          <p style={{ fontFamily: "'IBM Plex Sans Arabic',sans-serif", fontSize: "clamp(0.75rem,1.8vw,0.85rem)", fontWeight: 300, lineHeight: 1.8, color: `${p.accent}aa`, direction: "rtl", margin: "0 0 0.5rem", animation: active ? "fadeSlideUp 0.7s 0.46s both" : "none" }}>{ch.ar}</p>
          <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(0.85rem,2.1vw,0.98rem)", lineHeight: 1.75, color: "#f0ece6cc", margin: 0, animation: active ? "fadeSlideUp 0.7s 0.56s both" : "none" }}>{ch.en}</p>
          {ch.showTravel && <TravelGrid active={active} />}
        </div>
      </div>

      <div style={{ position: "absolute", bottom: "1.1rem", left: "50%", transform: "translateX(-50%)", zIndex: 20, display: "flex", gap: "3px" }}>
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} style={{ width: i === idx ? "16px" : "3.5px", height: "3.5px", borderRadius: "99px", background: i === idx ? p.accent : "#ffffff15", transition: "all 0.6s cubic-bezier(0.16,1,0.3,1)", boxShadow: i === idx ? `0 0 5px ${p.accent}55` : "none" }} />
        ))}
      </div>
      {idx === 0 && active && (
        <div style={{ position: "absolute", bottom: "2.8rem", left: "50%", transform: "translateX(-50%)", zIndex: 20, color: "#ffffff22", fontSize: "0.55rem", letterSpacing: "3px", textTransform: "uppercase", fontFamily: "'IBM Plex Mono',monospace", animation: "fadeSlideUp 1s 2s both, gentlePulse 2.5s 3s ease-in-out infinite" }}>← swipe or scroll →</div>
      )}
    </div>
  );
}

/* ─── INTRO ─── */
function Intro({ onEnter }) {
  const [h, setH] = useState(false);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 300); }, []);
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: "linear-gradient(160deg,#030308 0%,#080614 20%,#0e0a1e 45%,#080614 70%,#030308 100%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden",
    }}>
      <Particles color="#d4a574" count={65} />
      {[440, 320, 210, 530].map((s, i) => (
        <div key={i} style={{ position: "absolute", width: `min(${s * 0.2}vw,${s}px)`, height: `min(${s * 0.2}vw,${s}px)`, borderRadius: "50%", border: `1px solid #d4a574${i < 2 ? "10" : "08"}`, top: "50%", left: "50%", transform: "translate(-50%,-50%)", animation: `orbitSpin ${20 + i * 11}s linear infinite ${i % 2 ? "reverse" : ""}` }} />
      ))}
      {["📖", "🕯️", "🌙", "🖋️", "📜", "🌟", "🕰️", "🗝️"].map((ic, i) => (
        <div key={i} style={{ position: "absolute", fontSize: `${26 + Math.random() * 28}px`, opacity: 0.028, filter: "blur(3px)", left: `${5 + (i * 12) % 88}%`, top: `${8 + (i * 15) % 78}%`, animation: `floatGentle ${5 + i * 1.3}s ease-in-out ${-i}s infinite alternate` }}>{ic}</div>
      ))}

      <div style={{ position: "relative", zIndex: 10, textAlign: "center", padding: "0 1.5rem", maxWidth: "420px" }}>
        <div style={{ fontFamily: "'Aref Ruqaa',serif", fontSize: "clamp(0.8rem,2vw,0.95rem)", color: "#d4a57438", direction: "rtl", marginBottom: "0.5rem", animation: "fadeSlideUp 1s 0.2s both" }}>بسم الله الرحمن الرحيم</div>
        <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "0.55rem", color: "#d4a574aa", letterSpacing: "4px", marginBottom: "1.2rem", animation: "fadeSlideUp 1s 0.3s both" }}>CHAPTER 33: THE MILESTONE · الليلة أتممتُ ثلاثاً وثلاثين</div>
        <div style={{ fontFamily: "'Aref Ruqaa',serif", fontSize: "clamp(2.8rem,8.5vw,4.8rem)", fontWeight: 700, color: "#d4a574", direction: "rtl", lineHeight: 1.15, textShadow: "0 0 45px #d4a57430, 0 3px 18px #00000050", marginBottom: "0.1rem", animation: "fadeSlideUp 1s 0.4s both" }}>فارس الخياري</div>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(2.4rem,8.5vw,4.8rem)", fontWeight: 300, fontStyle: "italic", color: "#f0ece6", margin: "0 0 0.7rem", lineHeight: 1, letterSpacing: "-1.5px", textShadow: "0 0 55px #d4a57412", animation: "fadeSlideUp 1s 0.6s both" }}>Fares Khiary</h1>
        <p style={{ fontFamily: "'IBM Plex Sans Arabic',sans-serif", fontSize: "clamp(0.7rem,1.8vw,0.82rem)", fontWeight: 300, lineHeight: 1.8, color: "#d4a57466", direction: "rtl", marginBottom: "0.4rem", animation: "fadeSlideUp 1s 0.8s both" }}>
          الليلة، في الثالثة والثلاثين، تجتمع الذكريات. من رمال عُمان، إلى ياسمين تونس، وصولاً إلى أنوار فرنسا. من المختبرات إلى عالم الكود — قصة إيمان ونمو، ما زالت فصولها تروى.
        </p>
        <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(0.82rem,2.1vw,0.95rem)", lineHeight: 1.8, color: "#ffffff44", fontStyle: "italic", marginBottom: "1.6rem", animation: "fadeSlideUp 1s 0.95s both" }}>
          Tonight, at 33, memories converge. From the sands of Oman, to the jasmine of Tunisia, and finally the lights of France. From science labs to digital craft—a journey of faith and growth, still unfolding.
        </p>
        <div style={{ marginBottom: "1.8rem", animation: "fadeSlideUp 1s 1.1s both" }}>
          <LifeGauge years={33} max={"X"} animate={loaded} accent="#d4a574" delay={1.5} />
        </div>
        <button onClick={onEnter} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{
          fontFamily: "'Cormorant Garamond',serif", fontSize: "0.9rem", fontStyle: "italic",
          padding: "11px 36px", borderRadius: "999px", border: "1px solid #d4a57440",
          background: h ? "#d4a574" : "transparent", color: h ? "#0a0a0a" : "#d4a574",
          cursor: "pointer", letterSpacing: "2px",
          transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)",
          boxShadow: h ? "0 0 38px #d4a57440" : "0 0 15px #d4a57412",
          transform: h ? "scale(1.05)" : "scale(1)",
          animation: "fadeSlideUp 1s 1.3s both",
        }}>Enter My Story · ادخل قصتي</button>
      </div>
    </div>
  );
}

/* ─── FINALE ─── */
function Finale({ active, idx, total }) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { if (active) setTimeout(() => setLoaded(true), 400); }, [active]);
  const accent = "#fbbf24";
  return (
    <div style={{
      position: "relative", width: "100vw", height: "100vh", flexShrink: 0, overflow: "hidden",
      background: "linear-gradient(150deg,#030308 0%,#0a0614 25%,#14082a 50%,#0a0614 75%,#030308 100%)",
    }}>
      <Atmosphere icons={["✨", "🌟", "💫", "⭐", "🤲", "🕰️", "📖"]} accent={accent} />
      <Particles color={accent} count={70} />
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 3, overflow: "hidden" }}>
        <div style={{ position: "absolute", width: "52vmax", height: "52vmax", borderRadius: "50%", border: `1px solid ${accent}0e`, top: "50%", left: "50%", transform: "translate(-50%,-50%)", animation: "orbitSpin 40s linear infinite" }} />
      </div>
      <div style={{ position: "absolute", inset: 0, zIndex: 4, pointerEvents: "none", background: "radial-gradient(ellipse at center,transparent 30%,rgba(0,0,0,0.55) 100%)" }} />

      <div style={{
        position: "relative", zIndex: 10, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        height: "100%", padding: "4rem 1.5rem 3rem",
        overflowY: "auto", WebkitOverflowScrolling: "touch",
      }}>
        <div style={{
          maxWidth: "470px", textAlign: "center",
          opacity: active ? 1 : 0.1,
          transform: active ? "scale(1) translateY(0)" : "scale(0.9) translateY(28px)",
          transition: "all 0.9s cubic-bezier(0.16,1,0.3,1)",
        }}>
          <div style={{ animation: active ? "fadeSlideUp 0.7s 0.1s both" : "none" }}>
            <span style={{ padding: "3px 13px", borderRadius: "999px", border: `1.5px solid ${accent}55`, color: accent, fontSize: "0.58rem", letterSpacing: "2px", fontFamily: "'IBM Plex Mono',monospace", background: `${accent}08` }}>April 12, 2026</span>
          </div>
          <div style={{ fontSize: "2.4rem", margin: "0.7rem 0 0.4rem", filter: `drop-shadow(0 0 22px ${accent}77)`, animation: active ? "fadeSlideUp 0.7s 0.2s both, gentlePulse 4s 1s ease-in-out infinite" : "none" }}>✨</div>
          <div style={{ fontFamily: "'Aref Ruqaa',serif", fontSize: "clamp(1.1rem,3.2vw,1.5rem)", color: `${accent}bb`, direction: "rtl", marginBottom: "0.1rem", animation: active ? "fadeSlideUp 0.7s 0.26s both" : "none" }}>الفصل الثاني والثلاثون</div>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(1.5rem,5vw,2.4rem)", fontWeight: 700, fontStyle: "italic", color: "#f0ece6", margin: "0 0 0.25rem", lineHeight: 1.1, textShadow: `0 0 40px ${accent}30`, animation: active ? "fadeSlideUp 0.7s 0.32s both" : "none" }}>Chapter 32</h2>
          <div style={{ fontSize: "0.58rem", color: "#ffffff44", letterSpacing: "2px", fontFamily: "'IBM Plex Mono',monospace", marginBottom: "0.8rem", animation: active ? "fadeSlideUp 0.7s 0.36s both" : "none" }}>The Story Continues · القصة مستمرة</div>
          <div style={{ width: "36px", height: "1.5px", margin: "0 auto 0.8rem", background: `linear-gradient(90deg,transparent,${accent},transparent)`, animation: active ? "fadeSlideUp 0.7s 0.4s both" : "none" }} />

          <p style={{ fontFamily: "'IBM Plex Sans Arabic',sans-serif", fontSize: "clamp(0.75rem,1.8vw,0.85rem)", fontWeight: 300, lineHeight: 1.8, color: `${accent}aa`, direction: "rtl", margin: "0 0 0.5rem", animation: active ? "fadeSlideUp 0.7s 0.48s both" : "none" }}>
            بالنظر إلى الوراء — كل عثرة كانت درساً، كل منعطف كان هداية، كل باب مُغلق كان حماية. لم يكن الطريق مستقيماً أبداً، لكنه كان دائماً في يد الرحمن الرحيم.
          </p>
          <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(0.85rem,2.1vw,0.96rem)", lineHeight: 1.8, color: "#f0ece6cc", margin: "0 0 0.5rem", animation: active ? "fadeSlideUp 0.7s 0.56s both" : "none" }}>
            Looking back — every stumble was a lesson, every detour was divine guidance, every closed door was protection. The road was never straight, but it was always held in the hands of the Most Merciful.
          </p>

          <p style={{ fontFamily: "'IBM Plex Sans Arabic',sans-serif", fontSize: "clamp(0.75rem,1.8vw,0.85rem)", fontWeight: 300, lineHeight: 1.8, color: `${accent}88`, direction: "rtl", margin: "0 0 0.4rem", animation: active ? "fadeSlideUp 0.7s 0.64s both" : "none" }}>
            أجمل الفصول لم تُكتب بعد. مكة تنتظر. المدينة تنادي. آفاق جديدة تلوح في أفق الغد.
          </p>
          <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(0.82rem,2vw,0.92rem)", lineHeight: 1.8, color: "#ffffff55", fontStyle: "italic", margin: "0 0 1.2rem", animation: active ? "fadeSlideUp 0.7s 0.72s both" : "none" }}>
            The best chapters haven't been written yet. Mecca awaits. Medina calls. New horizons are emerging on the silhouette of tomorrow.
          </p>

          <div style={{ fontSize: "1.8rem", marginBottom: "0.4rem", animation: active ? "fadeSlideUp 0.7s 0.8s both" : "none" }}>🤲</div>
          <div style={{ fontFamily: "'Aref Ruqaa',serif", fontSize: "clamp(1rem,2.8vw,1.25rem)", color: accent, direction: "rtl", marginBottom: "0.2rem", textShadow: `0 0 18px ${accent}33`, animation: active ? "fadeSlideUp 0.7s 0.86s both" : "none" }}>الحمد لله على كل شيء</div>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "0.75rem", color: "#ffffff33", fontStyle: "italic", marginBottom: "1.3rem", animation: active ? "fadeSlideUp 0.7s 0.92s both" : "none" }}>All praise is due to Allah for everything.</div>

          <div style={{ animation: active ? "fadeSlideUp 1s 1.05s both" : "none" }}>
            <LifeGauge years={33} max="X" animate={active && loaded} accent={accent} delay={0.5} />
          </div>
          <div style={{ marginTop: "0.8rem", fontFamily: "'IBM Plex Mono',monospace", fontSize: "0.5rem", color: "#ffffff1a", letterSpacing: "3px", textTransform: "uppercase", animation: active ? "fadeSlideUp 1s 1.4s both" : "none" }}>
            بسم الله نمضي · Onward, with God
          </div>
        </div>
      </div>

      <div style={{ position: "absolute", bottom: "1.1rem", left: "50%", transform: "translateX(-50%)", zIndex: 20, display: "flex", gap: "3px" }}>
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} style={{ width: i === idx ? "16px" : "3.5px", height: "3.5px", borderRadius: "99px", background: i === idx ? accent : "#ffffff15", transition: "all 0.6s cubic-bezier(0.16,1,0.3,1)", boxShadow: i === idx ? `0 0 5px ${accent}55` : "none" }} />
        ))}
      </div>
    </div>
  );
}

/* ─── APP ─── */
export default function App() {
  const [intro, setIntro] = useState(true);
  const [exit, setExit] = useState(false);
  const [cur, setCur] = useState(0);
  const t = useRef({ sx: 0, drag: false });
  const lock = useRef(false);
  const total = chapters.length + 1;

  const go = useCallback((i) => {
    if (i < 0 || i >= total || lock.current) return;
    lock.current = true; setCur(i);
    setTimeout(() => { lock.current = false; }, 780);
  }, [total]);

  useEffect(() => {
    if (intro) return;
    const h = e => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") go(cur + 1);
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") go(cur - 1);
    };
    addEventListener("keydown", h); return () => removeEventListener("keydown", h);
  }, [cur, intro, go]);

  useEffect(() => {
    if (intro) return;
    let wt = null;
    const h = e => {
      e.preventDefault(); if (wt) return;
      const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(d) > 22) { go(d > 0 ? cur + 1 : cur - 1); wt = setTimeout(() => { wt = null; }, 880); }
    };
    addEventListener("wheel", h, { passive: false }); return () => removeEventListener("wheel", h);
  }, [cur, intro, go]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,700&family=IBM+Plex+Mono:wght@300;400&family=Aref+Ruqaa:wght@400;700&family=IBM+Plex+Sans+Arabic:wght@300;400;500;600&display=swap');
        *{margin:0;padding:0;box-sizing:border-box}
        html,body{overflow:hidden;background:#030308;-webkit-font-smoothing:antialiased}
        ::selection{background:#d4a57444;color:#fff}
        ::-webkit-scrollbar{width:0;height:0}
        @keyframes fadeSlideUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
        @keyframes floatGentle{0%{transform:translateY(0) rotate(0deg)}100%{transform:translateY(-15px) rotate(4deg)}}
        @keyframes orbitSpin{from{transform:translate(-50%,-50%) rotate(0deg)}to{transform:translate(-50%,-50%) rotate(360deg)}}
        @keyframes gentlePulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.6;transform:scale(1.04)}}
        @keyframes introExit{to{opacity:0;transform:scale(1.1);filter:blur(25px)}}
        @keyframes grain{0%,100%{opacity:0.022}50%{opacity:0.045}}
        @keyframes shimmerSlide{0%{transform:translateX(-100%)}100%{transform:translateX(250%)}}
      `}</style>

      <div style={{ position: "fixed", inset: 0, zIndex: 9999, pointerEvents: "none", background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, opacity: 0.028, mixBlendMode: "overlay", animation: "grain 0.4s steps(1) infinite" }} />

      {intro && (
        <div style={{ animation: exit ? "introExit 0.9s cubic-bezier(0.16,1,0.3,1) forwards" : "none" }}>
          <Intro onEnter={() => { setExit(true); setTimeout(() => setIntro(false), 900); }} />
        </div>
      )}

      {!intro && (
        <div
          onTouchStart={e => { t.current = { sx: e.touches[0].clientX, drag: true }; }}
          onTouchEnd={e => { if (!t.current.drag) return; t.current.drag = false; const dx = t.current.sx - e.changedTouches[0].clientX; if (Math.abs(dx) > 36) go(dx > 0 ? cur + 1 : cur - 1); }}
          onMouseDown={e => { t.current = { sx: e.clientX, drag: true }; }}
          onMouseUp={e => { if (!t.current.drag) return; t.current.drag = false; const dx = t.current.sx - e.clientX; if (Math.abs(dx) > 45) go(dx > 0 ? cur + 1 : cur - 1); }}
          style={{ position: "fixed", inset: 0, overflow: "hidden", cursor: "grab", userSelect: "none" }}
        >
          <div style={{
            display: "flex", width: `${total * 100}vw`, height: "100vh",
            transform: `translateX(-${cur * 100}vw)`,
            transition: "transform 0.78s cubic-bezier(0.16,1,0.3,1)",
            willChange: "transform",
          }}>
            {chapters.map((ch, i) => <Slide key={ch.id} ch={ch} active={i === cur} idx={i} total={total} />)}
            <Finale active={cur === chapters.length} idx={chapters.length} total={total} />
          </div>

          <div style={{ position: "fixed", top: "1rem", right: "1rem", z_idx: 50, fontFamily: "'IBM Plex Mono',monospace", fontSize: "0.55rem", color: "#ffffff22", letterSpacing: "2px" }}>{String(cur + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</div>

          {[{ show: cur > 0, s: "left", ic: "‹", fn: () => go(cur - 1) }, { show: cur < total - 1, s: "right", ic: "›", fn: () => go(cur + 1) }].filter(a => a.show).map((a, i) => (
            <button key={i} onClick={a.fn} style={{
              position: "fixed", [a.s]: "0.5rem", top: "50%", transform: "translateY(-50%)",
              zIndex: 50, background: "#ffffff05", border: "1px solid #ffffff0a",
              borderRadius: "50%", width: "34px", height: "34px",
              color: "#ffffff38", cursor: "pointer", fontSize: "1rem",
              display: "flex", alignItems: "center", justifyContent: "center",
              backdropFilter: "blur(5px)", transition: "all 0.3s",
            }}
              onMouseEnter={e => { e.target.style.borderColor = "#ffffff25"; e.target.style.color = "#ffffff99"; }}
              onMouseLeave={e => { e.target.style.borderColor = "#ffffff0a"; e.target.style.color = "#ffffff38"; }}
            >{a.ic}</button>
          ))}
        </div>
      )}
    </>
  );
}
