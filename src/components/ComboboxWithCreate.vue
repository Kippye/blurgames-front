<script setup lang="ts" generic="T extends IBaseEntity">
import type { IBaseEntity } from '@/domain/IBaseEntity';
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

export interface ISelectedItem {
  id?: string;
  name: string;
  isNew: boolean;
}

interface IComboboxProps {
  items: T[];
  nameProperty: keyof T;
  descriptionProperty?: keyof T;
  placeholder?: string;
  existingNames?: string[];
}

const props = withDefaults(defineProps<IComboboxProps>(), {
  placeholder: 'Search or type to add new...',
});

const emit = defineEmits<{
  select: [item: ISelectedItem];
}>();

const searchQuery = ref<string>('');
const showDropdown = ref<boolean>(false);
const showDescriptions = ref<boolean>(false);
const dropdownRef = ref<HTMLElement | null>(null);
const highlightedIndex = ref<number>(-1);

// Filter out already-selected items from existing names
const availableItems = computed(() => {
  if (!props.existingNames) {
    return props.items;
  }
  return props.items.filter(
    (item) => !props.existingNames?.includes(String(item[props.nameProperty])),
  );
});

const filteredItems = computed(() => {
  if (!searchQuery.value) {
    return availableItems.value;
  }
  return availableItems.value.filter((item) =>
    String(item[props.nameProperty]).toLowerCase().includes(searchQuery.value.toLowerCase()),
  );
});

// Check if exact match exists (case-insensitive)
const exactMatchExists = computed(() => {
  if (!searchQuery.value) return false;
  const query = searchQuery.value.toLowerCase().trim();
  return (
    props.items.some((item) => String(item[props.nameProperty]).toLowerCase() === query) ||
    props.existingNames?.some((name) => name.toLowerCase() === query)
  );
});

// Total options including "Create new" option
const totalOptions = computed(() => {
  let count = filteredItems.value.length;
  if (searchQuery.value && !exactMatchExists.value) {
    count += 1; // +1 for create option
  }
  return count;
});

// Reset highlight when search changes
watch(searchQuery, () => {
  if (searchQuery.value.length > 0 && !showDropdown.value) {
    showDropdown.value = true;
  }
  highlightedIndex.value = totalOptions.value > 0 ? 0 : -1;
});

function selectExisting(item: T) {
  emit('select', {
    id: item.id,
    name: String(item[props.nameProperty]),
    isNew: false,
  });
  searchQuery.value = '';
  showDropdown.value = false;
  highlightedIndex.value = -1;
}

function createNew() {
  const name = searchQuery.value.trim();
  if (!name) return;

  emit('select', {
    name: name,
    isNew: true,
  });
  searchQuery.value = '';
  showDropdown.value = false;
  highlightedIndex.value = -1;
}

function handleEnter(event: KeyboardEvent) {
  if (highlightedIndex.value < 0) {
    // No selection, just create new if there's text
    if (searchQuery.value.trim() && !exactMatchExists.value) {
      event.preventDefault();
      createNew();
    }
    return;
  }

  event.preventDefault();
  const filteredCount = filteredItems.value.length;

  if (highlightedIndex.value < filteredCount) {
    // Selected an existing item
    selectExisting(filteredItems.value[highlightedIndex.value]!);
  } else {
    // Selected "Create new" option
    createNew();
  }
}

function handleKeyDown(event: KeyboardEvent) {
  const optionCount = totalOptions.value;
  if (optionCount === 0) return;

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault();
      if (!showDropdown.value) {
        showDropdown.value = true;
      }
      highlightedIndex.value = (highlightedIndex.value + 1) % optionCount;
      break;
    case 'ArrowUp':
      event.preventDefault();
      if (!showDropdown.value) {
        showDropdown.value = true;
      }
      highlightedIndex.value =
        highlightedIndex.value <= 0 ? optionCount - 1 : highlightedIndex.value - 1;
      break;
    case 'Escape':
      event.preventDefault();
      showDropdown.value = false;
      highlightedIndex.value = -1;
      break;
  }
}

function handleClickOutside(event: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    showDropdown.value = false;
  }
}

function handleFocusOut(event: FocusEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.relatedTarget as Node)) {
    showDropdown.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  if (dropdownRef.value) {
    dropdownRef.value.addEventListener('focusout', handleFocusOut);
  }
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
  if (dropdownRef.value) {
    dropdownRef.value.removeEventListener('focusout', handleFocusOut);
  }
});
</script>

<template>
  <div class="dropdown combobox-dropdown" ref="dropdownRef">
    <div class="input-group">
      <input
        type="text"
        class="form-control"
        v-model="searchQuery"
        :placeholder="placeholder"
        @focus="showDropdown = true"
        @keydown="handleKeyDown"
        @keydown.enter.prevent="handleEnter"
        autocomplete="off"
      />
      <button
        v-if="descriptionProperty !== undefined"
        type="button"
        class="btn btn-outline-secondary"
        :class="{ active: showDescriptions }"
        @click="showDescriptions = !showDescriptions"
        :aria-pressed="showDescriptions"
        :aria-label="showDescriptions ? 'Hide descriptions' : 'Show descriptions'"
        :title="showDescriptions ? 'Hide descriptions' : 'Show descriptions'"
      >
        <span class="description-toggle-icon">ℹ️</span>
      </button>
    </div>

    <!-- Dropdown menu -->
    <ul
      v-if="showDropdown && totalOptions > 0"
      class="dropdown-menu w-100 show"
      role="listbox"
      :aria-label="`Search results for ${searchQuery || 'all items'}`"
    >
      <!-- Existing items -->
      <li
        v-for="(item, index) in filteredItems"
        :key="item.id"
        role="option"
        :aria-selected="index === highlightedIndex"
      >
        <button
          type="button"
          :class="`dropdown-item ${index === highlightedIndex ? 'active' : ''}`"
          @click="selectExisting(item)"
          :aria-describedby="
            descriptionProperty && showDescriptions ? `desc-${item.id}` : undefined
          "
        >
          <div class="d-flex align-items-center">
            <span class="item-name">{{ item[nameProperty] as string }}</span>
          </div>
          <div
            v-if="descriptionProperty && showDescriptions"
            :id="`desc-${item.id}`"
            class="item-description"
          >
            {{ item[descriptionProperty] as string }}
          </div>
        </button>
      </li>

      <!-- Separator before create option -->
      <li v-if="filteredItems.length > 0 && searchQuery && !exactMatchExists">
        <hr class="dropdown-divider" />
      </li>

      <!-- Create new option -->
      <li
        v-if="searchQuery && !exactMatchExists"
        role="option"
        :aria-selected="highlightedIndex === filteredItems.length"
      >
        <button
          type="button"
          :class="`dropdown-item text-primary ${
            highlightedIndex === filteredItems.length ? 'active' : ''
          }`"
          @click="createNew"
        >
          <div class="d-flex align-items-center">
            <span class="me-2">+</span>
            <span>Add "{{ searchQuery.trim() }}"</span>
          </div>
        </button>
      </li>
    </ul>

    <!-- Empty state: no results and can't create -->
    <div v-if="showDropdown && totalOptions === 0 && searchQuery" class="dropdown-menu w-100 show">
      <span class="dropdown-item text-muted">No results found. Type to add new.</span>
    </div>

    <!-- Empty state: no search and no items -->
    <div v-if="showDropdown && totalOptions === 0 && !searchQuery" class="dropdown-menu w-100 show">
      <span class="dropdown-item text-muted">Type to search or add new</span>
    </div>
  </div>
</template>

<style scoped>
.combobox-dropdown .dropdown-menu {
  max-height: 300px;
  overflow-y: auto;
}

.dropdown-item {
  display: flex;
  flex-direction: column;
  width: 100%;
  text-align: left;
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0.5rem 1rem;
}

.dropdown-item:hover,
.dropdown-item:focus,
.dropdown-item.active {
  background-color: var(--bs-primary);
  color: white;
}

.dropdown-item.text-primary:hover,
.dropdown-item.text-primary:focus,
.dropdown-item.text-primary.active {
  background-color: var(--bs-primary);
  color: white !important;
}

.item-name {
  font-weight: 500;
  line-height: 1.3;
}

.item-description {
  font-size: 0.85em;
  line-height: 1.3;
  margin-top: 0.25rem;
  opacity: 0.85;
}

.dropdown-item:hover .item-description,
.dropdown-item.active .item-description {
  opacity: 1;
}

.description-toggle-icon {
  font-size: 0.9em;
}

.btn-outline-secondary.active {
  background-color: var(--bs-secondary);
  color: white;
}

.dropdown-divider {
  margin: 0.25rem 0;
}
</style>
