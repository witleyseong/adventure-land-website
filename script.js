document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ script.js carregado com sucesso!");

  const adminLink = document.getElementById("admin-link");
  if (!adminLink) {
    console.error("❌ admin-link não encontrado no HTML!");
    return;
  }

  // cria o modal direto no HTML
  const modalHTML = `
    <div id="login-modal" class="modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); justify-content:center; align-items:center; z-index:9999;">
      <div class="modal-content" style="background:white; padding:20px; border-radius:10px; text-align:center; width:300px;">
        <h4>Admin Login</h4>
        <input type="email" id="admin-email" placeholder="Email" style="width:90%; padding:8px; margin:5px;"><br>
        <input type="password" id="admin-password" placeholder="Password" style="width:90%; padding:8px; margin:5px;"><br>
        <button id="login-btn" style="margin-top:10px; padding:8px 15px;">Login</button>
        <button id="close-modal" style="margin-top:10px; padding:8px 15px;">Cancel</button>
        <p id="login-message" style="color:red; margin-top:10px;"></p>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHTML);

  // pega os elementos criados
  const modal = document.getElementById("login-modal");
  const closeModal = document.getElementById("close-modal");
  const loginBtn = document.getElementById("login-btn");
  const message = document.getElementById("login-message");

  // abrir modal
  adminLink.addEventListener("click", (e) => {
    e.preventDefault();
    console.log("🟢 Clicou em Admin!");
    modal.style.display = "flex";
  });

  // fechar modal
  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // tentar login (chama backend)
  loginBtn.addEventListener("click", async () => {
    const email = document.getElementById("admin-email").value.trim();
    const password = document.getElementById("admin-password").value.trim();

    if (!email || !password) {
      message.textContent = "Preencha email e senha.";
      return;
    }

    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const result = await response.json();

      if (result.success) {
        localStorage.setItem("isAdminLogged", "true");
        window.location.href = "admin.html";
      } else {
        message.textContent = result.message;
      }
    } catch (err) {
      console.error("Erro de conexão:", err);
      message.textContent = "Erro ao conectar com o servidor.";
    }
  });

  // fechar clicando fora
  window.onclick = function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };
});
