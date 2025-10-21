"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateOrderMutation } from "@/redux/features/Products/Order.api";

const formSchema = z.object({
  paymentMethod: z.enum([
    "cod",
    "bkash",
    "nagad",
    "rocket",
    "visa",
    "mastercard",
  ]),
  address: z.string().min(10, {
    message: "Address must be at least 10 characters.",
  }),
  phone: z.string().min(11, {
    message: "Phone number must be at least 11 digits.",
  }),
  alterPhone: z.string().optional(),
  deliveryFee: z.number().min(0),
  transactionId: z.string().optional(),
  note: z.string().optional(),
});

export function CheckoutDialog({ product, user, children }) {
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [createOrder, { isLoading }] = useCreateOrderMutation();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      paymentMethod: "cod",
      address: user?.address || "",
      phone: user?.phone || "",
      alterPhone: "",
      deliveryFee: 60,
      transactionId: "",
      note: "",
    },
  });

  const paymentMethod = form.watch("paymentMethod");

  async function onSubmit(values) {
    try {
      const orderData = {
        learner: user._id,
        products: [
          {
            product: product._id,
            quantity,
            unitPrice: product.price,
            totalPrice: product.price * quantity,
          },
        ],
        ...values,
      };

      await createOrder(orderData).unwrap();
      toast.success("Order placed successfully!");
      setOpen(false);
      form.reset();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to place order");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="bg-main hover:bg-amber-600 w-full py-3 font-bold rounded-2xl">
            প্রোডাক্টটি কিনুন
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] custom-dialog-width  h-[80vh] overflow-y-auto">
        <div className="space-y-4 p-1">
          <div className="border rounded-lg p-4">
            <h3 className="font-bold text-lg">{product.title}</h3>
            <p className="text-gray-600">{product.price} টাকা</p>

            <div className="flex items-center gap-4 mt-3">
              <span className="font-medium">পরিমাণ:</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <span className="w-8 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={quantity >= product.stock}
                >
                  +
                </Button>
              </div>
            </div>

            <div className="mt-2">
              <span className="font-medium">মোট মূল্য: </span>
              <span className="font-bold">{product.price * quantity} টাকা</span>
            </div>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 pb-4"
            >
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>পেমেন্ট মেথড</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="cod">ক্যাশ অন ডেলিভারি</SelectItem>
                        <SelectItem value="bkash">বিকাশ</SelectItem>
                        <SelectItem value="nagad">নগদ</SelectItem>
                        <SelectItem value="rocket">রকেট</SelectItem>
                        <SelectItem value="visa">ভিসা কার্ড</SelectItem>
                        <SelectItem value="mastercard">মাস্টারকার্ড</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {paymentMethod !== "cod" && (
                <FormField
                  control={form.control}
                  name="transactionId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ট্রানজেকশন আইডি</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter transaction ID" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ডেলিভারি ঠিকানা</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter full delivery address"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ফোন নাম্বার</FormLabel>
                      <FormControl>
                        <Input placeholder="01XXXXXXXXX" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="alterPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>বিকল্প ফোন (ঐচ্ছিক)</FormLabel>
                      <FormControl>
                        <Input placeholder="01XXXXXXXXX" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="deliveryFee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ডেলিভারি ফি</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>নোট (ঐচ্ছিক)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any special instructions?"
                        rows={2}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="sticky bottom-0 bg-background pb-4 pt-2">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "অর্ডার কনফার্ম করুন"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
