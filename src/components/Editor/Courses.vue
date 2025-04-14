<template>
  <div class="courses-section">
    <v-card class="mb-4">
      <v-card-title class="d-flex justify-space-between align-center">
        <span>Courses & Certifications</span>
        <v-btn color="primary" @click="addCourse">
          <v-icon left>mdi-plus</v-icon>
          Add Course
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-row v-if="formData.courses.length === 0">
          <v-col cols="12">
            <v-alert type="info">
              You haven't added any courses or certifications yet. Click "Add
              Course" to include your educational achievements.
            </v-alert>
          </v-col>
        </v-row>

        <div v-else>
          <v-expansion-panels v-model="openPanel">
            <v-expansion-panel
              v-for="(course, index) in formData.courses"
              :key="index"
            >
              <v-expansion-panel-title>
                <div class="d-flex flex-column">
                  <div class="font-weight-bold">
                    {{ course.name }}
                  </div>
                  <div class="text-caption">
                    {{ course.provider }} | {{ formatDate(course.date) }}
                  </div>
                </div>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-form @submit.prevent>
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="course.name"
                        label="Course Name"
                        required
                        :rules="[(v) => !!v || 'Course name is required']"
                        @input="emitUpdate"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="course.provider"
                        label="Provider/Institution"
                        required
                        :rules="[(v) => !!v || 'Provider is required']"
                        @input="emitUpdate"
                      ></v-text-field>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="course.date"
                        label="Completion Date"
                        type="month"
                        required
                        :rules="[(v) => !!v || 'Completion date is required']"
                        @input="emitUpdate"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="course.certificate"
                        label="Certificate ID/Reference"
                        hint="Optional: Include certificate ID or reference number"
                        @input="emitUpdate"
                      ></v-text-field>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="12" class="d-flex justify-end">
                      <v-btn color="error" @click="removeCourse(index)">
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

        <v-row v-if="formData.courses.length > 0" class="mt-4">
          <v-col cols="12">
            <v-alert type="info" icon="mdi-lightbulb">
              <strong>Tip:</strong> List most relevant or recent courses first.
              Include certifications that are relevant to the positions you're
              applying for.
            </v-alert>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { Resume, CourseEntry } from "@/store/resumeStore";
import { nanoid } from "nanoid";

// Define props and emits
const props = defineProps<{
  resume: Resume;
}>();

const emit = defineEmits<{
  (e: "update:courses", courses: CourseEntry[]): void;
}>();

// Local state
const openPanel = ref<number | null>(null);

const formData = ref({
  courses: props.resume.courses ? [...props.resume.courses] : [],
});

// Watch for changes in the resume prop
watch(
  () => props.resume,
  (newResume) => {
    formData.value.courses = newResume.courses ? [...newResume.courses] : [];
  },
  { deep: true }
);

// Methods
const addCourse = () => {
  const newCourse: CourseEntry = {
    id: nanoid(),
    name: "",
    provider: "",
    date: "",
    certificate: "",
  };

  formData.value.courses.unshift(newCourse);
  openPanel.value = 0; // Open the newly added course panel
  emitUpdate();
};

const removeCourse = (index: number) => {
  formData.value.courses.splice(index, 1);
  emitUpdate();
};

const emitUpdate = () => {
  emit("update:courses", formData.value.courses);
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
.courses-section {
  padding: 20px 0;
}
</style>
