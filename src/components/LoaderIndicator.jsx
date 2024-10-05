import React from "react";
import loadingGif from "../images/loading.gif";
export default function LoaderIndicator({ size }) {
  return (
    <div
      style={{
        textAlign: "center",
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        zIndex: 1000,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <img src={loadingGif} alt="Loading..." height={size} />
    </div>
  );
}
