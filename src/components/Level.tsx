import { useMemo } from "react";
import {
  BlockAxe,
  BlockEnd,
  BlockLimbo,
  BlockSpinner,
  BlockStart,
  Bounds,
} from "./Blocks";

export function Level({
  count = 5,
  types = [BlockSpinner, BlockLimbo, BlockAxe],
  // seed = 0,
}) {
  const blocks = useMemo(() => {
    const blocks = [];
    for (let i = 0; i < count; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      blocks.push(type);
    }
    return blocks;
  }, [count, types]);

  return (
    <>
      <BlockStart position={[0, 0, 0]} />
      {blocks.map((Type, index) => (
        <Type key={index} position={[0, 0, -(index + 1) * 4]} />
      ))}
      <BlockEnd position={[0, 0, -(count + 1) * 4]} />
      <Bounds length={count + 2} />
    </>
  );
}
