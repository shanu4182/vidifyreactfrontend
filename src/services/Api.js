
const serverUrl = "http://localhost:5000";

// const serverUrl = "https://videoserve.chaithraajana.com";
// const serverUrl = "https://nusaibavps.atozasindia.in";

const API = {
  main: serverUrl + "/",
  login: serverUrl + "/login",
  register: serverUrl + "/register",
  verifyOtp: serverUrl + "/verify-otp",
  videos: serverUrl + "/videos",
  getMovies: serverUrl + "/getMovies",
  languages: serverUrl + "/getLanguages",
  getCategories: serverUrl + "/getCategories",
  addVideo: serverUrl + "/addVideo",
  addMovie: serverUrl + "/addMovie",
  addShorts: serverUrl + "/addShorts",
  getShorts: serverUrl + "/getShorts",
  getProfile: serverUrl + "/getProfile",
  getMyProfile: serverUrl + "/getMyProfile",
  updateProfile: serverUrl + "/profile",
  getCategoryByName: serverUrl + "/getCategoryByName",
  toggleLikeDislike: serverUrl + "/toggleLikeDislike",
  getNormalVideos: serverUrl + "/getNormalVideos",
  getVideosService: serverUrl + "/getVideosService",
  getUserContent : serverUrl+ "/getUserContent",
  deleteProfileImage: serverUrl + "/profile/image",
  getSeriesVideo: serverUrl + "/getSeriesVideo",
  getSeriesSeasons: serverUrl + "/series",
  addSeries: serverUrl + "/addSeries",
  addEpisode: serverUrl + "/series/:seriesId/episodes",
  getMovieById: serverUrl + "/movies",

  getFollow : serverUrl + "/follow/:userId/status",
  follow: serverUrl + "/follow",
  unfollow: serverUrl + "/unfollow",
  randomCarousel: serverUrl + "/carousel",



};

export default API;