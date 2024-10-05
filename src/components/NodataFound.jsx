import React from 'react';
import emptyImage from "../images/oops.gif"; 

const NodataFound = () => {
    return (
        <div
        className="image"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <img src={emptyImage} alt="No videos found" height={400} />
      </div>
    );
}

export default NodataFound;
