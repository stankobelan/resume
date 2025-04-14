<template>
  <div class="profile-section">
    <v-card class="mb-4">
      <v-card-title>Professional Profile</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-textarea
              v-model="formData.profile"
              label="Professional Summary"
              rows="6"
              counter="1000"
              :rules="[(v) => v.length <= 1000 || 'Max 1000 characters']"
              hint="Write a concise summary of your professional background, key skills, and career goals. This is often the first section employers read."
              @input="emitUpdate"
              persistent-hint
            ></v-textarea>
          </v-col>
        </v-row>

        <v-row v-if="!formData.profile">
          <v-col cols="12">
            <v-alert type="info" class="mt-3">
              Add a professional profile to give employers a quick overview of
              your qualifications and career goals.
            </v-alert>
          </v-col>
        </v-row>

        <v-row v-else-if="formData.profile.length < 100">
          <v-col cols="12">
            <v-alert type="warning" class="mt-3">
              Consider making your profile at least 100 characters to properly
              highlight your qualifications.
            </v-alert>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <h3 class="text-subtitle-1 mb-3">Examples</h3>

            <v-expansion-panels flat>
              <v-expansion-panel>
                <v-expansion-panel-title>
                  Software Developer Example
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  Detail-oriented Software Developer with 5+ years of experience
                  in full-stack development. Proficient in JavaScript,
                  TypeScript, React, and Node.js. Passionate about creating
                  clean, efficient code and delivering high-quality user
                  experiences. Successfully delivered applications that improved
                  business operations and customer satisfaction. Seeking to
                  leverage my technical skills and creativity in a collaborative
                  environment.
                </v-expansion-panel-text>
              </v-expansion-panel>

              <v-expansion-panel>
                <v-expansion-panel-title>
                  Project Manager Example
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  Certified Project Manager (PMP) with 8 years of experience
                  leading cross-functional teams in the technology sector.
                  Successful track record of delivering complex projects on time
                  and under budget. Strong skills in stakeholder communication,
                  risk management, and process improvement. Known for creating
                  collaborative environments that encourage innovation and
                  problem-solving.
                </v-expansion-panel-text>
              </v-expansion-panel>

              <v-expansion-panel>
                <v-expansion-panel-title>
                  Recent Graduate Example
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  Recent Computer Science graduate with strong academic
                  foundation and practical experience through internships and
                  project work. Eager to apply my knowledge of Java, Python, and
                  database design in a professional setting. Quick learner with
                  excellent problem-solving abilities and a passion for creating
                  intuitive software solutions. Seeking an entry-level position
                  where I can grow my skills while contributing to meaningful
                  projects.
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
  (e: "update:profile", profile: string): void;
}>();

// Local form data
const formData = ref({
  profile: props.resume.profile || "",
});

// Watch for changes in the resume prop
watch(
  () => props.resume,
  (newResume) => {
    formData.value.profile = newResume.profile || "";
  },
  { deep: true }
);

// Methods
const emitUpdate = () => {
  emit("update:profile", formData.value.profile);
};
</script>

<style lang="scss" scoped>
.profile-section {
  padding: 20px 0;
}
</style>
