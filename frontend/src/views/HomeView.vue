<template>
  <div>
    <Navbar class="navbar" />
    <div v-if="idToken" class="container">
      <div class="left">
        <h1 class="task-title">My Tasks</h1>
        <ul>
          <li v-for="task in tasks" :key="task.id" class="card">
            <button @click="deleteTask(task.id)" class="delete-button">Delete</button>
            <button @click="task.isEditing = !task.isEditing" class="edit-button">
              {{ task.isEditing ? 'Cancel' : 'Edit' }}
            </button>
            <div v-if="task.isEditing">
              <form @submit.prevent="updateTask(task)">
                <div>
                  <label for="title">Title:</label>
                  <input type="text" v-model="task.title" id="title" required />
                </div>
                <div>
                  <label for="description">Description:</label>
                  <textarea v-model="task.description" id="description" required></textarea>
                </div>
                <div>
                  <label for="status">Status:</label>
                  <select v-model="task.status" id="status" required>
                    <option value="PENDING">Pending</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="DONE">Done</option>
                  </select>
                </div>
                <button type="submit">Save</button>
              </form>
            </div>
            <div v-else>
              <h2>{{ task.title }}</h2>
              <h4>Description:</h4>
              <p>{{ task.description }}</p>
              <p>{{ formatStatus(task.status) }}</p>
              <p v-if="minutesSinceCreated(task.updatedAt) === 0">Just now</p>
              <p v-else-if="minutesSinceCreated(task.createdAt) === 0">Just now</p>
              <p v-else-if="task.updatedAt">{{ minutesSinceCreated(task.updatedAt) }} minutes ago</p>
              <p v-else>{{ minutesSinceCreated(task.createdAt) }} minutes ago</p>
            </div>
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
          <div>
            <label for="status">Status:</label>
            <select v-model="newTask.status" id="status" required>
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>
          </div>
          <button type="submit">Create Task</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Navbar from '@/components/Navbar.vue';

export default {
  name: 'HomeView',
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
    mounted() {
    if (!this.idToken) {
      this.$router.push('/login');
    }
  },
  created() {
    this.idToken = localStorage.getItem('idToken');
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
        this.tasks = response.data.map(task => ({ ...task, isEditing: false }));
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
        this.tasks.push({ ...response.data, isEditing: false });
        console.log('Task created:', response.data);
        this.newTask = { title: '', description: '', status: 'PENDING' };
      } catch (error) {
        console.error('Error creating task:', error);
      }
    },
    async updateTask(task) {
      try {
        const response = await axios.patch(`/tasks/${task.id}`, {
          title: task.title,
          description: task.description,
          status: task.status
        }, {
          headers: {
            Authorization: `Bearer ${this.idToken}`
          }
        });
        Object.assign(task, response.data, { isEditing: false });
        console.log('Task updated:', response.data);
      } catch (error) {
        console.error('Error updating task:', error);
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
    },
    formatStatus(status) {
      switch (status) {
        case 'PENDING':
          return 'Pending';
        case 'IN_PROGRESS':
          return 'In Progress';
        case 'DONE':
          return 'Done';
        default:
          return status;
      }
    }
  }
};
</script>

<style scoped>
body {
  padding: 20px;
  font-family: 'Arial', sans-serif;
  background-color: #f4f4f9;
}

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

.left {
  margin-left: 20px;
}

.card {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
  background: white;
  position: relative;
  margin-bottom: 16px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.card ul {
  list-style-type: none;
  padding: 0;
}

.card li {
  list-style-type: none;
  margin-bottom: 16px;
}

.delete-button, .edit-button {
  position: absolute;
  top: 8px;
  right: 8px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2em;
  transition: color 0.2s;
}

.delete-button {
  color: #ff4d4d;
}

.delete-button:hover {
  color: #ff1a1a;
}

.edit-button {
  right: 80px;
  color: #007bff;
}

.edit-button:hover {
  color: #0056b3;
}

.task-title {
  margin-bottom: 16px;
}

form div {
  margin-bottom: 16px;
}

form label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
}

form input, form textarea, form select {
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}

form button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

form button:hover {
  background-color: #0056b3;
}
</style>