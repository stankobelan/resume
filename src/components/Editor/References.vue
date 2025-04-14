<template>
  <div class="references-section">
    <v-card class="mb-4">
      <v-card-title>References</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-textarea
              v-model="formData.references"
              label="Professional References"
              rows="6"
              counter="500"
              :rules="[(v) => v.length <= 500 || 'Max 500 characters']"
              hint="List your professional references or simply state 'References available upon request'"
              @input="emitUpdate"
              persistent-hint
            ></v-textarea>
          </v-col>
        </v-row>

        <v-row v-if="!formData.references">
          <v-col cols="12">
            <v-alert type="info" class="mt-3">
              You can either list specific references with contact information
              or simply state "References available upon request."
            </v-alert>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <h3 class="text-subtitle-1 mb-3">Example Formats</h3>

            <v-expansion-panels flat>
              <v-expansion-panel>
                <v-expansion-panel-title>
                  Simple Statement
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  References available upon request.
                </v-expansion-panel-text>
              </v-expansion-panel>

              <v-expansion-panel>
                <v-expansion-panel-title>
                  Detailed References
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <p class="mb-2">John Smith, Senior Developer at ABC Tech</p>
                  <p class="mb-2">
                    Email: john.smith@abctech.com | Phone: (123) 456-7890
                  </p>
                  <p class="mb-2">Relationship: Former Manager</p>
                  <p class="mb-4">---</p>
                  <p class="mb-2">Jane Doe, Project Manager at XYZ Corp</p>
                  <p class="mb-2">
                    Email: jane.doe@xyzcorp.com | Phone: (098) 765-4321
                  </p>
                  <p>Relationship: Current Colleague</p>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
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
  (e: "update:references", references: string): void;
}>();

// Local form data
const formData = ref({
  references: props.resume.references || "",
});

// Watch for changes in the resume prop
watch(
  () => props.resume,
  (newResume) => {
    formData.value.references = newResume.references || "";
  },
  { deep: true }
);

// Methods
const emitUpdate = () => {
  emit("update:references", formData.value.references);
};
</script>

<style lang="scss" scoped>
.references-section {
  padding: 20px 0;
}
</style>
