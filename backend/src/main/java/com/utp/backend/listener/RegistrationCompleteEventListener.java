package com.utp.backend.listener;

import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import com.utp.backend.Model.Usuario;
import com.utp.backend.Service.Auth.AuthServiceImpl;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RegistrationCompleteEventListener implements ApplicationListener<RegistrationCompleteEvent> {

    private static final Logger log = LoggerFactory.getLogger(RegistrationCompleteEventListener.class);

    private final AuthServiceImpl userService;

    @Value("${sendgrid.api.key}")
    private String sendgridApiKey;

    @Value("${mail.from}")
    private String mailFrom;

    @Value("${app.backend.url}")
    private String backendUrl;

    private Usuario theUser;

    @Override
    public void onApplicationEvent(RegistrationCompleteEvent event) {

        theUser = event.getUser();
        String verificationToken = UUID.randomUUID().toString();
        userService.saveUserVerificationToken(theUser, verificationToken);

        String url = backendUrl + "/api/auth/verifyEmail?token=" + verificationToken;

        try {
            sendVerificationEmail(url);
        } catch (IOException e) {
            log.error("Error enviando correo de verificación", e);
            throw new RuntimeException(e);
        }

        log.info("Haga clic en el enlace para verificar su registro:  {}", url);
    }

    public void sendVerificationEmail(String url) throws IOException, UnsupportedEncodingException {
        String subject = "Verificación de Correo Electrónico";
        String senderName = "Servicio de Registro de Usuarios";

        String mailContent = "<p>Hola, " + theUser.getNombre() + ",</p>"
                + "<p>Gracias por registrarte con nosotros.</p>"
                + "<p>Por favor, haz clic en el enlace a continuación para completar tu registro:</p>"
                + "<a href=\"" + url + "\">Verifica tu correo electrónico para activar tu cuenta</a>"
                + "<p>Gracias,<br>" + senderName + "</p>";

        Email from = new Email(mailFrom, senderName);
        Email to = new Email(theUser.getEmail());
        Content content = new Content("text/html", mailContent);

        Mail mail = new Mail(from, subject, to, content);

        SendGrid sg = new SendGrid(sendgridApiKey);
        Request request = new Request();

        request.setMethod(Method.POST);
        request.setEndpoint("mail/send");
        request.setBody(mail.build());

        Response response = sg.api(request);

        log.info("SendGrid response status: {}", response.getStatusCode());
        log.debug("SendGrid body: {}", response.getBody());
    }
}