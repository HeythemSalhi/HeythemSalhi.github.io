/**
 * @author Heythem Salhi 
 * @adapted_from https://threejs.org/docs
 * @REM define the world
 */
 
var $WORLD = $WORLD || {};
$WORLD.distance = 80;
$WORLD.renderer = null;
$WORLD.scene = null;
$WORLD.clock = null;
$WORLD.map=null;
$WORLD.controls=null;
$WORLD._objUpdate = [];

$WORLD.init3D=function(oPars, fSuc, fFail) {

    var renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);
    $WORLD.renderer = renderer;
    $WORLD.scene = new THREE.Scene();
	
    $WORLD.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, $WORLD.distance);
    $WORLD.camera.position.set(0, 2, 0);
	$WORLD.camera.lookAt(new THREE.Vector3(1,2,0) );
	
	$WORLD.clock = new THREE.Clock();
	$WORLD.controls={
		getPosition: function(){
			return $WORLD.camera.position;
		}
	} 

    $WORLD.textureLoader = new THREE.TextureLoader();
	
	$WORLD.ambientLight = new THREE.AmbientLight(0xffffff,1);
	$WORLD.scene.add($WORLD.ambientLight);
 
    $WORLD.scene.fog = new THREE.Fog(0xffffff, 5, ($WORLD.distance - $WORLD.distance / 4)); //niebla
    $WORLD.renderer.setClearColor($WORLD.scene.fog.color, 1);
	
    window.addEventListener('resize', onWindowResize, false);
    THREE.Loader.Handlers.add(/\.dds$/i, new THREE.DDSLoader());
    fSuc();
}

$WORLD.startAnimation = function () {
	$WORLD.clock.getDelta();
    $WORLD.animate();
}

$WORLD.pauseAnimation = function () {
    window.cancelAnimationFrame( $WORLD.idAnim );
}

$WORLD.addToListUpdate = function (obj) {
    $WORLD._objUpdate.push(obj);
}

$WORLD.animate = function () {
    $WORLD.idAnim = requestAnimationFrame($WORLD.animate);
    var delta = $WORLD.clock.getDelta();
	for (var i = 0; i < $WORLD._objUpdate.length; i++) {
        $WORLD._objUpdate[i].update(delta);
    };
	THREE.AnimationHandler.update(delta);
	$WORLD.renderer.render($WORLD.scene, $WORLD.camera);

};

function onWindowResize() {
    $WORLD.camera.aspect = window.innerWidth / window.innerHeight;
    $WORLD.camera.updateProjectionMatrix();
    $WORLD.renderer.setSize(window.innerWidth, window.innerHeight);
}
