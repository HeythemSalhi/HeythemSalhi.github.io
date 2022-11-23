/**
 * @author Heythem Salhi 
 * @adapted_from https://threejs.org/docs
 * @REM create the sky, and the lights
 */

$WORLD.sky= {
	update:function(delta){
	    var p = $WORLD.controls.getPosition();
		$WORLD.sky.skyBox.position.set(p.x, 0, p.z);
	}	
};

$WORLD.drawSky = function () {
    var sky = $WORLD.map.sky;
	if (sky.type=="skybox"){
		$WORLD.drawSkybox(sky);
	} else if (sky.type=="skysphere" && sky.texture!="") {
		$WORLD.drawSkysphere(sky);
	} else {
		$WORLD.drawSkysphereNoImg(sky);
	}

    //create mood light
    $WORLD.ambientLight.color = new THREE.Color(sky.colorAmbient);
    $WORLD.ambientLight.intensity = sky.intensityAmbient;

    //create sunlight
	var light = new THREE.DirectionalLight(sky.sunlightcolor, sky.sunlightintensity);
    light.castShadow = true;
    light.shadow.mapSize.width = 2 * 512; 
    light.shadow.mapSize.height = 2 * 512;
    light.shadow.camera.near = 0;
    light.shadow.camera.far = 50; //cube height

    //from the center point indicate the square.
    light.shadow.camera.top = 25; //X
    light.shadow.camera.right = 25;
    light.shadow.camera.left = -25;
    light.shadow.camera.bottom = -25;

    light.shadow.camera.visible = true;
    $WORLD.sky.skyBox.add(light);
	
    light.position.set(sky.sunlightposition.x, sky.sunlightposition.y, sky.sunlightposition.z); 
    light.target = $WORLD.sky.skyBox;
    
    $WORLD.scene.fog.near = sky.fogNear;
    if (sky.fogFar > 0 && ($WORLD.distance - $WORLD.distance / 4) > sky.fogFar) {
        $WORLD.scene.fog.far = sky.fogFar;
    }
    $WORLD.scene.fog.color = new THREE.Color(sky.fogColor);
    $WORLD.renderer.setClearColor($WORLD.scene.fog.color, 1);
	
	$WORLD.addToListUpdate ($WORLD.sky);
};

$WORLD.drawSkybox=function (sky){
	var cubemap = new THREE.CubeTextureLoader().load( sky.texture );
	cubemap.format = THREE.RGBFormat;
		
	var shader = THREE.ShaderLib['cube']; 
	shader.uniforms['tCube'].value = cubemap; 

	var skyBoxMaterial = new THREE.ShaderMaterial( {
	fragmentShader: shader.fragmentShader,
	vertexShader: shader.vertexShader,
	uniforms: shader.uniforms,
	depthWrite: false,
	side: THREE.BackSide
	});
	
	var distance=($WORLD.distance*2-20);
	var c = Math.pow ((distance*distance)/2,0.5);
	var skyBox = new THREE.Mesh(  new THREE.BoxGeometry(c, c, c),  skyBoxMaterial);
    $WORLD.scene.add(skyBox);
    $WORLD.sky.skyBox = skyBox;

};

$WORLD.drawSkysphere=function (sky){
    var skyTexture = $WORLD.textureLoader.load(sky.texture);
    var geometry = new THREE.SphereGeometry($WORLD.distance - 10, 30, 20);

    var uniforms = {
        texture: { type: 't', value: skyTexture }
    };
    var material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: "varying vec2 vUV;" +
        "\n" +
        "void main() {  " +
        "    vUV = uv;" +
        "    vec4 pos = vec4(position, 1.0);" +
        "    gl_Position = projectionMatrix * modelViewMatrix * pos;" +
        "}",
        fragmentShader: "uniform sampler2D texture;" +
        "varying vec2 vUV;" +
        "" +
        "    void main() {" +
        "        vec4 sample = texture2D(texture, vUV);" +
        "        gl_FragColor = vec4(sample.xyz, sample.w);" +
        "    }"
    });

    var skyBox = new THREE.Mesh(geometry, material);
    skyBox.scale.set(-1, 1, 1);
    skyBox.rotation.order = 'XZY';
    skyBox.renderDepth = $WORLD.distance;
    $WORLD.scene.add(skyBox);
    $WORLD.sky.skyBox = skyBox;
};

$WORLD.drawSkysphereNoImg=function (sky){

	var vertexShader ="varying vec3 vWorldPosition;"+
	" "+
	"void main() {"+
	"    vec4 worldPosition = modelMatrix * vec4( position, 1.0 );"+
	"    vWorldPosition = worldPosition.xyz;"+ //xyz
	" "+
	"    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );"+
	"}";

	var fragmentShader ="uniform vec3 topColor;"+
	"uniform vec3 bottomColor;"+
	"uniform float offset;"+
	"uniform float exponent;"+
	" "+
	"varying vec3 vWorldPosition;"+
	" "+
	"void main() {"+
	"    float h = normalize( vWorldPosition + offset ).y;"+
	"    gl_FragColor = vec4( mix( bottomColor, topColor, max( pow( h, exponent ), 0.0 ) ), 1.0 );"+
	"}";

	var uniforms = {
	        topColor: {type: "c", value: new THREE.Color(sky.topColor)}, bottomColor: {type: "c", value: new THREE.Color(sky.bottomColor)},
	        offset: {type: "f", value: 0}, exponent: {type: "f", value: 0.5} 
	}
	var skyMaterial = new THREE.ShaderMaterial({vertexShader: vertexShader, fragmentShader: fragmentShader, uniforms: uniforms, side: THREE.BackSide, fog: false});
	 
	var skyBox = new THREE.Mesh( new THREE.SphereGeometry($WORLD.distance - 10, 30, 20), skyMaterial);

    skyBox.rotation.order = 'XZY';
    skyBox.renderDepth = $WORLD.distance;
    
    $WORLD.scene.add(skyBox);
    $WORLD.sky.skyBox = skyBox;
}
