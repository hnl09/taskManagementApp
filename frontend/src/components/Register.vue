<template>
  <div>
    <Navbar />
    <h2>Register</h2>
    <form @submit.prevent="register">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <input v-model="firstName" type="text" placeholder="First Name" required />
      <input v-model="lastName" type="text" placeholder="Last Name" required />
      <button type="submit">Register</button>
    </form>
    <p v-if="loading" class="loading">Loading...</p>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script>
import axios from 'axios';
import Navbar from '@/components/Navbar.vue';

export default {
  name: 'Register',
  components: {
    Navbar
  },
  data() {
    return {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      role: 'USER',
      errorMessage: '',
      loading: false,
    };
  },
  methods: {
    async register() {
      this.loading = true;
      try {
        const response = await axios.post('/auth/signup', {
          email: this.email,
          password: this.password,
          firstName: this.firstName,
          lastName: this.lastName,
          role: this.role
        });
        console.log(response.data);
        localStorage.setItem('idToken', response.data.idToken);
        localStorage.setItem('displayName', response.data.displayName);
        this.$router.push({ path: '/'});
      } catch (error) {
        if (error.response && error.response.status === 400) {
          if (error.response.data.error === 'Firebase: Error (auth/email-already-in-use).') {
            this.errorMessage = 'Email already in use. Please try another email.';
          } else {
            this.errorMessage = error.response.data.message[0];
          }
          console.log('Error during registration:', error.response.data);
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