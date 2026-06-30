import { HomeSearchTargetType } from '@/types/enums';
import type { HomeSearchItemKind } from '@/types/enums';

export type HomeSearchTarget =
  | {
      type: typeof HomeSearchTargetType.ArticleDetail;
      articleId: string;
    }
  | {
      type: typeof HomeSearchTargetType.Webview;
      url: string;
      title: string;
    }
  | {
      type: typeof HomeSearchTargetType.Pending;
    };

export interface HomeSearchItem {
  id: string;
  kind: HomeSearchItemKind;
  title: string;
  description: string;
  meta: string;
  date: string;
  thumbnail: string;
  keywords: string[];
  target: HomeSearchTarget;
}
