"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowRight } from "lucide-react";
import {
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
} from "@/redux/features/category/category.api";
import { useDeleteSubCategoryMutation } from "@/redux/features/category/subcategory.api";
import { toast } from "sonner";
import CreateCategoryModal from "@/components/shared/Modals/CreateCategoryModal";
import ManageCategoryModal from "@/components/shared/Modals/ManageCategoryModal";
import Image from "next/image";
import SubCategoryModal from "@/components/shared/Modals/SubCategoryModal";
import CategoryCard from "@/components/Category/CategoryCard";
import SubCategoryList from "@/components/Admin/Categories/SubCategoryList";

import Loader from "@/components/shared/Loader";
import PermissionError from "@/components/shared/PermissionError";

export default function AdminCategoryPage() {
  const [openModal, setOpenModal] = useState(false);
  const [openManageModal, setOpenManageModal] = useState(false);
  const [openSubCategoryModal, setOpenSubCategoryModal] = useState(false);
  const [openEditSubCategoryModal, setOpenEditSubCategoryModal] =
    useState(false);

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [deleteType, setDeleteType] = useState(null);

  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(null);

  const [deleteCategory] = useDeleteCategoryMutation();
  const [deleteSubCategory] = useDeleteSubCategoryMutation();

  const {
    data: categories,
    isLoading,
    isError,
    error,
  } = useGetCategoriesQuery();
  const [categorySearch, setCategorySearch] = useState("");
  const [categoryFilterStatus, setCategoryFilterStatus] = useState("ALL");

  const [subCategorySearch, setSubCategorySearch] = useState("");
  const [subCategoryFilterStatus, setSubCategoryFilterStatus] = useState("ALL");

  // Automatically select the first category when categories are loaded
  useEffect(() => {
    if (categories && categories.length > 0 && !selectedCategoryId) {
      setSelectedCategoryId(categories[0]._id);
      setSelectedCategory(categories[0]);
    }
  }, [categories, selectedCategoryId]);

  const handleCategoryClick = (category) => {
    setSelectedCategoryId(category._id);
    setSelectedCategory(category);
  };

  const handleDeleteClick = (id) => {
    setDeleteTargetId(id);
    setDeleteType("category");
    setConfirmDeleteOpen(true);
  };

  const handleSubcategoryDeleteClick = (id) => {
    setDeleteTargetId(id);
    setDeleteType("subcategory");
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId || !deleteType) return;

    try {
      if (deleteType === "category") {
        await deleteCategory(deleteTargetId).unwrap();
        toast.success("Category deleted successfully");

        if (selectedCategoryId === deleteTargetId) {
          setSelectedCategoryId(null);
          setSelectedCategory(null);
        }
      } else if (deleteType === "subcategory") {
        await deleteSubCategory(deleteTargetId).unwrap();
        toast.success("Sub-category deleted successfully");
      }
    } catch (err) {
      toast.error(
        deleteType === "category"
          ? "Failed to delete category"
          : "Failed to delete sub-category"
      );
    } finally {
      setDeleteTargetId(null);
      setDeleteType(null);
      setConfirmDeleteOpen(false);
    }
  };

  const handleSubCategoryEdit = (subcategoryId) => {
    setSelectedSubCategoryId(subcategoryId);
    setOpenEditSubCategoryModal(true);
  };

  if (error?.data?.message === "Insufficient module permissions") {
    return <PermissionError error={error} />;
  }

  return (
    <div className="flex flex-col md:flex-row p-4 gap-4">
      {/* Left: Category List */}
      <div className="w-full md:w-1/3 bg-white rounded-xl shadow p-4 border">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">CATEGORIES</h2>
          <button
            onClick={() => setOpenModal(true)}
            className="text-xs px-4 py-1 rounded-md bg-yellow-100 hover:bg-yellow-100 text-yellow-700 border border-yellow-400"
          >
            + ADD
          </button>
        </div>
        <input
          type="text"
          placeholder="Search categories..."
          value={categorySearch}
          onChange={(e) => setCategorySearch(e.target.value)}
          className="w-full mb-3 px-3 py-1 border rounded"
        />

        <div className="flex gap-2 mb-3">
          {["ALL", "ACTIVE", "INACTIVE"].map((status) => (
            <button
              key={status}
              onClick={() => setCategoryFilterStatus(status)}
              className={`px-3 py-1 rounded text-sm border ${
                categoryFilterStatus === status
                  ? "bg-yellow-600 text-white"
                  : "bg-yellow-100 hover:bg-yellow-100 text-yellow-700 border border-yellow-400"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {isLoading ? (
          <Loader />
        ) : isError ? (
          <div className="text-center p-4 text-red-500">
            Failed to load categories
          </div>
        ) : (
          <div className="space-y-2">
            {categories
              ?.filter((category) =>
                category.title
                  .toLowerCase()
                  .includes(categorySearch.toLowerCase())
              )
              .filter((category) => {
                if (categoryFilterStatus === "ALL") return true;
                if (categoryFilterStatus === "ACTIVE") return category.isActive;
                if (categoryFilterStatus === "INACTIVE")
                  return !category.isActive;
                return true;
              })
              .map((category) => (
                <CategoryCard
                  key={category._id}
                  category={category}
                  selectedCategoryId={selectedCategoryId}
                  onClick={handleCategoryClick}
                  onEdit={() => {
                    setSelectedCategoryId(category._id);
                    setOpenManageModal(true);
                  }}
                  onDelete={() => handleDeleteClick(category._id)}
                />
              ))}
          </div>
        )}
      </div>

      {/* Right: Subcategories */}
      <div className="w-full md:w-2/3 bg-white rounded-xl shadow p-4 border">
        {selectedCategory ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xs font-semibold flex items-center">
                <ArrowRight size={12} /> {selectedCategory.title}
              </h2>

              <button
                onClick={() => setOpenSubCategoryModal(true)}
                className="text-xs px-4 py-1 rounded-md bg-yellow-100 hover:bg-yellow-100 text-yellow-700 border border-yellow-400"
              >
                + ADD
              </button>
            </div>

            <div
              className={`p-2 rounded-lg border flex justify-between items-center hover:shadow-sm transition cursor-pointer ${
                selectedCategoryId === selectedCategory._id
                  ? "border-yellow-600 bg-yellow-50"
                  : "border-main-200"
              }`}
            >
              <div className="flex items-center gap-3">
                {selectedCategory.thumbnail && (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}/${selectedCategory.thumbnail}`}
                    alt={selectedCategory.title}
                    height={100}
                    width={100}
                    unoptimized
                    className="h-10 w-10 object-cover rounded"
                  />
                )}
                <div>
                  <p className="font-medium">{selectedCategory.title}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <p className="text-xs text-gray-500">
                      Subcategories:{" "}
                      <span className="bg-yellow-100 text-yellow-700 border border-yellow-400 px-1 rounded-full">
                        {selectedCategory.subCategories?.length || 0}
                      </span>
                    </p>

                    <p className="text-xs text-gray-500">
                      Listed Courses:{" "}
                      <span className="bg-yellow-100 text-yellow-900 border border-yellow-400 px-1 rounded-full ">
                        {isLoading ? "..." : selectedCategory?.length || 0}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-4">
              {selectedCategory.imageUrl && (
                <Image
                  src={selectedCategory.imageUrl}
                  alt={selectedCategory.title}
                  height={100}
                  width={100}
                  unoptimized
                  className="h-16 w-16 object-cover rounded"
                />
              )}
            </div>

            <div className="flex flex-col items-center gap-3 mt-3 mb-4">
              <input
                type="text"
                placeholder="Search subcategories..."
                value={subCategorySearch}
                onChange={(e) => setSubCategorySearch(e.target.value)}
                className="px-3 py-1 border rounded w-full max-w-xs"
              />
              <div className="flex gap-3">
                {["ALL", "ACTIVE", "INACTIVE"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setSubCategoryFilterStatus(status)}
                    className={`px-3 py-1 rounded text-sm border ${
                      subCategoryFilterStatus === status
                        ? "bg-yellow-600 text-white"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <SubCategoryList
              categoryId={selectedCategory._id}
              onDelete={handleSubcategoryDeleteClick}
              onEdit={handleSubCategoryEdit}
              search={subCategorySearch}
              filterStatus={subCategoryFilterStatus}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <h3 className="text-lg font-medium text-gray-500 mb-2">
              No Category Selected
            </h3>
            <p className="text-sm text-gray-400">
              Click on a category from the left panel to view its details and
              subcategories
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateCategoryModal open={openModal} setOpen={setOpenModal} />

      {openManageModal && selectedCategoryId && (
        <ManageCategoryModal
          open={openManageModal}
          setOpen={setOpenManageModal}
          categoryId={selectedCategoryId}
        />
      )}

      {/* Create Subcategory Modal */}
      {openSubCategoryModal && selectedCategoryId && (
        <SubCategoryModal
          open={openSubCategoryModal}
          setOpen={setOpenSubCategoryModal}
          categoryId={selectedCategoryId}
        />
      )}

      {/* Edit Subcategory Modal */}
      {openEditSubCategoryModal && selectedSubCategoryId && (
        <SubCategoryModal
          open={openEditSubCategoryModal}
          setOpen={setOpenEditSubCategoryModal}
          categoryId={selectedCategoryId}
          subCategoryId={selectedSubCategoryId}
          isEdit={true}
        />
      )}

      {/* Global Confirm Dialog */}
      <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete this{" "}
            {deleteType === "category" ? "category" : "sub-category"}?
          </p>
          <DialogFooter className="mt-4">
            <Button
              className="cursor-pointer"
              variant="secondary"
              onClick={() => setConfirmDeleteOpen(false)}
            >
              No
            </Button>
            <Button
              className="cursor-pointer"
              variant="destructive"
              onClick={handleConfirmDelete}
            >
              Yes, delete it
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
