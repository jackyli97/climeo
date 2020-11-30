import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
// var scene = new THREE.Scene();

let year;
let markers;
document.addEventListener('DOMContentLoaded', ()=>{
    const closeModal = document.getElementById("modal");
    document.getElementById("close-modal").addEventListener("click",()=>{
        closeModal.classList.add("animate-modal");
        year = "1910";
        markers = centuryData(year);
        renderAnomolies();
        setTimeout(()=>{
            closeModal.style.display = "none";
            closeModal.style.zIndex = -1;
        },1000)
    })
    closeModal.addEventListener("animationend",()=>{
        if(this.classList.contains("animate-modal")){
            this.classList.remove("animate-modal");
        }
    })
})


function loadData(url) {
    let data = [];
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.onreadystatechange = function (e) {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                // debugger
                let response = JSON.parse(xhr.responseText);
                let output = Object.values(response);
                for (let i = 0; i < output.length; i++) {
                    data.push(output[i]);
                }
            }
        }
    };
    xhr.send()
    console.log(data)
    return (data)
    //  true lets you render the data right away
}

let data = loadData("temp_anomaly_land.json")
const years = ['1910', '1920', '1930', '1940', '1980', '1990', '2000', '2010'];

function centuryData(year) {
    let output = []
    let yearIdx = years.indexOf(year)
    for(let i=0; i<data[yearIdx][1].length;i+=3){
        let dataObject = {};
        dataObject["lat"] = data[yearIdx][1][i];
        dataObject["lon"] = data[yearIdx][1][i+1];
        dataObject["delta"] = data[yearIdx][1][i + 2];
        output.push(dataObject);
    }
    console.log(output)
    return (output)
}

// let year = "1910";
// let markers = centuryData(year);
// let year;
// let markers;

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement)

const raycaster = new THREE.Raycaster();

const mouse = new THREE.Vector2();

// Earthmap is used for the basic texture which has the various continents/countries/etc. on it
let earthMap = new THREE.TextureLoader().load('./assets/images/BM.jpeg');

// EarthBumpMap is used to give the texture some "depth" so it is more appealing on eyes and data visuals
let earthBumpMap = new THREE.TextureLoader().load('./assets/images/earthbump4k.jpg');

// EarthSpecMap gives the earth some shininess to the environment, allowing reflectivity off of the lights
let earthSpecMap = new THREE.TextureLoader().load('./assets/images/earthspec4k.jpg');

let earthGeometry = new THREE.SphereGeometry(10, 32, 32)

let earthMaterial = new THREE.MeshPhongMaterial({
    map: earthMap,
    bumpMap: earthBumpMap,
    bumpScale: 0.10,
    specularMap: earthSpecMap,
    specular: new THREE.Color('white')
});

let earth = new THREE.Mesh(earthGeometry, earthMaterial)

scene.add(earth);

// Add clouds to the earth object
let earthCloudGeo = new THREE.SphereGeometry(10, 32, 32);

// Add clouds texture
let earthCloudsTexture = new THREE.TextureLoader().load('./assets/images/earthhiresclouds4K.jpg');

// Add cloud material
let earthMaterialClouds = new THREE.MeshLambertMaterial({
    color: 0x1f2340,
    map: earthCloudsTexture,
    transparent: true,
    opacity: 0.2
});

let earthClouds = new THREE.Mesh(earthCloudGeo, earthMaterialClouds);

earthClouds.scale.set(1.015,1.015,1.015);

earth.add( earthClouds );

// shader creates halo effect
// shader values borrowed from https://github.com/dataarts/webgl-globe
let shader = {
    uniforms: {},
    vertexShader: [
        'varying vec3 vNormal;',
        'void main() {',
        'vNormal = normalize( normalMatrix * normal );',
        'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
        '}'
    ].join('\n'),
    fragmentShader: [
        'varying vec3 vNormal;',
        'void main() {',
        'float intensity = pow( 0.8 - dot( vNormal, vec3( 0, 0, 1.0 ) ), 12.0 );',
        'gl_FragColor = vec4( 1.0, 1.0, 1.0, 1.0 ) * intensity;',
        '}'
    ].join('\n')
};
let uniforms = THREE.UniformsUtils.clone(shader.uniforms);

let geometry = new THREE.SphereGeometry(10, 32, 32);

let material = new THREE.ShaderMaterial({

    uniforms: uniforms,
    vertexShader: shader.vertexShader,
    fragmentShader: shader.fragmentShader,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    transparent: true

});

let halo = new THREE.Mesh(geometry, material);
halo.scale.set(1.35, 1.35, 1.35);
earthClouds.add(halo);

function createSkyBox(scene) {
    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
        '/assets/images/space_right.png',
        '/assets/images/space_left.png',
        '/assets/images/space_top.png',
        '/assets/images/space_bot.png',
        '/assets/images/space_front.png',
        '/assets/images/space_back.png'
    ])
    scene.background = texture;
}

let lights = [];

function createLights(scene) {
   
    lights[0] = new THREE.PointLight("#1a447e", 0.7, 0);
    lights[1] = new THREE.PointLight("#1a447e", 0.7, 0);
    lights[2] = new THREE.PointLight("#1a447e", 0.9, 0);
    lights[3] = new THREE.AmbientLight("#ffffff");

    lights[0].position.set(200, 0, -400)
    lights[1].position.set(200, 200, 400)
    lights[2].position.set(-200, -200, -50)

    scene.add(lights[0])
    scene.add(lights[1])
    scene.add(lights[2])
    scene.add(lights[3])
}

function addSceneObjects(scene) {
    createLights(scene);
    createSkyBox(scene);
}

addSceneObjects(scene);

camera.position.z = 20;

// Disable control function, so users do not zoom too far in or pan too far away from center
controls.minDistance = 12;
controls.maxDistance = 20;
controls.enablePan = false;
controls.update();
controls.saveState();

// resize window, make it dynamic, by using an event handler
window.addEventListener("resize", onWindowResize, false)
document.querySelector('#years-list').addEventListener("click", onYearsClick, false)

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onYearsClick(e){
    e.preventDefault();
    e.target.classList.add("selected-year")
    removeChildren();
    year = e.target.id;
    markers = centuryData(year);
    renderAnomolies();
}

function animate() {
    requestAnimationFrame(animate);
    render();
    controls.update();
}

function render() {
    renderer.render(scene, camera);
}

// Add a function to remove children, so children aren't added each time
// Removes the points of interest freeing up memory and space to have better performance
function removeChildren() {
    let destroy = earthClouds.children.length - 1;
    while (destroy >= 0) {
        earthClouds.remove(earthClouds.children[destroy].material)
        earthClouds.remove(earthClouds.children[destroy].geometry)
        // destroy on its own only removes the mesh
        earthClouds.remove(earthClouds.children[destroy])
        destroy -= 1
    }
}

// hue calculation code borrowed from https://github.com/dataarts/webgl-globe
function colorVal(x) {
    var c = new THREE.Color();
    if (x > 0.0) {
        c.setHSL((.2139 - (x / 1.619) * .5), 1.0, 0.5)
        return c;
    }
    else if (x < 0.0) {
        c.setHSL((0.5111 - (x / 1.619)), 1.0, 0.6)
        return c;
    }
    else if (x == 0) {
        c.setRGB(1.0, 1.0, 1.0)
        return c;
    }
};


// Code to map coordinates onto 3d plane borrowed from https://stackoverflow.com/questions/36369734/how-to-map-latitude-and-longitude-to-a-3d-sphere
function addCoord(latitude, longitude, delta){
    let pointOfInterest = new THREE.BoxGeometry(.05, .1, .05)
    let lat = latitude * (Math.PI / 180);
    let lon = -longitude * (Math.PI / 180);
    const radius = 10;
    // const phi = (90 - lat) * (Math.PI / 180);
    // const theta = (lon * 180) * (Math.PI / 180);

    let color = colorVal(delta);

    let material = new THREE.MeshLambertMaterial({ color: color});

    let mesh = new THREE.Mesh(pointOfInterest,material);

    mesh.position.set(
        Math.cos(lat) * Math.cos(lon) * radius,
        Math.sin(lat) * radius,
        Math.cos(lat) * Math.sin(lon) * radius
    );

    // mesh.lookAt(mesh.position)

    mesh.rotation.set(0.0, -lon, lat - Math.PI * 0.5);
    
    mesh.scale.y = Math.max(Math.abs(delta)*150, 0.1); // avoid non-invertible matrix

    earthClouds.add(mesh)
}


function renderAnomolies() {
    for(let i=0; i<markers.length;i++){
        if (markers[i].delta !== 0) {
            addCoord(markers[i].lat, markers[i].lon, markers[i].delta)
        }
    }
}
animate();
// if (!year){
//     year = "1910";
//     markers = centuryData(year);
//     renderAnomolies();
// }