<template>
  <div>
    <Navbar class="navbar" />
    <div v-if="idToken" class="container">
      <div class="left">
        <h1>Tasks</h1>
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
              <p>Title: {{ task.title }}</p>
              <p>Description: {{ task.description }}</p>
              <p>Status: {{ task.status }}</p>
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

.delete-button, .edit-button {
  position: absolute;
  top: 8px;
  right: 8px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2em;
}

.delete-button {
  color: red;
}

.edit-button {
  right: 60px;
  color: blue;
}

form div {
  margin-bottom: 16px;
}

form label {
  display: block;
  margin-bottom: 8px;
}

form input, form textarea, form select {
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
  background-color: #0057b35d;
}
</style>