import { useQuery } from "@tanstack/react-query";
import { publicApi } from "../api/publicApi";
import { ErrorState } from "../components/common/ErrorState";
import { LoadingScreen } from "../components/common/LoadingScreen";
import { Seo } from "../components/common/Seo";
import { FeaturedProducts } from "../components/home/FeaturedProducts";
import { FeaturedProjects } from "../components/home/FeaturedProjects";
import { HeroSlider } from "../components/home/HeroSlider";
import { HomeCta } from "../components/home/HomeCta";
import { IntroSection } from "../components/home/IntroSection";
import { WhyChooseUs } from "../components/home/WhyChooseUs";

export function HomePage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["home-page"],
    queryFn: publicApi.getHome,
  });

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isError || !data) {
    return <ErrorState />;
  }

  return (
    <>
      <Seo
        title={data.settings.metaTitle || "Điêu Khắc Xuân Trường"}
        description={data.settings.metaDescription}
      />
      <HeroSlider banners={data.banners} />
      <IntroSection sections={data.homepage.sections} />
      <FeaturedProducts products={data.featuredProducts} />
      <WhyChooseUs sections={data.homepage.sections} />
      <FeaturedProjects projects={data.featuredProjects} />
      <HomeCta cta={data.homepage.sections?.cta} />
    </>
  );
}
