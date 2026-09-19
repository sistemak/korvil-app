<?php
header('Content-Type: application/json');
$secret = 'kai-secret-php-2025';
function createJWT($email){
    global $secret;
    $header = base64_encode(json_encode(['alg'=>'HS256','typ'=>'JWT']));
    $payload = base64_encode(json_encode(['email'=>$email,'exp'=>time()+3600]));
    $signature = base64_encode(hash_hmac('sha256', "$header.$payload", $secret, true));
    return "$header.$payload.$signature";
}
$method = $_SERVER['REQUEST_METHOD'];
if($method === 'POST'){
    $data = json_decode(file_get_contents('php://input'), true);
    if(($data['email'] ?? '') === 'kai@korvil.ai' && ($data['password'] ?? '') === 'kai123'){
        echo json_encode(['token'=>createJWT($data['email']), 'status'=>'K-AI PHP Online']);
    } else { http_response_code(401); echo json_encode(['error'=>'Invalid']); }
} else {
    echo json_encode(['status'=>'K-AI PHP Online','neurons'=>512,'endpoints'=>['POST /api/login']]);
}