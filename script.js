// ============================================================
//   TechLearn - עולם התכנה
//   Main Application Script
// ============================================================

'use strict';

// ── State ─────────────────────────────────────────────────
const STATE = {
  theme: 'dark',
  level: 'beginner',
  points: 0,
  completed: new Set(),
  badges: new Set(),
  simsDone: new Set(),
  currentView: 'dashboard',
  currentConcept: null,
  pgMode: 'html',
  dailyChallengeAnswered: false,
  dailyChallengeIdx: 0,
  lastVisit: null,
  leaderboardName: '',
};

// ── Data ───────────────────────────────────────────────────
const CONCEPTS = [
  {
    id: 'html',
    emoji: '🏗️',
    title: 'HTML',
    tagline: 'השלד של כל אתר אינטרנט',
    color: '#e34c26',
    category: 'frontend',
    tags: ['בסיסי', 'אתרים'],
    desc: 'HTML הוא השפה שבה בנויים אתרי אינטרנט. כמו עצמות בגוף האדם - הוא נותן מבנה לכל מה שאתה רואה.',
    levels: {
      beginner: {
        explain: 'HTML זה כמו לבנות בית מלגו. יש לנו "לבנות" שנקראות תגיות (Tags), וכל אחת עושה משהו אחר. תגית &lt;h1&gt; זה כותרת גדולה, &lt;p&gt; זה פסקת טקסט, ו-&lt;img&gt; זה תמונה.',
        metaphor: { icon: '🧱', title: 'HTML הוא כמו לגו', desc: 'בדיוק כמו שבונים בית מלגו עם חתיכות שמתחברות, HTML בנוי מ"חתיכות" שנקראות תגיות. כל תגית עושה משהו אחר - כמו חלון, דלת, או קיר.' },
        code: {
          lang: 'HTML',
          lines: [
            { code: '<!DOCTYPE html>', tip: 'אומר לדפדפן שזה קובץ HTML מודרני' },
            { code: '<html lang="he">', tip: 'פותח את המסמך ומגדיר שפה עברית' },
            { code: '  <head>', tip: 'מידע על הדף - לא נראה על המסך' },
            { code: '    <title>האתר שלי</title>', tip: 'הכותרת שמופיעה בטאב הדפדפן' },
            { code: '  </head>', tip: 'סגירת ה-head' },
            { code: '  <body>', tip: 'כל מה שנמצא כאן מופיע על המסך' },
            { code: '    <h1>שלום עולם!</h1>', tip: 'כותרת ראשית - הכי גדולה' },
            { code: '    <p>זו פסקה.</p>', tip: 'פסקת טקסט רגילה' },
            { code: '  </body>', tip: 'סגירת ה-body' },
            { code: '</html>', tip: 'סגירת המסמך כולו' },
          ]
        }
      },
      intermediate: {
        explain: 'HTML5 מגיע עם תגיות סמנטיות שנותנות משמעות לתוכן. &lt;header&gt;, &lt;nav&gt;, &lt;main&gt;, &lt;footer&gt; עוזרות למנועי חיפוש ולנגישות.',
        metaphor: { icon: '🏛️', title: 'HTML5 כמו מפה של בניין', desc: 'כמו שבניין יש לו כניסה, קומות, ויציאת חירום, כך HTML5 מארגן את האתר לאזורים: header (כניסה), nav (מדריך), main (גוף הבניין), footer (מרתף).' },
        code: {
          lang: 'HTML',
          lines: [
            { code: '<header>', tip: 'אזור הכותרת העליונה' },
            { code: '  <nav>', tip: 'תפריט ניווט' },
            { code: '    <a href="/">בית</a>', tip: 'קישור - href הוא היעד' },
            { code: '  </nav>', tip: 'סגירת תפריט' },
            { code: '</header>', tip: 'סגירת header' },
            { code: '<main>', tip: 'התוכן הראשי של הדף' },
            { code: '  <article>', tip: 'מאמר עצמאי - תוכן שלם' },
            { code: '    <h2>כותרת</h2>', tip: 'כותרת משנה' },
            { code: '  </article>', tip: 'סגירת article' },
            { code: '</main>', tip: 'סגירת main' },
          ]
        }
      },
      expert: {
        explain: 'Web Components ו-Custom Elements מאפשרים יצירת תגיות HTML מותאמות אישית עם Shadow DOM לאנקפסולציה.',
        metaphor: { icon: '⚙️', title: 'Web Components כמו IKEA', desc: 'כמו שאיקאה מייצרת רכיבי רהיטים שמתחברים ביחד, Web Components מאפשרים ליצור רכיבי UI לשימוש חוזר.' },
        code: {
          lang: 'HTML + JS',
          lines: [
            { code: 'class MyCard extends HTMLElement {', tip: 'יצירת תגית HTML חדשה בירושה' },
            { code: '  connectedCallback() {', tip: 'נקרא כשהאלמנט מתווסף לדף' },
            { code: '    this.attachShadow({mode:"open"});', tip: 'Shadow DOM - כפסולה מוגנת' },
            { code: '    this.shadowRoot.innerHTML = `', tip: 'HTML פנימי - מבודד מהחוץ' },
            { code: '      <style>:host{color:blue}</style>', tip: 'CSS שחל רק על הרכיב הזה' },
            { code: '      <slot></slot>', tip: 'מקום לתוכן שהמשתמש יכניס' },
            { code: '    `;', tip: 'סגירת template literal' },
            { code: '  }', tip: 'סגירת פונקציה' },
            { code: '}', tip: 'סגירת מחלקה' },
            { code: 'customElements.define("my-card", MyCard);', tip: 'רישום התגית <my-card>' },
          ]
        }
      }
    }
  },
  {
    id: 'css',
    emoji: '🎨',
    title: 'CSS',
    tagline: 'הצבע, הסגנון, היופי של האתר',
    color: '#264de4',
    category: 'frontend',
    tags: ['בסיסי', 'עיצוב'],
    desc: 'CSS הוא השפה שנותנת עיצוב לאתרים - צבעים, גדלים, פונטים ומיקום. בלי CSS, כל האתרים היו נראים אותו דבר.',
    levels: {
      beginner: {
        explain: 'CSS עובד כמו "מכחול" שצובע את האלמנטים. אנחנו בוחרים מה לצבוע (Selector) ואז אומרים איך (Properties).',
        metaphor: { icon: '🖌️', title: 'CSS כמו מכחול וצבעים', desc: 'אם HTML הוא השלד, CSS הוא הבגדים. אתה בוחר איזה אלמנט "לבוש" (h1, p) ואז מגדיר מה ילבש - צבע, גודל, פונט.' },
        code: {
          lang: 'CSS',
          lines: [
            { code: 'h1 {', tip: 'בוחר את כל הכותרות h1 בדף' },
            { code: '  color: #6c63ff;', tip: 'צבע הטקסט - קוד צבע הקסדצימלי' },
            { code: '  font-size: 2rem;', tip: 'גודל פונט - rem = יחסי לגודל בסיסי' },
            { code: '  text-align: center;', tip: 'יישור טקסט למרכז' },
            { code: '}', tip: 'סגירת הגדרות' },
            { code: '.card {', tip: 'בוחר אלמנטים עם class="card"' },
            { code: '  background: white;', tip: 'צבע רקע' },
            { code: '  border-radius: 12px;', tip: 'פינות מעוגלות' },
            { code: '  padding: 20px;', tip: 'מרווח פנימי מכל הצדדים' },
            { code: '}', tip: 'סגירת הגדרות' },
          ]
        }
      },
      intermediate: {
        explain: 'Flexbox ו-Grid הם כלים חזקים לפריסת אלמנטים. Flexbox מסדר בשורה/עמודה, Grid עובד בשתי ממדים.',
        metaphor: { icon: '📐', title: 'Flexbox כמו מדפי סופרמרקט', desc: 'דמיין שאתה מסדר מוצרים במדף. Flexbox נותן לך שליטה מלאה - סדר לפי שורות, מרכז, הפוך סדר, ותוסף רווחים שווים ביניהם.' },
        code: {
          lang: 'CSS',
          lines: [
            { code: '.container {', tip: 'ה"קופסה" שתכיל את האלמנטים' },
            { code: '  display: flex;', tip: 'מפעיל מצב Flexbox' },
            { code: '  justify-content: space-between;', tip: 'מרחק שווה בין אלמנטים' },
            { code: '  align-items: center;', tip: 'ממרכז אנכית' },
            { code: '  gap: 16px;', tip: 'רווח בין כל האלמנטים' },
            { code: '  flex-wrap: wrap;', tip: 'עוטף לשורה חדשה אם אין מקום' },
            { code: '}', tip: 'סגירת container' },
            { code: '.item {', tip: 'כל ילד בתוך ה-container' },
            { code: '  flex: 1;', tip: 'גדל כדי למלא שטח זמין' },
            { code: '}', tip: 'סגירת item' },
          ]
        }
      },
      expert: {
        explain: 'CSS Variables, Custom Properties, ו-Container Queries מאפשרים עיצוב דינמי ואדפטיבי.',
        metaphor: { icon: '🎭', title: 'CSS Variables כמו פלטת צבעים', desc: 'במקום לכתוב #6c63ff בכל מקום, שמרת אותו ב--accent. עכשיו שינוי אחד משנה את כל האתר - כמו לשנות ערכת צבעים שלמה.' },
        code: {
          lang: 'CSS',
          lines: [
            { code: ':root {', tip: 'משתני CSS גלובליים' },
            { code: '  --accent: #6c63ff;', tip: 'צבע ראשי - שנה כאן, משתנה בכל מקום' },
            { code: '  --radius: 12px;', tip: 'עיגול פינות גלובלי' },
            { code: '}', tip: 'סגירת :root' },
            { code: '@container (min-width: 400px) {', tip: 'Container Query - חדש! על בסיס הורה' },
            { code: '  .card { grid-template-columns: 1fr 1fr; }', tip: 'עבור ל-2 עמודות כשיש מקום' },
            { code: '}', tip: 'סגירת Container Query' },
            { code: '.btn {', tip: 'כפתור שמשתמש ב-variables' },
            { code: '  background: var(--accent);', tip: 'שימוש במשתנה CSS' },
            { code: '}', tip: 'סגירת כפתור' },
          ]
        }
      }
    }
  },
  {
    id: 'javascript',
    emoji: '⚡',
    title: 'JavaScript',
    tagline: 'החיים והתנועה באתר',
    color: '#f7df1e',
    category: 'frontend',
    tags: ['בסיסי', 'לוגיקה'],
    desc: 'JavaScript הוא מה שגורם לאתרים "לחיות". כפתורים שעובדים, תוכן שמשתנה, אנימציות - כל זה JavaScript.',
    levels: {
      beginner: {
        explain: 'JavaScript הוא שפת תכנות שרצה ישירות בדפדפן. היא מאפשרת לאתר "להגיב" - לחיצות, הקלדות, ועוד.',
        metaphor: { icon: '🤖', title: 'JavaScript הוא המוח', desc: 'אם HTML הוא השלד ו-CSS הם הבגדים, אז JavaScript הוא המוח. הוא מקבל החלטות, מגיב לפעולות שלך, ומשנה את מה שמוצג.' },
        code: {
          lang: 'JS',
          lines: [
            { code: '// משתנה - כמו קופסה עם שם', tip: 'הערה - לא מתבצעת, רק הסבר' },
            { code: 'let שם = "דביר";', tip: 'let יוצר משתנה שניתן לשנות' },
            { code: 'const גיל = 25;', tip: 'const יוצר ערך שלא ישתנה' },
            { code: '', tip: '' },
            { code: '// פונקציה - כמו מתכון', tip: 'פונקציה היא קבוצת פקודות' },
            { code: 'function ברכה(שם) {', tip: 'הגדרת פונקציה עם פרמטר' },
            { code: '  return "שלום " + שם + "!";', tip: 'return מחזיר תוצאה' },
            { code: '}', tip: 'סגירת הפונקציה' },
            { code: '', tip: '' },
            { code: 'console.log(ברכה("דביר"));', tip: 'הדפסה לקונסול: שלום דביר!' },
          ]
        }
      },
      intermediate: {
        explain: 'Callbacks, Promises ו-async/await הם דרכים לעבוד עם פעולות אסינכרוניות - כמו בקשות רשת.',
        metaphor: { icon: '📬', title: 'Promise כמו מסירת חבילה', desc: 'הזמנת משהו מאמזון? Promise מבטיחה שכשהחבילה תגיע, תטפל בה. async/await נותן לך לכתוב קוד כאילו הכל קורה "בסדר".' },
        code: {
          lang: 'JS',
          lines: [
            { code: 'async function fetchData(url) {', tip: 'async - הפונקציה תחזיר Promise' },
            { code: '  try {', tip: 'נסה - אם יש שגיאה, קפוץ ל-catch' },
            { code: '    const res = await fetch(url);', tip: 'await - חכה לתגובה מהשרת' },
            { code: '    const data = await res.json();', tip: 'המר JSON לאובייקט JS' },
            { code: '    return data;', tip: 'החזר את הנתונים' },
            { code: '  } catch (error) {', tip: 'תפוס שגיאה אם משהו נכשל' },
            { code: '    console.error(error);', tip: 'הדפס שגיאה לאדום בקונסול' },
            { code: '  }', tip: 'סגירת try-catch' },
            { code: '}', tip: 'סגירת פונקציה' },
            { code: 'fetchData("https://api.example.com");', tip: 'קריאה לפונקציה' },
          ]
        }
      },
      expert: {
        explain: 'Closures, Prototype Chain, Event Loop ומנגנוני JavaScript עמוקים שמאחורי הקלעים.',
        metaphor: { icon: '🏭', title: 'Closure כמו מפעל', desc: 'Closure הוא פונקציה שזוכרת את הסביבה שנוצרה בה. כמו עובד שיצא מהמפעל אבל עדיין זוכר כל הסודות שלמד שם.' },
        code: {
          lang: 'JS',
          lines: [
            { code: 'function createCounter() {', tip: 'פונקציה שמחזירה פונקציה' },
            { code: '  let count = 0;', tip: 'משתנה פרטי - בזיכרון ה-Closure' },
            { code: '  return {', tip: 'מחזירה אובייקט עם מתודות' },
            { code: '    increment() { count++; },', tip: 'מוסיפה 1 ל-count (זוכרת אותו!)' },
            { code: '    get() { return count; }', tip: 'מחזירה את הערך הנוכחי' },
            { code: '  };', tip: 'סגירת אובייקט' },
            { code: '}', tip: 'סגירת פונקציה חיצונית' },
            { code: 'const c = createCounter();', tip: 'יוצר counter חדש' },
            { code: 'c.increment(); c.increment();', tip: 'count = 2' },
            { code: 'console.log(c.get()); // 2', tip: 'count חי בזיכרון Closure' },
          ]
        }
      }
    }
  },
  {
    id: 'variables',
    emoji: '📦',
    title: 'משתנים',
    tagline: 'קופסאות לשמירת מידע',
    color: '#22c55e',
    category: 'basics',
    tags: ['בסיסי', 'מושג'],
    desc: 'משתנה הוא כמו קופסה עם שם - שמים בה מידע (מספר, טקסט, רשימה) ואפשר להשתמש בה מאוחר יותר.',
    levels: {
      beginner: {
        explain: 'משתנה הוא שם שמצביע על ערך. כמו פתק דביק שרשמת עליו "מספר הטלפון של אמא" - אתה תמיד יכול לחפש את הפתק ולמצוא את המספר.',
        metaphor: { icon: '📦', title: 'משתנה הוא קופסה', desc: 'דמיין קופסה עם שם. שמת בה "5", אחר כך שלפת ועם "5" חישבת. const = קופסה מוגנת במנעול. let = קופסה פתוחה.' },
        code: {
          lang: 'JS',
          lines: [
            { code: 'let ציון = 95;', tip: 'משתנה שניתן לשנות - like let me change' },
            { code: 'const שם = "רונית";', tip: 'קבוע - לא ניתן לשנות אחרי הגדרה' },
            { code: 'var ישן = "לא מומלץ";', tip: 'var הדרך הישנה - יש לה בעיות' },
            { code: '', tip: '' },
            { code: 'ציון = 98;', tip: 'עדכון ערך - OK! כי השתמשנו ב-let' },
            { code: '// שם = "דוד"; ❌ שגיאה!', tip: 'לא אפשרי - const הוא קבוע' },
            { code: '', tip: '' },
            { code: 'let רשימה = [1, 2, 3, 4];', tip: 'Array - רשימה מסודרת' },
            { code: 'let אובייקט = {גיל: 25};', tip: 'Object - אוסף מידע עם מפתחות' },
            { code: 'console.log(ציון, שם);', tip: 'מדפיס: 98 רונית' },
          ]
        }
      },
      intermediate: {
        explain: 'Scope קובע היכן משתנה זמין. Block scope עם let/const, הבדל מ-var, ו-hoisting.',
        metaphor: { icon: '🏠', title: 'Scope כמו חדרים בבית', desc: 'משתנה שמוגדר בחדר שינה לא נגיש בסלון. let/const מכבדים גבולות, var "חוצה קירות" - לכן הוא מסוכן.' },
        code: {
          lang: 'JS',
          lines: [
            { code: 'let global = "גלובלי";', tip: 'גלובלי - נגיש מכל מקום' },
            { code: 'function example() {', tip: 'פונקציה יוצרת Scope חדש' },
            { code: '  let local = "מקומי";', tip: 'קיים רק בתוך הפונקציה' },
            { code: '  console.log(global); // OK', tip: 'גלובלי נגיש גם מבפנים' },
            { code: '}', tip: 'סגירת פונקציה' },
            { code: '// console.log(local); ❌', tip: 'local לא קיים כאן - שגיאה!' },
            { code: '', tip: '' },
            { code: 'if (true) {', tip: 'Block scope' },
            { code: '  let blockVar = "בלוק";', tip: 'קיים רק בתוך ה-{}' },
            { code: '}', tip: 'blockVar "נהרס" כאן' },
          ]
        }
      },
      expert: {
        explain: 'Destructuring, Spread/Rest, Optional Chaining ו-Nullish Coalescing - תחביר מודרני.',
        metaphor: { icon: '🎁', title: 'Destructuring כמו פתיחת מתנות', desc: 'Destructuring פותח "קופסה" (אובייקט/מערך) ולוקח ממנה רק מה שצריך - כמו לפתוח מזוודה ולהוציא רק את החולצות.' },
        code: {
          lang: 'JS',
          lines: [
            { code: 'const {שם, גיל} = {שם:"דביר", גיל:25};', tip: 'Destructuring - פריסה מאובייקט' },
            { code: 'const [ראשון, שני] = [1, 2, 3];', tip: 'Destructuring מ-Array' },
            { code: '', tip: '' },
            { code: 'const merged = {...obj1, ...obj2};', tip: 'Spread - מיזוג אובייקטים' },
            { code: 'function sum(...nums) {}', tip: 'Rest - כל הפרמטרים כמערך' },
            { code: '', tip: '' },
            { code: 'user?.address?.city', tip: 'Optional Chaining - בטוח אם null' },
            { code: 'name ?? "אורח"', tip: 'Nullish Coalescing - ברירת מחדל' },
          ]
        }
      }
    }
  },
  {
    id: 'functions',
    emoji: '⚙️',
    title: 'פונקציות',
    tagline: 'מכונות שמבצעות משימות',
    color: '#a855f7',
    category: 'basics',
    tags: ['בסיסי', 'לוגיקה'],
    desc: 'פונקציה היא קבוצת פקודות שניתן להפעיל שוב ושוב. כמו מתכון - מגדירים פעם אחת, מבשלים כמה פעמים שרוצים.',
    levels: {
      beginner: {
        explain: 'פונקציה מאפשרת לשמור קוד ולהשתמש בו שוב. במקום לכתוב את אותו קוד 10 פעמים, כותבים פעם אחת ומפעילים 10 פעמים.',
        metaphor: { icon: '🏭', title: 'פונקציה היא מכונה', desc: 'הכנסת חומרי גלם (פרמטרים) → המכונה עובדת → מוציאה מוצר מוגמר (return). כמו מכונת קפה - מכניסים קפה ומים, מוציאים אספרסו.' },
        code: {
          lang: 'JS',
          lines: [
            { code: '// הגדרת פונקציה', tip: 'function מגדיר פונקציה חדשה' },
            { code: 'function חיבור(מספר1, מספר2) {', tip: 'שם הפונקציה + פרמטרים בסוגריים' },
            { code: '  const תוצאה = מספר1 + מספר2;', tip: 'הגוף - מה הפונקציה עושה' },
            { code: '  return תוצאה;', tip: 'return מחזיר את התוצאה' },
            { code: '}', tip: 'סגירת הפונקציה' },
            { code: '', tip: '' },
            { code: 'const x = חיבור(3, 7);', tip: 'קריאה לפונקציה עם ערכים' },
            { code: 'console.log(x); // 10', tip: 'מדפיס 10 - התוצאה שהוחזרה' },
            { code: '', tip: '' },
            { code: 'חיבור(100, 200); // 300', tip: 'שימוש חוזר עם ערכים אחרים' },
          ]
        }
      },
      intermediate: {
        explain: 'Arrow Functions הן תחביר קצר לפונקציות. Higher-Order Functions מקבלות או מחזירות פונקציות.',
        metaphor: { icon: '🎯', title: 'Arrow Function כמו קיצור דרך', desc: 'במקום לכתוב "function" כל פעם, Arrow Function זו מקלדת: x => x * 2. קצר, ברור, ומודרני.' },
        code: {
          lang: 'JS',
          lines: [
            { code: '// Arrow Function', tip: 'תחביר מודרני וקצר' },
            { code: 'const כפול = x => x * 2;', tip: 'פרמטר אחד → גוף ישיר' },
            { code: 'const חיבור = (a, b) => a + b;', tip: 'מספר פרמטרים עם סוגריים' },
            { code: '', tip: '' },
            { code: '// Higher-Order Functions', tip: 'פונקציות שמקבלות פונקציות' },
            { code: '[1,2,3,4,5].filter(x => x > 2)', tip: 'filter - מסנן לפי תנאי: [3,4,5]' },
            { code: '[1,2,3].map(x => x * 2)', tip: 'map - ממיר כל ערך: [2,4,6]' },
            { code: '[1,2,3].reduce((s,x) => s+x, 0)', tip: 'reduce - מקמץ לערך אחד: 6' },
          ]
        }
      },
      expert: {
        explain: 'Currying, Composition, Memoization - תכנות פונקציונלי מתקדם.',
        metaphor: { icon: '🔗', title: 'Composition כמו שרשרת', desc: 'compose(f, g)(x) = f(g(x)). כמו שרשרת מפעלים - כל מפעל מקבל את הפלט של הקודם ומוסיף לו משהו.' },
        code: {
          lang: 'JS',
          lines: [
            { code: '// Currying', tip: 'פונקציה שמחזירה פונקציות' },
            { code: 'const add = a => b => a + b;', tip: 'add מחכה לפרמטר נוסף' },
            { code: 'const add5 = add(5);', tip: 'יוצרת פונקציה שמוסיפה 5' },
            { code: 'add5(3); // 8', tip: 'מחשבת 5+3' },
            { code: '', tip: '' },
            { code: '// Memoization', tip: 'שמירת תוצאות לחיסכון בחישוב' },
            { code: 'const memo = {};', tip: 'cache - מטמון תוצאות' },
            { code: 'function fib(n) {', tip: 'פיבונאצ\'י עם memoization' },
            { code: '  if (memo[n]) return memo[n];', tip: 'אם חישבנו כבר, החזר מהcache' },
            { code: '  return memo[n] = fib(n-1)+fib(n-2);', tip: 'חשב ושמור לעתיד' },
          ]
        }
      }
    }
  },
  {
    id: 'loops',
    emoji: '🔄',
    title: 'לולאות',
    tagline: 'חזרה על פעולות אוטומטית',
    color: '#f59e0b',
    category: 'basics',
    tags: ['בסיסי', 'לוגיקה'],
    desc: 'לולאה מאפשרת לבצע פעולה שוב ושוב. במקום לכתוב console.log 100 פעמים, כותבים לולאה אחת.',
    levels: {
      beginner: {
        explain: 'לולאה היא הוראה "עשה את זה X פעמים" או "כל עוד תנאי מתקיים". שימוש בלולאות חוסך כתיבה רבה.',
        metaphor: { icon: '🎠', title: 'לולאה כמו קרוסלה', desc: 'קרוסלה מסתובבת שוב ושוב עד שמישהו עוצר אותה. לולאה עושה אותו דבר - מבצעת קוד שוב ושוב עד שתנאי הפסקה מתקיים.' },
        code: {
          lang: 'JS',
          lines: [
            { code: '// לולאת for - מספר ידוע של פעמים', tip: 'for - הנפוצה ביותר' },
            { code: 'for (let i = 0; i < 5; i++) {', tip: 'i מתחיל ב-0, רץ כל עוד < 5' },
            { code: '  console.log("איטרציה", i);', tip: 'מדפיס: איטרציה 0, 1, 2, 3, 4' },
            { code: '}', tip: 'סגירת לולאה' },
            { code: '', tip: '' },
            { code: '// לולאה על מערך', tip: 'for...of - נוח למערכים' },
            { code: 'const פירות = ["תפוח", "בנה", "ענב"];', tip: 'מערך של פירות' },
            { code: 'for (const פרי of פירות) {', tip: 'עוברים על כל פריט' },
            { code: '  console.log(פרי);', tip: 'מדפיס כל פרי בתורו' },
            { code: '}', tip: 'סגירת לולאה' },
          ]
        }
      },
      intermediate: {
        explain: 'forEach, map, filter, reduce הן "לולאות פונקציונליות" - נוחות יותר לעבודה עם מערכים.',
        metaphor: { icon: '🏭', title: 'פס ייצור', desc: 'map, filter, reduce הן תחנות בפס ייצור. map = שינוי, filter = סינון, reduce = ריכוז. הן לא משנות את המקור.' },
        code: {
          lang: 'JS',
          lines: [
            { code: 'const מספרים = [1, 2, 3, 4, 5, 6];', tip: 'מערך מקורי' },
            { code: '', tip: '' },
            { code: '// map - ממיר כל ערך', tip: 'יוצר מערך חדש' },
            { code: 'const כפולים = מספרים.map(n => n * 2);', tip: '[2,4,6,8,10,12]' },
            { code: '', tip: '' },
            { code: '// filter - מסנן לפי תנאי', tip: 'מחזיר רק מה שעובר' },
            { code: 'const זוגיים = מספרים.filter(n => n%2===0);', tip: '[2,4,6]' },
            { code: '', tip: '' },
            { code: '// reduce - מצמצם לערך אחד', tip: 'מחשב סכום, מקסימום, ועוד' },
            { code: 'const סכום = מספרים.reduce((s,n) => s+n, 0);', tip: '21' },
          ]
        }
      },
      expert: {
        explain: 'Generators, Iterators, ו-Lazy Evaluation לעבודה עם נתונים אינסופיים.',
        metaphor: { icon: '🚰', title: 'Generator כמו ברז', desc: 'Generator לא מייצר את כל המים מראש, הוא מוציא לפי בקשה. מושלם כשיש נתונים ענקיים - yield נותן ערך אחד בכל פעם.' },
        code: {
          lang: 'JS',
          lines: [
            { code: 'function* numbers() {', tip: 'Generator - הכוכבית * אחרי function' },
            { code: '  let i = 0;', tip: 'מונה שמתחיל מ-0' },
            { code: '  while (true) {', tip: 'לולאה אינסופית!' },
            { code: '    yield i++;', tip: 'yield - תן ערך, עצור, המשך בבקשה הבאה' },
            { code: '  }', tip: 'המשך הלולאה בבקשה הבאה' },
            { code: '}', tip: 'סגירת Generator' },
            { code: 'const gen = numbers();', tip: 'יוצר iterator' },
            { code: 'gen.next().value; // 0', tip: 'מחזיר 0 ועוצר' },
            { code: 'gen.next().value; // 1', tip: 'ממשיך ומחזיר 1' },
          ]
        }
      }
    }
  },
  {
    id: 'github',
    emoji: '🐙',
    title: 'GitHub',
    tagline: 'שמירת ושיתוף קוד בענן',
    color: '#171515',
    category: 'tools',
    tags: ['כלים', 'שיתוף פעולה'],
    desc: 'GitHub הוא כמו Google Drive לקוד - שם מאחסנים, מגבים, ומשתפים קוד. כל מתכנת בעולם משתמש בו.',
    levels: {
      beginner: {
        explain: 'Git הוא מערכת לניהול גרסאות קוד. GitHub הוא אתר שבו שומרים את הקוד ברשת. ביחד הם מאפשרים שיתוף פעולה ותיעוד שינויים.',
        metaphor: { icon: '📸', title: 'Git כמו היסטוריית תמונות', desc: 'כל commit הוא כמו צילום של הפרויקט ברגע מסוים. אפשר תמיד לחזור לתמונה ישנה אם משהו השתבש - כמו backup שמבין מה השתנה.' },
        code: {
          lang: 'Terminal',
          lines: [
            { code: 'git init', tip: 'יוצר repository חדש בתיקייה' },
            { code: 'git add .', tip: 'מסמן את כל הקבצים לשמירה' },
            { code: 'git commit -m "הוספתי כפתור"', tip: 'שומר snapshot עם הודעה תיאורית' },
            { code: 'git push origin main', tip: 'שולח לGitHub (הענן)' },
            { code: '', tip: '' },
            { code: 'git clone https://github.com/user/repo', tip: 'מוריד פרויקט מGitHub' },
            { code: 'git pull', tip: 'מושך שינויים חדשים מהענן' },
            { code: 'git branch feature/כפתור', tip: 'ענף חדש לפיתוח במקביל' },
            { code: 'git checkout feature/כפתור', tip: 'עובר לענף' },
            { code: 'git merge main', tip: 'ממזג שינויים מ-main לענף הנוכחי' },
          ]
        }
      },
      intermediate: {
        explain: 'Branching, Pull Requests, Merge Conflicts - עבודת צוות עם Git.',
        metaphor: { icon: '🌿', title: 'Branch כמו ענפי עץ', desc: 'הקוד הראשי הוא הגזע. כל feature הוא ענף. כשגמרת, מחברים את הענף חזרה לגזע. כך כמה מפתחים יכולים לעבוד במקביל.' },
        code: {
          lang: 'Terminal',
          lines: [
            { code: 'git checkout -b feature/login', tip: 'יוצר ועובר לענף חדש בבת אחת' },
            { code: '# ... כתיבת קוד ...', tip: 'כותבים את הפיצ\'ר' },
            { code: 'git add src/login.js', tip: 'מסמן קובץ ספציפי' },
            { code: 'git commit -m "feat: add login form"', tip: 'Conventional Commits - פורמט מקצועי' },
            { code: 'git push origin feature/login', tip: 'שולח הענף לGitHub' },
            { code: '# פותח Pull Request ב-GitHub', tip: 'מבקש ממישהו לבדוק את הקוד' },
            { code: 'git checkout main', tip: 'חוזר ל-main' },
            { code: 'git merge feature/login', tip: 'מיזוג אחרי אישור ה-PR' },
            { code: 'git branch -d feature/login', tip: 'מוחק ענף שכבר מוזג' },
          ]
        }
      },
      expert: {
        explain: 'GitHub Actions, CI/CD, GitHub Pages - אוטומציה ופריסה.',
        metaphor: { icon: '🤖', title: 'GitHub Actions כמו עוזר אוטומטי', desc: 'כל פעם שמישהו דוחף קוד, Actions מריץ בדיקות ואם הכל תקין - פורס אוטומטית לאתר. בלי לגעת בדבר.' },
        code: {
          lang: 'YAML',
          lines: [
            { code: 'name: Deploy to GitHub Pages', tip: 'שם ה-workflow' },
            { code: 'on:', tip: 'מתי להפעיל' },
            { code: '  push:', tip: 'כשדוחפים קוד' },
            { code: '    branches: [main]', tip: 'רק לענף main' },
            { code: 'jobs:', tip: 'משימות לביצוע' },
            { code: '  build:', tip: 'שם המשימה' },
            { code: '    runs-on: ubuntu-latest', tip: 'סוג המכונה הווירטואלית' },
            { code: '    steps:', tip: 'שלבים' },
            { code: '      - uses: actions/checkout@v3', tip: 'מוריד את הקוד' },
            { code: '      - run: npm run build', tip: 'בונה את הפרויקט' },
          ]
        }
      }
    }
  },
  {
    id: 'api',
    emoji: '🌉',
    title: 'API',
    tagline: 'הגשר בין מערכות',
    color: '#06b6d4',
    category: 'backend',
    tags: ['שרתים', 'חיבורים'],
    desc: 'API הוא "חוזה" בין תוכניות. כמו מלצר במסעדה - אתה מזמין (request), הוא לוקח למטבח (server) ומביא אוכל (response).',
    levels: {
      beginner: {
        explain: 'API מאפשר לאפליקציות לדבר זו עם זו. כשאתה רואה מפה בתוך אפליקציה - האפליקציה השתמשה ב-API של Google Maps.',
        metaphor: { icon: '🌉', title: 'API כמו גשר', desc: 'שני עולמות (שתי תוכניות) לא יכולים להגיע אחד לשני בלי גשר. ה-API הוא הגשר - עם חוקים ברורים מה מותר לעבור ואיך.' },
        code: {
          lang: 'JS',
          lines: [
            { code: '// שאילת API - כמו הזמנה במסעדה', tip: 'fetch שולח בקשה לשרת' },
            { code: 'fetch("https://api.openweathermap.org/weather")', tip: 'URL של ה-API endpoint' },
            { code: '  .then(response => response.json())', tip: 'המר תגובה ל-JSON' },
            { code: '  .then(data => {', tip: 'עכשיו יש לנו את הנתונים' },
            { code: '    console.log(data.main.temp);', tip: 'טמפרטורה מהנתונים' },
            { code: '    console.log(data.weather[0].description);', tip: 'תיאור מזג אוויר' },
            { code: '  })', tip: 'סגירת then' },
            { code: '  .catch(error => {', tip: 'תפוס שגיאות רשת' },
            { code: '    console.error("שגיאה:", error);', tip: 'הצג שגיאה' },
            { code: '  });', tip: 'סגירת catch' },
          ]
        }
      },
      intermediate: {
        explain: 'REST API, HTTP Methods (GET/POST/PUT/DELETE), Headers, Authentication.',
        metaphor: { icon: '📬', title: 'HTTP Methods כמו פעולות דואר', desc: 'GET = קח מסמך, POST = שלח מסמך, PUT = החלף מסמך, DELETE = מחק מסמך. כמו שיש פעולות שונות בדואר.' },
        code: {
          lang: 'JS',
          lines: [
            { code: '// POST request - שליחת נתונים', tip: 'POST יוצר נתון חדש בשרת' },
            { code: 'await fetch("/api/users", {', tip: 'שולח לnodejs של השרת' },
            { code: '  method: "POST",', tip: 'HTTP method' },
            { code: '  headers: {', tip: 'מידע על הבקשה' },
            { code: '    "Content-Type": "application/json",', tip: 'שולחים JSON' },
            { code: '    "Authorization": "Bearer " + token', tip: 'מפתח API לאימות' },
            { code: '  },', tip: 'סגירת headers' },
            { code: '  body: JSON.stringify({', tip: 'הגוף - הנתונים שנשלחים' },
            { code: '    name: "דביר", email: "dvir@ex.com"', tip: 'פרטי המשתמש החדש' },
            { code: '  })', tip: 'סגירת body' },
          ]
        }
      },
      expert: {
        explain: 'GraphQL, WebSockets, Rate Limiting, API Design Patterns.',
        metaphor: { icon: '🔌', title: 'WebSocket כמו טלפון פתוח', desc: 'REST API כמו SMS - שולח, מחכה לתגובה, נגמר. WebSocket כמו שיחת טלפון - קו פתוח, שני הצדדים מדברים בזמן אמת.' },
        code: {
          lang: 'JS',
          lines: [
            { code: '// WebSocket - חיבור בזמן אמת', tip: 'כמו טלפון תמידי עם השרת' },
            { code: 'const ws = new WebSocket("wss://api.example.com");', tip: 'פתיחת חיבור WebSocket' },
            { code: 'ws.onopen = () => {', tip: 'כשהחיבור נפתח' },
            { code: '  ws.send(JSON.stringify({type:"join"}));', tip: 'שולח הודעת הצטרפות' },
            { code: '};', tip: 'סגירת onopen' },
            { code: 'ws.onmessage = (event) => {', tip: 'כשמגיעה הודעה מהשרת' },
            { code: '  const msg = JSON.parse(event.data);', tip: 'פיענוח הHודעה' },
            { code: '  updateUI(msg);', tip: 'עדכון הממשק בזמן אמת' },
            { code: '};', tip: 'סגירת onmessage' },
          ]
        }
      }
    }
  },
  {
    id: 'ai',
    emoji: '🤖',
    title: 'בינה מלאכותית',
    tagline: 'מכונות שלומדות ומבינות',
    color: '#8b5cf6',
    category: 'advanced',
    tags: ['מתקדם', 'עתיד'],
    desc: 'AI הוא שם כולל לטכנולוגיות שמאפשרות למחשבים ללמוד, להבין ולפתור בעיות בעצמם. ChatGPT, סינון ספאם, המלצות - הכל AI.',
    levels: {
      beginner: {
        explain: 'AI לומד מדוגמאות, כמו ילד שרואה 1000 כלבים ולומד מה זה כלב. Machine Learning הוא כאשר המחשב לומד בעצמו ולא רק מבצע הוראות שכתבנו.',
        metaphor: { icon: '🧠', title: 'AI כמו מוח שמתאמן', desc: 'בכל פעם שה-AI טועה, הוא "מעניש" את עצמו ומתקן. אחרי מיליוני תיקונים, הוא לומד לעשות דברים נפלאים. כמו אימון ספורטאי.' },
        code: {
          lang: 'JS',
          lines: [
            { code: '// שימוש ב-Claude API', tip: 'API של Anthropic ל-AI' },
            { code: 'const response = await fetch(', tip: 'שולח בקשה ל-API של Claude' },
            { code: '  "https://api.anthropic.com/v1/messages",', tip: 'כתובת ה-API' },
            { code: '  {', tip: 'הגדרות הבקשה' },
            { code: '    method: "POST",', tip: 'שיטת HTTP' },
            { code: '    headers: { "x-api-key": API_KEY },', tip: 'מפתח API לאימות' },
            { code: '    body: JSON.stringify({', tip: 'גוף הבקשה' },
            { code: '      model: "claude-opus-4-5",', tip: 'המודל שנרצה להשתמש' },
            { code: '      messages: [{role:"user",', tip: 'ההודעה שלנו' },
            { code: '        content: "הסבר AI בפשטות"}]', tip: 'מה שאנחנו שואלים' },
          ]
        }
      },
      intermediate: {
        explain: 'Neural Networks, Training Data, Fine-tuning, Embeddings, Vector Databases.',
        metaphor: { icon: '🕸️', title: 'Neural Network כמו רשת עצבים', desc: 'בדיוק כמו שהמוח שלנו מורכב מנוירונים שמתקשרים, Neural Network מורכבת מ"נוירונים דיגיטליים" שמעבירים אותות ולומדים מהניסיון.' },
        code: {
          lang: 'Python',
          lines: [
            { code: 'import tensorflow as tf', tip: 'ספריית ML של Google' },
            { code: '', tip: '' },
            { code: 'model = tf.keras.Sequential([', tip: 'שכבות הרשת העצבית' },
            { code: '  tf.keras.layers.Dense(128, activation="relu"),', tip: '128 נוירונים, ReLU activation' },
            { code: '  tf.keras.layers.Dropout(0.2),', tip: 'Dropout - מונע overfitting' },
            { code: '  tf.keras.layers.Dense(10, activation="softmax")', tip: '10 קטגוריות פלט' },
            { code: '])', tip: 'סגירת Sequential' },
            { code: '', tip: '' },
            { code: 'model.compile(optimizer="adam",', tip: 'Adam - אלגוריתם אופטימיזציה' },
            { code: '              loss="sparse_categorical_crossentropy")', tip: 'פונקציית אובדן לסיווג' },
          ]
        }
      },
      expert: {
        explain: 'Transformer Architecture, Attention Mechanism, RAG, LangChain, Agents.',
        metaphor: { icon: '🌍', title: 'Attention כמו מיקוד', desc: 'כשאתה קורא משפט, אתה מתמקד במילים חשובות. Attention Mechanism עושה אותו דבר - "מסתכל" על כל המילים ומחליט על מה להתמקד.' },
        code: {
          lang: 'Python',
          lines: [
            { code: 'from langchain import LLMChain, PromptTemplate', tip: 'LangChain - Framework ל-AI apps' },
            { code: '', tip: '' },
            { code: 'template = """', tip: 'תבנית prompt' },
            { code: 'ענה בעברית: {question}', tip: 'placeholder לשאלה' },
            { code: '"""', tip: 'סגירת template' },
            { code: 'prompt = PromptTemplate(', tip: 'יצירת prompt מובנה' },
            { code: '  input_variables=["question"],', tip: 'משתנים דינמיים' },
            { code: '  template=template', tip: 'התבנית שיצרנו' },
            { code: ')', tip: 'סגירת PromptTemplate' },
            { code: 'chain = LLMChain(llm=llm, prompt=prompt)', tip: 'שרשרת LLM + Prompt' },
          ]
        }
      }
    }
  },
  {
    id: 'pwa',
    emoji: '📱',
    title: 'PWA',
    tagline: 'אתר שמתנהג כמו אפליקציה',
    color: '#ec4899',
    category: 'advanced',
    tags: ['מתקדם', 'מובייל'],
    desc: 'PWA (Progressive Web App) הוא אתר אינטרנט שניתן להתקין כמו אפליקציה, עובד אופליין, ומרגיש כמו app ממשי.',
    levels: {
      beginner: {
        explain: 'PWA הוא כמו "אתר בתחפושת של אפליקציה". מוסיפים כמה קבצים מיוחדים לאתר רגיל, ובום - אפשר להתקין אותו, לפתוח בלי עניין, ולעבוד אפילו ללא אינטרנט.',
        metaphor: { icon: '🦋', title: 'PWA - גולם לפרפר', desc: 'אתר רגיל הוא כמו גולם - שימושי אבל מוגבל. PWA הוא הפרפר - אותו בסיס, אבל עם יכולות הרבה יותר חזקות: אופליין, התקנה, וגישה לחומרה.' },
        code: {
          lang: 'JSON',
          lines: [
            { code: '{', tip: 'קובץ manifest.json' },
            { code: '  "name": "האפליקציה שלי",', tip: 'שם מלא' },
            { code: '  "short_name": "האפ שלי",', tip: 'שם קצר לאייקון' },
            { code: '  "start_url": "/",', tip: 'דף הבית שייפתח' },
            { code: '  "display": "standalone",', tip: 'ללא כתובת URL - כמו app' },
            { code: '  "theme_color": "#6c63ff",', tip: 'צבע סרגל הכתובות' },
            { code: '  "background_color": "#0a0e1a",', tip: 'צבע ב-splash screen' },
            { code: '  "icons": [...]', tip: 'אייקונים בגדלים שונים' },
            { code: '}', tip: 'סגירת manifest' },
          ]
        }
      },
      intermediate: {
        explain: 'Service Worker הוא "שכבת ביניים" בין הדפדפן לאינטרנט. הוא יכול לשמור תוכן במטמון לשימוש אופליין.',
        metaphor: { icon: '🔄', title: 'Service Worker כמו עוזר אישי', desc: 'כל בקשה לאינטרנט עוברת דרך ה-Service Worker. הוא יכול לענות מהמטמון (מהיר!), לשלוח לרשת, או לשלב. כמו עוזר שיודע מה לעשות גם כשהבוס לא זמין.' },
        code: {
          lang: 'JS',
          lines: [
            { code: 'self.addEventListener("install", e => {', tip: 'Service Worker מותקן' },
            { code: '  e.waitUntil(', tip: 'חכה עד שהפעולה תסתיים' },
            { code: '    caches.open("app-v1")', tip: 'פתח/צור מטמון' },
            { code: '      .then(c => c.addAll([', tip: 'הוסף קבצים למטמון' },
            { code: '        "/", "/style.css"', tip: 'קבצים לשמירה אופליין' },
            { code: '      ]))', tip: 'סגירת addAll' },
            { code: '  );', tip: 'סגירת waitUntil' },
            { code: '});', tip: 'סגירת addEventListener' },
            { code: 'self.addEventListener("fetch", e => {', tip: 'כל בקשת רשת עוברת כאן' },
            { code: '  e.respondWith(caches.match(e.request));', tip: 'ענה מהמטמון אם אפשר' },
          ]
        }
      },
      expert: {
        explain: 'Background Sync, Push Notifications, Web Share API, Hardware Access.',
        metaphor: { icon: '🚀', title: 'PWA Advanced - יכולות מלאות', desc: 'PWA מתקדם ניגש לאקסלרומטר, מצלמה, Bluetooth, GPS ושולח Push Notifications - בדיוק כמו Native App, אבל בדפדפן.' },
        code: {
          lang: 'JS',
          lines: [
            { code: '// Background Sync', tip: 'שלח נתונים כשחזרת אונליין' },
            { code: 'navigator.serviceWorker.ready.then(sw => {', tip: 'SW מוכן' },
            { code: '  sw.sync.register("sync-data");', tip: 'רשום sync event' },
            { code: '});', tip: 'סגירת then' },
            { code: '', tip: '' },
            { code: '// Push Notifications', tip: 'שלח התראות למשתמש' },
            { code: 'const perm = await Notification.requestPermission();', tip: 'בקש רשות מהמשתמש' },
            { code: 'if (perm === "granted") {', tip: 'אם קיבלנו רשות' },
            { code: '  new Notification("שלום!", {', tip: 'צור התראה' },
            { code: '    body: "יש לך עדכון חדש"', tip: 'תוכן ההתראה' },
          ]
        }
      }
    }
  },
  {
    id: 'servers',
    emoji: '🖥️',
    title: 'שרתים',
    tagline: 'המחשבים שמאחורי הקלעים',
    color: '#10b981',
    category: 'backend',
    tags: ['שרתים', 'Backend'],
    desc: 'שרת הוא מחשב שרץ 24/7 ועונה לבקשות. כשאתה פותח אתר, הדפדפן שלך "מבקש" תוכן מהשרת.',
    levels: {
      beginner: {
        explain: 'שרת הוא מחשב שמחכה לבקשות ועונה עליהן. כשאתה גולש באתר, הדפדפן שלך שולח בקשה לשרת, והשרת מחזיר את הדף.',
        metaphor: { icon: '🏪', title: 'שרת כמו חנות', desc: 'חנות פתוחה 24/7 ומחכה ללקוחות. כשאתה (הלקוח/Client) נכנס ומבקש משהו (Request), החנות (Server) מוצאת ומחזירה לך (Response).' },
        code: {
          lang: 'JS',
          lines: [
            { code: 'const express = require("express");', tip: 'Express - פריימוורק שרת Node.js' },
            { code: 'const app = express();', tip: 'יוצר מופע חדש של השרת' },
            { code: '', tip: '' },
            { code: 'app.get("/hello", (req, res) => {', tip: 'מגדיר endpoint - /hello' },
            { code: '  res.json({ message: "שלום!" });', tip: 'מחזיר JSON ללקוח' },
            { code: '});', tip: 'סגירת endpoint' },
            { code: '', tip: '' },
            { code: 'app.listen(3000, () => {', tip: 'מפעיל שרת על פורט 3000' },
            { code: '  console.log("שרת פועל!");', tip: 'מדפיס כשהשרת עלה' },
            { code: '});', tip: 'סגירת listen' },
          ]
        }
      },
      intermediate: {
        explain: 'REST Endpoints, Middleware, Database connections, Authentication.',
        metaphor: { icon: '🏭', title: 'Middleware כמו עמדות בקרה', desc: 'כמו שבנמל תעופה יש כמה עמדות ביטחון לפני שמגיעים למטוס, כל בקשה לשרת עוברת דרך Middleware: בדיקת Token, לוגים, הרשאות.' },
        code: {
          lang: 'JS',
          lines: [
            { code: '// Middleware - כל בקשה עוברת כאן', tip: 'app.use מגדיר middleware גלובלי' },
            { code: 'app.use(express.json());', tip: 'Parse JSON אוטומטית' },
            { code: 'app.use((req, res, next) => {', tip: 'Middleware מותאם אישית' },
            { code: '  console.log(req.method, req.url);', tip: 'לוג כל בקשה' },
            { code: '  next();', tip: 'עבור ל-middleware הבא' },
            { code: '});', tip: 'סגירת middleware' },
            { code: '', tip: '' },
            { code: '// Protected route', tip: 'endpoint עם הרשאות' },
            { code: 'app.get("/admin", authMiddleware, handler)', tip: 'authMiddleware בודק Token' },
          ]
        }
      },
      expert: {
        explain: 'Microservices, Docker, Kubernetes, Load Balancing, CDN.',
        metaphor: { icon: '🏙️', title: 'Microservices כמו עיר', desc: 'במקום בניין אחד ענק (Monolith), יש הרבה בניינים קטנים ועצמאיים (Microservices). כל בניין אחראי על דבר אחד ויכול לגדול בנפרד.' },
        code: {
          lang: 'YAML',
          lines: [
            { code: '# Docker Compose - מספר שרתים', tip: 'מגדיר כמה שרתים יחד' },
            { code: 'services:', tip: 'רשימת השירותים' },
            { code: '  api:', tip: 'שרת ה-API' },
            { code: '    image: node:18', tip: 'Docker image' },
            { code: '    ports: ["3000:3000"]', tip: 'חשוף פורט' },
            { code: '  database:', tip: 'שרת מסד נתונים' },
            { code: '    image: postgres:15', tip: 'PostgreSQL Docker image' },
            { code: '    environment:', tip: 'משתני סביבה' },
            { code: '      POSTGRES_PASSWORD: secret', tip: 'סיסמת DB' },
          ]
        }
      }
    }
  },
  {
    id: 'git-versions',
    emoji: '🔀',
    title: 'ניהול גרסאות',
    tagline: 'מכונת הזמן של הקוד',
    color: '#f97316',
    category: 'tools',
    tags: ['כלים', 'Git'],
    desc: 'ניהול גרסאות מאפשר לך לשמור "snapshot" של הקוד ולחזור לאחור בזמן. כמו undo/redo אבל לפרויקט שלם.',
    levels: {
      beginner: {
        explain: 'ניהול גרסאות זה כמו לשמור את המשחק כל כמה שלבים. אם נכנסת לצרה, אפשר לטעון את השמירה האחרונה.',
        metaphor: { icon: '⏰', title: 'Git כמו מכונת זמן', desc: 'בכל commit אתה "מצלם" את כל הפרויקט. אם שברת משהו, git checkout [תאריך] ואתה חוזר בזמן לרגע שהכל עבד.' },
        code: {
          lang: 'Terminal',
          lines: [
            { code: 'git log --oneline', tip: 'ראה את כל ה-commits בקיצור' },
            { code: 'git diff', tip: 'ראה מה השתנה מאז הcommit האחרון' },
            { code: 'git status', tip: 'ראה אילו קבצים שונו' },
            { code: '', tip: '' },
            { code: '# חזרה לcommit ספציפי', tip: '' },
            { code: 'git checkout abc123', tip: 'abc123 = hash של commit' },
            { code: '', tip: '' },
            { code: '# ביטול שינויים', tip: '' },
            { code: 'git revert HEAD', tip: 'מבטל את הcommit האחרון בבטחה' },
            { code: 'git reset --hard HEAD~1', tip: 'מוחק commit (זהירות!)' },
          ]
        }
      },
      intermediate: {
        explain: 'Git Flow, Semantic Versioning, Tags, Changelogs.',
        metaphor: { icon: '🚦', title: 'Git Flow כמו רמזור', desc: 'main = ירוק (production), develop = כתום (staging), feature = אדום (עבודה). כל שינוי עובר את כל הצבעים לפני שיוצא לציבור.' },
        code: {
          lang: 'Terminal',
          lines: [
            { code: '# Semantic Versioning: MAJOR.MINOR.PATCH', tip: '1.2.3 = גדול.בינוני.תיקון' },
            { code: 'git tag -a v1.0.0 -m "גרסה ראשונה"', tip: 'סימון גרסה' },
            { code: 'git push origin v1.0.0', tip: 'פרסום גרסה ב-GitHub' },
            { code: '', tip: '' },
            { code: '# Git Flow', tip: 'מתודולוגיה לעבודת צוות' },
            { code: 'git flow init', tip: 'מאתחל Git Flow' },
            { code: 'git flow feature start login', tip: 'מתחיל feature חדש' },
            { code: 'git flow feature finish login', tip: 'מסיים feature' },
            { code: 'git flow release start 1.0.0', tip: 'מתחיל תהליך release' },
          ]
        }
      },
      expert: {
        explain: 'Monorepo, Git Hooks, Conventional Commits, Automated Changelogs.',
        metaphor: { icon: '🏗️', title: 'Monorepo כמו בניין משרדים', desc: 'במקום building נפרד לכל צוות (Multi-repo), כולם בבניין אחד ענק (Monorepo). חלוקת קוד קל יותר, אבל ניהול מורכב יותר.' },
        code: {
          lang: 'JS',
          lines: [
            { code: '// Git Hook - pre-commit', tip: 'קוד שרץ לפני כל commit' },
            { code: '// .git/hooks/pre-commit', tip: 'קובץ ה-hook' },
            { code: '#!/bin/bash', tip: 'Bash script' },
            { code: 'npm run lint', tip: 'בדוק קוד לפני commit' },
            { code: 'if [ $? -ne 0 ]; then', tip: 'אם linting נכשל' },
            { code: '  echo "❌ Fix lint errors first!"', tip: 'הדפס הודעת שגיאה' },
            { code: '  exit 1', tip: 'בטל את ה-commit' },
            { code: 'fi', tip: 'סגירת if' },
            { code: 'npm test', tip: 'הרץ בדיקות' },
          ]
        }
      }
    }
  },
  {
    id: 'deploy',
    emoji: '🚀',
    title: 'פרסום אפליקציות',
    tagline: 'מהמחשב לאינטרנט',
    color: '#3b82f6',
    category: 'tools',
    tags: ['פרסום', 'ענן'],
    desc: 'פרסום (Deployment) הוא התהליך של העלאת האתר/אפליקציה שלך לאינטרנט כך שכולם יוכלו לגשת אליה.',
    levels: {
      beginner: {
        explain: 'פרסום אתר זה כמו לפתוח חנות - אתה צריך כתובת (דומיין) ומקום לשים את הסחורה (שרת/hosting). ב-2025 זה פשוט מאי פעם.',
        metaphor: { icon: '🏪', title: 'פרסום כמו פתיחת חנות', desc: 'מחשב שלך = מחסן. הענן = חנות שפתוחה לציבור. העלאה לענן = העברת הסחורה מהמחסן לחנות.' },
        code: {
          lang: 'Terminal',
          lines: [
            { code: '# GitHub Pages - בחינם!', tip: 'לאתרים סטטיים' },
            { code: 'git push origin main', tip: 'דחיפה ל-GitHub' },
            { code: '# בGitHub: Settings → Pages → main', tip: 'הפעלה בממשק' },
            { code: '', tip: '' },
            { code: '# Vercel - הכי קל לReact/Next', tip: 'פריסה אוטומטית' },
            { code: 'npm i -g vercel', tip: 'התקנת CLI' },
            { code: 'vercel', tip: 'פרסם! שואל שאלות אחרי' },
            { code: '', tip: '' },
            { code: '# Netlify', tip: 'אלטרנטיבה מצוינת' },
            { code: 'netlify deploy --prod', tip: 'פרסום לייב' },
          ]
        }
      },
      intermediate: {
        explain: 'CI/CD Pipelines, Environment Variables, Domain Setup, SSL/HTTPS.',
        metaphor: { icon: '🔄', title: 'CI/CD כמו פס ייצור', desc: 'בכל push לקוד, Pipeline אוטומטי: בונה → בודק → פורס. ללא מגע יד אדם. כמו מפעל אוטומטי שמייצר ומשלח לחנות.' },
        code: {
          lang: 'YAML',
          lines: [
            { code: 'name: CI/CD Pipeline', tip: 'GitHub Actions workflow' },
            { code: 'on: push', tip: 'מופעל בכל push' },
            { code: 'jobs:', tip: 'רשימת פעולות' },
            { code: '  deploy:', tip: 'שם הפעולה' },
            { code: '    steps:', tip: 'שלבים לביצוע' },
            { code: '      - run: npm install', tip: 'התקנת תלויות' },
            { code: '      - run: npm test', tip: 'הרצת בדיקות' },
            { code: '      - run: npm run build', tip: 'בנייה לproduction' },
            { code: '      - uses: vercel-deploy', tip: 'פרסום ב-Vercel' },
          ]
        }
      },
      expert: {
        explain: 'Kubernetes, Docker Swarm, Blue-Green Deployments, Zero Downtime.',
        metaphor: { icon: '⚡', title: 'Blue-Green כמו מתג חשמל', desc: 'יש לך שתי סביבות: Blue (live) ו-Green (חדש). מכין את Green עם הגרסה החדשה, ואז מעביר את התנועה ב-click. אם יש בעיה - חזרה ל-Blue מיד.' },
        code: {
          lang: 'YAML',
          lines: [
            { code: 'apiVersion: apps/v1', tip: 'Kubernetes Deployment' },
            { code: 'kind: Deployment', tip: 'סוג המשאב' },
            { code: 'spec:', tip: 'הגדרות' },
            { code: '  replicas: 3', tip: '3 עותקים לביצועים ו-HA' },
            { code: '  strategy:', tip: 'אסטרטגיית פריסה' },
            { code: '    type: RollingUpdate', tip: 'עדכון הדרגתי - ללא downtime' },
            { code: '    rollingUpdate:', tip: 'הגדרות rolling update' },
            { code: '      maxUnavailable: 0', tip: 'אף pod לא ייכבה לפני שחדש מוכן' },
            { code: '      maxSurge: 1', tip: 'רק pod אחד נוסף בכל פעם' },
          ]
        }
      }
    }
  },
];

// Map node positions
const NODE_POSITIONS = {
  html:       { x: 120, y: 100 },
  css:        { x: 300, y: 80  },
  javascript: { x: 480, y: 110 },
  variables:  { x: 620, y: 240 },
  functions:  { x: 480, y: 310 },
  loops:      { x: 300, y: 290 },
  github:     { x: 140, y: 340 },
  'git-versions': { x: 80, y: 220 },
  api:        { x: 620, y: 390 },
  servers:    { x: 720, y: 200 },
  deploy:     { x: 740, y: 380 },
  pwa:        { x: 420, y: 470 },
  ai:         { x: 580, y: 530 },
};

const NODE_CONNECTIONS = [
  ['html','css'], ['html','javascript'], ['css','javascript'],
  ['javascript','variables'], ['javascript','functions'], ['javascript','loops'],
  ['functions','variables'], ['loops','functions'],
  ['javascript','api'], ['api','servers'],
  ['github','git-versions'], ['servers','deploy'],
  ['javascript','pwa'], ['pwa','deploy'],
  ['api','ai'], ['servers','ai'],
];

const BADGES_DATA = [
  { id: 'first_step', emoji: '👣', name: 'צעד ראשון', pts: 10, desc: 'פתחת מושג ראשון' },
  { id: 'html_master', emoji: '🏗️', name: 'בנאי HTML', pts: 20, desc: 'סיימת HTML' },
  { id: 'css_artist', emoji: '🎨', name: 'אמן CSS', pts: 20, desc: 'סיימת CSS' },
  { id: 'js_wizard', emoji: '⚡', name: 'קוסם JS', pts: 30, desc: 'סיימת JavaScript' },
  { id: 'github_hero', emoji: '🐙', name: 'גיבור GitHub', pts: 25, desc: 'ניסית GitHub Sim' },
  { id: 'ai_friend', emoji: '🤖', name: 'חבר AI', pts: 20, desc: 'שוחחת עם AI' },
  { id: 'playground_master', emoji: '🛝', name: 'מלך הארגז', pts: 30, desc: 'שיחקת בPlayground' },
  { id: 'explorer', emoji: '🗺️', name: 'חוקר', pts: 15, desc: 'ביקרת ב-5 מושגים' },
  { id: 'advanced', emoji: '🚀', name: 'מתקדם', pts: 40, desc: 'הגעת לרמה Expert' },
  { id: 'daily_hero', emoji: '📅', name: 'גיבור יומי', pts: 15, desc: 'ענית על אתגר יומי' },
  { id: 'map_explorer', emoji: '🌍', name: 'סייר מפה', pts: 20, desc: 'לחצת על 8 nodes' },
  { id: 'all_concepts', emoji: '🏆', name: 'אלוף', pts: 100, desc: 'השלמת את כל המושגים' },
];

const DAILY_CHALLENGES = [
  {
    q: 'מה ה-HTML tag לכותרת ראשית?',
    opts: ['<p>', '<h1>', '<title>', '<header>'],
    ans: 1
  },
  {
    q: 'מה CSS property משמש להגדרת צבע רקע?',
    opts: ['color', 'background', 'fill', 'bg-color'],
    ans: 1
  },
  {
    q: 'מה ההבדל בין const ל-let ב-JavaScript?',
    opts: ['אין הבדל', 'const ניתן לשינוי, let לא', 'const לא ניתן לשינוי, let כן', 'const למספרים, let למחרוזות'],
    ans: 2
  },
  {
    q: 'מה Git commit עושה?',
    opts: ['מוחק קבצים', 'שומר snapshot של הקוד', 'שולח קוד לGitHub', 'מתחיל פרויקט חדש'],
    ans: 1
  },
  {
    q: 'מה זה API?',
    opts: ['שפת תכנות', 'תוכנה לעריכת קוד', 'ממשק לתקשורת בין תוכניות', 'מסד נתונים'],
    ans: 2
  },
  {
    q: 'מה Service Worker מאפשר לנו לעשות ב-PWA?',
    opts: ['לשנות CSS', 'לעבוד אופליין', 'לכתוב Python', 'לשלוח SMS'],
    ans: 1
  },
  {
    q: 'מה Array.map() מחזיר?',
    opts: ['מספר', 'מערך חדש מעובד', 'boolean', 'object'],
    ans: 1
  },
];

const AI_RESPONSES = {
  html: ['HTML הוא השלד של כל אתר! 🏗️ כמו עצמות בגוף - נותן מבנה. כל "תגית" כמו <h1> או <p> היא לבנה אחת. כשאתה פותח אתר, הדפדפן קורא את ה-HTML ובונה את הדף מהשלד הזה.', 'שאלה מצוינת! HTML = HyperText Markup Language. ה-HyperText זה הקישורים שמחברים דפים, ה-Markup זה התגיות שמסמנות מה כל דבר. פשוט ומגניב!'],
  css: ['CSS הוא הקסם שמעצב הכל! 🎨 בלי CSS, כל האתרים היו טקסט שחור על רקע לבן. CSS נותן לנו צבעים, פונטים, אנימציות ופריסה. זה כמו להלביש את השלד ב-HTML.', 'Flexbox ו-Grid הם הכלים הכי חשובים ב-CSS היום! הם מאפשרים לסדר אלמנטים בדיוק איפה שרוצים, ולהתאים לכל גודל מסך.'],
  javascript: ['JavaScript היא השפה שנותנת חיים לאתרים! ⚡ בלעדיה, אתרים היו סטטיים לחלוטין - רק טקסט ותמונות ללא אינטראקציה. כל כפתור שעובד, כל הנפשה, כל עדכון בזמן אמת - זה JavaScript.', 'JavaScript רצה גם בשרת (Node.js) לא רק בדפדפן! זה אומר שאפשר לכתוב גם Frontend וגם Backend באותה שפה. מגניב, לא?'],
  api: ['API הוא כמו מלצר 🌉 - אתה מזמין, המלצר לוקח להמטבח, ומביא בחזרה. אתה לא צריך לדעת מה קורה במטבח - רק לבקש בשפה שהמלצר מבין.', 'כשאתה משתמש בגוגל מפות בתוך Uber, Wolt, או כל אפליקציה - זה API של Google Maps. הם לא כתבו מפות מאפס! הם השתמשו ב-API שGoogle מציעה.'],
  ai: ['AI זה ממש מרתק! 🤖 המודל לומד מביליוני דוגמאות טקסט ומוצא דפוסים. כשאתה שואל אותי שאלה, אני מנחש מה התשובה הכי "הגיונית" לפי כל מה שלמדתי - לא "חושב" כמו בן אדם, אבל מאוד מועיל!', 'LLM (Large Language Model) כמו Claude, GPT ואחרים - הם עצמות. ה-APIs שמאפשרות לך להשתמש בהם בקוד שלך - הם השרירים. ביחד יוצרים אפליקציות AI מדהימות.'],
  github: ['GitHub הוא כמו Drive לקוד, אבל 100x יותר חכם! 🐙 הוא שומר את ההיסטוריה המלאה של כל שינוי, מי שינה ומתי. אם שינית משהו שהשבר את הפרויקט, אפשר לחזור אחורה בשניות.', 'Pull Request (PR) הוא הדרך לבקש ממישהו לבדוק את הקוד שלך לפני שמחברים אותו. זה הבסיס של עבודת צוות בתכנות - כל שינוי נסקר ונדון לפני שנכנס לקוד הראשי.'],
  pwa: ['PWA זו טכנולוגיה שמאפשרת לאתר "להתנהג כמו אפליקציה" 📱 - אפשר להוריד אותה למסך הבית, לפתוח בלי דפדפן, ולהשתמש גם ללא אינטרנט. הכל בלי חנות אפליקציות!', 'Service Worker הוא לב ה-PWA - הוא "שומר" שיושב בין הדפדפן לאינטרנט ומנהל cache. הוא מה שמאפשר לעבוד אופליין ולטעון מהר מאוד.'],
  default: ['שאלה מעניינת! 🤔 הטכנולוגיה שאתה מתאר קשורה לאיך שדפדפנים ואתרים מתקשרים. בפשטות - כל מה שאתה רואה על המסך עבר תהליך: כתיבה, בנייה, בדיקה ופרסום.', 'תכנות זה כמו ללמוד שפה חדשה - בהתחלה נראה קשה, אבל ברגע שמבינים את הלוגיקה הבסיסית, הכל נפתח! המפתח הוא לתרגל על פרויקטים קטנים ואמיתיים.'],
};

const PLAYGROUND_EXAMPLES = {
  html: {
    label: 'HTML',
    code: `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>הניסוי שלי</title>
  <style>
    body {
      font-family: 'Heebo', sans-serif;
      background: linear-gradient(135deg, #667eea, #764ba2);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0;
    }
    .card {
      background: white;
      border-radius: 20px;
      padding: 40px;
      text-align: center;
      box-shadow: 0 20px 60px rgba(0,0,0,0.2);
      max-width: 400px;
    }
    h1 { color: #6c63ff; font-size: 2rem; }
    p { color: #666; line-height: 1.7; }
    .btn {
      background: #6c63ff;
      color: white;
      border: none;
      padding: 12px 30px;
      border-radius: 25px;
      font-size: 1rem;
      cursor: pointer;
      margin-top: 16px;
    }
    .btn:hover { background: #5a52d5; }
  </style>
</head>
<body>
  <div class="card">
    <h1>👋 שלום עולם!</h1>
    <p>זהו הקוד הראשון שלי. שנה את הצבעים, הטקסט, ותראה מה קורה!</p>
    <button class="btn" onclick="this.textContent='🎉 כל הכבוד!'">לחץ עלי!</button>
  </div>
</body>
</html>`
  },
  css: {
    label: 'CSS אנימציה',
    code: `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
<meta charset="UTF-8">
<style>
  body {
    background: #0a0e1a;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    gap: 20px;
    padding: 20px;
    margin: 0;
    font-family: sans-serif;
  }
  .box {
    width: 80px;
    height: 80px;
    border-radius: 16px;
    animation: bounce 1s infinite alternate;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
  }
  /* שנה את הצבעים! */
  .box:nth-child(1) { background: #ff6b9d; animation-delay: 0s; }
  .box:nth-child(2) { background: #6c63ff; animation-delay: 0.15s; }
  .box:nth-child(3) { background: #43e8d8; animation-delay: 0.3s; }
  .box:nth-child(4) { background: #ffd166; animation-delay: 0.45s; }
  .box:nth-child(5) { background: #4ade80; animation-delay: 0.6s; }

  @keyframes bounce {
    from { transform: translateY(0) scale(1); }
    to   { transform: translateY(-40px) scale(1.1); }
  }
  .box:hover { animation-play-state: paused; transform: scale(1.3); }
</style>
</head>
<body>
  <div class="box">🎈</div>
  <div class="box">⭐</div>
  <div class="box">🎵</div>
  <div class="box">🚀</div>
  <div class="box">🌈</div>
</body>
</html>`
  },
  js: {
    label: 'JavaScript',
    code: `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
<meta charset="UTF-8">
<style>
  body { background: #0a0e1a; color: white; font-family: sans-serif; padding: 30px; }
  h2 { color: #6c63ff; }
  .input-row { display: flex; gap: 10px; margin: 20px 0; }
  input {
    flex: 1;
    padding: 12px;
    border-radius: 10px;
    border: 2px solid #6c63ff;
    background: #1a2035;
    color: white;
    font-size: 1rem;
  }
  button {
    padding: 12px 24px;
    background: #6c63ff;
    color: white;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: bold;
  }
  button:hover { background: #8b7fff; }
  #list { list-style: none; padding: 0; }
  #list li {
    background: #1a2035;
    padding: 12px 16px;
    border-radius: 10px;
    margin: 8px 0;
    display: flex;
    justify-content: space-between;
    border: 1px solid rgba(108,99,255,0.3);
    animation: fadeIn 0.3s ease;
  }
  @keyframes fadeIn { from { opacity:0; transform: translateX(-10px); } to { opacity:1; transform: translateX(0); } }
  .del { cursor: pointer; color: #ff6b9d; font-weight: bold; }
</style>
</head>
<body>
  <h2>✅ רשימת משימות</h2>
  <div class="input-row">
    <input id="task" placeholder="הוסף משימה...">
    <button onclick="addTask()">הוסף</button>
  </div>
  <ul id="list"></ul>
  <script>
    function addTask() {
      const input = document.getElementById('task');
      const text = input.value.trim();
      if (!text) return;
      const li = document.createElement('li');
      li.innerHTML = \`<span>\${text}</span><span class="del" onclick="this.parentElement.remove()">✕</span>\`;
      document.getElementById('list').prepend(li);
      input.value = '';
    }
    document.getElementById('task').addEventListener('keypress', e => {
      if (e.key === 'Enter') addTask();
    });
  </script>
</body>
</html>`
  },
  creative: {
    label: 'יצירתי',
    code: `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #0a0e1a; overflow: hidden; }
  canvas { display: block; }
</style>
</head>
<body>
<canvas id="c"></canvas>
<script>
const c = document.getElementById('c');
const ctx = c.getContext('2d');
c.width = window.innerWidth;
c.height = window.innerHeight;

const particles = [];
const colors = ['#6c63ff','#ff6b9d','#43e8d8','#ffd166','#4ade80'];

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 6 + 2;
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.vx = (Math.random() - 0.5) * 4;
    this.vy = (Math.random() - 0.5) * 4;
    this.life = 1;
    this.decay = Math.random() * 0.02 + 0.01;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life -= this.decay;
    this.size *= 0.99;
  }
  draw() {
    ctx.globalAlpha = this.life;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

c.addEventListener('mousemove', e => {
  for (let i = 0; i < 5; i++) particles.push(new Particle(e.clientX, e.clientY));
});

c.addEventListener('click', e => {
  for (let i = 0; i < 50; i++) particles.push(new Particle(e.clientX, e.clientY));
});

function animate() {
  ctx.globalAlpha = 0.1;
  ctx.fillStyle = '#0a0e1a';
  ctx.fillRect(0, 0, c.width, c.height);
  particles.forEach((p, i) => {
    p.update();
    p.draw();
    if (p.life <= 0) particles.splice(i, 1);
  });
  requestAnimationFrame(animate);
}
animate();
</script>
</body>
</html>`
  }
};

// ── LocalStorage ───────────────────────────────────────────
function saveState() {
  const toSave = {
    theme: STATE.theme,
    level: STATE.level,
    points: STATE.points,
    completed: [...STATE.completed],
    badges: [...STATE.badges],
    simsDone: [...STATE.simsDone],
    dailyChallengeAnswered: STATE.dailyChallengeAnswered,
    dailyChallengeIdx: STATE.dailyChallengeIdx,
    lastVisit: STATE.lastVisit,
    leaderboardName: STATE.leaderboardName,
  };
  try { localStorage.setItem('techlearn_state', JSON.stringify(toSave)); } catch (e) {}
}

function loadState() {
  try {
    const raw = localStorage.getItem('techlearn_state');
    if (!raw) return;
    const saved = JSON.parse(raw);
    Object.assign(STATE, saved);
    STATE.completed = new Set(saved.completed || []);
    STATE.badges = new Set(saved.badges || []);
    STATE.simsDone = new Set(saved.simsDone || []);
    // reset daily challenge if new day
    const today = new Date().toDateString();
    if (STATE.lastVisit !== today) {
      STATE.dailyChallengeAnswered = false;
      STATE.dailyChallengeIdx = Math.floor(Math.random() * DAILY_CHALLENGES.length);
      STATE.lastVisit = today;
      saveState();
    }
  } catch (e) {}
}

function resetState() {
  if (!confirm('אתה בטוח שרוצה לאפס את כל ההתקדמות?')) return;
  try { localStorage.removeItem('techlearn_state'); } catch (e) {}
  location.reload();
}

function exportState() {
  const data = localStorage.getItem('techlearn_state') || '{}';
  const blob = new Blob([data], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'techlearn_progress.json';
  a.click();
}

function importState(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      localStorage.setItem('techlearn_state', ev.target.result);
      location.reload();
    } catch (ex) { showToast('❌ קובץ לא תקין', 'warning'); }
  };
  reader.readAsText(file);
}

// ── UI Helpers ─────────────────────────────────────────────
function showToast(msg, type = 'info', duration = 3000) {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'toastOut 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

function updateBreadcrumbs(parts) {
  const bc = document.getElementById('breadcrumbs');
  if (!bc) return;
  bc.innerHTML = parts.map((p, i) =>
    i < parts.length - 1
      ? `<a onclick="${p.action}">${p.label}</a><span class="breadcrumb-sep">›</span>`
      : `<span class="current">${p.label}</span>`
  ).join('');
}

function setView(viewId) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const view = document.getElementById(`view-${viewId}`);
  if (view) view.classList.add('active');
  const navItem = document.querySelector(`[data-view="${viewId}"]`);
  if (navItem) navItem.classList.add('active');
  STATE.currentView = viewId;
  closeSidebar();
  window.scrollTo(0, 0);
}

function updatePoints(delta) {
  STATE.points += delta;
  const display = document.getElementById('pointsDisplay');
  if (display) display.textContent = `⭐ ${STATE.points}`;
  saveState();
}

function awardBadge(badgeId) {
  if (STATE.badges.has(badgeId)) return;
  const badge = BADGES_DATA.find(b => b.id === badgeId);
  if (!badge) return;
  STATE.badges.add(badgeId);
  updatePoints(badge.pts);
  showToast(`🏅 פתחת: ${badge.name}! +${badge.pts}pts`, 'success', 4000);
  saveState();
  renderBadges();
}

// ── Theme ──────────────────────────────────────────────────
function setTheme(theme) {
  STATE.theme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  const btn = document.getElementById('themeToggle');
  if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
  saveState();
}

function autoTheme() {
  const hour = new Date().getHours();
  setTheme(hour >= 7 && hour < 19 ? 'light' : 'dark');
}

// ── Sidebar ────────────────────────────────────────────────
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  sidebar.classList.toggle('open');
  overlay.classList.toggle('show');
}

function closeSidebar() {
  document.getElementById('sidebar')?.classList.remove('open');
  document.getElementById('sidebarOverlay')?.classList.remove('show');
}

// ── Level ──────────────────────────────────────────────────
function setLevel(level) {
  STATE.level = level;
  document.querySelectorAll('.level-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.level === level);
  });
  if (level === 'expert') awardBadge('advanced');
  saveState();
  if (STATE.currentView === 'concepts') renderConceptCards();
  if (STATE.currentConcept) openConcept(STATE.currentConcept, false);
}

// ── Dashboard ──────────────────────────────────────────────
function renderDashboard() {
  const total = CONCEPTS.length;
  const done = STATE.completed.size;
  document.getElementById('stat-completed').textContent = done;
  document.getElementById('stat-total').textContent = total;
  document.getElementById('stat-points').textContent = STATE.points;
  document.getElementById('stat-badges').textContent = STATE.badges.size;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const fill = document.getElementById('progressFill');
  if (fill) fill.style.width = pct + '%';
  document.getElementById('progressPct').textContent = pct + '%';
}

// ── Concept Cards ──────────────────────────────────────────
function renderConceptCards(filter = '') {
  const grid = document.getElementById('cardsGrid');
  if (!grid) return;

  const list = filter
    ? CONCEPTS.filter(c =>
        c.title.includes(filter) ||
        c.desc.includes(filter) ||
        c.tags.some(t => t.includes(filter)) ||
        c.id.includes(filter.toLowerCase())
      )
    : CONCEPTS;

  grid.innerHTML = list.length === 0
    ? `<div class="empty-state"><div class="empty-state-icon">🔍</div><div class="empty-state-text">לא נמצאו תוצאות</div></div>`
    : list.map(c => {
        const done = STATE.completed.has(c.id);
        return `<div class="concept-card" style="--card-color: ${c.color}" onclick="openConcept('${c.id}')">
          <span class="card-emoji">${c.emoji}</span>
          <div class="card-title">${c.title}</div>
          <div class="card-tagline">${c.tagline}</div>
          <div class="card-desc">${c.desc}</div>
          <div class="card-footer">
            <div class="card-tags">${c.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
            <span class="card-status">${done ? '✅' : '🔵'}</span>
          </div>
        </div>`;
      }).join('');
}

function openConcept(id, scrollTo = true) {
  const concept = CONCEPTS.find(c => c.id === id);
  if (!concept) return;

  STATE.currentConcept = id;
  const level = STATE.level;
  const lvlData = concept.levels[level] || concept.levels.beginner;

  // Mark first open
  if (!STATE.completed.has(id)) {
    awardBadge('first_step');
    if (STATE.completed.size === 4) awardBadge('explorer');
  }
  STATE.completed.add(id);
  if (STATE.completed.size === CONCEPTS.length) awardBadge('all_concepts');
  saveState();

  // Update nav dots
  document.querySelectorAll(`.nav-item[data-concept="${id}"] .nav-check`).forEach(el => el.style.display = 'inline');

  // Badge per concept
  const badgeMap = {
    html: 'html_master', css: 'css_artist', javascript: 'js_wizard', github: 'github_hero'
  };
  if (badgeMap[id]) awardBadge(badgeMap[id]);

  const panel = document.getElementById('conceptDetail');
  panel.classList.add('open');
  panel.innerHTML = `
    <div class="detail-header">
      <div class="detail-emoji">${concept.emoji}</div>
      <div class="detail-titles">
        <div class="detail-title" style="color:${concept.color}">${concept.title}</div>
        <div class="detail-tagline">${concept.tagline}</div>
        <div class="detail-actions">
          <button class="btn btn-primary btn-sm" onclick="openSimFromConcept('${id}')">🎮 סימולציה</button>
          <button class="btn btn-secondary btn-sm" onclick="openPlaygroundWith('${id}')">🛝 ארגז חול</button>
          <button class="btn btn-secondary btn-sm" onclick="closeDetail()">✕ סגור</button>
        </div>
      </div>
    </div>
    <div class="tabs">
      <button class="tab-btn active" onclick="switchTab(this,'tab-basic')">📚 הסבר</button>
      <button class="tab-btn" onclick="switchTab(this,'tab-meta')">💡 מטאפורה</button>
      <button class="tab-btn" onclick="switchTab(this,'tab-code')">💻 קוד</button>
    </div>
    <div id="tab-basic" class="tab-content active">
      <p style="line-height:1.9;color:var(--text-secondary);font-size:0.95rem">${lvlData.explain}</p>
    </div>
    <div id="tab-meta" class="tab-content">
      <div class="metaphor-box">
        <div class="metaphor-icon">${lvlData.metaphor.icon}</div>
        <div class="metaphor-text">
          <div class="metaphor-title">${lvlData.metaphor.title}</div>
          <div class="metaphor-desc">${lvlData.metaphor.desc}</div>
        </div>
      </div>
    </div>
    <div id="tab-code" class="tab-content">
      ${buildCodeBlock(lvlData.code)}
    </div>
  `;

  if (scrollTo) panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  renderDashboard();
  updateBreadcrumbs([
    { label: '🏠 ראשי', action: "setView('dashboard')" },
    { label: '📚 מושגים', action: "setView('concepts')" },
    { label: concept.title }
  ]);
}

function buildCodeBlock(codeData) {
  const lines = codeData.lines.map(l =>
    l.code === ''
      ? `<span class="code-line">&nbsp;</span>`
      : `<span class="code-line" ${l.tip ? `title="${l.tip}"` : ''}>${syntaxHL(l.code, codeData.lang)}${l.tip ? `<span class="line-tooltip">${l.tip}</span>` : ''}</span>`
  ).join('');
  return `<div class="code-block">
    <div class="code-header">
      <span class="code-lang">${codeData.lang}</span>
      <button class="code-copy-btn" onclick="copyCode(this)">📋 העתק</button>
    </div>
    <div class="code-body">
      <pre>${lines}</pre>
    </div>
  </div>`;
}

function syntaxHL(code, lang) {
  // Basic syntax highlighting
  code = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  if (lang === 'HTML') {
    code = code
      .replace(/(&lt;\/?[\w-]+)/g, '<span class="tok-tag">$1</span>')
      .replace(/(\w+)=/g, '<span class="tok-attr">$1</span>=')
      .replace(/"([^"]*)"/g, '"<span class="tok-val">$1</span>"');
  } else if (lang === 'CSS') {
    code = code
      .replace(/(\/\*.*?\*\/)/g, '<span class="tok-cmt">$1</span>')
      .replace(/([.#][\w-]+|:[\w-]+|\w+(?=\s*{))/g, '<span class="tok-fn">$1</span>')
      .replace(/:\s*([^;{]+)/g, ': <span class="tok-val">$1</span>');
  } else {
    // JS / Python / Terminal / Generic
    code = code
      .replace(/(\/\/[^\n]*)/g, '<span class="tok-cmt">$1</span>')
      .replace(/(#[^\n]*)/g, '<span class="tok-cmt">$1</span>')
      .replace(/\b(const|let|var|function|return|if|else|for|while|class|import|export|from|async|await|try|catch|new|this|extends|of|in|typeof|=>)\b/g, '<span class="tok-kw">$1</span>')
      .replace(/"([^"]*)"|'([^']*)'/g, '<span class="tok-str">"$1$2"</span>')
      .replace(/`([^`]*)`/g, '<span class="tok-str">`$1`</span>')
      .replace(/\b(\d+\.?\d*)\b/g, '<span class="tok-num">$1</span>');
  }
  return code;
}

function copyCode(btn) {
  const pre = btn.closest('.code-block').querySelector('pre');
  navigator.clipboard.writeText(pre.innerText || pre.textContent)
    .then(() => { btn.textContent = '✅ הועתק!'; setTimeout(() => btn.textContent = '📋 העתק', 2000); })
    .catch(() => {});
}

function closeDetail() {
  const panel = document.getElementById('conceptDetail');
  panel.classList.remove('open');
  STATE.currentConcept = null;
}

function switchTab(btn, tabId) {
  const panel = btn.closest('.detail-panel, .sim-content, .modal') || document;
  panel.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  panel.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  const tab = document.getElementById(tabId);
  if (tab) tab.classList.add('active');
}

// ── Concept Map ────────────────────────────────────────────
function renderConceptMap() {
  const container = document.getElementById('mapNodesContainer');
  const svg = document.getElementById('mapSvg');
  if (!container || !svg) return;

  // Draw connections
  let svgContent = '';
  NODE_CONNECTIONS.forEach(([from, to]) => {
    const a = NODE_POSITIONS[from];
    const b = NODE_POSITIONS[to];
    if (!a || !b) return;
    const ax = a.x + 36, ay = a.y + 36;
    const bx = b.x + 36, by = b.y + 36;
    svgContent += `<line x1="${ax}" y1="${ay}" x2="${bx}" y2="${by}" stroke="rgba(108,99,255,0.25)" stroke-width="1.5" stroke-dasharray="4,4"/>`;
  });
  svg.innerHTML = svgContent;

  // Draw nodes
  container.innerHTML = CONCEPTS.map(c => {
    const pos = NODE_POSITIONS[c.id];
    if (!pos) return '';
    const done = STATE.completed.has(c.id);
    return `<div class="map-node" style="left:${pos.x}px;top:${pos.y}px" onclick="mapNodeClick('${c.id}')">
      <div class="node-circle ${done ? 'completed' : ''}" style="background:linear-gradient(135deg,${c.color}88,${c.color}44)">
        ${c.emoji}
      </div>
      <div class="node-label">${c.title}</div>
    </div>`;
  }).join('');
}

function mapNodeClick(id) {
  const concept = CONCEPTS.find(c => c.id === id);
  if (!concept) return;
  if (!STATE.simsDone.has('map_click_' + id)) {
    STATE.simsDone.add('map_click_' + id);
    if (STATE.simsDone.size >= 8) awardBadge('map_explorer');
    saveState();
  }
  setView('concepts');
  setTimeout(() => openConcept(id), 100);
}

// ── Simulations ────────────────────────────────────────────
function setSim(simId) {
  document.querySelectorAll('.sim-tab-btn').forEach(b => b.classList.toggle('active', b.dataset.sim === simId));
  document.querySelectorAll('.sim-content').forEach(c => c.classList.toggle('active', c.id === `sim-${simId}`));
}

function openSimFromConcept(conceptId) {
  const simMap = {
    github: 'github', 'git-versions': 'github',
    ai: 'ai', javascript: 'playground', html: 'playground', css: 'playground'
  };
  const sim = simMap[conceptId] || 'ai';
  setView('simulations');
  setTimeout(() => setSim(sim), 100);
}

function openPlaygroundWith(conceptId) {
  const pgMap = {
    html: 'html', css: 'css', javascript: 'js'
  };
  setView('simulations');
  setTimeout(() => {
    setSim('playground');
    loadPlaygroundExample(pgMap[conceptId] || 'html');
  }, 100);
}

// ── GitHub Simulator ───────────────────────────────────────
const GH_STATE = {
  repo: '',
  files: [
    { name: 'index.html', status: 'modified' },
    { name: 'style.css', status: 'modified' },
    { name: 'script.js', status: 'untracked' },
  ],
  staged: new Set(),
  commits: [],
  branch: 'main',
};

function renderGhFiles() {
  const list = document.getElementById('ghFileList');
  if (!list) return;
  list.innerHTML = GH_STATE.files.map((f, i) => `
    <div class="gh-file ${GH_STATE.staged.has(i) ? 'staged' : 'modified'}" onclick="toggleStage(${i})">
      <span class="file-icon">${GH_STATE.staged.has(i) ? '✅' : (f.status === 'untracked' ? '🆕' : '📝')}</span>
      ${f.name}
      <span style="margin-right:auto;font-size:0.75rem;color:var(--text-muted)">${GH_STATE.staged.has(i) ? 'staged' : f.status}</span>
    </div>`).join('');
}

function toggleStage(idx) {
  if (GH_STATE.staged.has(idx)) GH_STATE.staged.delete(idx);
  else GH_STATE.staged.add(idx);
  renderGhFiles();
}

function stageAll() {
  GH_STATE.files.forEach((_, i) => GH_STATE.staged.add(i));
  renderGhFiles();
  showToast('✅ כל הקבצים סומנו לcommit', 'success');
}

function doCommit() {
  const msgEl = document.getElementById('commitMsg');
  const msg = msgEl?.value?.trim();
  if (!msg) { showToast('✍️ כתוב הודעת commit קודם!', 'warning'); return; }
  if (GH_STATE.staged.size === 0) { showToast('⚠️ סמן קבצים ב-stage קודם!', 'warning'); return; }

  const hash = Math.random().toString(36).substr(2, 7);
  const files = [...GH_STATE.staged].map(i => GH_STATE.files[i].name);
  GH_STATE.commits.unshift({ msg, hash, files, time: new Date().toLocaleTimeString('he') });
  GH_STATE.staged.clear();
  msgEl.value = '';
  renderGhCommits();
  renderGhFiles();
  showToast(`✅ Commit נוצר: ${hash}`, 'success');

  if (!STATE.simsDone.has('github_commit')) {
    STATE.simsDone.add('github_commit');
    awardBadge('github_hero');
    updatePoints(10);
    saveState();
  }
}

function doPush() {
  if (GH_STATE.commits.length === 0) { showToast('❌ אין commits לPush', 'warning'); return; }
  if (!GH_STATE.repo) { showToast('✍️ שים שם ל-Repository קודם', 'warning'); return; }
  showToast(`🚀 Push ל-github.com/${GH_STATE.repo}/${GH_STATE.branch}`, 'success', 4000);
  updatePoints(5);
  saveState();
}

function createRepo() {
  const nameEl = document.getElementById('repoName');
  const name = nameEl?.value?.trim();
  if (!name) { showToast('✍️ כתוב שם לRepository', 'warning'); return; }
  GH_STATE.repo = name;
  showToast(`🎉 Repository "${name}" נוצר!`, 'success');
  updatePoints(5);
  nameEl.value = '';
  saveState();
}

function renderGhCommits() {
  const list = document.getElementById('ghTimeline');
  if (!list) return;
  list.innerHTML = GH_STATE.commits.map(c => `
    <div class="gh-commit">
      <div class="commit-dot"></div>
      <div>
        <div class="commit-msg">${c.msg}</div>
        <div class="commit-hash">${c.hash} · ${c.time} · ✏️ ${c.files.join(', ')}</div>
      </div>
    </div>`).join('') || '<div style="color:var(--text-muted);font-size:0.85rem;padding:10px">אין commits עדיין</div>';
}

// ── AI Chat ────────────────────────────────────────────────
const CHAT_HISTORY = [
  { role: 'bot', text: 'שלום! 👋 אני TechBot, עוזר ה-AI שלך ללימוד תכנות. שאל אותי על כל מושג טכנולוגי - HTML, JavaScript, API, AI ועוד. על מה תרצה ללמוד?' }
];

function renderChat() {
  const msgs = document.getElementById('chatMessages');
  if (!msgs) return;
  msgs.innerHTML = CHAT_HISTORY.map(m => `
    <div class="msg ${m.role}">
      <div class="msg-avatar">${m.role === 'bot' ? '🤖' : '👤'}</div>
      <div class="msg-bubble">${m.text}</div>
    </div>`).join('');
  msgs.scrollTop = msgs.scrollHeight;
}

function getAIResponse(input) {
  const lower = input.toLowerCase();
  const keywords = Object.keys(AI_RESPONSES);
  for (const kw of keywords) {
    if (lower.includes(kw) || lower.includes(kw.replace('-', ' '))) {
      const arr = AI_RESPONSES[kw];
      return arr[Math.floor(Math.random() * arr.length)];
    }
  }
  const def = AI_RESPONSES.default;
  return def[Math.floor(Math.random() * def.length)];
}

function sendMessage(text) {
  const input = document.getElementById('chatInput');
  const msg = text || input?.value?.trim();
  if (!msg) return;
  if (input) input.value = '';

  CHAT_HISTORY.push({ role: 'user', text: msg });
  renderChat();

  // Typing indicator
  const msgs = document.getElementById('chatMessages');
  const typing = document.createElement('div');
  typing.className = 'msg bot';
  typing.innerHTML = `<div class="msg-avatar">🤖</div><div class="typing-indicator"><span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span></div>`;
  msgs.appendChild(typing);
  msgs.scrollTop = msgs.scrollHeight;

  setTimeout(() => {
    typing.remove();
    const response = getAIResponse(msg);
    CHAT_HISTORY.push({ role: 'bot', text: response });
    renderChat();

    if (!STATE.simsDone.has('ai_chat')) {
      STATE.simsDone.add('ai_chat');
      awardBadge('ai_friend');
      updatePoints(10);
      saveState();
    }
  }, 1000 + Math.random() * 800);
}

// ── Code Playground ────────────────────────────────────────
function loadPlaygroundExample(mode) {
  const example = PLAYGROUND_EXAMPLES[mode];
  if (!example) return;
  STATE.pgMode = mode;
  const editor = document.getElementById('pgEditor');
  if (editor) editor.value = example.code;
  document.querySelectorAll('.pg-example-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.mode === mode);
  });
  runPlayground();
}

function runPlayground() {
  const editor = document.getElementById('pgEditor');
  const iframe = document.getElementById('pgIframe');
  if (!editor || !iframe) return;

  const code = editor.value;
  try {
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write(code);
    doc.close();
  } catch (e) {}

  if (!STATE.simsDone.has('playground')) {
    STATE.simsDone.add('playground');
    awardBadge('playground_master');
    updatePoints(15);
    saveState();
  }
}

// ── Gamification ───────────────────────────────────────────
function renderBadges() {
  const grid = document.getElementById('badgesGrid');
  if (!grid) return;
  grid.innerHTML = BADGES_DATA.map(b => `
    <div class="badge-card ${STATE.badges.has(b.id) ? 'earned' : 'locked'}" title="${b.desc}">
      <span class="badge-emoji">${b.emoji}</span>
      <div class="badge-name">${b.name}</div>
      <div class="badge-pts">+${b.pts}pts</div>
    </div>`).join('');
}

function renderDailyChallenge() {
  const ch = DAILY_CHALLENGES[STATE.dailyChallengeIdx];
  if (!ch) return;
  const qEl = document.getElementById('challengeQ');
  const opts = document.getElementById('challengeOpts');
  if (qEl) qEl.textContent = ch.q;
  if (!opts) return;

  if (STATE.dailyChallengeAnswered) {
    opts.innerHTML = `<div style="color:var(--success);font-weight:700;text-align:center;padding:16px">✅ ענית נכון! בוא שוב מחר.</div>`;
    return;
  }

  opts.innerHTML = ch.opts.map((o, i) =>
    `<button class="challenge-option" onclick="answerChallenge(${i})">${o}</button>`
  ).join('');
}

function answerChallenge(idx) {
  const ch = DAILY_CHALLENGES[STATE.dailyChallengeIdx];
  if (!ch || STATE.dailyChallengeAnswered) return;
  const btns = document.querySelectorAll('.challenge-option');
  btns.forEach((b, i) => {
    b.disabled = true;
    b.classList.add(i === ch.ans ? 'correct' : 'wrong');
  });
  if (idx === ch.ans) {
    showToast('🎉 תשובה נכונה! +15 נקודות', 'success');
    updatePoints(15);
    awardBadge('daily_hero');
    STATE.dailyChallengeAnswered = true;
    saveState();
  } else {
    showToast('❌ לא נכון. נסה שוב מחר!', 'warning');
    STATE.dailyChallengeAnswered = true;
    saveState();
  }
  setTimeout(renderDailyChallenge, 1000);
}

function renderLeaderboard() {
  const list = document.getElementById('leaderboardList');
  if (!list) return;
  const myName = STATE.leaderboardName || 'אתה';
  const entries = [
    { name: '🏆 אלון כהן', pts: 450, level: 'Expert', avatar: '👨‍💻' },
    { name: '🥈 מיה לוי', pts: 380, level: 'Intermediate', avatar: '👩‍💻' },
    { name: '🥉 רון אברהם', pts: 340, level: 'Expert', avatar: '🧑‍💻' },
    { name: myName, pts: STATE.points, level: STATE.level, avatar: '⭐', self: true },
    { name: '🎯 שירה גלבוע', pts: 210, level: 'Beginner', avatar: '👩‍🎓' },
  ].sort((a, b) => b.pts - a.pts);

  list.innerHTML = entries.map((e, i) => `
    <div class="leaderboard-item ${e.self ? 'self' : ''}">
      <div class="lb-rank lb-rank-${i+1}">${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i+1}`}</div>
      <div class="lb-avatar">${e.avatar}</div>
      <div class="lb-name">${e.name}</div>
      <div class="lb-level">${e.level}</div>
      <div class="lb-pts">⭐ ${e.pts}</div>
    </div>`).join('');
}

// ── Search ─────────────────────────────────────────────────
function handleSearch(query) {
  if (!query.trim()) {
    setView('dashboard');
    return;
  }
  const results = CONCEPTS.filter(c =>
    c.title.toLowerCase().includes(query.toLowerCase()) ||
    c.desc.includes(query) ||
    c.tags.some(t => t.includes(query)) ||
    c.id.includes(query.toLowerCase())
  );
  setView('concepts');
  renderConceptCards(query);
  updateBreadcrumbs([
    { label: '🏠 ראשי', action: "setView('dashboard')" },
    { label: `🔍 חיפוש: "${query}"` }
  ]);
}

// ── PWA Install ────────────────────────────────────────────
let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  const banner = document.getElementById('installBanner');
  if (banner) banner.classList.add('show');
});

function installPWA() {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  deferredPrompt.userChoice.then(r => {
    if (r.outcome === 'accepted') showToast('🎉 האפליקציה הותקנה!', 'success');
    deferredPrompt = null;
    document.getElementById('installBanner')?.classList.remove('show');
  });
}

function dismissInstall() {
  document.getElementById('installBanner')?.classList.remove('show');
}

// ── Service Worker ─────────────────────────────────────────
function registerSW() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js')
      .then(reg => console.log('SW registered:', reg.scope))
      .catch(err => console.log('SW registration failed:', err));
  }
}

// ── Settings Modal ─────────────────────────────────────────
function openSettings() {
  document.getElementById('settingsModal').classList.add('open');
}

function closeSettings() {
  document.getElementById('settingsModal').classList.remove('open');
}

// ── Init ───────────────────────────────────────────────────
function init() {
  loadState();
  setTheme(STATE.theme);
  document.querySelectorAll('.level-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.level === STATE.level);
  });
  document.getElementById('pointsDisplay').textContent = `⭐ ${STATE.points}`;

  renderDashboard();
  renderConceptCards();
  renderConceptMap();
  renderBadges();
  renderDailyChallenge();
  renderLeaderboard();
  renderGhFiles();
  renderGhCommits();
  renderChat();

  // Load default playground
  loadPlaygroundExample('html');

  setView('dashboard');
  updateBreadcrumbs([{ label: '🏠 לוח בקרה' }]);

  // Auto-run playground on edit
  let pgTimer;
  document.getElementById('pgEditor')?.addEventListener('input', () => {
    clearTimeout(pgTimer);
    pgTimer = setTimeout(runPlayground, 600);
  });

  // Search
  document.getElementById('searchBox')?.addEventListener('input', (e) => {
    handleSearch(e.target.value);
  });

  // Chat enter
  document.getElementById('chatInput')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });

  // Close modal on overlay click
  document.getElementById('settingsModal')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeSettings();
  });

  // Sidebar overlay
  document.getElementById('sidebarOverlay')?.addEventListener('click', closeSidebar);

  // Register SW
  registerSW();

  // Auto-theme hint
  const hour = new Date().getHours();
  if (STATE.theme === 'dark' && hour >= 7 && hour < 19) {
    setTimeout(() => showToast('☀️ טיפ: אפשר לעבור למצב בהיר בהגדרות', 'info', 4000), 2000);
  }
}

document.addEventListener('DOMContentLoaded', init);
