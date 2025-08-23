// Demo client-side auth and UI logic
const USERS_KEY = 'simplifitech_users';
const SESSION_KEY = 'simplifitech_session';

function loadUsers() {
  let users = localStorage.getItem(USERS_KEY);
  if (!users) {
    fetch('/Users.json').then(r => r.json()).then(data => {
      localStorage.setItem(USERS_KEY, JSON.stringify(data));
    });
    return [];
  }
  return JSON.parse(users);
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getSession() {
  return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
}

function setSession(user) {
  if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  else localStorage.removeItem(SESSION_KEY);
}

function renderProfilePanel() {
  const session = getSession();
  const el = document.getElementById('profile-content');
  if (!el) return;
  if (session) {
    el.innerHTML = `<div>Welcome, <b>${session.displayName || session.username}</b></div>
      <button class="btn btn-outline-danger btn-sm mt-2" onclick="logout()">Logout</button>`;
  } else {
    el.innerHTML = `<button class="btn btn-primary btn-sm me-2" onclick="showLogin()">Login</button>
      <button class="btn btn-success btn-sm" onclick="showSignup()">Sign Up</button>`;
  }
}

function showLogin() {
  const html = `<div class="modal" tabindex="-1" id="loginModal" style="display:block; background:rgba(0,0,0,0.5);">
    <div class="modal-dialog"><div class="modal-content">
      <div class="modal-header"><h5 class="modal-title">Login</h5></div>
      <div class="modal-body">
        <input id="login-username" class="form-control mb-2" placeholder="Email">
        <input id="login-password" type="password" class="form-control mb-2" placeholder="Password">
        <div id="login-error" class="text-danger"></div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-primary" onclick="doLogin()">Login</button>
        <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      </div>
    </div></div></div></div>`;
  document.body.insertAdjacentHTML('beforeend', html);
}

function showSignup() {
  const html = `<div class="modal" tabindex="-1" id="signupModal" style="display:block; background:rgba(0,0,0,0.5);">
    <div class="modal-dialog"><div class="modal-content">
      <div class="modal-header"><h5 class="modal-title">Sign Up</h5></div>
      <div class="modal-body">
        <input id="signup-username" class="form-control mb-2" placeholder="Email">
        <input id="signup-password" type="password" class="form-control mb-2" placeholder="Password">
        <input id="signup-displayName" class="form-control mb-2" placeholder="Display Name">
        <div id="signup-error" class="text-danger"></div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-success" onclick="doSignup()">Sign Up</button>
        <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      </div>
    </div></div></div></div>`;
  document.body.insertAdjacentHTML('beforeend', html);
}

function closeModal() {
  document.querySelectorAll('.modal').forEach(m => m.remove());
}

function doLogin() {
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;
  const users = loadUsers();
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    setSession(user);
    closeModal();
    renderProfilePanel();
  } else {
    document.getElementById('login-error').textContent = 'Invalid credentials.';
  }
}

function doSignup() {
  const username = document.getElementById('signup-username').value;
  const password = document.getElementById('signup-password').value;
  const displayName = document.getElementById('signup-displayName').value;
  let users = loadUsers();
  if (users.find(u => u.username === username)) {
    document.getElementById('signup-error').textContent = 'User already exists.';
    return;
  }
  const user = { username, password, displayName };
  users.push(user);
  saveUsers(users);
  setSession(user);
  closeModal();
  renderProfilePanel();
}

function logout() {
  setSession(null);
  renderProfilePanel();
}

document.addEventListener('DOMContentLoaded', function() {
  renderProfilePanel();
  if (window.ADMIN_PAGE) {
    const session = getSession();
    if (!session) {
      document.getElementById('admin-auth-warning').classList.remove('d-none');
      document.getElementById('prompt-edit-form').style.display = 'none';
      document.getElementById('trigger-post-btn').style.display = 'none';
    } else {
      // Load prompts
      fetch('/prompts.yml').then(r => r.text()).then(yml => {
        const appmod = yml.match(/application_modernization:\s*prompt: "([^"]+)"/);
        const ai = yml.match(/artificial_intelligence:\s*prompt: "([^"]+)"/);
        const cloud = yml.match(/cloud_migration:\s*prompt: "([^"]+)"/);
        if (appmod) document.getElementById('prompt-appmod').value = appmod[1];
        if (ai) document.getElementById('prompt-ai').value = ai[1];
        if (cloud) document.getElementById('prompt-cloud').value = cloud[1];
      });
      document.getElementById('prompt-edit-form').onsubmit = function(e) {
        e.preventDefault();
        // TODO: Save prompts (requires backend or PR)
        document.getElementById('admin-status').textContent = 'Prompts saved (demo only, edit prompts.yml in repo for real changes).';
      };
      document.getElementById('trigger-post-btn').onclick = function() {
        document.getElementById('admin-status').textContent = 'Triggering post (demo only, use GitHub Actions for real posts).';
      };
    }
  }
});
