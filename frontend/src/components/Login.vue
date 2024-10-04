<template>
  <div>
    <Navbar />
    <h2>Login</h2>
    <form @submit.prevent="login">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
    <p v-if="loading" class="loading">Loading...</p>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script>
import axios from 'axios';
import Navbar from '@/components/Navbar.vue';

export default {
  name: 'Login',
  components: {
    Navbar,
  },
  data() {
    return {
      email: '',
      password: '',
      errorMessage: '',
      loading: false,
    };
  },
  methods: {
    async login() {
      this.loading = true;
      try {
        const response = await axios.post('/auth/signin', {
          email: this.email,
          password: this.password,
        });
        console.log(response.data);
        localStorage.setItem('idToken', response.data.userCredential._tokenResponse.idToken);
        localStorage.setItem('displayName', response.data.userCredential._tokenResponse.displayName);
        this.$router.push({ path: '/'});
      } catch (error) {
        if (error.response && error.response.status === 400) {
          this.errorMessage = 'Check your credentials and try again.';
        } else {
          console.error('Error during login:', error);
        }
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>