import DownloadApp from "./_components/AppDownload";
import ContactAndResources from "./_components/ContactAndResources";
import ActivityGallery from "./_components/home/activity";
import FeaturesAndServices from "./_components/home/FeaturesAndServices";
import Gallery from "./_components/home/gallery";
import HomePageHero from "./_components/home/HomePageHero";
import InteractiveCourses from "./_components/home/InteractiveCourses";
import TestimonialsSection from "./_components/home/TestimonialsSection";

export default function Home() {
  return (
    <div>
      <HomePageHero />
      <FeaturesAndServices />
      <InteractiveCourses />
      <TestimonialsSection />
      <Gallery />
      <ActivityGallery visibility={false} />
      <ContactAndResources />
      <DownloadApp />
    </div>
  );
}
