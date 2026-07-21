import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md"
      >
        <div className="mb-6 flex justify-center">
          <div className="flex size-20 items-center justify-center rounded-full bg-muted">
            <span className="text-4xl font-bold text-muted-foreground">
              404
            </span>
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-3">Page Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button>
            <Link to="/">
              <ArrowLeft className="mr-2 size-4" />
              Go Home
            </Link>
          </Button>
          <Button variant="outline">
            <Link to="/events">
              <Calendar className="mr-2 size-4" />
              Browse Events
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
