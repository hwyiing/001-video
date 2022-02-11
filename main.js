// import { loadGLTF, loadVideo } from "../../libs/loader.js";
// import { LoadingManager } from "../../libs/three.js-r132/build/three.module.js";
// import { CSS3DObject } from '../../libs/three.js-r132/examples/jsm/renderers/CSS3DRenderer.js';
import { createChromaMaterial } from './chroma-video.js';

const THREE = window.MINDAR.IMAGE.THREE;

// function createVideo(videoUrl){
//     const video = document.createElement("video");
//         if (video.canPlayType("video/mp4")) {
//             video.setAttribute('src', videoUrl);
//             video.setAttribute('preload', 'auto');
//             video.setAttribute('crossorigin', 'anonymous');
//             video.setAttribute('webkit-playsinline', 'webkit-playsinline');
//             video.setAttribute('playsinline', '');
//             video.setAttribute('loop', 'true');
//         }
//     return video; 
// }

function createVideoPlane(video, width, height) {
    const texture = new THREE.VideoTexture(video);
    const geometry = new THREE.PlaneGeometry(width, height);
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const plane = new THREE.Mesh(geometry, material);
    plane.scale.multiplyScalar(1);
    plane.position.z = -0.1;
    return plane;
}

function createGSplane(GSvideo) {
    const GStexture = new THREE.VideoTexture(GSvideo);
    const GSgeometry = new THREE.PlaneGeometry(1, 1080 / 1920);
    const GSmaterial = createChromaMaterial(GStexture, 0x00ff38);
    const GSplane = new THREE.Mesh(GSgeometry, GSmaterial);
    GSplane.scale.multiplyScalar(2);
    GSplane.position.z = 0.05;
    return GSplane
}

const loadVideos = async(associatedId) => {
    var loadedVideos = await document.querySelectorAll(associatedId);
    for (const vid of loadedVideos) {
        console.log(vid.id, vid.src);
        vid.play();
        vid.pause();
    }
    return loadedVideos;
}

document.addEventListener('DOMContentLoaded', () => {
    let loadedTriggerVids, loadedChromaVids = null;


    const init = async() => {
        // pre-load videos by getting the DOM elements
        loadedTriggerVids = await loadVideos(".trigger-vid");
        loadedChromaVids = await loadVideos(".chroma-vid");

    }

    const start = async() => {
        const mindarThree = new window.MINDAR.IMAGE.MindARThree({
            container: document.querySelector("#my-ar-container"),
            imageTargetSrc: 'targets.mind',
            uiLoading: "#loading",
        });
        const { renderer, scene, camera } = mindarThree;

        const anchors = new Array();

        for (var i = 0; i < loadedTriggerVids.length; i++) {
            console.log('hello', loadedTriggerVids[i].id);

            const plane = createVideoPlane(loadedTriggerVids[i], 1, 9 / 16);
            const GSplane = createGSplane(loadedChromaVids[i], 1, 3 / 4);
            anchors.push(mindarThree.addAnchor(i));
            console.log(anchors[i]);
            anchors[i].group.add(plane);
            anchors[i].group.add(GSplane);
            console.log('configured!', i);
        }

        for (var i = 0; i < anchors.length; i++) {
            const video = loadedTriggerVids[i];
            const GSvideo = loadedChromaVids[i];
            const anchor = anchors[i];
            anchor.onTargetFound = () => {
                video.muted = false;
                video.play();
                GSvideo.play();
            }
            anchor.onTargetLost = () => {
                video.pause();
                GSvideo.pause();
            }

            // //to skip the black screen for the chroma overlays
            GSvideo.addEventListener('play', () => {
                GSvideo.currentTime = 2;
            });
        }

        await mindarThree.start();
        renderer.setAnimationLoop(() => {
            renderer.render(scene, camera);
        });
    }

    function hideDiv() {
        var div = document.getElementById("welcome");
        div.classList.toggle('hidden');
    }

    //start button to overcome IOS browser
    const startButton = document.getElementById('startbutton');
    startButton.addEventListener('click', () => {
        init();
        hideDiv();
        startButton.style.display = "none"; //button will disappear upon click
    })

    var eventHandler = function(e) {
        start();
        // remove this handler
        document.body.removeEventListener('click', eventHandler, false);

        console.log("Added! Now removing this listener");
    }

    document.body.addEventListener("click", eventHandler);

});