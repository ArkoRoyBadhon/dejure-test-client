import Image from "next/image";

export default function NewslatterSubscribe() {
  return (
    <div className="py-16 md:pb-28 md:pt-20 p-4 md:px-0 ">
      <div className="max-w-[1200px] mx-auto relative bg-[#FFB800] rounded-4xl ">
        <div className="absolute inset-0 bg-[url('/assets/image/home-hero-bg.png')] bg-cover bg-center z-[0] opacity-[.04]" />

        <div className="flex flex-col md:flex-row items-center relative z-[1] pt-12 md:pt-0">
          {/* left part */}
          <div className="flex flex-col space-y-6  pl-0 md:pl-16 text-center md:text-start">
            <h1 className="font-bold text-[40px] text-white Z whitespace-nowrap hidden md:block">
              আমাদের দৈনিক নিউজলেটার সাবস্ক্রাইব করুন
            </h1>
            {/* For MBL */}
            <h1 className="font-bold text-3xl md:text-3xl text-white Z whitespace-nowrap block md:hidden">
              আমাদের দৈনিক <br /> নিউজলেটার সাবস্ক্রাইব
              <br /> করুন
            </h1>

            <div className="w-full flex-col space-y-4  hidden md:block">
              <div className="w-[515px]   bg-white rounded-md h-[56px]">
                <input
                  type="text"
                  placeholder="আপনার নাম*"
                  className="w-full py-4 px-6 rounded-md   text-lg placeholder-gray-400"
                />
              </div>
              <div className="w-[515px] flex items-center bg-white rounded-md h-[56px]">
                <input
                  type="email"
                  placeholder="ইমেইল এড্রেস*"
                  className="w-full bg-transparent py-2 px-4 focus:outline-none text-lg placeholder-gray-400"
                />
                <button className="bg-blue text-white font-semibold py-3 px-6 mr-1 rounded-md whitespace-nowrap">
                  সাবস্ক্রাইব করুন
                </button>
              </div>
            </div>
            <div className="w-full flex-col space-y-4  md:hidden  flex items-center justify-center">
              <div className="w-[300px]   bg-white rounded-2xl h-[56px]">
                <input
                  type="text"
                  placeholder="আপনার নাম*"
                  className="w-full py-4 px-6 rounded-2xl   text-lg placeholder-gray-400"
                />
              </div>
              <div className="w-[300px] flex items-center bg-white rounded-2xl h-[56px]">
                <input
                  type="email"
                  placeholder="ইমেইল এড্রেস*"
                  className="w-full bg-transparent py-2 px-4 focus:outline-none text-lg placeholder-gray-400"
                />
                <button className="bg-[#FFB800] text-[#141B34] font-semibold py-3 px-2 mr-1 rounded-2xl whitespace-nowrap">
                  সাবস্ক্রাইব করুন
                </button>
              </div>
            </div>
          </div>

          {/* Right Part */}
          <div className="flex justify-end items-center  ">
            <Image
              src="/graduate.png"
              alt=""
              height={350}
              width={268}
              className="w-[493px] h-[350px] md:h-[457px] md:-mt-22 mt-8"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
