import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
// var scene = new THREE.Scene();

function loadData(url) {
    let data = [];
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.onreadystatechange = function (e) {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
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
        let dataObject = {}
        dataObject["lat"] = data[yearIdx][1][i];
        dataObject["lon"] = data[yearIdx][1][i+1];
        dataObject["delta"] = data[yearIdx][1][i + 2];
        output.push(dataObject);
    }
    console.log(output)
    return (output)
}

let year = "1910";
centuryData(year);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('globe').appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement)

const raycaster = new THREE.Raycaster();

const mouse = new THREE.Vector2();

// Earthmap is used for the basic texture which has the various continents/countries/etc. on it
let earthMap = new THREE.TextureLoader().load('./assets/images/earthmap4k.jpg');

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
    specular: new THREE.Color('grey')
});

let earth = new THREE.Mesh(earthGeometry, earthMaterial)

scene.add(earth);

// Add clouds to the earth object
let earthCloudGeo = new THREE.SphereGeometry(10, 32, 32);

// Add clouds texture
let earthCloudsTexture = new THREE.TextureLoader().load('./assets/images/earthhiresclouds4K.jpg');

// Add cloud material
let earthMaterialClouds = new THREE.MeshLambertMaterial({
    color: 0xffffff,
    map: earthCloudsTexture,
    transparent: true,
    opacity: 0.4
});

let earthClouds = new THREE.Mesh(earthCloudGeo, earthMaterialClouds);

earthClouds.scale.set(1.015,1.015,1.015);

earth.add( earthClouds )

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
   
    lights[0] = new THREE.PointLight("#004d99", .5, 0);
    lights[1] = new THREE.PointLight("#004d99", .5, 0);
    lights[2] = new THREE.PointLight("#004d99", .7, 0);
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
controls.maxDistance = 30;
controls.enablePan = false;
controls.update();
controls.saveState();

// resize window, make it dynamic, by using an event handler
window.addEventListener("resize", onWindowResize, false)

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    render();
    controls.update();
}

function render() {
    renderer.render(scene, camera);
}

animate();