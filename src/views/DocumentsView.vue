<template>
  <div class="documents-view">
    <v-container>
      <v-row>
        <v-col cols="12">
          <h1 class="text-h4 mb-4">My Resumes</h1>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="4">
          <v-card
            height="100%"
            class="create-resume-card"
            @click="createNewResume"
          >
            <v-card-text
              class="d-flex flex-column align-center justify-center text-center"
            >
              <v-icon color="primary" size="x-large">mdi-plus-circle</v-icon>
              <h2 class="text-h5 mt-4">Create New Resume</h2>
              <p class="text-body-2 mt-2">
                Start building a new resume from scratch
              </p>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col v-for="resume in resumes" :key="resume.id" cols="12" md="4">
          <document-manager-item
            :resume="resume"
            @edit="navigateToEditor"
            @duplicate="duplicateResume"
            @delete="deleteResume"
          />
        </v-col>
      </v-row>

      <v-row v-if="resumes.length === 0" class="mt-6">
        <v-col cols="12">
          <v-alert type="info">
            You don't have any resumes yet. Click on "Create New Resume" to get
            started.
          </v-alert>
        </v-col>
      </v-row>

      <!-- Confirmation Dialog -->
      <v-dialog v-model="deleteDialog.show" max-width="500">
        <v-card>
          <v-card-title class="text-h5">Delete Resume</v-card-title>
          <v-card-text>
            Are you sure you want to delete
            <strong>{{ deleteDialog.resumeName }}</strong
            >? This action cannot be undone.
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="grey-darken-1"
              variant="text"
              @click="deleteDialog.show = false"
              >Cancel</v-btn
            >
            <v-btn color="error" variant="text" @click="confirmDelete"
              >Delete</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

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
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useResumeStore, Resume } from "@/store/resumeStore";
import DocumentManagerItem from "@/components/Documents/DocumentManagerItem.vue";

// Initialize router and store
const router = useRouter();
const resumeStore = useResumeStore();

// State
const deleteDialog = ref({
  show: false,
  resumeId: "",
  resumeName: "",
});

const snackbar = ref({
  show: false,
  text: "",
  color: "success",
});

// Computed properties
const resumes = computed(() => {
  return resumeStore.resumes;
});

// Methods
const createNewResume = () => {
  const newResume = resumeStore.createResume("New Resume");
  navigateToEditor(newResume.id);
};

const navigateToEditor = (resumeId: string) => {
  router.push(`/editor/${resumeId}`);
};

const duplicateResume = (resumeId: string) => {
  const duplicatedResume = resumeStore.duplicateResume(resumeId);
  if (duplicatedResume) {
    showSnackbar(`Resume duplicated: ${duplicatedResume.name}`, "success");
  } else {
    showSnackbar("Failed to duplicate resume", "error");
  }
};

const deleteResume = (resume: Resume) => {
  deleteDialog.value = {
    show: true,
    resumeId: resume.id,
    resumeName: resume.name,
  };
};

const confirmDelete = () => {
  const success = resumeStore.deleteResume(deleteDialog.value.resumeId);

  if (success) {
    showSnackbar("Resume deleted successfully", "success");
  } else {
    showSnackbar("Failed to delete resume", "error");
  }

  deleteDialog.value.show = false;
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
</script>

<style lang="scss" scoped>
.documents-view {
  padding: 20px 0;

  .create-resume-card {
    cursor: pointer;
    min-height: 200px;
    transition: all 0.3s ease;
    border: 2px dashed rgba(0, 0, 0, 0.12);

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
      border-color: var(--v-primary-base);
    }
  }
}
</style>
