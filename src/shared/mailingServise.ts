import nodemailer from "nodemailer";
import {EmailToSend} from "../modules/authentication/types";

// Создаем транспорт для отправки писем
const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com", // SMTP-сервер вашего почтового провайдера (например, smtp.gmail.com)
    port: 465,                    // Обычно 587 для TLS
    secure: true,                // true для 465, false для других портов
    auth: {
        user: "760db9001@smtp-brevo.com", // Ваша почта
        pass: "8NjS49qPsZTpVQW2"           // Пароль или приложение-ключ (если двухфакторная аутентификация)
    }
});

// Функция для отправки письма
export const sendEmail = async (emailToSend: EmailToSend) => {
    const {from, to, subject, text, html} = emailToSend;
    try {
        const info = await transporter.sendMail({
            from,
            to,
            subject,
            text,
            html
        });
        console.log("Сообщение по адресу %s отправлено: %s", to, info.messageId);
    } catch (error: any) {
        throw new Error(`Ошибка при отправке сообщения: ${error.message}`);
    }
};


