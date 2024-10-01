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
    },
  },
};
</script>