# Site Photo And Placeholder Audit

Created: 2026-05-30

## Purpose

Record follow-up work from the site review so we can return to it later without relying on chat history.

## Photo Usage Findings

Photos currently do the most useful work when they make the church feel real, warm, and approachable for first-time visitors in Japan who may not be familiar with Christianity.

Current photo roles:

- Trust and warmth: the homepage group photo shows real people and families.
- Reducing uncertainty: welcome photos show arrival, the building, worship, and fellowship.
- People credibility: staff photos make leadership feel human and accessible.
- Event information: event images often function as flyers rather than atmospheric photos.

## Photo Issues To Revisit

High priority:

- The main group photo is overused. It works well as the homepage hero, but appears in too many contexts as a general stand-in.
- The access page needs real wayfinding photos: exterior, entrance, signage, doorway, route from station, and room/arrival view.
- Replace the pastor/Mt. Fuji photo currently used as a building/entrance image on the access page. It is warm, but misleading in that context.

Medium priority:

- The community page is under-photographed. It talks about gatherings but does not make them concrete.
- The worship page should use worship-specific imagery rather than repeating the homepage group photo.
- Event flyers are useful on event detail pages, but they feel visually loud on the homepage. Consider calmer event photos or thumbnails for homepage cards.

Potential asset swaps:

- Use `welcome-arrival-church-entrance.jpeg` and `welcome-reception.jpeg` for access and first-visit wayfinding.
- Use `welcome-worship-service.jpeg` or `event-worship.jpg` for worship sections.
- Use `event-community-group.jpg` or `CG.jpeg` for community sections.
- Keep the large group photo mostly for the homepage hero and possibly one gallery appearance.

## Placeholder Copy Findings

There is still placeholder/planning copy visible on public pages. This is at least as important as the photo issue because it makes the site feel unfinished and breaks trust.

Known example:

Page: `/access`

Section heading:

```text
建物の雰囲気
```

Placeholder copy currently visible:

```text
入口や建物の雰囲気がわかる写真を今後ここに追加できます。 初めての方にとって「どんな場所に行くのか」が見えることは、とても大きな安心につながります。
```

Why it matters:

- It speaks to the site owner/editor instead of the visitor.
- It announces unfinished content.
- It appears in a high-trust area where visitors are deciding whether they can confidently find the church.

Recommended replacement direction:

- Use visitor-facing reassurance, not editorial planning language.
- Pair the copy with real access photos.
- Describe what the visitor will see when they arrive.

Example direction:

```text
入口には世田谷グレースチャーチの案内看板があります。初めての方も、建物に入ってすぐスタッフにお声がけください。礼拝の場所までご案内します。
```

## Next Audit Step

Search the whole site for public-facing placeholder phrases such as:

- `今後`
- `追加できます`
- `想定しています`
- `ここに`
- `掲載できます`
- `予定`
- `イメージ`
- `プレースホルダー`

Then decide which copy should be rewritten, which content should be removed, and which places need real photos before launch.

## Placeholder Copy Scan Results

Scanned: 2026-05-30

Source searched:

- `src/app/App.tsx`
- `src/pages`
- `src/data`
- built `dist` output spot-checks

### Definite Placeholder / Editor-Facing Copy

1. `/worship` — Online streaming card

File: `src/app/App.tsx`

Current copy:

```text
ライブ配信を行う場合は、ここから視聴リンクや案内を掲載できます。
現時点では「今後追加予定」の場所として想定しています。
```

Why it needs fixing:

- Speaks to site editors, not visitors.
- Announces an incomplete feature.
- Should either be removed, hidden until real streaming exists, or rewritten as visitor-facing guidance.

2. `/access` — Access guidance paragraph

File: `src/app/App.tsx`

Current copy:

```text
駅からの道順、入口写真、当日の到着イメージを加えることで、さらに不安を減らせます。
```

Why it needs fixing:

- This is planning language about future content, not visitor-facing copy.
- It belongs in an internal note, not the public page.

3. `/access` — Building atmosphere section

File: `src/app/App.tsx`

Current copy:

```text
入口や建物の雰囲気がわかる写真を今後ここに追加できます。
初めての方にとって「どんな場所に行くのか」が見えることは、とても大きな安心につながります。
```

Why it needs fixing:

- First sentence is clearly placeholder/editor copy.
- The section also uses mismatched placeholder images.

4. `/community` — Youth/students card

File: `src/app/App.tsx`

Current copy:

```text
若い世代が安心して参加できる交わりや学びの場を想定しています。
```

Why it needs fixing:

- `想定しています` sounds like a planned feature rather than an actual ministry.
- Needs either real current information or removal.

5. `/sermons` — Archive info cards

File: `src/app/App.tsx`

Current copy:

```text
説教は新しいものから順に掲載しています。今後はシリーズや年ごとの整理、検索なども追加しやすい形にしていきます。
```

```text
今後はMP3音声があるものは音声プレイヤーで、過去のYouTubeアーカイブはリンクで聞けるようにしていく想定です。
```

Why it needs fixing:

- Both cards describe planned implementation rather than useful visitor information.
- The second card especially sounds like product backlog copy.

### Likely Fine / Visitor-Facing

These matched the scan but do not appear to be placeholder copy:

- Home/events descriptions using `これから予定されている` or `今後のイベント`
- Empty state: `現在、掲載中の今後のイベントはありません。`
- Form placeholders: `お名前`, `メールアドレス`, `ご質問・お問い合わせ内容`
- Sermon/home text such as `オンラインで聞くことができます`
- Welcome-page reassurance such as `すぐに帰ることもできます`
- SEO metadata using `掲載しています`

### Fix Pass Recommendation

Fix in this order:

1. Remove or rewrite the `/worship` online streaming card.
2. Rewrite the `/access` copy and swap the mismatched images.
3. Rewrite or remove the `/community` youth/students card.
4. Rewrite the `/sermons` archive info cards as visitor-facing help, or remove them if they add little value.
