import React from "react";
import { Spinner } from "react-bootstrap";

const Loading = ({ size = 100 }) => {
  return (
    <div
      style={{
        display: "flex",
        alignitme: "center",
        height: "100%",
        width: "100%",
        justifyContent: "center",
      }}
    >
      <Spinner
        style={{
          width: size,
          height: size,
        }}
        animation="border"
      />
    </div>
  );
};

export default Loading;
