import { Search } from "lucide-react";

export function Landing() {
  return (
    <div className="relative w-full h-svh overflow-hidden">
      <img
        src="/assets/landing1_1.jpg"
        alt="landing"
        className="object-cover"
      />
      <div
        className="
          absolute inset-0 z-10
          flex items-center
        "
      >
        <div
          className="
            w-full
            px-6
            md:px-20
            max-w-2xl
          "
        >
          <h1
            className="
              text-3xl
              md:text-5xl
              lg:text-6xl
              font-extralight
              text-amber-50
              leading-tight
            "
          >
            Because every second
            <br />
            of your time deserves value.
          </h1>

          <div className="relative w-full max-w-xl mt-6">
            <input
              type="text"
              placeholder="Search services..."
              className="
                w-full
                h-11
                rounded-sm
                bg-amber-50
                px-4
                pr-12
                text-sm
                text-neutral-900
                outline-none
              "
            />
            <button
              className="
                absolute
                right-2
                top-1/2
                -translate-y-1/2
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-full
                bg-[#16A34A]
                text-white
              "
            >
              <Search className="h-4 w-4" />
            </button>
          </div>

          <div
            className="
              mt-6
              flex
              flex-wrap
              gap-3
            "
          >
            {["plumbing", "design", "computer"].map((item) => (
              <button
                key={item}
                className="
                  flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-white/70
                  px-4
                  py-1.5
                  text-sm
                  text-white
                  hover:bg-white/10
                "
              >
                {item}
                <span>→</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
