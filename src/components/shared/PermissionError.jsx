import { AlertCircle, Shield } from "lucide-react";

const PermissionError = ({
  title = "Permission Error",
  message = "আপনি এই পেজটি দেখার অনুমতি নেই।",
  details = "আপনার প্রয়োজনীয় অনুমতি নেই।",
  contactMessage = "অনুগ্রহ করে আপনার অ্যাডমিনিস্ট্রেটরের সাথে যোগাযোগ করুন।",
  errorDetails = null,
  showIcon = true,
}) => {
  return (
    <div className="px-4 py-2 mt-2">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
          {showIcon && (
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Shield className="w-16 h-16 text-red-500" />
                <AlertCircle className="w-8 h-8 text-red-600 absolute -top-1 -right-1" />
              </div>
            </div>
          )}

          <h2 className="text-2xl font-bold text-red-600 mb-4">{title}</h2>

          <p className="text-lg text-gray-600 mb-4">{message}</p>

          <p className="text-sm text-gray-500 mb-4">{details}</p>

          <p className="text-sm text-gray-500">{contactMessage}</p>

          {errorDetails && (
            <div className="mt-4 p-4 bg-red-100 rounded-lg text-left">
              <p className="text-sm text-red-700">
                <strong>Error:</strong> {errorDetails.message}
              </p>
              <p className="text-sm text-red-600">{errorDetails.details}</p>
              {errorDetails.required && (
                <div className="mt-2">
                  <p className="text-sm text-red-600">
                    <strong>Required:</strong>{" "}
                    {JSON.stringify(errorDetails.required, null, 2)}
                  </p>
                </div>
              )}
              {errorDetails.yourPermissions && (
                <div className="mt-2">
                  <p className="text-sm text-red-600">
                    <strong>Your Permissions:</strong>{" "}
                    {JSON.stringify(errorDetails.yourPermissions, null, 2)}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PermissionError;
