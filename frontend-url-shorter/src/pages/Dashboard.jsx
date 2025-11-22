import { useEffect, useState } from "react";
import { LinkForm } from "../components/LinkForm";
import { LinksTable } from "../components/LinksTable";
import { Link2 } from "lucide-react";
import { linkApi } from "../lib/backend-api";

const Dashboard = () => {
  const [links, setLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLinks = async () => {
    try {
      const data = await linkApi.getAll();
      setLinks(data);
    } catch (error) {
      console.error("Failed to fetch links:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header
        className="fixed top-0 left-0 w-full border-b shadow-sm z-50"
        style={{ backgroundColor: "#031F39" }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <Link2 className="h-6 w-6 text-white" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-white">TinyLink</h1>
              <p className="text-sm text-gray-300">URL Shortener Dashboard</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-24 space-y-8">
        <LinkForm onLinkCreated={fetchLinks} />

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading links...</p>
          </div>
        ) : (
          <LinksTable links={links} onLinkDeleted={fetchLinks} />
        )}
      </main>
    </div>
  );
};

export default Dashboard;
