import { useRef, useState } from "react";
import { ChevronRight } from "lucide-react";
import type { League } from "../types";
import LeagueCard from "./LeagueCard";

interface LeagueCarouselProps {
  leagues: League[];
  onViewAll: () => void;
  onLeagueSelect: (league: League) => void;
}

const LeagueCarousel = ({ leagues, onViewAll, onLeagueSelect }: LeagueCarouselProps) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [activeLeagueIndex, setActiveLeagueIndex] = useState(0);

  const updateActiveLeague = () => {
    const carousel = carouselRef.current;
    if (!carousel) {
      return;
    }

    const closestIndex = cardRefs.current.reduce(
      (closest, card, index) => {
        if (!card) {
          return closest;
        }

        const distance = Math.abs(card.offsetLeft - carousel.scrollLeft - 20);
        return distance < closest.distance ? { index, distance } : closest;
      },
      { index: 0, distance: Number.POSITIVE_INFINITY },
    ).index;

    setActiveLeagueIndex(closestIndex);
  };

  const scrollToLeague = (index: number) => {
    const carousel = carouselRef.current;
    const card = cardRefs.current[index];
    if (!carousel || !card) {
      return;
    }

    carousel.scrollTo({
      left: card.offsetLeft - 20,
      behavior: "smooth",
    });
    setActiveLeagueIndex(index);
  };

  return (
    <section>
      <div className="min-h-0 overflow-hidden">
        <div
          ref={carouselRef}
          data-testid="league-carousel"
          onScroll={updateActiveLeague}
          className="-mx-5 overflow-x-auto px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <div className="flex w-max gap-2.5 pr-12">
            {leagues.map((league, index) => (
              <div
                key={league.id}
                ref={(element) => {
                  cardRefs.current[index] = element;
                }}
              >
                <LeagueCard league={league} onClick={() => onLeagueSelect(league)} />
              </div>
            ))}
            <button
              type="button"
              onClick={onViewAll}
              className="flex w-[108px] shrink-0 flex-col items-center justify-center gap-2 rounded-[16px] border border-white/[0.08] bg-[#1c211c] px-3 text-center text-slate-300"
            >
              <span className="grid h-8 w-8 place-items-center rounded-full bg-white/[0.06]">
                <ChevronRight size={18} />
              </span>
              <span className="text-xs font-extrabold">Ver mas</span>
            </button>
          </div>
        </div>
        <div className="mt-1.5 flex justify-center gap-1.5" aria-label="Seleccionar liga">
          {leagues.map((league, index) => (
            <button
              key={league.id}
              type="button"
              onClick={() => scrollToLeague(index)}
              aria-label={`Ver ${league.name}`}
              aria-current={activeLeagueIndex === index}
              className={`h-1.5 rounded-full transition-all ${
                activeLeagueIndex === index ? "w-4 bg-[#8f9a61]" : "w-1.5 bg-white/15"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LeagueCarousel;
