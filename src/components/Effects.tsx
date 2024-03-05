import { SSR, DepthOfField, EffectComposer } from "@react-three/postprocessing";

export function Effects() {
  return (
    <EffectComposer>
      <SSR
        intensity={0.1}
        thickness={1}
        ior={0.45}
        maxRoughness={1}
        maxDepthDifference={10}
        blurSharpness={10}
        jitter={1}
      />
      <DepthOfField focusDistance={0.01} focalLength={0.2} bokehScale={3} />
    </EffectComposer>
  );
}
