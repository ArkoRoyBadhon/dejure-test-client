export const filterOrders = (orders, filters) => {
  let filtered = [...orders];

  // Status filter
  if (filters.status && filters.status !== "all") {
    filtered = filtered.filter((order) => order.status === filters.status);
  }

  // Payment method filter
  if (filters.paymentMethod && filters.paymentMethod !== "all") {
    filtered = filtered.filter(
      (order) => order.paymentMethod === filters.paymentMethod
    );
  }

  // Date filter (single date)
  if (filters.date) {
    const filterDate = new Date(filters.date);
    filtered = filtered.filter((order) => {
      const orderDate = new Date(order.createdAt);
      return (
        orderDate.getDate() === filterDate.getDate() &&
        orderDate.getMonth() === filterDate.getMonth() &&
        orderDate.getFullYear() === filterDate.getFullYear()
      );
    });
  }

  // Month filter
  if (filters.month && filters.month !== "all") {
    filtered = filtered.filter((order) => {
      const orderDate = new Date(order.createdAt);
      return orderDate.getMonth().toString() === filters.month;
    });
  }

  // Search filters with null checks
  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    filtered = filtered.filter((order) => {
      const email = order.email?.toLowerCase() || "";
      const phone = order.phone?.toLowerCase() || "";
      const orderId = order._id?.toLowerCase() || "";
      const paymentMethod = order.paymentMethod?.toLowerCase() || "";

      const productMatch =
        order.products?.some((p) =>
          p.product?.title?.toLowerCase().includes(query)
        ) || false;

      return (
        email.includes(query) ||
        phone.includes(query) ||
        orderId.includes(query) ||
        paymentMethod.includes(query) ||
        productMatch
      );
    });
  }

  return filtered;
};
