import { Landing } from "@/pages/landing/components/hero";
import { Testimonials } from "@/pages/landing/components/testi";
export default function Home() {
  return (
    <div className="w-full">
      <Landing />
      <Testimonials />
    </div>
  );
}
