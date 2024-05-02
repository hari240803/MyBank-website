const backendUrl =
    window.location.hostname === 'localhost'
        ? "http://localhost:3001"
        : "https://mybank-backend.onrender.com";

export { backendUrl };