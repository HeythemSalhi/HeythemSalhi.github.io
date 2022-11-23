var $AIS = $AIS || {};

$AIS.RandomAI = function (object, prop) {
	this._object=object;
	this.velocity=3; //unidades por segundo
	if (prop.velocity){
		this.velocity=prop.velocity;
	}
	this.minX=prop.minX;
	this.maxX=prop.maxX;
	this.minZ=prop.minZ;
	this.maxZ=prop.maxZ;
	this.directionWalk = new THREE.Vector3(0.5, 0, 0.5);
	this.changeDirection();
};

$AIS.RandomAI.prototype.changeDirection = function () {
	this._lastRandomX = Math.random();
    this._lastRandomZ = 1 - this._lastRandomX;
    if (Math.random() < 0.5) {
		this._lastRandomX = this._lastRandomX * -1;
    }
    if (Math.random() < 0.5) {
		this._lastRandomZ = this._lastRandomZ * -1;
    }
    this.directionWalk.x = this._lastRandomX;
	this.directionWalk.z = this._lastRandomZ;
	var pos = this.directionWalk.clone();
    pos.add(this._object.position);
	this._object.lookAt(pos);
}

/*
var from = new THREE.Vector3( 2, 2, 2 );
var to = new THREE.Vector3( 0, 0, 0 );
var direction = to.clone().sub(from);
var length = direction.length();
var arrowHelper = new THREE.ArrowHelper(direction.normalize(), from, length, 0xff0000 );
scene.add( arrowHelper );
*/

$AIS.RandomAI.prototype.update = function ( delta ) {
	var p=this._object.position;
	var x=p.x+ this.directionWalk.x * this.velocity * delta;
	var z=p.z+ this.directionWalk.z * this.velocity * delta;
	var bChange=false;
	if (x<this.minX) {
		x=this.minX;bChange=true;
	} else if (x>this.maxX) {
		x=this.maxX;bChange=true;
	};
	if (z<this.minZ) {
		z=this.minZ;bChange=true;
	} else if (z>this.maxZ) {
		z=this.maxZ;bChange=true;
	};
	if (bChange) {
		this.changeDirection();
	};
	p.set(x, p.y, z)
}

$AIS.RandomAI.prototype.getPosition = function ( ) {
	return this._object.position;
}
