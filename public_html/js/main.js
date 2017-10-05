var sceneKylpy, sceneBG, camera, cameraBG, webGLRenderer;
var filter = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;
var fileReader = new FileReader();
var innerblue;
function init() {

    sceneKylpy = new THREE.Scene();
    sceneBG = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    cameraBG = new THREE.OrthographicCamera(-window.innerWidth, window.innerWidth, window.innerHeight, -window.innerHeight, -10000, 10000);
    // create render
    webGLRenderer = new THREE.WebGLRenderer();
    webGLRenderer.setClearColor(new THREE.Color(0x000, 1.0));
    webGLRenderer.setSize(window.innerWidth, window.innerHeight);
    webGLRenderer.shadowMap.enabled = true;

    var power, capblack, outter, pipe, humist, bottom;
    var loader = new THREE.JSONLoader();
    loader.load("asset/power.js", function (geometry, mat) {
        power = new THREE.Mesh(geometry, mat[0]);
        power.scale.x = 15;
        power.scale.y = 15;
        power.scale.z = 15;
        sceneKylpy.add(power);
    });
    loader.load("asset/capblack.js", function (geometry, mat) {
        capblack = new THREE.Mesh(geometry, mat[0]);
        capblack.scale.x = 15;
        capblack.scale.y = 15;
        capblack.scale.z = 15;
        sceneKylpy.add(capblack);
    });
    loader.load("asset/innerblue.js", function (geometry, mat) {
        innerblue = new THREE.Mesh(geometry, mat[0]);
        innerblue.scale.x = 15;
        innerblue.scale.y = 15;
        innerblue.scale.z = 15;
        sceneKylpy.add(innerblue);
    });
    loader.load("asset/outter.js", function (geometry, mat) {
        outter = new THREE.Mesh(geometry, mat[0]);
        outter.scale.x = 15;
        outter.scale.y = 15;
        outter.scale.z = 15;
        sceneKylpy.add(outter);
    });
    loader.load("asset/pipe.js", function (geometry, mat) {
        pipe = new THREE.Mesh(geometry, mat[0]);
        pipe.scale.x = 15;
        pipe.scale.y = 15;
        pipe.scale.z = 15;
        sceneKylpy.add(pipe);
    });
    loader.load("asset/humist.js", function (geometry, mat) {
        humist = new THREE.Mesh(geometry, mat[0]);
        humist.scale.x = 15;
        humist.scale.y = 15;
        humist.scale.z = 15;
        sceneKylpy.add(humist);
    });
    loader.load("asset/bottom.js", function (geometry, mat) {
        bottom = new THREE.Mesh(geometry, mat[0]);
        bottom.scale.x = 15;
        bottom.scale.y = 15;
        bottom.scale.z = 15;
        sceneKylpy.add(bottom);
    });

    // position the camera 
    camera.position.x = 50;
    camera.position.y = 80;
    camera.position.z = 40;

    var orbitControls = new THREE.OrbitControls(camera);

    //for rotation
    var clock = new THREE.Clock();
    var delta = clock.getDelta();

    var ambientLight = new THREE.AmbientLight(0x383838);
    sceneKylpy.add(ambientLight);

    // add spotlight
    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(300, 300, 300);
    spotLight.intensity = 1;
    sceneKylpy.add(spotLight);

    fileReader.onload = function (event) {
        try {
            localStorage.setItem("b", event.target.result);
        } catch (DOMException) {
            alert("Image size too large! Choose another image or clear localStorage.")
        }
        try {
            switchBackground();
        } catch (e) {
            console.log(e);
        }
        location.reload();
    };

    //declare local storage chosen file
    var backgroundImagePath = localStorage.getItem("b");

    //set custom background
    function switchBackground()
    {
        var background = new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture(backgroundImagePath),
            depthTest: false
        });
        var bgPlane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), background);
        bgPlane.position.z = -100;
        bgPlane.scale.set(window.innerWidth * 2, window.innerHeight * 2, 1);
        sceneBG.add(bgPlane);
    }

    if (backgroundImagePath === null)
    {
        var background = new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture("asset/bg/bg.jpg"),
            depthTest: false
        });
        var bgPlane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), background);
        bgPlane.position.z = -100;
        bgPlane.scale.set(window.innerWidth * 2, window.innerHeight * 2, 1);
        sceneBG.add(bgPlane);
    } else {
        $(switchBackground);
    }
    // append renderer output to HTML
    document.getElementById("WebGL").appendChild(webGLRenderer.domElement);
    //add event mouse click to select object
    document.addEventListener('mousedown', onDocumentMouseDown, false);
    //add two scenes together
    var bgPass = new THREE.RenderPass(sceneBG, cameraBG);
    var renderPass = new THREE.RenderPass(sceneKylpy, camera);
    renderPass.clear = false;
    var effectCopy = new THREE.ShaderPass(THREE.CopyShader);
    effectCopy.renderToScreen = true;

    // render 2 scenes to one image
    var composer = new THREE.EffectComposer(webGLRenderer);
    composer.renderTarget1.stencilBuffer = true;
    composer.addPass(bgPass);
    composer.addPass(renderPass);
    composer.addPass(effectCopy);

    //create material for inner
    var blackMaterial = new THREE.MeshPhongMaterial({
        color: 0x323232
    });
    var grayMaterial = new THREE.MeshPhongMaterial({
        color: 0xcccccc
    });
    var blueMaterial = new THREE.MeshPhongMaterial({
        color: 0x008B8B
    });
    //function select object
    function onDocumentMouseDown(event) {

        var vector = new THREE.Vector3((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1, 0.5);
        vector = vector.unproject(camera);
        var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
        var intersects = raycaster.intersectObjects([innerblue]);
        if (intersects.length > 0) {

            //create popup
            function popUp() {
                var popup = document.createElement("div");
                popup.className = "popup";
                popup.id = "test";
                var cancel = document.createElement("div");
                cancel.className = "cancel";
                cancel.innerHTML = "X";
                cancel.onclick = function (event) {
                    popup.parentNode.removeChild(popup)
                };
                var innerBlue = document.createElement("input");
                innerBlue.type = "button";
                innerBlue.id = "innerBlueCSS";
                innerBlue.onclick = function () {
                    inner.traverse(function (child) {
                        if (child instanceof THREE.Mesh) {
                            child.material = blueMaterial;
                        }
                    });
                }

                var innerBlack = document.createElement("input");
                innerBlack.type = "button";
                innerBlack.id = "innerBlackCSS";
                innerBlack.onclick = function () {
                    inner.traverse(function (child) {
                        if (child instanceof THREE.Mesh) {
                            child.material = blackMaterial;
                        }
                    });
                }

                var innerGray = document.createElement("input");
                innerGray.type = "button";
                innerGray.id = "innerGrayCSS";
                innerGray.onclick = function () {
                    inner.traverse(function (child) {
                        if (child instanceof THREE.Mesh) {
                            child.material = grayMaterial;
                        }
                    });
                }

                popup.appendChild(innerBlue);
                popup.appendChild(innerBlack);
                popup.appendChild(innerGray);
                popup.appendChild(cancel);
                document.body.appendChild(popup);
            }
            $(popUp);
        }
    }

    //add controls
    var panel = new function () {
        this.message = "Click inner toggle color";
        this.rotate = false;
        this.capColor = "blue";
        this.custom = "Coming soon...";

        this.addCap = function () {
            sceneKylpy.add(capblack);
        };

        this.removeCap = function () {
            sceneKylpy.remove(capblack);
        };

        this.savePosition = function () {
            var setPositionObject = {
                camPosition: camera.position.clone(),
                camPan: orbitControls.target.clone()
            }
            var setPositionJson = JSON.stringify(setPositionObject);
            localStorage.setItem("positionJson", setPositionJson);
            console.log(setPositionJson);
            alert("Position saved!");
        };

        this.restorePosition = function () {
            var getPositionJson = localStorage.getItem("positionJson");
            var getPositionObject = JSON.parse(getPositionJson);

            //restore camera position and orbitControls target
            camera.position.set(getPositionObject.camPosition.x, getPositionObject.camPosition.y, getPositionObject.camPosition.z);
            orbitControls.target.set(getPositionObject.camPan.x, getPositionObject.camPan.y, getPositionObject.camPan.z);

            console.log(getPositionObject);
        };
    };
    var gui = new dat.GUI();
    gui.add(panel, "message");
    gui.add(panel, "rotate");
    gui.add(panel, "addCap");
    gui.add(panel, "removeCap");
    gui.add(panel, "savePosition");
    gui.add(panel, "restorePosition");
    //add folder
    var customizeFolder = gui.addFolder("Customize");
    customizeFolder.add(panel, "custom");

    render();
    function render() {
        webGLRenderer.autoClear = false;
        orbitControls.update(delta);
        if (panel.rotate) {
            if (power) {
                try {
                    power.rotation.y += 0.001;
                    capblack.rotation.y += 0.001;
                    outter.rotation.y += 0.001;
                    pipe.rotation.y += 0.001;
                    humist.rotation.y += 0.001;
                    innerblue.rotation.y += 0.001;
                    bottom.rotation.y += 0.001;
                } catch (e) {
                    console.log("Rotation error");
                }
            }
        }
        // render using requestAnimationFrame
        requestAnimationFrame(render);
        composer.render(delta);
        composer.render();
    }
}

function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    cameraBG.aspect = window.innerWidth / window.innerHeight;
    cameraBG.updateProjectionMatrix();
    webGLRenderer.setSize(window.innerWidth, window.innerHeight);
}

function loadImageFile(chosenFile) {
    if (!chosenFile.files.length) {
        return;
    }
    var oFile = chosenFile.files[0];
    if (!filter.test(oFile.type)) {
        alert("File format invalid!");
        return;
    }
    fileReader.readAsDataURL(oFile);
}

function removeImageFile() {
    localStorage.removeItem("b");
    location.reload();
}

window.onload = init;

//save camera position when user leave page
//window.onbeforeunload = function () {
//    var setPositionObject = {
//        camX: camera.position.x,
//        camY: camera.position.y,
//        camZ: camera.position.z,
//        camPan: orbitControls.target.clone()
//    }
//    var setPositionJson = JSON.stringify(setPositionObject);
//    localStorage.setItem("positionJson", setPositionJson);
//    console.log(setPositionJson);
//};

window.addEventListener('resize', onResize, false);