const chroma = (config) => {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');

    const chromakey = (ctx, video, width, height) => {
        ctx.drawImage(video, 0, 0, width, height);
        const imageData = ctx.getImageData(0, 0, width, height);
        const limit = imageData.data.length / 4;
        for(let i = 0; i <= limit; i++) {
            const offset = i * 4;

            const red = imageData.data[offset + 0];
            const green = imageData.data[offset + 1];
            const blue = imageData.data[offset + 2];
            
            
            //check color to replace
            switch(config.color) {
                case 'red':
                    if(red > parseInt(config.value) && red > green && red > blue ) {
                        imageData.data[offset + 3] = 0;
                    }
                    break;
                case 'green':
                    if(green > parseInt(config.value) && green > red && green > blue ) {
                        imageData.data[offset + 3] = 0;
                    }
                    break;
                case 'blue':
                    if(blue > parseInt(config.value) && blue > red && blue > green ) {
                        imageData.data[offset + 3] = 0;
                    }
                    break;
            }

        }

        ctx.putImageData(imageData, 0, 0);
    };

    const ctx = canvas.getContext('2d');

    navigator.mediaDevices.getUserMedia({
        video: true,
    })
    .then((stream) => {
        video.srcObject = stream;
    });

    video.addEventListener('loadeddata', () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        window.setInterval(() => {
            chromakey(ctx, video, canvas.width, canvas.height);
        }, 40);
    });

};
