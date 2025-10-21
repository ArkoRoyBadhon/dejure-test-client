import Link from "next/link";

const { default: Image } = require("next/image");

const LogoContainer = () => {
  return (
    <div className="flex items-center space-x-2 cursor-pointer">
      <Link href="/">
        <Image
          src="/assets/icons/DJA logo Transperant-01 2.png"
          alt="De Jure Academy Logo"
          width={89}
          height={56}
          className="h-[56px] w-[89px] object-contain cursor-pointer"
        />
      </Link>
    </div>
  );
};

export default LogoContainer;
