<template>
  <div>
    <Navbar class="navbar" />
    <div v-if="idToken" class="container">
      <div class="left">
        <h1>Tasks</h1>
        <ul>
          <li v-for="task in tasks" :key="task.id" class="card">
            <button @click="deleteTask(task.id)" class="delete-button">Delete</button>
            <p>Title: {{ task.title }}</p>
            <p>Description: {{ task.description }}</p>
            <p>Status: {{ task.status }}</p>
            <p v-if="minutesSinceCreated(task.updatedAt) === 0">Just now</p>
            <p v-else-if="minutesSinceCreated(task.createdAt) === 0">Just now</p>
            <p v-else-if="task.updatedAt">{{ minutesSinceCreated(task.updatedAt) }} minutes ago</p>
            <p v-else>{{ minutesSinceCreated(task.createdAt) }} minutes ago</p>
          </li>
        </ul>
      </div>
      <div class="right">
        <h2>Create Task</h2>
        <form @submit.prevent="createTask">
          <div>
            <label for="title">Title:</label>
            <input type="text" v-model="newTask.title" id="title" required />
          </div>
          <div>
            <label for="description">Description:</label>
            <textarea v-model="newTask.description" id="description" required></textarea>
          </div>
          <button type="submit">Create Task</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Cookies from 'js-cookie';
import Navbar from '@/components/Navbar.vue';

export default {
  name: 'Tasks',
  components: {
    Navbar
  },
  data() {
    return {
      tasks: [],
      idToken: null,
      newTask: {
        title: '',
        description: '',
        status: 'PENDING'
      }
    };
  },
  created() {
    this.idToken = Cookies.get('idToken');
    if (!this.idToken) {
      this.$router.push({ path: '/'});
    } else {
      this.fetchTasks();
    }
  },
  methods: {
    async fetchTasks() {
      try {
        const response = await axios.get('/tasks', {
          headers: {
            Authorization: `Bearer ${this.idToken}`
          }
        });
        this.tasks = response.data;
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    },
    async deleteTask(taskId) {
      try {
        await axios.delete(`/tasks/${taskId}`, {
          headers: {
            Authorization: `Bearer ${this.idToken}`
          }
        });
        this.tasks = this.tasks.filter(task => task.id !== taskId);
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    },
    async createTask() {
      try {
        const response = await axios.post('/tasks', this.newTask, {
          headers: {
            Authorization: `Bearer ${this.idToken}`
          }
        });
        this.tasks.push(response.data);
        console.log('Task created:', response.data);
        this.newTask = { title: '', description: '', status: 'PENDING' };
      } catch (error) {
        console.error('Error creating task:', error);
      }
    },
    minutesSinceCreated(timestamp) {
      if (timestamp && timestamp.seconds !== undefined && timestamp.nanoseconds !== undefined) {
        const createdDate = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
        const now = new Date();
        const diffInMs = now - createdDate;
        const diffInMinutes = Math.floor(diffInMs / 60000);
        return diffInMinutes;
      } else {
        return 'Invalid timestamp';
      }
    }
  }
};
</script>

<style scoped>
.navbar {
  text-align: center;
  margin-bottom: 20px;
}

.container {
  display: flex;
  justify-content: space-between;
}

.left, .right {
  width: 45%;
}

.card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  margin: 16px 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  position: relative;
}

.card p {
  margin: 8px 0;
}

.card h1 {
  font-size: 1.5em;
  margin-bottom: 16px;
}

.card ul {
  list-style-type: none;
  padding: 0;
}

.card li {
  margin-bottom: 16px;
}

.delete-button {
  position: absolute;
  top: 8px;
  right: 8px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2em;
  color: red;
}

form div {
  margin-bottom: 16px;
}

form label {
  display: block;
  margin-bottom: 8px;
}

form input, form textarea {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

form button {
  padding: 8px 16px;
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

form button:hover {
  background-color: #0056b3;
}
</style>