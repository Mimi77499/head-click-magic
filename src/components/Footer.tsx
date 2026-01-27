import { Link } from 'react-router-dom';
import { Instagram, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="font-display text-3xl tracking-widest uppercase mb-4">Maison</h3>
            <p className="text-background/70 max-w-md leading-relaxed">
              Where timeless elegance meets modern innovation. Experience fashion that moves with you.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm tracking-widest uppercase mb-6 text-background/50">Navigate</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-background/80 hover:text-gold-accent transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/collections" className="text-background/80 hover:text-gold-accent transition-colors">
                  Collections
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-background/80 hover:text-gold-accent transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-background/80 hover:text-gold-accent transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-sm tracking-widest uppercase mb-6 text-background/50">Connect</h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 border border-background/30 flex items-center justify-center hover:bg-background hover:text-foreground transition-all"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-10 h-10 border border-background/30 flex items-center justify-center hover:bg-background hover:text-foreground transition-all"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-background/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-background/50 text-sm">
            © 2024 Maison. All rights reserved.
          </p>
          <p className="text-background/50 text-sm">
            Experience hands-free navigation with head tracking
          </p>
        </div>
      </div>
    </footer>
  );
}
