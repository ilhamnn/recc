import { Landing } from "@/components/landing1";
import { Fot } from "@/components/ui/footer";
import { SimpleHeader } from "@/components/ui/navBase/headr";
import { Testimonials } from "@/components/testi";
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
