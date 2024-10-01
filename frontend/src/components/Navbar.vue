<template>
  <div>
    <nav>
      <router-link to="/">Home</router-link>
      <template v-if="!displayName">
        <router-link to="/login"> | Login</router-link>
        <router-link to="/register"> | Register</router-link>
        <router-link to="/forget-password"> | Forget Password</router-link>
      </template>
      <template v-if="displayName">
        <router-link to="/tasks"> | Tasks</router-link>
      </template>
      <p v-if="displayName">Welcome, {{ displayName }}</p>
      <p v-else>Welcome, guest! Create your account to be able to create your tasks.</p>
      <button v-if="displayName" @click="logout">Logout</button>
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
      this.$router.push({ path: '/'});
    },
  },
};
</script>

<style scoped>
</style>