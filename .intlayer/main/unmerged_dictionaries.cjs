const _aJVc8OaA1SquO1WsSooE = require('../unmerged_dictionary/common.json');
const _9fFszz6Lwdc01km5KYmU = require('../unmerged_dictionary/navigation.json');
const _7RCguqubInZoYIwbeyMP = require('../unmerged_dictionary/pages.json');

const dictionaries = {
  "common": _aJVc8OaA1SquO1WsSooE,
  "navigation": _9fFszz6Lwdc01km5KYmU,
  "pages": _7RCguqubInZoYIwbeyMP
};
const getUnmergedDictionaries = () => dictionaries;

module.exports.getUnmergedDictionaries = getUnmergedDictionaries;
module.exports = dictionaries;
