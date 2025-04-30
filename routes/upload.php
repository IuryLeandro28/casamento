<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['video'])) {
    if ($_FILES['video']['error'] === UPLOAD_ERR_NO_FILE) {
        echo json_encode(['status' => 'error', 'message' => 'Nenhum arquivo foi enviado.', 'debug' => $_FILES['video']]);
        exit;
    }

    $uploadDir = __DIR__ . '/../videos/';
    if (!is_dir($uploadDir)) {
        if (!mkdir($uploadDir, 0777, true)) {
            echo json_encode(['status' => 'error', 'message' => 'Falha ao criar a pasta de upload.', 'error' => error_get_last()]);
            exit;
        }
    }

    $fileName = isset($_POST['videoName']) ? preg_replace('/[^a-zA-Z0-9_-]/', '_', $_POST['videoName']) . '.webm' : uniqid('video_') . '.webm';
    $filePath = $uploadDir . $fileName;

    if (!is_writable($uploadDir)) {
        echo json_encode(['status' => 'error', 'message' => 'A pasta de upload não tem permissões de escrita.', 'error' => error_get_last()]);
        exit;
    }

    if (move_uploaded_file($_FILES['video']['tmp_name'], $filePath)) {
        echo json_encode(['status' => 'success', 'message' => 'Vídeo enviado com sucesso!', 'fileName' => $fileName]);
    } else {
        $error = error_get_last();
        echo json_encode(['status' => 'error', 'message' => 'Erro ao salvar o vídeo.', 'error' => $error, 'debug' => $_FILES['video']]);
    }
} else {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Requisição inválida.', 'debug' => $_FILES]);
}
?>
