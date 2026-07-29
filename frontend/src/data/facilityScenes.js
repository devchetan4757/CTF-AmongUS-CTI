
export const FACILITY_SCENES = {
  cafeteria: {
    id: "cafeteria",
    name: "Cafeteria",
    missionId: "cafeteria",
    bg: "/images/facility-cafeteria.png",
    bgLandscape: "/images/facility-cafeteria-landscape.png",
    // Percent-based position over the laptop on the back-left table.
    hotspot: { x: "27%", y: "31%", label: "Linux Terminal", icon: "terminal" },
    arrows: {
      down: "admin",
      left: "laboratory",
    },
  },
  admin: {
    id: "admin",
    name: "Admin Office",
    missionId: "admin",
    bg: "/images/facility-admin.png",
    bgLandscape: "/images/facility-admin-landscape.png",
    hotspot: { x: "50%", y: "45%", label: "Site Terminal", icon: "site" },
    // Admin branches down into storage. Up still returns to cafeteria.
    arrows: { up: "cafeteria", down: "storage" },
  },
  laboratory: {
    id: "laboratory",
    name: "Laboratory",
    // Was "medbay" -- renamed to match the real backend mission id
    // ("laboratory") so the hotspot + LabTerminal puzzle actually load.
    missionId: "laboratory",
    bg: "/images/facility-medbay.png",
    bgLandscape: "/images/facility-medbay-landscape.png",
    hotspot: { x: "50%", y: "45%", label: "Lab Terminal", icon: "lab" },
    // Laboratory branches left into security. Right still returns to
    // cafeteria.
    arrows: { right: "cafeteria", left: "security" },
  },
  security: {
    id: "security",
    name: "Security",
    missionId: "security",
    bg: "/images/facility-security.png",
    bgLandscape: "/images/facility-security-landscape.png",
    hotspot: { x: "50%", y: "45%", label: "Security Panel", icon: "security" },
    // right now continues the loop into storage; down still offers a
    // direct shortcut back to cafeteria.
    arrows: { down: "storage", right: "laboratory" },
  },
  storage: {
    id: "storage",
    name: "Storage",
    missionId: "storage",
    bg: "/images/facility-storage.png",
    bgLandscape: "/images/facility-storage-landscape.png",
    hotspot: { x: "50%", y: "45%", label: "Storage Crate", icon: "storage" },
    // left now continues the loop back into security; up still
    // returns to admin, where storage is originally reached from.
    arrows: { left: "security", up: "admin" },
  },
};

export const DEFAULT_SCENE_ID = "cafeteria";
