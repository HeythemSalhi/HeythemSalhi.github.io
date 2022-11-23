var $RG = $RG || {};
$RG.templates=[];

$RG.Types = $RG.Types || {};
$RG.Types.type3D = { "OBJ": 0, "DAE":1, "JSON":2, "SPRITE":3 };

$RG.loadTemplates = function(fSuc, fFail, fProgress) {
	var i=0;
	var list=Object.keys($RG.templates);
	var _load = function () {
		if (list.length==i) {
			fSuc();
			return;
		}
		var ent=$RG.templates[list[i]].template3D=new $RG.Template3D(list[i]);
		if (fProgress) {fProgress(list[i],i+1,list.length);}
		i++;
		ent.load({},_load, fFail);
	}
	_load();
};

//CLASSE: Template3D    
$RG.Template3D = function (id) {
        this.id = id;
		this._template=$RG.templates[id];
        this.isReady = false;
        this.mesh = null; 
};

$RG.Template3D.prototype.load = function (oPars, fSuc, fFail) {
	var temp=this._template;
	if (!("type" in temp)) temp.type = $RG.Types.type3D.OBJ;
	if (temp.type == $RG.Types.type3D.OBJ) {
		this._loadOBJ(oPars,fSuc,fFail);
	} else if (temp.type == $RG.Types.type3D.DAE) {
		this._loadDAE(oPars,fSuc,fFail);
	} else if (temp.type == $RG.Types.type3D.SPRITE) {
		this._loadSPRITE(oPars,fSuc,fFail);
	} else {
		fFail();
	}
}

$RG.Template3D.prototype._loadOBJ = function (oPars, fSuc, fFail) {
        var $O = this;
		var temp=$O._template;
        var onProgress = function (xhr) {    };
        var onError = function (xhr) { if (fFail) { fFail($O); } };
        var mtlLoader = new THREE.MTLLoader();
        var pathArray = $O._template.model.split('/');
        var mP = '';
        for (var i = 0; i < pathArray.length-1; i++) {
            mP += pathArray[i];
            mP += "/";
        }
        var model = pathArray[pathArray.length - 1];
        mtlLoader.setPath(mP);
		model=model.substr(0,model.length - 4)
        mtlLoader.load(model + '.mtl', function (materials) {
            materials.preload();
            var objLoader = new THREE.OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.setPath(mP);
            objLoader.load(model + '.obj', function (object) {
				var mesh=null;
                object.traverse(function (child) {
                    if (child instanceof THREE.Mesh) {
                        child.castShadow = true;
						mesh=child;
                    }
                });
				
				if (temp.scale) {
					mesh.scale.x = temp.scale.x;
					mesh.scale.y = temp.scale.y;
					mesh.scale.z = temp.scale.z; //Corregir escala
				}
				if (temp.rotate) {
					if (temp.rotate.x) {
						mesh.rotateX (temp.rotate.x * Math.PI / 180);
					};
					if (temp.rotate.y) {
						mesh.rotateY (temp.rotate.y * Math.PI / 180);
					};
					if (temp.rotate.z) {
						mesh.rotateZ (temp.rotate.z * Math.PI / 180);
					}//Corregir rotación
				}
				
                $O.mesh = object;
				$O.mesh.castShadow = true;
                $O.isReady = true;
                if (fSuc) { fSuc($O); }

            }, onProgress, onError);

        }, onProgress, onError);
};

$RG.Template3D.prototype._loadDAE = function (oPars, fSuc, fFail) {
	var $O = this;
	var temp=$O._template;
    var loader = new THREE.ColladaLoader();
	var onProgress = function (xhr) {    };
    var onError = function (xhr) { if (fFail) { fFail($O); } };
    loader.load(temp.model, function (collada) {
		var object = collada.scene;
		var mesh=null;
		object.traverse(function (child) {
			if (child instanceof THREE.Mesh) {
				child.castShadow = true;
				mesh=child;
               }
		});

		if (temp.scale) {
			mesh.scale.x = temp.scale.x;
			mesh.scale.y = temp.scale.y;
			mesh.scale.z = temp.scale.z; //Corregir escala
		}
		if (temp.rotate) {
			if (temp.rotate.x) {
				mesh.rotateX (temp.rotate.x * Math.PI / 180);
			};
			if (temp.rotate.y) {
				mesh.rotateY (temp.rotate.y * Math.PI / 180);
			};
			if (temp.rotate.z) {
				mesh.rotateZ (temp.rotate.z * Math.PI / 180);
			}//Corregir rotación
		}
		$O.mesh = object;
		$O.isReady = true;
		fSuc(mesh);
    }, onProgress, onError);
};

$RG.Template3D.prototype._loadSPRITE = function (oPars, fSuc, fFail) {
	var $O = this;
	var onProgress = function (xhr) {    };
    var onError = function (xhr) { if (fFail) { fFail($O); } };
    $WORLD.textureLoader.load($O._template.model, function (texture) {
		var mat = new THREE.SpriteMaterial( { map: texture, useScreenCoordinates: false, transparent: true,fog:true} );
		var object =new THREE.Sprite(mat);
		object.scale.y=$O._template.height;
		object.scale.x=$O._template.width;
		$O.mesh = object;
		$O.isReady = true;
		fSuc($O.mesh);
    }, onProgress, onError);
};
