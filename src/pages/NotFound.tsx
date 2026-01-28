import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import { motion } from "framer-motion";

const NotFound = () => {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <div className="container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🔍</span>
          </div>
          <h1 className="text-6xl font-bold text-foreground mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Page Not Found
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Button variant="default" size="lg" asChild className="gap-2">
            <Link to="/">
              <Home className="w-5 h-5" />
              Back to SayIt
            </Link>
          </Button>
        </motion.div>
      </div>
    </main>
  );
};

export default NotFound;
