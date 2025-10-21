import { motion } from "framer-motion";

const HeroStats = ({ student, mentor, material, bcs, liveClass,bar,liveExam }) => {
  const convertToBengali = (num) => {
    const bengaliNumerals = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return num
      .toString()
      .split("")
      .map((digit) => bengaliNumerals[parseInt(digit)])
      .join("");
  };

  const statsData = [
    { count: convertToBengali(student), label: "শিক্ষার্থী", color: "#3DADFF" },
    {
      count: convertToBengali(mentor),
      label: "অভিজ্ঞ মেন্টর",
      color: "#FFC943",
    },
    {
      count: convertToBengali(material),
      label: "লার্নিং ম্যাটেরিয়াল",
      color: "#5FC263",
    },
    { count: convertToBengali(bcs), label: "বিজেএস সাফল্য", color: "#874FFF" },
    {
      count: convertToBengali(bar),
      label: "বার সাফল্য",
      color: "#F849C1",
    },
    {
      count: convertToBengali(liveClass),
      label: "লাইভ ক্লাস",
      color: "#FF7F50",
    },
    {
      count:convertToBengali(liveExam),
      label: "লাইভ এক্সাম",
      color: "#00C49F",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="mx-auto max-w-[1200px] px-4 md:px-0 ">
      <div className="w-full bg-white rounded-2xl shadow-[0px_8px_40px_rgba(0,0,0,0.1)] p-10 -translate-y-1/6 lg:-translate-y-2/4 relative">
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-y-8 text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {statsData.map((stat, index) => (
            <motion.div
              key={index}
              className={`flex flex-col items-center justify-center relative px-4 ${
                index === 2 ? "col-span-2 md:col-auto" : ""
              }`}
              variants={itemVariants}
            >
              <p
                className="text-3xl  font-bold flex items-center justify-center gap-1"
                style={{ color: stat.color }}
              >
                {stat.count}
                <span className="text-black text-4xl font-bold Z"> + </span>
              </p>
              <p className="text-lg font-bold text-darkColor mt-4 Z line-clamp-1">
                {stat.label}
              </p>

              {/* Divider except last item */}
              {index !== statsData.length - 1 && (
                <div
                  className={`absolute right-0 top-1/2 -translate-y-1/2 h-full w-px bg-gray3 ${
                    index === 2 ? "hidden md:block" : ""
                  }`}
                />
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default HeroStats;
