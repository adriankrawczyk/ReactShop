import OpinionInterface from "./OpinionInterface";

interface DatabaseItemInterface {
  title: string;
  quantity: number;
  opinions: Array<OpinionInterface>;
}
export default DatabaseItemInterface;
