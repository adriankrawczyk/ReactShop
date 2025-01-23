import React, { useContext } from "react";
import styled from "styled-components";
import OpinionInterface from "../Interfaces/OpinionInterface";
import {
  ColorScheme,
  StyleScheme,
  WithTransition,
} from "../Schemes/StyleScheme";
import { faX, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { refreshDatabaseItems } from "./ItemMapper";
import { useAppContext } from "../AppContext";

const OpinionElement = styled.div`
  position: relative;
  width: 90%;
  margin-bottom: 3.5vh;
  height: 120px;
  background: linear-gradient(
    200deg,
    rgba(210, 232, 255, 1) 0%,
    rgba(225, 241, 255, 1) 100%
  );
  border: 2px solid #bbb;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const OpinionContent = styled.div`
  font-size: 1.75vmax;
`;

const Author = styled.div`
  position: absolute;
  left: 1vmax;
  top: 1vmax;
`;

const DeleteButton = styled.div`
  position: absolute;
  right: 1vmax;
  top: 1vmax;
  width: 2vmax;
  height: 2vmax;
  border: 2px solid ${StyleScheme.borderColor};
  background-color: ${ColorScheme.red};
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  ${WithTransition()}
`;

const StarContainer = styled.div`
  position: absolute;
  right: 0.5vmax;
  bottom: 0.5vmax;
`;

const Opinion = ({
  content,
  author,
  rating,
  itemTitle,
  onDelete,
}: OpinionInterface & { onDelete: () => void }) => {
  const { setOpinionArray, opinionArray } = useAppContext();

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      const response = await fetch(
        `http://localhost:5000/api/items/${encodeURIComponent(
          itemTitle
        )}/opinion`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ author }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete opinion");
      }

      // Update local state to reflect the deletion
      setOpinionArray(opinionArray.filter((el) => el.author !== author));
      onDelete(); // Call the onDelete callback if provided
    } catch (error) {
      console.error("Error deleting opinion:", error);
    }
  };

  const showDelete = () => {
    const user = localStorage.getItem("logged_user");
    const isAdmin = localStorage.getItem("isAdmin") === "admin";
    return isAdmin || author === user;
  };

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
