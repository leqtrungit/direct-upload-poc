/**
 * Site copy, complete in both languages.
 *
 * The rule: a language is whole. Nothing is left in the other language except
 * proper nouns (Harnix, OpenAI, Ollama, LinkedIn), code and identifiers
 * (`user_message`, `gpt-4o-mini`, `console.harnix.vn`, file formats), product
 * UI labels shown inside the console mock, and terms of art the industry uses
 * untranslated in Vietnamese too (agent, knowledge base, token, Run, trace,
 * API key, widget, backend, frontend, streaming, shadow DOM, waitlist,
 * design partner, milestone codes M0–M3).
 */

export type Lang = "vi" | "en";

export const LANGS: Lang[] = ["vi", "en"];

export type TraceKind = "ok" | "info" | "warn" | "err";

export type OpIcon = "eye" | "stop" | "coin" | "plug" | "shield" | "check";

const vi = {
  // --- nav / global CTAs -------------------------------------------------
  navHow: "Cách hoạt động",
  navDemo: "Demo",
  navDev: "Developer",
  navBlog: "Blog",
  navFaq: "Hỏi đáp",
  ctaJoin: "Tham gia waitlist",
  /** Used in the mobile bar, where the full label will not fit beside the logo. */
  ctaJoinShort: "Waitlist",
  ctaDemo: "Xem demo",
  themeLabel: "Đổi giao diện sáng/tối",
  menuOpen: "Mở menu",
  menuClose: "Đóng menu",
  menuTitle: "Menu",
  langLabel: "Ngôn ngữ",
  skipToContent: "Tới nội dung chính",

  // --- hero --------------------------------------------------------------
  eyebrow: "NỀN TẢNG VẬN HÀNH AI AGENT",
  statusPill: "Đang xây dựng · ",
  heroH1: "Giao việc cho AI. Nắm từng bước.",
  heroSub:
    "Harnix giúp doanh nghiệp đưa trợ lý AI vào app sẵn có, và thấy rõ từng câu trả lời: AI đã đọc tài liệu nào, gọi công cụ gì, tốn bao nhiêu.",
  sampleNote: "Nội dung mẫu, dùng để minh hoạ.",
  heroFrameLabel: "Ảnh minh hoạ console Harnix",
  /** Sample data inside the console mock. The file name is a proper noun. */
  heroDocLine: "Chính sách bảo hành.pdf · trang 4",
  heroQuote: "“Khách hàng có thể đổi trả trong 30 ngày kể từ ngày nhận hàng…”",

  // --- why ---------------------------------------------------------------
  worryHead: "Trợ lý AI thì dễ làm. Vận hành nó mới khó.",
  w1t: "AI trả lời sai, ai biết?",
  w1b: "Chatbot đóng gói sẵn là một hộp đen. Bạn chỉ biết có vấn đề khi khách phàn nàn.",
  w2t: "Chi phí chạy theo từng câu hỏi",
  w2b: "Không biết mỗi câu trả lời tốn bao nhiêu thì không kiểm soát được ngân sách.",
  w3t: "Dữ liệu khách hàng đi đâu?",
  w3b: "Tài liệu nội bộ và hội thoại của khách cần được tách riêng và xoá được khi khách yêu cầu.",

  // --- how it works ------------------------------------------------------
  labHow: "Cách hoạt động",
  howHead: "Từ con số 0 tới trợ lý trong app của bạn",
  s1t: "Nạp tri thức",
  s1b: "Tải tài liệu (PDF, DOCX, TXT, MD) vào knowledge base.",
  s2t: "Tạo agent",
  s2b: "Chọn model của bạn, viết system prompt, gắn knowledge base và tool.",
  s3t: "Nhúng vào app",
  s3b: "Backend đổi API key lấy token ngắn hạn, frontend gắn widget chat.",
  tagAvailable: "Có sẵn",

  // --- demo --------------------------------------------------------------
  demoHead: "Xem cả quy trình trong {N} phút",
  demoSub: "Từ một tổ chức trống tới trợ lý AI đang trả lời khách trong app mẫu.",
  demoSoonPill: "Video demo sắp ra mắt",
  notifyCta: "Nhận thông báo khi có video",
  playLabel: "Phát video demo",
  transcriptLink: "Xem bản ghi nội dung →",
  labChapters: "Nội dung video",

  // --- run anatomy -------------------------------------------------------
  anatomyHead: "Mổ xẻ một Run",
  anatomySub: "Mỗi câu trả lời là một Run, được ghi lại từng bước.",

  // --- operate -----------------------------------------------------------
  opHead: "Quản AI như quản một nhân viên",

  // --- developer ---------------------------------------------------------
  devHead: "Cho developer",
  devBadge: "Xem trước · M2",
  tab1Label: "1. Backend: đổi token",
  tab2Label: "2. Frontend: gắn widget",
  codeCaption: "Mã minh hoạ. API chưa chốt.",
  d1: "API key chỉ nằm ở server",
  d2: "Streaming + trích dẫn",
  d3: "Widget cách ly CSS (shadow DOM)",
  docsLink: "Đọc tài liệu tích hợp →",
  docsSoon: "Tài liệu chưa có",
  docsSoonLabel: "Tài liệu (sắp có)",
  docsLabel: "Tài liệu",
  linkSoon: "Sắp có",

  // --- blog --------------------------------------------------------------
  blogHead: "Đang xây dựng công khai",
  blogLink: "Đọc blog →",
  blogEmptyTitle: "Bài viết đầu tiên sắp ra mắt",
  blogEmptyBody:
    "Chúng tôi sẽ viết lại quá trình xây dựng Harnix, từng milestone một.",
  blogErrorText: "Không tải được bài viết.",
  retryLabel: "Thử lại",
  blogLoadingLabel: "Đang tải bài viết…",
  readingTime: "{N} phút đọc",
  blogIndexTitle: "Blog",
  blogIndexSub: "Nhật ký xây dựng Harnix, từng milestone một.",
  backToBlog: "← Tất cả bài viết",
  blogNotFoundTitle: "Không tìm thấy bài viết",
  blogNotFoundBody: "Bài viết này không tồn tại hoặc đã bị gỡ.",
  blogViOnlyNote: "Bài viết này hiện chỉ có bản tiếng Việt.",

  // --- design partner ----------------------------------------------------
  partnerHead: "Trở thành design partner",
  partnerSub: "Chúng tôi tìm 1–3 doanh nghiệp dùng thử sớm.",
  youGetLabel: "Bạn nhận được",
  weAskLabel: "Chúng tôi cần",
  g1: "Dùng miễn phí trong thời gian pilot",
  g2: "Hỗ trợ tích hợp trực tiếp",
  g3: "Ảnh hưởng tới roadmap",
  a1: "Một buổi feedback mỗi tuần",
  a2: "Cho phép viết case study (khi bạn đồng ý)",

  fName: "Họ tên",
  fEmail: "Email công việc",
  fCompany: "Công ty",
  fSize: "Quy mô (không bắt buộc)",
  fApp: "App bạn đang có",
  fWant: "Bạn muốn AI làm gì?",
  namePlaceholder: "Nguyễn Văn A",
  emailPlaceholder: "ten@congty.vn",
  sizeUnset: "—",

  eNameText: "Vui lòng nhập họ tên.",
  eEmailText: "Email không hợp lệ.",
  eCompanyText: "Vui lòng nhập tên công ty.",
  eAppText: "Chọn một lựa chọn.",
  eWantText: "Mô tả ngắn công việc bạn muốn AI làm.",

  submitLabel: "Gửi đăng ký",
  submitSending: "Đang gửi…",
  formSuccess: "Đã nhận. Chúng tôi sẽ liên hệ trong vài ngày.",
  formAgain: "Gửi đăng ký khác",
  serverErrorText:
    "Không gửi được lúc này. Vui lòng thử lại, hoặc email hello@harnix.vn.",

  // --- faq ---------------------------------------------------------------
  faqHead: "Câu hỏi thường gặp",

  // --- waitlist ----------------------------------------------------------
  finalHead: "Sẵn sàng giao việc cho AI mà vẫn nắm từng bước?",
  waitIdle: "Chúng tôi chỉ gửi email khi có bản dùng thử.",
  waitBad: "Email không hợp lệ.",
  waitOk: "Đã ghi nhận email của bạn.",
  waitSending: "Đang gửi…",
  waitError: "Không gửi được lúc này. Vui lòng thử lại.",

  // --- footer ------------------------------------------------------------
  footTagline:
    "Nền tảng vận hành AI agent. Mỗi câu trả lời là một Run, ghi lại từng bước.",
} as const;

export type CopyKey = keyof typeof vi;

const en: Record<CopyKey, string> = {
  navHow: "How it works",
  navDemo: "Demo",
  navDev: "Developer",
  navBlog: "Blog",
  navFaq: "FAQ",
  ctaJoin: "Join the waitlist",
  ctaJoinShort: "Waitlist",
  ctaDemo: "Watch the demo",
  themeLabel: "Switch light/dark theme",
  menuOpen: "Open menu",
  menuClose: "Close menu",
  menuTitle: "Menu",
  langLabel: "Language",
  skipToContent: "Skip to main content",

  eyebrow: "AI AGENT OPERATIONS PLATFORM",
  statusPill: "In development · ",
  heroH1: "Harness every run.",
  heroSub:
    "Harnix lets businesses put AI agents into the apps they already have, and see every answer end to end: what the agent read, which tools it called, and what it cost.",
  sampleNote: "Sample content, for illustration.",
  heroFrameLabel: "Illustration of the Harnix console",
  heroDocLine: "Chính sách bảo hành.pdf · page 4",
  heroQuote: "“Customers may return an item within 30 days of delivery…”",

  worryHead: "Building an AI assistant is easy. Operating one is not.",
  w1t: "The AI answers wrong — who finds out?",
  w1b: "An off-the-shelf chatbot is a black box. You only learn there is a problem when a customer complains.",
  w2t: "Cost that moves with every question",
  w2b: "If you do not know what each answer costs, you cannot keep the budget under control.",
  w3t: "Where does customer data go?",
  w3b: "Internal documents and customer conversations have to stay separated, and be deletable when a customer asks.",

  labHow: "How it works",
  howHead: "From nothing to an assistant inside your app",
  s1t: "Load the knowledge",
  s1b: "Upload documents (PDF, DOCX, TXT, MD) into a knowledge base.",
  s2t: "Create an agent",
  s2b: "Pick your model, write the system prompt, attach knowledge bases and tools.",
  s3t: "Embed it in your app",
  s3b: "Your backend exchanges the API key for a short-lived token; your frontend mounts the chat widget.",
  tagAvailable: "Available",

  demoHead: "See the whole flow in {N} minutes",
  demoSub:
    "From an empty organisation to an AI assistant answering customers inside a sample app.",
  demoSoonPill: "Demo video coming soon",
  notifyCta: "Notify me when the video is up",
  playLabel: "Play the demo video",
  transcriptLink: "Read the transcript →",
  labChapters: "Video chapters",

  anatomyHead: "Anatomy of a Run",
  anatomySub: "Every answer is a Run, recorded step by step.",

  opHead: "Manage AI the way you manage a colleague",

  devHead: "For developers",
  devBadge: "Preview · M2",
  tab1Label: "1. Backend: exchange a token",
  tab2Label: "2. Frontend: mount the widget",
  codeCaption: "Illustrative code. The API is not final.",
  d1: "The API key never leaves your server",
  d2: "Streaming + citations",
  d3: "CSS-isolated widget (shadow DOM)",
  docsLink: "Read the integration docs →",
  docsSoon: "The docs are not published yet",
  docsSoonLabel: "Docs (coming soon)",
  docsLabel: "Docs",
  linkSoon: "Coming soon",

  blogHead: "Building in public",
  blogLink: "Read the blog →",
  blogEmptyTitle: "The first post is on its way",
  blogEmptyBody:
    "We will write up how Harnix gets built, one milestone at a time.",
  blogErrorText: "Could not load the posts.",
  retryLabel: "Try again",
  blogLoadingLabel: "Loading posts…",
  readingTime: "{N} min read",
  blogIndexTitle: "Blog",
  blogIndexSub: "A build log for Harnix, one milestone at a time.",
  backToBlog: "← All posts",
  blogNotFoundTitle: "Post not found",
  blogNotFoundBody: "This post does not exist or has been removed.",
  blogViOnlyNote: "This post is currently only available in Vietnamese.",

  partnerHead: "Become a design partner",
  partnerSub: "We are looking for 1–3 businesses to try it early.",
  youGetLabel: "You get",
  weAskLabel: "We ask for",
  g1: "Free use for the length of the pilot",
  g2: "Hands-on integration support",
  g3: "Influence over the roadmap",
  a1: "One feedback session a week",
  a2: "Permission to write a case study (once you agree)",

  fName: "Full name",
  fEmail: "Work email",
  fCompany: "Company",
  fSize: "Size (optional)",
  fApp: "The app you already have",
  fWant: "What do you want the AI to do?",
  namePlaceholder: "Jane Doe",
  emailPlaceholder: "you@company.com",
  sizeUnset: "—",

  eNameText: "Please enter your name.",
  eEmailText: "That email is not valid.",
  eCompanyText: "Please enter your company name.",
  eAppText: "Pick one option.",
  eWantText: "Briefly describe what you want the AI to do.",

  submitLabel: "Send application",
  submitSending: "Sending…",
  formSuccess: "Got it. We will be in touch within a few days.",
  formAgain: "Send another application",
  serverErrorText:
    "Could not send it right now. Please try again, or email hello@harnix.vn.",

  faqHead: "FAQ",

  finalHead: "Ready to hand work to AI and still see every step?",
  waitIdle: "We only email you when there is something to try.",
  waitBad: "That email is not valid.",
  waitOk: "Your email is on the list.",
  waitSending: "Sending…",
  waitError: "Could not send it right now. Please try again.",

  footTagline:
    "AI agent operations platform. Every answer is a Run, recorded step by step.",
};

const dictionaries: Record<Lang, Record<CopyKey, string>> = { vi, en };

export function translate(lang: Lang, key: CopyKey): string {
  return dictionaries[lang][key];
}

/* -------------------------------------------------------------------------
   Structured content, also complete in both languages.

   Identifiers stay as they are across languages: `step` values are the run
   log's own event names, `state` values are the system's own states, and
   `needs` values are milestone codes.
------------------------------------------------------------------------- */

export type Faq = { q: string; a: string };
export type Chapter = { label: string; needs: string; at: number };
export type TraceStep = {
  step: string;
  note: string;
  kind: TraceKind;
  state: string;
};
export type OpItem = { icon: OpIcon; title: string; body: string };
export type AppOption = { value: string; label: string };

const faqsByLang: Record<Lang, Faq[]> = {
  vi: [
    {
      q: "Harnix đã dùng được chưa?",
      a: "Chưa. Chúng tôi đang xây dựng và mở cho design partner trước. Tham gia waitlist để được báo khi mở.",
    },
    {
      q: "“Tự mang model” nghĩa là gì?",
      a: "Bạn dùng API key của nhà cung cấp LLM bạn chọn (OpenAI-compatible) hoặc model tự host có thể truy cập qua internet. Harnix không bán model.",
    },
    {
      q: "Dữ liệu của tôi lưu ở đâu, ai xem được?",
      a: "Mỗi doanh nghiệp có vùng dữ liệu riêng; người dùng cuối chỉ xem được hội thoại của chính họ; dữ liệu cá nhân xoá được theo yêu cầu.",
    },
    {
      q: "Có phụ thuộc ngành không?",
      a: "Không. Chuyên môn của agent đến từ tài liệu và cấu hình của bạn.",
    },
    {
      q: "Giá bao nhiêu?",
      a: "Chưa công bố. Design partner dùng miễn phí trong thời gian pilot.",
    },
  ],
  en: [
    {
      q: "Can I use Harnix yet?",
      a: "Not yet. We are still building, and opening to design partners first. Join the waitlist and we will tell you when it opens.",
    },
    {
      q: "What does “bring your own model” mean?",
      a: "You use the API key of whichever LLM provider you choose (OpenAI-compatible), or a self-hosted model reachable over the internet. Harnix does not sell models.",
    },
    {
      q: "Where is my data stored, and who can see it?",
      a: "Each business gets its own data space; end users only ever see their own conversations; personal data can be deleted on request.",
    },
    {
      q: "Is it tied to a particular industry?",
      a: "No. An agent's expertise comes from your documents and your configuration.",
    },
    {
      q: "What does it cost?",
      a: "Not announced yet. Design partners use it free for the length of the pilot.",
    },
  ],
};

/**
 * Demo chapters. `at` is the start offset in seconds — placeholder spacing
 * until the video is cut, and only surfaced once the demo is marked ready.
 */
const chaptersByLang: Record<Lang, Chapter[]> = {
  vi: [
    { label: "Đăng nhập, tổ chức trống", needs: "M0", at: 0 },
    { label: "Nạp tài liệu", needs: "M1", at: 15 },
    { label: "Tạo agent", needs: "M0", at: 30 },
    { label: "Thử và xem trace", needs: "M1+M3", at: 45 },
    { label: "Tạo API key", needs: "M0", at: 60 },
    { label: "Tích hợp vào app", needs: "M2", at: 75 },
    { label: "Người dùng cuối hỏi đáp", needs: "M2", at: 90 },
    { label: "Quay lại console", needs: "M3", at: 105 },
    { label: "Kết", needs: "—", at: 120 },
  ],
  en: [
    { label: "Sign in, empty organisation", needs: "M0", at: 0 },
    { label: "Load documents", needs: "M1", at: 15 },
    { label: "Create an agent", needs: "M0", at: 30 },
    { label: "Try it and read the trace", needs: "M1+M3", at: 45 },
    { label: "Create an API key", needs: "M0", at: 60 },
    { label: "Integrate it into an app", needs: "M2", at: 75 },
    { label: "An end user asks a question", needs: "M2", at: 90 },
    { label: "Back to the console", needs: "M3", at: 105 },
    { label: "Wrap-up", needs: "—", at: 120 },
  ],
};

const traceByLang: Record<Lang, TraceStep[]> = {
  vi: [
    {
      step: "user_message",
      note: "Khách hỏi: “Chính sách đổi trả trong bao lâu?”",
      kind: "ok",
      state: "completed",
    },
    {
      step: "tool_call knowledge_search",
      note: "AI tìm trong tài liệu “Chính sách bảo hành.pdf”.",
      kind: "info",
      state: "running",
    },
    {
      step: "tool_result · 3 chunks",
      note: "Tìm thấy 3 đoạn liên quan, có trích dẫn.",
      kind: "ok",
      state: "completed",
    },
    {
      step: "llm_call · model gpt-4o-mini",
      note: "Soạn câu trả lời từ các đoạn đó.",
      kind: "ok",
      state: "completed",
    },
    {
      step: "token_usage · 1,240 tokens",
      note: "Chi phí của đúng câu trả lời này, tính theo token in/out.",
      kind: "info",
      state: "measured",
    },
    {
      step: "state_change · completed",
      note: "Hoàn tất. Có thể dừng giữa chừng nếu cần.",
      kind: "ok",
      state: "completed",
    },
  ],
  en: [
    {
      step: "user_message",
      note: "A customer asks: “How long is the return window?”",
      kind: "ok",
      state: "completed",
    },
    {
      step: "tool_call knowledge_search",
      note: "The agent searches the “Chính sách bảo hành.pdf” document.",
      kind: "info",
      state: "running",
    },
    {
      step: "tool_result · 3 chunks",
      note: "Three relevant passages found, with citations.",
      kind: "ok",
      state: "completed",
    },
    {
      step: "llm_call · model gpt-4o-mini",
      note: "Drafts the answer from those passages.",
      kind: "ok",
      state: "completed",
    },
    {
      step: "token_usage · 1,240 tokens",
      note: "What this one answer cost, counted as tokens in and out.",
      kind: "info",
      state: "measured",
    },
    {
      step: "state_change · completed",
      note: "Finished. It can be stopped partway if you need to.",
      kind: "ok",
      state: "completed",
    },
  ],
};

const opsByLang: Record<Lang, OpItem[]> = {
  vi: [
    { icon: "eye", title: "Thấy mọi bước", body: "Trace đầy đủ cho mọi Run." },
    { icon: "stop", title: "Dừng được", body: "Huỷ một Run đang chạy." },
    {
      icon: "coin",
      title: "Biết chi phí",
      body: "Token và chi phí theo từng câu trả lời.",
    },
    {
      icon: "plug",
      title: "Tự chọn model",
      body: "Endpoint OpenAI-compatible hoặc tự host.",
    },
    {
      icon: "shield",
      title: "Dữ liệu tách riêng",
      body: "Mỗi doanh nghiệp một vùng dữ liệu; xoá dữ liệu cá nhân theo yêu cầu (NĐ 13/2023).",
    },
    {
      icon: "check",
      title: "Bền bỉ",
      body: "Worker gặp sự cố thì Run vẫn chạy tiếp và hoàn thành.",
    },
  ],
  en: [
    { icon: "eye", title: "See every step", body: "A full trace for every Run." },
    { icon: "stop", title: "Stoppable", body: "Cancel a Run while it is running." },
    {
      icon: "coin",
      title: "Know the cost",
      body: "Tokens and cost, answer by answer.",
    },
    {
      icon: "plug",
      title: "Bring your own model",
      body: "An OpenAI-compatible endpoint, or self-hosted.",
    },
    {
      icon: "shield",
      title: "Data kept apart",
      body: "One data space per business; personal data deleted on request (Decree 13/2023).",
    },
    {
      icon: "check",
      title: "Durable",
      body: "If a worker crashes, the Run carries on and finishes.",
    },
  ],
};

const appOptionsByLang: Record<Lang, AppOption[]> = {
  vi: [
    { value: "web", label: "Web" },
    { value: "mobile", label: "Mobile" },
    { value: "both", label: "Cả hai" },
  ],
  en: [
    { value: "web", label: "Web" },
    { value: "mobile", label: "Mobile" },
    { value: "both", label: "Both" },
  ],
};

export const getFaqs = (lang: Lang): Faq[] => faqsByLang[lang];
export const getChapters = (lang: Lang): Chapter[] => chaptersByLang[lang];
export const getTraceSteps = (lang: Lang): TraceStep[] => traceByLang[lang];
export const getOpItems = (lang: Lang): OpItem[] => opsByLang[lang];
export const getAppOptions = (lang: Lang): AppOption[] => appOptionsByLang[lang];

export const companySizes = ["1-10", "11-50", "51-200", "200+"] as const;

const EN_MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/**
 * Formatted here rather than through `Intl` so the server and the client always
 * produce the same string regardless of the runtime's locale data.
 */
export function formatDate(iso: string, lang: Lang): string {
  const [y, m, d] = iso.split("-");
  if (lang === "vi") return `${d}/${m}/${y}`;
  return `${EN_MONTHS[Number(m) - 1]} ${Number(d)}, ${y}`;
}

export const CODE_BACKEND = `// 1. Your backend — never expose the API key to the browser
const res = await fetch("https://api.harnix.vn/v1/end-user-tokens", {
  method: "POST",
  headers: { Authorization: \`Bearer \${process.env.HARNIX_API_KEY}\` },
  body: JSON.stringify({ end_user_id: user.id }),
});
const { token } = await res.json();`;

export const CODE_FRONTEND = `<!-- 2. Your frontend -->
<${"script"} src="https://cdn.harnix.vn/widget.js" defer></${"script"}>
<harnix-chat agent="agt_support" token="{{token}}"></harnix-chat>`;
