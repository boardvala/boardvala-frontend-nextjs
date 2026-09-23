// cart count localStorage मधून — एकूण quantity (सगळ्या items ची qty बेरीज)
export function getCartCount() {
  try {
    const cart = JSON.parse(localStorage.getItem("customCart")) || [];
    return cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  } catch {
    return 0;
  }
}

// cart बदललं — हे म्हणा (navbar badge ला कळेल)
export function notifyCartChanged() {
  window.dispatchEvent(new Event("cartChanged"));
}