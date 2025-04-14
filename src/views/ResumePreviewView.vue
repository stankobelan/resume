<template>
  <div class="resume-preview-view">
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">Resume Preview</h1>
        <p class="text-subtitle-1">
          Preview how your resume will look when exported
        </p>
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
        <v-col cols="12" xl="9">
          <v-card class="preview-card">
            <v-card-title class="d-flex justify-space-between align-center">
              <span>Preview</span>
              <div>
                <v-btn
                  color="primary"
                  variant="text"
                  class="mr-2"
                  @click="printResume"
                >
                  <v-icon left>mdi-printer</v-icon>
                  Print
                </v-btn>
                <v-btn color="primary" :to="`/export/${resume.id}`">
                  <v-icon left>mdi-export</v-icon>
                  Go to Export
                </v-btn>
              </div>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <div id="resume-preview" class="preview-container">
                <template-preview :resume="resume" />
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" xl="3">
          <v-card>
            <v-card-title>Template Settings</v-card-title>
            <v-card-text>
              <h3 class="text-subtitle-1 mb-2">Selected Template</h3>
              <v-btn
                block
                color="primary"
                class="mb-4"
                :to="`/templates/${resume.id}`"
              >
                Change Template
              </v-btn>

              <v-divider class="mb-4"></v-divider>

              <h3 class="text-subtitle-1 mb-2">Color Scheme</h3>
              <v-radio-group
                v-model="selectedColorSchemeId"
                @change="setColorScheme"
                class="mb-4"
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

              <v-divider class="mb-4"></v-divider>

              <h3 class="text-subtitle-1 mb-2">Font</h3>
              <v-select
                v-model="selectedFontId"
                :items="fonts"
                item-title="name"
                item-value="id"
                label="Select Font"
                @update:model-value="setFont"
                class="mb-4"
              ></v-select>

              <v-divider class="mb-4"></v-divider>

              <h3 class="text-subtitle-1 mb-2">Layout</h3>
              <v-btn-toggle
                v-model="selectedLayoutId"
                mandatory
                @update:model-value="setLayout"
                class="d-flex mb-4"
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

          <v-card class="mt-4">
            <v-card-title>Resume Actions</v-card-title>
            <v-card-text>
              <v-list>
                <v-list-item :to="`/editor/${resume.id}`">
                  <template v-slot:prepend>
                    <v-icon color="primary">mdi-pencil</v-icon>
                  </template>
                  <v-list-item-title>Edit Resume</v-list-item-title>
                </v-list-item>

                <v-list-item :to="`/export/${resume.id}`">
                  <template v-slot:prepend>
                    <v-icon color="success">mdi-file-pdf-box</v-icon>
                  </template>
                  <v-list-item-title>Export as PDF</v-list-item-title>
                </v-list-item>

                <v-list-item @click="printResume">
                  <template v-slot:prepend>
                    <v-icon color="grey-darken-1">mdi-printer</v-icon>
                  </template>
                  <v-list-item-title>Print Resume</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
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
import TemplatePreview from "@/components/Templates/TemplatePreview.vue";

// Initialize store and router
const resumeStore = useResumeStore();
const templateStore = useTemplateStore();
const route = useRoute();
const router = useRouter();

// Reactive state
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
const setColorScheme = (colorSchemeId: string) => {
  templateStore.setColorScheme(colorSchemeId);
};

const setFont = (fontId: string) => {
  templateStore.setFont(fontId);
};

const setLayout = (layoutId: string) => {
  templateStore.setLayout(layoutId);
};

const printResume = () => {
  const element = document.getElementById("resume-preview");

  if (!element) {
    console.error("Resume preview element not found");
    return;
  }

  const printWindow = window.open("", "_blank");

  if (!printWindow) {
    alert("Please allow pop-ups to print your resume.");
    return;
  }

  // Create simplified HTML for printing
  let html = `<!DOCTYPE html><html><head>
    <title>${resume.value?.fullName || "Resume"}</title>
    <style>body{margin:0;padding:20px}@media print{body{padding:0}}</style>
    </head><body>
    ${element.innerHTML}
    <script>window.onload=function(){setTimeout(function(){window.print();window.close();},250);}<\\/script>
    </body></html>`;

  printWindow.document.write(html);
  printWindow.document.close();
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
    selectedColorSchemeId.value = templateStore.selectedColorSchemeId;
    selectedFontId.value = templateStore.selectedFontId;
    selectedLayoutId.value = templateStore.selectedLayoutId;
  }
});
</script>

<style lang="scss" scoped>
.resume-preview-view {
  padding: 20px 0;
}

.preview-card {
  margin-bottom: 20px;
}

.preview-container {
  background-color: white;
  padding: 20px;
  border: 1px solid #eee;
  min-height: 500px;
  max-height: 800px;
  overflow-y: auto;
}

.color-preview {
  width: 20px;
  height: 20px;
  border-radius: 50%;
}
</style>
