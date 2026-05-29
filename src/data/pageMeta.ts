import type { PageKey } from "../app/App";

type PageMeta = {
  title: string;
  description: string;
  path: string;
};

export const pageMeta: Record<PageKey, PageMeta> = {
  home: {
    title: "世田谷グレースチャーチ | 東京都世田谷区羽根木のキリスト教会",
    description:
      "世田谷区羽根木にあるキリスト教会、世田谷グレースチャーチです。初めての方、聖書やキリスト教に関心のある方を歓迎しています。",
    path: "/",
  },
  welcome: {
    title: "初めての方へ | 世田谷グレースチャーチ",
    description:
      "世田谷グレースチャーチを初めて訪れる方向けに、礼拝の流れ、服装、子ども連れでの参加、アクセスを案内します。",
    path: "/welcome",
  },
  about: {
    title: "教会について | 世田谷グレースチャーチ",
    description:
      "世田谷グレースチャーチの歩み、大切にしていること、牧師紹介、地域との関わりについて紹介します。",
    path: "/aboutourchurch",
  },
  beliefs: {
    title: "信仰告白 | 世田谷グレースチャーチ",
    description:
      "世田谷グレースチャーチが大切にしている伝統的なキリスト教信仰、長老派の信仰告白について紹介します。",
    path: "/beliefs",
  },
  staff: {
    title: "スタッフ | 世田谷グレースチャーチ",
    description:
      "世田谷グレースチャーチの牧師、宣教師、スタッフを紹介します。",
    path: "/staff",
  },
  worship: {
    title: "礼拝のご案内 | 世田谷グレースチャーチ",
    description:
      "毎週日曜日の礼拝と子どもクラスの時間、礼拝で行うこと、初めて参加される方への案内です。",
    path: "/worship",
  },
  giving: {
    title: "献金について | 世田谷グレースチャーチ",
    description:
      "世田谷グレースチャーチの働きを支える献金について、礼拝での献金、銀行振込、オンライン献金の方法を案内します。",
    path: "/giving",
  },
  christianity: {
    title: "キリスト教について | 世田谷グレースチャーチ",
    description:
      "聖書が語る神の愛、罪、イエス・キリスト、新しい人生について、初めての方にもわかりやすく紹介します。",
    path: "/christianity",
  },
  community: {
    title: "集まり | 世田谷グレースチャーチ",
    description:
      "礼拝以外の小さな集まり、聖書を学ぶ時間、交わりの機会について紹介します。",
    path: "/community",
  },
  events: {
    title: "イベント | 世田谷グレースチャーチ",
    description:
      "グレーススクール、キッズゴスペルキャンプ、季節の集まりなど、世田谷グレースチャーチのイベント情報を掲載しています。",
    path: "/events",
  },
  sermons: {
    title: "説教 | 世田谷グレースチャーチ",
    description:
      "世田谷グレースチャーチの礼拝説教アーカイブです。聖書箇所、説教者、動画リンクから過去の説教を探せます。",
    path: "/sermons",
  },
  access: {
    title: "アクセス | 世田谷グレースチャーチ",
    description:
      "世田谷グレースチャーチの所在地、最寄り駅、日曜日の礼拝時間、地図を掲載しています。",
    path: "/access",
  },
  notFound: {
    title: "ページが見つかりません | 世田谷グレースチャーチ",
    description: "お探しのページは移動したか、存在しない可能性があります。",
    path: "/404",
  },
};
