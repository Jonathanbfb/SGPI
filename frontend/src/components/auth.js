const users = [
  { username: "admin", password: "admin123", role: "Administrador" },
  { username: "pesquisador", password: "pesq123", role: "Pesquisador" },
  { username: "engenheiro", password: "eng123", role: "Engenheiro" },
];

// Simula login e autenticação
export const loginUser = (username, password) => {
  const user = users.find((u) => u.username === username && u.password === password);
  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
    return user;
  }
  return null;
};

export const getAuthenticatedUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

export const logoutUser = () => {
  localStorage.removeItem("user");
};
