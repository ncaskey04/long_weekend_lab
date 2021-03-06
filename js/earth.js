
(function () {

  // variable set to grab div id 'webgl' in index.html
	var webglEl = document.getElementById('webgl');

  // if the Detector can't render, add error message to webgl div
	if (!Detector.webgl) {
		Detector.addGetWebGLMessage(webglEl);
		return;
	}

  // setting the width and height of the display window
	var width  = window.innerWidth,
		  height = window.innerHeight;

	// variables for Earth globe
	var radius   = 0.5,
		  segments = 32,
		  rotation = 6;

	// create new scene, camera, and renderer (needed for three.js)	
	var scene = new THREE.Scene();

  // create new camera
	var camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 1000);
	camera.position.z = 1.5;

  // renders the scene, size set to display size (width, height)
	var renderer = new THREE.WebGLRenderer();
	renderer.setSize(width, height);

  // adds lighting to the scene
	scene.add(new THREE.AmbientLight(0x333333));

  // more info about the lights (direction, color, position)
	var light = new THREE.DirectionalLight(0xffffff, 1);
	light.position.set(5,3,5);
	scene.add(light);

  // creates a sphere object using radius and segment variables
  var sphere = createSphere(radius, segments);
  // allows for sphere rotation on y axis
	sphere.rotation.y = rotation; 
	scene.add(sphere);

  // create clouds, similar setup to sphere
  var clouds = createClouds(radius, segments);
  // allows for cloud rotation on y axis
	clouds.rotation.y = rotation;
	scene.add(clouds);

  // create stars and add it to the scene
	var stars = createStars(90, 64);
	scene.add(stars);

  // setting up trackball for navigation with camera
	var controls = new THREE.TrackballControls(camera);

  // attaching renderer to the webgl div
	webglEl.appendChild(renderer.domElement);

	render();

  // render details (controls, rotation, animation frame)
	function render() {
		controls.update();
		sphere.rotation.y += 0.0005;
		clouds.rotation.y += 0.0005;		
		requestAnimationFrame(render);
		renderer.render(scene, camera);
	}

  // using mesh to wrap images around the sphere (cloudless earth img, bump map for texture, and spectral map for shine)
	function createSphere(radius, segments) {
		return new THREE.Mesh(
			new THREE.SphereGeometry(radius, segments, segments),
			new THREE.MeshPhongMaterial({
				map:         THREE.ImageUtils.loadTexture('imgs/earthmap1k.jpg'),
				bumpMap:     THREE.ImageUtils.loadTexture('imgs/earthbump1k.jpg'),
				bumpScale:   0.005,
				specularMap: THREE.ImageUtils.loadTexture('imgs/earthspec1k.jpg'),
				specular:    new THREE.Color('grey')								
			})
		);
	}

  // creating mesh to map cloud image onto sphere
	function createClouds(radius, segments) {
		return new THREE.Mesh(
			new THREE.SphereGeometry(radius + 0.003, segments, segments),			
			new THREE.MeshPhongMaterial({
				map: THREE.ImageUtils.loadTexture('imgs/earthcloudmap.jpg'),
				transparent: true
			})
		);		
	}

  // create mesh for background stars
	function createStars(radius, segments) {
		return new THREE.Mesh(
			new THREE.SphereGeometry(radius, segments, segments), 
			new THREE.MeshBasicMaterial({
				map:  THREE.ImageUtils.loadTexture('imgs/galaxy_starfield.jpg'), 
				side: THREE.BackSide
			})
		);
	}

}());