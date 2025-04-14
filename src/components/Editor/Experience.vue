<template>
  <div class="experience-section">
    <v-card class="mb-4">
      <v-card-title class="d-flex justify-space-between align-center">
        <span>Work Experience</span>
        <v-btn color="primary" @click="addExperience">
          <v-icon left>mdi-plus</v-icon>
          Add Experience
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-row v-if="formData.experience.length === 0">
          <v-col cols="12">
            <v-alert type="info">
              You haven't added any work experience yet. Click "Add Experience"
              to get started.
            </v-alert>
          </v-col>
        </v-row>

        <div v-else>
          <v-expansion-panels v-model="openPanel">
            <v-expansion-panel
              v-for="(exp, index) in formData.experience"
              :key="index"
            >
              <v-expansion-panel-title>
                <div class="d-flex flex-column">
                  <div class="font-weight-bold">
                    {{ exp.position }} at {{ exp.company }}
                  </div>
                  <div class="text-caption">
                    {{ formatDate(exp.startDate) }} -
                    {{ exp.current ? "Present" : formatDate(exp.endDate) }}
                  </div>
                </div>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-form @submit.prevent>
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="exp.company"
                        label="Company"
                        required
                        :rules="[(v) => !!v || 'Company is required']"
                        @input="emitUpdate"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="exp.position"
                        label="Position"
                        required
                        :rules="[(v) => !!v || 'Position is required']"
                        @input="emitUpdate"
                      ></v-text-field>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="12" md="5">
                      <v-text-field
                        v-model="exp.startDate"
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
                        v-model="exp.current"
                        label="Current"
                        @change="emitUpdate"
                      ></v-checkbox>
                    </v-col>

                    <v-col cols="12" md="5">
                      <v-text-field
                        v-model="exp.endDate"
                        label="End Date"
                        type="month"
                        :disabled="exp.current"
                        required
                        :rules="[
                          (v) => exp.current || !!v || 'End date is required',
                        ]"
                        @input="emitUpdate"
                      ></v-text-field>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="12">
                      <v-textarea
                        v-model="exp.description"
                        label="Description"
                        rows="4"
                        hint="Describe your responsibilities and achievements"
                        @input="emitUpdate"
                      ></v-textarea>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="12" class="d-flex justify-end">
                      <v-btn color="error" @click="removeExperience(index)">
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
import { ref, watch, defineEmits, defineProps } from "vue";
import { Resume, ExperienceEntry } from "@/store/resumeStore";
import { nanoid } from "nanoid";

// Define props and emits
const props = defineProps<{
  resume: Resume;
}>();

const emit = defineEmits<{
  (e: "update:experience", experience: ExperienceEntry[]): void;
}>();

// Local state
const openPanel = ref<number | null>(null);

const formData = ref({
  experience: props.resume.experience ? [...props.resume.experience] : [],
});

// Watch for changes in the resume prop
watch(
  () => props.resume,
  (newResume) => {
    formData.value.experience = newResume.experience
      ? [...newResume.experience]
      : [];
  },
  { deep: true }
);

// Methods
const addExperience = () => {
  const newExperience: ExperienceEntry = {
    id: nanoid(),
    company: "",
    position: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
  };

  formData.value.experience.unshift(newExperience);
  openPanel.value = 0; // Open the newly added experience panel
  emitUpdate();
};

const removeExperience = (index: number) => {
  formData.value.experience.splice(index, 1);
  emitUpdate();
};

const emitUpdate = () => {
  emit("update:experience", formData.value.experience);
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
.experience-section {
  padding: 20px 0;
}
</style>
