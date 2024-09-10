declare module "react-rating" {
  import React from "react";

  interface RatingProps {
    initialRating?: number;
    onChange?: (value: number) => void;
    emptySymbol?: React.ReactNode;
    fullSymbol?: React.ReactNode;
    stop?: number;
    [key: string]: any;
  }

  const Rating: React.FC<RatingProps>;

  export default Rating;
}
