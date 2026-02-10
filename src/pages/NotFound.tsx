import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-muted p-6">
      <div className="card-elevated rounded-3xl p-8 text-center sm:p-10">
        <h1 className="mb-3 font-display text-4xl font-bold text-foreground">404</h1>
        <p className="mb-4 text-base text-muted-foreground">It is okay to start slow. I am here when you are ready.</p>
        <a href="/" className="text-sm font-medium text-primary underline hover:text-primary/90">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
