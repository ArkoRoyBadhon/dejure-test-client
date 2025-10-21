export const filterProducts = (products, filters) => {
  let filtered = [...products];

  // Category filter
  if (filters.category && filters.category !== "all") {
    filtered = filtered.filter(
      (product) => product.category?._id === filters.category
    );
  }

  // Search filter
  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    filtered = filtered.filter((product) => {
      const title = product.title?.toLowerCase() || "";
      const author = product.author?.toLowerCase() || "";
      const description = product.description?.toLowerCase() || "";

      return (
        title.includes(query) ||
        author.includes(query) ||
        description.includes(query)
      );
    });
  }

  return filtered;
};
