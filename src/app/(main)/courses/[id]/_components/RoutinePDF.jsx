"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

Font.register({
  family: "SolaimanLipi",
  src: "/fonts/SolaimanLipi.ttf",
});

Font.register({
  family: "Roboto",
  src: "/fonts/Roboto-Regular.ttf",
});

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 11,
    fontFamily: "SolaimanLipi",
    color: "#333",
  },
  header: {
    fontSize: 20,
    marginBottom: 15,
    textAlign: "left",
    fontWeight: "700",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 6,
  },
  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: 0,
    borderRadius: 6,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  tableRowHeader: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  tableRowStriped: {
    backgroundColor: "#fefefe",
  },
  tableColHeader: {
    width: "25%",
    paddingVertical: 8,
    paddingHorizontal: 8,
    fontWeight: "700",
    color: "#222",
  },
  tableCol: {
    width: "25%",
    paddingVertical: 6,
    paddingHorizontal: 8,
    color: "#444",
  },
  classTitle: {
    fontWeight: "700",
    fontSize: 11,
  },
  timeText: {
    fontSize: 9,
    color: "#777",
    marginTop: 2,
  },
});

const RoutinePDF = ({ routines }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>রুটিন</Text>

      <View style={styles.table}>
        <View style={styles.tableRowHeader}>
          <View style={styles.tableColHeader}>
            <Text>তারিখ</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text>বিষয়</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text>ক্লাস</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text>পরীক্ষা</Text>
          </View>
        </View>

        {routines?.map((routine, index) => (
          <View
            key={index}
            style={[styles.tableRow, index % 2 === 0 && styles.tableRowStriped]}
          >
            <View style={styles.tableCol}>
              <Text>{routine.date}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text>{routine.subjectId?.name}</Text>
            </View>
            <View style={styles.tableCol}>
              {routine.classTitle && (
                <>
                  <Text style={styles.classTitle}>{routine.classTitle}</Text>
                  {routine.classTime && (
                    <Text style={styles.timeText}>{routine.classTime}</Text>
                  )}
                </>
              )}
            </View>
            <View style={styles.tableCol}>
              {routine.examTitle && (
                <>
                  <Text style={styles.classTitle}>{routine.examTitle}</Text>
                  {routine.examTime && (
                    <Text style={styles.timeText}>{routine.examTime}</Text>
                  )}
                </>
              )}
            </View>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default RoutinePDF;
