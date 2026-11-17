import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Sky } from 'three/addons/objects/Sky.js';
import type { Aspect, PlanetName } from '../../engines/astronomy/types';
import type { CelestialPosition } from '../../engines/astronomy/liveSky';

interface SkySphere3DProps {
  objects: CelestialPosition[];
  aspects: Aspect[];
  selectedPlanet: PlanetName | null;
  zoom: number;
  showAspects: boolean;
  planetLabels: Record<PlanetName, string>;
  aspectLabels: Record<Aspect['type'], string>;
  ariaLabel: string;
  interactionHint: string;
  onSelectPlanet: (planet: PlanetName) => void;
  onRendererError: () => void;
}

const SKY_RADIUS = 96;
const ASPECT_COLORS: Record<Aspect['type'], string> = {
  conjunction: '#f4cf67',
  sextile: '#62a8ff',
  square: '#ff596f',
  trine: '#56e39a',
  opposition: '#ff596f',
};

const PLANET_SIZE: Record<PlanetName, number> = {
  sun: 1.65,
  moon: 1.2,
  mercury: 0.8,
  venus: 1.05,
  mars: 0.9,
  jupiter: 1.35,
  saturn: 1.25,
  uranus: 1.0,
  neptune: 1.0,
  pluto: 0.75,
};

function horizonVector(azimuth: number, altitude: number, radius = SKY_RADIUS) {
  const az = THREE.MathUtils.degToRad(azimuth);
  const alt = THREE.MathUtils.degToRad(altitude);
  return new THREE.Vector3(
    Math.sin(az) * Math.cos(alt) * radius,
    Math.sin(alt) * radius,
    -Math.cos(az) * Math.cos(alt) * radius
  );
}

function makeLabel(text: string, color = '#f8fafc') {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Unable to create a WebGL sky label.');
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.font = '600 52px system-ui, sans-serif';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.shadowColor = '#050914';
  context.shadowBlur = 12;
  context.fillStyle = color;
  context.fillText(text, canvas.width / 2, canvas.height / 2, canvas.width - 12);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
    sizeAttenuation: true,
  });
  return new THREE.Sprite(material);
}

function makeGlow(color: THREE.ColorRepresentation) {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Unable to create a WebGL planet glow.');
  const gradient = context.createRadialGradient(64, 64, 2, 64, 64, 62);
  gradient.addColorStop(0, new THREE.Color(color).getStyle());
  gradient.addColorStop(0.18, new THREE.Color(color).getStyle().replace('rgb', 'rgba').replace(')', ', 0.65)'));
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  context.fillStyle = gradient;
  context.fillRect(0, 0, 128, 128);
  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  return new THREE.Sprite(material);
}

function addHorizonAndGrid(group: THREE.Group) {
  const horizonPoints: THREE.Vector3[] = [];
  for (let degree = 0; degree <= 360; degree += 2) {
    horizonPoints.push(horizonVector(degree, 0, SKY_RADIUS * 0.995));
  }
  const horizon = new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints(horizonPoints),
    new THREE.LineBasicMaterial({ color: '#e4bd5e', transparent: true, opacity: 0.9 })
  );
  group.add(horizon);

  for (const altitude of [30, 60]) {
    const ringRadius = SKY_RADIUS * Math.cos(THREE.MathUtils.degToRad(altitude));
    const centerY = SKY_RADIUS * Math.sin(THREE.MathUtils.degToRad(altitude));
    const points: THREE.Vector3[] = [];
    for (let degree = 0; degree < 360; degree += 3) {
      const radians = THREE.MathUtils.degToRad(degree);
      points.push(new THREE.Vector3(
        ringRadius * Math.sin(radians),
        centerY,
        -ringRadius * Math.cos(radians)
      ));
    }
    group.add(new THREE.LineLoop(
      new THREE.BufferGeometry().setFromPoints(points),
      new THREE.LineBasicMaterial({ color: '#94a3b8', transparent: true, opacity: 0.2 })
    ));
  }

  for (let azimuth = 0; azimuth < 360; azimuth += 30) {
    const meridianPoints: THREE.Vector3[] = [];
    for (let altitude = 0; altitude <= 90; altitude += 3) {
      meridianPoints.push(horizonVector(azimuth, altitude, SKY_RADIUS * 0.995));
    }
    group.add(new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(meridianPoints),
      new THREE.LineBasicMaterial({
        color: azimuth % 90 === 0 ? '#d4af37' : '#8291ad',
        transparent: true,
        opacity: azimuth % 90 === 0 ? 0.28 : 0.1,
      })
    ));
  }

  const cardinalLabels: [string, number][] = [['N', 0], ['E', 90], ['S', 180], ['W', 270]];
  cardinalLabels.forEach(([text, azimuth]) => {
    const label = makeLabel(text, '#ffe08a');
    label.position.copy(horizonVector(azimuth, 2, SKY_RADIUS * 1.04));
    label.scale.set(4.5, 1.2, 1);
    group.add(label);
  });

  const lowerHemisphere = new THREE.Mesh(
    new THREE.SphereGeometry(SKY_RADIUS * 0.99, 48, 24, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2),
    new THREE.MeshBasicMaterial({
      color: '#101a32',
      transparent: true,
      opacity: 0.1,
      side: THREE.BackSide,
      depthWrite: false,
    })
  );
  group.add(lowerHemisphere);
}

function addStarField(group: THREE.Group, objects: CelestialPosition[], sunAltitude: number) {
  const stars = objects.filter((object) => object.kind === 'star');
  const positions = new Float32Array(stars.length * 3);
  const colors = new Float32Array(stars.length * 3);
  const sizes = new Float32Array(stars.length);
  const nightFactor = THREE.MathUtils.clamp((-sunAltitude + 2) / 18, 0.04, 1);
  stars.forEach((star, index) => {
    const point = horizonVector(star.azimuth, star.altitude, SKY_RADIUS * 0.985);
    positions.set([point.x, point.y, point.z], index * 3);
    const color = new THREE.Color(star.color);
    colors.set([color.r, color.g, color.b], index * 3);
    sizes[index] = THREE.MathUtils.clamp(1.15 - star.magnitude * 0.12, 0.18, 1.25);
  });

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  const points = new THREE.Points(
    geometry,
    new THREE.PointsMaterial({
      size: 0.75,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: nightFactor,
      depthWrite: false,
    })
  );
  group.add(points);
}

function addPlanet(
  group: THREE.Group,
  object: CelestialPosition,
  planet: PlanetName,
  label: string,
  selected: boolean
) {
  const position = horizonVector(object.azimuth, object.altitude, SKY_RADIUS * 0.985);
  const color = new THREE.Color(object.color);
  const size = PLANET_SIZE[planet];
  const body = new THREE.Mesh(
    new THREE.SphereGeometry(size, 32, 24),
    new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: planet === 'sun' ? 1.25 : 0.18,
      roughness: 0.72,
      metalness: 0.04,
    })
  );
  body.position.copy(position);
  body.userData.planet = planet;
  body.userData.pickable = true;
  group.add(body);

  const glow = makeGlow(color);
  glow.position.copy(position);
  glow.scale.set(size * (planet === 'sun' ? 13 : 7), size * (planet === 'sun' ? 13 : 7), 1);
  group.add(glow);

  if (selected) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(size * 1.9, 0.09, 8, 48),
      new THREE.MeshBasicMaterial({ color: '#fff2b0', transparent: true, opacity: 0.95 })
    );
    ring.position.copy(position);
    ring.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), position.clone().normalize());
    group.add(ring);
  }

  const text = makeLabel(label);
  text.position.copy(position).add(new THREE.Vector3(0, size * 2.8, 0));
  text.scale.set(7.5, 1.9, 1);
  group.add(text);
  return position;
}

function addAspects(
  group: THREE.Group,
  positions: Map<PlanetName, THREE.Vector3>,
  aspects: Aspect[]
) {
  aspects.forEach((aspect) => {
    const first = positions.get(aspect.planet1);
    const second = positions.get(aspect.planet2);
    if (!first || !second) return;
    const midpointDirection = first.clone().add(second);
    if (midpointDirection.lengthSq() < 1e-6) {
      const axis = Math.abs(first.y) < SKY_RADIUS * 0.9
        ? new THREE.Vector3(0, 1, 0)
        : new THREE.Vector3(1, 0, 0);
      midpointDirection.copy(first).cross(axis);
    }
    const middle = midpointDirection.normalize().multiplyScalar(SKY_RADIUS * 1.008);
    const curve = new THREE.QuadraticBezierCurve3(first, middle, second);
    const line = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(curve.getPoints(32)),
      new THREE.LineBasicMaterial({
        color: ASPECT_COLORS[aspect.type],
        transparent: true,
        opacity: 0.76,
        depthWrite: false,
      })
    );
    line.renderOrder = 2;
    group.add(line);
  });
}

function disposeGroup(group: THREE.Group) {
  group.traverse((object) => {
    if (object instanceof THREE.Mesh || object instanceof THREE.Points || object instanceof THREE.Line) {
      object.geometry.dispose();
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      materials.forEach((material) => {
        if ('map' in material && material.map) material.map.dispose();
        material.dispose();
      });
    } else if (object instanceof THREE.Sprite) {
      object.material.map?.dispose();
      object.material.dispose();
    }
  });
}

export function SkySphere3D({
  objects,
  aspects,
  selectedPlanet,
  zoom,
  showAspects,
  planetLabels,
  aspectLabels,
  ariaLabel,
  interactionHint,
  onSelectPlanet,
  onRendererError,
}: SkySphere3DProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<THREE.Group | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const skyRef = useRef<Sky | null>(null);
  const onSelectRef = useRef(onSelectPlanet);
  const yawRef = useRef(0);
  const pitchRef = useRef(0);
  const dragRef = useRef<{ x: number; y: number; moved: boolean } | null>(null);

  useEffect(() => {
    onSelectRef.current = onSelectPlanet;
  }, [onSelectPlanet]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    } catch (error) {
      console.error('Unable to initialize the WebGL sky renderer.', error);
      onRendererError();
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.setClearColor('#030713', 1);
    host.appendChild(renderer.domElement);
    renderer.domElement.className = 'block h-full w-full touch-none cursor-grab active:cursor-grabbing';
    renderer.domElement.setAttribute('aria-label', 'Interactive 3D celestial sphere');

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#030713');
    const skyDome = new Sky();
    skyDome.scale.setScalar(450_000);
    skyDome.material.uniforms['turbidity'].value = 8;
    skyDome.material.uniforms['rayleigh'].value = 2.2;
    skyDome.material.uniforms['mieCoefficient'].value = 0.006;
    scene.add(skyDome);
    const camera = new THREE.PerspectiveCamera(68, 1, 0.1, 500);
    camera.rotation.order = 'YXZ';
    camera.position.set(0, 0, 0);
    const content = new THREE.Group();
    scene.add(content);
    scene.add(new THREE.HemisphereLight('#a9c7ff', '#17152a', 1.4));
    const keyLight = new THREE.DirectionalLight('#fff0cb', 2.5);
    keyLight.position.set(-20, 35, 18);
    scene.add(keyLight);

    contentRef.current = content;
    cameraRef.current = camera;
    skyRef.current = skyDome;

    const updateSize = () => {
      const rect = host.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      renderer.setSize(rect.width, rect.height, false);
      camera.aspect = rect.width / rect.height;
      camera.updateProjectionMatrix();
    };
    updateSize();

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0 && event.pointerType !== 'touch') return;
      dragRef.current = { x: event.clientX, y: event.clientY, moved: false };
      renderer.domElement.setPointerCapture(event.pointerId);
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!dragRef.current) return;
      const dx = event.clientX - dragRef.current.x;
      const dy = event.clientY - dragRef.current.y;
      if (Math.abs(dx) + Math.abs(dy) > 2) dragRef.current.moved = true;
      dragRef.current.x = event.clientX;
      dragRef.current.y = event.clientY;
      yawRef.current += dx * 0.0045;
      pitchRef.current = THREE.MathUtils.clamp(pitchRef.current + dy * 0.0045, -Math.PI * 0.49, Math.PI * 0.49);
    };
    const onPointerUp = (event: PointerEvent) => {
      const drag = dragRef.current;
      dragRef.current = null;
      if (!drag || drag.moved) return;
      const rect = renderer.domElement.getBoundingClientRect();
      const pointer = new THREE.Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1
      );
      const raycaster = new THREE.Raycaster();
      raycaster.params.Points!.threshold = 1.5;
      raycaster.setFromCamera(pointer, camera);
      const picked = raycaster.intersectObjects(content.children, true)
        .find((hit) => hit.object.userData.pickable === true);
      if (picked?.object.userData.planet) {
        onSelectRef.current(picked.object.userData.planet as PlanetName);
      }
    };
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      camera.fov = THREE.MathUtils.clamp(camera.fov + Math.sign(event.deltaY) * 2, 36, 82);
      camera.updateProjectionMatrix();
    };
    const onPointerCancel = () => { dragRef.current = null; };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('pointerup', onPointerUp);
    renderer.domElement.addEventListener('pointercancel', onPointerCancel);
    renderer.domElement.addEventListener('wheel', onWheel, { passive: false });
    let frame = 0;
    const animate = () => {
      frame = window.requestAnimationFrame(animate);
      camera.rotation.y = yawRef.current;
      camera.rotation.x = pitchRef.current;
      renderer.render(scene, camera);
    };
    animate();

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(updateSize);
      resizeObserver.observe(host);
    } else {
      window.addEventListener('resize', updateSize);
    }

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver?.disconnect();
      window.removeEventListener('resize', updateSize);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      renderer.domElement.removeEventListener('pointercancel', onPointerCancel);
      renderer.domElement.removeEventListener('wheel', onWheel);
      disposeGroup(content);
      skyDome.geometry.dispose();
      skyDome.material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      contentRef.current = null;
      cameraRef.current = null;
      skyRef.current = null;
    };
  }, [onRendererError]);

  useEffect(() => {
    const group = contentRef.current;
    if (!group) return;
    disposeGroup(group);
    group.clear();
    addHorizonAndGrid(group);
    const sunAltitude = objects.find((object) => object.id === 'sun')?.altitude ?? -90;
    const sun = objects.find((object) => object.id === 'sun');
    if (sun) {
      skyRef.current?.material.uniforms['sunPosition'].value.copy(
        horizonVector(sun.azimuth, sun.altitude, 450_000)
      );
    }
    addStarField(group, objects, sunAltitude);

    const positions = new Map<PlanetName, THREE.Vector3>();
    objects.forEach((object) => {
      if (object.kind !== 'planet') return;
      const planet = object.id as PlanetName;
      const position = addPlanet(
        group,
        object,
        planet,
        planetLabels[planet],
        selectedPlanet === planet
      );
      positions.set(planet, position);
    });
    if (showAspects) addAspects(group, positions, aspects);
  }, [objects, aspects, selectedPlanet, showAspects, planetLabels]);

  useEffect(() => {
    const camera = cameraRef.current;
    if (!camera) return;
    camera.fov = THREE.MathUtils.clamp(68 / zoom, 36, 82);
    camera.updateProjectionMatrix();
  }, [zoom]);

  return (
    <div
      ref={hostRef}
      className="relative aspect-square w-full overflow-hidden rounded-2xl bg-[#030713]"
      role="group"
      aria-label={ariaLabel}
    >
      <div className="pointer-events-none absolute inset-x-2 bottom-2 z-10 flex flex-col items-center gap-1">
        <span className="rounded-full bg-black/60 px-3 py-1 text-center text-[9px] text-slate-200">
          {interactionHint}
        </span>
        <div className="rounded-full bg-black/55 px-2 py-0.5">
          {Object.entries(aspectLabels).map(([type, label]) => (
            <span key={type} className="mx-1 inline-flex items-center gap-1 text-[9px] text-slate-200">
              <i className="inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: ASPECT_COLORS[type as Aspect['type']] }} />
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
