"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
} from "react";

// Define Product type
export type Product = {
  id: string;
  name: string;
  price: number;
  sale_price?: number;
  description?: string;
  image: string;
  weight?: string;
  discount?: number;
  quantity?: number;
};

// Internal cart state
type CartState = {
  items: Product[];
};

// Adjusted action type to accept optional fields
type CartAction =
  | {
      type: "ADD_ITEM";
      payload: Partial<Product> & {
        id: string;
        name: string;
        price: number;
        image: string;
      };
    }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "CLEAR_CART" };

type CartContextType = {
  cart: CartState;
  addToCart: (
    item: Partial<Product> & {
      id: string;
      name: string;
      price: number;
      image: string;
    }
  ) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const initialState: CartState = {
  items: [],
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingIndex = state.items.findIndex(
        (item) => item.id === action.payload.id
      );

      if (existingIndex >= 0) {
        const updatedItems = [...state.items];
        updatedItems[existingIndex] = {
          ...updatedItems[existingIndex],
          quantity: (updatedItems[existingIndex].quantity ?? 1) + 1,
        };
        return { items: updatedItems };
      }

      return {
        items: [...state.items, { ...action.payload, quantity: 1 }],
      };
    }

    case "REMOVE_ITEM": {
      const updatedItems = state.items
        .map((item) =>
          item.id === action.payload
            ? { ...item, quantity: (item.quantity ?? 1) - 1 }
            : item
        )
        .filter((item) => (item.quantity ?? 0) > 0);

      return { items: updatedItems };
    }

    case "CLEAR_CART":
      return { items: [] };

    default:
      return state;
  }
}

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, dispatch] = useReducer(cartReducer, initialState);

  const addToCart = (
    item: Partial<Product> & {
      id: string;
      name: string;
      price: number;
      image: string;
    }
  ) => {
    dispatch({ type: "ADD_ITEM", payload: item });
  };

  const removeFromCart = (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
