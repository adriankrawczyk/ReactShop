import RatingInterface from "./RatingInterface";

interface ItemInterface {
  title: string;
  description: string;
  image: string;
  price: string;
  category: string;
  rating: RatingInterface;
}
export default ItemInterface;
