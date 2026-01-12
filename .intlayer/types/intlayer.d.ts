import "intlayer";
import _IaHqSVKMbD9mp5VtxD8l from './common.ts';
import _NwwZnMBWXTb1ChQs5yMA from './navigation.ts';
import _j4OWvsJ3Qn0jBmKZP2ZH from './pages.ts';

declare module 'intlayer' {
  interface __DictionaryRegistry {
    "common": typeof _IaHqSVKMbD9mp5VtxD8l;
    "navigation": typeof _NwwZnMBWXTb1ChQs5yMA;
    "pages": typeof _j4OWvsJ3Qn0jBmKZP2ZH;
  }

  interface __DeclaredLocalesRegistry {
    "id": 1;
    "en": 1;
    "zh": 1;
  }

  interface __RequiredLocalesRegistry {
    "id": 1;
    "en": 1;
    "zh": 1;
  }

  interface __StrictModeRegistry { mode: 'inclusive' }
}
