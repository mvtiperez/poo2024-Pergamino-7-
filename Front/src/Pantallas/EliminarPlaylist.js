import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import "./Cancion2.css";

function EliminarPlayList() {
  const [activeLink, setActiveLink] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // Búsqueda ingresada por el usuario
  const [error, setError] = useState(null); // Manejo de errores
  const [Playlist, setPlaylist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null); // Mensaje de éxito
  const navigate = useNavigate();

  const handleNavigation = (path, index) => {
    setActiveLink(index);
    setTimeout(() => {
      navigate(path);
    }, 100);
  };

  useEffect(() => {
    const fetchPlaylist = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("authToken");
        console.log("Token:", token); // Verificar que el token está presente
        if (!token) {
          setError("No estás autenticado.");
          setLoading(false);
          return;
        }

        console.log("Haciendo solicitud a la API...");
        const response = await fetch("http://localhost:8080/api/playlist/me/playlists", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        console.log("Respuesta de la API:", response);
        if (response.ok) {
          const data = await response.json();
          console.log("Playlist obtenidas:", data); // Verificar los datos obtenidos
          setPlaylist(data);
        } else {
          const errorData = await response.json();
          console.error("Error de la respuesta:", errorData); // Para depurar el error
          setError(`Error: ${errorData.message || "No se pudieron obtener las playlist."}`);
        }
      } catch (err) {
        console.error("Error al obtener las playlist:", err);
        setError("Hubo un problema al obtener las playlist.");
      }
      setLoading(false);
    };

    fetchPlaylist();
  }, []);

  const deletePlaylist = async (id) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("No estás autenticado. Por favor inicia sesión.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/playlist/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 204) {
        setMessage("Playlist eliminada exitosamente.");
        
        // Eliminar la playlist del estado local
        setPlaylist(prevPlaylist => prevPlaylist.filter(playlist => playlist.id !== id));
      } else {
        setError("Error al eliminar la playlist. Verifica tus permisos.");
      }
    } catch (error) {
      setError("Error en la conexión con el servidor.");
      console.error(error);
    }
  };

  return (
    <div className="top-bar">
      <div className="container">
        <Helmet>
          <link
            href="https://fonts.googleapis.com/icon?family=Material+Icons"
            rel="stylesheet"
          />
        </Helmet>
        <aside>
          <div className="toggle">
            <h2>AllMusic</h2>
          </div>
          <div className="sidebar">
            <div>
              <a
                className={activeLink === 0 ? "active clicked" : ""}
                onClick={() => handleNavigation("/menuPrincipal", 0)}
              >
                <span className="material-icons">home</span>
                <h3>Menu principal</h3>
              </a>
              <a
                className={activeLink === 1 ? "active clicked" : ""}
                onClick={() => handleNavigation("/playlist", 1)}
              >
                <span className="material-icons">library_music</span>
                <h3>Menu Playlist</h3>
              </a>
              <a
                className={activeLink === 2 ? "active clicked" : ""}
                onClick={() => handleNavigation("/canciones", 2)}
              >
                <span className="material-icons">music_note</span>
                <h3>Menu canciones</h3>
              </a>
              <a
                className={activeLink === 3 ? "active clicked" : ""}
                onClick={() => handleNavigation("/", 3)}
              >
                <span className="material-icons">logout</span>
                <h3>Cerrar sesión</h3>
              </a>
            </div>
          </div>
        </aside>
        <div className="main-container">
          <h2>Listado de Mis Playlist</h2>
          {loading ? (
            <p>Cargando Playlist...</p>
          ) : (
            <>
              {message && <p style={{ color: 'green' }}>{message}</p>}
              {error && <p style={{ color: 'red' }}>{error}</p>}
              <table>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {Playlist.length > 0 ? (
                    Playlist.map((playlist) => (
                      <tr key={playlist.id}>
                        <td>{playlist.name}</td> {/* Asegúrate de que 'name' es una propiedad válida */}
                        <td>
                          <button
                            className="delete-button"
                            onClick={() => deletePlaylist(playlist.id)}
                          >
                            Eliminar Playlist
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3">No hay Playlist disponibles.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default EliminarPlayList;
