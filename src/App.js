import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import MainScreen from "./pages/MainScreen";
import { AuthContext } from "./contexts/AuthContext";
import { useContext } from "react";
import AuthScreen from "./pages/AuthPage/AuthScreen";
import LoaderIndicator from "./components/LoaderIndicator";
import "./components/componentstyles.css";

function App() {
  const { isLoggedIn, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <LoaderIndicator size={60}/>; // Or a more sophisticated loading component
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/*"
          element={isLoggedIn ? <MainScreen /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/" /> : <AuthScreen />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;