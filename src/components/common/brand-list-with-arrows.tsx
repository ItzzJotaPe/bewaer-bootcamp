"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";

import { Button } from "../ui/button";

interface Brand {
  name: string;
  logo: string;
}

interface BrandListWithArrowsProps {
  title: string;
  brands: Brand[];
}

const BrandListWithArrows = ({ title, brands }: BrandListWithArrowsProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <h3 className="px-4 text-base font-semibold sm:px-5 sm:text-lg lg:px-12 lg:text-xl xl:px-16">
        {title}
      </h3>

      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex w-full gap-3 overflow-x-auto px-4 sm:gap-4 sm:px-5 lg:gap-6 lg:px-12 xl:px-16 [&::-webkit-scrollbar]:hidden"
        >
          {brands.map((brand) => (
            <div
              key={brand.name}
              className="flex min-w-[160px] flex-col items-center gap-2 rounded-xl border bg-white p-3 shadow-sm sm:min-w-[180px] sm:gap-3 sm:p-4 lg:min-w-[200px]"
            >
              <div className="flex h-14 w-14 items-center justify-center sm:h-16 sm:w-16 lg:h-20 lg:w-20">
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  width={64}
                  height={64}
                  className="h-auto max-h-14 w-full max-w-14 sm:max-h-16 sm:max-w-16 lg:max-h-20 lg:max-w-20"
                />
              </div>
              <p className="text-center text-xs font-medium text-gray-900 sm:text-sm lg:text-base">
                {brand.name}
              </p>
            </div>
          ))}
        </div>

        <div className="hidden lg:block">
          <Button
            onClick={scrollLeft}
            variant="outline"
            size="icon"
            className="absolute top-1/2 left-2 h-10 w-10 -translate-y-1/2 rounded-full bg-white shadow-lg hover:bg-gray-50"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </Button>

          <Button
            onClick={scrollRight}
            variant="outline"
            size="icon"
            className="absolute top-1/2 right-2 h-10 w-10 -translate-y-1/2 rounded-full bg-white shadow-lg hover:bg-gray-50"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BrandListWithArrows;
