"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCart,
  updateQuantity,
  toggleItemSelection,
  toggleSelectAll,
} from "@/redux/features/cart/cartSlice";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon, ShoppingBagIcon } from "lucide-react";
import { toast } from "sonner";
import ConfirmationDialog from "./_components/ConfirmationDialog";

export default function CartPage() {
  const { items, selectedItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const learner = useSelector((state) => state.auth?.user);

  // Add the new loading state
  const [isLoading, setIsLoading] = useState(false);

  const [shippingInfo, setShippingInfo] = useState(() => {
    // Initialize with learner data if available, otherwise check localStorage
    const initialData = {
      name: "",
      phone: "",
      email: "",
      address: "",
      altPhone: "",
      deliveryArea: "inside",
    };

    if (learner) {
      return {
        ...initialData,
        name: learner.fullName || "",
        phone: learner.phone || "",
        email: learner.email || "",
        address: learner.shippingAddress || "",
        altPhone: learner.secondaryPhone || "",
      };
    }

    if (typeof window !== "undefined") {
      const savedInfo = localStorage.getItem("shippingInfo");
      return savedInfo ? JSON.parse(savedInfo) : initialData;
    }

    return initialData;
  });

  const [isEditing, setIsEditing] = useState(() => {
    // Always start in editing mode unless there's saved info
    if (typeof window !== "undefined") {
      const savedInfo = localStorage.getItem("shippingInfo");
      return !savedInfo;
    }
    return true;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("shippingInfo", JSON.stringify(shippingInfo));
    }
  }, [shippingInfo]);

  // Update shipping info when learner data changes
  useEffect(() => {
    if (learner) {
      setShippingInfo((prev) => ({
        ...prev,
        name: learner.fullName || prev.name,
        phone: learner.phone || prev.phone,
        email: learner.email || prev.email,
        address: learner.shippingAddress || prev.address,
        altPhone: learner?.secondaryPhone || prev?.altPhone,
      }));
    }
  }, [learner]);

  const totalPrice = items
    .filter((item) => selectedItems.includes(item.id))
    .reduce((total, item) => total + item.price * item.quantity, 0);

  const selectedCount = selectedItems.length;
  const selectAll = selectedCount === items.length && items.length > 0;

  const deliveryFee = shippingInfo.deliveryArea === "inside" ? 60 : 130;
  const payableTotal = totalPrice + deliveryFee;

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity > 0) {
      dispatch(updateQuantity({ id, quantity: newQuantity }));
    } else {
      dispatch(removeFromCart(id));
    }
  };

  const handleSelectAll = () => {
    dispatch(toggleSelectAll());
  };

  const handleSelectItem = (id) => {
    dispatch(toggleItemSelection(id));
  };

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const getFullAddress = () => {
    return shippingInfo.deliveryArea === "inside"
      ? `Inside Dhaka: ${shippingInfo.address}`
      : `Outside Dhaka: ${shippingInfo.address}`;
  };

  const handleSaveAddress = () => {
    if (!shippingInfo.name || !shippingInfo.phone || !shippingInfo.address) {
      toast.error("Please fill in all required shipping information");
      return;
    }
    setIsEditing(false);
  };

  const handleProceedToCheckout = (e) => {
    if (selectedCount === 0) {
      e.preventDefault();
      return;
    }

    if (!shippingInfo.name || !shippingInfo.phone || !shippingInfo.address) {
      toast.error("Please fill in all required shipping information");
      return;
    }

    // Set loading to true right before navigation
    setIsLoading(true);

    router.push("/cart/checkout");
  };

  return (
    <div className="min-h-[70vh] max-w-[1200px] mx-auto my-6 p-4">
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 bg-white rounded-lg shadow-sm">
          <div className="space-y-4 text-center">
            <ShoppingBagIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="text-xl font-medium text-gray-900">
              Your Shopping Cart is Empty
            </h3>
            <p className="text-gray-500 max-w-md">
              Discover our exquisite collection and find something special for
              yourself
            </p>
            <div className="pt-4">
              <Link
                href="/de-jury-shop"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm  bg-main hover:bg-yellow-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <ArrowLeftIcon className="-ml-1 mr-2 h-5 w-5" />
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Cart Items */}
          <div className="lg:col-span-2">
            <div className="py-4 border rounded-md mb-5">
              <div className="flex justify-between items-center px-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    {selectAll ? "Unselect All" : "Select All"} ({selectedCount}{" "}
                    Item{selectedCount !== 1 ? "s" : ""})
                  </span>
                </div>
                <div className="flex gap-4 text-sm">
                  <div>
                    your total:{" "}
                    <span className="font-bold">{totalPrice} TK.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3 pb-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row gap-4 p-4 border rounded-md bg-yellow-50"
                >
                  <div className="flex items-center w-full sm:w-auto">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleSelectItem(item.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />

                    <div className="w-16 flex-shrink-0 ml-4 cursor-pointer">
                      <Link href={`/de-jury-shop/${item.id}`}>
                        <Image
                          src={`${process.env.NEXT_PUBLIC_API_URL}/${item.image}`}
                          alt={item.title}
                          width={50}
                          height={50}
                          className="w-full h-auto"
                        />
                      </Link>
                    </div>
                    <div className="flex-grow ml-4 space-y-2">
                      <h3 className="text-lg font-medium">{item.title}</h3>
                      <p className="text-gray-600">
                        TK.{" "}
                        <span className="line-through text-red-500 text-sm">
                          {item?.oldPrice}
                        </span>{" "}
                        {item.price}
                      </p>
                      <p className="text-red-500 text-xs">
                        Only {item.stock} copies available
                      </p>

                      <button
                        onClick={() => {
                          setItemToDelete(item.id);
                          setShowDeleteDialog(true);
                        }}
                        className="mt-2 text-red-600 text-sm hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:items-start sm:ml-auto gap-2">
                    <div className="flex items-center mt-2">
                      <button
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity - 1)
                        }
                        className="px-3 py-1 border rounded-l bg-gray-100"
                        disabled={item.quantity <= 1} // optional: prevent quantity < 1
                      >
                        -
                      </button>

                      <span className="px-4 py-1 border-t border-b bg-white">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => {
                          if (item.quantity < item.stock) {
                            handleQuantityChange(item.id, item.quantity + 1);
                          } else {
                            toast.error(
                              `You can only order up to ${item.stock} copies`
                            );
                          }
                        }}
                        className={`px-3 py-1 border rounded-r bg-gray-100 ${
                          item.quantity >= item.stock
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        disabled={item.quantity >= item.stock} // disables button if max stock reached
                      >
                        +
                      </button>
                    </div>

                    <p className="font-semibold mt-2">
                      TK. {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Shipping + Summary */}
          <div className="space-y-6">
            {/* Shipping Address */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Shipping Address</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-blue-600 text-sm hover:underline"
                >
                  {isEditing ? "Cancel" : "Edit"}
                </button>
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={shippingInfo.name}
                      onChange={handleShippingChange}
                      className="w-full p-2 border rounded-md"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={shippingInfo.phone}
                      onChange={handleShippingChange}
                      className="w-full p-2 border rounded-md"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={shippingInfo.email}
                      onChange={handleShippingChange}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Alternative Phone
                    </label>
                    <input
                      type="tel"
                      name="altPhone"
                      value={shippingInfo.altPhone}
                      onChange={handleShippingChange}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Delivery Area *
                    </label>
                    <div className="flex gap-2 flex-col">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="deliveryArea"
                          value="inside"
                          checked={shippingInfo.deliveryArea === "inside"}
                          onChange={handleShippingChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                        <span className="ml-2 text-sm whitespace-nowrap">
                          Inside Dhaka (60 TK)
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="deliveryArea"
                          value="outside"
                          checked={shippingInfo.deliveryArea === "outside"}
                          onChange={handleShippingChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                        <span className="ml-2 text-sm whitespace-nowrap">
                          Outside Dhaka (130 TK)
                        </span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Address *
                    </label>
                    <textarea
                      name="address"
                      value={shippingInfo.address}
                      onChange={handleShippingChange}
                      className="w-full p-2 border rounded-md"
                      rows="3"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {shippingInfo.address
                        ? `Will be saved as: ${getFullAddress()}`
                        : "Start typing your address"}
                    </p>
                  </div>

                  <button
                    onClick={handleSaveAddress}
                    className="w-full bg-main font-bold hover:bg-yellow-400 py-2 px-4 rounded-md"
                  >
                    Save Address
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Name:</span>{" "}
                    {shippingInfo.name}
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span>{" "}
                    {shippingInfo.phone}
                  </p>
                  {shippingInfo.email && (
                    <p>
                      <span className="font-medium">Email:</span>{" "}
                      {shippingInfo.email}
                    </p>
                  )}
                  {shippingInfo.altPhone && (
                    <p>
                      <span className="font-medium">Alt. Phone:</span>{" "}
                      {shippingInfo.altPhone}
                    </p>
                  )}
                  <p>
                    <span className="font-medium">Address:</span>{" "}
                    {getFullAddress()}
                  </p>
                </div>
              )}
            </div>

            {/* Checkout Summary */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold mb-4">Checkout Summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal ({selectedCount} items)</span>
                  <span>TK. {totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>TK. {deliveryFee.toFixed(2)}</span>
                </div>

                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>TK. {payableTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* The button is updated here */}
              <button
                onClick={handleProceedToCheckout}
                // Disable the button when no items are selected, editing is active, or loading is in progress
                disabled={selectedCount === 0 || isEditing || isLoading}
                className={`w-full mt-6 bg-main  py-3 px-4 rounded-md font-medium transition-colors ${
                  selectedCount === 0 || isEditing || isLoading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-yellow-400"
                }`}
              >
                {/* Conditionally render the button content */}
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "Proceed to Checkout"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmationDialog
        isOpen={showDeleteDialog}
        onConfirm={() => {
          dispatch(removeFromCart(itemToDelete));
          setShowDeleteDialog(false);
          setItemToDelete(null);
        }}
        onCancel={() => {
          setShowDeleteDialog(false);
          setItemToDelete(null);
        }}
        message="Are you sure you want to delete this item?"
      />
    </div>
  );
}
