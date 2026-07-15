import { getLandingData } from "@/lib/landing-data";
import { SiteHeader } from "@/components/SiteHeader";
import { HeroSection } from "@/components/HeroSection";
import { LandingSections } from "@/components/LandingSections";

export default async function Home() {
  const { featuredReview, recentReviews, topGames } = await getLandingData();

  return (
    <div className="min-h-full bg-[#070000] text-white">
      <div className="relative z-50 animate-fade-in">
        <SiteHeader />
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
