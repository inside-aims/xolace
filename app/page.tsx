import { BenefitsSection } from "@/components/landing-sections/benefits";
import { EmotionalSlapSection } from "@/components/landing-sections/emotional-slap";
import { FAQSection } from "@/components/landing-sections/faq";
import { FeaturesSection } from "@/components/landing-sections/features";
import { FooterSection } from "@/components/landing-sections/footer";
import { HeroSection } from "@/components/landing-sections/hero";
import { HowItWorksSection } from "@/components/landing-sections/how-it-works";
import { Navbar } from "@/components/landing-sections/navbar";
import { TestimonialSection } from "@/components/landing-sections/testimonial";

export default function Home() {
  return (
      <main className={"main bg-background text-foreground"}>
        <Navbar />
        <div className="flex flex-col items-center overflow-x-hidden">
          <HeroSection />
          <EmotionalSlapSection />
          <HowItWorksSection />
          <FeaturesSection />
          <BenefitsSection />
          <TestimonialSection />
          <FAQSection />
          <FooterSection />
        </div>
      </main>
  );
}
