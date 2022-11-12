/**
 * @author Heythem Salhi 
 * @adapted_from https://threejs.org/docs
 */

/**
 * Initialize the statistics domelement
 * 
 * @param {Number} type 0: fps, 1: ms, 2: mb, 3+: custom
 * @returns stats javascript object
 */


/**
 * Initialize a simple default renderer and binds it to the "webgl-output" dom
* element.
 * 
 * @param additionalProperties Additional properties to pass into the renderer
 */
function initRenderer(additionalProperties) {

    var props = (typeof additionalProperties !== 'undefined' && additionalProperties) ? additionalProperties : {};
    var renderer = new THREE.WebGLRenderer(props);
    renderer.shadowMap.enabled = true;
    renderer.shadowMapSoft = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    renderer.setClearColor(new THREE.Color(0x000000));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.getElementById("webgl-output").appendChild(renderer.domElement);

    return renderer;
}


/**
 * Initialize a simple camera and point it at the center of a scene
 * 
 * @param {THREE.Vector3} [initialPosition]
 */
function initCamera(initialPosition) {
    var position = (initialPosition !== undefined) ? initialPosition : new THREE.Vector3(-40, 50, 40);

    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.copy(position);
    camera.lookAt(new THREE.Vector3(150, -300, -200));

    return camera;
}

function initDefaultLighting(scene, initialPosition) {
    var position = (initialPosition !== undefined) ? initialPosition : new THREE.Vector3(-10, 30, 40);
    
    var spotLight = new THREE.SpotLight(0xD5D5FF);
    spotLight.position.copy(position);
    spotLight.shadow.mapSize.width = 3048;
    spotLight.shadow.mapSize.height = 3048;
    spotLight.shadow.camera.fov = 30;
    spotLight.castShadow = true;
    spotLight.decay = 2;
    spotLight.penumbra = 0.5;
    spotLight.name = "spotLight"

    scene.add(spotLight);

    var ambientLight = new THREE.AmbientLight(0x34343f);
    ambientLight.name = "ambientLight";
    scene.add(ambientLight);
    
}





/**
 * Apply meshnormal material to the geometry, optionally specifying whether
 * we want to see a wireframe as well.
 * 
 * @param {*} geometry 
 * @param {*} material if provided use this meshnormal material instead of creating a new material 
 *                     this material will only be used if it is a meshnormal material.
 */
var applyMeshNormalMaterial = function(geometry, material) {
    if (!material || material.type !== "MeshLambertMaterial")  {
        material = new THREE.MeshLambertMaterial();
        material.side = THREE.DoubleSide;
    } 
    
    return new THREE.Mesh(geometry, material)
}


/**
 * Add a simple ground plance to the provided scene
 * 
 * @param {THREE.Scene} scene 
 */
function addLargeGroundPlane(scene, useTexture) {

    var withTexture = (useTexture !== undefined) ? useTexture : false;

    // create the ground plane
    var planeGeometry = new THREE.PlaneGeometry(10000, 10000);
    var planeMaterial = new THREE.MeshPhongMaterial({
        color: 0x33FF33
    });

    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;

    // rotate and position the plane
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 0;
    plane.position.y = 0;
    plane.position.z = 0;

    scene.add(plane);

    return plane;
}



function redrawGeometryAndUpdateUI(gui, scene, controls, geomFunction) {
    if (controls.mesh) scene.remove(controls.mesh)
    var changeMat = eval("(" + controls.appliedMaterial + ")")
    if (controls.mesh) {
        controls.mesh = changeMat(geomFunction(), controls.mesh.material);
    } else {
        controls.mesh = changeMat(geomFunction());
    }
    
    controls.mesh.castShadow = controls.castShadow;
    scene.add(controls.mesh)
  }





