import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Eye } from 'lucide-react';
import heroImage from '@/assets/hero-fashion.jpg';
import collection1 from '@/assets/collection-1.jpg';
import collection2 from '@/assets/collection-2.jpg';
import collection3 from '@/assets/collection-3.jpg';

const fadeUpVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" as const },
  }),
};

const collections = [
  { 
    id: 1, 
    title: 'Tailored Excellence', 
    category: 'Outerwear',
    image: collection1 
  },
  { 
    id: 2, 
    title: 'Silk Essentials', 
    category: 'Tops',
    image: collection2 
  },
  { 
    id: 3, 
    title: 'Artisan Leather', 
    category: 'Accessories',
    image: collection3 
  },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Fashion hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.p
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeUpVariants}
            className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-6"
          >
            Spring / Summer 2024
          </motion.p>
          
          <motion.h1
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeUpVariants}
            className="font-display text-5xl md:text-7xl lg:text-8xl tracking-tight mb-8"
          >
            Effortless
            <br />
            <span className="italic">Elegance</span>
          </motion.h1>
          
          <motion.p
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeUpVariants}
            className="text-muted-foreground text-lg md:text-xl max-w-xl mx-auto mb-12 leading-relaxed"
          >
            Discover our latest collection where timeless craftsmanship 
            meets contemporary design.
          </motion.p>
          
          <motion.div
            custom={3}
            initial="hidden"
            animate="visible"
            variants={fadeUpVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button variant="hero" size="xl" asChild>
              <Link to="/collections">
                Explore Collection
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button variant="hero-outline" size="xl" asChild>
              <Link to="/about">
                Our Story
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <div className="w-px h-16 bg-gradient-to-b from-foreground to-transparent" />
        </motion.div>
      </section>

      {/* Head Tracking Banner */}
      <section className="py-16 bg-foreground text-background">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-center justify-between gap-8"
          >
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 border border-background/30 flex items-center justify-center">
                <Eye className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-display text-2xl mb-2">Hands-Free Navigation</h3>
                <p className="text-background/70">
                  Experience our site using just your head movements and expressions
                </p>
              </div>
            </div>
            <Button variant="hero-outline" className="border-background text-background hover:bg-background hover:text-foreground">
              Enable Head Tracking
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4">
              Featured
            </p>
            <h2 className="font-display text-4xl md:text-5xl">New Arrivals</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {collections.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
              >
                <Link to="/collections" className="group block">
                  <div className="aspect-square overflow-hidden mb-6 bg-secondary">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <p className="text-sm tracking-widest uppercase text-muted-foreground mb-2">
                    {item.category}
                  </p>
                  <h3 className="font-display text-xl group-hover:text-gold-accent transition-colors">
                    {item.title}
                  </h3>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <Button variant="hero-outline" size="lg" asChild>
              <Link to="/collections">
                View All Collections
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 md:py-32 bg-secondary">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-6">
                Our Philosophy
              </p>
              <h2 className="font-display text-4xl md:text-5xl mb-8 leading-tight">
                Crafted with
                <br />
                <span className="italic">intention</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Every piece in our collection is a testament to meticulous craftsmanship 
                and thoughtful design. We believe in creating garments that transcend 
                seasons—pieces that become cherished parts of your wardrobe for years 
                to come.
              </p>
              <Button variant="minimal" asChild>
                <Link to="/about">
                  Discover Our Story
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <div className="aspect-[4/5] bg-muted overflow-hidden">
                <img
                  src={collection2}
                  alt="Craftsmanship"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-4xl md:text-6xl mb-8">
              Begin Your Journey
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-12">
              Join our community and be the first to discover new collections, 
              exclusive events, and behind-the-scenes stories.
            </p>
            <Button variant="hero" size="xl" asChild>
              <Link to="/contact">
                Get In Touch
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
