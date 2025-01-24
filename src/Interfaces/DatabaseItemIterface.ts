import OpinionInterface from "./OpinionInterface";

export interface DatabaseItemInterface {
  title: string;
  quantity: number;
  opinions: Array<OpinionInterface>;
}
