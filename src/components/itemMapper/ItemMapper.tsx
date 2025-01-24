import { useEffect } from "react";
import Item from "../item/Item";
import Opinion from "../opinion/Opinion";
import { useItemMapperLogic } from "./useItemMapperLogic";
import {
  ItemMapperWrapper,
  NoOpinionsMessage,
  ErrorMessage,
} from "./ItemMapper.styles";
import OpinionInterface from "../../Interfaces/OpinionInterface";

const ItemMapper = () => {
  const {
    displayData,
    databaseItemData,
    error,
    wrapperRef,
    currentOpinionItemTitle,
    syncCart,
  } = useItemMapperLogic();

  useEffect(() => {
    const timeoutId = setTimeout(syncCart, 500);
    return () => clearTimeout(timeoutId);
  }, [syncCart]);

  const renderOpinions = () => {
    const currentItem = databaseItemData.find(
      (item) => item.title === currentOpinionItemTitle
    );

    if (!currentItem || !currentItem.opinions.length) {
      return (
        <NoOpinionsMessage>
          No opinions yet. Be the first to share your thoughts!
        </NoOpinionsMessage>
      );
    }

    return currentItem.opinions.map(
      (opinion: OpinionInterface, index: number) => (
        <Opinion
          key={`opinion-${index}`}
          author={opinion.author}
          content={opinion.content}
          rating={opinion.rating}
          itemTitle={currentItem.title}
          onDelete={function (): void {
            throw new Error("Function not implemented.");
          }}
        />
      )
    );
  };

  return (
    <ItemMapperWrapper ref={wrapperRef}>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {currentOpinionItemTitle.length > 0
        ? renderOpinions()
        : displayData.map((el, index) => {
            const { title, description, image, price, category, rating } = el;
            const matchedItem = databaseItemData.find(
              (item) => item.title === title
            );
            const baseQuantity = matchedItem?.quantity || 0;
            const opinions = matchedItem?.opinions || [];

            if (baseQuantity > 0) {
              return (
                <Item
                  key={`item-${index}`}
                  title={title}
                  description={description}
                  image={image}
                  price={price}
                  category={category}
                  rating={rating}
                  baseQuantity={baseQuantity}
                  opinions={opinions}
                  quantity={0}
                />
              );
            }
            return null;
          })}
    </ItemMapperWrapper>
  );
};

export default ItemMapper;
