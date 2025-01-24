import DatabaseItemInterface from "../../Interfaces/DatabaseItemInterface";

export const refreshDatabaseItems = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/items", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: DatabaseItemInterface[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching database items:", error);
    return [];
  }
};

export const fetchCartData = async (username: string) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/users/${username}/cart`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch cart data (${response.status})`);
    }

    const cartData = await response.json();
    return cartData;
  } catch (error) {
    console.error("Error fetching cart data:", error);
    throw new Error(
      "Failed to load cart data. Please try refreshing the page."
    );
  }
};

export const fetchPurchaseHistory = async (username: string) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/users/${username}/purchases`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch purchase history (${response.status})`);
    }

    const purchaseData = await response.json();
    return purchaseData;
  } catch (error) {
    console.error("Error fetching purchase history:", error);
    throw new Error(
      "Failed to load purchase history. Please try refreshing the page."
    );
  }
};
