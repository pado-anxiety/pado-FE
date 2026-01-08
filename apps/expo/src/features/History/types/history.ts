import { ACTType } from './act-type';

export interface HistoryItem {
  id: number;
  type: ACTType;
  time: string;
}
