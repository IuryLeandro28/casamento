<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_FILES['video']) && $_FILES['video']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = __DIR__ . '/videos/'; // Corrigido para salvar na pasta 'videos'
        $uploadFile = $uploadDir . basename($_FILES['video']['name']);

        // Verifica se a pasta de upload existe
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        // Move o arquivo enviado para a pasta de destino
        if (move_uploaded_file($_FILES['video']['tmp_name'], $uploadFile)) {
            echo "Upload realizado com sucesso!";
        } else {
            echo "Erro ao mover o arquivo.";
        }
    } else {
        echo "Erro ao enviar o vídeo.";
    }
} else {
    echo "Método inválido.";
}

echo "Envie o vídeo para um serviço externo e insira o link no sistema.";
?>
