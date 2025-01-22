import OpinionInterface from "./OpinionInterface";
import RatingInterface from "./RatingInterface";

interface ItemInterface {
  title: string;
  description?: string;
  image?: string;
  price?: string;
  category?: string;
  rating?: RatingInterface;
  quantity: number;
  opinions?: Array<OpinionInterface>;
}
export default ItemInterface;
