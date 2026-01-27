import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import collection1 from '@/assets/collection-1.jpg';
import collection2 from '@/assets/collection-2.jpg';
import collection3 from '@/assets/collection-3.jpg';

const products = [
  {
    id: 1,
    name: 'Structured Wool Blazer',
    category: 'Outerwear',
    price: '$890',
    image: collection1,
  },
  {
    id: 2,
    name: 'Silk Balloon Sleeve Blouse',
    category: 'Tops',
    price: '$425',
    image: collection2,
  },
  {
    id: 3,
    name: 'Cognac Leather Tote',
    category: 'Accessories',
    price: '$1,250',
    image: collection3,
  },
  {
    id: 4,
    name: 'Tailored Wool Coat',
    category: 'Outerwear',
    price: '$1,450',
    image: collection1,
  },
  {
    id: 5,
    name: 'Cashmere Knit Sweater',
    category: 'Knitwear',
    price: '$680',
    image: collection2,
  },
  {
    id: 6,
    name: 'Leather Card Holder',
    category: 'Accessories',
    price: '$195',
    image: collection3,
  },
];

const categories = ['All', 'Outerwear', 'Tops', 'Knitwear', 'Accessories'];

export default function Collections() {
  return (
    <main className="min-h-screen pt-24">
      {/* Header */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-6">
              Spring / Summer 2024
            </p>
            <h1 className="font-display text-5xl md:text-7xl mb-8">Collections</h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Explore our curated selection of timeless pieces, each crafted with 
              exceptional attention to detail and the finest materials.
            </p>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4 mt-12"
          >
            {categories.map((category, index) => (
              <Button
                key={category}
                variant={index === 0 ? 'hero' : 'hero-outline'}
                size="default"
              >
                {category}
              </Button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="pb-24 md:pb-32">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/collections/${product.id}`} className="group block">
                  <div className="aspect-[3/4] overflow-hidden mb-6 bg-secondary">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm tracking-widest uppercase text-muted-foreground mb-2">
                        {product.category}
                      </p>
                      <h3 className="font-display text-xl group-hover:text-gold-accent transition-colors">
                        {product.name}
                      </h3>
                    </div>
                    <p className="text-lg font-body">{product.price}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex justify-center items-center gap-8 mt-16"
          >
            <Button variant="hero-outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm tracking-widest">Page 1 of 3</span>
            <Button variant="hero-outline" size="icon">
              <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Back Navigation */}
      <section className="pb-16">
        <div className="container mx-auto px-6">
          <Button variant="minimal" asChild>
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
