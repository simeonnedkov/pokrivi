<?php
// Проверка дали заявката е POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
  // Получаване на данните от формата
  $name = strip_tags(trim($_POST["name"]));
  $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
  $phone = strip_tags(trim($_POST["phone"]));
  $message = strip_tags(trim($_POST["message"]));
  
  // Валидация
  if (empty($name) || empty($message) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
      http_response_code(400);
      echo json_encode(array("success" => false, "message" => "Моля попълнете всички задължителни полета с валидни данни."));
      exit;
  }
  
  // Валидация на телефонен номер
  if (!empty($phone)) {
    $digitsOnly = preg_replace('/\D/', '', $phone);
    
    // Проверка дали има между 9 и 15 цифри (адаптирано за български номера)
    if (strlen($digitsOnly) < 9 || strlen($digitsOnly) > 15) {
        http_response_code(400);
        echo json_encode(array("success" => false, "message" => "Моля въведете валиден телефонен номер (9-15 цифри)."));
        exit;
    }
  }
  
  // Настройки за имейла - ПРОМЕНЕТЕ С ВАШИЯ ИМЕЙЛ АДРЕС
  $recipient = "info@eliteroofing.com"; // ВАЖНО: Сменете с вашия имейл адрес
  $subject = "Ново съобщение от сайта - САВИЕМПИ ООД покривни решения";
  
  // Съдържание на имейла
  $email_content = "Име: $name\n";
  $email_content .= "Email: $email\n";
  
  if (!empty($phone)) {
      $email_content .= "Телефон: $phone\n";
  }
  
  $email_content .= "\nСъобщение:\n$message\n";
  
  // Headers за имейла
  $email_headers = "From: $name <$email>\r\n";
  $email_headers .= "Reply-To: $email\r\n";
  $email_headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
  
  // Изпращане на имейла
  if (mail($recipient, $subject, $email_content, $email_headers)) {
      http_response_code(200);
      echo json_encode(array("success" => true, "message" => "Благодарим Ви! Вашето съобщение беше изпратено успешно. Ще се свържем с Вас скоро."));
  } else {
      http_response_code(500);
      echo json_encode(array("success" => false, "message" => "Възникна грешка при изпращането. Моля опитайте отново."));
  }
} else {
  http_response_code(403);
  echo json_encode(array("success" => false, "message" => "Неразрешен достъп."));
}
?>
