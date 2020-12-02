# Climeo

[Climeo Live](https://jackyli97.github.io/climeo/)

Climeo(Climate + Geo) is a data visualizer that depicts temperature anomalies throughout the century on earth. The data is retreived from NASA, and specifically measures how the average surface air temperature for each decade differs from the mean(taken from 1951-1980); more information can be found directly from  [NASA](https://data.giss.nasa.gov/gistemp/). The inspriation for this project was taken from [Google Chrome's WebGL Globe Experiments](https://experiments.withgoogle.com/chrome/globe) - an open platform for geographic data visualization that features a globe which data can be mapped over.

## Features
* Interactive and realstic globe.
* Spikes representing temperature variation compared with 30-year average at each coordinate.
* List of decade with clickable years, which will each render a globe with different points and spikes.
* Welcome modal containing introduction and instructions.

# Controls
Drag the mouse to rotate the scene | Drag the slider to scale

<br/>
Globe:
<p align="center">
  <img width="100%" src="https://github.com/jackyli97/climeo/blob/master/assets/images/91d923faee769b6df4012dd858c144b7.gif?raw=true">
</p>

<br/>

# Fetching the Data
The data acquired from NASA was downloaded initially as a NetCDF file and subsequently stored in this project as a JSON file. The data was fetched using a XMLHttpRequest.

```js
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
}
```
 Interestingly, the data was all in an array format, where the data for one specific coordinate took up a span of 3 elements - representing latitude, longitude, and change in temperature compared with the 30-year average; i.e. 75.0,67.0,1.03591834639. To handle this and only render the data points for one decade at a time, a function was written to return that information.
 
 ```js
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
    return (output)
}
 ```
 
 # Rendering data points onto globe as spikes
 ```js
 function renderAnomolies() {
    for(let i=0; i<markers.length;i++){
        if (markers[i].delta !== 0) {
            addCoord(markers[i].lat, markers[i].lon, markers[i].delta)
        }
    }
}

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
 ```
 As shown in the code block above, each data point is sent as an argument to a helper method called addCoord. The 2D coordinates are converted into 3D coordinates, then subsequently ploted onto the globe. The height of the globe is determined by the temperature anomaly/change(multiplied by 150 for more apparent sizing), and then the geometry is scaled in the y-direction by this value. The color was also determined using a helper method that leverages HSL color values.
 
 ```js
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
 ```
 The max and min hue values that created the endpoints color scale was derived from the range of temperature anomalies taken from NASA, and the hue values for blue and red.
 
<br/>
Colorbar Scale:
<p align="center">
  <img width="100%" src="https://github.com/jackyli97/climeo/blob/master/assets/images/Screen%20Shot%202020-11-27%20at%2012.45.49%20PM.png?raw=true">
</p>

<br/>
Colorcode representing max:
<p align="center">
  <img width="100%" src="https://github.com/jackyli97/climeo/blob/master/assets/images/Screen%20Shot%202020-11-27%20at%2012.21.43%20PM.png?raw=true">
</p>

<br/>
Colorcode representing min:
<p align="center">
  <img width="100%" src="https://github.com/jackyli97/climeo/blob/master/assets/images/Screen%20Shot%202020-11-27%20at%2012.22.01%20PM.png?raw=true">
</p>

## Challenges
The project broughtforth many challenges, mainly learning Three.js in a limited span. Once I learned how to learn the basics of Three, including knowing how to create a scene, set up a camera, set up Orbit Controls, and add lighting, I had enough of a foundation to comfortably finish the project.

Other challenges I encountered during the project include render direction colored spikes depending on the change in temperature value, and storing the data in an efficient and usable manner. The approach to both of these challenges were addressed in the code snippets above.

## Technology
* Three.js
* Vanilla Javascript
* HTML5
* CSS
