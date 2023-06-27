import React, { Suspense, lazy } from "react";
import "./App.css";
import logoMovie from "./asset/logo-movie.png";

const Main = lazy(() => import("./components/Main"));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <header>
          <img src={logoMovie} alt="MoviePitch" />
          <a href="/">
            <span>Movie</span>Pitch
          </a>
        </header>
        <Main />
        <footer>&copy; 2023 MoviePitch All rights reserved</footer>
      </div>
    </Suspense>
  );
}

export default App;
