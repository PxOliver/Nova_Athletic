import React from 'react';
import { useSearchParams } from 'react-router-dom';

function VerificationPage() {

    const [searchParams] = useSearchParams();
    const status = searchParams.get('status');
    let message = "";
    let messageType = "info";

    switch (status) {
        case "success":
            message = "¡Tu correo ha sido verificado exitosamente! ahora puedes iniciar sesión";
            messageType = "success";
            break;
        case "invalid-token":
            message = "El token de verificacion es invalido";
            messageType = "error";
            break;
        case "expired":
            message = "El token de verificacion ha expirado. Por favor, solicita uno nuevo";
            messageType = "error";
            break;
        case "error":
            message = "Ocurrio un error duarante la verificacion. Por favor, solicita uno nuevo";
            messageType = "error";
            break;
        default:
            message = "verificando...";
            messageType = "info";

    }
    return (
        <div className={`verification-container ${messageType}`}>
            <h1>Verificacion Email</h1>
            <p>{message}</p>
            {messageType === "success" && (
                <button onClick={() => window.location = "/login"}>Ir a iniciar sesión</button>)}
        </div>
    )
}

export default VerificationPage;