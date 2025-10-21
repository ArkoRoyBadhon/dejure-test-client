"use client";

import { useSelector } from "react-redux";
import FlyAnimation from "./shared/FlyAnimation";

export default function CartAnimationWrapper() {
  const { flyAnimation } = useSelector((state) => state.cart);

  return <>{flyAnimation && <FlyAnimation product={flyAnimation} />}</>;
}
