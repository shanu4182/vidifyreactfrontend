import React, { useState, Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import Header from "../components/Header";
import SideNowBar from "../components/SideNowBar";
import LoaderIndicator from './../components/LoaderIndicator';
// Lazy load all route components
const HomeScreen = lazy(() => import("./HomePage/HomeScreen"));
const NotificationScreen = lazy(() => import("./Notification/Notification"));
const ProfileScreen = lazy(() => import("./Profile/ProfileScreen"));
const CategoryVideoScreen = lazy(() => import("./CategoryVideosPage/CategoryVideoScreen"));
const UploadScreen = lazy(() => import("./UploadForm/UploadScreen"));
const MovieScreen = lazy(() => import("./MoviePage/MovieScreen"));
const ShortScreen = lazy(() => import("./ShortsPage/ShortScreen"));
const NormalVideoScreen = lazy(() => import('./NormalVideoPage/NormalVideoScreen'));
const SeriesScreen = lazy(() => import("./SeriesPage/SeriesScreen"));
const EpisodeScreen = lazy(() => import("./SeriesEpisodePage/EpisodeScreen"));
const MovieDetailsPage = lazy(() => import("./MovieDetailsPage/MovieDetailsPage"));
const VideoDetailsScreen = lazy(() => import("./VideoDetailsPage/VideoDetailsScreen"));


function MainScreen() {
    const [isSideBarOpen, setIsSideBarOpen] = useState(false);

    return (
        <>
            <Header isSideBarOpen={isSideBarOpen} setIsSideBarOpen={setIsSideBarOpen} />
            <main className="main">
                {isSideBarOpen && <SideNowBar setIsSideBarOpen={setIsSideBarOpen} isSideBarOpen={isSideBarOpen} />}
                <section className="mainContainer">
                    <Suspense fallback={<LoaderIndicator size={60}/>}>
                        <Routes>
                            <Route path="/*" element={<HomeScreen />} />
                            <Route path="notifications" element={<NotificationScreen />} />
                            <Route path="profile" element={<ProfileScreen />} />
                            <Route path="/vbc/:category" element={<CategoryVideoScreen />} />
                            <Route path="new" element={<UploadScreen />} />
                            <Route path="Movies" element={<MovieScreen />} />
                            <Route path="/short/:id" element={<ShortScreen />} />
                            <Route path="Shorts" element={<ShortScreen />} />

                            <Route path="/videos/:video_id" element={<VideoDetailsScreen />} />
                            <Route path="normalVideo" element={<NormalVideoScreen />} />
                            <Route path="/movie/:movieId" element={<MovieDetailsPage />} />
                            <Route path="Series" element={<SeriesScreen />} />
                            <Route path="/series/:seriesId" element={<EpisodeScreen />} />
                        </Routes>
                    </Suspense>
                </section>
            </main>
        </>
    );
}

export default MainScreen;