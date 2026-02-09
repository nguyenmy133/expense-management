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

    public void sendTransactionNotification(String to, String type, double amount, String category, String date,
            String note) {
        boolean isExpense = "EXPENSE".equalsIgnoreCase(type);
        String subject = (isExpense ? "💸 Chi tiêu mới: " : "💰 Thu nhập mới: ") + String.format("%,.0f đ", amount);
        String color = isExpense ? "#dc2626" : "#16a34a";
        String typeText = isExpense ? "Chi tiêu" : "Thu nhập";

        String content = String.format(
                """
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                            <h2 style="color: %s; text-align: center;">Giao dịch Mới</h2>
                            <p>Xin chào,</p>
                            <p>Hệ thống vừa ghi nhận một giao dịch <strong>%s</strong> mới:</p>

                            <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid %s;">
                                <p style="margin: 8px 0;">💵 Số tiền: <strong style="font-size: 1.2em; color: %s;">%,.0f đ</strong></p>
                                <p style="margin: 8px 0;">📂 Danh mục: <strong>%s</strong></p>
                                <p style="margin: 8px 0;">📅 Ngày: <strong>%s</strong></p>
                                <p style="margin: 8px 0;">📝 Ghi chú: <em>%s</em></p>
                            </div>

                            <div style="text-align: center; margin-top: 30px;">
                                <a href="http://localhost:5173" style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Xem Chi tiết</a>
                            </div>
                        </div>
                        """,
                color, typeText, color, color, amount, category, date, (note != null ? note : "Không có"));

        sendEmail(to, subject, content);
    }

    public void sendPasswordResetEmail(String to, String resetToken, String fullName) {
        String subject = "🔐 Đặt lại mật khẩu - Expense Management";
        String resetLink = "http://localhost:5173/reset-password?token=" + resetToken;

        String content = String.format(
                """
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                            <h2 style="color: #2563eb; text-align: center;">Đặt lại mật khẩu</h2>
                            <p>Xin chào <strong>%s</strong>,</p>
                            <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>

                            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
                                <p style="margin: 0 0 15px 0;">Nhấn vào nút bên dưới để đặt lại mật khẩu:</p>
                                <div style="text-align: center;">
                                    <a href="%s" style="background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Đặt lại mật khẩu</a>
                                </div>
                            </div>

                            <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
                                <p style="margin: 0; color: #92400e;"><strong>⚠️ Lưu ý:</strong></p>
                                <ul style="margin: 10px 0; color: #92400e;">
                                    <li>Link này chỉ có hiệu lực trong <strong>15 phút</strong></li>
                                    <li>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này</li>
                                    <li>Không chia sẻ link này với bất kỳ ai</li>
                                </ul>
                            </div>

                            <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">Hoặc copy link sau vào trình duyệt:</p>
                            <p style="background-color: #f3f4f6; padding: 10px; border-radius: 5px; word-break: break-all; font-size: 12px; color: #4b5563;">%s</p>

                            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                            <p style="color: #9ca3af; font-size: 12px; text-align: center;">Email này được gửi tự động, vui lòng không trả lời.</p>
                        </div>
                        """,
                (fullName != null && !fullName.isEmpty()) ? fullName : "bạn",
                resetLink,
                resetLink);

        sendEmail(to, subject, content);
    }
}
