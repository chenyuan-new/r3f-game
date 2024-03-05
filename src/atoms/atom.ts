import { atom } from "jotai";

export const startTimeAtom = atom(0);
export const endTimeAtom = atom(0);
type PhaseType = "ready" | "ended" | "running";
export const phaseAtom = atom<PhaseType>("ready");
export const blockCountAtom = atom(10);

export const derivedPhaseAtom = atom(
  (get) => get(phaseAtom),
  (get, set, payload: PhaseType) => {
    switch (payload) {
      case "running": {
        if (get(phaseAtom) === "ready") {
          set(startTimeAtom, Date.now());
          set(phaseAtom, "running");
        }
        break;
      }
      case "ended": {
        if (get(phaseAtom) === "running") {
          set(endTimeAtom, Date.now());
          set(phaseAtom, "ended");
        }
        break;
      }

      case "ready": {
        if (get(phaseAtom) !== "ready") {
          set(phaseAtom, "ready");
          set(startTimeAtom, 0);
          set(endTimeAtom, 0);
        }
        break;
      }
    }
  }
);
