<script setup>
import SalesTable from '../components/SalesTable.vue'
import FilterModal from '../components/FilterModal.vue'
import SalesForm from '../components/SalesForm.vue'
import { ref, reactive, onMounted } from 'vue'
import { GetData, DeleteData } from '@/api/mysql_api'

// ====== Ref & reactive declarations ======
const sales_data = ref([])
const filtered_sales_data = ref([])
const apiError = ref('')
const criterion = reactive({
  customerName: [],
  status: [],
  category: [],
  country: [],
})
const initialState = {
  createdDateFrom: '',
  createdDateUntil: new Date().toLocaleDateString('en-CA'),
  customerName: 'All',
  status: ['All'],
  category: ['All'],
  country: 'All',
}
const filterForm = ref({ ...initialState })
const selectedRecord = ref({})
const mode = ref('add')
const sortKey = ref('')
const sortOrder = ref(1)

// ====== Functions declarations ======
// Filter Data and send to SalesTable as props, set SessionStorage
const filterData = () => {
  const from = new Date(filterForm.value.createdDateFrom)
  const end = new Date(filterForm.value.createdDateUntil)
  filtered_sales_data.value = sales_data.value.filter((data) => {
    const curr = new Date(data.created_date)
    return (
      (filterForm.value.createdDateFrom !== '' ? curr >= from && curr <= end : true) &&
      (filterForm.value.customerName
        ? data.customer_name === filterForm.value.customerName ||
          filterForm.value.customerName === 'All'
        : true) &&
      (filterForm.value.status.length
        ? filterForm.value.status.includes(data.status) || filterForm.value.status.includes('All')
        : true) &&
      (filterForm.value.category.length
        ? filterForm.value.category.includes(data.name) || filterForm.value.category.includes('All')
        : true) &&
      (filterForm.value.country
        ? data.country.trim() === filterForm.value.country.trim() ||
          filterForm.value.country.trim() === 'All'
        : true)
    )
  })
  sessionStorage.setItem('filters', JSON.stringify(filterForm.value))
}

// Fetch order listing
// 1. Get the criterion list available
// 2. Check sessionStorage for existing filters and apply upon data retrieval
const fetchOrders = async () => {
  try {
    const currentFilters = { ...filterForm.value }
    const data = await GetData()
    sales_data.value = data
    filtered_sales_data.value = data
    criterion.customerName = [
      'All',
      ...new Set(sales_data.value.map((order) => order.customer_name)),
    ]
    criterion.status = ['All', ...new Set(sales_data.value.map((order) => order.status))]
    criterion.category = ['All', ...new Set(sales_data.value.map((order) => order.name))]
    criterion.country = ['All', ...new Set(sales_data.value.map((order) => order.country))]

    filterForm.value = { ...currentFilters }

    if (sessionStorage.getItem('filters') !== null) {
      const filters = JSON.parse(sessionStorage.getItem('filters'))
      filterForm.value = { ...filters }
    }
    filterData()

    apiError.value = ''
  } catch (error) {
    apiError.value = `${error}`
  }
}

// resetFilters function for modal event handling to clear filters under certain conditions
const resetFilters = () => {
  filterForm.value = { ...initialState }
}

// deleteData function for SalesTable to pass object_id
const deleteData = async (objectId) => {
  const dataParams = {
    objectId: objectId,
  }
  try {
    const res = await DeleteData(dataParams)
    fetchOrders()
    alert(res.msg)
  } catch (error) {
    alert(error)
  }
}

// selectRecord to enable editting
// resetMode to quit editting and mode revert back to 'add' mode
const selectRecord = (objectId) => {
  selectedRecord.value = sales_data.value.find((data) => data.object_id === objectId)
  mode.value = 'update'
}
const resetMode = () => {
  selectedRecord.value = {}
  mode.value = 'add'
}

// Sort Table Function on filteredData
const sortBy = (key) => {
  sortOrder.value = sortKey.value === key ? sortOrder.value * -1 : 1
  sortKey.value = key
  filtered_sales_data.value = filtered_sales_data.value.sort((a, b) =>
    a[key] > b[key] ? sortOrder.value : -sortOrder.value,
  )
}

// ====== Lifecycle hook declarations ======
// When component loaded, fetchOrders. Auto-refresh using setTimeOut with 60s
onMounted(() => {
  fetchOrders()
  setInterval(fetchOrders, 60000)
})
</script>

<template>
  <div class="container">
    <div v-if="apiError.trim() == ''">
      <h1>Sales Order Listing</h1>
      <div>
        <div class="action-item">
          <FilterModal
            :criterion="criterion"
            :filterForm="filterForm"
            @filterData="filterData"
            @resetFilters="resetFilters"
            @updateFilterForm="(newFilter) => (filterForm = newFilter)"
          />
          <SalesForm
            @fetchOrders="fetchOrders"
            :mode="mode"
            @resetMode="resetMode"
            :currData="selectedRecord"
          />
        </div>

        <SalesTable
          :sales_data="filtered_sales_data"
          :sortKey="sortKey"
          :sortOrder="sortOrder"
          @removeRecord="deleteData"
          @selectRecord="selectRecord"
          @sortBy="sortBy"
        />
      </div>
    </div>
    <div v-else>
      <h1>{{ apiError }}</h1>
    </div>
  </div>
</template>

<style>
.container {
  margin-bottom: 20px;
}
.action-item {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
  gap: 3px;
}
</style>
