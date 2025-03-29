<script setup>
import Header from './TableHeader.vue'

// ====== Props & emitter declarations ======
const props = defineProps({
  sales_data: {
    type: Object,
  },
  sortKey: String,
  sortOrder: Number,
})
const emit = defineEmits(['removeRecord', 'selectRecord', 'sortBy'])
</script>

<template>
  <div class="container">
    <table>
      <thead>
        <tr>
          <th @click="emit('sortBy', 'object_id')">
            <Header
              header="Order No"
              header-key="object_id"
              :sort-key="sortKey"
              :sort-order="sortOrder"
            />
          </th>
          <th @click="emit('sortBy', 'customer_name')">
            <Header
              header="Customer Name"
              header-key="customer_name"
              :sort-key="sortKey"
              :sort-order="sortOrder"
            />
          </th>
          <th @click="emit('sortBy', 'status')">
            <Header
              header="Status"
              header-key="status"
              :sort-key="sortKey"
              :sort-order="sortOrder"
            />
          </th>
          <th @click="emit('sortBy', 'name')">
            <Header
              header="Category"
              header-key="name"
              :sort-key="sortKey"
              :sort-order="sortOrder"
            />
          </th>
          <th @click="emit('sortBy', 'country')">
            <Header
              header="Country"
              header-key="country"
              :sort-key="sortKey"
              :sort-order="sortOrder"
            />
          </th>
          <th @click="emit('sortBy', 'created_date')">
            <Header
              header="Created Date"
              header-key="created_date"
              :sort-key="sortKey"
              :sort-order="sortOrder"
            />
          </th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in sales_data" :key="order.id">
          <td>{{ order.object_id }}</td>
          <td>{{ order.customer_name }}</td>
          <td>{{ order.status }}</td>
          <td>{{ order.name }}</td>
          <td>{{ order.country }}</td>
          <td>{{ new Date(order.created_date).toLocaleDateString('en-US') }}</td>
          <td>
            <div class="gap-sm">
              <button class="remove-btn" @click="emit('removeRecord', order.object_id)">
                Delete</button
              ><button class="edit-btn" @click="emit('selectRecord', order.object_id)">Edit</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
table {
  table-layout: auto;
  width: 100%;
  border-radius: 10px;
  border-collapse: collapse;
}

thead {
  background-color: rgb(180, 180, 180);
  color: white;
}

th:hover,
th:enabled {
  background-color: rgb(116, 116, 116);
  cursor: pointer;
}

th,
td {
  text-align: left;
  padding: 10px;
}

tr:nth-child(even) {
  background-color: #f2f2f2;
}

.remove-btn {
  background-color: rgb(208, 52, 44);
  color: white;
  font-weight: bold;
}

.edit-btn {
  background-color: rgb(40, 146, 72);
  color: white;
  font-weight: bold;
}
</style>
