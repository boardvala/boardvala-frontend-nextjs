import api from "./api";
import { isLoggedIn } from "../utils/auth";

export async function addToCart(data) {

  // Guest
  if (!isLoggedIn()) {

    const cart = JSON.parse(
      localStorage.getItem("guestCart")
    ) || [];

    cart.push({
      id: Date.now(),
      ...data,
    });

    localStorage.setItem(
      "guestCart",
      JSON.stringify(cart)
    );

    return {
      success: true,
      guest: true,
    };
  }

  // Logged In User
  const response = await api.post(
    "/cart",
    data
  );

  return response.data;
}

export async function getCart() {

  // Guest
  if (!isLoggedIn()) {

    return JSON.parse(
      localStorage.getItem("guestCart")
    ) || [];

  }

  const response = await api.get("/cart");

  return response.data;
}

export async function updateCartQuantity(id, quantity) {

  // Guest
  if (!isLoggedIn()) {

    const cart = JSON.parse(
      localStorage.getItem("guestCart")
    ) || [];

    const updated = cart.map(item =>
      item.id === id
        ? {
            ...item,
            quantity,
          }
        : item
    );

    localStorage.setItem(
      "guestCart",
      JSON.stringify(updated)
    );

    return;
  }

  const response = await api.put(
    `/cart/${id}`,
    {
      quantity,
    }
  );

  return response.data;
}

export async function removeCartItem(id) {

  // Guest
  if (!isLoggedIn()) {

    const cart = JSON.parse(
      localStorage.getItem("guestCart")
    ) || [];

    const updated = cart.filter(
      item => item.id !== id
    );

    localStorage.setItem(
      "guestCart",
      JSON.stringify(updated)
    );

    return;
  }

  const response = await api.delete(
    `/cart/${id}`
  );

  return response.data;
}

export async function syncGuestCart() {

  const cart = JSON.parse(
    localStorage.getItem("guestCart")
  ) || [];

  if (cart.length === 0) return;

  await api.post(
    "/cart/sync",
    {
      items: cart,
    }
  );

  localStorage.removeItem("guestCart");
}