import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX, faStar } from "@fortawesome/free-solid-svg-icons";
import { useOpinionLogic } from "./useOpinionLogic";
import {
  OpinionElement,
  OpinionContent,
  Author,
  DeleteButton,
  StarContainer,
} from "./Opinion.styles";
import OpinionInterface from "../../Interfaces/OpinionInterface";

const Opinion = ({
  content,
  author,
  rating,
  itemTitle,
  onDelete,
}: OpinionInterface & { onDelete: () => void }) => {
  const { handleDelete, showDelete } = useOpinionLogic({
    author,
    itemTitle,
    onDelete,
  });

  return (
    <OpinionElement>
      <Author>{author}</Author>
      <OpinionContent>{content}</OpinionContent>
      <StarContainer>
        {[...Array(5)].map((_, index) => (
          <FontAwesomeIcon
            key={index}
            icon={faStar}
            style={{
              color: index < rating ? "gold" : "gray",
            }}
          />
        ))}
      </StarContainer>
      {showDelete() && (
        <DeleteButton onClick={handleDelete}>
          <FontAwesomeIcon icon={faX} />
        </DeleteButton>
      )}
    </OpinionElement>
  );
};

export default Opinion;
