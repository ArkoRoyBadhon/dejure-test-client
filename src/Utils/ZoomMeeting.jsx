// "use client";

// import React, { useRef, useState, useEffect } from "react";
// import ZoomMtgEmbedded from "@zoom/meetingsdk/embedded";

// const ZoomMeeting = () => {
//   // Static config - update with your actual values
//   const meetingConfig = {
//     sdkKey: "5BBSUudTSk2b8uz9_rwYsw",
//     meetingNumber: "86771268059",
//     passWord: "12345",
//     userName: "StudyRoom Live",
//     userEmail: "host@example.com",
//     role: 0,
//     leaveUrl: "http://localhost:3000",
//     signature: "",
//   };

//   const clientRef = useRef(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Fetch Zoom Signature
//   const fetchSignature = async () => {
//     try {
//       const res = await fetch(
//         "${process.env.NEXT_PUBLIC_API_URL}/zoom/generate-signature",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             meeting_number: meetingConfig.meetingNumber,
//             role: meetingConfig.role,
//           }),
//         }
//       );
//       const data = await res.json();
//       meetingConfig.signature = data.signature;
//     } catch (error) {
//       console.error("Failed to fetch signature:", error);
//       throw error;
//     }
//   };

//   // Launch Zoom Meeting
//   const launchMeeting = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       if (!clientRef.current) {
//         clientRef.current = ZoomMtgEmbedded.createClient();
//       }

//       await fetchSignature();

//       await clientRef.current.init({
//         debug: true,
//         zoomAppRoot: document.getElementById("zmmtg-root"),
//         language: "en-US",
//         customize: {
//           meetingInfo: ["topic", "host", "mn", "pwd", "participant"],
//           toolbar: {
//             buttons: [
//               {
//                 text: "Custom Button",
//                 className: "CustomButton",
//                 onClick: () => console.log("Custom button clicked"),
//               },
//             ],
//           },
//         },
//       });

//       await clientRef.current.join({
//         sdkKey: meetingConfig.sdkKey,
//         signature: meetingConfig.signature,
//         meetingNumber: meetingConfig.meetingNumber,
//         password: meetingConfig.passWord,
//         userName: meetingConfig.userName,
//         userEmail: meetingConfig.userEmail,
//       });
//     } catch (e) {
//       console.error("Error launching meeting:", e);
//       setError(e.reason || "Failed to join meeting");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="card text-center">
//       <div className="card-header">
//         <h3>Zoom Meeting - SDK (Static Config)</h3>
//       </div>

//       <div className="card-body">
//         <div id="zmmtg-root" className="my-4 mx-auto w-100 border"></div>

//         {error && <div className="alert alert-danger mb-3">{error}</div>}

//         <button
//           onClick={launchMeeting}
//           className="btn btn-primary"
//           disabled={loading}
//         >
//           {loading ? (
//             <>
//               <span
//                 className="spinner-border spinner-border-sm me-2"
//                 role="status"
//                 aria-hidden="true"
//               ></span>
//               Launching...
//             </>
//           ) : (
//             "Launch Meeting"
//           )}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ZoomMeeting;
