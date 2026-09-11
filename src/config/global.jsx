window.getRandomId = () => Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);

window.isValidEmail = email => /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/.test(email)

window.toastify = (msg, type) => console.log(msg, type) // Overridden in App component to use context-aware messages

window.api = import.meta.env.VITE_API_URL || "http://localhost:8000";