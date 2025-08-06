/**
 * @author Heythem Salhi
 * @adapted_from https://threejs.org/docs
 * @REM add cube with video texture and click interaction , the video is resized to fit the cube
 */

$WORLD.drawCubeVideo = function (
  myX,
  myY,
  myZ,
  myRotY,
  myRotX,
  myVideoPath,
  zoomFactor
) {
  // Create a video element
  var video = document.createElement("video");
  video.src = myVideoPath;
  video.crossOrigin = "anonymous";
  video.loop = true; // Keep looping enabled for when video plays
  video.muted = true; // Start muted to handle autoplay restrictions
  video.playsInline = true; // For iOS support
  video.volume = 0.5;
  video.preload = "metadata"; // Load metadata to get first frame

  // Create a canvas to draw the video with preserved aspect ratio
  var canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 614; // match cube aspect ratio (6:3.6 = 5:3 = ~1024:614)

  var ctx = canvas.getContext("2d");

  // Create a texture from the canvas
  var videoTexture = new THREE.CanvasTexture(canvas);
  videoTexture.minFilter = THREE.LinearFilter;
  videoTexture.magFilter = THREE.LinearFilter;
  videoTexture.format = THREE.RGBFormat;

  // Function to draw video frame to canvas
  function drawVideoFrame() {
    if (video.readyState >= video.HAVE_CURRENT_DATA) {
      // Clear canvas
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      //   const zoomFactor = 1.8; // Increase this to make the video appear larger

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
        drawWidth = canvas.height * vidAspect * zoomFactor;
        offsetX = (canvas.width - drawWidth) / 2;
        offsetY = (canvas.height - drawHeight) / 2;
      }

      ctx.drawImage(video, offsetX, offsetY, drawWidth, drawHeight);
      videoTexture.needsUpdate = true;
    }
  }

  // Update canvas texture on each frame when playing
  function updateCanvas() {
    if (!video.paused && !video.ended) {
      drawVideoFrame();
    }
    requestAnimationFrame(updateCanvas);
  }
  updateCanvas();

  // Load preview frame when video metadata is loaded
  video.addEventListener("loadedmetadata", function () {
    video.currentTime = 0.5; // Seek to 0.5 seconds for preview
  });

  // Draw preview frame when seeked
  video.addEventListener("seeked", function () {
    if (video.paused) {
      drawVideoFrame();
    }
  });

  // Create a cube
  var cubeGeometry = new THREE.BoxGeometry(6, 3.6, 0.01);

  // Create material with video texture
  var cubeMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    map: videoTexture,
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
  }

  // Setup unified interaction system if not already done
  if (!$WORLD.videoInteractionSetup) {
    $WORLD.setupVideoInteraction();
    $WORLD.videoInteractionSetup = true;
  }

  $WORLD.interactiveObjects.push(cube);

  return {
    cube: cube,
    video: video,
  };
};

// video cube with expand functionality

$WORLD.drawCubeVideoExpandable = function (
  myX,
  myY,
  myZ,
  myRotY,
  myRotX,
  myVideoPath,
  isMinature,
  zoomFactor,
  expandedX,
  expandedY,
  expandedZ
) {
  console.log("drawCubeVideoExpandable called with:", {
    myX,
    myY,
    myZ,
    myRotY,
    myRotX,
    myVideoPath,
    isMinature,
    expandedX,
    expandedY,
    expandedZ,
  });

  isMinature = isMinature !== undefined ? isMinature : true;

  // Create a video element
  var video = document.createElement("video");
  video.src = myVideoPath;
  video.crossOrigin = "anonymous";
  video.loop = true;
  video.muted = true;
  video.playsInline = true;
  video.volume = 0.5;
  video.preload = "metadata"; // Load metadata to get first frame

  // Create a canvas to draw the video
  var canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 614;

  var ctx = canvas.getContext("2d");

  // Create a texture from the canvas
  var videoTexture = new THREE.CanvasTexture(canvas);
  videoTexture.minFilter = THREE.LinearFilter;
  videoTexture.magFilter = THREE.LinearFilter;
  videoTexture.format = THREE.RGBFormat;

  // Function to draw video frame to canvas
  function drawVideoFrame() {
    if (video.readyState >= video.HAVE_CURRENT_DATA) {
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

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
        drawWidth = canvas.height * vidAspect * zoomFactor;
        offsetX = (canvas.width - drawWidth) / 2;
        offsetY = (canvas.height - drawHeight) / 2;
      }

      ctx.drawImage(video, offsetX, offsetY, drawWidth, drawHeight);
      videoTexture.needsUpdate = true;
    }
  }

  // Update canvas texture on each frame when playing
  function updateCanvas() {
    if (!video.paused && !video.ended) {
      drawVideoFrame();
    }
    requestAnimationFrame(updateCanvas);
  }
  updateCanvas();

  // Load preview frame when video metadata is loaded
  video.addEventListener("loadedmetadata", function () {
    video.currentTime = 0.5; // Seek to 0.5 seconds for preview
  });

  // Draw preview frame when seeked
  video.addEventListener("seeked", function () {
    if (video.paused) {
      drawVideoFrame();
    }
  });

  // Create cube with different sizes for miniature
  var cubeSize = isMinature
    ? { width: 1.5, height: 0.9, depth: 0.01 }
    : { width: 6, height: 3.6, depth: 0.01 };
  var cubeGeometry = new THREE.BoxGeometry(
    cubeSize.width,
    cubeSize.height,
    cubeSize.depth
  );

  // Create material with video texture
  var cubeMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    map: videoTexture,
  });

  var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cube.castShadow = true;

  cube.position.x = myX;
  cube.position.y = myY;
  cube.position.z = myZ;
  cube.rotation.y = myRotY;
  cube.rotation.x = myRotX;

  // Store original and expanded properties
  cube.userData.video = video;
  cube.userData.isMinature = isMinature;
  cube.userData.originalPosition = { x: myX, y: myY, z: myZ };
  cube.userData.originalRotation = { x: myRotX, y: myRotY };
  cube.userData.originalScale = { x: 1, y: 1, z: 1 };
  cube.userData.isExpanded = false;

  // Store expanded position
  if (
    typeof expandedX === "number" &&
    typeof expandedY === "number" &&
    typeof expandedZ === "number"
  ) {
    cube.userData.expandedPosition = {
      x: expandedX,
      y: expandedY,
      z: expandedZ,
    };
  } else {
    cube.userData.expandedPosition = null;
  }

  // Add event listener for when video ends
  video.addEventListener("ended", function () {
    if (cube.userData.isExpanded) {
      console.log("Video ended, returning to miniature");
      $WORLD.contractVideo(cube);
      video.currentTime = 0; // Reset video to beginning for next play
    }
  });

  // Add the cube to the scene
  $WORLD.scene.add(cube);

  // Add to interactive objects
  if (!$WORLD.interactiveObjects) {
    $WORLD.interactiveObjects = [];
  }

  // Setup unified interaction system
  if (!$WORLD.videoInteractionSetup) {
    $WORLD.setupVideoInteraction();
    $WORLD.videoInteractionSetup = true;
  }

  $WORLD.interactiveObjects.push(cube);
  console.log(
    "Added expandable video cube to interactive objects. Total:",
    $WORLD.interactiveObjects.length
  );
  console.log("Cube userData:", cube.userData);

  // Initialize video in paused state
  video.pause();

  return {
    cube: cube,
    video: video,
  };
};

// Global helper functions for video animation
$WORLD.expandVideo = function (cube) {
  console.log("expandVideo called for cube:", cube.userData);

  cube.userData.isExpanded = true;

  var expandedPosition;
  if (cube.userData.expandedPosition) {
    expandedPosition = cube.userData.expandedPosition;
  } else {
    expandedPosition = { x: 159, y: 3.0, z: 145 };
  }

  console.log("Current position:", cube.position);
  console.log("Target position:", expandedPosition);

  var expandedScale = { x: 3.5, y: 3.5, z: 1 };

  $WORLD.animateTransform(cube, expandedPosition, expandedScale, 3000);

  console.log("Video panel moved to front of slide 7 and expanded");
};

$WORLD.contractVideo = function (cube) {
  cube.userData.isExpanded = false;

  $WORLD.animateTransform(
    cube,
    cube.userData.originalPosition,
    cube.userData.originalScale,
    1500
  );

  console.log("Video panel returned to original miniature location");
};

$WORLD.animateTransform = function (
  cube,
  targetPosition,
  targetScale,
  duration
) {
  console.log("animateTransform called:", {
    currentPos: cube.position,
    targetPos: targetPosition,
    currentScale: cube.scale,
    targetScale: targetScale,
    duration: duration,
  });

  // Interrupt previous animation
  if (cube.userData.animationFrameId) {
    cancelAnimationFrame(cube.userData.animationFrameId);
    cube.userData.animationFrameId = null;
  }

  var startPosition = {
    x: cube.position.x,
    y: cube.position.y,
    z: cube.position.z,
  };
  var startScale = { x: cube.scale.x, y: cube.scale.y, z: cube.scale.z };
  var startTime = Date.now();

  var isExpanding = Math.abs(targetScale.x) > Math.abs(startScale.x);
  var midPosition;
  if (isExpanding) {
    midPosition = {
      x: targetPosition.x,
      y: startPosition.y,
      z: startPosition.z,
    };
  } else {
    midPosition = {
      x: startPosition.x,
      y: targetPosition.y,
      z: startPosition.z,
    };
  }

  var halfDuration = duration / 2;

  function animateLShape() {
    var elapsed = Date.now() - startTime;
    if (isExpanding) {
      if (elapsed < halfDuration) {
        var progress = Math.min(elapsed / halfDuration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        cube.position.x =
          startPosition.x + (midPosition.x - startPosition.x) * eased;
        cube.position.y =
          startPosition.y + (targetPosition.y - startPosition.y) * eased * 0.5;
        cube.position.z = startPosition.z;
        cube.scale.x =
          startScale.x + (targetScale.x - startScale.x) * eased * 0.5;
        cube.scale.y =
          startScale.y + (targetScale.y - startScale.y) * eased * 0.5;
        cube.scale.z =
          startScale.z + (targetScale.z - startScale.z) * eased * 0.5;
        cube.userData.animationFrameId = requestAnimationFrame(animateLShape);
      } else if (elapsed < duration) {
        var progress = Math.min((elapsed - halfDuration) / halfDuration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        cube.position.x = midPosition.x;
        cube.position.y =
          startPosition.y +
          (targetPosition.y - startPosition.y) * (0.5 + eased * 0.5);
        cube.position.z =
          startPosition.z + (targetPosition.z - startPosition.z) * eased;
        cube.scale.x =
          startScale.x + (targetScale.x - startScale.x) * (0.5 + eased * 0.5);
        cube.scale.y =
          startScale.y + (targetScale.y - startScale.y) * (0.5 + eased * 0.5);
        cube.scale.z =
          startScale.z + (targetScale.z - startScale.z) * (0.5 + eased * 0.5);
        cube.userData.animationFrameId = requestAnimationFrame(animateLShape);
      } else {
        cube.position.x = targetPosition.x;
        cube.position.y = targetPosition.y;
        cube.position.z = targetPosition.z;
        cube.scale.x = targetScale.x;
        cube.scale.y = targetScale.y;
        cube.scale.z = targetScale.z;
        cube.userData.animationFrameId = null;
        console.log(
          "Animation completed. Final position:",
          cube.position,
          "Final scale:",
          cube.scale
        );
      }
    } else {
      if (elapsed < halfDuration) {
        var progress = Math.min(elapsed / halfDuration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        cube.position.x = startPosition.x;
        cube.position.y =
          startPosition.y + (targetPosition.y - startPosition.y) * eased * 0.5;
        cube.position.z =
          startPosition.z + (targetPosition.z - startPosition.z) * eased;
        cube.scale.x =
          startScale.x + (targetScale.x - startScale.x) * eased * 0.5;
        cube.scale.y =
          startScale.y + (targetScale.y - startScale.y) * eased * 0.5;
        cube.scale.z =
          startScale.z + (targetScale.z - startScale.z) * eased * 0.5;
        cube.userData.animationFrameId = requestAnimationFrame(animateLShape);
      } else if (elapsed < duration) {
        var progress = Math.min((elapsed - halfDuration) / halfDuration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        cube.position.x =
          startPosition.x + (targetPosition.x - startPosition.x) * eased;
        cube.position.y =
          startPosition.y +
          (targetPosition.y - startPosition.y) * (0.5 + eased * 0.5);
        cube.position.z = targetPosition.z;
        cube.scale.x =
          startScale.x + (targetScale.x - startScale.x) * (0.5 + eased * 0.5);
        cube.scale.y =
          startScale.y + (targetScale.y - startScale.y) * (0.5 + eased * 0.5);
        cube.scale.z =
          startScale.z + (targetScale.z - startScale.z) * (0.5 + eased * 0.5);
        cube.userData.animationFrameId = requestAnimationFrame(animateLShape);
      } else {
        cube.position.x = targetPosition.x;
        cube.position.y = targetPosition.y;
        cube.position.z = targetPosition.z;
        cube.scale.x = targetScale.x;
        cube.scale.y = targetScale.y;
        cube.scale.z = targetScale.z;
        cube.userData.animationFrameId = null;
        console.log(
          "Animation completed. Final position:",
          cube.position,
          "Final scale:",
          cube.scale
        );
      }
    }
  }

  animateLShape();
};

// Unified interaction setup for all video cubes
$WORLD.setupVideoInteraction = function () {
  console.log("Setting up unified video interaction system");

  // Create a raycaster for mouse interaction
  if (!$WORLD.raycaster) {
    $WORLD.raycaster = new THREE.Raycaster();
    $WORLD.mouse = new THREE.Vector2();
  }

  // Remove any existing click listeners to avoid duplicates
  if ($WORLD.videoClickHandler) {
    $WORLD.renderer.domElement.removeEventListener(
      "click",
      $WORLD.videoClickHandler
    );
  }

  // Create the click handler function
  $WORLD.videoClickHandler = function (event) {
    console.log("Video click detected");

    // Calculate mouse position in normalized device coordinates
    var rect = $WORLD.renderer.domElement.getBoundingClientRect();
    $WORLD.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    $WORLD.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // Update the raycaster
    $WORLD.raycaster.setFromCamera($WORLD.mouse, $WORLD.camera);

    // Check for intersections with interactive objects
    var intersects = $WORLD.raycaster.intersectObjects(
      $WORLD.interactiveObjects
    );

    if (intersects.length > 0) {
      var object = intersects[0].object;
      console.log("Object clicked:", object.userData);

      // Handle expandable video cubes
      if (object.userData.video && object.userData.isMinature !== undefined) {
        console.log("Expandable video cube clicked");
        handleExpandableVideoClick(object);
      }
      // Handle regular video cubes (backward compatibility)
      else if (object.userData.video) {
        console.log("Regular video cube clicked");
        var video = object.userData.video;
        if (video.paused) {
          video.muted = false;
          video
            .play()
            .then(function () {
              console.log("Regular video resumed with sound");
            })
            .catch(function (error) {
              console.error("Failed to resume regular video:", error);
            });
        } else {
          video.pause();
          console.log("Regular video paused");
        }
      }
    }
  };

  // Add the unified click event listener
  $WORLD.renderer.domElement.addEventListener(
    "click",
    $WORLD.videoClickHandler
  );

  function handleExpandableVideoClick(cube) {
    console.log("Handling expandable video click");
    var video = cube.userData.video;

    if (cube.userData.isMinature && !cube.userData.isExpanded) {
      console.log("Expanding video...");

      // contract any other expanded video cubes
      if ($WORLD.interactiveObjects) {
        $WORLD.interactiveObjects.forEach(function (obj) {
          if (
            obj.userData.isMinature &&
            obj.userData.isExpanded &&
            obj !== cube
          ) {
            console.log("Contracting previously expanded video");
            // Pause video immediately if contracting due to interruption
            if (obj.userData.video && !obj.userData.video.paused) {
              obj.userData.video.pause();
              console.log("Paused video due to interrupt.");
            }
            obj.userData.video.pause();
            $WORLD.contractVideo(obj);
          }
        });
      }

      // expand the clicked miniature then start playing the video
      $WORLD.expandVideo(cube);
      // Cancel any previous pending play timeout
      if (cube.userData.playTimeoutId) {
        clearTimeout(cube.userData.playTimeoutId);
        cube.userData.playTimeoutId = null;
      }
      // Start video playback after expansion animation delay
      cube.userData.playTimeoutId = setTimeout(function () {
        // Only play if still expanded
        if (cube.userData.isExpanded) {
          video.muted = false;
          video.currentTime = 0; // Start from beginning
          video
            .play()
            .then(function () {
              console.log("Video started playing in expanded mode");
            })
            .catch(function (error) {
              console.error("Failed to start video:", error);
            });
        }
        cube.userData.playTimeoutId = null;
      }, 3000); 
    } else if (cube.userData.isExpanded) {
      console.log("Contracting video...");
      // If expanded, pause video immediately and contract back to miniature
      if (cube.userData.playTimeoutId) {
        clearTimeout(cube.userData.playTimeoutId);
        cube.userData.playTimeoutId = null;
      }
      if (video && !video.paused) {
        video.pause();
        console.log("Paused video due to shrink.");
      }
      $WORLD.contractVideo(cube);
      console.log("Video paused and contracted manually");
    }
  }
};
