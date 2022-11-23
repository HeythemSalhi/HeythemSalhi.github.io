/**
 * @author Heythem Salhi 
 * @adapted_from https://threejs.org/docs
 */




$WORLD.draw3Dtext = function () {


	console.log('loaded========================================draw3Dtex')

	var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 50);
	camera.position.z = 30;


	var loader = new THREE.FontLoader();
	loader.load('../../data/fonts/helvetiker_regular.typeface.json', function (font) {

		var geometry = new THREE.TextGeometry('hi...', {
			font: font,
			size: 20,
			height: 2,
			curveSegments: 12,
			bevelEnabled: false,
			bevelThickness: 1,
			bevelSize: 0.5
		});
		geometry.center();
		mesh.geometry.dispose();
		mesh.geometry = geometry;


	});

	var mesh = new THREE.Mesh(

		new THREE.Geometry(),

		new THREE.MeshPhongMaterial({
			color: 0x15f289,
			emissive: 0x07f534,
			shading: THREE.FlatShading
		}));










        $WORLD.scene.add(mesh)








		console.log('loaded========================================END draw3Dtex')





}
