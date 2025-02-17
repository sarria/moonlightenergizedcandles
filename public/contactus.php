<?php
// // Allow all domains to access (for security, replace "*" with your frontend URL)
// header("Access-Control-Allow-Origin: *");
// header("Access-Control-Allow-Methods: POST, OPTIONS");
// header("Access-Control-Allow-Headers: Content-Type");

// // Handle preflight request (CORS issue)
// if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
//     http_response_code(200);
//     exit;
// }

// if ($_SERVER["REQUEST_METHOD"] === "POST") {
//     $email = $_POST["email"] ?? "";
//     $name = $_POST["name"] ?? "";
//     $message = $_POST["message"] ?? "";
//     $sendTo = $_POST["sendTo"] ?? "";

//     if (empty($email) || empty($name) || empty($message)) {
//         echo json_encode(["success" => false, "message" => "All fields are required."]);
//         exit;
//     }

//     $to = $sendTo;
//     $subject = "New Contact Form Submission";
//     $body = "Name: $name\nEmail: $email\nMessage:\n$message";
//     $headers = "From: $email\r\nReply-To: $email\r\nContent-Type: text/plain; charset=UTF-8";

//     if (mail($to, $subject, $body, $headers)) {
//         echo json_encode(["success" => true, "message" => "Email sent successfully."]);
//     } else {
//         $error = error_get_last(); // Get the last error
//         echo json_encode([
//             "success" => false,
//             "error" => "Mail sending failed.",
//             "message" => $error["message"] ?? "No additional error details.",
//         ]);
//     }
// } else {
//     echo json_encode(["success" => false, "message" => "Invalid request."]);
// }
?>

<?php
    $to      = 'jaunsarria@gmail.com';
    $subject = 'the subject';
    $message = 'hello';
    $headers = 'From: webmaster@example.com'       . "\r\n" .
                 'Reply-To: webmaster@example.com' . "\r\n" .
                 'X-Mailer: PHP/' . phpversion();

    print "=>";
    mail($to, $subject, $message, $headers) ? " COOL " : " OPS ";
    print "ok";

    // phpinfo();
?>
