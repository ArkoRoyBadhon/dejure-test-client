"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  trackPageView,
  trackViewCourse,
  trackClickEnroll,
  trackAddToCart,
  trackBuyNow,
  trackCheckout,
  trackPurchase,
  trackSignUp,
  trackLogin,
  trackCustomEvent,
  pushToDataLayer,
} from "@/lib/analytics";

export default function AnalyticsTester() {
  const [testResults, setTestResults] = useState([]);

  const addTestResult = (test, success, details = "") => {
    setTestResults((prev) => [
      ...prev,
      {
        id: Date.now(),
        test,
        success,
        details,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  };

  const testPageView = () => {
    try {
      trackPageView("/test-page", "Test Page", { test: true });
      addTestResult("Page View", true, "Event pushed to dataLayer");
    } catch (error) {
      addTestResult("Page View", false, error.message);
    }
  };

  const testViewCourse = () => {
    try {
      const mockCourse = {
        _id: "test-course-123",
        title: "Test Course",
        types: [{ price: 5000, salePrice: 4000, mode: "online" }],
        category: { title: "Test Category" },
        courseType: "live",
        paymentType: "paid",
        durationMonths: 3,
        batchNo: 1,
        seat: 50,
      };
      trackViewCourse(mockCourse);
      addTestResult("View Course", true, "Course view event tracked");
    } catch (error) {
      addTestResult("View Course", false, error.message);
    }
  };

  const testClickEnroll = () => {
    try {
      const mockCourse = {
        _id: "test-course-123",
        title: "Test Course",
        types: [{ price: 5000, salePrice: 4000, mode: "online" }],
        paymentType: "paid",
      };
      trackClickEnroll(mockCourse);
      addTestResult("Click Enroll", true, "Enrollment click tracked");
    } catch (error) {
      addTestResult("Click Enroll", false, error.message);
    }
  };

  const testAddToCart = () => {
    try {
      const mockProduct = {
        _id: "test-product-123",
        title: "Test Product",
        price: 1000,
        oldPrice: 1200,
        category: { title: "Test Category" },
      };
      trackAddToCart(mockProduct, 2);
      addTestResult("Add to Cart", true, "Product added to cart tracked");
    } catch (error) {
      addTestResult("Add to Cart", false, error.message);
    }
  };

  const testBuyNow = () => {
    try {
      const mockProduct = {
        _id: "test-product-456",
        title: "Test Product Buy Now",
        price: 1500,
        oldPrice: 1800,
        category: { title: "Test Category" },
      };
      trackBuyNow(mockProduct, 1);
      addTestResult("Buy Now", true, "Buy now event tracked");
    } catch (error) {
      addTestResult("Buy Now", false, error.message);
    }
  };

  const testCheckout = () => {
    try {
      const mockItems = [
        {
          _id: "item-1",
          title: "Test Item 1",
          price: 1000,
          quantity: 2,
        },
        {
          _id: "item-2",
          title: "Test Item 2",
          price: 500,
          quantity: 1,
        },
      ];
      trackCheckout(mockItems, 2500);
      addTestResult("Checkout", true, "Checkout initiation tracked");
    } catch (error) {
      addTestResult("Checkout", false, error.message);
    }
  };

  const testPurchase = () => {
    try {
      const mockItems = [
        {
          _id: "item-1",
          title: "Test Item 1",
          price: 1000,
          quantity: 2,
        },
      ];
      trackPurchase("TXN-123456", mockItems, 2000, "credit_card", "SAVE10");
      addTestResult("Purchase", true, "Purchase completion tracked");
    } catch (error) {
      addTestResult("Purchase", false, error.message);
    }
  };

  const testSignUp = () => {
    try {
      trackSignUp(
        "user-123",
        "learner",
        "John Doe",
        "john@example.com",
        "01234567890"
      );
      addTestResult(
        "Sign Up",
        true,
        "User registration tracked with name, email, phone"
      );
    } catch (error) {
      addTestResult("Sign Up", false, error.message);
    }
  };

  const testLogin = () => {
    try {
      trackLogin("user-123", "learner", "email");
      addTestResult("Login", true, "User login tracked");
    } catch (error) {
      addTestResult("Login", false, error.message);
    }
  };

  const testCustomEvent = () => {
    try {
      trackCustomEvent("test_event", { test_param: "test_value" });
      addTestResult("Custom Event", true, "Custom event tracked");
    } catch (error) {
      addTestResult("Custom Event", false, error.message);
    }
  };

  const testDataLayer = () => {
    try {
      pushToDataLayer({
        event: "test_dataLayer",
        test: true,
        timestamp: Date.now(),
      });
      addTestResult("DataLayer Push", true, "Direct dataLayer push successful");
    } catch (error) {
      addTestResult("DataLayer Push", false, error.message);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const checkDataLayer = () => {
    if (typeof window !== "undefined" && window.dataLayer) {
      const events = window.dataLayer.filter((item) => item.event);
      addTestResult(
        "DataLayer Check",
        true,
        `Found ${events.length} events in dataLayer`
      );
      // console.log("Current dataLayer:", window.dataLayer);
    } else {
      addTestResult("DataLayer Check", false, "dataLayer not found");
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">
        🧪 Analytics Testing Dashboard
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Button onClick={testPageView} variant="outline" size="sm">
          Test Page View
        </Button>
        <Button onClick={testViewCourse} variant="outline" size="sm">
          Test View Course
        </Button>
        <Button onClick={testClickEnroll} variant="outline" size="sm">
          Test Click Enroll
        </Button>
        <Button onClick={testAddToCart} variant="outline" size="sm">
          Test Add to Cart
        </Button>
        <Button onClick={testBuyNow} variant="outline" size="sm">
          Test Buy Now
        </Button>
        <Button onClick={testCheckout} variant="outline" size="sm">
          Test Checkout
        </Button>
        <Button onClick={testPurchase} variant="outline" size="sm">
          Test Purchase
        </Button>
        <Button onClick={testSignUp} variant="outline" size="sm">
          Test Sign Up
        </Button>
        <Button onClick={testLogin} variant="outline" size="sm">
          Test Login
        </Button>
        <Button onClick={testCustomEvent} variant="outline" size="sm">
          Test Custom Event
        </Button>
        <Button onClick={testDataLayer} variant="outline" size="sm">
          Test DataLayer
        </Button>
        <Button onClick={checkDataLayer} variant="outline" size="sm">
          Check DataLayer
        </Button>
        <Button onClick={clearResults} variant="destructive" size="sm">
          Clear Results
        </Button>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Test Results:</h3>
        {testResults.length === 0 ? (
          <p className="text-gray-500 italic">No tests run yet</p>
        ) : (
          <div className="max-h-96 overflow-y-auto space-y-2">
            {testResults.map((result) => (
              <div
                key={result.id}
                className={`p-3 rounded border-l-4 ${
                  result.success
                    ? "bg-green-50 border-green-500"
                    : "bg-red-50 border-red-500"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-medium">{result.test}</span>
                    <span
                      className={`ml-2 ${
                        result.success ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {result.success ? "✅" : "❌"}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {result.timestamp}
                  </span>
                </div>
                {result.details && (
                  <p className="text-sm text-gray-600 mt-1">{result.details}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">💡 Testing Tips:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>
            • Open browser DevTools → Console to see "Analytics Event:" logs
          </li>
          <li>• Check window.dataLayer array in console for all events</li>
          <li>• Use GTM Preview mode to test with actual GTM container</li>
          <li>• Verify events in GA4 Real-time reports</li>
        </ul>
      </div>
    </div>
  );
}
