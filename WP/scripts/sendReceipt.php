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

// print_r($data);

// Validate required fields
if (!isset($data['orderId'], $data['paymentId'], $data['shippingInformation'], $data['cart'], $data['totalOrderCosts'])) {
    echo json_encode(["error" => "Missing required fields"]);
    exit;
}

// // Extract order details
$shipping = $data['shippingInformation'];
$cart = $data['cart'];
$totalOrderCosts = $data['totalOrderCosts'];
$customizations = isset($data['customizations']) ? $data['customizations'] : [];
$displayName = $shipping['firstName'] . ' ' . $shipping['lastName'];

$email = $shipping['email'];
$name = $shipping['firstName'];
$orderId = $data['orderId'];
$paymentId = $data['paymentId'];
$orderDate = date("F j, Y, g:i a"); // Order date

$freeCandles = isset($data['freeCandles']) ? (int)$data['freeCandles'] : 0;
$freeCandlesHtml = $freeCandles > 0 ? "<p>🎁 Congratulations! You've received <strong>{$freeCandles} FREE 3.5 oz Protection Candle".($freeCandles === 1 ? "" : "s")."</strong> as part of our promotion.</p>" : "";
$freeShippingHtml = ($totalOrderCosts['shipping'] == 0) ? "<p>🎉 Congratulations! You've qualified for <strong>Free Shipping!</strong></p>" : "";

// Extract order totals
$subtotal = number_format($totalOrderCosts['subtotal'], 2);
$taxes = number_format($totalOrderCosts['taxes'], 2);
$shippingHandling = number_format($totalOrderCosts['shipping'] + $totalOrderCosts['handling'], 2);
$fees = number_format($totalOrderCosts['fees'], 2);
$total = number_format($totalOrderCosts['charge'], 2);


// 📝 Format Order Items (including customizations)
$itemsHtml = "";
foreach ($cart as $item) {
    $customDetails = "";

    // Check if the item has customizations
    if (isset($customizations[$item['id']])) {
        foreach ($customizations[$item['id']] as $customization) {
            $customDetails .= "<p><strong>Customization:</strong> {$customization['words']} {$customization['date']}<br>
                <strong>Name 1:</strong> {$customization['name1']} ({$customization['zodiac1']})<br>
                <strong>Name 2:</strong> {$customization['name2']} ({$customization['zodiac2']})</p>";
        }
    }

    $itemsHtml .= "<tr>
        <td>{$item['title']}<br>$customDetails</td>
        <td>{$item['quantity']}</td>
        <td>\${$item['price']}</td>
        <td>\$" . number_format($item['price'] * $item['quantity'], 2) . "</td>
    </tr>";
}

// 📦 Shipping Information
$shippingHtml = "
    <strong>Shipping To:</strong><br>
    {$shipping['firstName']} {$shipping['lastName']}<br>
    {$shipping['addressLine1']}<br>
    {$shipping['city']}, {$shipping['state']} {$shipping['zipCode']}<br>
    <strong>Email:</strong> {$shipping['email']}<br>
";

if (!empty($shipping['joinMailingList'])) {
    $shippingHtml .= "<strong>Subscribed to Mailing List</strong><br>";
}

if (!empty($shipping['notes'])) {
    $shippingHtml .= "<br><strong>Notes:</strong> {$shipping['notes']}<br>";
}


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
    $mail->addAddress($email, $displayName);
    $mail->addReplyTo('sales@moonlightenergizedcandles.com', 'Support Team');

    // Add BCC for internal tracking
    $mail->addBCC('sales@moonlightenergizedcandles.com', 'Sales Team');

    // Subject & Body
    $mail->isHTML(true);
    $mail->CharSet = 'UTF-8';
    $mail->Encoding = 'base64';
    $mail->Subject = "Your Order Receipt " . $shipping['firstName'];

    // Email Body with Full Order Breakdown
    $mail->Body = "
        <html>
        <body style='font-family: Arial, sans-serif;'>
            <h2>Thank you for your order, $name!</h2>
            <p>Your order has been confirmed.</p>
            <p>Order Id: <strong>$orderId</strong></p>
            <p>Payment Id: <strong>$paymentId</strong></p>

            <h3>Order Summary</h3>
            <table border='1' cellspacing='0' cellpadding='8' style='border-collapse: collapse;'>
                <thead>
                    <tr style='background-color: #f8f8f8;'>
                        <th>Item</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    $itemsHtml
                </tbody>
            </table>
            <br/>

            $freeShippingHtml
            $freeCandlesHtml

            <h3>Order Breakdown</h3>
            <table border='0' cellspacing='0' cellpadding='8' style='border-collapse: collapse;'>
                <tbody>
                    <tr>
                        <td>Subtotal:</td>
                        <td>\$$subtotal</td>
                    </tr>
                    <tr>
                        <td>Taxes:</td>
                        <td>\$$taxes</td>
                    </tr>
                    <tr>
                        <td>Shipping & Handling:</td>
                        <td>\$$shippingHandling</td>
                    </tr>
                    <tr>
                        <td>Processing Fees:</td>
                        <td>\$$fees</td>
                    </tr>
                    <tr style='font-weight: bold; background-color: #f8f8f8;'>
                        <td>Total:</td>
                        <td>\$$total</td>
                    </tr>
                </tbody>
            </table>

            <h3>Shipping Details</h3>
            <p>$shippingHtml</p>

            <p>If you have any questions, please reply to this email.</p>
            <p>Thank you for choosing <strong>Moonlight Energized Candles</strong>!</p>
        </body>
        </html>
    ";

    // Send Email
    $mail->send();
    echo json_encode(["success" => "Email sent to $email"]);
} catch (Exception $e) {
    echo json_encode(["error" => "Email could not be sent. Mailer Error: {$mail->ErrorInfo}"]);
}

?>
