import { HeroSection } from '../components/hero/HeroSection';
import { ScrollScene } from '../components/animations/ScrollScene';
import { BoltAnatomy } from '../components/animations/BoltAnatomy';
import { CategoriesSection } from '../components/sections/CategoriesSection';
import { MaterialsSection } from '../components/sections/MaterialsSection';
import { IndustriesSection } from '../components/sections/IndustriesSection';
import { WhyChooseUs } from '../components/sections/WhyChooseUs';
import { FeaturedProducts } from '../components/sections/FeaturedProducts';
import { QuoteSection } from '../components/sections/QuoteSection';
import { Testimonials } from '../components/sections/Testimonials';
import { FAQ } from '../components/sections/FAQ';
import { FinalCTA } from '../components/sections/FinalCTA';
import { ErrorBoundary } from '../components/ui/ErrorBoundary';
import { setMeta } from '../lib/utils';
import { useEffect } from 'react';
import { ShowcaseSection } from '../components/sections/ShowcaseSection';

export function HomePage({ reducedMotion, isMobile }: { reducedMotion: boolean; isMobile: boolean }) {
  useEffect(() => {
    setMeta(
      'Fasteners — Engineered to Hold. Built to Last. | Premium Industrial Fasteners',
      'Cinematic 3D fastener storytelling, live material showcase, and a 46-product catalog with real reference photos.',
    );
  }, []);

  return (
    <main>
      <HeroSection reducedMotion={reducedMotion} isMobile={isMobile} />
      <ErrorBoundary>
        <ScrollScene reducedMotion={reducedMotion} isMobile={isMobile} />
      </ErrorBoundary>
      <BoltAnatomy />
      <CategoriesSection />
      <ShowcaseSection />
      <MaterialsSection reducedMotion={reducedMotion} isMobile={isMobile} />
      <IndustriesSection />
      <WhyChooseUs />
      <FeaturedProducts />
      <QuoteSection />
      <Testimonials />
      <FAQ />
      <FinalCTA isMobile={isMobile} />
    </main>
  );
}
