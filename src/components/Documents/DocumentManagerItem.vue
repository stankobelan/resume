<template>
  <v-card class="resume-card mb-4">
    <v-card-title class="d-flex justify-space-between">
      <div>{{ resume.name }}</div>
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props" size="small">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="$emit('edit', resume.id)">
            <template v-slot:prepend>
              <v-icon color="primary">mdi-pencil</v-icon>
            </template>
            <v-list-item-title>Edit</v-list-item-title>
          </v-list-item>

          <v-list-item @click="$emit('duplicate', resume.id)">
            <template v-slot:prepend>
              <v-icon color="primary">mdi-content-copy</v-icon>
            </template>
            <v-list-item-title>Duplicate</v-list-item-title>
          </v-list-item>

          <v-list-item @click="$emit('delete', resume)">
            <template v-slot:prepend>
              <v-icon color="error">mdi-delete</v-icon>
            </template>
            <v-list-item-title>Delete</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-card-title>

    <v-card-subtitle class="d-flex justify-space-between text-caption">
      <span>Created: {{ formatDate(resume.createdAt) }}</span>
      <span>Updated: {{ formatDate(resume.updatedAt) }}</span>
    </v-card-subtitle>

    <v-card-text>
      <div class="resume-details">
        <div class="detail-item" v-if="resume.fullName">
          <v-icon size="small" color="primary">mdi-account</v-icon>
          <span>{{ resume.fullName }}</span>
        </div>

        <div class="detail-item" v-if="resume.title">
          <v-icon size="small" color="primary">mdi-briefcase</v-icon>
          <span>{{ resume.title }}</span>
        </div>

        <div class="detail-item" v-if="resume.location">
          <v-icon size="small" color="primary">mdi-map-marker</v-icon>
          <span>{{ resume.location }}</span>
        </div>
      </div>

      <div class="mt-3">
        <div class="completion-indicator">
          <span class="caption">Completion: {{ completionPercentage }}%</span>
          <v-progress-linear
            :model-value="completionPercentage"
            color="primary"
            height="8"
            :class="getCompletionClass(completionPercentage)"
          ></v-progress-linear>
        </div>
      </div>
    </v-card-text>

    <v-card-actions>
      <v-btn color="primary" variant="text" @click="$emit('edit', resume.id)">
        Edit
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn color="secondary" variant="text" :to="`/template/${resume.id}`">
        Template
      </v-btn>
      <v-btn color="success" variant="text" :to="`/export/${resume.id}`">
        Export
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { computed, defineProps, defineEmits } from "vue";
import { Resume } from "@/store/resumeStore";

// Define props and emits
const props = defineProps<{
  resume: Resume;
}>();

// Define emits - no need to assign to variable since we use $emit in template
defineEmits<{
  (e: "edit", resumeId: string): void;
  (e: "duplicate", resumeId: string): void;
  (e: "delete", resume: Resume): void;
}>();

// Computed properties
const completionPercentage = computed(() => {
  const required = [
    "fullName",
    "email",
    "phone",
    "location",
    "title",
    "skills",
    "experience",
  ];
  const completed = required.filter((field) => {
    if (field === "skills") {
      return props.resume.skills && props.resume.skills.length > 0;
    }
    if (field === "experience") {
      return props.resume.experience && props.resume.experience.length > 0;
    }
    return !!props.resume[field as keyof Resume];
  });

  return Math.floor((completed.length / required.length) * 100);
});

// Methods
const formatDate = (date: Date): string => {
  if (!date) return "N/A";

  return new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getCompletionClass = (percentage: number): string => {
  if (percentage < 30) return "bg-error";
  if (percentage < 70) return "bg-warning";
  return "bg-success";
};
</script>

<style lang="scss" scoped>
.resume-card {
  height: 100%;

  .resume-details {
    .detail-item {
      display: flex;
      align-items: center;
      margin-bottom: 8px;

      i,
      .v-icon {
        margin-right: 8px;
        min-width: 20px;
      }
    }
  }

  .completion-indicator {
    margin-top: 8px;
  }
}
</style>
