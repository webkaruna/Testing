<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Sanitize input
    $name    = htmlspecialchars(trim($_POST['name']));
    $email   = filter_var(trim($_POST['email']), FILTER_VALIDATE_EMAIL);
    $phone   = htmlspecialchars(trim($_POST['phone']));
    $message = htmlspecialchars(trim($_POST['message']));

    // Validate fields
    $errors = [];

    if (!$name || strlen($name) < 2) {
        $errors[] = 'Name is required and must be at least 2 characters.';
    }

    if (!$email) {
        $errors[] = 'Valid email is required.';
    }

    if (!$phone || !preg_match('/^[0-9\-\+\s\(\)]+$/', $phone)) {
        $errors[] = 'Valid phone number is required.';
    }

    if (!$message || strlen($message) < 10) {
        $errors[] = 'Message must be at least 10 characters.';
    }

    if (!empty($errors)) {
        echo json_encode(['status' => 'error', 'message' => implode(' ', $errors)]);
        exit;
    }

    // Prepare email
    $to      = 'admin@example.com'; // Change to your admin email
    $subject = "New Contact Form Submission";
    $body    = "You have received a new message:\n\n"
             . "Name: $name\n"
             . "Email: $email\n"
             . "Phone: $phone\n"
             . "Message:\n$message";
    $headers = "From: $email\r\nReply-To: $email";

    // Send email
    if (mail($to, $subject, $body, $headers)) {
        echo json_encode(['status' => 'success', 'message' => 'Mail sent successfully.']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Mail sending failed.']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request.']);
}
