<template>
  <div class="template-selector">
    <v-row>
      <v-col
        v-for="template in templates"
        :key="template.id"
        cols="12"
        sm="6"
        lg="4"
      >
        <v-card
          class="template-card mb-4"
          :class="{ selected: template.id === selectedTemplateId }"
          @click="selectTemplate(template.id)"
          hover
        >
          <v-img
            :src="template.thumbnail"
            height="200"
            cover
            class="align-end"
            gradient="to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 100%"
          >
            <v-card-title class="text-white">{{ template.name }}</v-card-title>
          </v-img>

          <v-card-text>
            <p>{{ template.description }}</p>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              :variant="
                template.id === selectedTemplateId ? 'flat' : 'outlined'
              "
              @click.stop="selectTemplate(template.id)"
            >
              {{ template.id === selectedTemplateId ? "Selected" : "Select" }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useTemplateStore } from "@/store/templateStore";

// Define emits
const emit = defineEmits<{
  (e: "select-template", templateId: string): void;
}>();

// Initialize store
const templateStore = useTemplateStore();

// Computed properties
const templates = computed(() => templateStore.templates);
const selectedTemplateId = computed(() => templateStore.selectedTemplateId);

// Methods
const selectTemplate = (templateId: string) => {
  emit("select-template", templateId);
};
</script>

<style lang="scss" scoped>
.template-selector {
  .template-card {
    cursor: pointer;
    transition: all 0.3s ease;

    &.selected {
      border: 2px solid var(--v-primary-base);
      transform: translateY(-5px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }

    &:hover:not(.selected) {
      transform: translateY(-3px);
    }
  }
}
</style>
