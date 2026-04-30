document.addEventListener("DOMContentLoaded", () => {
  const loginView = document.getElementById("login-view");
  const registerView = document.getElementById("register-view");
  const dashboardView = document.getElementById("dashboard-view");

  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const addSensorForm = document.getElementById("add-sensor-form");
  const toggleAddSensorBtn = document.getElementById("toggle-add-sensor-btn");
  const cancelAddSensorBtn = document.getElementById("cancel-add-sensor-btn");
  const addSensorPanel = document.getElementById("add-sensor-panel");

  const loginError = document.getElementById("login-error");
  const registerError = document.getElementById("register-error");
  const dashboardError = document.getElementById("dashboard-error");

  const goToRegister = document.getElementById("go-to-register");
  const goToLogin = document.getElementById("go-to-login");
  const logoutBtn = document.getElementById("logout-btn");

  const sensorList = document.getElementById("sensor-list");
  const userInfo = document.getElementById("user-info");

  function showView(view) {
    loginView.classList.add("hidden");
    registerView.classList.add("hidden");
    dashboardView.classList.add("hidden");
    view.classList.remove("hidden");
  }

  goToRegister.addEventListener("click", (e) => {
    e.preventDefault();
    showView(registerView);
    registerError.style.display = "none";
  });

  goToLogin.addEventListener("click", (e) => {
    e.preventDefault();
    showView(loginView);
    loginError.style.display = "none";
  });

  toggleAddSensorBtn.addEventListener("click", () => {
    addSensorPanel.classList.remove("hidden");
    document.getElementById("sensor-apelido").focus();
  });

  cancelAddSensorBtn.addEventListener("click", () => {
    addSensorPanel.classList.add("hidden");
    addSensorForm.reset();
    dashboardError.style.display = "none";
  });

  let updateInterval;

  function checkAuth() {
    const token = localStorage.getItem("token");
    if (token) {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      userInfo.textContent = `Olá, ${user.nome || user.email}!`;
      showView(dashboardView);
      loadSensors();
      if (!updateInterval) {
        updateInterval = setInterval(() => loadSensors(true), 3000);
      }
    } else {
      showView(loginView);
      if (updateInterval) {
        clearInterval(updateInterval);
        updateInterval = null;
      }
    }
  }

  function showError(element, message) {
    element.textContent = message;
    element.style.display = "block";
  }

  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    registerError.style.display = "none";

    const nome = document.getElementById("register-name").value;
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;

    try {
      const response = await fetch("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        showError(registerError, data.error || "Erro no cadastro.");
        return;
      }

      alert("Cadastro realizado com sucesso! Faça o login.");
      registerForm.reset();
      showView(loginView);
    } catch (error) {
      showError(registerError, "Falha na comunicação com o servidor.");
    }
  });

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    loginError.style.display = "none";

    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    try {
      const response = await fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        showError(loginError, data.error || "Erro no login.");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.cliente));

      loginForm.reset();
      checkAuth();
    } catch (error) {
      showError(loginError, "Falha na comunicação com o servidor.");
    }
  });

  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    if (updateInterval) {
      clearInterval(updateInterval);
      updateInterval = null;
    }
    checkAuth();
  });

  async function loadSensors(silent = false) {
    dashboardError.style.display = "none";
    if (!silent) sensorList.innerHTML = "Carregando...";

    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const response = await fetch(
        `/api/sensors?clienteEmail=${encodeURIComponent(user.email)}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (response.status === 401 || response.status === 403) {
        logoutBtn.click();
        return;
      }

      const sensors = await response.json();

      if (sensors.length === 0) {
        sensorList.innerHTML =
          "<p>Você não possui nenhum sensor cadastrado.</p>";
        return;
      }

      if (
        silent &&
        document.querySelectorAll(".sensor-widget").length === sensors.length
      ) {
        sensors.forEach((sensor) => {
          const valElement = document.getElementById(`val-${sensor._id}`);
          if (valElement) {
            valElement.textContent =
              sensor.valor !== null ? sensor.valor : "--";
          }
        });
        return;
      }

      sensorList.innerHTML = "";
      sensors.forEach((sensor) => {
        const val = sensor.valor !== null ? sensor.valor : "--";
        const unit = sensor.unidade || "";
        const div = document.createElement("div");
        div.className = "sensor-widget";
        div.innerHTML = `
                    <div class="sensor-widget-header">
                        <strong>${sensor.apelido}</strong>
                    </div>
                    <div class="sensor-widget-body">
                        <p class="sensor-value" id="val-${sensor._id}">${val}</p>
                        <span class="sensor-unit">${unit}</span>
                    </div>
                    <div class="sensor-widget-footer">
                        ID: <code>${sensor.DeviceID}</code> | Senha: <code>${sensor.DevicePWD}</code>
                    </div>
                    <div class="sensor-actions-row">
                        <button class="btn-edit" onclick="editSensor('${sensor._id}', '${sensor.apelido}')">Editar</button>
                        <button class="btn-delete" onclick="deleteSensor('${sensor._id}')">Excluir</button>
                    </div>
                `;
        sensorList.appendChild(div);
      });
    } catch (error) {
      showError(dashboardError, "Erro ao carregar sensores.");
      sensorList.innerHTML = "";
    }
  }

  addSensorForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    dashboardError.style.display = "none";

    const apelido = document.getElementById("sensor-apelido").value;
    const unidade = document.getElementById("sensor-unidade").value;
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    try {
      const response = await fetch("/api/sensors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ apelido, unidade, clienteEmail: user.email }),
      });

      if (!response.ok) {
        const data = await response.json();
        showError(dashboardError, data.error || "Erro ao criar sensor.");
        return;
      }

      addSensorForm.reset();
      addSensorPanel.classList.add("hidden");
      loadSensors();
    } catch (error) {
      showError(dashboardError, "Falha na comunicação com o servidor.");
    }
  });

  window.editSensor = async (id, currentName) => {
    const novoApelido = prompt(
      "Digite o novo apelido para o sensor:",
      currentName,
    );
    if (!novoApelido || novoApelido === currentName) return;

    try {
      const response = await fetch(`/api/sensors/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ apelido: novoApelido }),
      });

      if (response.ok) {
        loadSensors();
      } else {
        alert("Erro ao editar sensor.");
      }
    } catch (error) {
      alert("Falha na comunicação com o servidor.");
    }
  };

  window.deleteSensor = async (id) => {
    if (!confirm("Tem certeza que deseja excluir este sensor?")) return;

    try {
      const response = await fetch(`/api/sensors/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        loadSensors();
      } else {
        alert("Erro ao excluir sensor.");
      }
    } catch (error) {
      alert("Falha na comunicação com o servidor.");
    }
  };

  checkAuth();
});
