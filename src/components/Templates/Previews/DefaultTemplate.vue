<template>
  <div
    class="default-template"
    :style="{
      fontFamily: font.family,
      color: colorScheme.text,
      backgroundColor: colorScheme.background,
    }"
  >
    <div
      class="resume-header"
      :style="{ backgroundColor: colorScheme.primary, color: '#ffffff' }"
    >
      <div class="header-content">
        <div class="profile-photo-container" v-if="resume.photoBase64">
          <img
            :src="resume.photoBase64"
            alt="Profile Photo"
            class="profile-photo"
          />
        </div>
        <div class="header-text">
          <h1 class="full-name">{{ resume.fullName }}</h1>
          <h2 class="job-title">{{ resume.title }}</h2>
        </div>
      </div>
    </div>

    <div class="resume-content">
      <div class="sidebar">
        <div class="section contact-info">
          <h3 class="section-title" :style="{ color: colorScheme.secondary }">
            Contact
          </h3>

          <div class="info-item" v-if="resume.email">
            <v-icon color="secondary" size="small">mdi-email</v-icon>
            <span>{{ resume.email }}</span>
          </div>

          <div class="info-item" v-if="resume.phone">
            <v-icon color="secondary" size="small">mdi-phone</v-icon>
            <span>{{ resume.phone }}</span>
          </div>

          <div class="info-item" v-if="resume.location">
            <v-icon color="secondary" size="small">mdi-map-marker</v-icon>
            <span>{{ resume.location }}</span>
          </div>

          <div class="info-item" v-if="resume.links?.linkedin">
            <v-icon color="secondary" size="small">mdi-linkedin</v-icon>
            <span>{{ formatLink(resume.links.linkedin) }}</span>
          </div>

          <div class="info-item" v-if="resume.links?.github">
            <v-icon color="secondary" size="small">mdi-github</v-icon>
            <span>{{ formatLink(resume.links.github) }}</span>
          </div>

          <div class="info-item" v-if="resume.links?.website">
            <v-icon color="secondary" size="small">mdi-web</v-icon>
            <span>{{ formatLink(resume.links.website) }}</span>
          </div>
        </div>

        <div
          class="section skills"
          v-if="resume.skills && resume.skills.length > 0"
        >
          <h3 class="section-title" :style="{ color: colorScheme.secondary }">
            Skills
          </h3>
          <ul class="skills-list">
            <li v-for="skill in resume.skills" :key="skill">
              {{ skill }}
            </li>
          </ul>
        </div>

        <div
          class="section languages"
          v-if="resume.languages && resume.languages.length > 0"
        >
          <h3 class="section-title" :style="{ color: colorScheme.secondary }">
            Languages
          </h3>
          <ul class="languages-list">
            <li v-for="language in resume.languages" :key="language.language">
              <span class="language-name">{{ language.language }}</span>
              <span class="language-level">{{
                formatProficiency(language.proficiency)
              }}</span>
            </li>
          </ul>
        </div>

        <div
          class="section hobbies"
          v-if="resume.hobbies && resume.hobbies.length > 0"
        >
          <h3 class="section-title" :style="{ color: colorScheme.secondary }">
            Hobbies
          </h3>
          <p>{{ resume.hobbies.join(", ") }}</p>
        </div>
      </div>

      <div class="main-content">
        <div class="section profile" v-if="resume.profile">
          <h3 class="section-title" :style="{ color: colorScheme.secondary }">
            Profile
          </h3>
          <p>{{ resume.profile }}</p>
        </div>

        <div
          class="section experience"
          v-if="resume.experience && resume.experience.length > 0"
        >
          <h3 class="section-title" :style="{ color: colorScheme.secondary }">
            Experience
          </h3>

          <div
            class="experience-item"
            v-for="exp in resume.experience"
            :key="exp.id"
          >
            <div class="experience-header">
              <div class="company-position">
                <h4 class="position">{{ exp.position }}</h4>
                <h5 class="company">{{ exp.company }}</h5>
              </div>
              <div class="date-range">
                {{ formatDate(exp.startDate) }} -
                {{ exp.current ? "Present" : formatDate(exp.endDate) }}
              </div>
            </div>
            <p class="experience-description">{{ exp.description }}</p>
          </div>
        </div>

        <div
          class="section education"
          v-if="resume.education && resume.education.length > 0"
        >
          <h3 class="section-title" :style="{ color: colorScheme.secondary }">
            Education
          </h3>

          <div
            class="education-item"
            v-for="edu in resume.education"
            :key="edu.id"
          >
            <div class="education-header">
              <div class="degree-institution">
                <h4 class="degree">{{ edu.degree }} in {{ edu.field }}</h4>
                <h5 class="institution">{{ edu.institution }}</h5>
              </div>
              <div class="date-range">
                {{ formatDate(edu.startDate) }} -
                {{ edu.current ? "Present" : formatDate(edu.endDate) }}
              </div>
            </div>
            <p class="education-description" v-if="edu.description">
              {{ edu.description }}
            </p>
          </div>
        </div>

        <div
          class="section courses"
          v-if="resume.courses && resume.courses.length > 0"
        >
          <h3 class="section-title" :style="{ color: colorScheme.secondary }">
            Courses & Certifications
          </h3>

          <div
            class="course-item"
            v-for="course in resume.courses"
            :key="course.id"
          >
            <div class="course-header">
              <h4 class="course-name">{{ course.name }}</h4>
              <span class="course-provider">{{ course.provider }}</span>
            </div>
            <div class="course-date">{{ formatDate(course.date) }}</div>
            <div class="course-certificate" v-if="course.certificate">
              Certificate: {{ course.certificate }}
            </div>
          </div>
        </div>

        <div class="section references" v-if="resume.references">
          <h3 class="section-title" :style="{ color: colorScheme.secondary }">
            References
          </h3>
          <p>{{ resume.references }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Resume } from "@/store/resumeStore";
import { ColorScheme, Font, Layout } from "@/store/templateStore";

// Define props
const props = defineProps<{
  resume: Resume;
  colorScheme: ColorScheme;
  font: Font;
  layout: Layout;
}>();

// Helper methods
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

const formatLink = (url: string): string => {
  return url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
};

const formatProficiency = (proficiency: string): string => {
  const levels: Record<string, string> = {
    beginner: "Basic",
    intermediate: "Intermediate",
    advanced: "Advanced",
    fluent: "Fluent",
    native: "Native",
  };

  return levels[proficiency] || proficiency;
};
</script>

<style lang="scss" scoped>
.default-template {
  padding-bottom: 24px;
  font-size: 14px;
  line-height: 1.5;

  .resume-header {
    padding: 30px;
    margin-bottom: 20px;

    .header-content {
      display: flex;
      align-items: center;

      .profile-photo-container {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        overflow: hidden;
        margin-right: 30px;
        border: 3px solid white;

        .profile-photo {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .header-text {
        .full-name {
          font-size: 2.2rem;
          font-weight: 700;
          margin: 0 0 5px 0;
        }

        .job-title {
          font-size: 1.3rem;
          font-weight: 400;
          margin: 0;
          opacity: 0.9;
        }
      }
    }
  }

  .section {
    margin-bottom: 20px;

    .section-title {
      font-size: 1.2rem;
      font-weight: 700;
      margin-bottom: 12px;
      padding-bottom: 5px;
      border-bottom: 2px solid currentColor;
    }
  }

  .sidebar {
    padding: 0 20px;

    .contact-info {
      .info-item {
        display: flex;
        align-items: center;
        margin-bottom: 8px;

        i,
        .v-icon {
          margin-right: 10px;
          min-width: 20px;
        }
      }
    }

    .skills-list,
    .languages-list {
      list-style-type: none;
      padding-left: 0;
      margin: 0;

      li {
        margin-bottom: 8px;
      }
    }

    .languages-list {
      li {
        display: flex;
        justify-content: space-between;

        .language-level {
          opacity: 0.8;
        }
      }
    }
  }

  .main-content {
    padding: 0 20px;

    .experience-item,
    .education-item,
    .course-item {
      margin-bottom: 16px;

      .experience-header,
      .education-header,
      .course-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 5px;

        .position,
        .degree,
        .course-name {
          font-weight: 600;
          margin: 0;
          font-size: 1.1rem;
        }

        .company,
        .institution,
        .course-provider {
          font-style: italic;
          margin: 0;
        }

        .date-range {
          text-align: right;
          font-size: 0.9rem;
          opacity: 0.8;
        }
      }
    }
  }
}
</style>
