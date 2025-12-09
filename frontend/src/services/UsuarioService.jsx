import axios from "axios";

const API_URL = 'http://localhost:8080/api/usuario';

const getPerfil = async () =>{
    const token  = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/perfil`,{
        headers:{
            Authorization : `Bearer ${token}`,
        }
    });
    return response.data;
};

    const actualizarPerfil = async (datosActualizados) =>{
        const token  = localStorage.getItem('token');
        const response = await axios.put(`${API_URL}/perfil/actualizar`, datosActualizados,{
            headers:{
                Authorization : `Bearer ${token}`,
            }
        });
        return response.data;
};

const actualizarImagenPerfil = async (formData) =>{
    const token  = localStorage.getItem('token');
    const response = await axios.put(`${API_URL}/perfil/actualizar/imagen`,formData,{
        headers:{
            Authorization : `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        }
    });
    return response.data;
};

export default{
    getPerfil,
    actualizarImagenPerfil,
    actualizarPerfil
}