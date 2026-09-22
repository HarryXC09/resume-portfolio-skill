import * as THREE from "three";

// One restrained, deterministic volume around the cell; no point sprites or postprocessing.
export function createParticles(mobile, dpr) {
  const count = mobile ? 32 : 78,
    geometry = new THREE.BufferGeometry();
  const positions = [],
    sizes = [],
    alphas = [],
    colors = [],
    phases = [];
  let seed = 29;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  const palette = [
    new THREE.Color("#aac1c9"),
    new THREE.Color("#dce7e5"),
    new THREE.Color("#88a7b1"),
  ];
  for (let i = 0; i < count; i++) {
    const theta = random() * Math.PI * 2,
      radius = 0.57 + random() * 0.34;
    positions.push(
      Math.cos(theta) * radius,
      Math.sin(theta) * radius * 0.87,
      (random() - 0.5) * 1.05,
    );
    // Mostly fine suspended matter, with a few larger out-of-focus discs.
    const level = i % 13 === 0 ? 2 : i % 4 === 0 ? 1 : 0;
    sizes.push([2.6, 4.8, 9.5][level]);
    alphas.push([0.3, 0.24, 0.16][level] + random() * 0.08);
    const color = palette[i % 3];
    colors.push(color.r, color.g, color.b);
    phases.push(random() * 6.28);
  }
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3),
  );
  geometry.setAttribute("aSize", new THREE.Float32BufferAttribute(sizes, 1));
  geometry.setAttribute("aAlpha", new THREE.Float32BufferAttribute(alphas, 1));
  geometry.setAttribute("aColor", new THREE.Float32BufferAttribute(colors, 3));
  geometry.setAttribute("aPhase", new THREE.Float32BufferAttribute(phases, 1));
  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    depthTest: true,
    uniforms: {
      uTime: { value: 0 },
      uDpr: { value: dpr },
      uFollow: { value: new THREE.Vector2() },
    },
    vertexShader: `
   uniform float uTime; uniform float uDpr; uniform vec2 uFollow;
   attribute float aSize; attribute float aAlpha; attribute float aPhase; attribute vec3 aColor;
   varying float vAlpha; varying vec3 vColor;
   void main(){
    vec3 p=position;
    p.x+=sin(uTime*.13+aPhase)*.016+uFollow.x*(p.z+.6)*.06;
    p.y+=sin(uTime*.10+aPhase*1.7)*.022+uFollow.y*(p.z+.6)*.04;
    vec4 mv=modelViewMatrix*vec4(p,1.);
    gl_Position=projectionMatrix*mv;
    gl_PointSize=aSize*uDpr*clamp(2.1/-mv.z,.65,1.6);
    vAlpha=aAlpha;vColor=aColor;
   }`,
    fragmentShader: `
   varying float vAlpha; varying vec3 vColor;
   void main(){
    float radius=length(gl_PointCoord-.5)*2.;
    if(radius>1.)discard;
    float soft=1.-smoothstep(.12,1.,radius);
    gl_FragColor=vec4(vColor,vAlpha*soft);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
   }`,
  });
  const points = new THREE.Points(geometry, material);
  points.name = "microscopic-suspension";
  return {
    points,
    count,
    sizeLevels: [2.6, 4.8, 9.5],
    material,
    dispose() {
      geometry.dispose();
      material.dispose();
    },
  };
}
