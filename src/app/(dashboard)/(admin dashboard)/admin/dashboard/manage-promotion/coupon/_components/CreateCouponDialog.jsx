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
import { useEffect, useMemo, useState, useCallback } from "react";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  useCreateCouponMutation,
  useUpdateCouponMutation,
} from "@/redux/features/coupon/coupon.api";

import { useGetAllProductsQuery } from "@/redux/features/Products/Products.api";
import { useGetCoursesQuery } from "@/redux/features/course/course.api";
import { useGetAllLearnersQuery } from "@/redux/features/auth/learner.api";

import InlineMultiChecklist from "./InlineMultiChecklist";
import { Checkbox } from "@/components/ui/checkbox";

const numOpt = z.preprocess(
  (v) =>
    v === "" || v === null || typeof v === "undefined" ? undefined : Number(v),
  z.number().nonnegative().optional()
);

const formSchema = z
  .object({
    code: z.string().min(1, "Code is required"),
    discountType: z.enum(["PERCENT", "FIXED"]),
    DiscountFixed: numOpt,
    DiscountPercentage: numOpt,
    minOrderValue: numOpt,
    maxDiscount: numOpt,
    audienceType: z.enum(["ALL", "SPECIFIC"]),
    usageLimit: numOpt,
    perUserLimit: numOpt,
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    isActive: z.boolean().default(true),
  })
  .superRefine((data, ctx) => {
    if (data.discountType === "FIXED" && (data.DiscountFixed ?? null) == null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["DiscountFixed"],
        message: "DiscountFixed is required for FIXED coupons",
      });
    }
    if (
      data.discountType === "PERCENT" &&
      (data.DiscountPercentage ?? null) == null
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["DiscountPercentage"],
        message: "DiscountPercentage is required for PERCENT coupons",
      });
    }
    const p = Number(data.DiscountPercentage ?? NaN);
    if (
      data.discountType === "PERCENT" &&
      Number.isFinite(p) &&
      (p < 0 || p > 100)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["DiscountPercentage"],
        message: "Percentage must be between 0 and 100",
      });
    }
  });

const dateStr = (d) => (d ? new Date(d).toISOString().slice(0, 10) : "");

/** Extract array from many possible shapes */
const pickArray = (raw, preferredKeys = []) => {
  if (Array.isArray(raw)) return raw;
  const keys = [
    ...preferredKeys,
    "learners",
    "products",
    "courses",
    "data",
    "results",
    "items",
    "rows",
    "list",
    "docs",
  ];
  for (const k of keys) {
    if (raw && Array.isArray(raw[k])) return raw[k];
  }
  if (raw && typeof raw === "object") {
    const firstArr = Object.values(raw).find(Array.isArray);
    if (Array.isArray(firstArr)) return firstArr;
  }
  return [];
};

/** Normalize to [{ value, label }] */
const mapToOptions = (arr) =>
  arr.map((it) => ({
    value: String(it?._id ?? it?.id),
    label:
      it?.title ??
      it?.name ??
      it?.fullName ??
      it?.email ??
      it?.code ??
      String(it?._id ?? it?.id),
  }));

export function CreateCouponDialog({ coupon, children }) {
  const [open, setOpen] = useState(false);
  const [createCoupon, { isLoading: isCreating }] = useCreateCouponMutation();
  const [updateCoupon, { isLoading: isUpdating }] = useUpdateCouponMutation();

  // Data
  const { data: productsRes, isLoading: loadingProducts } =
    useGetAllProductsQuery();
  const { data: coursesRes, isLoading: loadingCourses } = useGetCoursesQuery();
  const { data: learnersRes, isLoading: loadingLearners } =
    useGetAllLearnersQuery();

  const productOptions = useMemo(
    () => mapToOptions(pickArray(productsRes, ["products"])),
    [productsRes]
  );
  const courseOptions = useMemo(
    () => mapToOptions(pickArray(coursesRes, ["courses"])),
    [coursesRes]
  );
  const learnerOptions = useMemo(
    () => mapToOptions(pickArray(learnersRes, ["learners"])),
    [learnersRes]
  );

  // Defaults
  const defaults = useMemo(
    () => ({
      code: coupon?.code || "",
      discountType: coupon?.discountType || "FIXED",
      DiscountFixed:
        typeof coupon?.DiscountFixed === "number"
          ? coupon?.DiscountFixed
          : undefined,
      DiscountPercentage:
        typeof coupon?.DiscountPercentage === "number"
          ? coupon?.DiscountPercentage
          : undefined,
      minOrderValue:
        typeof coupon?.minOrderValue === "number"
          ? coupon?.minOrderValue
          : undefined,
      maxDiscount:
        typeof coupon?.maxDiscount === "number"
          ? coupon?.maxDiscount
          : undefined,
      audienceType: coupon?.audienceType || "ALL",
      usageLimit:
        typeof coupon?.usageLimit === "number" ? coupon?.usageLimit : undefined,
      perUserLimit:
        typeof coupon?.perUserLimit === "number" ? coupon?.perUserLimit : 1,
      startDate: dateStr(coupon?.startDate),
      endDate: dateStr(coupon?.endDate),
      isActive: typeof coupon?.isActive === "boolean" ? coupon?.isActive : true,
    }),
    [coupon]
  );

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: defaults,
    mode: "onChange",
  });

  // Get the current discount type from the form
  const discountType = form.watch("discountType");

  // “All” toggles + local selections
  const [allProducts, setAllProducts] = useState(
    !(coupon?.applicableProducts?.length > 0)
  );
  const [allCourses, setAllCourses] = useState(
    !(coupon?.applicableCourses?.length > 0)
  );
  const [allLearners, setAllLearners] = useState(
    (coupon?.audienceType || "ALL") !== "SPECIFIC"
  );

  const [selectedProducts, setSelectedProducts] = useState(
    (coupon?.applicableProducts || []).map(String)
  );
  const [selectedCourses, setSelectedCourses] = useState(
    (coupon?.applicableCourses || []).map(String)
  );
  const [selectedLearners, setSelectedLearners] = useState(
    (coupon?.allowedLearners || []).map(String)
  );

  // Keep audienceType synced with “All Learners”
  useEffect(() => {
    form.setValue("audienceType", allLearners ? "ALL" : "SPECIFIC", {
      shouldDirty: true,
      shouldTouch: false,
      shouldValidate: false,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allLearners]);

  // Clear selections when switching TO All
  const onToggleAllProducts = useCallback((v) => {
    const isAll = !!v;
    setAllProducts(isAll);
    if (isAll) setSelectedProducts([]);
  }, []);
  const onToggleAllCourses = useCallback((v) => {
    const isAll = !!v;
    setAllCourses(isAll);
    if (isAll) setSelectedCourses([]);
  }, []);
  const onToggleAllLearners = useCallback((v) => {
    const isAll = !!v;
    setAllLearners(isAll);
    if (isAll) setSelectedLearners([]);
  }, []);

  // Reset on open
  useEffect(() => {
    if (open) {
      form.reset(defaults);
      setAllProducts(!(coupon?.applicableProducts?.length > 0));
      setAllCourses(!(coupon?.applicableCourses?.length > 0));
      setAllLearners((coupon?.audienceType || "ALL") !== "SPECIFIC");
      setSelectedProducts((coupon?.applicableProducts || []).map(String));
      setSelectedCourses((coupon?.applicableCourses || []).map(String));
      setSelectedLearners((coupon?.allowedLearners || []).map(String));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, coupon?._id]);

  async function onSubmit(values) {
    const payload = {
      code: values.code,
      discountType: values.discountType,
      DiscountFixed: values.DiscountFixed,
      DiscountPercentage: values.DiscountPercentage,
      minOrderValue: values.minOrderValue,
      maxDiscount: values.maxDiscount,
      audienceType: values.audienceType,

      // Only send arrays if All = false AND we actually picked some
      ...(allLearners || selectedLearners.length === 0
        ? {}
        : { allowedLearners: selectedLearners }),
      ...(allProducts || selectedProducts.length === 0
        ? {}
        : { applicableProducts: selectedProducts }),
      ...(allCourses || selectedCourses.length === 0
        ? {}
        : { applicableCourses: selectedCourses }),

      usageLimit: values.usageLimit,
      perUserLimit: values.perUserLimit ?? 1,
      startDate: values.startDate
        ? new Date(values.startDate).toISOString()
        : undefined,
      endDate: values.endDate
        ? new Date(values.endDate).toISOString()
        : undefined,
      isActive: values.isActive,
    };

    try {
      if (coupon?._id) {
        await updateCoupon({ id: coupon._id, body: payload }).unwrap();
        toast("Coupon updated successfully");
      } else {
        await createCoupon(payload).unwrap();
        toast("Coupon created successfully");
      }
      setOpen(false);
      form.reset(defaults);
    } catch (error) {
      toast(error?.data?.message || "Something went wrong");
    }
  }

  const submitDisabled = isCreating || isUpdating;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Create Coupon
          </Button>
        )}
      </DialogTrigger>

      {/* Ensure dialog never overlaps footer/buttons */}
      <DialogContent className="custom-dialog-width max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{coupon ? "Edit Coupon" : "Create Coupon"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* --------- Basics --------- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., SAVE10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="discountType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount Type</FormLabel>
                    <FormControl>
                      <select
                        className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                      >
                        <option value="FIXED">FIXED</option>
                        <option value="PERCENT">PERCENT</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Show Fixed Amount field only when discountType is FIXED */}
              {discountType === "FIXED" && (
                <FormField
                  control={form.control}
                  name="DiscountFixed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fixed Amount</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="e.g., 500"
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Show Percentage field only when discountType is PERCENT */}
              {discountType === "PERCENT" && (
                <FormField
                  control={form.control}
                  name="DiscountPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Percentage (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="e.g., 10"
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="usageLimit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Usage Limit</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="10"
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="perUserLimit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Per Learner Limit</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Default 1"
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-3">
                    <div className="space-y-1">
                      <FormLabel>Active</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Toggle to enable/disable the coupon
                      </div>
                    </div>
                    <FormControl>
                      <input
                        type="checkbox"
                        className="h-4 w-4"
                        checked={!!field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* --------- Products --------- */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <FormLabel className="text-base">Products</FormLabel>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={allProducts}
                    onCheckedChange={onToggleAllProducts}
                  />
                  <span className="text-sm">All</span>
                </div>
              </div>
              <InlineMultiChecklist
                idPrefix="prod"
                options={productOptions}
                selected={selectedProducts}
                onChange={setSelectedProducts}
                disabled={allProducts}
                loading={loadingProducts}
                heightClass="h-56"
              />
              <p className="text-xs text-muted-foreground">
                {allProducts
                  ? "Applies to all products"
                  : `Selected: ${selectedProducts.length}`}
              </p>
            </div>

            {/* --------- Courses --------- */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <FormLabel className="text-base">Courses</FormLabel>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={allCourses}
                    onCheckedChange={onToggleAllCourses}
                  />
                  <span className="text-sm">All</span>
                </div>
              </div>
              <InlineMultiChecklist
                idPrefix="course"
                options={courseOptions}
                selected={selectedCourses}
                onChange={setSelectedCourses}
                disabled={allCourses}
                loading={loadingCourses}
                heightClass="h-56"
              />
              <p className="text-xs text-muted-foreground">
                {allCourses
                  ? "Applies to all courses"
                  : `Selected: ${selectedCourses.length}`}
              </p>
            </div>

            {/* --------- Learners --------- */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <FormLabel className="text-base">Learners</FormLabel>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={allLearners}
                    onCheckedChange={onToggleAllLearners}
                  />
                  <span className="text-sm">All</span>
                </div>
              </div>

              {!allLearners && (
                <>
                  <InlineMultiChecklist
                    idPrefix="learner"
                    options={learnerOptions}
                    selected={selectedLearners}
                    onChange={setSelectedLearners}
                    disabled={false}
                    loading={loadingLearners}
                    heightClass="h-56"
                  />
                  <p className="text-xs text-muted-foreground">
                    Audience type set to <b>SPECIFIC</b>. Selected:{" "}
                    {selectedLearners.length}
                  </p>
                </>
              )}

              {allLearners && (
                <p className="text-xs text-muted-foreground">
                  Audience type set to <b>ALL</b> (no learner restriction).
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-1/2 flex mx-auto items-center justify-center border"
              disabled={submitDisabled}
            >
              {submitDisabled ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : coupon ? (
                "Update"
              ) : (
                "Create"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
