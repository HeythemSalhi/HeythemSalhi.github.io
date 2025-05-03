
/**
 * @author Heythem Salhi 
 * @adapted_from https://threejs.org/docs
 * @REM add cube with video texture and click interaction , the video is resized to fit the cube
 */

$WORLD.drawCubeVideo = function (myX, myY, myZ, myRotY, myRotX, myVideoPath) {
    // Create a video element
    var video = document.createElement('video');
    video.src = myVideoPath;
    video.crossOrigin = 'anonymous';
    video.loop = true; // Keep looping enabled for when video plays
    video.muted = true; // Start muted to handle autoplay restrictions
    video.playsInline = true; // For iOS support
    video.volume = 0.5;
  
  // Create a canvas to draw the video with preserved aspect ratio
  var canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 614; // match cube aspect ratio (6:3.6 = 5:3 = ~1024:614)
  
  var ctx = canvas.getContext('2d');
  
  // Create a texture from the canvas
  var videoTexture = new THREE.CanvasTexture(canvas);
  videoTexture.minFilter = THREE.LinearFilter;
  videoTexture.magFilter = THREE.LinearFilter;
  videoTexture.format = THREE.RGBFormat;
  
  // Update canvas texture on each frame
  function updateCanvas() {
      if (video.readyState >= video.HAVE_CURRENT_DATA) {
          // Clear canvas
          ctx.fillStyle = 'black';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
  
          const zoomFactor = 1.8; // Increase this to make the video appear larger
  
          // Compute scaled dimensions
          var vidAspect = video.videoWidth / video.videoHeight;
          var canvasAspect = canvas.width / canvas.height;
  
          var drawWidth, drawHeight, offsetX, offsetY;
  
          if (vidAspect > canvasAspect) {
            drawWidth = canvas.width * zoomFactor;
            drawHeight = (canvas.width / vidAspect) * zoomFactor;
            offsetX = (canvas.width - drawWidth) / 2;
            offsetY = (canvas.height - drawHeight) / 2;
        } else {
            drawHeight = canvas.height * zoomFactor;
            drawWidth = (canvas.height * vidAspect) * zoomFactor;
            offsetX = (canvas.width - drawWidth) / 2;
            offsetY = (canvas.height - drawHeight) / 2;
        }
  
          ctx.drawImage(video, offsetX, offsetY, drawWidth, drawHeight);
          videoTexture.needsUpdate = true;
      }
  
      requestAnimationFrame(updateCanvas);
  }
  updateCanvas();
  
    
    // Create a cube
    var cubeGeometry = new THREE.BoxGeometry(6, 3.6, 0.01);
    
    // Create material with video texture
    var cubeMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        map: videoTexture
    });
    
    var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.castShadow = true;
    
    cube.position.x = myX;
    cube.position.y = myY;
    cube.position.z = myZ;
    cube.rotation.y = myRotY;
    cube.rotation.x = myRotX;
    
    
    
    // Add the cube to the scene
    $WORLD.scene.add(cube);
    
    // Make the cube interactive and store the video object
    cube.userData.video = video;
    
    // Initialize video in paused state
    video.pause();
  
    // Add the cube to interactive objects array
    if (!$WORLD.interactiveObjects) {
        $WORLD.interactiveObjects = [];
        $WORLD.setupInteraction();
    }
    $WORLD.interactiveObjects.push(cube);
    
    return {
        cube: cube,
        video: video
    };
  };
  
  // Interaction setup remains the same
  if (!$WORLD.setupInteraction) {
    $WORLD.setupInteraction = function() {
        // Create a raycaster for mouse interaction
        $WORLD.raycaster = new THREE.Raycaster();
        $WORLD.mouse = new THREE.Vector2();
        
        // Add click event listener to the renderer's DOM element
        $WORLD.renderer.domElement.addEventListener('click', function(event) {
            // Calculate mouse position in normalized device coordinates (-1 to +1)
            var rect = $WORLD.renderer.domElement.getBoundingClientRect();
            $WORLD.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            $WORLD.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            
            // Update the raycaster
            $WORLD.raycaster.setFromCamera($WORLD.mouse, $WORLD.camera);
            
            // Check for intersections with interactive objects
            var intersects = $WORLD.raycaster.intersectObjects($WORLD.interactiveObjects);
            
            if (intersects.length > 0) {
                // Get the first intersected object
                var object = intersects[0].object;
                
                // If the object has a video attached
                if (object.userData.video) {
                    var video = object.userData.video;
                    
                    // Toggle play/pause
                    if (video.paused) {
                        // If video is paused, play it and ensure sound is on
                        video.muted = false;
                        video.play().then(function() {
                            console.log("Video resumed with sound");
                        }).catch(function(error) {
                            console.error("Failed to resume video:", error);
                        });
                    } else {
                        // If video is playing, pause it
                        video.pause();
                        console.log("Video paused");
                    }
                }
            }
        });
    };
  }
  