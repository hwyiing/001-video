import { loadGLTF, loadVideo } from "../../libs/loader.js";
import { LoadingManager } from "../../libs/three.js-r132/build/three.module.js";
import { CSS3DObject } from '../../libs/three.js-r132/examples/jsm/renderers/CSS3DRenderer.js';
import { createChromaMaterial } from '../../libs/chroma-video.js';

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
    plane.scale.multiplyScalar(1.8);
    plane.position.z = -0.5;
    return plane;
}

function createGSplane(GSvideo) {
    const GStexture = new THREE.VideoTexture(GSvideo);
    const GSgeometry = new THREE.PlaneGeometry(1, 1080 / 1920);
    const GSmaterial = createChromaMaterial(GStexture, 0x00ff38);
    const GSplane = new THREE.Mesh(GSgeometry, GSmaterial);
    GSplane.scale.multiplyScalar(3.2);
    GSplane.position.z = 0.05;
    return GSplane
}

document.addEventListener('DOMContentLoaded', () => {
    const start = async() => {
        const mindarThree = new window.MINDAR.IMAGE.MindARThree({
            container: document.querySelector("#my-ar-container"),
            imageTargetSrc: '../../assets/targets/targets.mind',
            uiLoading: "#loading",
        });
        const { renderer, scene, camera } = mindarThree;


        //target 1 

        //const video = createVideo("https://res.cloudinary.com/daqm1fsjr/video/upload/v1641141809/thaiVideo.mp4");
        const video = document.getElementById('video-1')
        const plane = createVideoPlane(video, 1, 9 / 16);
        const anchor = mindarThree.addAnchor(0);
        anchor.group.add(plane);

        //chroma overlay for target 1 
        // const GSvideo = await loadVideo("./chromavid.mp4");

        const GSvideo = document.getElementById('GS-1');
        const GSplane = createGSplane(GSvideo);
        anchor.group.add(GSplane);

        anchor.onTargetFound = () => {
            video.muted = false;
            video.play();
            GSvideo.play();

        }
        anchor.onTargetLost = () => {
            video.pause();
            GSvideo.pause();
        }

        // target 2

        const video2 = document.getElementById('video-2');
        const plane2 = createVideoPlane(video2, 1, 3 / 4);
        const anchor2 = mindarThree.addAnchor(1);
        anchor2.group.add(plane2);

        // chroma overlay for target 3
        const GSvideo2 = document.getElementById('GS-stars');
        const GSplane2 = createGSplane(GSvideo2);
        anchor2.group.add(GSplane2)

        anchor2.onTargetFound = () => {
            video2.muted = false;
            video2.play();
        }
        anchor2.onTargetLost = () => {
            video2.pause();
            //GSvideo2.pause();
        }

        // target 3

        //const video3 = createVideo("https://res.cloudinary.com/daqm1fsjr/video/upload/v1642576736/pad%20thai.mov")
        const video3 = document.getElementById('video-3');
        const plane3 = createVideoPlane(video3, 1, 9 / 16);
        const anchor3 = mindarThree.addAnchor(2);
        anchor3.group.add(plane3);

        //chroma overlay for target 3
        const GSvideo3 = document.getElementById('GS-bestseller');
        const GSplane3 = createGSplane(GSvideo3);
        anchor3.group.add(GSplane3)

        anchor3.onTargetFound = () => {
            video3.muted = false;
            video3.play();
            GSvideo3.play();
        }
        anchor3.onTargetLost = () => {
            video3.pause();
            GSvideo3.pause();
        }

        //target 4
        //const video4 = createVideo("https://res.cloudinary.com/daqm1fsjr/video/upload/v1642576284/thaiVideo3.mp4")
        const video4 = document.getElementById('video-4');
        const plane4 = createVideoPlane(video4, 1, 9 / 16);
        const anchor4 = mindarThree.addAnchor(3);
        anchor4.group.add(plane4);

        //chroma overlay for target 4 
        const GSvideo4 = document.getElementById('GS-recipe');

        const GSplane4 = createGSplane(GSvideo4);
        anchor4.group.add(GSplane4)


        anchor4.onTargetFound = () => {
            video4.muted = false;
            video4.play();
            GSvideo4.play();
        }

        anchor4.onTargetLost = () => {
            video4.pause();
            GSvideo4.pause();
        }


        //custom video starting time 
        video4.addEventListener('play', () => {
            video4.currentTime = 10;
        });

        //to skip the black screen for the chroma overlays
        GSvideo.addEventListener('play', () => {
            GSvideo.currentTime = 2;
        });

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
        start();
        hideDiv();
        startButton.style.display = "none"; //button will disappear upon click
    })

    //document.body.appendChild(startButton);
    //start();
});