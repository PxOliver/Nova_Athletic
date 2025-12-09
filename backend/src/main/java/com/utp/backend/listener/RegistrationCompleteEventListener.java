package com.utp.backend.listener;

import com.utp.backend.Model.Usuario;
import com.utp.backend.Service.Auth.AuthServiceImpl;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.io.UnsupportedEncodingException;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationListener;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RegistrationCompleteEventListener implements ApplicationListener<RegistrationCompleteEvent> {

    private static final Logger log = LoggerFactory.getLogger(RegistrationCompleteEventListener.class);

    @Autowired
    private AuthServiceImpl userService;

    @Autowired
    private JavaMailSender mailSender;

    private Usuario theUser;

    // URL del backend (Render) para armar el enlace del correo
    @Value("${APP_URL:http://localhost:8080}")
    private String appUrl;

    @Override
    public void onApplicationEvent(RegistrationCompleteEvent event) {

        theUser = event.getUser();
        String verificationToken = UUID.randomUUID().toString();
        userService.saveUserVerificationToken(theUser, verificationToken);

        // Ej: https://nova-athletic-1.onrender.com/api/auth/verifyEmail?token=...
        String url = appUrl + "/api/auth/verifyEmail?token=" + verificationToken;

        try {
            sendVerificationEmail(url);
        } catch (MessagingException | UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }

        log.info("Haga clic en el enlace para verificar su registro:  {}", url);
    }

    public void sendVerificationEmail(String url) throws MessagingException, UnsupportedEncodingException {
        String subject = "Verificación de Correo Electrónico";
        String senderName = "Servicio de Registro de Usuarios";
        String mailContent = "<p>Hola, " + theUser.getNombre() + ",</p>"
                + "<p>Gracias por registrarte con nosotros.</p>"
                + "<p>Por favor, haz clic en el enlace a continuación para completar tu registro:</p>"
                + "<a href=\"" + url + "\">Verifica tu correo electrónico para activar tu cuenta</a>"
                + "<p>Gracias,<br>Servicio de Registro de Usuarios</p>";

        MimeMessage message = mailSender.createMimeMessage();
        var messageHelper = new MimeMessageHelper(message);

        messageHelper.setFrom("pruebatech370@gmail.com", senderName);
        messageHelper.setTo(theUser.getEmail());
        messageHelper.setSubject(subject);
        messageHelper.setText(mailContent, true);
        mailSender.send(message);
    }
}