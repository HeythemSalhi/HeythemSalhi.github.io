/**
 * @author Heythem Salhi 
 * @adapted_from https://threejs.org/docs
 * @REM add cube wit mesh
 */

$WORLD.drawCubeMesh = function (myX, myY, myZ, myRotY, myPath) {





    // create a cube
    var cubeGeometry = new THREE.BoxGeometry(6, 3.6, 0.05);


    var cubeMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      map: THREE.ImageUtils.loadTexture(myPath)
  });

    var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.castShadow = true;

    cube.position.x = myX;
    cube.position.y = myY;
    cube.position.z = myZ;

    cube.rotation.y = myRotY;
    


    // add the cube to the scene2
    $WORLD.scene.add(cube);
    







}
