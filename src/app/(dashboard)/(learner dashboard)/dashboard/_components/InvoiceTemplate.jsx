// components/InvoiceTemplate.jsx (Temporary for testing)
import React from "react";

const InvoiceTemplate = ({ enroll }) => {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <h1>Test Invoice</h1>
      <p>Course: {enroll.course?.title || "N/A"}</p>
      <p>Paid Amount: ৳ {enroll.paid || 0}</p>
      {/* Remove images, complex tables, intricate styling for now */}
    </div>
  );
};

export default InvoiceTemplate;
