import { TrackingType } from "@data/enum/tracking";

export type TrackingEventData = {
  type: keyof typeof TrackingType;
  selectedInstalment?: number;
  productPrice?: number;
};

export const LOCAL_STORAGE_TRACKING_ITEM_NAME = "sessionId";
