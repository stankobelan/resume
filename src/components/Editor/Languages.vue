<template>
  <div class="languages-section">
    <v-card class="mb-4">
      <v-card-title class="d-flex justify-space-between align-center">
        <span>Languages</span>
        <v-btn color="primary" @click="addLanguage">
          <v-icon left>mdi-plus</v-icon>
          Add Language
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-row v-if="formData.languages.length === 0">
          <v-col cols="12">
            <v-alert type="info">
              You haven't added any languages yet. Click "Add Language" to
              include your language skills.
            </v-alert>
          </v-col>
        </v-row>

        <v-row v-else>
          <v-col cols="12">
            <v-table>
              <thead>
                <tr>
                  <th>Language</th>
                  <th>Proficiency</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(lang, index) in formData.languages" :key="index">
                  <td>
                    <v-text-field
                      v-model="lang.language"
                      label="Language"
                      variant="plain"
                      density="compact"
                      hide-details
                      @input="emitUpdate"
                    ></v-text-field>
                  </td>
                  <td>
                    <v-select
                      v-model="lang.proficiency"
                      :items="proficiencyLevels"
                      label="Proficiency"
                      variant="plain"
                      density="compact"
                      hide-details
                      @update:model-value="emitUpdate"
                    ></v-select>
                  </td>
                  <td>
                    <v-btn
                      icon
                      color="error"
                      size="small"
                      @click="removeLanguage(index)"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-alert
              v-if="
                formData.languages.length > 0 && formData.languages.length < 2
              "
              type="info"
              class="mt-3"
            >
              If you know more languages, adding them can be a valuable asset
              for many positions.
            </v-alert>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { Resume, LanguageEntry } from "@/store/resumeStore";

// Define props and emits
const props = defineProps<{
  resume: Resume;
}>();

const emit = defineEmits<{
  (e: "update:languages", languages: LanguageEntry[]): void;
}>();

// Local state
const proficiencyLevels = [
  { title: "Native", value: "native" },
  { title: "Fluent", value: "fluent" },
  { title: "Advanced", value: "advanced" },
  { title: "Intermediate", value: "intermediate" },
  { title: "Beginner", value: "beginner" },
];

const formData = ref({
  languages: props.resume.languages ? [...props.resume.languages] : [],
});

// Watch for changes in the resume prop
watch(
  () => props.resume,
  (newResume) => {
    formData.value.languages = newResume.languages
      ? [...newResume.languages]
      : [];
  },
  { deep: true }
);

// Methods
const addLanguage = () => {
  formData.value.languages.push({
    language: "",
    proficiency: "intermediate",
  });
  emitUpdate();
};

const removeLanguage = (index: number) => {
  formData.value.languages.splice(index, 1);
  emitUpdate();
};

const emitUpdate = () => {
  emit("update:languages", formData.value.languages);
};
</script>

<style lang="scss" scoped>
.languages-section {
  padding: 20px 0;
}
</style>
