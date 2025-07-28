<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/mailer/PHPMailer.php';
require __DIR__ . '/mailer/SMTP.php';
require __DIR__ . '/mailer/Exception.php';

$config = include 'env.php';

$data = json_decode(file_get_contents("php://input"), true);

// Validáció
if (
  empty($data['name']) ||
  empty($data['email']) ||
  !filter_var($data['email'], FILTER_VALIDATE_EMAIL) ||
  empty($data['privacy'])
) {
  echo json_encode(["message" => "Kérlek töltsd ki helyesen a kötelező mezőket."]);
  exit;
}

$mail = new PHPMailer(true);
try {
  // SMTP beállítások
  $mail->isSMTP();
  $mail->Host = $config['smtp_host'];
  $mail->SMTPAuth = true;
  $mail->Username = $config['smtp_user'];
  $mail->Password = $config['smtp_pass'];
  $mail->SMTPSecure = $config['smtp_secure'];
  $mail->Port = $config['smtp_port'];

  // Feladó és címzett
  $mail->setFrom($config['smtp_user'], $config['from_name']);
  $mail->addAddress($config['smtp_user'], 'Bejövő ajánlat'); // saját magadnak

  // E-mail tartalom
  $mail->isHTML(false);
  $mail->Subject = 'Ajánlatkérés: ' . $data['name'];
  $mail->Body = "Név: {$data['name']}\n"
              . "Email: {$data['email']}\n"
              . "Telefon: {$data['phone']}\n"
              . "Üzenet:\n{$data['message']}";

  $mail->send();
  echo json_encode(["message" => "Üzenet sikeresen elküldve!"]);
} catch (Exception $e) {
  echo json_encode(["message" => "Hiba: " . $mail->ErrorInfo]);
}
