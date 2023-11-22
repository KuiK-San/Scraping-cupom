document.addEventListener("DOMContentLoaded", () => {
    const video = document.getElementById('videoElement');
    const cameraList = document.getElementById('cameraList');

    // Verifica se o navegador suporta a API de mídia
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
        // Lista todas as dispositivos de mídia (câmeras, microfones, etc.)
        navigator.mediaDevices.enumerateDevices()
            .then(devices => {
                devices.forEach(device => {
                    // Verifica se o dispositivo é uma câmera
                    if (device.kind === 'videoinput') {
                        // Adiciona a câmera à lista
                        const option = document.createElement('option');
                        option.value = device.deviceId;
                        option.text = device.label || `Câmera ${cameraList.options.length + 1}`;
                        cameraList.appendChild(option);
                    }
                });
            })
            .catch(err => {
                console.error('Erro ao listar dispositivos de mídia:', err);
            });
    } else {
        console.error('A API de mídia não é suportada neste navegador.');
    }

    // Atualiza a fonte do vídeo quando o usuário seleciona uma câmera
    cameraList.addEventListener('change', function() {
        const selectedCameraId = cameraList.value;
        const constraints = {
            video: { deviceId: { exact: selectedCameraId } }
        };

        // Usa a API de mídia para acessar a câmera selecionada
        navigator.mediaDevices.getUserMedia(constraints)
            .then(stream => {
                video.srcObject = stream;
            })
            .catch(err => {
                console.error('Erro ao acessar a câmera:', err);
            });
    });
});
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