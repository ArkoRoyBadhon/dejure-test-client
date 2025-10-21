import React from "react";
import CommonPageHero from "../_components/home/CommonPageHero";
import DownloadApp from "../_components/AppDownload";
import RecentJobList from "./_components/RecentJobList";
import CareerHero from "./_components/CareerHero";

const CareerPage = () => {
  return (
    <div>
      <CareerHero />
      <RecentJobList />
      <DownloadApp />
    </div>
  );
};

export default CareerPage;
