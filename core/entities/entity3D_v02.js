/**
 * @author Heythem Salhi 
 * @adapted_from https://threejs.org/docs
 * @REM CLASSE Entity3D: It is an entity that has been inserted into the project from a template...
 */

var $RG = $RG || {};
$RG.entities=[];

$RG.Entity3D = function (properties) {
	this.template=properties.template
	this.prop=properties;
	this.mesh=null;
	$RG.entities.push(this)
}

$RG.Entity3D.prototype.addToWorld = function () {
	var prop=this.prop;
	var templ=$RG.templates[prop.template];

	//Clone the 3D figure, position and rotate
	var mesh=templ.template3D.mesh.clone();
	var y=0
	mesh.position.set(prop.x, ((prop.y)?prop.y:0), prop.z);
	if (!(prop.rY)) prop.rY=0;
	if (templ.type==3) {
		mesh.translateY(templ.height/2-0.05);
	}
	mesh.rotateY(prop.rY * Math.PI / 180);
	this.mesh=mesh;
		
	//Animate the object if they have an animation
	if (templ.animation) {
		mesh.traverse(function (child) {
			if (child instanceof THREE.SkinnedMesh) {
				var animation = new THREE.Animation(child, child.geometry.animation);
				animation.play();
			}
		})
	};
   
    //Apply artificial intelligence if defined
	if (templ.ai) {
		this.ai=new $AIS[templ.ai](this.mesh, this.prop);
		$WORLD.addToListUpdate (this.ai); 
	}
	$WORLD.scene.add(mesh);
	return mesh;
};