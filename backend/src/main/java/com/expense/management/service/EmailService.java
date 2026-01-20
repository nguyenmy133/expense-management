package com.expense.management.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Async
    public void sendEmail(String to, String subject, String content) {
        log.info("Sending email to: {}", to);
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(content, true); // true = isHtml

            mailSender.send(message);
            log.info("Email sent successfully to: {}", to);
        } catch (MessagingException e) {
            log.error("Failed to send email to: {}", to, e);
        }
    }

    public void sendBudgetAlert(String to, String categoryName, double amount, double limit, double percentage) {
        String subject = "⚠️ Cảnh báo vượt ngân sách: " + categoryName;
        String content = String.format(
                """
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                            <h2 style="color: #dc2626; text-align: center;">Cảnh báo Chi tiêu</h2>
                            <p>Xin chào,</p>
                            <p>Bạn đã chi tiêu vượt quá <strong>%d%%</strong> ngân sách cho danh mục <strong>%s</strong>.</p>

                            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                                <p style="margin: 5px 0;">💰 Đã chi: <strong>%,.0f đ</strong></p>
                                <p style="margin: 5px 0;">🎯 Ngân sách: <strong>%,.0f đ</strong></p>
                                <p style="margin: 5px 0;">📊 Tỷ lệ: <strong style="color: #dc2626;">%.1f%%</strong></p>
                            </div>

                            <p>Hãy xem lại kế hoạch chi tiêu của bạn nhé!</p>
                            <div style="text-align: center; margin-top: 30px;">
                                <a href="http://localhost:5173" style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Mở Ứng dụng</a>
                            </div>
                        </div>
                        """,
                (int) percentage, categoryName, amount, limit, percentage);

        sendEmail(to, subject, content);
    }
}
