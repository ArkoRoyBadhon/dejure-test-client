importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyBSt8K9YjJU_ojBQCWcOnXZj0uJDHoB2ic",
  authDomain: "de-jure-academy-2k25.firebaseapp.com",
  projectId: "de-jure-academy-2k25",
  storageBucket: "de-jure-academy-2k25.firebasestorage.app",
  messagingSenderId: "277182989439",
  appId: "1:277182989439:web:0f9bd2e3570e060016eb4a",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  const notificationTitle =
    payload?.data?.title || payload?.notification?.title || "Default Title";

  const notificationOptions = {
    body: payload?.data?.body || payload?.notification?.body || "Default Body",
    icon: "/course.svg",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
