import { Search } from "lucide-react";

export function Landing() {
  return (
    <div className="relative w-full h-svh overflow-hidden">
      <img
        src="/assets/landing1_1.jpg"
        alt="landing"
        className="w-full h-full object-cover"
      />

      <div className="absolute inset-0 z-10 flex items-center md:items-center">
        <div className="w-full px-5 sm:px-8 md:px-20 max-w-2xl">
          <h1
            className="
            text-2xl
            sm:text-3xl
            md:text-5xl
            lg:text-6xl
            font-extralight
            text-amber-50
            leading-snug
            max-w-md
          "
          >
            Because every second
            <br />
            of your time deserves value.
          </h1>

          <div className="relative w-full max-w-xl mt-5">
            <input
              type="text"
              placeholder="Search services..."
              className="
                w-full
                h-12
                rounded-md
                bg-amber-50
                px-4
                pr-14
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
              h-9
              w-9
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

          <div className="mt-5 flex flex-wrap gap-2">
            {["plumbing", "design", "computer"].map((item) => (
              <button
                key={item}
                className="
                  rounded-full
                  border
                  border-white/70
                  px-4
                  py-2
                  text-xs
                  sm:text-sm
                  text-white
                  hover:bg-white/10
                "
              >
                {item} →
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
