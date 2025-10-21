"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { clearFlyAnimation } from "@/redux/features/cart/cartSlice";
import Image from "next/image";

export default function FlyAnimation({ product }) {
  const dispatch = useDispatch();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [targetPosition, setTargetPosition] = useState(null);

  useEffect(() => {
    // Calculate initial position (product image position)
    const productImg = document.querySelector(".product-image");
    const rect = productImg?.getBoundingClientRect();
    const initialX = rect ? rect.left + rect.width / 2 : 0;
    const initialY = rect ? rect.top + rect.height / 2 : 0;
    setPosition({ x: initialX, y: initialY });

    // Calculate target position (cart icon position)
    const cartIcon = document.querySelector(".cart-icon");
    if (cartIcon) {
      const cartRect = cartIcon.getBoundingClientRect();
      setTargetPosition({
        x: cartRect.left + cartRect.width / 2,
        y: cartRect.top + cartRect.height / 2,
      });
    }

    // Clear animation after it completes
    const timer = setTimeout(() => {
      dispatch(clearFlyAnimation());
    }, 1000);

    return () => clearTimeout(timer);
  }, [dispatch]);

  if (!targetPosition || !product) return null;

  return (
    <div
      className="fixed z-50 pointer-events-none transition-all duration-1000 ease-in-out"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: `translate(${targetPosition.x - position.x}px, ${
          targetPosition.y - position.y
        }px)`,
        opacity: 0,
        width: "40px",
        height: "40px",
      }}
    >
      <div className="relative w-full h-full">
        <Image
          src={`${process.env.NEXT_PUBLIC_API_URL}/${product.image}`}
          alt={product.title}
          fill
          className="object-contain rounded-full border-2 border-white shadow-lg"
        />
      </div>
    </div>
  );
}
