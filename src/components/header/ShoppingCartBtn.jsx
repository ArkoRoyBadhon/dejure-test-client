"use client";

import { ShoppingBasket } from "lucide-react";
import { useSelector } from "react-redux";
import Link from "next/link";

const ShoppingCartBtn = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <Link href="/cart" passHref>
      <button
        className="p-2 text-gray-600 hover:text-gray-900 xl:ml-5 relative cart-icon"
        aria-label="Shopping cart"
      >
        <ShoppingBasket className="h-5 w-5" />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </button>
    </Link>
  );
};

export default ShoppingCartBtn;
