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
                setTimeout(() => {
                    document.querySelector(
                        "#link"
                    ).innerHTML = `<p>QR Code detectado <span id="data-code">${code.data}</span></p>`;
                    document.querySelector('#enviar').style.display = 'block'

                }, 2000)
            }

            requestAnimationFrame(tick);
        } else {
            requestAnimationFrame(tick);
        }
    }
    document.querySelector('#enviar').addEventListener('click', () => {
        let url = document.querySelector("#data-code").textContent
        document.querySelector('#response').innerHTML = `<p>Enviando nota...</p>`
        fetch('/api/NFScrapping', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({url: url})
        })
        .then(response => response.text())
        .then(data => {
            document.querySelector('#response').innerHTML = `<p>${data}</p>`
            console.log(data)
        })
        .catch(error => console.error(error))
    })
});