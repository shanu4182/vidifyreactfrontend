import axios from "axios";
import API from "./Api";

const toggleLikeDislike = async (token, video_id, action) => {
  try {
    const response = await axios.post(
      API.toggleLikeDislike,
      { video_id, action },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error toggling like/dislike:", error);
    throw error;
  }
};

export { toggleLikeDislike };
