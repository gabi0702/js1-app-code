import React, { useEffect, useState } from "react";
import "../App.css";

const Card = (props) => {
  const cardUrl = props.card;
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    fetch(cardUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const objectUrl = URL.createObjectURL(blob);
        setImageUrl(cardUrl);
      });
    console.log(imageUrl);
  }, []);
  return <div className="card-ui-sizes">{imageUrl}</div>;
};

export default Card;
