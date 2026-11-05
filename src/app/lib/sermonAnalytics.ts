type Sermon = {
  title: string;
  date: string;
  speaker: string;
  mp3Url: string;
};

type AnalyticsWindow = Window & {
  gtag?: (command: string, event: string, parameters: Record<string, string>) => void;
};

// One listening start per sermon per mounted page, including after filtering.
export function createSermonPlayTracker() {
  const started = new Set<string>();

  return (sermon: Sermon) => {
    if (started.has(sermon.mp3Url)) return;
    started.add(sermon.mp3Url);

    // Analytics is optional; it must never interrupt the audio player.
    try {
      if (typeof window === "undefined") return;
      const gtag = (window as AnalyticsWindow).gtag;
      if (typeof gtag !== "function") return;
      gtag("event", "sermon_play", {
        sermon_title: sermon.title,
        sermon_date: sermon.date,
        sermon_speaker: sermon.speaker,
      });
    } catch {
      // Playback continues when tracking is blocked or unavailable.
    }
  };
}
