// Latest @tridentfilms posts for the homepage "From the feed" grid.
// feed.json is published to public B2 every 30 min by a1 (Automation/ig-feed-sync).
// Proxied here because B2 sends no CORS headers; edge-cached 5 min.

const FEED_URL = 'https://f006.backblazeb2.com/file/teg-share/assets/websites/tridentfilms/instagram/feed.json';

module.exports = async (req, res) => {
  try {
    const r = await fetch(`${FEED_URL}?t=${Date.now()}`);
    if (!r.ok) throw new Error(`feed HTTP ${r.status}`);
    const feed = await r.json();
    if (!Array.isArray(feed.items) || !feed.items.length) throw new Error('empty feed');

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=86400');
    return res.status(200).json(feed);
  } catch (err) {
    // Short cache so a transient error doesn't stick; the page keeps its static fallback tiles.
    res.setHeader('Cache-Control', 's-maxage=60');
    return res.status(502).json({ error: String(err.message || err), items: [] });
  }
};
