/**
 * @author Heythem Salhi 
 * @adapted_from https://threejs.org/docs
 * @REM CREATE THE SOIL OF THE WORLD
 */

$WORLD.drawGround = function () {
    var map = $WORLD.map;
    var groundTexture = $WORLD.textureLoader.load(map.ground.texture);
    var x = $WORLD.distance * 2.25 + map.x
    var z = $WORLD.distance * 2.25 + map.z
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set(x / 2, z / 2); 
    groundTexture.anisotropy = 16;
    var groundMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff, map: groundTexture });
    var mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(x, z), groundMaterial);
    mesh.position.y = 0;
    mesh.position.x = map.x / 2;
    mesh.position.z = map.z / 2;
    mesh.rotation.x = - Math.PI / 2;
    mesh.receiveShadow = true;
    $WORLD.scene.add(mesh);
}
