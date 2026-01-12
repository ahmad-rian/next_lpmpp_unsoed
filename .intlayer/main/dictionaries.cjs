const _2Y7hZpEFgS8dZzTlDcV7 = require('../dictionary/common.json');
const _nQ1zDp1UYubAGnXbgsd5 = require('../dictionary/navigation.json');
const _ErTRZOhiaKAjlIXgG2eN = require('../dictionary/pages.json');

const dictionaries = {
  "common": _2Y7hZpEFgS8dZzTlDcV7,
  "navigation": _nQ1zDp1UYubAGnXbgsd5,
  "pages": _ErTRZOhiaKAjlIXgG2eN
};
const getDictionaries = () => dictionaries;

module.exports.getDictionaries = getDictionaries;
module.exports = dictionaries;
