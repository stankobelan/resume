<template>
  <div class="education-section">
    <v-card class="mb-4">
      <v-card-title class="d-flex justify-space-between align-center">
        <span>Education</span>
        <v-btn color="primary" @click="addEducation">
          <v-icon left>mdi-plus</v-icon>
          Add Education
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-row v-if="formData.education.length === 0">
          <v-col cols="12">
            <v-alert type="info">
              You haven't added any education entries yet. Click "Add Education"
              to get started.
            </v-alert>
          </v-col>
        </v-row>

        <div v-else>
          <v-expansion-panels v-model="openPanel">
            <v-expansion-panel
              v-for="(edu, index) in formData.education"
              :key="index"
            >
              <v-expansion-panel-title>
                <div class="d-flex flex-column">
                  <div class="font-weight-bold">
                    {{ edu.degree }} in {{ edu.field }}
                  </div>
                  <div class="text-caption">
                    {{ edu.institution }} | {{ formatDate(edu.startDate) }} -
                    {{ edu.current ? "Present" : formatDate(edu.endDate) }}
                  </div>
                </div>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-form @submit.prevent>
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="edu.institution"
                        label="Institution"
                        required
                        :rules="[(v) => !!v || 'Institution is required']"
                        @input="emitUpdate"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="edu.degree"
                        label="Degree/Certificate"
                        required
                        :rules="[(v) => !!v || 'Degree is required']"
                        @input="emitUpdate"
                      ></v-text-field>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="edu.field"
                        label="Field of Study"
                        required
                        :rules="[(v) => !!v || 'Field of study is required']"
                        @input="emitUpdate"
                      ></v-text-field>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="12" md="5">
                      <v-text-field
                        v-model="edu.startDate"
                        label="Start Date"
                        type="month"
                        required
                        :rules="[(v) => !!v || 'Start date is required']"
                        @input="emitUpdate"
                      ></v-text-field>
                    </v-col>

                    <v-col
                      cols="12"
                      md="2"
                      class="d-flex align-center justify-center"
                    >
                      <v-checkbox
                        v-model="edu.current"
                        label="Current"
                        @change="emitUpdate"
                      ></v-checkbox>
                    </v-col>

                    <v-col cols="12" md="5">
                      <v-text-field
                        v-model="edu.endDate"
                        label="End Date"
                        type="month"
                        :disabled="edu.current"
                        required
                        :rules="[
                          (v) => edu.current || !!v || 'End date is required',
                        ]"
                        @input="emitUpdate"
                      ></v-text-field>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="12">
                      <v-textarea
                        v-model="edu.description"
                        label="Description"
                        rows="4"
                        hint="Describe your studies, achievements, activities, etc."
                        @input="emitUpdate"
                      ></v-textarea>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="12" class="d-flex justify-end">
                      <v-btn color="error" @click="removeEducation(index)">
                        <v-icon left>mdi-delete</v-icon>
                        Delete
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-form>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { Resume, EducationEntry } from "@/store/resumeStore";
import { nanoid } from "nanoid";

// Define props and emits
const props = defineProps<{
  resume: Resume;
}>();

const emit = defineEmits<{
  (e: "update:education", education: EducationEntry[]): void;
}>();

// Local state
const openPanel = ref<number | null>(null);

const formData = ref({
  education: props.resume.education ? [...props.resume.education] : [],
});

// Watch for changes in the resume prop
watch(
  () => props.resume,
  (newResume) => {
    formData.value.education = newResume.education
      ? [...newResume.education]
      : [];
  },
  { deep: true }
);

// Methods
const addEducation = () => {
  const newEducation: EducationEntry = {
    id: nanoid(),
    institution: "",
    degree: "",
    field: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
  };

  formData.value.education.unshift(newEducation);
  openPanel.value = 0; // Open the newly added education panel
  emitUpdate();
};

const removeEducation = (index: number) => {
  formData.value.education.splice(index, 1);
  emitUpdate();
};

const emitUpdate = () => {
  emit("update:education", formData.value.education);
};

const formatDate = (dateString: string | null): string => {
  if (!dateString) return "";

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
    });
  } catch (e) {
    return dateString;
  }
};
</script>

<style lang="scss" scoped>
.education-section {
  padding: 20px 0;
}
</style>
