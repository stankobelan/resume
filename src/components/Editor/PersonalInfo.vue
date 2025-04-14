<template>
  <div class="personal-info-section">
    <v-card class="mb-4">
      <v-card-title>Personal Information</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formData.fullName"
              label="Full Name"
              :rules="[(v) => !!v || 'Full name is required']"
              @input="emitUpdate"
              required
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="formData.title"
              label="Job Title"
              @input="emitUpdate"
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formData.email"
              label="Email"
              :rules="[
                (v) => !!v || 'Email is required',
                (v) =>
                  /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
                  'Email must be valid',
              ]"
              @input="emitUpdate"
              required
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="formData.phone"
              label="Phone"
              @input="emitUpdate"
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="formData.location"
              label="Location"
              @input="emitUpdate"
              placeholder="City, Country"
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <h3 class="text-subtitle-1 mb-2">Links</h3>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="formData.links.linkedin"
              label="LinkedIn URL"
              @input="emitUpdate"
              prepend-icon="mdi-linkedin"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="4">
            <v-text-field
              v-model="formData.links.github"
              label="GitHub URL"
              @input="emitUpdate"
              prepend-icon="mdi-github"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="4">
            <v-text-field
              v-model="formData.links.website"
              label="Personal Website URL"
              @input="emitUpdate"
              prepend-icon="mdi-web"
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" md="6">
            <h3 class="text-subtitle-1 mb-2">Profile Photo</h3>
            <v-file-input
              label="Upload Photo"
              accept="image/*"
              @change="onFileChange"
              prepend-icon="mdi-camera"
              truncate-length="15"
            ></v-file-input>
          </v-col>

          <v-col cols="12" md="6" class="d-flex justify-center align-center">
            <div v-if="formData.photoBase64" class="profile-photo-container">
              <img
                :src="formData.photoBase64"
                alt="Profile Photo"
                class="profile-photo"
              />
              <v-btn
                icon
                small
                color="error"
                class="remove-photo-btn"
                @click="removePhoto"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </div>
            <v-icon v-else size="100" color="grey lighten-1"
              >mdi-account-circle</v-icon
            >
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { Resume } from "@/store/resumeStore";

// Define props and emits
const props = defineProps<{
  resume: Resume;
}>();

const emit = defineEmits<{
  (e: "update:personalInfo", data: Partial<Resume>): void;
}>();

// Local form data
const formData = ref({
  fullName: props.resume.fullName || "",
  title: props.resume.title || "",
  location: props.resume.location || "",
  email: props.resume.email || "",
  phone: props.resume.phone || "",
  links: {
    linkedin: props.resume.links?.linkedin || "",
    github: props.resume.links?.github || "",
    website: props.resume.links?.website || "",
  },
  photoBase64: props.resume.photoBase64 || "",
});

// Watch for changes in the resume prop
watch(
  () => props.resume,
  (newResume) => {
    formData.value = {
      fullName: newResume.fullName || "",
      title: newResume.title || "",
      location: newResume.location || "",
      email: newResume.email || "",
      phone: newResume.phone || "",
      links: {
        linkedin: newResume.links?.linkedin || "",
        github: newResume.links?.github || "",
        website: newResume.links?.website || "",
      },
      photoBase64: newResume.photoBase64 || "",
    };
  },
  { deep: true }
);

// Methods
const emitUpdate = () => {
  emit("update:personalInfo", {
    fullName: formData.value.fullName,
    title: formData.value.title,
    location: formData.value.location,
    email: formData.value.email,
    phone: formData.value.phone,
    links: formData.value.links,
    photoBase64: formData.value.photoBase64,
  });
};

const onFileChange = (event: Event | File | File[]) => {
  // Ak je event null alebo undefined, vyčistíme fotografiu
  if (!event) {
    formData.value.photoBase64 = "";
    emitUpdate();
    return;
  }

  // V novších verziách Vuetify, event môže byť priamo súbor alebo array súborov
  let file: File | null = null;

  if (event instanceof File) {
    // Ak je event priamo súbor
    file = event;
  } else if (
    Array.isArray(event) &&
    event.length > 0 &&
    event[0] instanceof File
  ) {
    // Ak je event pole súborov, berieme prvý
    file = event[0];
  } else if (
    event instanceof Event &&
    (event.target as HTMLInputElement).files
  ) {
    // Ak je to event objekt (starší spôsob)
    const files = (event.target as HTMLInputElement).files;
    if (files && files.length > 0) {
      file = files[0];
    }
  }

  // Ak sa nám podarilo získať platný súbor, spracujeme ho
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      formData.value.photoBase64 = e.target?.result as string;
      emitUpdate();
    };
    reader.readAsDataURL(file);
  } else {
    // Ak nie je platný súbor, vyčistíme fotografiu
    formData.value.photoBase64 = "";
    emitUpdate();
  }
};

const removePhoto = () => {
  formData.value.photoBase64 = "";
  emitUpdate();
};
</script>

<style lang="scss" scoped>
.personal-info-section {
  padding: 20px 0;
}

.profile-photo-container {
  position: relative;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;

  .profile-photo {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .remove-photo-btn {
    position: absolute;
    top: 0;
    right: 0;
    background-color: rgba(255, 255, 255, 0.8);
  }
}
</style>
