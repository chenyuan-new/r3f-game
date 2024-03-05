import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {
  RigidBody,
  useRapier,
  type RapierRigidBody,
} from "@react-three/rapier";
import { useEffect, useRef } from "react";
import { Vector3 } from "three";
import { derivedPhaseAtom, blockCountAtom, phaseAtom } from "../atoms/atom";
import { useSetAtom, useAtomValue } from "jotai";
export function Player() {
  const body = useRef<RapierRigidBody>(null);
  const [subscribeKeys, getKeys] = useKeyboardControls();
  const { rapier, world } = useRapier();
  // set the camera initial position
  const smoothedCameraPosition = useRef(new Vector3(10, 10, 10));
  const smoothedCameraTarget = useRef(new Vector3());
  const setPhase = useSetAtom(derivedPhaseAtom);
  const blockCount = useAtomValue(blockCountAtom);
  const phase = useAtomValue(phaseAtom);

  useFrame((state, delta) => {
    if (!body.current) return;
    const { forward, backward, left, right } = getKeys();

    const impulse = { x: 0, y: 0, z: 0 };
    const torque = { x: 0, y: 0, z: 0 };

    const impulseStrength = 0.6 * delta;
    const torqueStrength = 0.2 * delta;

    if (forward) {
      impulse.z -= impulseStrength;
      torque.x -= torqueStrength;
    }

    if (right) {
      impulse.x += impulseStrength;
      torque.z -= torqueStrength;
    }

    if (backward) {
      impulse.z += impulseStrength;
      torque.x += torqueStrength;
    }

    if (left) {
      impulse.x -= impulseStrength;
      torque.z += torqueStrength;
    }

    body.current.applyImpulse(impulse, true);
    body.current.applyTorqueImpulse(torque, true);

    /**
     *  Camera
     */
    const bodyPosition = body.current.translation();
    const cameraPosition = new Vector3();
    cameraPosition.copy(bodyPosition);
    cameraPosition.z += 2.25;
    cameraPosition.y += 0.65;

    const cameraTarget = new Vector3();
    cameraTarget.copy(bodyPosition);
    cameraTarget.y += 0.25;

    // use lerp to smooth the motion
    smoothedCameraPosition.current.lerp(cameraPosition, 5 * delta);
    smoothedCameraTarget.current.lerp(cameraTarget, 5 * delta);

    state.camera.position.copy(smoothedCameraPosition.current);
    state.camera.lookAt(smoothedCameraTarget.current);

    if (bodyPosition.z < -(blockCount * 4 + 2)) {
      setPhase("ended");
    }
    if (bodyPosition.y < -40) {
      setPhase("ready");
    }
  });

  useEffect(() => {
    if (phase === "ready" && body.current) {
      body.current.setTranslation({ x: 0, y: 1, z: 0 }, true);
      body.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
      body.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
    }
  }, [phase]);

  useEffect(() => {
    const jump = () => {
      const origin = body.current!.translation();
      origin.y -= 0.31;
      // use raycast to test if it is in the midair
      // it can be done by checking origin.y
      const direction = { x: 0, y: -1, z: 0 };
      const ray = new rapier.Ray(origin, direction);
      const hit = world.castRay(ray, 10, true);

      // if (origin.y < 0.15) {
      if (hit && hit.toi < 0.15) {
        body.current?.applyImpulse({ x: 0, y: 0.5, z: 0 }, true);
      }
    };

    const unSubJump = subscribeKeys(
      (state) => state.jump,
      (value) => {
        if (value) {
          jump();
        }
      }
    );

    const unSubStart = subscribeKeys(() => {
      setPhase("running");
    });

    return () => {
      unSubJump();
      unSubStart();
    };
  }, []);

  return (
    <RigidBody
      ref={body}
      colliders="ball"
      restitution={0.2}
      friction={1}
      linearDamping={0.5}
      angularDamping={0.5}
      position={[0, 1, 0]}
    >
      <mesh castShadow>
        <icosahedronGeometry args={[0.3, 1]} />
        <meshStandardMaterial flatShading color="mediumpurple" />
      </mesh>
    </RigidBody>
  );
}
