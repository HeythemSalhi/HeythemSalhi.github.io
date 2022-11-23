/**
 * @author Heythem Salhi 
 * @adapted_from https://threejs.org/docs
 * @REM Create nature
 */
 
$WORLD.drawNature = function () {

		var nat=$WORLD.map.nature;
		//load all sprites into memory
		var list=Object.keys(nat.patterns);
		for (var i=0;i<list.length;i++) {
			var pat=nat.patterns[list[i]];
			for (var n=0;n<pat.elements.length;n++) {
				var el=pat.elements[n];
				var mat = new THREE.SpriteMaterial( { map: $WORLD.textureLoader.load(el.object), useScreenCoordinates: false, transparent: true,fog:true} );
				var obj = new THREE.Sprite(mat);
				obj.scale.y=el.height;
				obj.scale.x=el.width;
				el._sprite = obj;
			}
		}
		
		//for each zone add the trees
		var nRandom1,nRandom2,nRandom3;
		for (var j=0;j<nat.zones.length;j++) {
			var zon=nat.zones[j];
			var pat=nat.patterns[zon.pattern];
			for (var x=zon.minX;x<zon.maxX-pat.freqX;x+=pat.freqX) {
				for (var z=zon.minZ;z<zon.maxZ-pat.freqZ;z+=pat.freqZ) {
					var nRandom1=Math.random();
					var nRandom2=Math.random();
					var nRandom3=Math.random();
					var i=Math.round(nRandom1*(pat.elements.length-1));
					var el=pat.elements[i];
					var obj2=el._sprite.clone();z
					obj2.position.set(x+(nRandom2*pat.freqX), el.height/2-0.05, z+(nRandom3*pat.freqZ));
					$WORLD.scene.add(obj2);
				}
			}
		}

		
};

