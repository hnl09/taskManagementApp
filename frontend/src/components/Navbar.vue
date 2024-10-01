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
    this.checkCookies();
  },
  methods: {
    getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
    },
    deleteCookie(name) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    },
    checkCookies() {
      this.displayName = this.getCookie('displayName');
    },
    logout() {
      this.deleteCookie('displayName');
      this.deleteCookie('idToken');
      this.displayName = null;
      this.$router.push({ path: '/'});
    },
  },
};
</script>

<style scoped>
</style>