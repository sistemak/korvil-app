const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
75,
window.innerWidth/window.innerHeight,
0.1,
1000
);

camera.position.z = 150;

const renderer = new THREE.WebGLRenderer({
antialias:true
});

renderer.setSize(
window.innerWidth,
window.innerHeight
);

document
.getElementById("container")
.appendChild(renderer.domElement);

const loader = new THREE.TextureLoader();

loader.load("rosto.png", texture => {

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

canvas.width = texture.image.width;
canvas.height = texture.image.height;

ctx.drawImage(texture.image,0,0);

const img = ctx.getImageData(
0,
0,
canvas.width,
canvas.height
);

const geometry =
new THREE.BufferGeometry();

const vertices = [];

for(let y=0;y<canvas.height;y+=3){

for(let x=0;x<canvas.width;x+=3){

const index =
(y*canvas.width+x)*4;

const alpha =
img.data[index+3];

if(alpha>50){

const brightness =
img.data[index];

const z =
(brightness/255)*40;

vertices.push(
x-canvas.width/2,
canvas.height/2-y,
z
);

}
}
}

geometry.setAttribute(
"position",
new THREE.Float32BufferAttribute(
vertices,
3
)
);

const material =
new THREE.PointsMaterial({
color:0x00ffff,
size:1.5,
transparent:true
});

const face =
new THREE.Points(
geometry,
material
);

scene.add(face);

function animate(){

requestAnimationFrame(
animate
);

face.rotation.y += 0.002;

const pos =
face.geometry.attributes.position;

for(let i=0;i<pos.count;i++){

const x = pos.getX(i);

pos.setZ(
i,
Math.sin(
Date.now()*0.001+x*0.05
)*5
);

}

pos.needsUpdate = true;

renderer.render(
scene,
camera
);

}

animate();

});

window.addEventListener(
"resize",
()=>{
camera.aspect=
window.innerWidth/
window.innerHeight;

camera.updateProjectionMatrix();

renderer.setSize(
window.innerWidth,
window.innerHeight
);
}
);
