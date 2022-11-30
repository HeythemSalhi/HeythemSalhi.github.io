var $CONTROLS = $CONTROLS || {};

$CONTROLS.FirstPersonControls = function (object, domElement, spyhole) {

	var self = this;
	this.object = object;
	this.target = new THREE.Vector3(0, 0, 0);

	this.domElement = (domElement !== undefined) ? domElement : document;
	this.container = (this.domElement == document) ? document.body : this.domElement;
	this.spyhole = false;

	if (spyhole) {
		this.spyhole = new THREE.Vector2();
		this.spyholeElem = document.createElement("img");
		this.spyholeElem.src = spyhole;
		this.spyholeElem.style.position = "absolute";
		this.spyholeElem.style.left = "50%";
		this.spyholeElem.style.top = "50%";
		this.spyholeElem.style.height = "30px";
		this.spyholeElem.style.width = "30px";
		this.spyholeElem.style.marginTop = "-20px";
		this.spyholeElem.style.marginLeft = "-20px";
		this.spyholeElem.style.display = "none";
		this.container.appendChild(this.spyholeElem);
	}

	this.enabled = true;

	this.eyeY = 2;
	this.movementSpeed = 3.5;
	this.movementSpeedRun = 6.0;
	this.lookSpeed = 0.02;

	this.mouse = new THREE.Vector2();
	this.raycaster = new THREE.Raycaster();
	this.raycaster.far = 5;
	this.mouseMovementX = 0;
	this.mouseMovementY = 0;

	this.lon = 0;
	this.theta = 0;

	this.lat = 0;
	this.phi = 0;

	this.moveForward = false;
	this.moveBackward = false;
	this.moveLeft = false;
	this.moveRight = false;
	this.turnLeft = false;
	this.turnRight = false;
	this.turnUp = false;
	this.turnDown = false;
	this.run = false;
	this.jump = false;

	this.verticalMin = -85;
	this.verticalMax = +85;

	this.minX = 0;
	this.maxX = 256;
	this.minZ = 0;
	this.maxZ = 256;

	this.viewHalfX = 0;
	this.viewHalfY = 0;

	this.hasAPIGamepad = ("getGamepads" in navigator);
	this.haveEventsGamepad = ('ongamepadconnected' in window);
	this.priorityControl = 0;//0 - Mouse, 1 - Gamepad
	this.gamepad = null;

	// pointerLock
	this.havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
	this.pointerLockActive = false;
	if (this.havePointerLock) {

		var pointerlockchange = function (event) {
			var element = document.body;
			if (document.pointerLockElement === element) {
				self.pointerLockActive = true;
			} else {
				self.pointerLockActive = false;
				self.onEscape();
			}
		}

		var pointerlockerror = function (event) {
			self.pointerLockActive = false;
		}
		document.addEventListener('pointerlockchange', pointerlockchange, false);
		document.addEventListener('mozpointerlockchange', pointerlockchange, false);
		document.addEventListener('webkitpointerlockchange', pointerlockchange, false);
		document.addEventListener('pointerlockerror', pointerlockerror, false);
		document.addEventListener('mozpointerlockerror', pointerlockerror, false);
		document.addEventListener('webkitpointerlockerror', pointerlockerror, false);
	}
	this.exitPointerLock = function () {
		document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock || document.webkitExitPointerLock;
		document.exitPointerLock();
	}
	this.requestPointerLock = function () {
		var element = document.body;
		element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
		element.requestPointerLock();
	}
	//End Pointerlock

	//fullscreen
	this.fullscreenEnabled = function () {
		return document.fullscreenEnabled || document.webkitFullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled;
	};

	this.requestFullscreen = function (element) {
		if (!this.fullscreenEnabled()) return;
		if (!element) element = document.documentElement;
		element.requestFullscreen = element.requestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen || element.msRequestFullscreen;
		element.requestFullscreen();
	}

	if (this.domElement !== document) {
		this.domElement.setAttribute('tabindex', - 1);
	}

	this.handleResize = function () {

		if (this.domElement === document) {
			this.viewHalfX = window.innerWidth / 2;
			this.viewHalfY = window.innerHeight / 2;
		} else {
			this.viewHalfX = this.domElement.offsetWidth / 2;
			this.viewHalfY = this.domElement.offsetHeight / 2;
		}

	};

	this.getPosition = function () {
		return this.object.position;
	}



	this.setEnabled = function (val) {
		this.enabled = val;
	}

	this.onMouseDown = function (event) {
		if (this.enabled === false) return;
		if (this.pointerLockActive) {
			this.interact(this.spyhole, this.object);
		} else {
			this.interact(this.mouse, this.object);
		}
	};

	this.interact = function (oPointer, oCamara) {
		this.raycaster.setFromCamera(oPointer, oCamara);
		var intersects = this.raycaster.intersectObjects($WORLD.entitiesInteract);
		if (intersects.length > 0) {
			var mesh = intersects[0].object;
			if ("entity3D" in mesh && "interact" in mesh.entity3D.prop) {
				eval(mesh.entity3D.prop.interact);
			}
		}
	};

	this.onMouseMove = function (event) {
		if (this.enabled === false) return;
		this.mouseMovementX = this.mouseMovementX + (event.movementX || 0);
		this.mouseMovementY = this.mouseMovementY + (event.movementY || 0);
		this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
	};

	this.onEscape = function () {
		return;
	}

	this.onKeyDown = function (event) {
		if (this.enabled === false) return;
		switch (event.keyCode) {

			case 27: /*escape*/
				this.onEscape();
				break;

			case 73: /*I*/
				this.interact(this.spyhole, this.object);
				break;

			case 36: /*Start*/ this.turnUp = true; break;
			case 35: /*End*/ this.turnDown = true; break;

			case 37: /*left*/
			case 65: /*A*/ this.turnLeft = true; break;

			case 39: /*right*/
			case 68: /*D*/ this.turnRight = true; break;

			case 81: /*Q*/ this.moveLeft = true; break;
			case 69: /*E*/ this.moveRight = true; break;

			case 38: /*up*/
			case 87: /*W*/ this.moveForward = true; break;

			case 40: /*down*/
			case 83: /*S*/ this.moveBackward = true; break;

			case 16: /*shift*/ this.run = true; break;

		}

	};

	this.onKeyUp = function (event) {
		if (this.enabled === false) return;

		switch (event.keyCode) {

			case 36: /*Start*/ this.turnUp = false; break;
			case 35: /*End*/ this.turnDown = false; break;

			case 37: /*left*/
			case 65: /*A*/ this.turnLeft = false; break;

			case 39: /*right*/
			case 68: /*D*/ this.turnRight = false; break;

			case 81: /*Q*/ this.moveLeft = false; break;
			case 69: /*E*/ this.moveRight = false; break;

			case 38: /*up*/
			case 87: /*W*/ this.moveForward = false; break;

			case 40: /*down*/
			case 83: /*S*/ this.moveBackward = false; break;

			case 16: /*shift*/ this.run = false; break;

		}
	};


	this.onMoveFW = function () {
		this.moveForward = true;
	};
	this.onMoveBW = function () {
		this.moveBackward = true;
	};
	this.onMoveRT = function () {
		this.moveRight = true;
	};
	this.onMoveLF = function () {
		this.moveLeft = true;
	};
	this.StopMove = function () {
		this.moveForward = false;
		this.moveBackward = false;
		this.moveRight = false;
		this.moveLeft = false;
	};

	this.onMoveFwRt = function () {
		this.moveBackward = false;
		this.moveLeft = false;
		this.moveForward = true;
		this.moveRight = true;
	};
	this.onMoveFwLf = function () {
		this.moveBackward = false;
		this.moveRight = false;
		this.moveForward = true;
		this.moveLeft = true;
	};
	this.onMoveBwRt = function () {
		this.moveForward = false;
		this.moveLeft = false;
		this.moveBackward = true;
		this.moveRight = true;
	};
	this.onMoveBwLf = function () {
		this.moveForward = false;
		this.moveRight = false;
		this.moveBackward = true;
		this.moveLeft = true;
	};




	this.onRotateStopRotate = function () {
		this.turnUp = false;
		this.turnDown = false;
		this.turnRight = false;
		this.turnLeft = false;
	};
	this.onRotateUP = function () {
		this.turnUp = true;
	};
	this.onRotateDN = function () {
		this.turnDown = true;
	};
	this.onRotateRT = function () {
		this.turnRight = true;
	};
	this.onRotateLF = function () {
		this.turnLeft = true;
	};
	this.onRotateUpRt = function () {
		this.turnDown = false;
		this.turnLeft = false;
		this.turnUp = true;
		this.turnRight = true;
	};
	this.onRotateUpLf = function () {
		this.turnDown = false;
		this.turnRight = false;
		this.turnUp = true;
		this.turnLeft = true;
	};
	this.onRotateDnRt = function () {
		this.turnUp = false;
		this.turnLeft = false;
		this.turnDown = true;
		this.turnRight = true;
	};
	this.onRotateDnLf = function () {
		this.turnUp = false;
		this.turnRight = false;
		this.turnDown = true;
		this.turnLeft = true;
	};





	this.update = function (delta) {
		if (this.enabled === false) return;

		var bMoveForward = this.moveForward;
		var bMoveBackward = this.moveBackward;
		var bMoveLeft = this.moveLeft;
		var bMoveRight = this.moveRight;

		var actualLookSpeed = delta * this.lookSpeed;
		var nRotateX = 0;
		var nRotateY = 0;
		var bRun = this.run;
		var bInteract = false;

		if (this.pointerLockActive) {
			if (this.spyhole && this.spyholeElem.style.display == "none") this.spyholeElem.style.display = "block";
			nRotateX = this.mouseMovementX * actualLookSpeed * 200;
			nRotateY = this.mouseMovementY * actualLookSpeed * 200;
		}

		if (this.turnLeft) {
			nRotateX = -1500 * actualLookSpeed;
		}
		if (this.turnRight) {
			nRotateX = 1500 * actualLookSpeed;
		}

		if (this.turnUp) {
			nRotateY = -1500 * actualLookSpeed;
		}
		if (this.turnDown) {
			nRotateY = 1500 * actualLookSpeed;
		}

		if (this.mouseMovementX > 0 || this.mouseMovementY > 0) this.priorityControl = 0;

		this.mouseMovementX = 0;
		this.mouseMovementY = 0;

		//GAMEPAD CONTROLS
		if (this.hasAPIGamepad) {
			this.gamepad = navigator.getGamepads()[0];
			if (this.gamepad != null) {
				if (this.spyhole && this.spyholeElem.style.display == "none") this.spyholeElem.style.display = "block";
				bMoveRight = bMoveRight || (this.gamepad.axes[0] > 0.3);
				bMoveLeft = bMoveLeft || (this.gamepad.axes[0] < -0.3);
				bMoveBackward = bMoveBackward || (this.gamepad.axes[1] > 0.3);
				bMoveForward = bMoveForward || (this.gamepad.axes[1] < -0.3);
				if (this.gamepad.axes.length > 3) {
					if (this.gamepad.axes[2] < -0.3 || this.gamepad.axes[2] > 0.3) {
						nRotateX = this.gamepad.axes[2] * 1500 * actualLookSpeed;
						this.priorityControl = 1;
					} else {
						if (this.priorityControl == 1) nRotateX = 0;
					}
					if (this.gamepad.axes[3] < -0.3 || this.gamepad.axes[3] > 0.3) {
						nRotateY = this.gamepad.axes[3] * 1500 * actualLookSpeed;
						this.priorityControl = 1;
					} else {
						if (this.priorityControl == 1) nRotateY = 0;
					}
				}
				bRun = bRun || this.gamepad.buttons[4].pressed;
				bInteract = this.gamepad.buttons[5].pressed;
			}
		}

		if (bInteract) {
			this.interact(this.spyhole, this.object);
		}

		var actualMoveSpeed = delta * (bRun ? this.movementSpeedRun : this.movementSpeed);

		if (bMoveForward) this.object.translateZ(- (actualMoveSpeed));
		if (bMoveBackward) this.object.translateZ(actualMoveSpeed);

		if (bMoveLeft) this.object.translateX(- actualMoveSpeed);
		if (bMoveRight) this.object.translateX(actualMoveSpeed);

		this.object.position.y = this.eyeY;
		if (this.minX > this.object.position.x) {
			this.object.position.x = this.minX;
		} else if (this.maxX < this.object.position.x) {
			this.object.position.x = this.maxX;
		}
		if (this.minZ > this.object.position.z) {
			this.object.position.z = this.minZ;
		} else if (this.maxZ < this.object.position.z) {
			this.object.position.z = this.maxZ;
		}


		this.lon += nRotateX;
		this.theta = THREE.Math.degToRad(this.lon);

		this.lat -= nRotateY
		this.lat = Math.max(this.verticalMin, Math.min(this.verticalMax, this.lat));
		this.phi = THREE.Math.degToRad(90 - this.lat);

		var targetPosition = this.target,
			position = this.object.position;

		targetPosition.x = position.x + 100 * Math.sin(this.phi) * Math.cos(this.theta);
		targetPosition.y = position.y + 100 * Math.cos(this.phi);
		targetPosition.z = position.z + 100 * Math.sin(this.phi) * Math.sin(this.theta);

		this.object.lookAt(targetPosition);

	};

	this.dispose = function () {
		this.domElement.removeEventListener('mousemove', _onMouseMove, false);
		window.removeEventListener('keydown', _onKeyDown, false);
		window.removeEventListener('keyup', _onKeyUp, false);
	}

	var _onMouseDown = bind(this, this.onMouseDown);
	var _onMouseMove = bind(this, this.onMouseMove);
	var _onKeyDown = bind(this, this.onKeyDown);
	var _onKeyUp = bind(this, this.onKeyUp);

	this.domElement.addEventListener('mousedown', _onMouseDown, false);
	this.domElement.addEventListener('mousemove', _onMouseMove, false);
	window.addEventListener('keydown', _onKeyDown, false);
	window.addEventListener('keyup', _onKeyUp, false);

	function bind(scope, fn) {
		return function () {
			fn.apply(scope, arguments);
		};
	}

	this.handleResize();

};
