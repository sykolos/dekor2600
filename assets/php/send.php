<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/mailer/PHPMailer.php';
require __DIR__ . '/mailer/SMTP.php';
require __DIR__ . '/mailer/Exception.php';

header('Content-Type: application/json; charset=utf-8');

// Bejövő adat JSON-ból
$data = json_decode(file_get_contents("php://input"), true);

// Validáció
if (
    empty($data['name']) ||
    empty($data['email']) ||
    !filter_var($data['email'], FILTER_VALIDATE_EMAIL) ||
    empty($data['privacy'])
) {
    echo json_encode([
        "status" => "error",
        "message" => "Kérlek töltsd ki helyesen a kötelező mezőket."
    ]);
    exit;
}

$mail = new PHPMailer(true);

try {
    // Mail() mód
    $mail->isMail();
    $mail->CharSet = 'UTF-8';
    $mail->Encoding = 'base64';

    // Feladó és címzett
    $mail->setFrom('info@dekor26.hu', 'Dekor2600 kapcsolat');
    $mail->addAddress('info@dekor26.hu', 'Bejövő ajánlat');

    // A felhasználó e-mail címét válaszcímnek beállítjuk
    if (!empty($data['email'])) {
        $mail->addReplyTo($data['email'], $data['name']);
    }

    // Email tartalom
    $mail->isHTML(false);
    $mail->Subject = 'Új ajánlatkérés: ' . htmlspecialchars($data['name']);
    $mail->Body    =
        "Név: " . htmlspecialchars($data['name']) . "\n" .
        "Email: " . htmlspecialchars($data['email']) . "\n" .
        "Telefon: " . htmlspecialchars($data['phone']) . "\n\n" .
        "Üzenet:\n" . htmlspecialchars($data['message']);

    $mail->send();

    echo json_encode([
        "status" => "success",
        "message" => "Üzenet sikeresen elküldve!"
    ]);
} catch (Exception $e) {
    echo json_encode([
        "status" => "error",
        "message" => "Nem sikerült elküldeni az üzenetet. Kérlek próbáld újra később."
    ]);
}
