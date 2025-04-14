<template>
  <div class="template-selection-view">
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">Choose a Template</h1>
        <p class="text-subtitle-1">Select a template design for your resume</p>
      </v-col>
    </v-row>

    <v-row v-if="!resume">
      <v-col cols="12">
        <v-alert type="warning">
          No resume selected. Please create a new resume or select an existing
          one from the Documents page.
        </v-alert>
        <v-btn color="primary" class="mt-4" to="/documents"
          >Go to Documents</v-btn
        >
      </v-col>
    </v-row>

    <template v-else>
      <v-row>
        <v-col cols="12" md="8">
          <template-selector @select-template="selectTemplate" />
        </v-col>
        <v-col cols="12" md="4">
          <v-card>
            <v-card-title>Template Settings</v-card-title>
            <v-card-text>
              <h3 class="text-subtitle-1 mb-2">Color Scheme</h3>
              <v-radio-group
                v-model="selectedColorSchemeId"
                @change="setColorScheme"
                row
              >
                <v-radio
                  v-for="scheme in colorSchemes"
                  :key="scheme.id"
                  :value="scheme.id"
                  :label="scheme.name"
                >
                  <template v-slot:label>
                    <div class="d-flex align-center">
                      <div
                        class="color-preview mr-2"
                        :style="{
                          backgroundColor: scheme.primary,
                          border: `1px solid ${scheme.secondary}`,
                        }"
                      ></div>
                      {{ scheme.name }}
                    </div>
                  </template>
                </v-radio>
              </v-radio-group>

              <v-divider class="my-4"></v-divider>

              <h3 class="text-subtitle-1 mb-2">Font</h3>
              <v-select
                v-model="selectedFontId"
                :items="fonts"
                item-title="name"
                item-value="id"
                label="Select Font"
                @update:model-value="setFont"
              ></v-select>

              <v-divider class="my-4"></v-divider>

              <h3 class="text-subtitle-1 mb-2">Layout</h3>
              <v-btn-toggle
                v-model="selectedLayoutId"
                mandatory
                @update:model-value="setLayout"
                class="d-flex"
              >
                <v-btn
                  v-for="layout in layouts"
                  :key="layout.id"
                  :value="layout.id"
                  class="flex-grow-1"
                  variant="outlined"
                >
                  {{ layout.name }}
                </v-btn>
              </v-btn-toggle>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row class="mt-4">
        <v-col cols="12">
          <h2 class="text-h5 mb-4">Preview</h2>
          <v-card outlined class="preview-container">
            <template-preview :resume="resume" />
          </v-card>
        </v-col>
      </v-row>

      <v-row class="mt-4">
        <v-col cols="12" class="d-flex justify-end">
          <v-btn color="primary" class="mr-4" :to="`/editor/${resume.id}`">
            Back to Editor
          </v-btn>
          <v-btn color="success" :to="`/export/${resume.id}`">
            Continue to Export
          </v-btn>
        </v-col>
      </v-row>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useResumeStore } from "@/store/resumeStore";
import { useTemplateStore } from "@/store/templateStore";
import TemplateSelector from "@/components/Templates/TemplateSelector.vue";
import TemplatePreview from "@/components/Templates/TemplatePreview.vue";

// Initialize store and router
const resumeStore = useResumeStore();
const templateStore = useTemplateStore();
const route = useRoute();
const router = useRouter();

// Reactive state
const selectedTemplateId = ref(templateStore.selectedTemplateId);
const selectedColorSchemeId = ref(templateStore.selectedColorSchemeId);
const selectedFontId = ref(templateStore.selectedFontId);
const selectedLayoutId = ref(templateStore.selectedLayoutId);

// Computed properties
const resume = computed(() => {
  const id = route.params.id as string;

  if (id) {
    const foundResume = resumeStore.resumes.find((r) => r.id === id);
    if (foundResume) {
      resumeStore.setActiveResume(id);
      return foundResume;
    }
  }

  return resumeStore.selectedResume();
});

const colorSchemes = computed(() => {
  return templateStore.selectedTemplate().colorSchemes;
});

const fonts = computed(() => {
  return templateStore.selectedTemplate().fonts;
});

const layouts = computed(() => {
  return templateStore.selectedTemplate().layouts;
});

// Methods
const selectTemplate = (templateId: string) => {
  templateStore.setTemplate(templateId);
  selectedTemplateId.value = templateId;
  selectedColorSchemeId.value = templateStore.selectedColorSchemeId;
  selectedFontId.value = templateStore.selectedFontId;
  selectedLayoutId.value = templateStore.selectedLayoutId;

  if (resume.value) {
    resumeStore.updateResume(resume.value.id, { templateId });
  }
};

const setColorScheme = (colorSchemeId: string) => {
  templateStore.setColorScheme(colorSchemeId);
};

const setFont = (fontId: string) => {
  templateStore.setFont(fontId);
};

const setLayout = (layoutId: string) => {
  templateStore.setLayout(layoutId);
};

// Lifecycle hooks
onMounted(() => {
  // If we don't have a resume ID in the route or a selected resume, redirect to documents
  if (!route.params.id && !resumeStore.selectedResumeId) {
    router.push("/documents");
    return;
  }

  // Set the template based on the resume's templateId
  if (resume.value && resume.value.templateId) {
    templateStore.setTemplate(resume.value.templateId);
  }
});
</script>

<style lang="scss" scoped>
.template-selection-view {
  padding: 20px 0;
}

.color-preview {
  width: 20px;
  height: 20px;
  border-radius: 50%;
}

.preview-container {
  padding: 20px;
  max-height: 600px;
  overflow-y: auto;
}
</style>
