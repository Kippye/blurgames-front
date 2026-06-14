<script setup lang="ts" generic="T extends IBaseEntity">
import type { IBaseEntity } from '@/domain/IBaseEntity';
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

interface IDropdownProps {
  items: T[];
  nameProperty: keyof T;
  descriptionProperty?: keyof T;
}

const props = defineProps<IDropdownProps>();

const selectedItemIds = defineModel<string[]>({ default: () => [] });
const searchQuery = ref<string>('');
const showDropdown = ref<boolean>(false);
const showDescriptions = ref<boolean>(false);
const dropdownRef = ref<HTMLElement | null>(null);
const highlightedItemIndex = ref<number>(-1);

const availableItems = computed(() => {
  return props.items.filter((item) => !selectedItemIds.value.includes(item.id));
});

const filteredAvailableItems = computed(() => {
  if (!searchQuery.value) {
    return availableItems.value;
  }
  return availableItems.value.filter((item) =>
    (item[props.nameProperty] as string).toLowerCase().includes(searchQuery.value.toLowerCase()),
  );
});

// Default highlighted index to top result when search query changes
watch(searchQuery, () => {
  highlightedItemIndex.value = filteredAvailableItems.value.length > 0 ? 0 : -1;
});

function addItem(itemId: string) {
  selectedItemIds.value.push(itemId);
  searchQuery.value = '';
}

function removeItem(itemId: string) {
  selectedItemIds.value = selectedItemIds.value.filter((id) => id !== itemId);
}

function addFirstFilteredItem() {
  if (filteredAvailableItems.value.length > 0) {
    const index = highlightedItemIndex.value >= 0 ? highlightedItemIndex.value : 0;
    addItem(filteredAvailableItems.value[index]!.id);
    highlightedItemIndex.value = -1;
  }
}

// Handle up / down arrow to select item and escape to close
function handleKeyDown(event: KeyboardEvent) {
  const itemCount = filteredAvailableItems.value.length;
  if (itemCount === 0) return;

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault();
      if (!showDropdown.value) {
        showDropdown.value = true;
      }
      highlightedItemIndex.value = (highlightedItemIndex.value + 1) % itemCount;
      break;
    case 'ArrowUp':
      event.preventDefault();
      if (!showDropdown.value) {
        showDropdown.value = true;
      }
      highlightedItemIndex.value =
        highlightedItemIndex.value <= 0 ? itemCount - 1 : highlightedItemIndex.value - 1;
      break;
    case 'Escape':
      event.preventDefault();
      showDropdown.value = false;
      highlightedItemIndex.value = -1;
      break;
  }
}

// Click outside -> close dropdown
function handleClickOutside(event: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    showDropdown.value = false;
  }
}

// Change focus (tab navigation) -> close dropdown
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
  <div class="item-selection">
    <!-- Selected items pills -->
    <div class="selected-items mb-2">
      <span
        v-for="itemId in selectedItemIds"
        :key="itemId"
        class="badge bg-primary me-1 mb-1 d-inline-flex align-items-center"
      >
        {{ items.find((item) => item.id === itemId)![nameProperty] as string }}
        <button
          type="button"
          class="btn-close btn-close-white ms-1"
          @click="removeItem(itemId)"
          aria-label="Remove item"
        ></button>
      </span>
      <span v-if="selectedItemIds.length === 0" class="text-muted"> None selected </span>
    </div>

    <!-- Search and add item with real-time dropdown -->
    <div class="dropdown item-search-dropdown" ref="dropdownRef">
      <div class="input-group">
        <input
          type="text"
          class="form-control"
          v-model="searchQuery"
          placeholder="Search items..."
          @focus="showDropdown = true"
          @keydown="handleKeyDown"
          @keyup.enter="addFirstFilteredItem"
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

      <!-- Real-time dropdown menu -->
      <ul
        v-if="showDropdown && filteredAvailableItems.length > 0"
        class="dropdown-menu w-100 show"
        role="listbox"
        :aria-label="`Search results for ${searchQuery || 'all items'}`"
      >
        <li
          v-for="(item, index) in filteredAvailableItems"
          :key="item.id"
          role="option"
          :aria-selected="index === highlightedItemIndex"
        >
          <button
            type="button"
            :class="`dropdown-item ${index === highlightedItemIndex ? 'active' : ''}`"
            @click="addItem(item.id)"
            :aria-describedby="
              descriptionProperty && showDescriptions ? `desc-${item.id}` : undefined
            "
          >
            <div class="item-name">{{ item[nameProperty] as string }}</div>
            <div
              v-if="descriptionProperty && showDescriptions"
              :id="`desc-${item.id}`"
              class="item-description"
            >
              {{ item[descriptionProperty] as string }}
            </div>
          </button>
        </li>
      </ul>

      <!-- No results message -->
      <div
        v-if="showDropdown && searchQuery && filteredAvailableItems.length === 0"
        class="dropdown-menu w-100 show"
      >
        <span class="dropdown-item text-muted">No results found</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.item-search-dropdown .dropdown-menu {
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
</style>
