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
    <p v-if="errorMessage">{{ errorMessage }}</p>
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
      errorMessage: ''
    };
  },
  methods: {
    async register() {
      try {
        const response = await axios.post('/auth/signup', {
          email: this.email,
          password: this.password,
          firstName: this.firstName,
          lastName: this.lastName,
          role: this.role
        });
        console.log(response.data);
        document.cookie = `idToken=${response.data.idToken}; path=/`;
        document.cookie = `displayName=${response.data.displayName}; path=/`;
        this.$router.push({ path: '/tasks'});
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
      }
    },
  },
};
</script>