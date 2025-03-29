<script setup>
import { onMounted, ref, watch } from 'vue'
import { GetDistinctProduct, InsertData, UpdateData } from '@/api/mysql_api'

// ====== Ref & reactive & props & emitter declarations ======
const props = defineProps({
  mode: String,
  currData: Object,
})
const emit = defineEmits(['fetchOrders', 'resetMode'])
const initialState = {
  customerName: '',
  status: '',
  category: '',
  country: '',
  createdDate: new Date().toLocaleDateString(),
  updatedDate: '',
}
const errorInitialState = {
  customerName: '',
  status: '',
  category: '',
  country: '',
}
const modalRef = ref(null)
const formData = ref({ ...initialState })
const formError = ref({ ...errorInitialState })
const products = ref([])
const apiError = ref('')

// ====== Functions declarations ======
// Reset Form / Form Errors for event handlers
const resetForm = () => {
  formData.value = { ...initialState }
}
const resetFormError = () => {
  formError.value = { ...errorInitialState }
}

// Open Modal Form and Close Modal Form for different events
const openModal = () => {
  modalRef.value?.showModal()
}
const closeModal = () => {
  modalRef.value?.close()
  emit('resetMode')
  resetForm()
  resetFormError()
}

// Form Validation before submit
const formValidation = () => {
  formError.value.customerName =
    formData.value.customerName.trim() !== '' ? '' : 'Customer name is required'
  formError.value.status = formData.value.status.trim() !== '' ? '' : 'Status is required'
  formError.value.category = formData.value.category !== '' ? '' : 'Category is required'
  formError.value.country = formData.value.country.trim() !== '' ? '' : 'Country name is required'

  return Object.values(formError.value).every((err) => err === '')
}
const submitHandler = async () => {
  if (!formValidation()) {
    return
  } else {
    if (props.mode === 'add') {
      try {
        const res = await InsertData({
          customerName: formData.value.customerName,
          status: formData.value.status,
          category: products.value.find((product) => product.name === formData.value.category)
            .object_id,
          country: formData.value.country,
          createdDate: formData.value.createdDate,
        })
        modalRef.value?.close()
        resetForm()
        resetFormError()
        emit('resetMode')
        emit('fetchOrders')
        alert(res.msg)
      } catch (error) {
        modalRef.value?.close()
        alert(error)
      }
    } else {
      try {
        const res = await UpdateData({
          customerName: formData.value.customerName,
          status: formData.value.status,
          category: products.value.find((product) => product.name === formData.value.category)
            .object_id,
          country: formData.value.country,
          updatedDate: formData.value.updatedDate,
          objectId: formData.value.object_id,
        })
        modalRef.value?.close()
        resetForm()
        resetFormError()
        emit('resetMode')
        emit('fetchOrders')
        alert(res.msg)
      } catch (error) {
        modalRef.value?.close()
        alert(error)
      }
    }
  }
}

// Fetch Products that is needed for creation of sales order record
const fetchProducts = async () => {
  try {
    const data = await GetDistinctProduct()
    products.value = data
    apiError.value = ''
  } catch (error) {
    apiError.value = `${error}`
  }
}

// ====== Lifecycle hook declarations ======
// watch for currData changes from Parent and update current component state
onMounted(fetchProducts)
watch(
  () => props.currData,
  (currData) => {
    if (props.mode === 'update' && currData) {
      const formatted = {
        ...currData,
        customerName: currData.customer_name,
        category: currData.name,
        updatedDate: new Date().toLocaleDateString(),
      }
      formData.value = { ...formatted }
    }
  },
  { immediate: true },
)
</script>

<template>
  <button @click="openModal">Add a Record</button>
  {{ mode === 'update' ? openModal() : '' }}
  <div class="modal">
    <dialog ref="modalRef">
      <div>
        <p>
          <strong>{{ mode === 'update' ? 'Update record' : 'Add a new record' }}</strong>
        </p>
        <p>Please fill all the following details:</p>
      </div>
      <div class="form">
        <div class="form-input">
          <p>Customer Name:</p>
          <div>
            <input v-model="formData.customerName" />
            <p v-if="formError.customerName !== ''" class="error">{{ formError.customerName }}</p>
          </div>
        </div>
        <div class="form-input">
          <p>Status:</p>
          <div>
            <input v-model="formData.status" />
            <p v-if="formError.status !== ''" class="error">{{ formError.status }}</p>
          </div>
        </div>
        <div class="form-input">
          <p>Category:</p>
          <div>
            <select v-model="formData.category">
              <option v-for="product in products" :value="product.name">
                {{ product.name }}
              </option>
            </select>
            <p v-if="formError.category !== ''" class="error">{{ formError.category }}</p>
          </div>
        </div>
        <div class="form-input">
          <p>Country:</p>
          <div>
            <input v-model="formData.country" />
            <p v-if="formError.country !== ''" class="error">{{ formError.country }}</p>
          </div>
        </div>
      </div>
      <br />
      <div class="footer">
        <div></div>

        <div class="gap-sm">
          <button @click="submitHandler" :disabled="apiError !== ''">
            {{ mode == 'update' ? 'Update' : 'Submit' }}
          </button>
          <button @click="closeModal">Close</button>
        </div>
      </div>
    </dialog>
  </div>
</template>

<style scoped>
dialog {
  width: 40%;
  padding: 20px;
  border-radius: 8px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid transparent;
  background: white;
}

input,
select {
  width: 100%;
}

.secondary-dialog {
  width: 20%;
}

.close {
  position: absolute;
  bottom: 10px;
  right: 15px;
  cursor: pointer;
}

.form-input {
  display: grid;
  grid-template-columns: 20% 80%;
  padding: 10px;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 10px;
}

.error {
  color: red;
  font-size: 12px;
}
</style>
