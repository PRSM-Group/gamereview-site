import { getLandingData } from "@/lib/landing-data";
import { SiteHeaderServer } from "@/components/layout/SiteHeaderServer";
import { HeroSection } from "@/components/landing/HeroSection";
import { LandingSections } from "@/components/landing/LandingSections";

export default async function Home() {
  const { featuredReview, recentReviews, topGames } = await getLandingData();

  return (
    <div className="min-h-full bg-[#070000] text-white">
      <div className="relative z-50 animate-fade-in">
        <SiteHeaderServer />
      </div>

      <main>
        <div className="animate-fade-up">
          <HeroSection featuredReview={featuredReview} />
        </div>

        <div className="animate-fade-up animate-delay-1">
          <LandingSections
            recentReviews={recentReviews}
            topGames={topGames}
          />
        </div>
      </main>
    </div>
  );
}
