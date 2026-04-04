import { Landing } from "@/pages/landing/components/hero";
import { SimpleHeader } from "@/components/navBase/headr";
import { Testimonials } from "@/pages/landing/components/testi";
export default function Home() {
  return (
    <div className="w-full">
      <nav>
        <SimpleHeader />
      </nav>
      <Landing />
      <Testimonials />
    </div>
  );
}
