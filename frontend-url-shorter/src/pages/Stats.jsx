import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ExternalLink, Copy, BarChart3 } from "lucide-react";
import { linkApi } from "../lib/backend-api";
import { toast } from "react-toastify";

const Stats = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [link, setLink] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchLink = async () => {
      if (!code) return;

      try {
        const data = await linkApi.getByCode(code);
        if (data) {
          setLink(data);
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error("Failed to fetch link:", error);
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLink();
  }, [code]);

  const copyToClipboard = () => {
    if (!code) return;
    const url = `${window.location.origin}/#/${code}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (notFound || !link) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 p-8 text-center max-w-md rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-bold mb-4">Link Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The short link you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const shortUrl = `${window.location.origin}/#/${link.code}`;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center px-3 py-2 text-sm bg-transparent hover:bg-accent rounded-md transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Link Statistics</h1>
              <p className="text-muted-foreground">Detailed analytics for your short link</p>
            </div>
            <BarChart3 className="h-8 w-8 text-primary" />
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Short Link</p>
              <div className="flex items-center gap-2">
                <code className="text-lg font-mono font-bold flex-1">{shortUrl}</code>
                <button
                  onClick={copyToClipboard}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-background hover:bg-accent transition-colors"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Target URL</p>
              <a
                href={link.target_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline flex items-center gap-2"
              >
                <span className="break-all">{link.target_url}</span>
                <ExternalLink className="h-4 w-4 flex-shrink-0" />
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Stats;