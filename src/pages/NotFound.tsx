import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const NotFound = () => {
  return (
    <main className="min-h-screen flex items-center justify-center pt-24">
      <div className="container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-6">
            Error 404
          </p>
          <h1 className="font-display text-6xl md:text-8xl mb-8">
            Page Not Found
          </h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto mb-12">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Button variant="hero" size="xl" asChild>
            <Link to="/">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Return Home
            </Link>
          </Button>
        </motion.div>
      </div>
    </main>
  );
};

export default NotFound;
