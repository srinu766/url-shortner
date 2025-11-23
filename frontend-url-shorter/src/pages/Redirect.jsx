import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { linkApi } from "../lib/backend-api";
import { toast } from "react-toastify";

const Redirect = () => {
  const { code } = useParams();
  console.log("Redirect code1:", code);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const handleRedirect = async () => {
      if (!code) {
        // setNotFound(true);
        toast.error("Invalid link code.");
        return;
      }

      try {
        const link = await linkApi.getByCode(code);
        console.log("Fetched link1:", link);
        toast.info("Redirecting...");
        
        if (link) {
          // Increment click count (fire and forget)
          // linkApi.incrementClicks(code).catch(console.error);
          toast.success("Redirect successful!");
          // Perform redirect
          window.location.href = link.target_url;
        } else {
          // setNotFound(true);
        }
      } catch (error) {
        console.error("Redirect error:", error);
        // setNotFound(true);
      }
    };

    handleRedirect();
  }, [code]);

  if (!notFound) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-card text-card-foreground p-8 text-center max-w-md rounded-lg border shadow-sm">
          <h1 className="text-6xl font-bold text-muted-foreground mb-4">404</h1>
          <h2 className="text-2xl font-bold mb-2">Link Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The short link you're looking for doesn't exist or has been deleted.
          </p>
          <a
            href="/"
            className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Go to Homepage
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="bg-card text-card-foreground p-8 text-center rounded-lg border shadow-sm">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Redirecting...</p>
      </div>
    </div>
  );
};

export default Redirect;