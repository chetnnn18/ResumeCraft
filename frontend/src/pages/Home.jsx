import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import AIShowcase from "../components/landing/AIShowcase";
import {
  Companies,
  Features,
  Templates,
  Workflow,
  Benefits,
  Testimonials,
  Pricing,
  FAQ,
  CTA,
  Footer,
} from "../components/landing/Sections";

export default function Home({ onLaunch }) {
  return (
    <div className="relative overflow-x-hidden">
      <Navbar onLaunch={onLaunch} />
      <main>
        <Hero onLaunch={onLaunch} />
        <Companies />
        <Features />
        <AIShowcase />
        <Templates onLaunch={onLaunch} />
        <Workflow />
        <Benefits />
        <Testimonials />
        <Pricing onLaunch={onLaunch} />
        <FAQ />
        <CTA onLaunch={onLaunch} />
      </main>
      <Footer />
    </div>
  );
}
