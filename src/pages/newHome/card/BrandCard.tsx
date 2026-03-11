import React from "react";
import "./BrandCard.scss";
import brandHead from "/assets/icons/brand-head.svg";
import InfiniteSlider from "../../../components/infiniteSlider/InfiniteSlider";
const BrandCard: React.FC = () => {
  const brands = [
    "Netflix",
    "Spotify",
    "Apple",
    "Nike",
    "Adidas",
    "Samsung",
    "Google",
    "Amazon",
    "Microsoft",
    "Tesla",
  ];
  return (
    <div className="brand-card">
      <div className="brand-title">
        <h2>Les marques partenaires</h2>
        <img src={brandHead} alt="Brand Head" />
      </div>
      <div className="brand-main">
        <InfiniteSlider brandsArray={brands} />
      </div>
    </div>
  );
};

export default BrandCard;
