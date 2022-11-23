var $AIS = $AIS || {};

$AIS.PathAI = function (object, prop) {
	var vecs=[];
	for (var i=0;i<prop.path.length;i++){
		vecs.push(new THREE.Vector3(prop.path[i][0], prop.path[i][1], prop.path[i][2]))
	}
	this.path=new THREE.CatmullRomCurve3(vecs);
	this._object=object;
	this._pos=0;
	this.velocity=1; //unidades por segundo
	if (prop.velocity){
		this.velocity=prop.velocity;
	}
	this._factor=this.velocity/this.path.getLength();
	if (prop.showPath) {
		this.showPath();
	}
};

$AIS.PathAI.prototype.update = function ( delta ) {

	this._object.position.copy(this.path.getPointAt(this._pos));
	this._pos += (this._factor * delta);
	if (this._pos > 1) {this._pos = 0;};
	this._object.lookAt(this.path.getPointAt(this._pos));
}

$AIS.PathAI.prototype.showPath = function ( ) {
	var geometry = new THREE.Geometry();
	var points = this.path.getPoints(50);

	var material = new THREE.LineBasicMaterial({
		color: 0xff00f0
	});

	geometry.vertices = points;
	var line = new THREE.Line(geometry, material);
	line.position.set(0,0.25,0)
	$WORLD.scene.add(line);
}

$AIS.PathAI.prototype.getPosition = function ( ) {
	return this._object.position;
}
