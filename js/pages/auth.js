/* ──────────────────────────────────────────────────────────────────────────
   pages/auth.js  ·  Script propio de auth.html
   Sistema unificado de Login y Registro con validación y localStorage.
   ────────────────────────────────────────────────────────────────────────── */

(function (global) {
  "use strict";

  global.Web07.use("pagina:auth", {
    init() {
      const { alerts, dom } = global.Web07.mods;

      // Referencias DOM
      const loginForm = dom.porId("loginForm");
      const registerForm = dom.porId("registerForm");
      const loginTab = dom.porId("login-tab");
      const registerTab = dom.porId("register-tab");
      const loginPane = dom.porId("login");
      const registerPane = dom.porId("register");

      // Toggle password visibility
      const setupTogglePass = (toggleId, inputId) => {
        const toggle = dom.porId(toggleId);
        const input = dom.porId(inputId);
        if (!toggle || !input) return;
        toggle.addEventListener("click", () => {
          const type = input.type === "password" ? "text" : "password";
          input.type = type;
          toggle.textContent = type === "password" ? "👁" : "🙈";
        });
      };
      setupTogglePass("toggleLoginPass", "loginContrasena");
      setupTogglePass("toggleRegPass", "regContrasena");

      // Tab switching
      const switchTab = (target) => {
        [loginTab, registerTab].forEach(t => t.classList.remove("active"));
        [loginPane, registerPane].forEach(p => p.classList.remove("show", "active"));
        if (target === "register") {
          registerTab.classList.add("active");
          registerPane.classList.add("show", "active");
          dom.porId("regNombre").focus();
        } else {
          loginTab.classList.add("active");
          loginPane.classList.add("show", "active");
          dom.porId("loginUsuario").focus();
        }
      };

      loginTab.addEventListener("click", (e) => { e.preventDefault(); switchTab("login"); });
      registerTab.addEventListener("click", (e) => { e.preventDefault(); switchTab("register"); });

      // Validation helpers
      const mostrarError = (input, mensaje) => {
        input.classList.add("is-invalid");
        const feedback = input.parentNode.querySelector(".invalid-feedback");
        if (feedback) feedback.textContent = mensaje;
      };

      const limpiarErrores = (form) => {
        form.querySelectorAll(".is-invalid").forEach(el => el.classList.remove("is-invalid"));
      };

      const validarLogin = () => {
        let valido = true;
        const usuario = dom.porId("loginUsuario");
        const pass = dom.porId("loginContrasena");
        limpiarErrores(loginForm);
        if (!usuario.value.trim()) { mostrarError(usuario, "Ingrese su usuario o email"); valido = false; }
        if (!pass.value) { mostrarError(pass, "Ingrese su contraseña"); valido = false; }
        return valido;
      };

      const validarRegister = () => {
        let valido = true;
        const nombre = dom.porId("regNombre");
        const email = dom.porId("regEmail");
        const pass = dom.porId("regContrasena");
        const confirm = dom.porId("regConfirmar");
        const terminos = dom.porId("regTerminos");
        limpiarErrores(registerForm);
        if (nombre.value.trim().length < 2) { mostrarError(nombre, "Ingrese su nombre (mín. 2 caracteres)"); valido = false; }
        if (!email.value.includes("@")) { mostrarError(email, "Ingrese un email válido"); valido = false; }
        if (pass.value.length < 6) { mostrarError(pass, "Mínimo 6 caracteres"); valido = false; }
        if (pass.value !== confirm.value) { mostrarError(confirm, "Las contraseñas no coinciden"); valido = false; }
        if (!terminos.checked) { mostrarError(terminos, "Debe aceptar los términos"); valido = false; }
        return valido;
      };

      // Usuarios en localStorage
      const USUARIOS_KEY = "web07_usuarios";
      const SESION_KEY = "web07_sesion";

      const obtenerUsuarios = () => JSON.parse(localStorage.getItem(USUARIOS_KEY) || "[]");
      const guardarUsuarios = (users) => localStorage.setItem(USUARIOS_KEY, JSON.stringify(users));

      // Inicializar usuario demo si no existe
      const initDemoUser = () => {
        const users = obtenerUsuarios();
        if (!users.find(u => u.usuario === "admin")) {
          users.push({
            id: 1,
            nombre: "Administrador",
            email: "admin@web07.local",
            usuario: "admin",
            pass: "123456", // En producción: hash
            fecha: new Date().toISOString()
          });
          guardarUsuarios(users);
        }
      };
      initDemoUser();

      // LOGIN SUBMIT
      if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
          e.preventDefault();
          if (!validarLogin()) return;

          const usuario = dom.valor("loginUsuario").trim();
          const pass = dom.valor("loginContrasena");
          const recordar = dom.porId("loginRecordar").checked;

          const users = obtenerUsuarios();
          const user = users.find(u =>
            (u.usuario === usuario || u.email === usuario) && u.pass === pass
          );

          if (user) {
            const sesion = { id: user.id, nombre: user.nombre, usuario: user.usuario, email: user.email };
            if (recordar) localStorage.setItem(SESION_KEY, JSON.stringify(sesion));
            else sessionStorage.setItem(SESION_KEY, JSON.stringify(sesion));

            alerts.ok("Ingreso aceptado", `¡Bienvenido, ${user.nombre}!`);
            setTimeout(() => window.location.href = "index.html", 1200);
          } else {
            alerts.error("Error", "Credenciales incorrectas. Inténtalo nuevamente.");
          }
        });
      }

      // REGISTER SUBMIT
      if (registerForm) {
        registerForm.addEventListener("submit", (e) => {
          e.preventDefault();
          if (!validarRegister()) return;

          const nombre = dom.valor("regNombre").trim();
          const email = dom.valor("regEmail").trim().toLowerCase();
          const pass = dom.valor("regContrasena");

          const users = obtenerUsuarios();

          if (users.find(u => u.email === email)) {
            alerts.error("Error", "Este email ya está registrado.");
            return;
          }
          if (users.find(u => u.usuario === email.split("@")[0])) {
            alerts.warning("Advertencia", "El nombre de usuario sugerido ya existe. Se usará el email.");
          }

          const nuevo = {
            id: Date.now(),
            nombre,
            email,
            usuario: email.split("@")[0],
            pass, // En producción: hash con bcrypt
            fecha: new Date().toISOString()
          };

          users.push(nuevo);
          guardarUsuarios(users);

          alerts.ok("¡Registro exitoso!", `Bienvenido, ${nombre}. Ahora puedes iniciar sesión.`);
          registerForm.reset();
          dom.porId("regTerminos").checked = false;
          switchTab("login");
        });
      }

      // Limpiar errores al escribir
      ["loginUsuario", "loginContrasena", "regNombre", "regEmail", "regContrasena", "regConfirmar", "regTerminos"].forEach(id => {
        const el = dom.porId(id);
        if (el) el.addEventListener("input", () => el.classList.remove("is-invalid"));
      });

      // Verificar sesión existente
      const sesion = JSON.parse(localStorage.getItem(SESION_KEY) || sessionStorage.getItem(SESION_KEY) || "null");
      if (sesion) {
        alerts.ok("Sesión activa", `Ya has iniciado sesión como ${sesion.nombre}. Redirigiendo...`);
        setTimeout(() => window.location.href = "index.html", 1000);
      }
    },
  });
})(window);