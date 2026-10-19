import data from "./subjects.json";

export type Lang = "en" | "zh";
export const LANGS: Lang[] = ["en", "zh"];
export type T = { en: string; zh: string };

export interface Seed { id: string; name: T; what: T }
export interface Lesson {
  slug: string;
  stage: number;
  seeds: string[];
  grade: Record<string, string>;
  status: "ready" | "planned";
  play: string | null;
  title: T;
  insight: T;
  misconception: T;
  explain?: T;
  home?: T;
}
export interface Subject {
  id: string;
  order: number;
  name: T;
  tagline: T;
  stages: number[];
  continues_as?: string[];
  continues_from?: string[];
  seeds: Seed[];
  stage_questions: Record<string, T>;
  misconceptions: T[];
  lessons: Lesson[];
}
export interface Stage { n: number; name: T; age: T; theme: T; form: T }

export const STAGES = data.stages as Stage[];
export const CROSS_SEEDS = data.cross_seeds as Seed[];
export const SUBJECTS = data.subjects as unknown as Subject[];
export const subjectById = new Map(SUBJECTS.map((s) => [s.id, s]));

/** Maths lives on its own site; shown as a tenth card that links out. */
export const MATH_URL = "https://boxi-math.github.io";

export function seedName(subject: Subject, id: string, lang: Lang): string {
  const s = subject.seeds.find((x) => x.id === id) ?? CROSS_SEEDS.find((x) => x.id === id);
  return s ? `${id} ${s.name[lang]}` : id;
}

export const UI: Record<string, T> = {
  // Working name until the user picks one (design/k12-subjects.md §6).
  site: { en: "Boxi Learn", zh: "Boxi Learn" },
  tagline: { en: "Every subject, from the first seed", zh: "每一门课，从种子开始" },
  heroLead: {
    en: "For each subject we start from a few seeds — the ways people in that field see the world — and grow them in five stages. Every lesson is something you can try with your own hands.",
    zh: "每门学科先找出几颗种子——这门学科的人看世界的方式——再分五个阶段长大。每一课都能亲手试一试。",
  },
  rule: { en: "Go by stage, not by age. Move on when you have it.", zh: "按阶段学，不按年龄。学会了再往前走。" },
  subjects: { en: "Subjects", zh: "学科" },
  stages: { en: "Stages", zh: "阶段" },
  crossSeeds: { en: "Four habits every subject grows", zh: "每门课都种的四个习惯" },
  about: { en: "About", zh: "关于" },
  switchLang: { en: "中文", zh: "English" },
  math: { en: "Maths", zh: "数学" },
  mathTag: { en: "Our first subject, on its own site: insight videos and interactive pages.", zh: "第一门课，单独成站：洞察视频和互动页。" },
  seeds: { en: "Seeds", zh: "种子" },
  seedsLead: { en: "What we plant before any topic. Every lesson names the seeds it grows.", zh: "先于知识点要种下的东西。每一课都标明它在种哪颗种子。" },
  misconceptions: { en: "Ideas we expect to meet", zh: "常见的迷思" },
  misLead: { en: "Each interactive page lets one of these show itself first, then tests it.", zh: "每个互动页先让一个迷思暴露出来，再动手检验它。" },
  stage: { en: "Stage", zh: "阶段" },
  lessonCount: { en: "{n} lessons · {r} to try now", zh: "{n} 课 · {r} 课可以玩" },
  ready: { en: "Try it", zh: "可以玩" },
  planned: { en: "Planned", zh: "计划中" },
  insight: { en: "The idea", zh: "洞察" },
  mis: { en: "What many people think", zh: "很多人以为" },
  explain: { en: "Explain it", zh: "说一说" },
  home: { en: "Try at home", zh: "家里做一做" },
  play: { en: "Try it yourself", zh: "亲手试一试" },
  openNew: { en: "Open in a new window", zh: "在新窗口打开" },
  notYet: { en: "The interactive page for this lesson is not built yet.", zh: "这一课的互动页还没做。" },
  grade: { en: "School grade (for reference)", zh: "对应年级（仅供参考）" },
  continuesAs: { en: "Continues as", zh: "后面接" },
  continuesFrom: { en: "Grows out of", zh: "前面是" },
  allStage: { en: "All subjects at this stage", zh: "这一阶段的所有学科" },
  noLessons: { en: "No lessons at this stage yet.", zh: "这一阶段还没有课。" },
  license: { en: "Text and pages CC BY 4.0 · Boxi Yu", zh: "文字与页面 CC BY 4.0 · Boxi Yu" },
};
export const GRADE_LABEL: Record<string, T> = {
  cn: { en: "China", zh: "中国" },
  us: { en: "US", zh: "美国" },
  uk: { en: "UK (year)", zh: "英国（Year）" },
};
export const t = (key: string, lang: Lang) => UI[key][lang];
export const other = (lang: Lang): Lang => (lang === "en" ? "zh" : "en");
