package com.utp.backend.listener;

import com.utp.backend.Model.Usuario;
import org.springframework.context.ApplicationEvent;
// Clase que representa un evento personalizado en la aplicación, utilizado para manejar 
// la finalización del registro de un usuario.
public class RegistrationCompleteEvent extends ApplicationEvent {

    private Usuario user;
    private String applicationUrl;

    // Constructor que inicializa el evento con el usuario y la URL de la aplicación.
    public RegistrationCompleteEvent(Usuario user, String applicationUrl) {
        super(user); 
        this.user = user; 
        this.applicationUrl = applicationUrl;
    }

    public Usuario getUser() {
        return user;
    }

    public void setUser(Usuario user) {
        this.user = user;
    }

    public String getApplicationUrl() {
        return applicationUrl;
    }

    public void setApplicationUrl(String applicationUrl) {
        this.applicationUrl = applicationUrl;
    }
}