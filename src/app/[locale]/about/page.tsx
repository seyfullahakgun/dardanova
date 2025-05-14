"use client";
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

const About = () => {
  const t = useTranslations("About");

  return (
    <div className="min-h-screen bg-dark py-24">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t("title")}
          </h1>
          <div className="w-24 h-1 bg-primary mx-auto"></div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Sol taraf - SVG Resim */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative h-[500px] w-full"
          >
            <Image
              src="/images/about.svg"
              alt="About Dardanova"
              fill
              className="object-contain"
              priority
            />
          </motion.div>

          {/* Sağ taraf - Metin içeriği */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6 text-secondary"
          >
            <p className="text-lg leading-relaxed">
              {t("paragraph1")}
            </p>
            <p className="text-lg leading-relaxed">
              {t("paragraph2")}
            </p>
            <p className="text-lg leading-relaxed">
              {t("paragraph3")}
            </p>
            <p className="text-lg leading-relaxed font-semibold text-primary">
              {t("paragraph4")}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default About;