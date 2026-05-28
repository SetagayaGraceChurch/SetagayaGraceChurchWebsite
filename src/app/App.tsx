import { useEffect, useState } from "react";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import { InternalLink, SiteLayout } from "./components/SiteChrome";
import communityImgAsset from "../assets/749b7b591ff5db08477c679e6e5b9e0592ae764d.png";
import communitySectionImg from "../assets/CG.jpeg";
import eventCampImg from "../assets/event-camp.jpg";
import eventEaster2026Img from "../assets/event-easter-2026.png";
import eventGraceSchoolImg from "../assets/event-grace-school.jpeg";
import eventMensBbqImg from "../assets/event-mens-bbq.png";
import pastorImg from "../assets/pastor-photo.jpeg";
import welcomeArrivalImg from "../assets/welcome-arrival.jpg";
import welcomeEntranceImg from "../assets/welcome-entrance.jpg";
import welcomeWorshipImg from "../assets/welcome-worship.jpg";
import eventsData from "../data/generated/events.json";
import sermonsData from "../data/generated/sermons.json";
import staffData from "../data/generated/staff.json";

const heroImg = communityImgAsset;
const communityImg = communitySectionImg;
const sermons = sermonsData;
const homeSermons = sermons.slice(0, 3);
const events = eventsData;
const todayIso = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Tokyo" });
const ongoingEventItems = events.filter((event) => event.eventType === "ongoing");
const datedEventItems = events.filter((event) => event.eventType !== "ongoing");
const compareEventsByDate = (first: { date?: string }, second: { date?: string }) => {
  if (!first.date && !second.date) return 0;
  if (!first.date) return 1;
  if (!second.date) return -1;
  return first.date.localeCompare(second.date);
};
const upcomingEventItems = datedEventItems
  .filter((event) => !event.date || event.date >= todayIso)
  .slice()
  .sort(compareEventsByDate);
const pastEventItems = datedEventItems
  .filter((event) => event.date && event.date < todayIso)
  .slice()
  .sort((first, second) => second.date.localeCompare(first.date));
const featuredEvents = upcomingEventItems.filter((event) => event.featured);
const homeEvents = (featuredEvents.length > 0 ? [...featuredEvents, ...ongoingEventItems] : [...upcomingEventItems, ...ongoingEventItems]).slice(0, 3);
const staffMembers = staffData;
const aboutStaffPreview = staffMembers;
const beliefsHeroImg = "https://images.squarespace-cdn.com/content/v1/641963614d38536818d032af/652b01d3-7023-4711-89c5-2dbe09d364f4/Rembrandt.jpg";
const bibleBookOrder = [
  "創世記",
  "出エジプト記",
  "レビ記",
  "民数記",
  "申命記",
  "ヨシュア記",
  "士師記",
  "ルツ記",
  "サムエル記 第一",
  "サムエル記 第二",
  "列王記 第一",
  "列王記 第二",
  "歴代誌 第一",
  "歴代誌 第二",
  "エズラ記",
  "ネヘミヤ記",
  "エステル記",
  "ヨブ記",
  "詩篇",
  "箴言",
  "伝道者の書",
  "雅歌",
  "イザヤ書",
  "エレミヤ書",
  "哀歌",
  "エゼキエル書",
  "ダニエル書",
  "ホセア書",
  "ヨエル書",
  "アモス書",
  "オバデヤ書",
  "ヨナ書",
  "ミカ書",
  "ナホム書",
  "ハバクク書",
  "ゼパニヤ書",
  "ハガイ書",
  "ゼカリヤ書",
  "マラキ書",
  "マタイの福音書",
  "マルコの福音書",
  "ルカの福音書",
  "ヨハネの福音書",
  "使徒の働き",
  "ローマ人への手紙",
  "コリント人への手紙 第一",
  "コリント人への手紙 第二",
  "ガラテヤ人への手紙",
  "エペソ人への手紙",
  "ピリピ人への手紙",
  "コロサイ人への手紙",
  "テサロニケ人への手紙 第一",
  "テサロニケ人への手紙 第二",
  "テモテへの手紙 第一",
  "テモテへの手紙 第二",
  "テトスへの手紙",
  "ピレモンへの手紙",
  "ヘブル人への手紙",
  "ヤコブの手紙",
  "ペテロの手紙 第一",
  "ペテロの手紙 第二",
  "ヨハネの手紙 第一",
  "ヨハネの手紙 第二",
  "ヨハネの手紙 第三",
  "ユダの手紙",
  "ヨハネの黙示録",
];

const eventImages = {
  camp: eventCampImg,
  easter: eventEaster2026Img,
  "grace-school": eventGraceSchoolImg,
  "kids-gospel": eventGraceSchoolImg,
  "mens-bbq": eventMensBbqImg,
} as const;

type EventImageKey = keyof typeof eventImages;

function getEventImage(event: { imageKey?: string; imageUrl?: string }) {
  if (event.imageUrl) return event.imageUrl;
  if (event.imageKey && event.imageKey in eventImages) {
    return eventImages[event.imageKey as EventImageKey];
  }
  return eventGraceSchoolImg;
}

const welcomePlaceholderImages = {
  arrival: welcomeArrivalImg,
  entrance: welcomeEntranceImg,
  worship: welcomeWorshipImg,
} as const;

const newLifeBookletCards = [
  {
    page: 1,
    title: "人生について、こんなことを考えたことはありませんか",
    body: [
      "なぜ人は幸せを求めても満たされないのでしょうか",
      "なぜ人間関係はうまくいかないことが多いのでしょうか",
      "なぜ不安や孤独を感じるのでしょうか",
      "もしかすると、人生にはまだ知らない大切なことがあるのかもしれません。",
    ],
  },
  {
    page: 2,
    title: "聖書は、人間の人生についてこう教えています",
    body: [
      "人は偶然に生まれたのではありません。",
      "愛なる神が、私たちを造りました。",
      "神は人を、神を知るために、神と共に生きるために、喜びに満ちた人生を生きるために造られました。",
    ],
  },
  {
    page: 3,
    title: "神が望まれる人生",
    body: [
      "イエスは言われました。「わたしが来たのは、人々が命を得て、豊かに得るためです。」ヨハネ10:10",
      "神が与えたい人生には、愛、喜び、平安、忍耐、優しさ、誠実、柔和、自制があります。（ガラテヤ5:22）",
    ],
  },
  {
    page: 4,
    title: "しかし、現実の人生はどうでしょうか",
    body: [
      "多くの人が、心の空しさ、人間関係の難しさ、不安、孤独、自分の弱さを感じています。",
      "なぜこのようなことが起こるのでしょうか？",
    ],
  },
  {
    page: 5,
    title: "聖書はその理由を教えています",
    body: [
      "人は神から離れて生きてしまったからです。",
      "人は神ではなく自分を人生の中心にして生きるようになりました。",
      "これを聖書は罪と呼びます。",
    ],
  },
  {
    page: 6,
    title: "罪とは何でしょうか",
    body: [
      "罪とは、神よりも自分を中心にして生きることです。",
      "その結果、感謝を忘れ、人を傷つけ、欲に支配され、心が暗くなります。",
      "聖書はこう言います。「すべての人は罪を犯した」ローマ3:23",
    ],
  },
  {
    page: 7,
    title: "罪の結果",
    body: [
      "罪は神との関係を壊しました。",
      "人は神から離れ、本当の命を失い、心が空しくなりました。",
      "聖書はこれを霊的な死と呼びます。エペソ2:1",
    ],
  },
  {
    page: 8,
    title: "しかし神は人を見捨てませんでした",
    body: [
      "神は人を愛しています。",
      "神は壊れてしまった関係を回復する道を備えてくださいました。",
    ],
  },
  {
    page: 9,
    title: "神の解決",
    body: [
      "神は御子イエス・キリストをこの世界に送られました。",
      "イエスは罪のない方でした。",
      "そして人の罪のために十字架で死なれました。",
    ],
  },
  {
    page: 10,
    title: "十字架で起こったこと",
    body: [
      "イエスは私たちの罪の罰を代わりに受けました。",
      "聖書は言います。「罪の報酬は死ですが、神の賜物は永遠の命です。」ローマ6:23",
    ],
  },
  {
    page: 11,
    title: "イエスはよみがえりました",
    body: [
      "イエスは死から復活しました。",
      "それによって罪の力と死の力に勝利しました。",
      "今も生きておられます。",
    ],
  },
  {
    page: 12,
    title: "神は新しい命を与えます",
    body: [
      "イエスを信じる人には、罪の赦し、神との新しい関係、新しい心、永遠の命が与えられます。",
    ],
  },
  {
    page: 13,
    title: "人は二つの生き方のどちらかにいます",
    body: [
      "1. 自分中心の人生",
      "2. 神と共に生きる人生",
      "あなたはどちらでしょうか。",
    ],
  },
  {
    page: 14,
    title: "新しい人生を受け取る方法",
    body: [
      "聖書は二つのことを教えています。",
      "悔い改める: 自分中心の生き方を離れること",
      "信じる: イエス・キリストを救い主として受け入れること",
    ],
  },
  {
    page: 15,
    title: "心から神に語りかけてください",
    body: [
      "「神様、私は自分中心に生きてきました。",
      "私の罪を赦してください。",
      "イエス・キリストが私の罪のために死んでくださったことを信じます。",
      "今日からイエスを私の救い主として受け入れます。",
      "私の人生を導いてください。」",
    ],
  },
  {
    page: 16,
    title: "新しい人生を歩むために",
    body: [
      "神との関係はこれから成長します。",
      "大切なこと: 神に祈る、聖書を読む、教会で共に学ぶ、神の愛を人に伝える",
    ],
  },
  {
    page: 17,
    title: "さらに知りたい方へ",
    body: [
      "聖書やキリスト教についてもっと知りたい方は、こちらをご覧ください。",
      "教会のページや案内から、さらに学びを進めることができます。",
    ],
  },
] as const;

const sectionTitleClass = "mb-4 text-3xl leading-tight text-[#203126] sm:text-4xl";
const eyebrowClass = "mb-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#83996e]";
const primaryButtonClass = "inline-flex items-center justify-center rounded-full bg-[#83996e] px-6 py-3 text-sm font-medium text-white shadow-[0_14px_30px_rgba(76,106,82,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#70825d]";
const secondaryButtonClass = "inline-flex items-center justify-center rounded-full border border-white/60 bg-white/12 px-6 py-3 text-sm font-medium text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20";
const textLinkClass = "inline-flex items-center gap-2 text-sm font-medium text-[#70825d] transition-colors hover:text-[#5b6b4b]";

function WaveDivider({ color, flip = false }: { color: string; flip?: boolean }) {
  return (
    <div aria-hidden className={`relative -mt-px h-12 w-full overflow-hidden ${flip ? "rotate-180" : ""}`}>
      <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="block h-full w-full">
        <path
          fill={color}
          d="M0,32 C180,112 360,-24 540,56 C720,136 900,8 1080,56 C1240,96 1360,72 1440,56 L1440,120 L0,120 Z"
        />
      </svg>
    </div>
  );
}

export type PageKey =
  | "home"
  | "welcome"
  | "about"
  | "beliefs"
  | "staff"
  | "worship"
  | "christianity"
  | "community"
  | "events"
  | "eventDetail"
  | "sermons"
  | "access"
  | "notFound";

export const pagePaths: Record<PageKey, string> = {
  home: "/",
  welcome: "/welcome",
  about: "/aboutourchurch",
  beliefs: "/beliefs",
  staff: "/staff",
  worship: "/worship",
  christianity: "/christianity",
  community: "/community",
  events: "/events",
  eventDetail: "/events",
  sermons: "/sermons",
  access: "/access",
  notFound: "/404",
};

export function HomePage() {
  return (
    <>
      <section className="relative flex min-h-[640px] items-center overflow-hidden bg-[#314535]">
        <ImageWithFallback src={heroImg} alt="教会の集まり" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(22,32,26,0.84)_0%,rgba(28,40,33,0.62)_45%,rgba(39,53,43,0.18)_100%)]" />
        <div aria-hidden className="absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.22),transparent_70%)]" />
        <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-10 px-6 py-20 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div className="max-w-2xl">
            <h1 className="mb-6 max-w-xl text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
              世田谷にある
              <br />
              キリスト教会です
            </h1>
            <p className="mb-8 max-w-2xl text-base leading-8 text-white/82 sm:text-lg">
              世田谷グレースチャーチの目標は神様を愛し、
              <br className="hidden sm:block" />
              世田谷を愛することです。
            </p>
            <div className="flex flex-wrap gap-3">
              <InternalLink href="/welcome" className={primaryButtonClass}>
                初めての方へ
              </InternalLink>
              <InternalLink href="/worship" className={secondaryButtonClass}>
                礼拝のご案内
              </InternalLink>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="ml-auto max-w-sm rounded-[28px] border border-white/20 bg-white/10 p-6 text-white shadow-[0_25px_80px_rgba(17,25,20,0.28)] backdrop-blur-md">
              <p className="text-[11px] uppercase tracking-[0.28em] text-white/65">初めての方へのご案内</p>
              <div className="mt-5 space-y-4">
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-sm text-white/70">子どもクラス</p>
                  <p className="mt-1 text-xl">14:00 - 14:45</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-sm text-white/70">礼拝</p>
                  <p className="mt-1 text-xl">15:00 - 16:30</p>
                </div>
                <p className="pt-2 text-sm leading-6 text-white/78">
                  日本宣教会 代田教会
                  <br />
                  世田谷区羽根木1-19-2
                </p>
              </div>
            </div>
          </div>
        </div>
        <div aria-hidden className="pointer-events-none absolute bottom-0 left-0 h-14 w-full overflow-hidden">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="block h-full w-full">
            <path
              fill="#f1f5ec"
              d="M0,56 C180,116 360,-16 540,56 C720,128 900,8 1080,56 C1240,96 1360,72 1440,56 L1440,120 L0,120 Z"
            />
          </svg>
        </div>
      </section>

      <section className="bg-[#f1f5ec] py-8">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col gap-5 rounded-[30px] border border-[#dce7d4] bg-white px-6 py-6 shadow-[0_18px_45px_rgba(83,110,76,0.08)] md:flex-row md:items-center md:justify-between md:px-8">
            <div className="max-w-3xl">
              <h2 className="text-2xl leading-tight text-[#203126] sm:text-3xl">初めての方へ</h2>
              <p className="mt-3 text-sm leading-7 text-[#56645a] sm:text-base">
                初めて教会に来られる方も歓迎しています。見学だけでも大丈夫です。服装や持ち物に決まりはありません。
                礼拝の流れ、子どもクラス、アクセス方法、お問い合わせ先をこちらにまとめています。
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <InternalLink href="/welcome" className={primaryButtonClass}>
                初めての方へ
              </InternalLink>
              <InternalLink
                href="/access"
                className="inline-flex items-center justify-center rounded-full border border-[#cfdbc6] bg-[#f7faf3] px-6 py-3 text-sm font-medium text-[#70825d] transition-colors hover:bg-[#edf4e5]"
              >
                アクセスと礼拝の流れ
              </InternalLink>
            </div>
          </div>
        </div>
      </section>
      <WaveDivider color="#ffffff" flip />

      <section className="bg-[#eff4e8] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div>
              <h2 className={sectionTitleClass}>日曜日の礼拝</h2>
              <p className="mb-8 max-w-xl text-sm leading-7 text-[#56645a] sm:text-base">
                初めて来られる方にもわかりやすいように、時間と場所をシンプルにまとめています。
                見学だけでも大丈夫です。
              </p>
              <div className="mb-6 rounded-[28px] border border-[#d7e1cb] bg-white p-6 shadow-[0_18px_50px_rgba(102,128,89,0.08)]">
                <p className="text-xs uppercase tracking-[0.22em] text-[#7b8b7f]">場所</p>
                <p className="mt-2 text-xl text-[#203126]">日本宣教会 代田教会</p>
                <p className="mt-2 text-sm text-[#56645a]">世田谷区羽根木1-19-2</p>
              </div>
              <div className="mb-8 space-y-4">
                <div className="flex items-center gap-4 rounded-[24px] border border-white/80 bg-white p-5 shadow-[0_18px_40px_rgba(99,127,89,0.08)]">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-[#fcf1c9]">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d4a020" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                  </div>
                  <div>
                    <p className="mb-0.5 text-xs uppercase tracking-[0.18em] text-[#7b8b7f]">子どもクラス</p>
                    <p className="text-lg text-[#203126]">14:00 - 14:45</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 rounded-[24px] border border-white/80 bg-white p-5 shadow-[0_18px_40px_rgba(99,127,89,0.08)]">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-[#dfead2]">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4a80c4" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                  </div>
                  <div>
                    <p className="mb-0.5 text-xs uppercase tracking-[0.18em] text-[#7b8b7f]">礼拝</p>
                    <p className="text-lg text-[#203126]">15:00 - 16:30</p>
                  </div>
                </div>
              </div>
              <a
                href="https://www.google.com/maps?q=%E6%9D%B1%E4%BA%AC%E9%83%BD%E4%B8%96%E7%94%B0%E8%B0%B7%E5%8C%BA%E7%BE%BD%E6%A0%B9%E6%9C%A8%EF%BC%91%E4%B8%81%E7%9B%AE%EF%BC%91%EF%BC%99%E2%88%92%EF%BC%92"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm text-[#56645a] transition-colors hover:text-[#70825d]"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
                東京都世田谷区羽根木1丁目19-2
              </a>
              <div className="mt-6">
                <InternalLink href="/worship" className={primaryButtonClass}>
                  礼拝について詳しく
                </InternalLink>
              </div>
            </div>
            <div className="overflow-hidden rounded-[32px] border border-white/70 bg-white p-3 shadow-[0_20px_60px_rgba(79,107,73,0.12)]">
              <iframe
                title="世田谷グレースチャーチ 地図"
                src="https://www.google.com/maps?q=%E4%B8%96%E7%94%B0%E8%B0%B7%E5%8C%BA%E7%BE%BD%E6%A0%B9%E6%9C%A8%EF%BC%91%E4%B8%81%E7%9B%AE%EF%BC%91%EF%BC%99%E2%88%92%EF%BC%92&output=embed"
                className="h-80 w-full rounded-[24px] border-0 md:h-[28rem]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>
      <WaveDivider color="#ffffff" flip />

      <section className="bg-[#f7f7f3] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div className="h-80 overflow-hidden rounded-[32px] border border-white/70 shadow-[0_24px_70px_rgba(60,88,65,0.14)]">
              <ImageWithFallback src={communityImg} alt="礼拝後の交わり" className="h-full w-full object-cover" />
            </div>
            <div>
              <h2 className={sectionTitleClass}>世田谷グレースチャーチについて</h2>
              <p className="text-sm leading-7 text-[#56645a] sm:text-base">
                聖書のことばを大切にしながら、地域の方々が希望と励ましを見つけられる
                温かなコミュニティを目指しています。
              </p>
              <InternalLink href="/about" className={`mt-6 ${textLinkClass}`}>
                教会について
              </InternalLink>
            </div>
          </div>
        </div>
      </section>
      <WaveDivider color="#ffffff" flip />

      <section className="bg-[#eff4e8] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <h2 className={sectionTitleClass}>キリスト教とは？</h2>
              <p className="text-sm leading-7 text-[#56645a] sm:text-base">
                キリスト教は、イエス・キリストの教えに基づく信仰です。
                聖書を通して、愛、赦し、希望について学びます。
              </p>
              <div className="mt-6">
                <InternalLink href="/christianity" className={primaryButtonClass}>
                  キリスト教について
                </InternalLink>
              </div>
            </div>
            <div className="rounded-[30px] border border-[#dfe7d6] bg-white p-8 shadow-[0_16px_35px_rgba(91,120,84,0.06)]">
              <p className="text-sm leading-7 text-[#56645a] sm:text-base">
                まだよく知らない方も大丈夫です。基本的なことから、やさしく学べる
                専用ページを用意しています。
              </p>
              <div className="mt-6">
                <InternalLink href="/welcome" className={textLinkClass}>
                  初めての方へ
                </InternalLink>
              </div>
            </div>
          </div>
        </div>
      </section>
      <WaveDivider color="#ffffff" flip />

      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 flex items-end justify-between gap-6">
            <div>
              <h2 className={sectionTitleClass}>教会の日常</h2>
              <p className="max-w-2xl text-sm leading-7 text-[#56645a] sm:text-base">
                礼拝、交わり、学びの時間を通して、教会の雰囲気が伝わる写真をまとめています。
              </p>
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-[1.15fr_0.85fr]">
            <div className="overflow-hidden rounded-[32px] border border-[#eef2e7] shadow-[0_24px_70px_rgba(60,88,65,0.12)]">
              <ImageWithFallback src={heroImg} alt="礼拝の様子" className="h-full min-h-[360px] w-full object-cover" />
            </div>
            <div className="grid h-full grid-rows-2 gap-5">
              <div className="overflow-hidden rounded-[28px] border border-[#eef2e7] shadow-[0_18px_45px_rgba(60,88,65,0.1)]">
                <ImageWithFallback src={communityImg} alt="交わりの時間" className="block h-full w-full object-cover" />
              </div>
              <div className="overflow-hidden rounded-[28px] border border-[#eef2e7] shadow-[0_18px_45px_rgba(60,88,65,0.1)]">
                <ImageWithFallback src={pastorImg} alt="牧師との会話" className="block h-full w-full object-cover object-center" />
              </div>
            </div>
          </div>
        </div>
      </section>
      <WaveDivider color="#eff4e8" />

      <section className="bg-[#eff4e8] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 text-center">
            <h2 className={sectionTitleClass}>イベント</h2>
            <p className="mx-auto max-w-2xl text-sm leading-7 text-[#56645a] sm:text-base">
              これから予定されている集まりや特別イベントです。初めての方が参加しやすい機会もあります。
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {homeEvents.map((event) => (
              <article key={event.title} className="overflow-hidden rounded-[30px] border border-[#dfe7d6] bg-white shadow-[0_20px_40px_rgba(91,120,84,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#cfdcc5] hover:shadow-[0_24px_48px_rgba(91,120,84,0.1)]">
                <InternalLink href={`/events/${event.slug}`} className="block bg-[#f4f7ef] p-3">
                  <ImageWithFallback src={getEventImage(event)} alt={event.title} className="aspect-[4/3] w-full rounded-[22px] object-contain" />
                </InternalLink>
                <div className="p-7 pt-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#7b8b7f]">{event.dateLabel || event.date}</p>
                  <h3 className="mt-3 text-2xl text-[#203126]">{event.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-[#56645a]">{event.summary || event.description}</p>
                  <div className="mt-6">
                  <InternalLink href={`/events/${event.slug}`} className="inline-flex text-sm font-medium text-[#70825d] hover:underline">
                    詳しく見る
                  </InternalLink>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-8 text-center">
            <InternalLink href="/events" className={primaryButtonClass}>
              イベントを見る
            </InternalLink>
          </div>
        </div>
      </section>
      <WaveDivider color="#ffffff" flip />

      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 text-center">
            <h2 className={sectionTitleClass}>メッセージ</h2>
            <p className="mt-3 text-sm leading-7 text-[#56645a]">毎週の聖書メッセージをオンラインで聞くことができます。</p>
          </div>
          <div className="mx-auto max-w-3xl space-y-4">
            {homeSermons.map((sermon) => (
              <div key={sermon.id} className="group flex cursor-pointer items-center gap-5 rounded-[26px] border border-[#e8eee1] bg-[linear-gradient(180deg,#ffffff_0%,#f7f9f4_100%)] p-5 shadow-[0_18px_40px_rgba(89,114,80,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#dce6d3] hover:shadow-[0_22px_45px_rgba(89,114,80,0.1)]">
                <button className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#83996e] shadow-[0_10px_20px_rgba(76,106,82,0.18)] transition-colors group-hover:bg-[#70825d]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                </button>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-lg text-[#203126]">{sermon.title}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[#8a968d]">{sermon.dateLabel} · {sermon.speaker}</p>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <InternalLink href="/sermons" className="text-sm font-medium text-[#70825d] hover:underline">
              すべての説教を見る →
            </InternalLink>
          </div>
        </div>
      </section>

      <section className="bg-[linear-gradient(135deg,#83996e_0%,#70825d_100%)] py-24 text-center text-white">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="mb-4 text-3xl leading-tight text-white sm:text-4xl">どなたでも歓迎します</h2>
          <p className="mb-8 text-sm leading-7 text-white/84 sm:text-base">
            教会が初めての方も歓迎します。見学だけでも大丈夫です。
            <br />
            質問があればお気軽にご連絡ください。
            <br />
            一人でも、ご家族でも、安心してお越しいただけます。
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <InternalLink href="/welcome" className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-medium text-[#70825d] transition-colors hover:bg-[#f1f5ec]">
              初めての方へ
            </InternalLink>
            <InternalLink href="/access" className="inline-flex items-center justify-center rounded-full border border-white/35 bg-[#647553]/48 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#647553]/66">
              アクセス
            </InternalLink>
          </div>
        </div>
      </section>
    </>
  );
}

export function WelcomePage() {
  const checklist = [
    "教会がどんな場所か",
    "日曜日の礼拝で何をするか",
    "どんな服装で行けばよいか",
    "子どもクラスがあるか",
    "日本語で参加できるか",
    "どこに行けばよいか",
    "だれに声をかければよいか",
  ];

  return (
    <>
      <section className="bg-[linear-gradient(135deg,#eef4e8_0%,#f8f6f0_100%)] py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <h1 className="mb-6 max-w-2xl text-4xl leading-tight text-[#203126] sm:text-5xl">初めての方へ</h1>
            <p className="max-w-2xl text-base leading-8 text-[#56645a] sm:text-lg">
              初めて教会に来られる方のために、安心して一歩を踏み出せるよう
              必要な情報をひとつにまとめました。わからないことがあれば、
              見学だけでもお気軽にお越しください。
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <InternalLink href="/worship" className={primaryButtonClass}>
                礼拝のご案内
              </InternalLink>
              <a href="mailto:info@setagaya-church.jp" className="inline-flex items-center justify-center rounded-full border border-[#cfdbc6] bg-white px-6 py-3 text-sm font-medium text-[#70825d] transition-colors hover:bg-[#f4f8ef]">
                お問い合わせ
              </a>
            </div>
          </div>
          <div className="rounded-[32px] border border-white/80 bg-white p-7 shadow-[0_24px_60px_rgba(79,107,73,0.12)]">
            <p className="text-sm font-medium uppercase tracking-[0.28em] text-[#7b8b7f]">初めての方チェックリスト</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {checklist.map((item) => (
                <div key={item} className="rounded-[22px] bg-[#f5f8ef] px-4 py-4 text-sm leading-6 text-[#445447]">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: "どんな教会ですか？",
                text: "世田谷グレースチャーチは、聖書を学びながら神様の愛と希望を知っていく小さくて温かい教会です。信仰の有無にかかわらず歓迎しています。",
              },
              {
                title: "どんな人が来ていますか？",
                text: "地域に住む方、ご家族、学生、社会人など、さまざまな方が集まっています。教会が初めての方も少なくありません。",
              },
              {
                title: "礼拝では何をしますか？",
                text: "賛美、聖書のお話、お祈りを行います。特別な知識は必要なく、まずは見て聞いていただくだけでも大丈夫です。",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-[30px] border border-[#edf1e7] bg-[linear-gradient(180deg,#ffffff_0%,#f5f8ef_100%)] p-8 shadow-[0_20px_40px_rgba(91,120,84,0.06)]">
                <h2 className="mb-4 text-2xl leading-tight text-[#203126]">{item.title}</h2>
                <p className="text-sm leading-7 text-[#56645a]">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f8f6f0] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10">
            <h2 className={sectionTitleClass}>気になることを先にご案内します</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[
              ["どんな服装で行けばよいですか？", "普段着で大丈夫です。特別な服装や持ち物は必要ありません。"],
              ["クリスチャンでなくても行けますか？", "はい。まだ信じていない方、教会に慣れていない方も歓迎しています。"],
              ["子ども連れでも大丈夫ですか？", "はい。14:00から子どもクラスがあります。"],
              ["どんな言語が使われますか？", "主に日本語です。必要に応じてご案内もできます。"],
              ["どんな人が来ていますか？", "地域の方、ご家族、学生、社会人など幅広い方が集まっています。"],
              ["礼拝の後はどうなりますか？", "お茶を飲みながら気軽に話せる交わりの時間があります。すぐに帰ることもできます。"],
            ].map(([title, text]) => (
              <div key={title} className="rounded-[28px] border border-[#e9ede3] bg-white p-7 shadow-[0_16px_35px_rgba(91,120,84,0.05)]">
                <h3 className="mb-3 text-xl text-[#203126]">{title}</h3>
                <p className="text-sm leading-7 text-[#56645a]">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10">
            <h2 className={sectionTitleClass}>当日のイメージ</h2>
            <p className="max-w-2xl text-sm leading-7 text-[#56645a] sm:text-base">
              実際の到着から交わりまでをイメージしやすいように、写真を並べています。
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {[
              ["到着の様子", welcomePlaceholderImages.arrival],
              ["建物入口", welcomePlaceholderImages.entrance],
              ["礼拝の様子", welcomePlaceholderImages.worship],
              ["交わりの時間", communityImg],
            ].map(([title, src], index) => (
              <div key={`${title}-${index}`} className="overflow-hidden rounded-[28px] border border-[#eef2e7] bg-white shadow-[0_18px_45px_rgba(60,88,65,0.1)]">
                <ImageWithFallback src={src as string} alt={title as string} className="h-52 w-full object-cover" />
                <div className="p-5">
                  <p className="text-lg text-[#203126]">{title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#eff4e8] py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="overflow-hidden rounded-[32px] border border-white/70 shadow-[0_24px_70px_rgba(60,88,65,0.14)]">
            <ImageWithFallback src={communityImg} alt="教会の交わり" className="h-full min-h-[380px] w-full object-cover" />
          </div>
          <div>
            <p className={eyebrowClass}>What To Expect</p>
            <h2 className={sectionTitleClass}>安心して来ていただくために</h2>
            <div className="space-y-5 text-sm leading-7 text-[#56645a] sm:text-base">
              <p>
                服装は普段着で大丈夫です。持ち物にも決まりはありません。
                聖書をお持ちでなくても問題ありません。
              </p>
              <p>
                子どもクラスは14:00から始まります。ご家族で来られる方も安心してご参加いただけます。
              </p>
              <p>
                礼拝は主に日本語で行っています。わからないことがあれば、スタッフがやさしくご案内します。
              </p>
              <p>
                初めて来られた方には、無理に参加や発言をお願いすることはありません。
                後ろの席で静かに見学していただくこともできます。
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f7f7f3] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
            <div className="rounded-[32px] border border-[#e4eadf] bg-white p-8 shadow-[0_18px_45px_rgba(83,110,76,0.08)]">
              <p className={eyebrowClass}>Access</p>
              <h2 className={sectionTitleClass}>場所とアクセス</h2>
              <p className="text-sm leading-7 text-[#56645a] sm:text-base">
                日本宣教会 代田教会
                <br />
                世田谷区羽根木1-19-2
              </p>
              <div className="mt-6 space-y-4">
                <div className="rounded-[24px] bg-[#f5f8ef] p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#7b8b7f]">子どもクラス</p>
                  <p className="mt-1 text-lg text-[#203126]">14:00 - 14:45</p>
                </div>
                <div className="rounded-[24px] bg-[#f5f8ef] p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#7b8b7f]">礼拝</p>
                  <p className="mt-1 text-lg text-[#203126]">15:00 - 16:30</p>
                </div>
              </div>
              <InternalLink href="/access" className={`mt-6 ${textLinkClass}`}>
                アクセスを見る
              </InternalLink>
            </div>

            <div className="rounded-[32px] border border-[#e4eadf] bg-white p-8 shadow-[0_18px_45px_rgba(83,110,76,0.08)]">
              <p className={eyebrowClass}>Contact</p>
              <h2 className={sectionTitleClass}>ご質問がある方へ</h2>
              <div className="space-y-4 text-sm leading-7 text-[#56645a] sm:text-base">
                <p>初めて来る前に確認したいことがあれば、どうぞお気軽にご連絡ください。</p>
                <p>お子さま連れ、言語面の不安、アクセス方法など、どんな小さなことでも大丈夫です。</p>
                <p>
                  メール:
                  <a className="ml-2 font-medium text-[#70825d] hover:underline" href="mailto:info@setagaya-church.jp">
                    info@setagaya-church.jp
                  </a>
                </p>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="mailto:info@setagaya-church.jp" className={primaryButtonClass}>
                  お問い合わせ
                </a>
                <InternalLink href="/" className="inline-flex items-center justify-center rounded-full border border-[#cfdbc6] bg-[#f7faf3] px-6 py-3 text-sm font-medium text-[#70825d] transition-colors hover:bg-[#edf4e5]">
                  ホームへ戻る
                </InternalLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export function AboutPage() {
  return (
    <>
      <section className="bg-[linear-gradient(135deg,#eef4e8_0%,#f8f6f0_100%)] py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h1 className="mb-6 max-w-3xl text-4xl leading-tight text-[#203126] sm:text-5xl">教会について</h1>
          <p className="max-w-3xl text-base leading-8 text-[#56645a] sm:text-lg">
            世田谷グレースチャーチは、神様を愛し、世田谷を愛することを目標に、
            世田谷の人々が神の栄光をあらわし、永遠に神を喜ぶコミュニティが広がっていくことを願って歩んでいます。
            また、世田谷に根ざした地域の教会として、日本の方も海外の方も共に集まり、聖書を学び、
            礼拝をささげ、地域に仕えることを大切にしています。
          </p>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="overflow-hidden rounded-[32px] border border-[#eef2e7] bg-white shadow-[0_24px_70px_rgba(60,88,65,0.12)]">
            <ImageWithFallback src={pastorImg} alt="ジョー・コンドン牧師" className="h-full min-h-[420px] w-full object-cover object-top" />
          </div>
          <div>
            <h2 className={sectionTitleClass}>牧師からのご挨拶</h2>
            <div className="space-y-5 text-sm leading-7 text-[#56645a] sm:text-base">
              <p>
                世田谷グレースチャーチへようこそ。ジョー・コンドン牧師が初めて日本に来たのは1999年、
                早稲田大学の交換留学生だった時でした。東京に着いてすぐに、日本の方々の優しさと都市の美しさに心を動かされました。
              </p>
              <p>
                2015年に家族で東京へ移り、月島で2年間、その後三重で2年間を過ごしましたが、
                長期的な願いはいつも東京で教会を開拓することでした。2020年に松原へ移り、
                大畑瑠花さんと共に世田谷グレースチャーチを始めました。2022年には岩崎光男さんファミリー、
                2023年にはジェイソン・シェーファー宣教師もチームに加わりました。
              </p>
              <p>
                人生はつらいものです。その現実を無視するのではなく、その中でイエス・キリストによる希望と癒しを
                見いだしていただきたいと願っています。私たちの目的は、神様を愛し、世田谷を愛することです。
              </p>
              <p>
                人生で一度も教会に行ったことのない方も、幼い頃から教会に親しんできた方も、
                世田谷グレースで安らぎ、希望、成長、そして本物のコミュニティを見つけていただけたらと思います。
                礼拝、イベント、聖書の学び会では、カジュアルでアットホームな雰囲気の中で、どなたでも歓迎しています。
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#eff4e8] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className={sectionTitleClass}>教会のビジョン</h2>
            <p className="text-lg leading-9 text-[#304034] sm:text-2xl sm:leading-[2.4rem]">
              世田谷グレースチャーチは、
              世田谷の人々が神の栄光をあらわし、
              永遠に神を喜ぶコミュニティを広めていくために存在しています。
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12">
            <h2 className={sectionTitleClass}>教会の主な価値</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: "好奇心",
                text: "神様がすでに世田谷の人々の歩みの中で働いておられることを信じ、裁くよりも訪ね、答える前に理解しようと耳を傾ける姿勢を大切にします。",
              },
              {
                title: "祝い",
                text: "神様の良い贈り物と恵みを受け取り、日常の食卓や交わりの中で共に喜び、感謝し、神様の良さをあらわしていく共同体でありたいと願っています。",
              },
              {
                title: "あわれみ",
                text: "イエス・キリストの福音の中心にあるあわれみに倣い、隣人の必要を見つけ、犠牲をいとわずに愛し、世田谷の人々に主のやさしさを届けたいと願っています。",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-[30px] border border-[#edf1e7] bg-[linear-gradient(180deg,#ffffff_0%,#f5f8ef_100%)] p-8 shadow-[0_20px_40px_rgba(91,120,84,0.06)]">
                <h3 className="mb-4 text-2xl leading-tight text-[#203126]">{item.title}</h3>
                <p className="text-sm leading-7 text-[#56645a]">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f7f7f3] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-[30px] border border-[#edf1e7] bg-[linear-gradient(180deg,#ffffff_0%,#f5f8ef_100%)] p-8 shadow-[0_20px_40px_rgba(91,120,84,0.06)]">
              <h2 className={sectionTitleClass}>私たちが信じていること</h2>
              <p className="text-sm leading-7 text-[#56645a] sm:text-base">
                神様が世界を造られ、イエス・キリストを通して救いを与えてくださることを信じています。
                聖書は教会の土台であり、礼拝、学び、日々の歩みの中心にあります。
              </p>
              <p className="mt-4 text-sm leading-7 text-[#56645a] sm:text-base">
                教理や信仰告白についてさらに詳しく知りたい方のために、信仰告白のページを用意しています。
              </p>
              <div className="mt-6">
                <InternalLink href="/beliefs" className="inline-flex items-center justify-center rounded-full border border-[#cbd8c2] bg-white px-5 py-2 text-sm font-medium text-[#70825d] transition-colors hover:bg-[#f7f9f4]">
                  信仰告白を見る
                </InternalLink>
              </div>
            </div>
            <div className="rounded-[30px] border border-[#edf1e7] bg-[linear-gradient(180deg,#ffffff_0%,#f5f8ef_100%)] p-8 shadow-[0_20px_40px_rgba(91,120,84,0.06)]">
              <h2 className={sectionTitleClass}>教会の歩み</h2>
              <p className="text-sm leading-7 text-[#56645a] sm:text-base">
                世田谷グレースチャーチは2020年に始まりました。小さな教会ですが、
                地域に根ざしながら、一人ひとりの顔が見える温かな交わりを大切にしています。
              </p>
              <p className="mt-4 text-sm leading-7 text-[#56645a] sm:text-base">
                世田谷に住む方々が、希望、安らぎ、成長、そして本物のコミュニティを見つけられる場所でありたいと願っています。
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="overflow-hidden rounded-[32px] border border-[#eef2e7] shadow-[0_24px_70px_rgba(60,88,65,0.12)]">
            <ImageWithFallback src={communityImg} alt="教会の交わり" className="h-full min-h-[360px] w-full object-cover" />
          </div>
          <div>
            <h2 className={sectionTitleClass}>牧師とリーダーシップ</h2>
            <p className="text-sm leading-7 text-[#56645a] sm:text-base">
              ジョー・コンドン牧師は、米国テキサス州出身です。セントルイスのワシントン大学で絵画と東アジア研究を学び、
              早稲田大学でも留学を経験しました。2014年にカベナント神学校を卒業し、アメリカ長老教会の按手を受けています。
            </p>
            <p className="mt-4 text-sm leading-7 text-[#56645a] sm:text-base">
              2015年に家族で東京へ移り、2020年から世田谷グレースの開拓を始めました。
              教会ではジョー牧師を中心にスタッフとメンバーが協力しながら、礼拝、学び、地域への働きを整えています。
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {aboutStaffPreview.map((member) => (
                <InternalLink key={member.email || member.name} href="/staff" className="group block rounded-[24px] border border-[#edf1e7] bg-[#f7f9f4] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#d8e4cf] hover:bg-white">
                  <ImageWithFallback src={member.imageUrl || pastorImg} alt={member.name} className="aspect-square w-full rounded-[20px] object-cover object-top" />
                  <p className="mt-4 text-base text-[#203126]">{member.name}</p>
                  {member.role ? <p className="mt-1 text-xs text-[#70825d]">{member.role}</p> : null}
                </InternalLink>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <InternalLink href="/welcome" className={primaryButtonClass}>
                初めての方へ
              </InternalLink>
              <InternalLink href="/staff" className="inline-flex items-center justify-center rounded-full border border-[#cbd8c2] bg-white px-6 py-3 text-sm font-medium text-[#70825d] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#b7c8aa] hover:bg-[#f5f8ef]">
                スタッフ紹介
              </InternalLink>
              <InternalLink href="/beliefs" className="inline-flex items-center justify-center rounded-full border border-[#cbd8c2] bg-white px-6 py-3 text-sm font-medium text-[#70825d] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#b7c8aa] hover:bg-[#f5f8ef]">
                信仰告白
              </InternalLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export function WorshipPage() {
  return (
    <>
      <section className="bg-[linear-gradient(135deg,#eef4e8_0%,#f8f6f0_100%)] py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h1 className="mb-6 max-w-3xl text-4xl leading-tight text-[#203126] sm:text-5xl">礼拝</h1>
          <p className="max-w-3xl text-base leading-8 text-[#56645a] sm:text-lg">
            日曜日の礼拝では、神様を賛美し、聖書のことばに耳を傾け、祈る時間を持ちます。
            初めての方も見学しながら参加できます。
          </p>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 md:grid-cols-3">
            {[
              ["子どもクラス", "14:00 - 14:45", "お子さま向けのクラスです。ご家族で安心してお越しいただけます。"],
              ["礼拝", "15:00 - 16:30", "賛美、聖書のお話、お祈りを中心とした礼拝です。"],
              ["礼拝後", "16:30ごろから", "お茶を飲みながら、気軽に話せる交わりの時間があります。"],
            ].map(([title, time, text]) => (
              <div key={title} className="rounded-[30px] border border-[#edf1e7] bg-[linear-gradient(180deg,#ffffff_0%,#f5f8ef_100%)] p-8 shadow-[0_20px_40px_rgba(91,120,84,0.06)]">
                <p className="text-xs uppercase tracking-[0.18em] text-[#7b8b7f]">{title}</p>
                <h2 className="mt-3 text-2xl text-[#203126]">{time}</h2>
                <p className="mt-4 text-sm leading-7 text-[#56645a]">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#eff4e8] py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <h2 className={sectionTitleClass}>礼拝の流れ</h2>
            <div className="space-y-4 text-sm leading-7 text-[#56645a] sm:text-base">
              <p>1. 賛美: みんなで歌を歌い、神様への感謝を表します。</p>
              <p>2. 聖書朗読と説教: 聖書のことばが今の生活にどう関わるのかを、わかりやすく聞きます。</p>
              <p>3. お祈り: 神様に思いを向け、感謝や願いを祈ります。</p>
            </div>
          </div>
          <div className="overflow-hidden rounded-[32px] border border-white/70 shadow-[0_24px_70px_rgba(60,88,65,0.14)]">
            <ImageWithFallback src={heroImg} alt="礼拝の様子" className="h-full min-h-[360px] w-full object-cover" />
          </div>
        </div>
      </section>

      <section className="bg-[#f7f7f3] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-[32px] border border-[#e4eadf] bg-white p-8 shadow-[0_18px_45px_rgba(83,110,76,0.08)] md:col-span-2">
              <h2 className={sectionTitleClass}>音楽とメッセージ</h2>
              <p className="max-w-3xl text-sm leading-7 text-[#56645a] sm:text-base">
                礼拝では、親しみやすい賛美と聖書に基づいたメッセージが中心です。
                初めての方にも理解しやすいように、日本語でわかりやすくお伝えすることを大切にしています。
              </p>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-[#56645a] sm:text-base">
                説教では、聖書のことばが日常の悩みや希望にどのように関わるのかを丁寧に取り上げます。
              </p>
            </div>
            <div className="rounded-[32px] border border-[#e4eadf] bg-white p-8 shadow-[0_18px_45px_rgba(83,110,76,0.08)]">
              <h2 className="mb-4 text-2xl text-[#203126]">オンライン配信</h2>
              <p className="text-sm leading-7 text-[#56645a]">
                ライブ配信を行う場合は、ここから視聴リンクや案内を掲載できます。
                現時点では「今後追加予定」の場所として想定しています。
              </p>
              <div className="mt-6">
                <InternalLink href="/welcome" className={primaryButtonClass}>
                  初めての方へ
                </InternalLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export function ChristianityPage() {
  return (
    <>
      <section className="bg-[linear-gradient(135deg,#eef4e8_0%,#f8f6f0_100%)] py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h1 className="mb-6 max-w-3xl text-4xl leading-tight text-[#203126] sm:text-5xl">キリスト教について</h1>
          <p className="max-w-3xl text-base leading-8 text-[#56645a] sm:text-lg">
            「ニューライフ」冊子の流れに沿って、キリスト教のメッセージを17枚のカードでたどれるようにしました。
            初めての方にも、問いかけから希望まで順番に読める構成です。
          </p>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {newLifeBookletCards.map((card) => (
              <div key={card.page} className="rounded-[30px] border border-[#edf1e7] bg-[linear-gradient(180deg,#ffffff_0%,#f5f8ef_100%)] p-8 shadow-[0_20px_40px_rgba(91,120,84,0.06)]">
                <h2 className="mb-4 text-2xl leading-tight text-[#203126]">{card.title}</h2>
                <div className="space-y-3 text-sm leading-7 text-[#56645a]">
                  {card.body.map((paragraph, index) => (
                    <p key={`${card.page}-${index}`}>{paragraph}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#eff4e8] py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="overflow-hidden rounded-[32px] border border-white/70 shadow-[0_24px_70px_rgba(60,88,65,0.14)]">
            <ImageWithFallback src={communityImg} alt="聖書を学ぶ様子" className="h-full min-h-[360px] w-full object-cover" />
          </div>
          <div>
            <h2 className={sectionTitleClass}>この流れで伝えたいこと</h2>
            <div className="space-y-5 text-sm leading-7 text-[#56645a] sm:text-base">
              <p>この冊子は、人生の問いから始まり、神、人間、罪、十字架、復活、そして応答へと進む構成です。</p>
              <p>押しつけるのではなく、「なぜそうなのか」を順番に考えられるように整理されています。</p>
              <p>まず気になったカードから読んでも大丈夫ですし、最初から17枚を通して読むこともできます。</p>
            </div>
            <div className="mt-6">
              <InternalLink href="/welcome" className={primaryButtonClass}>
                初めての方へ
              </InternalLink>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-[30px] border border-[#edf1e7] bg-[linear-gradient(180deg,#ffffff_0%,#f5f8ef_100%)] p-8 shadow-[0_20px_40px_rgba(91,120,84,0.06)]">
              <h2 className={sectionTitleClass}>読んだあとにできること</h2>
              <div className="space-y-4 text-sm leading-7 text-[#56645a]">
                <p>気になったカードをひとつ選んで、そこから質問してみてください。</p>
                <p>聖書を持っていなくても大丈夫です。教会で一緒に読むことができます。</p>
                <p>まだ信じる準備ができていなくても、知りたい気持ちがあれば歓迎しています。</p>
              </div>
            </div>
            <div className="rounded-[30px] border border-[#edf1e7] bg-[linear-gradient(180deg,#ffffff_0%,#f5f8ef_100%)] p-8 shadow-[0_20px_40px_rgba(91,120,84,0.06)]">
              <h2 className={sectionTitleClass}>さらに知りたい方へ</h2>
              <p className="text-sm leading-7 text-[#56645a] sm:text-base">
                この17枚の内容について誰かと話したい方は、礼拝や初めての方向けページからぜひご連絡ください。
                実際に会って質問したり、聖書を一緒に読むこともできます。
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <InternalLink href="/welcome" className={primaryButtonClass}>
                  初めての方へ
                </InternalLink>
                <a href="mailto:info@setagaya-church.jp" className="inline-flex items-center justify-center rounded-full border border-[#cfdbc6] bg-[#f7faf3] px-6 py-3 text-sm font-medium text-[#70825d] transition-colors hover:bg-[#edf4e5]">
                  お問い合わせ
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export function AccessPage() {
  return (
    <>
      <section className="bg-[linear-gradient(135deg,#eef4e8_0%,#f8f6f0_100%)] py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h1 className="mb-6 max-w-3xl text-4xl leading-tight text-[#203126] sm:text-5xl">アクセス</h1>
          <p className="max-w-3xl text-base leading-8 text-[#56645a] sm:text-lg">
            初めての方でも迷わず来られるように、場所、時間、地図、連絡先をまとめています。
          </p>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="rounded-[32px] border border-[#e4eadf] bg-white p-8 shadow-[0_18px_45px_rgba(83,110,76,0.08)]">
            <h2 className={sectionTitleClass}>場所</h2>
            <p className="text-sm leading-7 text-[#56645a] sm:text-base">
              日本宣教会 代田教会
              <br />
              世田谷区羽根木1-19-2
            </p>
            <div className="mt-6 space-y-4">
              <div className="rounded-[24px] bg-[#f5f8ef] p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-[#7b8b7f]">子どもクラス</p>
                <p className="mt-1 text-lg text-[#203126]">14:00 - 14:45</p>
              </div>
              <div className="rounded-[24px] bg-[#f5f8ef] p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-[#7b8b7f]">礼拝</p>
                <p className="mt-1 text-lg text-[#203126]">15:00 - 16:30</p>
              </div>
            </div>
            <div className="mt-6 space-y-3 text-sm leading-7 text-[#56645a] sm:text-base">
              <p>最寄り駅からの道順や入口がわかりにくい場合は、事前にお気軽にご連絡ください。</p>
              <p>初めての方が安心して来られるよう、できるだけわかりやすくご案内します。</p>
              <p>駅からの道順、入口写真、当日の到着イメージを加えることで、さらに不安を減らせます。</p>
            </div>
          </div>
          <div className="overflow-hidden rounded-[32px] border border-white/70 bg-white p-3 shadow-[0_20px_60px_rgba(79,107,73,0.12)]">
            <iframe
              title="世田谷グレースチャーチ 地図"
              src="https://www.google.com/maps?q=%E4%B8%96%E7%94%B0%E8%B0%B7%E5%8C%BA%E7%BE%BD%E6%A0%B9%E6%9C%A8%EF%BC%91%E4%B8%81%E7%9B%AE%EF%BC%91%EF%BC%99%E2%88%92%EF%BC%92&output=embed"
              className="h-80 w-full rounded-[24px] border-0 md:h-[34rem]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      <section className="bg-[#eff4e8] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-[30px] border border-[#edf1e7] bg-white p-8 shadow-[0_20px_40px_rgba(91,120,84,0.06)]">
              <h2 className={sectionTitleClass}>建物の雰囲気</h2>
              <p className="text-sm leading-7 text-[#56645a] sm:text-base">
                入口や建物の雰囲気がわかる写真を今後ここに追加できます。
                初めての方にとって「どんな場所に行くのか」が見えることは、とても大きな安心につながります。
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <ImageWithFallback src={pastorImg} alt="建物入口イメージ" className="h-40 w-full rounded-[22px] object-cover object-top" />
                <ImageWithFallback src={heroImg} alt="到着時イメージ" className="h-40 w-full rounded-[22px] object-cover" />
              </div>
            </div>
            <div className="rounded-[30px] border border-[#edf1e7] bg-white p-8 shadow-[0_20px_40px_rgba(91,120,84,0.06)]">
              <h2 className={sectionTitleClass}>お問い合わせ</h2>
              <p className="text-sm leading-7 text-[#56645a] sm:text-base">
                メール:
                <a className="ml-2 font-medium text-[#70825d] hover:underline" href="mailto:info@setagaya-church.jp">
                  info@setagaya-church.jp
                </a>
              </p>
              <form className="mt-6 space-y-4">
                <input className="w-full rounded-[18px] border border-[#dce4d4] bg-[#f8fbf5] px-4 py-3 text-sm text-[#304034]" placeholder="お名前" />
                <input className="w-full rounded-[18px] border border-[#dce4d4] bg-[#f8fbf5] px-4 py-3 text-sm text-[#304034]" placeholder="メールアドレス" />
                <textarea className="min-h-28 w-full rounded-[18px] border border-[#dce4d4] bg-[#f8fbf5] px-4 py-3 text-sm text-[#304034]" placeholder="ご質問・お問い合わせ内容" />
              </form>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="mailto:info@setagaya-church.jp" className={primaryButtonClass}>
                  お問い合わせ
                </a>
                <InternalLink href="/welcome" className="inline-flex items-center justify-center rounded-full border border-[#cfdbc6] bg-[#f7faf3] px-6 py-3 text-sm font-medium text-[#70825d] transition-colors hover:bg-[#edf4e5]">
                  初めての方へ
                </InternalLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export function CommunityPage() {
  return (
    <>
      <section className="bg-[linear-gradient(135deg,#eef4e8_0%,#f8f6f0_100%)] py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h1 className="mb-6 max-w-3xl text-4xl leading-tight text-[#203126] sm:text-5xl">集まり</h1>
          <p className="max-w-3xl text-base leading-8 text-[#56645a] sm:text-lg">
            礼拝以外にも、学び、祈り、交わりを通してつながるいろいろな集まりがあります。
          </p>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {[
              ["コミュニティグループ", "少人数で近況を分かち合い、聖書を読み、お祈りする集まりです。"],
              ["聖書研究会", "キリスト教を基礎から学びたい方にも開かれた学びの時間です。"],
              ["祈祷会", "教会や地域のために祈る時間を持ちます。"],
              ["ユース・学生", "若い世代が安心して参加できる交わりや学びの場を想定しています。"],
              ["子ども・家族", "お子さま連れのご家族も歓迎し、安心して過ごせる場を整えています。"],
              ["交わりの時間", "礼拝後や特別な日に、お茶を飲みながら自然に話せる時間があります。"],
            ].map(([title, text]) => (
              <div key={title} className="rounded-[30px] border border-[#edf1e7] bg-[linear-gradient(180deg,#ffffff_0%,#f5f8ef_100%)] p-8 shadow-[0_20px_40px_rgba(91,120,84,0.06)]">
                <h2 className="mb-4 text-2xl leading-tight text-[#203126]">{title}</h2>
                <p className="text-sm leading-7 text-[#56645a]">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export function EventsPage() {
  const eventCard = (event: (typeof events)[number]) => (
    <article key={event.title} className="overflow-hidden rounded-[30px] border border-[#dfe7d6] bg-white shadow-[0_20px_40px_rgba(91,120,84,0.06)]">
      <div className="flex items-center justify-center bg-[#f4f7ef] p-4">
        <ImageWithFallback src={getEventImage(event)} alt={event.title} className="max-h-[34rem] w-full object-contain" />
      </div>
      <div className="p-7">
        {event.dateLabel || event.date ? (
          <p className="mb-3 text-xs uppercase tracking-[0.18em] text-[#7b8b7f]">{event.dateLabel || event.date}</p>
        ) : null}
        <h2 className="text-2xl text-[#203126]">{event.title}</h2>
        <p className="mt-4 text-sm leading-7 text-[#56645a]">{event.description || event.summary}</p>
        <div className="mt-6">
          <InternalLink href={`/events/${event.slug}`} className="inline-flex items-center justify-center rounded-full bg-[#83996e] px-5 py-2 text-sm font-medium text-white shadow-[0_10px_20px_rgba(76,106,82,0.18)] transition-colors hover:bg-[#70825d]">
            詳しく見る
          </InternalLink>
        </div>
      </div>
    </article>
  );

  return (
    <>
      <section className="bg-[linear-gradient(135deg,#eef4e8_0%,#f8f6f0_100%)] py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h1 className="mb-6 max-w-3xl text-4xl leading-tight text-[#203126] sm:text-5xl">イベント</h1>
          <p className="max-w-3xl text-base leading-8 text-[#56645a] sm:text-lg">
            今後のイベントや季節の集まりをまとめています。初めての方が参加しやすい案内にも使えます。
          </p>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl space-y-16 px-6">
          <div>
            <div className="mb-8">
              <p className={eyebrowClass}>これから</p>
              <h2 className={sectionTitleClass}>これからのイベント</h2>
            </div>
            {upcomingEventItems.length > 0 ? (
              <div className="grid gap-8 md:grid-cols-3">{upcomingEventItems.map(eventCard)}</div>
            ) : (
              <p className="rounded-[24px] border border-[#dfe7d6] bg-[#f7f9f4] p-6 text-sm leading-7 text-[#56645a]">
                現在、掲載中の今後のイベントはありません。
              </p>
            )}
          </div>

          {ongoingEventItems.length > 0 ? (
            <div>
              <div className="mb-8 border-t border-[#edf1e7] pt-12">
                <p className={eyebrowClass}>定期</p>
                <h2 className={sectionTitleClass}>定期的な集まり</h2>
              </div>
              <div className="grid gap-8 md:grid-cols-3">{ongoingEventItems.map(eventCard)}</div>
            </div>
          ) : null}

          {pastEventItems.length > 0 ? (
            <div>
              <div className="mb-8 border-t border-[#edf1e7] pt-12">
                <p className={eyebrowClass}>過去</p>
                <h2 className={sectionTitleClass}>過去のイベント</h2>
              </div>
              <div className="grid gap-8 md:grid-cols-3">{pastEventItems.map(eventCard)}</div>
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}

export function EventDetailPage({ eventSlug }: { eventSlug?: string }) {
  const event = events.find((item) => item.slug === eventSlug);

  if (!event) {
    return <NotFoundPage />;
  }

  return (
    <>
      <section className="bg-[linear-gradient(135deg,#eef4e8_0%,#f8f6f0_100%)] py-20">
        <div className="mx-auto max-w-7xl px-6">
          <p className={eyebrowClass}>イベント</p>
          {event.dateLabel || event.date ? (
            <p className="mb-4 text-xs uppercase tracking-[0.18em] text-[#7b8b7f]">{event.dateLabel || event.date}</p>
          ) : null}
          <h1 className="mb-6 max-w-4xl text-4xl leading-tight text-[#203126] sm:text-5xl">{event.title}</h1>
          <p className="max-w-3xl text-base leading-8 text-[#56645a] sm:text-lg">{event.summary || event.description}</p>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="overflow-hidden rounded-[32px] border border-[#eef2e7] bg-[#f4f7ef] p-4 shadow-[0_24px_70px_rgba(60,88,65,0.12)]">
            <ImageWithFallback src={getEventImage(event)} alt={event.title} className="max-h-[38rem] w-full object-contain" />
          </div>
          <div>
            <h2 className={sectionTitleClass}>イベントについて</h2>
            <p className="text-sm leading-7 text-[#56645a] sm:text-base">{event.description || event.summary}</p>
            {event.notes ? <p className="mt-4 text-sm leading-7 text-[#70825d]">{event.notes}</p> : null}
            <div className="mt-8 flex flex-wrap gap-3">
              <InternalLink href="/events" className="inline-flex items-center justify-center rounded-full border border-[#cbd8c2] bg-white px-6 py-3 text-sm font-medium text-[#70825d] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#b7c8aa] hover:bg-[#f5f8ef]">
                イベント一覧へ
              </InternalLink>
              <InternalLink href="/access" className={primaryButtonClass}>
                アクセスを見る
              </InternalLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export function StaffPage() {
  return (
    <>
      <section className="bg-[linear-gradient(135deg,#eef4e8_0%,#f8f6f0_100%)] py-20">
        <div className="mx-auto max-w-7xl px-6">
          <p className={eyebrowClass}>スタッフ</p>
          <h1 className="mb-6 max-w-3xl text-4xl leading-tight text-[#203126] sm:text-5xl">スタッフ</h1>
          <p className="max-w-3xl text-base leading-8 text-[#56645a] sm:text-lg">
            世田谷グレースチャーチで礼拝、学び、音楽、地域への働きを支えているスタッフを紹介します。
          </p>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {staffMembers.map((member) => (
              <article key={member.email || member.name} className="overflow-hidden rounded-[30px] border border-[#dfe7d6] bg-white shadow-[0_20px_40px_rgba(91,120,84,0.06)]">
                <div className="flex items-center justify-center bg-[#f4f7ef] p-6">
                  <ImageWithFallback src={member.imageUrl || pastorImg} alt={member.name} className="aspect-square w-full max-w-sm rounded-[24px] object-cover object-top" />
                </div>
                <div className="p-7">
                  {member.role ? <p className="mb-3 text-xs uppercase tracking-[0.18em] text-[#7b8b7f]">{member.role}</p> : null}
                  <h2 className="text-2xl text-[#203126]">{member.name}</h2>
                  <p className="mt-4 text-sm leading-7 text-[#56645a]">{member.bio}</p>
                  {member.hobbies ? (
                    <p className="mt-4 text-sm leading-7 text-[#70825d]">趣味：{member.hobbies}</p>
                  ) : null}
                  {member.email ? (
                    <a className="mt-6 inline-flex rounded-full bg-[#83996e] px-5 py-2 text-sm font-medium text-white shadow-[0_10px_20px_rgba(76,106,82,0.18)] transition-colors hover:bg-[#70825d]" href={`mailto:${member.email}`}>
                      メールを送る
                    </a>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

const beliefPoints = [
  "神は主権を持つ創造主であり王である。神様を世界に反映させ、神様に代わって支配するために、人間を神様のかたちをもらって創造された。神は人類と契約（covenant）を結び、人類は多大な祝福を受けたが、最初の人間アダムは神の言葉に反抗し（罪）、世界を永遠に変えてしまった。",
  "しかし、神は恵み深い神であり、憐れみと愛に満ちておられるので、直ちに人類を罪から救い、堕落した世界を回復させるために救いのご計画を立てられた。神は、いつの日か、世界の罪の問題を解決する救い主を遣わすと約束された。この救い主は、アダムが失敗したすべての方法を成功させ、神が人類と交わした契約を成就させるのである。",
  "旧約聖書に記された神の民の歴史を通して、人類は、神がご自分に対してどんなに親切であっても、主の命令に忠実であり続けることができないことを示したのである。この話では、救い主の必要性が強調され、さらにその救い主を送るという神の恵み深い約束がなされています。",
  "２０００年前、ベツレヘムでイエス・キリストは、神の約束が成就して処女から生まれた。イエスは恵みとまことに満ちておられ、罪のない人生を送られました。３年間の宣教の後、エルサレムにて十字架上でご自分の民のために犠牲的な死を遂げ、彼を信じる者が、一人として滅びることなく、永遠のいのちを持つためである。イエスは新しい契約を成就させ、すべてのご自分の民の救いを確保された。",
  "イエスは、死んでから３日後に墓からよみがえり（イースター）、ご自分がサタン、罪、死よりも強いことを証明された。そして、天に昇り、父の右に座ったとき、ついに民の救いを成し遂げられた。",
  "イエスは去る前に、弟子たちに福音の良い知らせを宣べ伝えるために、すべての国々に行くように命じられた。そして、いつの日かこの世に戻って（再臨）、その回復の行為を完成させることを約束された。",
  "私たちは今、教会時代にあり、福音と教会を広めるというイエスの命令に忠実に従っている。新約聖書で観察されるパターンに従って、私たちの教会は長老達（小会）によって運営され、地域の教会の大きな組織（中会）によって監督され、すべての教会（大会）に服従しています。私たちは、すべての長老が教会を指導する義務、祝福を持っていると信じている。どのような教会に対しても、一人の人間が責任を負うことはない。イエスは教会の大牧者であり、ご自分の教会を建て、よみの門もそれに打ち勝つことはできないと約束された。",
  "私たちは、イエスが洗礼（バプテスマ）と聖餐の２つの聖礼典を出されたことを信じる。使徒ペテロは、使徒２章３９節で、神の約束は神の民全員とその子供たちのためのものであると教えた。このため、私たちはクリスチャンになった人と信者の子供たちに洗礼を授けている。洗礼は、契約に入った人のための儀式であり、礼拝で実践している聖餐式は、キリストがご自分の民を養うための恵みの手段の一つです。この二つの聖礼典は、私たちがキリストとの結合を表わし証印するのです。",
  "イエス・キリストの福音は、キリスト教へ入口ではなく、キリスト教の歩む道である。神は私たちに信じる信仰を与えるだけでなく、聖化において成長する力も与えてくださるのです。クリスチャンは恵みのゆえに、信仰によって救われる。真にクリスチャンである者は、自分の人生を通して教会と共に忠実に歩み、日々、罪の悔い改めを深め、罪人を救うことを喜ばれる神への信仰を新たされる。",
];

export function BeliefsPage() {
  return (
    <>
      <section className="bg-[linear-gradient(135deg,#eef4e8_0%,#f8f6f0_100%)] py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <h1 className="mb-6 max-w-3xl text-4xl leading-tight text-[#203126] sm:text-5xl">信仰告白</h1>
            <p className="max-w-3xl text-base leading-8 text-[#56645a] sm:text-lg">
              私たちは、伝統的なキリスト教の信仰に従うプロテスタントの教会です。
              私たちの信仰告白は１６４０年代にさかのぼり、現在も変わっていません。
              また、私たちは長老派の教会であり、日本長老教会と協力して活動しています。
              私たちの牧師は全員、アメリカ長老教会で按手を受けています。
            </p>
          </div>
          <div className="overflow-hidden rounded-[32px] border border-white/70 shadow-[0_24px_70px_rgba(60,88,65,0.14)]">
            <ImageWithFallback src={beliefsHeroImg} alt="レンブラントの絵画" className="h-full min-h-[320px] w-full object-cover" />
          </div>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="rounded-[30px] border border-[#edf1e7] bg-[linear-gradient(180deg,#ffffff_0%,#f7f9f4_100%)] p-8 shadow-[0_20px_40px_rgba(91,120,84,0.06)]">
            <h2 className={sectionTitleClass}>私たちが信じていること</h2>
            <p className="text-sm leading-7 text-[#56645a] sm:text-base">
              しかし、長老派はいったい何を信じているのでしょうか！というのは、とてもいい質問です。
              名前からしてわかりにくいかもしれませんが、長老派であるということは、以下の基本的な信条に従うということです：
            </p>
            <div className="mt-8 space-y-4">
              {beliefPoints.map((point, index) => (
                <div key={point} className="flex gap-4 rounded-[22px] border border-[#e4ecd9] bg-white p-5">
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#83996e] text-sm text-white">{index + 1}</span>
                  <p className="text-sm leading-7 text-[#56645a] sm:text-base">{point}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-[24px] bg-[#eff4e8] p-6 text-sm leading-7 text-[#56645a]">
              <p>
                私たちの完全な信仰告白は、ウェストミンスター信仰基準に記載されています。
                私たちの協力教団である日本長老教会については、こちらでご覧いただけます。
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <a className="inline-flex items-center justify-center rounded-full bg-[#83996e] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#70825d]" href="http://www.rcj-net.org/resources/WCF/text/">
                  ウェストミンスター信仰基準
                </a>
                <a className="inline-flex items-center justify-center rounded-full border border-[#cbd8c2] bg-white px-5 py-2 text-sm font-medium text-[#70825d] transition-colors hover:bg-[#f7f9f4]" href="http://cms.chorokyokai.jp/">
                  日本長老教会
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export function SermonsPage() {
  const prioritySpeakers = ["ジョー・コンドン牧師", "ジェイソン・シェーファー牧師", "岩崎光男"];
  const allSpeakers = [...new Set(sermons.map((sermon) => sermon.speaker))];
  const speakers = [
    "すべて",
    ...prioritySpeakers.filter((speaker) => allSpeakers.includes(speaker)),
    ...allSpeakers.filter((speaker) => !prioritySpeakers.includes(speaker)),
  ];
  const years = ["すべて", ...new Set(sermons.map((sermon) => sermon.date.slice(0, 4)))];
  const availableBooks = new Set(sermons.map((sermon) => sermon.book).filter(Boolean));
  const books = [
    "すべて",
    ...bibleBookOrder.filter((book) => availableBooks.has(book)),
    ...[...availableBooks].filter((book) => !bibleBookOrder.includes(book)).sort((a, b) => a.localeCompare(b, "ja")),
  ];
  const [selectedSpeaker, setSelectedSpeaker] = useState("すべて");
  const [selectedYear, setSelectedYear] = useState("すべて");
  const [selectedBook, setSelectedBook] = useState("すべて");
  const [visibleCount, setVisibleCount] = useState(12);
  const [openYoutubeId, setOpenYoutubeId] = useState<number | null>(null);
  const filteredSermons = sermons.filter((sermon) => {
    const speakerMatch = selectedSpeaker === "すべて" ? true : sermon.speaker === selectedSpeaker;
    const yearMatch = selectedYear === "すべて" ? true : sermon.date.startsWith(selectedYear);
    const bookMatch = selectedBook === "すべて" ? true : sermon.book === selectedBook;
    return speakerMatch && yearMatch && bookMatch;
  });
  const visibleSermons = filteredSermons.slice(0, visibleCount);

  useEffect(() => {
    setVisibleCount(12);
    setOpenYoutubeId(null);
  }, [selectedSpeaker, selectedYear, selectedBook]);

  const getYoutubeEmbedUrl = (youtubeUrl: string) => {
    const match = youtubeUrl.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{6,})/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : youtubeUrl;
  };

  return (
    <>
      <section className="bg-[linear-gradient(135deg,#eef4e8_0%,#f8f6f0_100%)] py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h1 className="mb-6 max-w-3xl text-4xl leading-tight text-[#203126] sm:text-5xl">説教</h1>
          <p className="max-w-3xl text-base leading-8 text-[#56645a] sm:text-lg">
            これまでのメッセージを一覧でご覧いただけます。話者ごとに絞り込みながら、音声やYouTubeで聞くことができます。
          </p>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-8 grid gap-4 md:grid-cols-3">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#56645a]">話者で絞り込む</span>
              <select
                value={selectedSpeaker}
                onChange={(event) => setSelectedSpeaker(event.target.value)}
                className="w-full rounded-[18px] border border-[#d9e3d0] bg-white px-4 py-3 text-sm text-[#304034] shadow-sm outline-none transition-colors focus:border-[#83996e]"
              >
                {speakers.map((speaker) => (
                  <option key={speaker} value={speaker}>
                    {speaker}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#56645a]">年で絞り込む</span>
              <select
                value={selectedYear}
                onChange={(event) => setSelectedYear(event.target.value)}
                className="w-full rounded-[18px] border border-[#d9e3d0] bg-white px-4 py-3 text-sm text-[#304034] shadow-sm outline-none transition-colors focus:border-[#83996e]"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year === "すべて" ? "すべての年" : `${year}年`}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#56645a]">聖書の書で絞り込む</span>
              <select
                value={selectedBook}
                onChange={(event) => setSelectedBook(event.target.value)}
                className="w-full rounded-[18px] border border-[#d9e3d0] bg-white px-4 py-3 text-sm text-[#304034] shadow-sm outline-none transition-colors focus:border-[#83996e]"
              >
                {books.map((book) => (
                  <option key={book} value={book}>
                    {book === "すべて" ? "すべての書" : book}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="mb-6 flex items-center justify-between gap-4">
            <p className="text-sm text-[#6b776e]">
              {selectedSpeaker === "すべて" && selectedYear === "すべて" && selectedBook === "すべて"
                ? `全 ${filteredSermons.length} 件`
                : `${filteredSermons.length} 件`}
            </p>
          </div>
          <div className="mx-auto max-w-5xl space-y-5">
            {visibleSermons.map((sermon) => (
              <div key={sermon.id} className="rounded-[28px] border border-[#e8eee1] bg-[linear-gradient(180deg,#ffffff_0%,#f7f9f4_100%)] p-6 shadow-[0_18px_40px_rgba(89,114,80,0.06)]">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs uppercase tracking-[0.16em] text-[#8a968d]">
                      {sermon.dateLabel} ・ {sermon.speaker}
                    </p>
                    <h2 className="mt-3 text-2xl leading-tight text-[#203126]">{sermon.title}</h2>
                    <div className="mt-4 space-y-2 text-sm leading-7 text-[#56645a]">
                      <p>{sermon.passage}</p>
                      {sermon.series ? <p className="text-[#70825d]">{sermon.series}</p> : null}
                      {sermon.description ? <p>{sermon.description}</p> : null}
                      {sermon.notes ? <p className="text-xs text-[#7f8b82]">{sermon.notes}</p> : null}
                    </div>
                  </div>
                  <div className="w-full lg:max-w-xs">
                    {sermon.mp3Url ? (
                      <div className="rounded-[22px] border border-[#dbe5d5] bg-white p-4">
                        <p className="mb-3 text-xs uppercase tracking-[0.16em] text-[#7f8b82]">Audio</p>
                        <audio controls className="w-full">
                          <source src={sermon.mp3Url} />
                          お使いのブラウザでは音声再生に対応していません。
                        </audio>
                        {sermon.youtubeUrl ? (
                          <a
                            href={sermon.youtubeUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-[#70825d] hover:underline"
                          >
                            YouTubeで見る
                          </a>
                        ) : null}
                      </div>
                    ) : sermon.youtubeUrl ? (
                      <div className="rounded-[22px] border border-[#dbe5d5] bg-white p-4">
                        <button
                          type="button"
                          onClick={() => setOpenYoutubeId((currentId) => (currentId === sermon.id ? null : sermon.id))}
                          className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#83996e] px-5 py-3 text-sm font-medium text-white shadow-[0_14px_30px_rgba(76,106,82,0.18)] transition-colors hover:bg-[#70825d]"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                          {openYoutubeId === sermon.id ? "再生を閉じる" : "ここで再生"}
                        </button>
                        {openYoutubeId === sermon.id ? (
                          <div className="mt-4 overflow-hidden rounded-[18px] border border-[#dbe5d5]">
                            <iframe
                              src={getYoutubeEmbedUrl(sermon.youtubeUrl)}
                              title={`${sermon.dateLabel} ${sermon.title}`}
                              className="aspect-video w-full"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              referrerPolicy="strict-origin-when-cross-origin"
                              allowFullScreen
                            />
                          </div>
                        ) : null}
                      </div>
                    ) : (
                      <div className="rounded-[22px] border border-dashed border-[#dbe5d5] bg-white p-4 text-sm text-[#7f8b82]">
                        この説教のメディアはまだ登録されていません。
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filteredSermons.length === 0 ? (
            <p className="mx-auto mt-6 max-w-4xl text-sm text-[#6b776e]">この話者の説教はまだありません。</p>
          ) : null}
          {visibleCount < filteredSermons.length ? (
            <div className="mt-10 text-center">
              <button
                type="button"
                onClick={() => setVisibleCount((count) => count + 12)}
                className="inline-flex items-center justify-center rounded-full border border-[#cfdbc6] bg-[#f7faf3] px-6 py-3 text-sm font-medium text-[#70825d] transition-colors hover:bg-[#edf4e5]"
              >
                もっと見る
              </button>
            </div>
          ) : null}
        </div>
      </section>

      <section className="bg-[#eff4e8] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-[30px] border border-[#edf1e7] bg-white p-8 shadow-[0_20px_40px_rgba(91,120,84,0.06)]">
              <h2 className={sectionTitleClass}>アーカイブについて</h2>
              <p className="text-sm leading-7 text-[#56645a] sm:text-base">
                説教は新しいものから順に掲載しています。今後はシリーズや年ごとの整理、検索なども追加しやすい形にしていきます。
              </p>
            </div>
            <div className="rounded-[30px] border border-[#edf1e7] bg-white p-8 shadow-[0_20px_40px_rgba(91,120,84,0.06)]">
              <h2 className={sectionTitleClass}>音声・動画の扱い</h2>
              <p className="text-sm leading-7 text-[#56645a] sm:text-base">
                今後はMP3音声があるものは音声プレイヤーで、過去のYouTubeアーカイブはリンクで聞けるようにしていく想定です。
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export function NotFoundPage() {
  return (
    <section className="bg-[#f8f6f0] py-32">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <p className={eyebrowClass}>ページが見つかりません</p>
        <h1 className="mb-6 text-4xl text-[#203126] sm:text-5xl">ページが見つかりません</h1>
        <p className="text-base leading-8 text-[#56645a]">お探しのページは移動したか、存在しない可能性があります。</p>
        <div className="mt-8">
          <InternalLink href="/" className={primaryButtonClass}>
            ホームへ戻る
          </InternalLink>
        </div>
      </div>
    </section>
  );
}

export function PageContent({ page, eventSlug }: { page: PageKey; eventSlug?: string }) {
  if (page === "home") return <HomePage />;
  if (page === "welcome") return <WelcomePage />;
  if (page === "about") return <AboutPage />;
  if (page === "beliefs") return <BeliefsPage />;
  if (page === "staff") return <StaffPage />;
  if (page === "worship") return <WorshipPage />;
  if (page === "christianity") return <ChristianityPage />;
  if (page === "community") return <CommunityPage />;
  if (page === "events") return <EventsPage />;
  if (page === "eventDetail") return <EventDetailPage eventSlug={eventSlug} />;
  if (page === "sermons") return <SermonsPage />;
  if (page === "access") return <AccessPage />;
  return <NotFoundPage />;
}

export function WebsitePage({
  page,
  currentPath = pagePaths[page],
  eventSlug,
}: {
  page: PageKey;
  currentPath?: string;
  eventSlug?: string;
}) {
  return (
    <SiteLayout currentPath={currentPath}>
      <PageContent page={page} eventSlug={eventSlug} />
    </SiteLayout>
  );
}

export default function App() {
  const [locationState, setLocationState] = useState(() => ({
    pathname: window.location.pathname,
    hash: window.location.hash,
  }));

  useEffect(() => {
    const handleLocationChange = () => {
      setLocationState({
        pathname: window.location.pathname,
        hash: window.location.hash,
      });
    };

    window.addEventListener("popstate", handleLocationChange);
    window.addEventListener("hashchange", handleLocationChange);

    return () => {
      window.removeEventListener("popstate", handleLocationChange);
      window.removeEventListener("hashchange", handleLocationChange);
    };
  }, []);

  useEffect(() => {
    if (locationState.pathname === "/" && locationState.hash) {
      const targetId = locationState.hash.replace("#", "");
      const target = document.getElementById(targetId);
      if (target) {
        requestAnimationFrame(() => {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
      return;
    }

    window.scrollTo({ top: 0, behavior: "auto" });
  }, [locationState.hash, locationState.pathname]);

  let content: React.ReactNode;
  if (locationState.pathname === "/") {
    content = <HomePage />;
  } else if (locationState.pathname === "/welcome") {
    content = <WelcomePage />;
  } else if (locationState.pathname === "/aboutourchurch" || locationState.pathname === "/about") {
    content = <AboutPage />;
  } else if (locationState.pathname === "/beliefs") {
    content = <BeliefsPage />;
  } else if (locationState.pathname === "/staff") {
    content = <StaffPage />;
  } else if (locationState.pathname === "/worship") {
    content = <WorshipPage />;
  } else if (locationState.pathname === "/christianity") {
    content = <ChristianityPage />;
  } else if (locationState.pathname === "/community") {
    content = <CommunityPage />;
  } else if (locationState.pathname === "/events") {
    content = <EventsPage />;
  } else if (locationState.pathname.startsWith("/events/")) {
    content = <EventDetailPage eventSlug={locationState.pathname.split("/").filter(Boolean)[1]} />;
  } else if (locationState.pathname === "/sermons") {
    content = <SermonsPage />;
  } else if (locationState.pathname === "/access") {
    content = <AccessPage />;
  } else {
    content = <NotFoundPage />;
  }

  return <SiteLayout currentPath={locationState.pathname}>{content}</SiteLayout>;
}
