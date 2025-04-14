<template>
  <div class="skills-section">
    <v-card class="mb-4">
      <v-card-title>Skills</v-card-title>
      <v-card-text>
        <v-form @submit.prevent>
          <v-row>
            <v-col cols="12" md="8">
              <v-text-field
                v-model="newSkill"
                label="Add Skill"
                placeholder="e.g. JavaScript, Project Management, Communication"
                @keyup.enter="addSkill"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4" class="d-flex align-center">
              <v-btn
                color="primary"
                @click="addSkill"
                :disabled="!newSkill.trim()"
              >
                Add Skill
              </v-btn>
            </v-col>
          </v-row>
        </v-form>

        <v-row v-if="formData.skills.length === 0">
          <v-col cols="12">
            <v-alert type="info">
              You haven't added any skills yet. Add your key skills to make your
              resume stand out.
            </v-alert>
          </v-col>
        </v-row>

        <v-row v-else>
          <v-col cols="12">
            <div class="skills-container">
              <v-chip
                v-for="(skill, index) in formData.skills"
                :key="index"
                class="ma-2"
                closable
                @click:close="removeSkill(index)"
              >
                {{ skill }}
              </v-chip>
            </div>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-alert
              type="warning"
              v-if="formData.skills.length < 3"
              class="mt-3"
            >
              Consider adding at least 5 skills relevant to your job
              applications.
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
  (e: "update:skills", skills: string[]): void;
}>();

// Local state
const newSkill = ref("");
const formData = ref({
  skills: [...(props.resume.skills || [])],
});

// Watch for changes in the resume prop
watch(
  () => props.resume,
  (newResume) => {
    formData.value.skills = [...(newResume.skills || [])];
  },
  { deep: true }
);

// Methods
const addSkill = () => {
  if (newSkill.value.trim()) {
    // Check if skill already exists
    if (!formData.value.skills.includes(newSkill.value.trim())) {
      formData.value.skills.push(newSkill.value.trim());
      emit("update:skills", formData.value.skills);
    }
    newSkill.value = ""; // Clear the input
  }
};

const removeSkill = (index: number) => {
  formData.value.skills.splice(index, 1);
  emit("update:skills", formData.value.skills);
};
</script>

<style lang="scss" scoped>
.skills-section {
  padding: 20px 0;
}

.skills-container {
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
}
</style>
