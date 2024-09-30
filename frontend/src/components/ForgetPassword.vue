<template>
  <div>
    <h2>Forget Password</h2>
    <form @submit.prevent="forgetPassword">
      <input v-model="email" type="email" placeholder="Email" required />
      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      email: '',
    };
  },
  methods: {
    async forgetPassword() {
      try {
        const response = await axios.post('/auth/reset-password', {
          email: this.email,
        });
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>