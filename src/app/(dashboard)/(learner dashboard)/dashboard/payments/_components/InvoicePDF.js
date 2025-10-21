"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";

// Register fonts
Font.register({
  family: "SolaimanLipi",
  src: "/fonts/SolaimanLipi.ttf",
});

Font.register({
  family: "Roboto",
  src: "/fonts/Roboto-Regular.ttf",
});

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 11,
    fontFamily: "SolaimanLipi",
    color: "#333",
    position: "relative",
  },
  watermark: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  watermarkImage: {
    width: "60%",
    opacity: 0.1,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 6,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "700",
  },
  logo: {
    width: 100,
    height: 50,
    objectFit: "contain",
  },
  learnerInfoContainer: {
    flexDirection: "row",
    marginBottom: 15,
    gap: 20,
  },
  learnerImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    objectFit: "cover",
  },
  learnerDetails: {
    flex: 1,
  },
  section: {
    marginBottom: 10,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    backgroundColor: "#f5f5f5",
    padding: 5,
  },
  row: {
    flexDirection: "row",
    marginBottom: 5,
  },
  label: {
    width: "40%",
    fontWeight: "bold",
  },
  value: {
    width: "60%",
  },
  table: {
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#ddd",
    marginTop: 10,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColHeader: {
    width: "20%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#f5f5f5",
    padding: 5,
    fontWeight: "bold",
  },
  tableCol: {
    width: "20%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 5,
  },
  footer: {
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    textAlign: "center",
    fontSize: 10,
  },
});

const InvoicePDF = ({ enrollment }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Watermark */}
      <View style={styles.watermark}>
        <Image style={styles.watermarkImage} alt="watermark" src="/logo.png" />
      </View>

      {/* Header with Logo and Invoice Title */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Invoice</Text>
        <Image style={styles.logo} alt="logo" src="/logo.png" />
      </View>

      {/* Learner Information */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Learner Information</Text>
        <View style={styles.learnerInfoContainer}>
          <View style={styles.learnerDetails}>
            <View style={styles.row}>
              <Text style={styles.label}>Full Name:</Text>
              <Text style={styles.value}>
                {enrollment.learner?.fullName || "N/A"}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Phone:</Text>
              <Text style={styles.value}>
                {enrollment.learner?.phone || "N/A"}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Email:</Text>
              <Text style={styles.value}>
                {enrollment.learner?.email || "N/A"}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Course Information */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Course Info</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Course Name:</Text>
          <Text style={styles.value}>{enrollment.course?.title || "N/A"}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Enrollment Date:</Text>
          <Text style={styles.value}>
            {new Date(enrollment.createdAt).toLocaleString("bn-BD", {
              day: "2-digit",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
      </View>

      {/* Payment Information */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Payment Info</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Total Payable Amount:</Text>
          <Text style={styles.value}>৳{enrollment.totalPay}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Paid:</Text>
          <Text style={styles.value}>৳{enrollment.paid}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Due:</Text>
          <Text style={styles.value}>৳{enrollment.due}</Text>
        </View>
        {/* <View style={styles.row}>
          <Text style={styles.label}>Status:</Text>
          <Text style={styles.value}>{enrollment.status}</Text>
        </View> */}
        <View style={styles.row}>
          <Text style={styles.label}>Payment Method:</Text>
          <Text style={styles.value}>
            {enrollment.payment?.paymentMethod || "N/A"}
          </Text>
        </View>
      </View>

      {/* Payment History Table */}
      {enrollment.milestonePayments?.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Payment History</Text>
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableRow}>
              <View style={styles.tableColHeader}>
                <Text>Installment</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text>Amount</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text>Status</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text>Date</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text>Next Pay Date</Text>
              </View>
            </View>

            {/* Table Rows */}
            {enrollment.milestonePayments.map((payment, index) => (
              <View style={styles.tableRow} key={index}>
                <View style={styles.tableCol}>
                  <Text>
                    {payment?.milestoneTitle || `Installment ${index + 1}`}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text>৳{payment.amount || enrollment.paid}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text>{payment.isPaid ? "PAID" : "PENDING"}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text>
                    {payment?.paidAt
                      ? new Date(payment.paidAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : "N/A"}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text>
                    {payment?.nextPayDate
                      ? new Date(payment.nextPayDate).toLocaleDateString(
                          "en-GB",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )
                      : "N/A"}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      <View style={styles.footer}>
        <Text>Sincerely,</Text>
        <Text>De Jury Academy</Text>
      </View>
    </Page>
  </Document>
);

export default InvoicePDF;
