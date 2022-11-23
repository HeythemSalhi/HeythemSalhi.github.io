/**
 * @author Heythem Salhi 
 * @adapted_from https://threejs.org/docs
 * @REM add cube
 */

$WORLD.drawCube = function () {


    // show axes in the screen
    var axes = new THREE.AxisHelper(20);    // not appearing ?_?
    $WORLD.scene.add(axes);


    // create a cube
    var cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    var cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
    var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.castShadow = true;

    cube.position.x = 140;
    cube.position.y = 0.65;
    cube.position.z = 160;


    // add the cube to the scene2
    $WORLD.scene.add(cube);






}
