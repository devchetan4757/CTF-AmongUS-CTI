import { Route, Routes, useLocation } from "react-router-dom";
import GameHUD from "./components/GameHUD.jsx";
import PageTransition from "./components/PageTransition.jsx";
import { GameProvider } from "./state/GameContext.jsx";
import Home from "./pages/Home.jsx";
import Story from "./pages/Story.jsx";
import FacilityMap from "./pages/FacilityMap.jsx";
import Mission from "./pages/Mission.jsx";
import EvidenceBoard from "./pages/EvidenceBoard.jsx";
import FinalAccusation from "./pages/FinalAccusation.jsx";
import Victory from "./pages/Victory.jsx";

// Game flow: Home -> Story -> Facility Map -> Missions (any order) ->
// Evidence Board -> Final Accusation -> Victory
//
// There's no top navbar strip anymore -- GameHUD floats individual
// pill buttons directly over the page instead. It's hidden on Home so
// the landing screen stays completely bare (background image + title
// + one button, nothing else).
export default function App() {
  const location = useLocation();
  const showHud = location.pathname !== "/";

  return (
    <GameProvider>
      {showHud && <GameHUD />}
      <PageTransition>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/story" element={<Story />} />
          <Route path="/facility" element={<FacilityMap />} />
          <Route path="/mission/:missionId" element={<Mission />} />
          <Route path="/evidence" element={<EvidenceBoard />} />
          <Route path="/final-accusation" element={<FinalAccusation />} />
          <Route path="/victory" element={<Victory />} />
        </Routes>
      </PageTransition>
    </GameProvider>
  );
}
