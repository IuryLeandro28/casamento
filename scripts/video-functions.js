const video = document.getElementById('video');
const preview = document.getElementById('preview');
const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const reRecordButton = document.getElementById('reRecord');
const uploadButton = document.getElementById('uploadButton');
const videoNameInput = document.getElementById('videoName');
const uploadStatus = document.getElementById('upload-status');
let mediaRecorder;
let recordedChunks = [];

// Verifica se o navegador suporta getUserMedia
if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert('Seu navegador não suporta acesso à câmera.');
    console.error('getUserMedia não é suportado neste navegador.');
} else {
    // Solicita permissão para acessar a câmera
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
            console.log('Permissão concedida para acessar a câmera.');
            video.srcObject = stream;
            video.play(); // Garante que o vídeo começa a ser reproduzido

            startButton.addEventListener('click', () => {
                recordedChunks = [];
                mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.ondataavailable = event => recordedChunks.push(event.data);
                mediaRecorder.onstop = () => {
                    const blob = new Blob(recordedChunks, { type: 'video/webm' });
                    const url = URL.createObjectURL(blob);
                    preview.src = url;
                    const modal = new bootstrap.Modal(document.getElementById('videoModal'));
                    modal.show();
                };
                mediaRecorder.start();
                startButton.disabled = true;
                stopButton.disabled = false;
            });

            stopButton.addEventListener('click', () => {
                mediaRecorder.stop();
                startButton.disabled = false;
                stopButton.disabled = true;
            });

            reRecordButton.addEventListener('click', () => {
                const modal = bootstrap.Modal.getInstance(document.getElementById('videoModal'));
                modal.hide();
                startButton.disabled = false;
                stopButton.disabled = true;
            });

            uploadButton.addEventListener('click', async () => {
                const videoName = videoNameInput.value.trim();
                if (!videoName) {
                    alert('Por favor, insira um nome para o vídeo.');
                    return;
                }

                const blob = new Blob(recordedChunks, { type: 'video/webm' });
                const formData = new FormData();
                formData.append('video', blob, `${videoName}.webm`);

                try {
                    const response = await fetch('/app/upload.php', {
                        method: 'POST',
                        body: formData
                    });
                    const result = await response.text();
                    alert(result);
                } catch (error) {
                    console.error('Erro ao enviar o vídeo:', error);
                    alert('Erro ao enviar o vídeo.');
                }
            });
        })
        .catch(error => {
            console.error('Erro ao acessar a câmera:', error);
            if (error.name === 'NotAllowedError') {
                alert('Permissão para acessar a câmera foi negada. Verifique as configurações do navegador.');
            } else if (error.name === 'NotFoundError') {
                alert('Nenhuma câmera foi encontrada no dispositivo.');
            } else {
                alert('Erro ao acessar a câmera. Verifique as permissões ou tente novamente.');
            }
        });
}
