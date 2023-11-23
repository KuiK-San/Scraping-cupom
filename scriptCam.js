document.addEventListener("DOMContentLoaded", function () {
    let video = document.getElementById("video");
    const cameraList = document.getElementById("cameraList");

    function startCamera() {
        let selectedCameraId = cameraList.value
        const constraints = {
            video: { deviceId: { exact: selectedCameraId } },
        };

        navigator.mediaDevices
            .getUserMedia(constraints)
            .then((stream) => {
                // Para a stream anterior, se existir
                if (video.srcObject) {
                    const tracks = video.srcObject.getTracks();
                    tracks.forEach((track) => track.stop());
                }

                // Atualiza a fonte do vídeo com a nova stream
                video.srcObject = stream;
            })
            .catch((err) => {
                console.error("Erro ao acessar a câmera:", err);
            });
    }


    if (
        navigator.mediaDevices &&
        navigator.mediaDevices.enumerateDevices
    ) {
        navigator.mediaDevices
            .enumerateDevices()
            .then((devices) => {
                devices.forEach((device) => {
                    if (device.kind === "videoinput") {
                        const option =
                            document.createElement("option");
                        option.value = device.deviceId;
                        option.text =
                            device.label ||
                            `Câmera ${
                                cameraList.options.length + 1
                            }`;
                        cameraList.appendChild(option);
                    }
                });
            })
            .catch((err) => {
                console.error(
                    "Erro ao listar dispositivos de mídia:",
                    err
                );
            });
    } else {
        console.error(
            "A API de mídia não é suportada neste navegador."
        );
    }

    cameraList.addEventListener("change", startCamera);
});