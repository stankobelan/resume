<!-- eslint-disable prettier/prettier -->
<template>
  <div class="resume-editor-view">
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">
          {{ resume ? "Edit Resume: " + resume.name : "Create New Resume" }}
        </h1>
      </v-col>
    </v-row>

    <v-row v-if="!resume">
      <v-col cols="12">
        <v-alert type="warning">
          No resume selected. Please create a new resume or select an existing
          one from the Documents page.
        </v-alert>
        <v-btn color="primary" class="mt-4" @click="createNewResume"
          >Create New Resume</v-btn
        >
      </v-col>
    </v-row>

    <template v-else>
      <v-row>
        <v-col cols="12" md="9">
          <v-text-field
            v-model="resumeName"
            label="Resume Name"
            @blur="updateResumeName"
            hide-details
            class="mb-4"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="3" class="d-flex justify-end align-center">
          <v-btn color="primary" @click="saveResume">
            <v-icon left>mdi-content-save</v-icon>
            Save
          </v-btn>
        </v-col>
      </v-row>

      <v-tabs v-model="activeTab" bg-color="primary" align-tabs="center">
        <v-tab value="personal">Personal Information</v-tab>
        <v-tab value="profile">Profile</v-tab>
        <v-tab value="skills">Skills</v-tab>
        <v-tab value="experience">Experience</v-tab>
        <v-tab value="education">Education</v-tab>
        <v-tab value="courses">Courses</v-tab>
        <v-tab value="languages">Languages</v-tab>
        <v-tab value="hobbies">Hobbies</v-tab>
        <v-tab value="references">References</v-tab>
      </v-tabs>

      <v-window v-model="activeTab">
        <v-window-item value="personal">
          <personal-info
            :resume="resume"
            @update:personalInfo="updatePersonalInfo"
          />
        </v-window-item>

        <v-window-item value="profile">
          <profile
            :resume="resume"
            @update:profile="updateResumeField('profile', $event)"
          />
        </v-window-item>

        <v-window-item value="skills">
          <skills
            :resume="resume"
            @update:skills="updateResumeField('skills', $event)"
          />
        </v-window-item>

        <v-window-item value="experience">
          <experience
            :resume="resume"
            @update:experience="updateResumeField('experience', $event)"
          />
        </v-window-item>

        <v-window-item value="education">
          <education
            :resume="resume"
            @update:education="updateResumeField('education', $event)"
          />
        </v-window-item>

        <v-window-item value="courses">
          <courses
            :resume="resume"
            @update:courses="updateResumeField('courses', $event)"
          />
        </v-window-item>

        <v-window-item value="languages">
          <languages
            :resume="resume"
            @update:languages="updateResumeField('languages', $event)"
          />
        </v-window-item>

        <v-window-item value="hobbies">
          <hobbies
            :resume="resume"
            @update:hobbies="updateResumeField('hobbies', $event)"
          />
        </v-window-item>

        <v-window-item value="references">
          <references
            :resume="resume"
            @update:references="updateResumeField('references', $event)"
          />
        </v-window-item>
      </v-window>

      <v-row class="mt-4">
        <v-col cols="12" class="d-flex justify-end">
          <v-btn color="secondary" class="mr-4" :to="`/templates/${resume.id}`">
            Choose Template
          </v-btn>
          <v-btn color="success" :to="`/export/${resume.id}`">
            Export Resume
          </v-btn>
        </v-col>
      </v-row>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useResumeStore, Resume } from "@/store/resumeStore";

// Import all editor components
import PersonalInfo from "@/components/Editor/PersonalInfo.vue";
import Profile from "@/components/Editor/Profile.vue";
import Skills from "@/components/Editor/Skills.vue";
import Experience from "@/components/Editor/Experience.vue";
import Education from "@/components/Editor/Education.vue";
import Courses from "@/components/Editor/Courses.vue";
import Languages from "@/components/Editor/Languages.vue";
import Hobbies from "@/components/Editor/Hobbies.vue";
import References from "@/components/Editor/References.vue";

// Initialize store and router
const resumeStore = useResumeStore();
const route = useRoute();
const router = useRouter();

// State
const activeTab = ref("personal");
const resumeName = ref("");

// Computed properties
const resume = computed(() => {
  const id = route.params.id as string;

  if (id) {
    const foundResume = resumeStore.resumes.find((r) => r.id === id);
    if (foundResume) {
      return foundResume;
    }
  }

  return resumeStore.selectedResume();
});

// Watch for changes in the resume to update UI state
watch(
  resume,
  (newResume) => {
    if (newResume) {
      // Update local state
      resumeName.value = newResume.name;
      // Set active resume in store
      resumeStore.setActiveResume(newResume.id);
    }
  },
  { immediate: true }
);

// Watch for changes in the selected resume
watch(
  () => resumeStore.selectedResumeId,
  (newId) => {
    if (newId && route.params.id !== newId) {
      router.push(`/editor/${newId}`);
    }
  }
);

// Methods
const createNewResume = () => {
  const newResume = resumeStore.createResume("New Resume");
  router.push(`/editor/${newResume.id}`);
};

const saveResume = () => {
  if (resume.value) {
    const saved = resumeStore.updateResume(resume.value.id, resume.value);
    if (saved) {
      // Show success message
      console.log("Resume saved successfully");
    }
  }
};

const updateResumeName = () => {
  if (resume.value && resumeName.value) {
    resumeStore.updateResume(resume.value.id, { name: resumeName.value });
  }
};

const updateResumeField = (field: keyof Resume, value: unknown) => {
  if (resume.value) {
    const updateData = { [field]: value } as Partial<Resume>;
    resumeStore.updateResume(resume.value.id, updateData);
  }
};

const updatePersonalInfo = (data: Partial<Resume>) => {
  if (resume.value) {
    // Aktualizujeme priamo jednotlivé vlastnosti, nie objekt personalInfo
    resumeStore.updateResume(resume.value.id, {
      fullName: data.fullName,
      title: data.title,
      location: data.location,
      email: data.email,
      phone: data.phone,
      links: data.links,
      photoBase64: data.photoBase64,
    });
  }
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
.resume-editor-view {
  padding: 20px 0;

  .v-window-item {
    padding: 24px 0;
  }
}
</style>
