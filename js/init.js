/**
 * @author Heythem Salhi 
 * @adapted_from https://threejs.org/docs
 */

function init() {

  // use the defaults
  var renderer = initRenderer();
  var camera = initCamera();
  var scene = new THREE.Scene();
  initDefaultLighting(scene);
  var groundPlane = addLargeGroundPlane(scene)
  groundPlane.position.y = -50;

  var font_bitstream;


  var step = 0;
  var text1;
  var text2;

  var fontload1 = new THREE.FontLoader();
  fontload1.load( './font/Droid_Robot_Regular.json', function ( response ) {
    controls.font = response;
    font_bitstream = response;
    controls.redraw();
    render();
  });



  var controls = new function () {

    this.appliedMaterial = applyMeshNormalMaterial
    this.castShadow = true;
    this.groundPlaneVisible = true;

    this.size = 40;
    this.height = 15;
    this.bevelThickness = 1;
    this.bevelSize = 0.5;
    this.bevelEnabled = true;
    this.bevelSegments = 3;
    this.bevelEnabled = true;
    this.curveSegments = 12;
    this.steps = 1;
    this.fontName = "bitstream vera sans mono";

        // redraw function, updates the control UI and recreates the geometry.
    this.redraw = function () {

      switch (controls.fontName) {
        case 'bitstream vera sans mono': 
          controls.font = font_bitstream
          break;
      }

      redrawGeometryAndUpdateUI(scene, controls, function() {
            var options = {
              size: controls.size,
              height: controls.height,
              weight: controls.weight,
              font: controls.font,
              bevelThickness: controls.bevelThickness,
              bevelSize: controls.bevelSize,
              bevelSegments: controls.bevelSegments,
              bevelEnabled: controls.bevelEnabled,
              curveSegments: controls.curveSegments,
              steps: controls.steps
            };

            var geom = new THREE.TextGeometry("Hello from\nHeythem\'s website", options)
            geom.applyMatrix(new THREE.Matrix4().makeScale(0.09,0.09,0.09));
            geom.center();
    
            return geom
          });
        };
      };




  function render() {
    controls.mesh.rotation.y = step-=0.001
    controls.mesh.rotation.x = step-=0.0001
    controls.mesh.rotation.z = step+=0.0001

    // render using requestAnimationFrame
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }
}