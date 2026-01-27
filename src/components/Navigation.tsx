import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Eye } from 'lucide-react';

interface NavigationProps {
  onToggleHeadTracking: () => void;
  isHeadTrackingActive: boolean;
}

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/collections', label: 'Collections' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function Navigation({ onToggleHeadTracking, isHeadTrackingActive }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border"
    >
      <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="font-display text-2xl tracking-widest uppercase">
          Maison
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`text-sm tracking-widest uppercase transition-colors duration-300 hover:text-gold-accent ${
                location.pathname === link.href ? 'text-gold-accent' : 'text-foreground'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleHeadTracking}
            className={`hidden md:flex ${isHeadTrackingActive ? 'text-gold-accent' : ''}`}
          >
            <Eye className="w-5 h-5" />
          </Button>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={isOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
        className="md:hidden overflow-hidden bg-background border-b border-border"
      >
        <div className="container mx-auto px-6 py-6 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setIsOpen(false)}
              className={`text-lg tracking-widest uppercase transition-colors duration-300 hover:text-gold-accent ${
                location.pathname === link.href ? 'text-gold-accent' : 'text-foreground'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Button
            variant="hero-outline"
            size="lg"
            onClick={() => {
              onToggleHeadTracking();
              setIsOpen(false);
            }}
            className="mt-4"
          >
            <Eye className="w-5 h-5 mr-2" />
            {isHeadTrackingActive ? 'Disable' : 'Enable'} Head Tracking
          </Button>
        </div>
      </motion.div>
    </motion.header>
  );
}
