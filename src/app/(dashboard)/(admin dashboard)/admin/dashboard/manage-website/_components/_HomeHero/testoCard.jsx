function TestimonialCard({ review }) {
  return (
    <div className="w-[280px] h-[250px] shadow-md flex flex-col border rounded-lg">
      <div className="flex flex-col items-start p-6 relative flex-grow overflow-hidden">
        {/* Header with avatar and name */}
        <div className="flex flex-col items-start gap-2 w-full">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
              <img
                src={review.image}
                alt="User avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col items-start gap-1">
              <h3 className="font-bold text-[#141b34] text-base">
                {review.name}
              </h3>
              <p className="text-[#141b34] text-sm font-normal">
                {review.designation}
              </p>
            </div>
          </div>
        </div>

        {/* Star Rating */}
        <div className="flex mt-2">
          {/* Here rating is a number between 1-5 */}
          {Array.from({ length: 5 }, (_, index) => (
            <Image
              key={index}
              className="h-4 w-4"
              alt="Star rating"
              src={index < review.rating ? "/star.svg" : "/star-empty.svg"}
              height={20}
              width={20}
              unoptimized
            />
          ))}
        </div>

        {/* Review Text */}
        <p className="text-[#57595e] text-base leading-6 font-normal line-clamp-4 mt-2">
          {review.comment}
        </p>

        {/* Quote Icon */}
        <Image
          className="absolute w-6 h-5 bottom-6 right-6"
          alt="Quote mark"
          src="/quote.svg"
          height={20}
          width={20}
          unoptimized
        />
      </div>
    </div>
  );
}
