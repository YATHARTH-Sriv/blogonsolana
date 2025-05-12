'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletButton } from '../solana/solana-provider';
import Link from 'next/link';
import { Button } from '../ui/button';
import { FaTwitter, FaGithub } from 'react-icons/fa';

const socials = [
  {
    id: 1,
    logo: <FaTwitter className="text-xl text-blue-500" />,
    link: "https://x.com/yatharth_sriv"
  },
  {
    id: 2,
    logo: <FaGithub className="text-xl text-white hover:text-black" />,
    link: "https://github.com/yatharth-sriv"
  }
];

export function DashboardFeature() {
  const { publicKey } = useWallet();
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-12 md:pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Decentralized Blogging
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
                Powered by Solana
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Own your content, earn from your ideas, and connect with readers directly—without intermediaries or censorship.
            </p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              {!publicKey ? (
                <WalletButton />
              ) : (
                <Link href="/counter">
                  <Button size="lg">
                    Manage Your Blogs
                  </Button>
                </Link>
              )}
            </motion.div>
          </motion.div>
          
          {/* Animated Bubbles */}
          <motion.div 
            className="absolute top-20 right-10 w-64 h-64 rounded-full bg-gradient-to-r from-purple-500/20 to-primary/20 blur-3xl -z-10"
            animate={{ 
              scale: [1, 1.1, 1],
              x: [0, 10, 0],
              y: [0, -10, 0],
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          <motion.div 
            className="absolute bottom-20 -left-20 w-80 h-80 rounded-full bg-gradient-to-r from-primary/10 to-purple-500/10 blur-3xl -z-10"
            animate={{ 
              scale: [1, 1.2, 1],
              x: [0, 15, 0],
              y: [0, 15, 0],
            }}
            transition={{ 
              duration: 10,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Blog on Solana?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-card p-6 rounded-lg border border-border"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-background to-card/30">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2 
            className="text-3xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Ready to Start Your Web3 Blogging Journey?
          </motion.h2>
          <motion.p 
            className="text-lg text-muted-foreground mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Join the future of content creation with ownership, transparency, and direct engagement with your audience.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {!publicKey ? (
              <div className="flex justify-center">
                <WalletButton />
              </div>
            ) : (
              <Link href="/counter">
                <Button size="lg">
                  Start Creating
                </Button>
              </Link>
            )}
          </motion.div>
        </div>
      </section>

       {/* <div className="w-full md:w-1/2 mt-32 px-6 mx-auto">
        <h2 className="text-xl md:text-2xl font-medium mb-6 text-center">
          Frequently Asked Questions
        </h2>
        <AccordionDemo />
      </div> */}

      {/* Footer Socials */}
      <div className="w-full flex justify-center gap-4 mt-12">
        {socials.map(({ id, logo, link }) => (
          <Link key={id} href={link} target="_blank" className="hover:bg-white/10 p-3 rounded-full transition-all duration-300">
            {logo}
          </Link>
        ))}
      </div>
    </div>
  );
}

// Feature data
const features = [
  {
    title: "True Content Ownership",
    description: "Your blog posts are stored on-chain with your wallet as the verifiable owner. No platform can take away your content.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
      </svg>
    )
  },
  {
    title: "Censorship Resistant",
    description: "Your content can't be censored, moderated or removed by centralized authorities or platforms.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
      </svg>
    )
  },
  {
    title: "Solana Speed & Efficiency",
    description: "Enjoy lightning-fast transactions and minimal fees when publishing or updating your content.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-16h-9l1-4z"></path>
      </svg>
    )
  },
];