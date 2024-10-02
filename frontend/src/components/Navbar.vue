<template>
  <div>
    <nav class="navbar">
      <router-link to="/">Home</router-link>
      <template v-if="!displayName">
        <router-link to="/login"> | Login</router-link>
        <router-link to="/register"> | Register</router-link>
        <router-link to="/forget-password"> | Forgot Password</router-link>
      </template>
      <div class="welcome-section">
        <p v-if="displayName">Welcome, <span>{{ displayName }}</span></p>
        <button v-if="displayName" @click="logout">Logout</button>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'Navbar',
  data() {
    return {
      displayName: null,
    };
  },
  created() {
    this.checkLocalStorage();
  },
  methods: {
    getLocalStorageItem(name) {
      return localStorage.getItem(name);
    },
    deleteLocalStorageItem(name) {
      localStorage.removeItem(name);
    },
    checkLocalStorage() {
      this.displayName = this.getLocalStorageItem('displayName');
    },
    logout() {
      this.deleteLocalStorageItem('displayName');
      this.deleteLocalStorageItem('idToken');
      this.displayName = null;
      this.$router.push({ path: '/login'});
    },
  },
};
</script>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: center;
}

.welcome-section {
  display: flex;
  align-items: center;
  padding: 0 20px;
}

button {
  margin-left: 10px;
}

span {
  font-weight: bold;
}
</style>