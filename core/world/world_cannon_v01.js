/**
 * @author Heythem Salhi 
 * @adapted_from https://threejs.org/docs
 * @REM define physical world
 */
var $WORLD = $WORLD || {};

$WORLD.initPhysic = function (oPars,fSuc,fFail) {
    $WORLD.physics = new CANNON.World();
    var solver = new CANNON.GSSolver();
    var world = $WORLD.physics;
    world.quatNormalizeSkip = 0;
    world.quatNormalizeFast = false;
    world.defaultContactMaterial.contactEquationStiffness = 1e9;
    world.defaultContactMaterial.contactEquationRelaxation = 4;
    solver.iterations = 7;
    solver.tolerance = 0.1;
    var split = true;
    if (split) {
        world.solver = new CANNON.SplitSolver(solver);
    } else {
        world.solver = solver;
	};
    world.gravity.set(0, -20, 0);
    world.broadphase = new CANNON.NaiveBroadphase();
    // Create a slippery material (friction coefficient = 0.0)
    var physicsMaterial = new CANNON.Material("slipperyMaterial");
    var physicsContactMaterial = new CANNON.ContactMaterial(physicsMaterial,
                                                            physicsMaterial,
                                                            0, // friction coefficient
                                                            0.3  // restitution
                                                            );
    // We must add the contact materials to the world
    world.addContactMaterial(physicsContactMaterial);

    //Create one
    var mass = 5, radius = 1.3;
    
    $WORLD.playerShape = new CANNON.Sphere(radius);
    var sphereBody = new CANNON.Body({ mass: mass });
    sphereBody.addShape($WORLD.playerShape);
    sphereBody.position.set(0, 5, 0);
    sphereBody.linearDamping = 0.9;
    world.addBody(sphereBody);
    $WORLD.playerBody = sphereBody;

    // Create a plane infinite
    var groundShape = new CANNON.Plane();
    var groundBody = new CANNON.Body({ mass: 0 });
    groundBody.addShape(groundShape);
    groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
    world.addBody(groundBody);
    fSuc();
}