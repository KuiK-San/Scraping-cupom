document.addEventListener("DOMContentLoaded", () => {
    const resultDiv = document.getElementById("result");
    
    const video = document.getElementById("video");

    navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "environment" } })
        .then((stream) => {
            video.srcObject = stream;
            video.play();
            requestAnimationFrame(tick);
        })
        .catch((error) => {
            console.error("Erro ao acessar a câmera: ", error);
        });

    function tick() {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            const canvas = document.createElement("canvas");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext("2d");
            context.drawImage(
                video,
                0,
                0,
                canvas.width,
                canvas.height
            );
            const imageData = context.getImageData(
                0,
                0,
                canvas.width,
                canvas.height
            );
            const code = jsQR(
                imageData.data,
                imageData.width,
                imageData.height,
                {
                    inversionAttempts: "dontInvert",
                }
            );

            if (code) {
                document.querySelector(
                    "div"
                ).innerHTML = `QR Code detectado <span id="data-code">${code.data}</span>`;
            }

            requestAnimationFrame(tick);
        } else {
            requestAnimationFrame(tick);
        }
    }
});