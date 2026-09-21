import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Problem from '../components/Problem';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import SeeItInAction from '../components/SeeItInAction';
import PrivacyFirst from '../components/PrivacyFirst';
import Faq from '../components/Faq';
import CtaBanner from '../components/CtaBanner';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-[#FAFBFE]">
      <Navbar />
      <Hero />
      <Problem />
      <Features />
      <HowItWorks />
      <SeeItInAction />
      <PrivacyFirst />
      <Faq />
      <CtaBanner />
      <Footer />
    </main>
  );
}
