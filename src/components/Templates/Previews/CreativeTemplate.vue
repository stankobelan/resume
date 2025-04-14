<template>
  <div
    class="creative-template"
    :style="{
      fontFamily: font.family,
      color: colorScheme.text,
      backgroundColor: colorScheme.background,
    }"
  >
    <div
      class="resume-header"
      :style="{ backgroundColor: colorScheme.primary }"
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
      <div
        class="sidebar"
        :style="{ backgroundColor: colorScheme.secondary + '20' }"
      >
        <div class="section contact-info">
          <h3 class="section-title" :style="{ color: colorScheme.primary }">
            Contact
          </h3>

          <div class="info-item" v-if="resume.email">
            <v-icon :color="colorScheme.accent" size="small">mdi-email</v-icon>
            <span>{{ resume.email }}</span>
          </div>

          <div class="info-item" v-if="resume.phone">
            <v-icon :color="colorScheme.accent" size="small">mdi-phone</v-icon>
            <span>{{ resume.phone }}</span>
          </div>

          <div class="info-item" v-if="resume.location">
            <v-icon :color="colorScheme.accent" size="small"
              >mdi-map-marker</v-icon
            >
            <span>{{ resume.location }}</span>
          </div>

          <div class="info-item" v-if="resume.links?.linkedin">
            <v-icon :color="colorScheme.accent" size="small"
              >mdi-linkedin</v-icon
            >
            <span>{{ formatLink(resume.links.linkedin) }}</span>
          </div>

          <div class="info-item" v-if="resume.links?.github">
            <v-icon :color="colorScheme.accent" size="small">mdi-github</v-icon>
            <span>{{ formatLink(resume.links.github) }}</span>
          </div>

          <div class="info-item" v-if="resume.links?.website">
            <v-icon :color="colorScheme.accent" size="small">mdi-web</v-icon>
            <span>{{ formatLink(resume.links.website) }}</span>
          </div>
        </div>

        <div
          class="divider"
          :style="{ backgroundColor: colorScheme.primary }"
        ></div>

        <div
          class="section skills"
          v-if="resume.skills && resume.skills.length > 0"
        >
          <h3 class="section-title" :style="{ color: colorScheme.primary }">
            Skills
          </h3>
          <div class="skills-container">
            <v-chip
              v-for="skill in resume.skills"
              :key="skill"
              :color="colorScheme.primary"
              text-color="white"
              size="small"
              class="ma-1"
            >
              {{ skill }}
            </v-chip>
          </div>
        </div>

        <div
          class="divider"
          :style="{ backgroundColor: colorScheme.primary }"
        ></div>

        <div
          class="section languages"
          v-if="resume.languages && resume.languages.length > 0"
        >
          <h3 class="section-title" :style="{ color: colorScheme.primary }">
            Languages
          </h3>
          <div
            class="language-container"
            v-for="language in resume.languages"
            :key="language.language"
          >
            <div class="language-header">
              <span class="language-name">{{ language.language }}</span>
              <span class="language-level">{{
                formatProficiency(language.proficiency)
              }}</span>
            </div>
            <v-progress-linear
              :color="colorScheme.accent"
              :model-value="getProficiencyPercentage(language.proficiency)"
              height="8"
              rounded
            ></v-progress-linear>
          </div>
        </div>

        <div
          class="divider"
          :style="{ backgroundColor: colorScheme.primary }"
        ></div>

        <div
          class="section hobbies"
          v-if="resume.hobbies && resume.hobbies.length > 0"
        >
          <h3 class="section-title" :style="{ color: colorScheme.primary }">
            Hobbies
          </h3>
          <p>{{ resume.hobbies.join(", ") }}</p>
        </div>
      </div>

      <div class="main-content">
        <div class="section profile" v-if="resume.profile">
          <h3 class="section-title" :style="{ color: colorScheme.primary }">
            Profile
          </h3>
          <p>{{ resume.profile }}</p>
        </div>

        <div
          class="section experience"
          v-if="resume.experience && resume.experience.length > 0"
        >
          <h3 class="section-title" :style="{ color: colorScheme.primary }">
            Experience
          </h3>

          <div
            class="experience-item"
            v-for="exp in resume.experience"
            :key="exp.id"
          >
            <div class="timeline" :style="{ borderColor: colorScheme.primary }">
              <div
                class="timeline-point"
                :style="{ backgroundColor: colorScheme.primary }"
              ></div>
            </div>
            <div class="experience-content">
              <div class="experience-header">
                <h4 class="position" :style="{ color: colorScheme.primary }">
                  {{ exp.position }}
                </h4>
                <div class="company-date">
                  <h5 class="company">{{ exp.company }}</h5>
                  <div class="date-range">
                    {{ formatDate(exp.startDate) }} -
                    {{ exp.current ? "Present" : formatDate(exp.endDate) }}
                  </div>
                </div>
              </div>
              <p class="experience-description">{{ exp.description }}</p>
            </div>
          </div>
        </div>

        <div
          class="section education"
          v-if="resume.education && resume.education.length > 0"
        >
          <h3 class="section-title" :style="{ color: colorScheme.primary }">
            Education
          </h3>

          <div
            class="education-item"
            v-for="edu in resume.education"
            :key="edu.id"
          >
            <div class="timeline" :style="{ borderColor: colorScheme.primary }">
              <div
                class="timeline-point"
                :style="{ backgroundColor: colorScheme.primary }"
              ></div>
            </div>
            <div class="education-content">
              <div class="education-header">
                <h4 class="degree" :style="{ color: colorScheme.primary }">
                  {{ edu.degree }} in {{ edu.field }}
                </h4>
                <div class="institution-date">
                  <h5 class="institution">{{ edu.institution }}</h5>
                  <div class="date-range">
                    {{ formatDate(edu.startDate) }} -
                    {{ edu.current ? "Present" : formatDate(edu.endDate) }}
                  </div>
                </div>
              </div>
              <p class="education-description" v-if="edu.description">
                {{ edu.description }}
              </p>
            </div>
          </div>
        </div>

        <div
          class="section courses"
          v-if="resume.courses && resume.courses.length > 0"
        >
          <h3 class="section-title" :style="{ color: colorScheme.primary }">
            Courses & Certifications
          </h3>

          <div class="courses-grid">
            <div
              class="course-item"
              v-for="course in resume.courses"
              :key="course.id"
              :style="{ borderColor: colorScheme.secondary }"
            >
              <h4 class="course-name" :style="{ color: colorScheme.primary }">
                {{ course.name }}
              </h4>
              <div class="course-provider">{{ course.provider }}</div>
              <div class="course-date">{{ formatDate(course.date) }}</div>
              <div class="course-certificate" v-if="course.certificate">
                Certificate: {{ course.certificate }}
              </div>
            </div>
          </div>
        </div>

        <div class="section references" v-if="resume.references">
          <h3 class="section-title" :style="{ color: colorScheme.primary }">
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

const getProficiencyPercentage = (proficiency: string): number => {
  const percentages: Record<string, number> = {
    beginner: 20,
    intermediate: 40,
    advanced: 60,
    fluent: 80,
    native: 100,
  };

  return percentages[proficiency] || 50;
};
</script>

<style lang="scss" scoped>
.creative-template {
  font-size: 14px;
  line-height: 1.5;

  .resume-header {
    padding: 30px;
    color: white;

    .header-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;

      .profile-photo-container {
        width: 130px;
        height: 130px;
        border-radius: 50%;
        overflow: hidden;
        margin-bottom: 15px;
        border: 3px solid white;

        .profile-photo {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .header-text {
        .full-name {
          font-size: 2.5rem;
          font-weight: 700;
          margin: 0 0 8px 0;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .job-title {
          font-size: 1.4rem;
          font-weight: 400;
          margin: 0;
          opacity: 0.9;
        }
      }
    }
  }

  .divider {
    height: 3px;
    width: 50px;
    margin: 20px 0;
  }

  .section {
    margin-bottom: 25px;

    .section-title {
      font-size: 1.3rem;
      font-weight: 700;
      margin-bottom: 15px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
  }

  .sidebar {
    padding: 25px;

    .contact-info {
      .info-item {
        display: flex;
        align-items: center;
        margin-bottom: 12px;

        i,
        .v-icon {
          margin-right: 10px;
          min-width: 20px;
        }
      }
    }

    .skills-container {
      display: flex;
      flex-wrap: wrap;
      margin: -4px;
    }

    .language-container {
      margin-bottom: 12px;

      .language-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 5px;

        .language-level {
          opacity: 0.7;
          font-size: 0.9em;
        }
      }
    }
  }

  .main-content {
    padding: 25px;

    .experience-item,
    .education-item {
      display: flex;
      margin-bottom: 25px;

      .timeline {
        width: 20px;
        position: relative;
        margin-right: 15px;
        border-right: 2px solid;

        .timeline-point {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          position: absolute;
          top: 6px;
          right: -7px;
        }
      }

      .experience-content,
      .education-content {
        flex: 1;

        .experience-header,
        .education-header {
          margin-bottom: 10px;

          .position,
          .degree {
            font-weight: 600;
            margin: 0 0 5px 0;
            font-size: 1.1rem;
          }

          .company-date,
          .institution-date {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .company,
            .institution {
              font-style: italic;
              margin: 0;
            }

            .date-range {
              font-size: 0.9rem;
              opacity: 0.7;
            }
          }
        }
      }
    }

    .courses-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 15px;

      .course-item {
        padding: 15px;
        border: 1px solid;
        border-radius: 5px;

        .course-name {
          margin: 0 0 8px 0;
          font-size: 1.1rem;
        }

        .course-provider {
          font-style: italic;
          margin-bottom: 5px;
        }

        .course-date,
        .course-certificate {
          font-size: 0.9em;
          opacity: 0.7;
        }
      }
    }
  }
}
</style>
