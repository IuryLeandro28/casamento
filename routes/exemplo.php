<?php
header('Content-Type: application/json');

// Exemplo de resposta JSON
$response = [
    'status' => 'success',
    'message' => 'Esta é uma rota de exemplo.'
];

echo json_encode($response);
?>
