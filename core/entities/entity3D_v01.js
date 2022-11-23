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

	$WORLD.scene.add(mesh);
	return mesh;
};
