import React from "react";
import { IoHome } from "react-icons/io5";
import {
  GiFire,
  GiMusicSpell,
  GiFilmProjector,
  GiSportMedal,
  GiBookCover,
  GiCookingPot,
  GiPodium,
  GiGlobe,
  GiBrain,
  GiMeditation,
} from "react-icons/gi";
import {
  FaGamepad,
  FaRegLaugh,
  FaPaintBrush,
  FaChalkboardTeacher,
  FaTheaterMasks,
  FaPodcast,
  FaMicroscope,
  FaRegNewspaper,
  FaSkull,
  FaPlusCircle,
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { PiFilmReelFill } from "react-icons/pi";
import {
  MdOutlineFitnessCenter,
  MdTravelExplore,
  MdOutlinePhotoCamera,
} from "react-icons/md";
import {
  BsFillFileEarmarkPlayFill,
  BsFillCameraVideoFill,
} from "react-icons/bs";
import { IoBodyOutline } from "react-icons/io5";
import { BiNews, BiHealth } from "react-icons/bi";
import { ImBooks } from "react-icons/im";
import { AiOutlineRobot } from "react-icons/ai";
import { LiaFileVideoSolid } from "react-icons/lia";
import { RiPlayListAddLine } from "react-icons/ri";

function SideNowBar({ setIsSideBarOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: <IoHome size={20} />, name: "Home", link: "/" },
    { icon: <GiFire size={20} />, name: "Trending", link: "/trending" },
    { icon: <LiaFileVideoSolid size={20} />, name: "Videos", link: "/normalVideo" },
    { icon: <GiFilmProjector size={20} />, name: "Movies", link: "/Movies" },
    { icon: <RiPlayListAddLine size={20} />, name: "Series", link: "/Series" },
    { icon: <PiFilmReelFill size={20} />, name: " Shorts", link: "/Shorts" },
    { icon: <FaPlusCircle size={20} />, name: "New", link: "/new" },
  ];

  const categoryItems = [
    {
      icon: <GiMusicSpell size={20} />,
      name: "Music",
      link: "/vbc/music",
    },
    {
      icon: <FaGamepad size={20} />,
      name: "Gaming",
      link: "/vbc/gaming",
    },
    {
      icon: <FaRegLaugh size={20} />,
      name: "Comedy",
      link: "/vbc/comedy",
    },
    {
      icon: <GiSportMedal size={20} />,
      name: "Sports",
      link: "/vbc/sports",
    },
    {
      icon: <GiBookCover size={20} />,
      name: "Education",
      link: "/vbc/education",
    },
    {
      icon: <GiCookingPot size={20} />,
      name: "Cooking",
      link: "/vbc/cooking",
    },
    {
      icon: <MdOutlineFitnessCenter size={20} />,
      name: "Fitness",
      link: "/vbc/fitness",
    },
    {
      icon: <FaPaintBrush size={20} />,
      name: "Art",
      link: "/vbc/art",
    },
    {
      icon: <FaChalkboardTeacher size={20} />,
      name: "Tutorials",
      link: "/vbc/tutorials",
    },
    {
      icon: <GiPodium size={20} />,
      name: "Podcasts",
      link: "/vbc/podcasts",
    },
    {
      icon: <FaTheaterMasks size={20} />,
      name: "Drama",
      link: "/vbc/drama",
    },
    {
      icon: <FaSkull size={20} />,
      name: "Horror",
      link: "/vbc/horror",
    },
    {
      icon: <GiGlobe size={20} />,
      name: "Travel",
      link: "/vbc/travel",
    },
    {
      icon: <MdOutlinePhotoCamera size={20} />,
      name: "Photography",
      link: "/vbc/photography",
    },
    {
      icon: <GiMeditation size={20} />,
      name: "Meditation",
      link: "/vbc/meditation",
    },
    {
      icon: <BsFillFileEarmarkPlayFill size={20} />,
      name: "Unboxing",
      link: "/vbc/unboxing",
    },
    {
      icon: <GiBrain size={20} />,
      name: "Science",
      link: "/vbc/science",
    },
    {
      icon: <BiNews size={20} />,
      name: "News",
      link: "/vbc/news",
    },
    {
      icon: <ImBooks size={20} />,
      name: "Books",
      link: "/vbc/books",
    },
    {
      icon: <AiOutlineRobot size={20} />,
      name: "Tech",
      link: "/vbc/tech",
    },
    {
      icon: <FaPodcast size={20} />,
      name: "Podcasts",
      link: "/vbc/podcasts",
    },
    {
      icon: <BsFillCameraVideoFill size={20} />,
      name: "Documentaries",
      link: "/vbc/documentaries",
    },
    {
      icon: <FaMicroscope size={20} />,
      name: "Biology",
      link: "/vbc/biology",
    },
    {
      icon: <IoBodyOutline size={20} />,
      name: "Health",
      link: "/vbc/health",
    },
    {
      icon: <GiFilmProjector size={20} />,
      name: "Animation",
      link: "/vbc/animation",
    },
    {
      icon: <FaPodcast size={20} />,
      name: "ASMR",
      link: "/vbc/asmr",
    },
    {
      icon: <BiHealth size={20} />,
      name: "Lifestyle",
      link: "/vbc/lifestyle",
    },
    {
      icon: <MdTravelExplore size={20} />,
      name: "Adventure",
      link: "/vbc/adventure",
    },
    {

      icon: <FaRegNewspaper size={20} />,
      name: "Reviews",
      link: "/vbc/reviews",
    },
  ];

  function NavItem({ icon, name, link }) {
    const isActive = location.pathname === link;
    return (
      <div
        className={`nav-icon-content ${isActive ? "active" : ""}`}
        onClick={() => {
          navigate(link);
          if (window.innerWidth < 600) {
            setIsSideBarOpen(false);
          }
        }}
      >
        <span className="nav-icon">{icon}</span>
        <span className="nav-icon-name">{name}</span>
      </div>
    );
  }

  return (
    <aside className="side-now-bar">
      {menuItems.map((item, index) => (
        <NavItem
          key={index}
          icon={item.icon}
          name={item.name}
          link={item.link}
        />
      ))}

      <hr />

      {categoryItems.map((item, index) => (
        <NavItem
          key={index}
          icon={item.icon}
          name={item.name}
          link={item.link}
        />
      ))}
    </aside>
  );
}

export default SideNowBar;

