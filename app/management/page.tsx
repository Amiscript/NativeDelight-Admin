
"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import MenuItemTable from "../components/ManagementComp/MeuItemTable";
import MenuStatsCards from "../components/ManagementComp/MenuStatsCard";
import MenuFilters from "../components/ManagementComp/MenuFilter";
import MenuItemForm from "../components/ManagementComp/MenuItemForm";
import DeleteConfirmationModal from "../components/ManagementComp/DeleteModal";
import { MenuItem, SubCategory } from "../components/ManagementComp/types";
import { createMenuItem, deleteProduct, getCategoriesData, getMenuItems, updateProduct } from "@/lib/api";
import { toast } from 'react-toastify';


const MenuManagementPage: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteModalItem, setDeleteModalItem] = useState<MenuItem | null>(null);
  const [editItem, setEditItem] = useState<MenuItem | null>(null);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [subCategories, setSubCategories] = useState<{ [key: string]: SubCategory[] }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [productSummary, setProductSummary] = useState({
    totalProducts: 0,
    totalActive: 0,
    totalInStock: 0,
    totalOutOfStock: 0,
  });

  console.log(error)

  const [newItem, setNewItem] = useState<MenuItem>({
    name: "",
    category: "",
    categoryName: "",
    subCategory: "",
    subCategoryName: "",
    price: 0,
    stock: "In Stock",
    image: "",
    description: "",
    status: "active",
  });

  useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const [items, fetchedCategories] = await Promise.all([getMenuItems(), getCategoriesData()]);

      const categoriesData = [
        ...(fetchedCategories.categories?.map((cat: any) => ({
          id: cat._id,
          name: cat.name,
        })) || []),
      ];
      setCategories(categoriesData);

      const subCategoriesMap = (fetchedCategories.categories || []).reduce(
        (acc: { [key: string]: SubCategory[] }, cat: any) => {
          acc[cat._id] = cat.subcategories.map((sub: any) => ({
            id: sub._id,
            name: sub.name,
          }));
          return acc;
        },
        {}
      );
      setSubCategories(subCategoriesMap);

      const mappedItems = items.products?.map((product: any) => {
        const categoryId = product.category?._id || "";
        const subCatId = typeof product.subCategory === "string" ? product.subCategory : product.subCategory?._id || "";
        const subCatName = product.subCategory?.name || subCategories[categoryId]?.find((sub: SubCategory) => sub.id === subCatId)?.name || "";
      
        return {
          id: product._id,
          name: product.name,
          category: categoryId,
          categoryName: product.category?.name || "",
          subCategory: subCatId,
          subCategoryName: subCatName,
          price: product.price,
          stock: product.status === "active" ? product.stock : "Out of Stock",
          status: product.status,
          image: product.image,
          description: product.description,
        };
      }) || [];
      setMenuItems(mappedItems);

      setProductSummary({
        totalProducts: items.summary?.totalProducts || 0,
        totalActive: items.summary?.totalActive || 0,
        totalInStock: items.summary?.totalInStock || 0,
        totalOutOfStock: items.summary?.totalOutOfStock || 0,
      });

      setLoading(false);
    } catch (err) {
      setError("Failed to load menu or categories. Please try again later.");
      setLoading(false);
      console.log(err)
    }
  };
  fetchData();
}, []);

const handleSubmit = async (e: React.FormEvent, isEditing: boolean, item: MenuItem) => {
  e.preventDefault();
  if (isEditing && (!item || !item.id)) {
    setError("Invalid item or item ID");
    console.error("Invalid item for update:", item);
    return;
  }
  try {
    setLoading(true);
    const formData = new FormData();

    // For updates, only append changed fields
    if (isEditing) {
      const originalItem = menuItems.find((i) => i.id === item.id);
      if (originalItem) {
        if (item.name !== originalItem.name) formData.append("name", item.name);
        if (item.category !== originalItem.category) formData.append("category", item.category);
        if (item.subCategory !== originalItem.subCategory) formData.append("subCategory", item.subCategory);
        if (item.price !== originalItem.price) formData.append("price", item.price.toString());
        if (item.status !== originalItem.status) formData.append("status", item.status || "active");
        if (item.stock !== originalItem.stock) formData.append("stock", item.stock);
        if (item.description !== originalItem.description) formData.append("description", item.description);
      }
    } else {
      // For create, append all fields
      formData.append("name", item.name);
      formData.append("category", item.category);
      formData.append("subCategory", item.subCategory);
      formData.append("price", item.price.toString());
      formData.append("status", item.status || "active");
      formData.append("stock", item.stock);
      formData.append("description", item.description);
    }

    // Handle image upload (only if it's a new file)
    if (item.image && item.image.startsWith("data:")) {
      const response = await fetch(item.image);
      const blob = await response.blob();
      formData.append("image", blob, "menu-item-image.jpg");
    }

    let response;
    if (isEditing && item.id) {
      response = await updateProduct({ id: item.id, data: formData });
    } else {
      response = await createMenuItem(formData);
    }

    // Map backend response to MenuItem type
    const categoryId = response.product?.category?._id || item.category;
    const subCatId = response.product?.subCategory?._id || (typeof response.product?.subCategory === "string" ? response.product?.subCategory : item.subCategory);
    const subCatName = response.product?.subCategory?.name || subCategories[categoryId]?.find((sub: SubCategory) => sub.id === subCatId)?.name || "";

    const mappedItem: MenuItem = {
      id: response.product?._id || response._id,
      name: response.product?.name || item.name,
      category: categoryId,
      categoryName: response.product?.category?.name || categories.find((cat) => cat.id === item.category)?.name || item.categoryName || "",
      subCategory: subCatId,
      subCategoryName: subCatName,
      price: response.product?.price || item.price,
      stock: response.product?.stock || item.stock,
      status: response.product?.status || item.status || "active",
      image: response.product?.image?.url || item.image,
      description: response.product?.description || item.description,
    };

    // Update state based on operation
    if (isEditing) {
      setMenuItems((prev) =>
        prev.map((i) => (i.id === mappedItem.id ? mappedItem : i))
      );
    } else {
      setMenuItems((prev) => [...prev, mappedItem]);
      setNewItem({
        name: "",
        category: "",
        categoryName: "",
        subCategory: "",
        subCategoryName: "",
        price: 0,
        status: "active",
        stock: "In Stock",
        image: "",
        description: "",
      });
    }

    setIsModalOpen(false);
    setEditItem(null);
    toast.success(`${isEditing ? 'Product item updated' : 'Product added'} successfully!`, {
      position: 'top-right',
      autoClose: 3000,
    });
  } catch (err: any) {
    setError(`Failed to ${isEditing ? "update" : "add"} menu item: ${err.message}`);
    console.error(`Error ${isEditing ? "updating" : "adding"} menu item:`, {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status,
    });
  } finally {
    setLoading(false); // Ensure loading is reset even on error
  }
};
  
  const handleDelete = async (id: string) => {
    try { 
      setLoading(true);
      console.log("Starting deletion for ID:", id); // Debug: Confirm ID
      const response = await deleteProduct(id);
      console.log("deleteProduct response:", response); // Debug: Log API response 
      setMenuItems((prev) => {
        const updatedItems = prev.filter((item) => item.id !== id);
        return updatedItems;
      });
      setIsDeleteModalOpen(false); // Close the delete modal
      setDeleteModalItem(null); // Clear the delete modal item
      toast.success('Product deleted successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (err) {
      setError("Failed to delete menu item. Please try again.");
      console.log(err)
    } finally {
      setLoading(false); // Ensure loading is reset
    }
  };

  const toggleVisibility = (id: string) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              stock: item.stock === "In Stock" ? "Out of Stock" : "In Stock",
            }
          : item
      )
    );
  };

  const moveSubcategory = (category: string, subId: string, direction: "up" | "down") => {
    setSubCategories((prev) => {
      const arr = prev[category] ? [...prev[category]] : [];
      const idx = arr.findIndex((sub) => sub.id === subId);
      if (idx === -1) return prev;

      if (direction === "up" && idx > 0) {
        [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
      } else if (direction === "down" && idx < arr.length - 1) {
        [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]];
      }

      return { ...prev, [category]: arr };
    });
  };

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      <Sidebar activePath="/management" />

      <div className="flex-1 lg:ml-0 mt-16 lg:mt-0">
        <header className="bg-white shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 sm:px-6 py-3 gap-4">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
            </div>
            <div className="flex items-center space-x-4 w-full sm:w-auto justify-between sm:justify-end">
              <div className="text-gray-600">{currentDate}</div>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h1 className="text-2xl font-bold text-gray-800">Menu Management</h1>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-button flex items-center space-x-2 cursor-pointer whitespace-nowrap"
              onClick={() => {
                setEditItem(null);
                setIsModalOpen(true);
              }}
            >
              <i className="fas fa-plus"></i>
              <span>Add New Item</span>
            </button>
          </div>

          <MenuStatsCards
            totalItems={productSummary.totalProducts}
            activeItems={productSummary.totalActive}
            outOfStockItems={productSummary.totalOutOfStock}
            inStockItems={productSummary.totalInStock}
          />

          <MenuFilters
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            currentDate={currentDate}
          />

          <MenuItemTable
            items={filteredItems}
            onEdit={(item) => {
              setEditItem({
                ...item,
                categoryName: categories.find((cat) => cat.id === item.category)?.name || item.categoryName || "Unknown Category",
              });
              setIsModalOpen(true);
            }}
            onDelete={(item) => {
              setDeleteModalItem(item);
              setIsDeleteModalOpen(true);
            }}
            onToggleStock={toggleVisibility}
          />
        </main>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              onClick={() => {
                setIsModalOpen(false);
                setEditItem(null);
              }}
            >
              <i className="fas fa-times"></i>
            </button>
            <h2 className="text-lg font-semibold mb-4">{editItem ? "Edit Menu Item" : "Add New Menu Item"}</h2>
            <MenuItemForm
              item={editItem || newItem}
              categories={categories}
              subCategories={subCategories}
              onItemChange={editItem ? setEditItem : setNewItem}
              onMoveSubcategory={moveSubcategory}
              onSubmit={(e) => handleSubmit(e, !!editItem, editItem || newItem)}
              onCancel={() => {
                setIsModalOpen(false);
                setEditItem(null);
              }}
              isEditing={!!editItem}
              loading={loading}
            />
          </div>
        </div>
      )}

{/* <DeleteConfirmationModal
  isOpen={isDeleteModalOpen}
  item={deleteModalItem}
  onClose={() => {
    setIsDeleteModalOpen(false);
    setDeleteModalItem(null); // Clear the item to prevent stale data
  }}
  
  onConfirm={() => {
    if (deleteModalItem && deleteModalItem.id) {
      handleDelete(deleteModalItem.id);
    }
  }}
/> */}

<DeleteConfirmationModal
  isOpen={isDeleteModalOpen}
  item={deleteModalItem}
  onClose={() => {
    setIsDeleteModalOpen(false);
    setDeleteModalItem(null); // Clear the item to prevent stale data
  }}
  onConfirm={() => {
    if (deleteModalItem && deleteModalItem.id) {
      handleDelete(deleteModalItem.id); // Rely on handleDelete for state updates
    }
  }}
/> 
</div>
  );
};

export default MenuManagementPage;