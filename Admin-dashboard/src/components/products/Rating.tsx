import { FC } from "react";

interface Props {
  ratingValue: number;
  setRatingValue: React.Dispatch<React.SetStateAction<number>>;
}

const Rating: FC<Props> = ({ ratingValue, setRatingValue }) => {
  return (
    <div className="w-full ">
      <h2 className="mt-0 pt-0">Rating:</h2>
      <div className="flex items-center mt-2">
        <div className="flex text-yellow-500">
          {[...Array(5)].map((_, index) => (
            <svg
              key={index}
              onClick={() => {
                setRatingValue(index + 1);
              }}
              className={`size-7 fill-current hover:text-yellow-400 ${
                ratingValue > index ? "text-yellow-500" : "text-gray-300"
              }`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M10 15l-5.878 3.09 1.122-6.545L.368 6.91l6.564-.955L10 0l3.068 5.955 6.564.955-4.878 4.635 1.122 6.545z" />
            </svg>
          ))}
        </div>
        <span className="text-gray-600 text-md ml-2">{ratingValue} de 5</span>
      </div>
    </div>
  );
};

export default Rating;
