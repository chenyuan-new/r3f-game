import { OrbitControls } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { Lights } from "./components/Lights";
import { Level } from "./components/Level";
import { Player } from "./components/Player";
import { useAtomValue } from "jotai";
import { blockCountAtom } from "./atoms/atom";
import { Effects } from "./components/Effects";
// import { Perf } from "r3f-perf";

function App() {
  const blockCount = useAtomValue(blockCountAtom);
  return (
    <>
      {/* <Perf /> */}
      <color args={["#252731"]} attach="background" />
      <ambientLight intensity={5} />
      <OrbitControls />
      <Physics>
        <Lights />
        <Level count={blockCount} />
        <Player />
      </Physics>
      <Effects />
    </>
  );
}

export default App;
