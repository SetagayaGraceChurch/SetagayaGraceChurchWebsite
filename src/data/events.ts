import generatedEvents from "./generated/events.json";

// Keep locally managed announcements when build-time spreadsheet data refreshes.
export const churchLunchEvent: (typeof generatedEvents)[number] = {
  id: 8,
  status: "published",
  eventType: "event",
  slug: "kyokai-ranchi-2026",
  date: "2026-11-22",
  endDate: "",
  dateLabel: "2026年11月22日（日）12:00〜",
  title: "教会ランチ",
  summary: "お弁当を持って、羽根木公園の北の広場でいっしょにランチを楽しみましょう。交わりのひとときを過ごします。",
  description: "お弁当を持って、いっしょにランチを楽しみましょう。羽根木公園の北の広場に集まり、交わりのひとときを過ごします。\n\n日時：2026年11月22日（日）12:00〜\n集合場所：羽根木公園 北の広場（下の地図をご覧ください）\n持ち物：ご自分のお弁当",
  imageKey: "kyokai-ranchi-2026",
  imageUrl: "",
  venueUrl: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("羽根木公園 北の広場"),
  applicationUrl: "",
  applicationLabel: "参加申し込み",
  featured: true,
  notes: "",
};

const localEvents = [churchLunchEvent];
const localSlugs = new Set(localEvents.map((event) => event.slug));

const events = [
  ...generatedEvents.filter((event) => !localSlugs.has(event.slug)),
  ...localEvents,
];

export default events;
