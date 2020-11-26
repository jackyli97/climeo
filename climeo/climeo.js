import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
var scene = new THREE.Scene();


gsap.config({
    nullTargetWarn: false,
});

// 4 types of cameras

// persepective camera takes in 4 args, field of view, apsect ratio, near plane, far plane

var camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)

// controls the zoom
camera.position.z = 5;
// set up renderer
// 3 types, css2d, css3d, webgl, svg renderer

var renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setClearColor('#e5e5e5');
//set size of renderer
renderer.setSize(window.innerWidth, window.innerHeight);

//next need to append child, dom element

document.body.appendChild(renderer.domElement)

// the window is initially non reponsive

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();
})

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();


//when creating a shape, have form and material
//acepts radius, width and height segments
//higher the width and heigth, the smoother the sphere
//combine two into a mesh
var geometry = new THREE.SphereGeometry(1, 10, 10);
var material = new THREE.MeshLambertMaterial({ color: 0x0000FF })
var mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
// don't see it because we need camera position on the z axis
// see it once we add renderer.render to bottom

//need to add light to see color

// takes in color, distance, and decay

var light = new THREE.PointLight(0xFFFFFF, 1, 500)
light.position.set(10, 0, 25)
scene.add(light)
// renderer.render(scene, camera)

//this helps us avoid distortion
// creates a loop that causes renderer to draw a new scene through each refresh
var render = function () {
    requestAnimationFrame(render);

    // if we wanted object to move
    // 0.01 is about 60 frames per second
    // mesh.rotation.y += 0.01

    renderer.render(scene, camera)

}

//     // .3 delay so graphics not shaky
//     var tl = new TimelineMax().delay(.3);
//     // 1 is duration
//     // object is where it is scaling
//     tl.to(mesh.scale, 1, {x: 2, ease: Expo.easeOut}, "=-1.5")
// // it will occur 1.5 seconds before it normally does

function onMouseMove(event) {
    event.preventDefault();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    // returns array based on objects where mouse is at
    var intersects = raycaster.intersectObjects(scene.children, true)
    for (let i = 0; i < intersects.length; i++) {
        // intersects[i].object.material.color.set(0xff0000)

        // user events
        // .3 delay so graphics not shaky
        this.tl = new TimelineMax();
        // 1 is duration
        // object is where it is scaling
        this.tl.to(intersects[i].object.scale, 1, { x: 2, ease: Expo.easeOut })
        this.tl.to(intersects[i].object.scale, .5, { x: 2, ease: Expo.easeOut })
        this.tl.to(intersects[i].object.position, .5, { x: 2, ease: Expo.easeOut })
        this.tl.to(intersects[i].object.rotation, .5, { y: Math.PI * 5, ease: Expo.easeOut }, "=-1.5")
        // it will occur 1.5 seconds before it normally does
    }
}

// // user events
// // .3 delay so graphics not shaky
// this.tl = new TimelineMax({ paused: true });
// // 1 is duration
// // object is where it is scaling
// this.tl.to(this.mesh.scale, 1, { x: 2, ease: Expo.easeOut })
// this.tl.to(this.mesh.scale, .5, { x: 2, ease: Expo.easeOut })
// this.tl.to(this.mesh.scale, .5, { x: 2, ease: Expo.easeOut })
// this.tl.to(this.mesh.scale, .5, { y: Math.PI * 5, ease: Expo.easeOut }, "=-1.5")
// // it will occur 1.5 seconds before it normally does
render();
window.addEventListener('mousemove', onMouseMove);

// to have the animation to only take place if the specfic object is clicked then 
// need to use a raycaster


    // how to move objects in space
    // you move the mesh

    // mesh.position.set = (2,2,-2)
    // mesh.rotation.set(45,0,0)
    // mesh.scale.set(1,2,1)

    // if we wanted object to move

    //aspect ratio getting distorted

    // performing complex animation seqeunce requires timeline pluggin from tweenmax

// ------------------

// var POS_X = 1800;
// var POS_Y = 500;
// var POS_Z = 1800;
// var WIDTH = 1000;
// var HEIGHT = 600;

// var FOV = 45;
// var NEAR = 1;
// var FAR = 4000;

// var renderer = new THREE.WebGLRenderer();
// renderer.setSize(WIDTH, HEIGHT);
// renderer.setClearColor(0x111111);

// var mapDiv = document.getElementById("globe");
// mapDiv.appendChild(renderer.domElement);

// // setup a camera that points to the center
// var camera = new THREE.PerspectiveCamera(FOV, WIDTH / HEIGHT, NEAR, FAR);
// camera.position.set(POS_X, POS_Y, POS_Z);
// camera.lookAt(new THREE.Vector3(0, 0, 0));

// var scene = new THREE.Scene();
// scene.add(camera);

// //wait until document is loaded before loading data
// $(document).ready(function () {
//     jQuery.get('data/temp_anomaly_land.json', function (data) {
//         addTemps((data));
//         addEarth();
//         addLights();
//         addClouds();
//     })
// })


// // convert the positions from a lat, lon to a position on a sphere.
// function latLongToVector3(lat, lon, radius, heigth) {
//     var phi = (lat) * Math.PI / 180;
//     var theta = (lon - 180) * Math.PI / 180;

//     var x = -(radius + heigth) * Math.cos(phi) * Math.cos(theta);
//     var y = (radius + heigth) * Math.sin(phi);
//     var z = (radius + heigth) * Math.cos(phi) * Math.sin(theta);

//     return new THREE.Vector3(x, y, z);
// }

// // simple function that converts the density data to the markers on screen
// // the height of each marker is relative to the density.
// function addTemps(data) {

//     // the geometry that will contain all our cubes
//     var geom = new THREE.Geometry();
//     // material to use for each of our elements. Could use a set of materials to
//     // add colors relative to the density. Not done here.
//     var cubeMat = new THREE.MeshLambertMaterial({ color: 0x000000, opacity: 0.6, emissive: 0xffffff });
//     for (var i = 0; i < data.length - 1; i++) {

//         //get the data, and set the offset, we need to do this since the x,y coordinates
//         //from the data aren't in the correct format
//         var x = parseInt(data[i][0]) + 180;
//         var y = parseInt((data[i][1]) - 84) * -1;
//         var value = parseFloat(data[i][2]);

//         // calculate the position where we need to start the cube
//         var position = latLongToVector3(y, x, 600, 2);

//         // create the cube
//         var cube = new THREE.Mesh(new THREE.CubeGeometry(5, 5, 1 + value / 8, 1, 1, 1, cubeMat));

//         // position the cube correctly
//         cube.pos = position;
//         cube.lookAt(new THREE.Vector3(0, 0, 0));

//         // merge with main model
//         THREE.GeometryUtils.merge(geom, cube);
//     }

//     // create a new mesh, containing all the other meshes.
//     var total = new THREE.Mesh(geom, new THREE.MeshFaceMaterial());

//     // and add the total mesh to the scene
//     scene.add(total);
// }

// // add the earth
// function addEarth() {
//     var spGeo = new THREE.SphereGeometry(600, 50, 50);
//     var planetTexture = THREE.ImageUtils.loadTexture("/assets/world-big-2-grey.jpg")
//     // var planetTexture = THREE.ImageUtils.loadTexture("/assets/world-big-2-grey.jpg");
//     var mat2 = new THREE.MeshPhongMaterial({
//         map: planetTexture,
//         shininess: 0.2
//     });
    
//     var sp = new THREE.Mesh(spGeo, mat2);
//     scene.add(sp);
// }

// // add clouds
// function addClouds() {
//     var spGeo = new THREE.SphereGeometry(600, 50, 50);
//     var cloudsTexture = THREE.ImageUtils.loadTexture("assets/earth_clouds_1024.jpg");
//     var materialClouds = new THREE.MeshPhongMaterial({ color: 0xffffff, map: cloudsTexture, transparent: true, opacity: 0.3 });
//     var meshClouds = new THREE.Mesh(spGeo, materialClouds);
//     meshClouds.scale.set(1.015, 1.015, 1.015);
//     scene.add(meshClouds);
// }

// // add a simple light
// function addLights() {
//     var light = new THREE.DirectionalLight(0x3333ee, 3.5, 500);
//     scene.add(light);
//     light.position.set(POS_X, POS_Y, POS_Z);
// }


// // this code was borrowed from https://stackoverflow.com/questions/1293147/example-javascript-code-to-parse-csv-data
// function CSVToArray(strData, strDelimiter) {
//     // Check to see if the delimiter is defined. If not,
//     // then default to comma.
//     strDelimiter = (strDelimiter || ",");

//     // Create a regular expression to parse the CSV values.
//     var objPattern = new RegExp(
//         (
//             // Delimiters.
//             "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

//             // Quoted fields.
//             "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

//             // Standard fields.
//             "([^\"\\" + strDelimiter + "\\r\\n]*))"
//         ),
//         "gi"
//     );


//     // Create an array to hold our data. Give the array
//     // a default empty first row.
//     var arrData = [[]];

//     // Create an array to hold our individual pattern
//     // matching groups.
//     var arrMatches = null;


//     // Keep looping over the regular expression matches
//     // until we can no longer find a match.
//     while (arrMatches = objPattern.exec(strData)) {

//         // Get the delimiter that was found.
//         var strMatchedDelimiter = arrMatches[1];

//         // Check to see if the given delimiter has a length
//         // (is not the start of string) and if it matches
//         // field delimiter. If id does not, then we know
//         // that this delimiter is a row delimiter.
//         if (
//             strMatchedDelimiter.length &&
//             strMatchedDelimiter !== strDelimiter
//         ) {

//             // Since we have reached a new row of data,
//             // add an empty row to our data array.
//             arrData.push([]);

//         }

//         var strMatchedValue;

//         // Now that we have our delimiter out of the way,
//         // let's check to see which kind of value we
//         // captured (quoted or unquoted).
//         if (arrMatches[2]) {

//             // We found a quoted value. When we capture
//             // this value, unescape any double quotes.
//             strMatchedValue = arrMatches[2].replace(
//                 new RegExp("\"\"", "g"),
//                 "\""
//             );

//         } else {

//             // We found a non-quoted value.
//             strMatchedValue = arrMatches[3];

//         }


//         // Now that we have our value string, let's add
//         // it to the data array.
//         arrData[arrData.length - 1].push(strMatchedValue);
//     }

//     // Return the parsed data.
//     return (arrData);
// }

// renderer.render(scene, camera);