//gather variables
const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

//get video from webcam
function getVideo() {
    //promise to get video
    navigator.mediaDevices.getUserMedia({ video:true, audio:false})
    //create video input that the video player can use and display
        .then(localMediaStream => {
            video.src = window.URL.createObjectURL(localMediaStream);
            video.play();
        })
    //catch if the user doesn't allow webcam access
        .catch(err => {
            console.error(`Oh No!!`, err);
        })
}

//fill canvas with video at an interval
function paintToCanvas () {
    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;

    return setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height);
        //take pixels out
        let pixels = ctx.getImageData(0, 0, width, height);
        //mess with them
        pixels = redEffect(pixels);
        //pixels = rgbSplit(pixels);
        //pixels = greenScreen(pixels);
        //put them back
        ctx.putImageData(pixels, 0, 0);

    }, 16);
}

function takePhoto (){
    //play the shutte noise
    snap.currentTime = 0;
    snap.play();
    //take the data out of the canvas for snapshot function
    const data = canvas.toDataURL('image/jpeg');
    const link = document.createElement('a');
    link.href = data;
    link.setAttribute('download', 'handsome');
    link.innerHTML = `<img src="${data}" alt="Handsome Man" />`;
    strip.insertBefore(link, strip.firstChild);
}

function redEffect (pixels){
    for(let i = 0; i < pixels.data.length; i = i += 4) {
        pixels.data[i + 0] = pixels.data[i + 0] + 100; // R
        pixels.data[i + 1] = pixels.data[i + 1] - 50; // G
        pixels.data[i + 2] = pixels.data[i + 2] * 0.5 // B
    }
    return pixels;
}

function rgbSplit(pixels) {
    for(let i = 0; i < pixels.data.length; i = i += 4) {
        pixels.data[i - 500] = pixels.data[i + 0]; // R
        pixels.data[i + 100] = pixels.data[i + 1]; // G
        pixels.data[i - 500] = pixels.data[i + 2]; // B
    }
    return pixels;
}


function greenScreen(pixels) {
    const levels = {};
  
    document.querySelectorAll('.rgb input').forEach((input) => {
      levels[input.name] = input.value;
    });
  
    for (i = 0; i < pixels.data.length; i = i + 4) {
      red = pixels.data[i + 0];
      green = pixels.data[i + 1];
      blue = pixels.data[i + 2];
      alpha = pixels.data[i + 3];
  
      if (red >= levels.rmin
        && green >= levels.gmin
        && blue >= levels.bmin
        && red <= levels.rmax
        && green <= levels.gmax
        && blue <= levels.bmax) {
        // take it out!
        pixels.data[i + 3] = 0;
      }
    }
  
    return pixels;
  }

getVideo();

//add event listener to listen for when small video is playing to trigger canvas video player
video.addEventListener('canplay', paintToCanvas);