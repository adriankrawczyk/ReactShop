import React from "react";
import styled from "styled-components";
import OpinionInterface from "../Interfaces/OpinionInterface";
import {
  ColorScheme,
  StyleScheme,
  WithTransition,
} from "../Schemes/StyleScheme";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { refreshDatabaseItems } from "./ItemMapper";

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
const Opinion = ({
  content,
  author,
  itemTitle,
  onDelete,
}: OpinionInterface & { onDelete: () => void }) => {
  const handleDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/items/${itemTitle}/opinion`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            author,
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete opinion");
      } else {
        onDelete();
      }
    } catch (error) {
      console.error("Error deleting opinion:", error);
    }
  };

  const showDelete = () => {
    const user = localStorage.getItem("logged_user");
    return localStorage.getItem("isAdmin") || author === user;
  };

  return (
    <OpinionElement>
      <Author>{author}</Author>
      <OpinionContent>{content}</OpinionContent>
      {showDelete() && (
        <DeleteButton onClick={handleDelete}>
          <FontAwesomeIcon icon={faX} />
        </DeleteButton>
      )}
    </OpinionElement>
  );
};
export default Opinion;
