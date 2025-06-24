const api = 'http://localhost:5129/api';
const token = localStorage.getItem('token');

// --- Load Todo ---
async function fetchTodos() {
  if (!token) {
    alert('Bạn chưa đăng nhập!');
    window.location.href = 'login.html';
    return;
  }

  try {
    const res = await fetch(`${api}/todo`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!res.ok) throw new Error(await res.text());

    const todos = await res.json();
    const list = document.getElementById('todo-list');
    list.innerHTML = '';

    todos.forEach(t => {
      const li = document.createElement('li');
      li.classList.add(`priority-${['low', 'medium', 'high'][t.priority]}`);
      if (t.done) li.classList.add('done');

      const priorityText = ['Low', 'Medium', 'High'][t.priority] || 'Unknown';

      li.innerHTML = `
        <strong>${t.text}</strong>
        <span>(${priorityText})</span> - ${t.deadline || 'No deadline'}
        <input type="checkbox" ${t.done ? 'checked' : ''} onchange="toggleDone(${t.id}, this.checked)">
        <button onclick="deleteTodo(${t.id})">🗑</button>
      `;
      list.appendChild(li);
    });
  } catch (err) {
    alert('Lỗi tải danh sách: ' + err.message);
  }
}

// --- Cập nhật trạng thái ---
async function toggleDone(id, done) {
  try {
    await fetch(`${api}/todo/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ done })
    });
    fetchTodos();
  } catch (err) {
    alert('Lỗi cập nhật: ' + err.message);
  }
}

// --- Xóa task ---
async function deleteTodo(id) {
  try {
    await fetch(`${api}/todo/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchTodos();
  } catch (err) {
    alert('Lỗi xóa: ' + err.message);
  }
}

// --- Thêm task ---
const todoForm = document.getElementById('todo-form');
if (todoForm) {
  todoForm.addEventListener('submit', async e => {
    e.preventDefault();
    const text = document.getElementById('text').value;
    const deadline = document.getElementById('deadline').value;
    const priority = parseInt(document.getElementById('priority').value);

    try {
      await fetch(`${api}/todo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text, deadline, priority, done: false })
      });

      e.target.reset();
      fetchTodos();
    } catch (err) {
      alert('Lỗi thêm task: ' + err.message);
    }
  });

  fetchTodos();
  showUserInfo();
}

// --- Đăng ký ---
const registerForm = document.getElementById('register-form');
if (registerForm) {
  registerForm.addEventListener('submit', async e => {
    e.preventDefault();
    const username = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value;

    try {
      const res = await fetch(`${api}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (res.ok) {
        alert('Đăng ký thành công! Mời đăng nhập.');
      } else {
        throw new Error(await res.text());
      }
    } catch (err) {
      alert('Lỗi đăng ký: ' + err.message);
    }
  });
}

// --- Đăng nhập ---
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', async e => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
      const res = await fetch(`${api}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('token', data.token);
        // Optionally save username
        localStorage.setItem('username', username);
        window.location.href = 'index.html';
      } else {
        throw new Error('Đăng nhập thất bại!');
      }
    } catch (err) {
      alert(err.message);
    }
  });
}

// --- Hiển thị tên người dùng ---
function showUserInfo() {
  const username = localStorage.getItem('username');
  if (username) {
    const span = document.getElementById('username-display');
    if (span) span.textContent = `Hello, ${username}`;
  }
}

// --- Đăng xuất ---
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  window.location.href = 'login.html';
}
