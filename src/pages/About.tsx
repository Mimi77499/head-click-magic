import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import collection2 from '@/assets/collection-2.jpg';
import heroImage from '@/assets/hero-fashion.jpg';

export default function About() {
  return (
    <main className="min-h-screen pt-24">
      {/* Hero */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-6">
              Our Story
            </p>
            <h1 className="font-display text-5xl md:text-7xl mb-8">About Maison</h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Founded on the belief that exceptional design should be accessible, 
              timeless, and crafted with intention.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="aspect-[21/9] overflow-hidden"
          >
            <img
              src={heroImage}
              alt="Maison atelier"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-6">
                Philosophy
              </p>
              <h2 className="font-display text-4xl md:text-5xl mb-8 leading-tight">
                Where tradition
                <br />
                meets <span className="italic">innovation</span>
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <p className="text-muted-foreground leading-relaxed text-lg">
                At Maison, we believe that true luxury lies in the details—the hand-stitched 
                seams, the carefully sourced fabrics, the silhouettes that move with the body.
              </p>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Our design philosophy centers on creating pieces that transcend fleeting trends. 
                We draw inspiration from architectural forms, natural textures, and the rich 
                heritage of European craftsmanship.
              </p>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Every garment is a collaboration between traditional artisans and contemporary 
                designers, resulting in pieces that honor the past while embracing the future.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 md:py-32 bg-secondary">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4">
              Our Values
            </p>
            <h2 className="font-display text-4xl md:text-5xl">What We Stand For</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: 'Craftsmanship',
                description: 'Every piece is meticulously crafted by skilled artisans using time-honored techniques passed down through generations.',
              },
              {
                title: 'Sustainability',
                description: 'We are committed to responsible sourcing, ethical production, and creating garments designed to last a lifetime.',
              },
              {
                title: 'Innovation',
                description: 'We continuously explore new materials and methods while respecting the integrity of traditional craftsmanship.',
              },
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="text-center"
              >
                <div className="w-16 h-px bg-gold-accent mx-auto mb-8" />
                <h3 className="font-display text-2xl mb-4">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Section */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="aspect-[4/5] overflow-hidden"
            >
              <img
                src={collection2}
                alt="Craftsmanship detail"
                className="w-full h-full object-cover"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="aspect-[4/5] overflow-hidden"
            >
              <img
                src={heroImage}
                alt="Design process"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32 bg-foreground text-background">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-4xl md:text-5xl mb-8">
              Experience the Collection
            </h2>
            <p className="text-background/70 text-lg max-w-xl mx-auto mb-12">
              Discover pieces that will become the foundation of your wardrobe 
              for years to come.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                variant="hero-outline"
                size="xl"
                className="border-background text-background hover:bg-background hover:text-foreground"
                asChild
              >
                <Link to="/collections">
                  View Collections
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button
                variant="hero-outline"
                size="xl"
                className="border-background text-background hover:bg-background hover:text-foreground"
                asChild
              >
                <Link to="/contact">
                  Contact Us
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Back Navigation */}
      <section className="py-16">
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
