

import { useState } from "react";
import { linkApi } from "../lib/backend-api";
import { Link2 } from "lucide-react";
import { toast } from "react-toastify";

export const LinkForm = ({ onLinkCreated }) => {
  const [targetUrl, setTargetUrl] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const generateRandomCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const length = 6;
    let code = "";
    for (let i = 0; i < length; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validateCode = (code) => {
    return /^[A-Za-z0-9]{6,8}$/.test(code);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateUrl(targetUrl)) {
      toast.error("Please enter a valid URL");
      return;
    }

    const code = customCode || generateRandomCode();

    if (!validateCode(code)) {
      toast.error("Code must be 6-8 alphanumeric characters");
      return;
    }

    setIsLoading(true);

    try {
      await linkApi.create(code, targetUrl);
      toast.success("Short link created successfully!");
      setTargetUrl("");
      setCustomCode("");
      onLinkCreated();
    } catch (error) {
      if (error.message === "Code already exists") {
        toast.error("Code already exists. Please try another one.");
      } else {
        toast.error("Failed to create link. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-2 mb-6">
          <Link2 className="h-5 w-5 text-blue-600" />
          <h2 className="text-xl font-semibold">Create Short Link</h2>
        </div>

        <div className="space-y-2">
          <label htmlFor="targetUrl" className="block text-sm font-medium text-gray-700">
            Target URL *
          </label>
          <input
            id="targetUrl"
            type="url"
            placeholder="https://example.com/your-long-url"
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
            required
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="customCode" className="block text-sm font-medium text-gray-700">
            Custom Code (optional)
          </label>
          <input
            id="customCode"
            type="text"
            placeholder="mycode (6-8 characters)"
            value={customCode}
            onChange={(e) => setCustomCode(e.target.value)}
            maxLength={8}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <p className="text-xs text-gray-500">
            Leave empty for auto-generated code
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? "Creating..." : "Create Short Link"}
        </button>
      </form>
    </div>
  );
};