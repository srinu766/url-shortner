

import { useState } from "react";
import { Copy, ExternalLink, Trash2, Search, BarChart3 } from "lucide-react";
import { linkApi } from "../lib/backend-api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const LinksTable = ({ links, onLinkDeleted }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingCode, setDeletingCode] = useState(null);
  const navigate = useNavigate();

  const filteredLinks = links.filter(
    (link) =>
      link.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.target_url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyToClipboard = (code) => {
    const url = `${window.location.origin}/#/${code}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  const handleDelete = async (code) => {
    setDeletingCode(code);
    try {
      await linkApi.delete(code);
      toast.success("Link deleted successfully!");
      onLinkDeleted();
    } catch (error) {
      toast.error("Failed to delete link. Please try again.");
    } finally {
      setDeletingCode(null);
    }
  };

  const truncateUrl = (url, maxLength = 50) => {
    return url.length > maxLength ? url.substring(0, maxLength) + "..." : url;
  };

  if (links.length === 0) {
    return (
      <div className="bg-white p-12 text-center rounded-lg shadow-md border border-gray-200">
        <p className="text-gray-500">
          No links created yet. Create your first short link above!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by code or URL..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                Short Code
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                Target URL
              </th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredLinks.map((link) => (
              <tr
                key={link.id}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="py-3 px-4 font-mono font-medium">{link.code}</td>
                <td className="py-3 px-4">
                  <a
                    href={link.target_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-1"
                  >
                    {truncateUrl(link.target_url)}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </td>

                <td className="py-3 px-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => navigate(`/code/${link.code}`)}
                      title="View stats"
                      className="p-2 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <BarChart3 className="h-4 w-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => copyToClipboard(link.code)}
                      title="Copy link"
                      className="p-2 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <Copy className="h-4 w-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(link.code)}
                      disabled={deletingCode === link.code}
                      title="Delete link"
                      className="p-2 border border-red-300 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
