<?php
echo "STARTS-". "<br/>";

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

echo __DIR__ . '/PHPMailer/src/PHPMailer.php' . "<br/>";

var_dump(file_exists( __DIR__ . '/PHPMailer/src/PHPMailer.php'));


echo "-LOOKING-";

require __DIR__ . '/PHPMailer/src/PHPMailer.php';
require __DIR__ . '/PHPMailer/src/SMTP.php';
require __DIR__ . '/PHPMailer/src/Exception.php';

echo "FOUND-";

$mail = new PHPMailer(true);

try {
    // SMTP Configuration
    $mail->isSMTP();
    $mail->Host = 'smtp.ionos.com'; // IONOS SMTP Server
    $mail->SMTPAuth = true;
    $mail->Username = 'sales@moonlightenergizedcandles.com'; // Your IONOS email
    $mail->Password = '6QT5RCNCMFMT23AY'; // Your email password
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; // Encryption type
    $mail->Port = 587; // Port (25, 465, or 587)

    // Email Headers
    $mail->setFrom('sales@moonlightenergizedcandles.com', 'Your Name');
    $mail->addAddress('jaunsarria@gmail.com', 'Recipient Name');
    $mail->addReplyTo('sales@moonlightenergizedcandles.com', 'Your Name');

    // Email Content
    $mail->isHTML(true);
    $mail->Subject = 'Test Email from PHPMailer';
    $mail->Body = '<h1>Hello!</h1><p>This is a test email using PHPMailer.</p>';

    // Send Email
    $mail->send();
    echo 'Email sent successfully!';
} catch (Exception $e) {
    echo "Email failed: {$mail->ErrorInfo}";
}
?>
