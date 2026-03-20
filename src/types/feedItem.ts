import type { CoupDeCoeur, Suggestion, PublicReport } from "./Reports";

export type FeedItem =
  | {
      type: "report";
      data: PublicReport;
    }
  | {
      type: "cdc";
      data: CoupDeCoeur;
    }
  | {
      type: "suggestion";
      data: Suggestion;
    };
