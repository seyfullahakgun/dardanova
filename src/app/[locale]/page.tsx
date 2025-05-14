"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

const Home = () => {
  const t = useTranslations("Home");

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqData = [
    {
      question: t("faq.questions.difference.question"),
      answer: t("faq.questions.difference.answer"),
    },
    {
      question: t("faq.questions.technologies.question"),
      answer: t("faq.questions.technologies.answer"),
    },
    {
      question: t("faq.questions.process.question"),
      answer: t("faq.questions.process.answer"),
    },
    {
      question: t("faq.questions.timeline.question"),
      answer: t("faq.questions.timeline.answer"),
    },
    {
      question: t("faq.questions.pricing.question"),
      answer: t("faq.questions.pricing.answer"),
    },
    {
      question: t("faq.questions.support.question"),
      answer: t("faq.questions.support.answer"),
    },
    {
      question: t("faq.questions.international.question"),
      answer: t("faq.questions.international.answer"),
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Landing Home */}
      <div className="flex flex-col items-center justify-center gap-2 h-screen w-screen bg-[url('/images/landingHome.png')] bg-cover bg-center p-2">
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-3xl lg:text-5xl text-center text-white font-bold"
        >
          {t("title")}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="text-lg lg:text-2xl text-center text-secondary max-w-3xl mx-auto"
        >
          {t("description")}
        </motion.p>

        <motion.img
          src={"/icons/chevron-down.svg"}
          alt="chevron-down"
          width={70}
          height={50}
          className="absolute bottom-12 mt-10"
          animate={{
            y: [0, -20, 0], // Yukarı çık, aşağı in
          }}
          transition={{
            duration: 1, // Animasyon süresi
            repeat: Infinity, // Sonsuz döngü
            repeatType: "reverse", // Yukarı çıkıp geri inerek devam et
            ease: "easeInOut", // Yumuşak geçiş efekti
          }}
        />
      </div>
      <div className="flex flex-col items-center justify-center w-screen py-24 bg-dark">
        <motion.h2
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
          viewport={{ once: true }}
          className="text-2xl lg:text-4xl text-center text-white font-semibold mb-16"
        >
          {t("servicesTitle")}
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto px-4">
          {/* Web Applications Card */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="group bg-white/10 backdrop-blur-lg p-6 flex flex-col items-center text-center hover:bg-white/20 transition-all duration-300"
          >
            <div className="w-16 h-16 mb-4">
              <Image
                src="/icons/web.svg"
                alt="Web Applications"
                width={64}
                height={64}
                className="w-full h-full"
              />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-primary transition-all duration-300">
              {t("services.web")}
            </h3>
            <p className="text-secondary/80">{t("servicesDescriptions.web")}</p>
          </motion.div>

          {/* Mobile & Desktop Applications Card */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="group bg-white/10 backdrop-blur-lg p-6 flex flex-col items-center text-center hover:bg-white/20 transition-all duration-300"
          >
            <div className="w-16 h-16 mb-4">
              <Image
                src="/icons/mobile.svg"
                alt="Mobile & Desktop Applications"
                width={64}
                height={64}
                className="w-full h-full"
              />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-primary transition-all duration-300">
              {t("services.mobile")}
            </h3>
            <p className="text-secondary/80">
              {t("servicesDescriptions.mobile")}
            </p>
          </motion.div>

          {/* MVP & Prototype Card */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="group bg-white/10 backdrop-blur-lg p-6 flex flex-col items-center text-center hover:bg-white/20 transition-all duration-300"
          >
            <div className="w-16 h-16 mb-4">
              <Image
                src="/icons/prototype.svg"
                alt="MVP & Prototype"
                width={64}
                height={64}
                className="w-full h-full"
              />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-primary transition-all duration-300">
              {t("services.mvp")}
            </h3>
            <p className="text-secondary/80">{t("servicesDescriptions.mvp")}</p>
          </motion.div>

          {/* Maintenance & Support Card */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            className="group bg-white/10 backdrop-blur-lg p-6 flex flex-col items-center text-center hover:bg-white/20 transition-all duration-300"
          >
            <div className="w-16 h-16 mb-4">
              <Image
                src="/icons/tool.svg"
                alt="Maintenance & Support"
                width={64}
                height={64}
                className="w-full h-full"
              />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-primary transition-all duration-300">
              {t("services.maintenance")}
            </h3>
            <p className="text-secondary/80 ">
              {t("servicesDescriptions.maintenance")}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Features */}
      <div className="flex items-center justify-center w-screen min-h-[80vh] bg-[url('/images/landingFeatures.png')] bg-cover bg-fixed p-2">
        <div className="grid grid-cols-1 lg:grid-cols-2 p-4 py-12 max-w-screen-md">
          <div className="flex flex-col items-center justify-center gap-8 lg:border-r lg:border-y border-b border-secondary p-8">
            <motion.h3
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0.1, x: -50 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-2xl text-center text-white font-bold"
            >
              {t("features.innovative.title")}
            </motion.h3>
            <motion.p
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0.1, x: -50 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-lg text-center text-secondary font-light"
            >
              {t("features.innovative.description")}
            </motion.p>
          </div>
          <div className="flex flex-col items-center justify-center gap-8 lg:border-y border-b border-secondary p-8">
            <motion.h3
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0.1, x: 50 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-2xl text-center text-white font-bold"
            >
              {t("features.scalable.title")}
            </motion.h3>
            <motion.p
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0.1, x: 50 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-lg text-center text-secondary font-light"
            >
              {t("features.scalable.description")}
            </motion.p>
          </div>
          <div className="flex flex-col items-center justify-center gap-8 lg:border-r lg:border-b border-b border-secondary p-8">
            <motion.h3
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0.1, x: -50 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-2xl text-center text-white font-bold"
            >
              {t("features.customer.title")}
            </motion.h3>
            <motion.p
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0.1, x: -50 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-lg text-center text-secondary font-light"
            >
              {t("features.customer.description")}
            </motion.p>
          </div>
          <div className="flex flex-col items-center justify-center gap-8 lg:border-b border-secondary p-8">
            <motion.h3
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0.1, x: 50 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-2xl text-center text-white font-bold"
            >
              {t("features.development.title")}
            </motion.h3>
            <motion.p
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0.1, x: 50 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-lg text-center text-secondary font-light"
            >
              {t("features.development.description")}
            </motion.p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 p-4 py-24 max-w-screen-lg mx-auto">
        <div className="flex flex-col col-span-1 lg:col-span-2 items-start justify-items-start gap-8">
          <h4 className="text-4xl leading-12 tracking-wide text-center lg:text-left text-secondary font-bold">
            {t("faq.title")}
          </h4>
          <Image
            src="/images/faq.svg"
            alt="faq"
            width={500}
            height={500}
            className="object-contain mx-auto"
          />
        </div>
        <motion.div className="col-span-1 lg:col-span-3 flex flex-col items-center justify-start gap-12 w-full max-w-3xl mx-auto">
          {faqData.map((faq, index) => (
            <div key={index} className="w-full">
              <button
                onClick={() => toggleAccordion(index)}
                className="flex items-center justify-between w-full px-6 text-xl font-medium text-white rounded-lg cursor-pointer transition-all duration-300"
              >
                <span className="text-start">{faq.question}</span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src="/icons/chevron-down.svg"
                    alt="chevron"
                    width={32}
                    height={32}
                  />
                </motion.div>
              </button>

              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{
                  height: openIndex === index ? "auto" : 0,
                  opacity: openIndex === index ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <p className="p-6 text-secondary">{faq.answer}</p>
              </motion.div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
