<template>
  <div>
    <Navbar />
    <h2>Forget Password</h2>
    <form @submit.prevent="forgetPassword">
      <input v-model="email" type="email" placeholder="Email" required />
      <button type="submit">Submit</button>
    </form>
    <p v-if="errorMessage">{{ errorMessage }}</p>
    <p v-if="successMessage">{{ successMessage }}</p>
  </div>
</template>

<script>
import axios from 'axios';
import Navbar from '@/components/Navbar.vue';

export default {
  name: 'ForgetPassword',
  components: {
    Navbar,
  },
  data() {
    return {
      email: '',
      errorMessage: '',
      successMessage: '',
    };
  },
  methods: {
    async forgetPassword() {
      try {
        const response = await axios.post('/auth/reset-password', {
          email: this.email,
        });
        console.log(response.data);
        this.errorMessage = '';
        this.successMessage = 'Email sent! Check your email to reset your password.';
      } catch (error) {
        if (error.response && error.response.status === 400) {
          this.successMessage = '';
          this.errorMessage = 'Email not registered.';
        } else {
          console.error('Error reseting password:', error);
        }
        console.log(this.errorMessage);
      }
    },
  },
};
</script>