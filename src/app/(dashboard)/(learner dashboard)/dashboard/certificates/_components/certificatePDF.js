"use client";

import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";

// Register fonts
Font.register({
  family: "Helvetica",
  fonts: [
    { src: "https://fonts.cdnfonts.com/s/15049/Helvetica.woff" },
    {
      src: "https://fonts.cdnfonts.com/s/15049/Helvetica-Bold.woff",
      fontWeight: "bold",
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 40,
  },
  container: {
    flex: 1,
    border: "6px double #F59E0B", // Golden double border
    padding: 30,
    position: "relative",
    backgroundColor: "#fff",
  },
  watermark: {
    position: "absolute",
    top: "25%",
    left: "25%",
    width: "50%",
    height: "50%",
    opacity: 0.08, // subtle watermark
  },
  title: {
    fontFamily: "Helvetica",
    fontWeight: "bold",
    fontSize: 32,
    textAlign: "center",
    marginBottom: 10,
    color: "#B45309", // Deep gold
    textTransform: "uppercase",
  },
  subtitle: {
    fontFamily: "Helvetica",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    color: "#374151",
    fontStyle: "italic",
  },
  studentName: {
    fontFamily: "Helvetica",
    fontWeight: "bold",
    fontSize: 36,
    textAlign: "center",
    marginBottom: 20,
    color: "#111827",
  },
  courseLabel: {
    fontFamily: "Helvetica",
    fontSize: 18,
    textAlign: "center",
    color: "#6B7280",
    marginBottom: 5,
  },
  courseName: {
    fontFamily: "Helvetica",
    fontWeight: "bold",
    fontSize: 22,
    textAlign: "center",
    marginBottom: 25,
    color: "#1E3A8A",
  },
  description: {
    fontFamily: "Helvetica",
    fontSize: 14,
    textAlign: "center",
    marginHorizontal: 50,
    marginBottom: 50,
    color: "#4B5563",
    lineHeight: 1.5,
  },
  signatureContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 50,
    paddingHorizontal: 60,
  },
  signature: {
    alignItems: "center",
  },
  signatureLine: {
    width: 150,
    borderTop: "1px solid #111827",
    marginBottom: 8,
  },
  signatureText: {
    fontFamily: "Helvetica",
    fontSize: 12,
    color: "#374151",
  },
  date: {
    fontFamily: "Helvetica",
    fontSize: 12,
    textAlign: "center",
    marginTop: 20,
    color: "#6B7280",
  },
  certificateId: {
    position: "absolute",
    bottom: 15,
    right: 20,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#9CA3AF",
  },
  seal: {
    position: "absolute",
    bottom: 40,
    left: "45%",
    width: 80,
    height: 80,
    opacity: 0.9,
  },
});

const CertificatePDF = ({ certificate }) => (
  <Document>
    <Page size="A4" orientation="landscape" style={styles.page}>
      <View style={styles.container}>
        {/* Watermark */}
        <Image alt="watermark" style={styles.watermark} src="/logo.png" />

        {/* Header */}
        <Text style={styles.title}>Certificate of Completion</Text>
        <Text style={styles.subtitle}>This is proudly presented to</Text>

        {/* Student Name */}
        <Text style={styles.studentName}>{certificate.studentName}</Text>

        {/* Course Info */}
        <Text style={styles.courseLabel}>for successfully completing</Text>
        <Text style={styles.courseName}>{certificate.courseName}</Text>

        {/* Description */}
        <Text style={styles.description}>{certificate.description}</Text>

        {/* Signatures */}
        <View style={styles.signatureContainer}>
          <View style={styles.signature}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureText}>Instructor</Text>
            <Text style={styles.signatureText}>{certificate.instructor}</Text>
          </View>

          <View style={styles.signature}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureText}>Date</Text>
            <Text style={styles.signatureText}>
              {new Date(certificate.completionDate).toLocaleDateString(
                "en-US",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              )}
            </Text>
          </View>
        </View>

        {/* Seal (Optional: same as logo or custom PNG) */}
        <Image alt="seal" style={styles.seal} src="/logo.png" />

        {/* Certificate ID */}
        <Text style={styles.certificateId}>
          Certificate ID: {certificate.id}
        </Text>
      </View>
    </Page>
  </Document>
);

export default CertificatePDF;
