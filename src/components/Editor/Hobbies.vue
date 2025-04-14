<template>
  <div class="hobbies-section">
    <v-card class="mb-4">
      <v-card-title>Hobbies & Interests</v-card-title>
      <v-card-text>
        <v-form @submit.prevent>
          <v-row>
            <v-col cols="12" md="8">
              <v-text-field
                v-model="newHobby"
                label="Add Hobby or Interest"
                placeholder="e.g. Photography, Hiking, Reading"
                @keyup.enter="addHobby"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4" class="d-flex align-center">
              <v-btn
                color="primary"
                @click="addHobby"
                :disabled="!newHobby.trim()"
              >
                Add Hobby
              </v-btn>
            </v-col>
          </v-row>
        </v-form>

        <v-row v-if="formData.hobbies.length === 0">
          <v-col cols="12">
            <v-alert type="info">
              You haven't added any hobbies or interests yet. Adding personal
              interests can make your resume more personable and provide talking
              points during interviews.
            </v-alert>
          </v-col>
        </v-row>

        <v-row v-else>
          <v-col cols="12">
            <div class="hobbies-container">
              <v-chip
                v-for="(hobby, index) in formData.hobbies"
                :key="index"
                class="ma-2"
                closable
                @click:close="removeHobby(index)"
              >
                {{ hobby }}
              </v-chip>
            </div>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-alert
              type="info"
              class="mt-3"
              v-if="formData.hobbies.length < 2"
            >
              Consider adding a few hobbies or interests that showcase your
              personality or relevant soft skills.
            </v-alert>
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
  (e: "update:hobbies", hobbies: string[]): void;
}>();

// Local state
const newHobby = ref("");
const formData = ref({
  hobbies: [...(props.resume.hobbies || [])],
});

// Watch for changes in the resume prop
watch(
  () => props.resume,
  (newResume) => {
    formData.value.hobbies = [...(newResume.hobbies || [])];
  },
  { deep: true }
);

// Methods
const addHobby = () => {
  if (newHobby.value.trim()) {
    // Check if hobby already exists
    if (!formData.value.hobbies.includes(newHobby.value.trim())) {
      formData.value.hobbies.push(newHobby.value.trim());
      emit("update:hobbies", formData.value.hobbies);
    }
    newHobby.value = ""; // Clear the input
  }
};

const removeHobby = (index: number) => {
  formData.value.hobbies.splice(index, 1);
  emit("update:hobbies", formData.value.hobbies);
};
</script>

<style lang="scss" scoped>
.hobbies-section {
  padding: 20px 0;
}

.hobbies-container {
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
}
</style>
