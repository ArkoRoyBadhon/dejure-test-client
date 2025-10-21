import BlogHero from "./_components/blogHero";
import BlogHighlights from "./_components/highlights";
import MentorsBlog from "./_components/mentorsBlog";
import NewslatterSubscribe from "./_components/newslatter";
import OthersBlog from "./_components/othersBlog";

export default function BlogPage() {
  return (
    <div>
      <BlogHero />
      <BlogHighlights />
      <MentorsBlog />
      <OthersBlog />
      <NewslatterSubscribe />
    </div>
  );
}
