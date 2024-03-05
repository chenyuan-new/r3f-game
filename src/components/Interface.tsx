import { useKeyboardControls } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { getDefaultStore, useAtomValue, useSetAtom } from "jotai";
import { startTimeAtom, endTimeAtom, phaseAtom } from "../atoms/atom";
import { addEffect } from "@react-three/fiber";

export function Interface() {
  const timeRef = useRef<HTMLDivElement>(null);

  const forward = useKeyboardControls((state) => state.forward);
  const backward = useKeyboardControls((state) => state.backward);
  const left = useKeyboardControls((state) => state.left);
  const right = useKeyboardControls((state) => state.right);
  const jump = useKeyboardControls((state) => state.jump);
  const phase = useAtomValue(phaseAtom);
  const setPhase = useSetAtom(phaseAtom);

  useEffect(() => {
    const unSubEffect = addEffect(() => {
      const store = getDefaultStore();
      let time = 0;
      if (!timeRef.current) return;
      const phase = store.get(phaseAtom);
      const startTime = store.get(startTimeAtom);
      const endTime = store.get(endTimeAtom);

      if (phase === "running") {
        time = Date.now() - startTime;
      }
      if (phase === "ended") {
        time = endTime - startTime;
      }

      time /= 1000;
      timeRef.current.textContent = time.toFixed(2);
    });

    return unSubEffect;
  }, []);

  return (
    <div className="fixed h-full w-full top-0 left-0 pointer-events-none">
      <div
        ref={timeRef}
        className="absolute top-[15%] left-0 w-full text-center text-[6vh] text-white bg-[#00000033]"
      >
        0.00
      </div>
      {phase === "ended" && (
        <div
          onClick={() => setPhase("ready")}
          className="absolute top-[40%] left-0 w-full flex justify-center cursor-pointer pointer-events-auto text-8xl text-white bg-[#00000033] font-sans"
        >
          restart
        </div>
      )}
      <div className="absolute bottom-[10%] w-full flex justify-center flex-col items-center">
        <div
          className={
            "w-16 h-16 m-1 border-2 border-solid border-[#ffffff] " +
            (forward ? "bg-[#ffffff99]" : "bg-[#ffffff44] ")
          }
        ></div>
        <div className="flex justify-center">
          {[left, backward, right].map((value, idx) => (
            <div
              className={
                "w-16 h-16 m-1 border-2 border-solid border-[#ffffff] " +
                (value ? "bg-[#ffffff99]" : "bg-[#ffffff44]")
              }
              key={idx}
            ></div>
          ))}
        </div>
        <div
          className={
            "w-52 h-16 m-1 border-2 border-solid border-[#ffffff] " +
            (jump ? "bg-[#ffffff99]" : "bg-[#ffffff44] ")
          }
        ></div>
      </div>
    </div>
  );
}
