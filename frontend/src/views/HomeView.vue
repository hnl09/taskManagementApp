<template>
  <div>
    <Navbar />
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';

export default {
  name: 'HomeView',
  components: {
    Navbar
  },
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
    },
  },
};
</script>