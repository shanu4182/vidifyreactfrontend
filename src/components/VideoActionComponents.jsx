import React from "react";

import {
  AiOutlineLike,
  AiFillLike,
  AiOutlineDislike,
  AiFillDislike,
  AiOutlineComment,
} from "react-icons/ai";
import { FaShareAlt, FaBookmark,FaEye  } from "react-icons/fa";
export default function VideoActionComponents() {
  return (
    <div className="VideoActionComponents">
      <span className="videoActionIconAndValue">
        <AiOutlineLike size={25} />
        <span>21k</span>
      </span>
      <span className="videoActionIconAndValue">
        <AiFillDislike size={25} />
        <span>0</span>
      </span>
      <span className="videoActionIconAndValue">
        <AiOutlineComment size={25} />
        <span>500</span>
      </span>
      <span className="videoActionIconAndValue">
        <FaEye  size={25} />
        <span>500</span>
      </span>
      <span className="videoActionIconAndValue">
        <FaShareAlt size={25} />
      </span>
      <span className="videoActionIconAndValue">
        <FaBookmark size={25} />
      </span>
    </div>
  );
}
