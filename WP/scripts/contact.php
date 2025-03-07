<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/PHPMailer/src/PHPMailer.php';
require __DIR__ . '/PHPMailer/src/SMTP.php';
require __DIR__ . '/PHPMailer/src/Exception.php';

header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["error" => "Invalid request method"]);
    exit;
}

// Decode JSON input
$data = json_decode(file_get_contents("php://input"), true);

// Validate required fields
if (!isset($data['name'], $data['email'], $data['message'])) {
    echo json_encode(["error" => "Missing required fields"]);
    exit;
}

$name = $data['name'];
$email = $data['email'];
$message = $data['message'];

// Setup PHPMailer
$mail = new PHPMailer(true);

try {
    // SMTP Configuration
    $mail->isSMTP();
    $mail->Host = 'smtp.ionos.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'sales@moonlightenergizedcandles.com';
    $mail->Password = '6QT5RCNCMFMT23AY'; // Your email password
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;

    // Email Headers
    $mail->setFrom('sales@moonlightenergizedcandles.com', 'Moonlight Energized Candles');
    $mail->addAddress('moonlight.energized.candles@gmail.com', 'Moonlight Energized Candles');
    $mail->addReplyTo('sales@moonlightenergizedcandles.com', 'Support Team');

    // Add BCC for internal tracking
    $mail->addBCC('jaunsarria@gmail.com', 'Juan');

    // Subject & Body
    $mail->isHTML(true);
    $mail->CharSet = 'UTF-8';
    $mail->Encoding = 'base64';
    $mail->Subject = "Contact from " . $name;

    // Email Body with Full Order Breakdown
    $mail->Body = "
        <html>
        <body style='font-family: Arial, sans-serif;'>
            <h3>Contact sent</h3>
            <table border='0' cellspacing='0' cellpadding='8' style='border-collapse: collapse;'>
                <tbody>
                    <tr>
                        <td>Name:</td>
                        <td>$name</td>
                    </tr>
                    <tr>
                        <td>Email:</td>
                        <td>$email</td>
                    </tr>
                    <tr>
                        <td>Message:</td>
                        <td>$message</td>
                    </tr>
                </tbody>
            </table>
        </body>
        </html>
    ";

    // Send Email
    $mail->send();
    
    // ✅ Correct response in PHP
    echo json_encode(["success" => "Email sent to $email"]);
    exit;
} catch (Exception $e) {
    echo json_encode(["error" => "Email could not be sent. Mailer Error: {$mail->ErrorInfo}"]);
    exit;
}
?>