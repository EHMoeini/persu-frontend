// Localized tab slugs <-> english tab slugs, consumed by next.config rewrites.
// Keys are URL-encoded segment values (e.g. encodeURIComponent('اخبار')).
//
// {
//   <entity>: {
//     base: '/<entity>/:id/:name',
//     tabs: { '<localized-slug>': '<english-slug>' },
//   },
// }
const TAB_TRANSLATIONS = {};

function buildTabRewrites({ base, tabs }) {
  return Object.entries(tabs).map(([localized, english]) => ({
    source: `${base}/${localized}`,
    destination: `${base}/${english}`,
  }));
}

function buildAllTabRewrites() {
  return Object.values(TAB_TRANSLATIONS).flatMap(buildTabRewrites);
}

module.exports = { TAB_TRANSLATIONS, buildTabRewrites, buildAllTabRewrites };
