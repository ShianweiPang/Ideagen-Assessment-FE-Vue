<script setup>
import { ref, watch } from 'vue'

// ====== Ref & reactive & props & emitter declarations ======
const props = defineProps({
  criterion: {
    type: Object,
  },
  filterForm: {
    type: Object,
  },
})
const emit = defineEmits(['filterData', 'resetFilters', 'updateFilterForm'])
const localFilterForm = ref({ ...props.filterForm })
const modalRef = ref(null)
const confirmationRef = ref(null)

// ====== Functions declarations ======
//  Open and Close Modal (Navigate Away)
const openModal = () => {
  modalRef.value?.showModal()
}
const closeModal = () => {
  confirmationRef.value?.showModal()
}

// Confirm Close and Confirm Cancel Functions (Navigate Away)
const confirmClose = () => {
  confirmationRef.value?.close()
  modalRef.value?.close()
}
const confirmCancel = () => {
  confirmationRef.value?.close()
}

// Trigger Filter from Parent
const triggerFilter = () => {
  emit('filterData')
  modalRef.value?.close()
}
const triggerReset = () => {
  emit('resetFilters')
}
// Trigger filters update from Parent
const updateFilter = () => {
  emit('updateFilterForm', localFilterForm.value)
}

// ====== Lifecycle hook declarations ======
// watch for filterForm changes from Parent and current component state
watch(
  () => props.filterForm,
  (filterForm) => {
    if (filterForm) {
      const newData = {
        ...filterForm,
      }
      localFilterForm.value = { ...newData }
    }
  },
  { immediate: true },
)
</script>

<template>
  <button @click="openModal">Filter</button>
  <div class="modal">
    <dialog ref="modalRef">
      <div>
        <p><strong>Filters</strong></p>
        <p>Select criteria filter in listing</p>
      </div>
      <div class="form">
        <div class="form-input">
          <p>Created Date:</p>
          <p>
            Display range from
            <input type="text" v-model="localFilterForm.createdDateFrom" @input="updateFilter" />
            <!-- <input type="date" v-model="localFilterForm.createdDateFrom" @input="updateFilter" /> -->

            to
            <input type="text" v-model="localFilterForm.createdDateUntil" @input="updateFilter" />
            <!-- <input type="date" v-model="localFilterForm.createdDateUntil" @input="updateFilter" /> -->
          </p>
        </div>
        <div class="form-input">
          <p>Customer Name:</p>
          <select v-model="localFilterForm.customerName" @change="updateFilter">
            <option v-for="customer in criterion.customerName">{{ customer }}</option>
          </select>
        </div>
        <div class="form-input">
          <p>Status:</p>
          <div class="grid-container">
            <div v-for="status in criterion.status">
              <div class="gap-sm">
                <input
                  type="checkbox"
                  :value="status"
                  v-model="localFilterForm.status"
                  :disabled="localFilterForm.status.includes('All') && status !== 'All'"
                  @change="updateFilter"
                />
                <label for="name"> {{ status.toLocaleUpperCase() }}</label>
              </div>
            </div>
          </div>
        </div>
        <div class="form-input">
          <p>Category:</p>
          <div class="grid-container">
            <div v-for="category in criterion.category">
              <div class="gap-sm">
                <input
                  type="checkbox"
                  :value="category"
                  v-model="localFilterForm.category"
                  :disabled="localFilterForm.category.includes('All') && category !== 'All'"
                  @change="updateFilter"
                />
                <label for="name"> {{ category.toLocaleUpperCase() }}</label>
              </div>
            </div>
          </div>
        </div>

        <div class="form-input">
          <p>Country:</p>
          <select v-model="localFilterForm.country" @change="updateFilter">
            <option v-for="country in criterion.country">
              {{ country }}
            </option>
          </select>
        </div>
      </div>
      <br />
      <div class="footer">
        <button @click="triggerReset">Reset</button>

        <div class="gap-sm">
          <button @click="triggerFilter">Apply</button>
          <button @click="closeModal">Close</button>
        </div>
      </div>
    </dialog>
  </div>
  <div>
    <dialog class="secondary-dialog" ref="confirmationRef">
      <p><strong>Confirm to navigate away?</strong></p>
      <div class="footer">
        <div></div>
        <div class="gap-sm">
          <button @click="confirmClose">Yes</button>
          <button @click="confirmCancel">No</button>
        </div>
      </div>
    </dialog>
  </div>
</template>

<style scoped>
dialog {
  width: 60%;
  padding: 20px;
  border-radius: 8px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid transparent;
  background: white;
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
</style>
