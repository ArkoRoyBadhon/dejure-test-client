import { createSlice } from "@reduxjs/toolkit";

// Helper: Safe localStorage getter
const safeLocalStorageGet = (key) => {
  if (typeof window === "undefined") return null; // SSR guard
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

// Helper: Safe localStorage setter
const safeLocalStorageSet = (key, value) => {
  if (typeof window === "undefined") return; // SSR guard
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
};

// Helper function to load cart from localStorage
const loadCartFromLocalStorage = () => {
  const serializedCart = safeLocalStorageGet("cart");
  if (!serializedCart) {
    return { items: [], selectedItems: [], flyAnimation: null };
  }
  try {
    const parsed = JSON.parse(serializedCart);
    return {
      items: parsed.items || [],
      selectedItems: parsed.selectedItems || [],
      flyAnimation: parsed.flyAnimation || null,
    };
  } catch {
    return { items: [], selectedItems: [], flyAnimation: null };
  }
};

// Initialize state from localStorage (safe for SSR)
const initialState = loadCartFromLocalStorage();

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = {
        id: action.payload._id,
        title: action.payload.title,
        price: action.payload.price,
        image: action.payload.image,
        stock: action.payload.stock,
        oldPrice: action.payload.oldPrice,
      };

      const existingItemIndex = state.items.findIndex(
        (item) => item.id === product.id
      );

      if (existingItemIndex >= 0) {
        state.items[existingItemIndex].quantity += 1;
      } else {
        state.items.push({ ...product, quantity: 1 });
        state.selectedItems.push(product.id);
      }

      state.flyAnimation = {
        productId: product.id,
        image: product.image,
        title: product.title,
      };

      safeLocalStorageSet("cart", state);
    },
    clearFlyAnimation: (state) => {
      state.flyAnimation = null;
      safeLocalStorageSet("cart", state);
    },
    removeFromCart: (state, action) => {
      const itemId = action.payload;
      state.items = state.items.filter((item) => item.id !== itemId);
      state.selectedItems = state.selectedItems.filter((id) => id !== itemId);
      safeLocalStorageSet("cart", state);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item) {
        item.quantity = quantity;
        if (quantity <= 0) {
          state.items = state.items.filter((item) => item.id !== id);
          state.selectedItems = state.selectedItems.filter(
            (selectedId) => selectedId !== id
          );
        }
        safeLocalStorageSet("cart", state);
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.selectedItems = [];
      safeLocalStorageSet("cart", state);
    },
    toggleItemSelection: (state, action) => {
      const itemId = action.payload;
      if (state.selectedItems.includes(itemId)) {
        state.selectedItems = state.selectedItems.filter((id) => id !== itemId);
      } else {
        state.selectedItems.push(itemId);
      }
      safeLocalStorageSet("cart", state);
    },
    toggleSelectAll: (state) => {
      if (state.selectedItems.length === state.items.length) {
        state.selectedItems = [];
      } else {
        state.selectedItems = state.items.map((item) => item.id);
      }
      safeLocalStorageSet("cart", state);
    },
  },
});

export const {
  addToCart,
  clearFlyAnimation,
  removeFromCart,
  updateQuantity,
  clearCart,
  toggleItemSelection,
  toggleSelectAll,
} = cartSlice.actions;

export default cartSlice.reducer;
