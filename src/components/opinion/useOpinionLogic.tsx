import { useAppContext } from "../../AppContext";
import OpinionInterface from "../../Interfaces/OpinionInterface";

export const useOpinionLogic = ({
  author,
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

      setOpinionArray(opinionArray.filter((el) => el.author !== author));
      onDelete();
    } catch (error) {
      console.error("Error deleting opinion:", error);
    }
  };

  const showDelete = () => {
    const user = localStorage.getItem("logged_user");
    const isAdmin = localStorage.getItem("isAdmin") === "admin";
    return isAdmin || author === user;
  };

  return {
    handleDelete,
    showDelete,
  };
};
