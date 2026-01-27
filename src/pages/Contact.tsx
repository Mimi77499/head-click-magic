import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, ArrowRight, MapPin, Phone, Mail } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Message sent successfully! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

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
              Get in Touch
            </p>
            <h1 className="font-display text-5xl md:text-7xl mb-8">Contact</h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              We'd love to hear from you. Whether you have a question about our 
              collections, need styling advice, or want to visit our atelier.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="pb-24 md:pb-32">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-3xl mb-8">Send a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm tracking-widest uppercase text-muted-foreground block mb-3">
                      Name
                    </label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="bg-secondary border-0 h-12 focus:ring-gold-accent"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="text-sm tracking-widest uppercase text-muted-foreground block mb-3">
                      Email
                    </label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="bg-secondary border-0 h-12 focus:ring-gold-accent"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm tracking-widest uppercase text-muted-foreground block mb-3">
                    Subject
                  </label>
                  <Input
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="bg-secondary border-0 h-12 focus:ring-gold-accent"
                    placeholder="How can we help?"
                  />
                </div>
                <div>
                  <label className="text-sm tracking-widest uppercase text-muted-foreground block mb-3">
                    Message
                  </label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="bg-secondary border-0 resize-none focus:ring-gold-accent"
                    placeholder="Tell us more..."
                  />
                </div>
                <Button variant="hero" size="xl" type="submit" className="w-full md:w-auto">
                  Send Message
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:pl-12"
            >
              <h2 className="font-display text-3xl mb-8">Visit Us</h2>
              
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="w-12 h-12 bg-secondary flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-gold-accent" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl mb-2">Flagship Store</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      123 Fashion Avenue<br />
                      New York, NY 10001<br />
                      United States
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="w-12 h-12 bg-secondary flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-gold-accent" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl mb-2">Phone</h3>
                    <p className="text-muted-foreground">
                      +1 (555) 123-4567
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="w-12 h-12 bg-secondary flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-gold-accent" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl mb-2">Email</h3>
                    <p className="text-muted-foreground">
                      hello@maison.com
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-12 border-t border-border">
                <h3 className="font-display text-xl mb-4">Store Hours</h3>
                <div className="space-y-2 text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span>10:00 AM - 8:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span>10:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span>12:00 PM - 5:00 PM</span>
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <Button variant="hero-outline" size="lg" asChild>
                  <Link to="/collections">
                    Browse Collections
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
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
