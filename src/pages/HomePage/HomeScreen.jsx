import React, { useState, useEffect, useCallback, useRef, useContext } from "react";
import axios from "axios";
import API from "./../../services/Api";
import VideoCard from "../../components/VideoCards";
import MovieCard from "../../components/MovieCards";

import loadingGif from "../../images/loading.gif";
import { AuthContext } from "../../contexts/AuthContext";
import CarouselComponent from "./CarouselComponent";
import ShortsCards from "../../components/ShortsCard";

const HomeScreen = () => {
  const { token } = useContext(AuthContext);

  // Refs to store pagination and other data across re-renders
  const videoPagesRef = useRef([]);
  const totalCountsRef = useRef({
    normal: 0,
    short: 0,
    movie: 0,
    series: 0,
  });
  const hasMoreRef = useRef({
    normal: true,
    short: true,
    movie: true,
    series: true,
  });
  const pageRef = useRef(1);

  // State for loading indication
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Loading ref to avoid re-renders for loading state
  const loadingRef = useRef(false);

  // Observer reference for the intersection observer
  const observerRef = useRef(null);

  // Video pages state
  const [videoPages, setVideoPages] = useState(videoPagesRef.current);

  // Fetch videos function
  const fetchVideos = useCallback(async () => {
    if (loadingRef.current || !Object.values(hasMoreRef.current).some(Boolean)) return;

    loadingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(API.videos, {
        params: { page: pageRef.current },
        headers: { Authorization: `Bearer ${token}` },
      });

      // Add new video pages
      videoPagesRef.current = [
        ...videoPagesRef.current,
        {
          page: pageRef.current,
          normal: response.data.normal?.videos || [],
          short: response.data.short?.videos || [],
          movie: response.data.movie?.videos || [],
          series: response.data.series?.videos || [],
        },
      ];
      setVideoPages([...videoPagesRef.current]);

      // Update total counts and hasMore flags
      totalCountsRef.current = {
        normal: response.data.normal?.totalCount || 0,
        short: response.data.short?.totalCount || 0,
        movie: response.data.movie?.totalCount || 0,
        series: response.data.series?.totalCount || 0,
      };

      hasMoreRef.current = {
        normal: response.data.normal?.hasMore || false,
        short: response.data.short?.hasMore || false,
        movie: response.data.movie?.hasMore || false,
        series: response.data.series?.hasMore || false,
      };

      pageRef.current += 1;
    } catch (error) {
      console.error("Error fetching videos:", error);
      setError("Failed to load videos. Please try again.");
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [token]);

  // Set up the intersection observer
  useEffect(() => {
    if (loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && Object.values(hasMoreRef.current).some(Boolean)) {
          fetchVideos();
        }
      },
      { threshold: 0.5 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
      observer.disconnect(); // Ensures the observer is properly cleaned up
    };
  }, [fetchVideos, loading]);

  // Fetch the first page on initial load if no videos exist
  useEffect(() => {
    if (videoPagesRef.current.length === 0) {
      fetchVideos();
    }
  }, [fetchVideos]);

  return (
    <>
      <CarouselComponent />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {videoPages.map((pageData) => (
        <div key={`page-${pageData.page}`}>
          <h3>
            Normal Videos ({pageData.normal.length}/{totalCountsRef.current.normal})
          </h3>
          <VideoCard videos={pageData.normal} />

          <h3>
            Movies ({pageData.movie.length}/{totalCountsRef.current.movie})
          </h3>
          <MovieCard movies={pageData.movie} />

          <h3>
            Shorts ({pageData.short.length}/{totalCountsRef.current.short})
          </h3>
          <ShortsCards shorts={pageData.short} /> {/* Corrected the prop name here */}

          <h3>
            Series ({pageData.series.length}/{totalCountsRef.current.series})
          </h3>
          <VideoCard videos={pageData.series} />
        </div>
      ))}

      <div
        style={{ textAlign: "center", marginBottom: "20px" }}
        ref={observerRef}
      >
        {!Object.values(hasMoreRef.current).some(Boolean) ? (
          <p>No more videos to load</p>
        ) : (
          <img src={loadingGif} alt="Loading..." height={50} />
        )}
      </div>
    </>
  );
};

export default HomeScreen;
