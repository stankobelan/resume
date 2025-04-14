<template>
  <div class="template-preview" :class="resumeLayoutClass">
    <component
      :is="selectedTemplateComponent"
      :resume="resume"
      :color-scheme="selectedColorScheme"
      :font="selectedFont"
      :layout="selectedLayout"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, markRaw, defineAsyncComponent } from "vue";
import { useTemplateStore } from "@/store/templateStore";
import { Resume } from "@/store/resumeStore";

// Define props
const props = defineProps<{
  resume: Resume;
}>();

// Initialize store
const templateStore = useTemplateStore();

// Dynamic template components
const templates = {
  default: markRaw(
    defineAsyncComponent(() => import("./Previews/DefaultTemplate.vue"))
  ),
  creative: markRaw(
    defineAsyncComponent(() => import("./Previews/CreativeTemplate.vue"))
  ),
};

// Computed properties
const selectedTemplateId = computed(() => templateStore.selectedTemplateId);
const selectedColorScheme = computed(() => templateStore.selectedColorScheme());
const selectedFont = computed(() => templateStore.selectedFont());
const selectedLayout = computed(() => templateStore.selectedLayout());

const selectedTemplateComponent = computed(() => {
  return (
    templates[selectedTemplateId.value as keyof typeof templates] ||
    templates.default
  );
});

const resumeLayoutClass = computed(() => {
  return `layout-${selectedLayout.value.type}`;
});
</script>

<style lang="scss">
.template-preview {
  width: 100%;

  &.layout-side-by-side {
    .resume-content {
      display: flex;

      .sidebar {
        width: 35%;
        padding-right: 20px;
      }

      .main-content {
        width: 65%;
      }
    }
  }

  &.layout-block {
    .resume-content {
      display: block;

      .sidebar,
      .main-content {
        width: 100%;
      }
    }
  }
}
</style>
