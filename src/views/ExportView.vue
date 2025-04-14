<template>
  <div class="export-view">
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">Export Resume</h1>
        <p class="text-subtitle-1">
          Export your resume to PDF or share it with others
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
        <v-col cols="12" md="8">
          <v-card class="preview-card">
            <v-card-title>Resume Preview</v-card-title>
            <v-card-text>
              <div id="resume-preview" class="preview-container">
                <template-preview :resume="resume" />
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card>
            <v-card-title>Export Options</v-card-title>
            <v-card-text>
              <export-actions
                :resume="resume"
                @export-started="exportStarted"
                @export-completed="exportCompleted"
              />
            </v-card-text>
          </v-card>

          <v-card class="mt-4">
            <v-card-title>Share Options</v-card-title>
            <v-card-text>
              <v-list>
                <v-list-item @click="generateShareLink">
                  <template v-slot:prepend>
                    <v-icon color="primary">mdi-link-variant</v-icon>
                  </template>
                  <v-list-item-title>Generate Share Link</v-list-item-title>
                </v-list-item>

                <v-list-item @click="shareOnLinkedIn" :disabled="!shareLink">
                  <template v-slot:prepend>
                    <v-icon color="blue-darken-3">mdi-linkedin</v-icon>
                  </template>
                  <v-list-item-title>Share on LinkedIn</v-list-item-title>
                </v-list-item>

                <v-list-item @click="copyToClipboard" :disabled="!shareLink">
                  <template v-slot:prepend>
                    <v-icon color="grey-darken-1">mdi-content-copy</v-icon>
                  </template>
                  <v-list-item-title>Copy Link to Clipboard</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Share Link Dialog -->
      <v-dialog v-model="shareLinkDialog" max-width="500">
        <v-card>
          <v-card-title class="text-h5">Share Link Generated</v-card-title>
          <v-card-text>
            <p>Your resume is available at the following link:</p>
            <v-text-field
              v-model="shareLink"
              readonly
              @click="$event.target.select()"
            ></v-text-field>
            <p class="text-caption">
              This link will allow anyone to view this version of your resume
              without requiring login.
            </p>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" variant="text" @click="copyToClipboard">
              <v-icon left>mdi-content-copy</v-icon>
              Copy
            </v-btn>
            <v-btn
              color="grey-darken-1"
              variant="text"
              @click="shareLinkDialog = false"
              >Close</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Export in Progress Overlay -->
      <v-overlay v-model="exporting" class="d-flex align-center justify-center">
        <v-card>
          <v-card-text class="text-center">
            <v-progress-circular
              indeterminate
              color="primary"
              size="64"
            ></v-progress-circular>
            <p class="mt-4">Generating PDF...</p>
          </v-card-text>
        </v-card>
      </v-overlay>

      <v-snackbar
        v-model="snackbar.show"
        :color="snackbar.color"
        :timeout="3000"
      >
        {{ snackbar.text }}
        <template v-slot:actions>
          <v-btn variant="text" @click="snackbar.show = false"> Close </v-btn>
        </template>
      </v-snackbar>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useResumeStore } from "@/store/resumeStore";
import TemplatePreview from "@/components/Templates/TemplatePreview.vue";
import ExportActions from "@/components/Export/ExportActions.vue";
import { nanoid } from "nanoid";

// Initialize store and router
const resumeStore = useResumeStore();
const route = useRoute();
const router = useRouter();

// State
const exporting = ref(false);
const shareLink = ref("");
const shareLinkDialog = ref(false);
const snackbar = ref({
  show: false,
  text: "",
  color: "success",
});

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

// Methods
const exportStarted = () => {
  exporting.value = true;
};

const exportCompleted = (success: boolean) => {
  exporting.value = false;

  if (success) {
    showSnackbar("Resume exported successfully!", "success");
  } else {
    showSnackbar("Failed to export resume. Please try again.", "error");
  }
};

const generateShareLink = () => {
  if (!resume.value) return;

  // Generate a unique slug for the resume
  const slug = nanoid(10);

  // In a real app, this would save the resume to a database with this slug
  // For now we'll just simulate this with a dummy URL
  shareLink.value = `${window.location.origin}/resume/${slug}`;

  // Show the dialog
  shareLinkDialog.value = true;
};

const shareOnLinkedIn = () => {
  if (!shareLink.value) return;

  const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    shareLink.value
  )}`;
  window.open(linkedInShareUrl, "_blank");
};

const copyToClipboard = async () => {
  if (!shareLink.value) return;

  try {
    await navigator.clipboard.writeText(shareLink.value);
    showSnackbar("Link copied to clipboard!", "success");
  } catch (err) {
    showSnackbar("Failed to copy link. Please try again.", "error");
  }
};

const showSnackbar = (
  text: string,
  color: "success" | "error" | "info" = "success"
) => {
  snackbar.value = {
    show: true,
    text,
    color,
  };
};

// Lifecycle hooks
onMounted(() => {
  // If we don't have a resume ID in the route or a selected resume, redirect to documents
  if (!route.params.id && !resumeStore.selectedResumeId) {
    router.push("/documents");
  }
});
</script>

<style lang="scss" scoped>
.export-view {
  padding: 20px 0;
}

.preview-card {
  margin-bottom: 20px;
}

.preview-container {
  max-height: 600px;
  overflow-y: auto;
  background-color: white;
  padding: 20px;
  border: 1px solid #eee;
}
</style>
