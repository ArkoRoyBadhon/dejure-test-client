// leadTabs.js

const leadTabs = {
  "quick-view": [
    {
      label: "Full Name",
      name: "fullName",
      type: "text",
      fromTab: "personal-info",
    },
    {
      label: "Phone Number",
      name: "phone",
      type: "text",
      fromTab: "personal-info",
    },
    {
      label: "Current Class/Level",
      name: "currentClass",
      type: "text",
      fromTab: "studying-habits",
    },
    {
      label: "School/College Name",
      name: "institute",
      type: "text",
      fromTab: "studying-habits",
    },
    {
      label: "Interested Courses",
      name: "interestedSector",
      type: "select",
      options: ["BGJ", "BAR"],
      fromTab: "personal-info",
    },
    {
      label: "University Name",
      name: "universityName",
      type: "text",
      fromTab: "personal-info",
    },

    {
      label: "Assigned Counselor",
      name: "counselor",
      type: "text",
    },
    {
      label: "Query Type",
      name: "queryType",
      type: "select",
      options: ["Course Info", "Fees", "Batch Time", "Others"],
      fromTab: "inbound-query",
    },
    {
      label: "Next Follow-Up",
      name: "followUpDate",
      type: "date",
      fromTab: "inbound-query",
    },
  ],

  // Other tabs stay unchanged
  "personal-info": [
    { label: "Full Name", name: "fullName", type: "text" },
    {
      label: "Gender",
      name: "gender",
      type: "select",
      options: ["Male", "Female", "Other"],
    },
    { label: "Date of Birth", name: "dob", type: "date" },
    { label: "Phone Number", name: "phone", type: "text" },
    { label: "Email", name: "email", type: "email" },
    { label: "NID/Birth Certificate No", name: "nid", type: "text" },
    { label: "Present Address", name: "presentAddress", type: "textarea" },
    { label: "Permanent Address", name: "permanentAddress", type: "textarea" },
  ],
  "guardians-info": [
    { label: "Father's Name", name: "fatherName", type: "text" },
    { label: "Mother's Name", name: "motherName", type: "text" },
    { label: "Guardian's Phone", name: "guardianPhone", type: "text" },
    { label: "Guardian's Email", name: "guardianEmail", type: "email" },
    { label: "Relationship", name: "relationship", type: "text" },
  ],
  "tech-adoption": [
    { label: "Has Smartphone?", name: "hasSmartphone", type: "boolean" },
    { label: "Has Internet at Home?", name: "hasInternet", type: "boolean" },
    {
      label: "Prefers Online Classes?",
      name: "prefersOnline",
      type: "boolean",
    },
    {
      label: "Device Used",
      name: "deviceUsed",
      type: "select",
      options: ["Phone", "Tablet", "Laptop", "Desktop"],
    },
  ],
  "studying-habits": [
    { label: "Current Class/Level", name: "currentClass", type: "text" },
    { label: "School/College Name", name: "institute", type: "text" },
    { label: "Preferred Subjects", name: "subjects", type: "text" },
    { label: "Study Hours per Day", name: "studyHours", type: "number" },
    { label: "Weak Subjects", name: "weakSubjects", type: "text" },
  ],
  events: [
    { label: "Event Name", name: "eventName", type: "text" },
    { label: "Event Date", name: "eventDate", type: "date" },
    {
      label: "Participation Status",
      name: "eventStatus",
      type: "select",
      options: ["Registered", "Attended", "Missed"],
    },
    { label: "Feedback", name: "eventFeedback", type: "textarea" },
  ],
  "inbound-query": [
    {
      label: "Query Type",
      name: "queryType",
      type: "select",
      options: ["Course Info", "Fees", "Batch Time", "Others"],
    },
    { label: "Query Details", name: "queryDetails", type: "textarea" },
    { label: "Response Given", name: "queryResponse", type: "textarea" },
    { label: "Follow-Up Date", name: "followUpDate", type: "date" },
  ],
};

export default leadTabs;
