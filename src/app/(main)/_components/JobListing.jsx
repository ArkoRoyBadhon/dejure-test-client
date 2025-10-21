import { Button } from "@/components/ui/button";
import { JobCard } from "./JobCard";

export function JobListings() {
  const jobs = [
    {
      title: "Law Officer / Office Secretary",
      salary: "60,000-70,000 TK",
      location: "Hybrid",
      company: "Chittagong",
      experience: "12-15 Years",
    },
    {
      title: "Law Officer / Office Secretary",
      salary: "60,000-70,000 TK",
      location: "Hybrid",
      company: "Chittagong",
      experience: "12-15 Years",
    },
    {
      title: "Law Officer / Office Secretary",
      salary: "60,000-70,000 TK",
      location: "Hybrid",
      company: "Chittagong",
      experience: "12-15 Years",
    },
    {
      title: "Law Officer / Office Secretary",
      salary: "60,000-70,000 TK",
      location: "Hybrid",
      company: "Chittagong",
      experience: "12-15 Years",
    },
    {
      title: "Law Officer / Office Secretary",
      salary: "60,000-70,000 TK",
      location: "Hybrid",
      company: "Chittagong",
      experience: "12-15 Years",
    },
    {
      title: "Law Officer / Office Secretary",
      salary: "60,000-70,000 TK",
      location: "Hybrid",
      company: "Chittagong",
      experience: "12-15 Years",
    },
  ];

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-4">
          {jobs.map((job, index) => (
            <JobCard
              key={index}
              title={job.title}
              salary={job.salary}
              location={job.location}
              company={job.company}
              experience={job.experience}
            />
          ))}
        </div>

        <div className="text-center mt-8">
          <Button
            variant="outline"
            className="px-8 py-3 bg-transparent cursor-pointer"
          >
            আরো চাকরি দেখুন
          </Button>
        </div>
      </div>
    </div>
  );
}
