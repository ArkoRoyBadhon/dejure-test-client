"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  trackAddToCart,
  trackBuyNow,
  trackPageView,
  trackSignUp,
  trackLogin,
} from "@/lib/analytics";

export default function DebugAnalyticsPage() {
  const [logs, setLogs] = useState([]);

  const addLog = (message) => {
    setLogs((prev) => [
      ...prev,
      {
        id: Date.now(),
        message,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  };

  const testAddToCart = () => {
    addLog("Testing add to cart...");

    const mockProduct = {
      _id: "test-product-123",
      title: "Test Book",
      price: 1000,
      oldPrice: 1200,
      category: { title: "Test Category" },
    };

    try {
      trackAddToCart(mockProduct, 1);
      addLog("✅ trackAddToCart called successfully");
    } catch (error) {
      addLog(`❌ Error: ${error.message}`);
    }
  };

  const testBuyNow = () => {
    addLog("Testing buy now...");

    const mockProduct = {
      _id: "test-product-456",
      title: "Test Book Buy Now",
      price: 1500,
      oldPrice: 1800,
      category: { title: "Test Category" },
    };

    try {
      trackBuyNow(mockProduct, 1);
      addLog("✅ trackBuyNow called successfully");
    } catch (error) {
      addLog(`❌ Error: ${error.message}`);
    }
  };

  const testPageView = () => {
    addLog("Testing page view...");

    try {
      trackPageView("/debug-analytics", "Debug Analytics Page");
      addLog("✅ trackPageView called successfully");
    } catch (error) {
      addLog(`❌ Error: ${error.message}`);
    }
  };

  const testSignUp = () => {
    addLog("Testing sign up...");

    try {
      trackSignUp(
        "user-123",
        "learner",
        "John Doe",
        "john@example.com",
        "01234567890"
      );
      addLog("✅ trackSignUp called successfully with name, email, phone");
    } catch (error) {
      addLog(`❌ Error: ${error.message}`);
    }
  };

  const testLogin = () => {
    addLog("Testing login...");

    try {
      trackLogin("user-123", "learner", "email");
      addLog("✅ trackLogin called successfully");
    } catch (error) {
      addLog(`❌ Error: ${error.message}`);
    }
  };

  const checkDataLayer = () => {
    if (typeof window !== "undefined") {
      addLog(`dataLayer exists: ${!!window.dataLayer}`);
      addLog(`dataLayer length: ${window.dataLayer?.length || 0}`);
      addLog(`dataLayer content: ${JSON.stringify(window.dataLayer, null, 2)}`);
    } else {
      addLog("❌ Window is undefined (server side)");
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🔍 Analytics Debug Page</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Button onClick={testAddToCart} variant="outline">
          Test Add to Cart
        </Button>
        <Button onClick={testBuyNow} variant="outline">
          Test Buy Now
        </Button>
        <Button onClick={testPageView} variant="outline">
          Test Page View
        </Button>
        <Button onClick={testSignUp} variant="outline">
          Test Sign Up
        </Button>
        <Button onClick={testLogin} variant="outline">
          Test Login
        </Button>
        <Button onClick={checkDataLayer} variant="outline">
          Check DataLayer
        </Button>
        <Button onClick={clearLogs} variant="destructive">
          Clear Logs
        </Button>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Debug Logs:</h2>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {logs.length === 0 ? (
            <p className="text-gray-500">
              No logs yet. Click a test button above.
            </p>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="text-sm font-mono bg-white p-2 rounded border"
              >
                <span className="text-gray-500">[{log.timestamp}]</span>{" "}
                {log.message}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">💡 Instructions:</h3>
        <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
          <li>Open browser DevTools (F12)</li>
          <li>Go to Console tab</li>
          <li>Click the test buttons above</li>
          <li>Check both this page logs and browser console</li>
          <li>Look for "Analytics Event:" messages in console</li>
        </ol>
      </div>
    </div>
  );
}
