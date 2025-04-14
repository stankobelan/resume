import { defineStore } from "pinia";
import { ref } from "vue";
import { nanoid } from "nanoid";

// Define the Resume type
export interface Resume {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  fullName: string;
  title: string;
  location: string;
  email: string;
  phone: string;
  links: {
    linkedin?: string;
    github?: string;
    website?: string;
  };
  profile: string;
  skills: string[];
  experience: ExperienceEntry[];
  education: EducationEntry[];
  courses: CourseEntry[];
  languages: LanguageEntry[];
  hobbies: string[];
  references: string;
  photoBase64?: string;
  tags: string[];
  templateId: string;
}

export interface ExperienceEntry {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  description: string;
}

export interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  description: string;
}

export interface CourseEntry {
  id: string;
  name: string;
  provider: string;
  date: string;
  certificate: string;
}

export interface LanguageEntry {
  language: string;
  proficiency: "beginner" | "intermediate" | "advanced" | "fluent" | "native";
}

// Create and export the store
export const useResumeStore = defineStore("resume", () => {
  // State
  const resumes = ref<Resume[]>([]);
  const selectedResumeId = ref<string | null>(null);

  // Getters
  const selectedResume = () => {
    if (!selectedResumeId.value) return null;
    return (
      resumes.value.find((resume) => resume.id === selectedResumeId.value) ||
      null
    );
  };

  // Actions
  const createResume = (name: string) => {
    const newResume: Resume = {
      id: nanoid(),
      name,
      createdAt: new Date(),
      updatedAt: new Date(),
      fullName: "",
      title: "",
      location: "",
      email: "",
      phone: "",
      links: {},
      profile: "",
      skills: [],
      experience: [],
      education: [],
      courses: [],
      languages: [],
      hobbies: [],
      references: "",
      tags: [],
      templateId: "default",
    };

    resumes.value.push(newResume);
    selectedResumeId.value = newResume.id;
    return newResume;
  };

  const updateResume = (id: string, data: Partial<Resume>) => {
    const index = resumes.value.findIndex((resume) => resume.id === id);
    if (index !== -1) {
      resumes.value[index] = {
        ...resumes.value[index],
        ...data,
        updatedAt: new Date(),
      };
      return true;
    }
    return false;
  };

  const deleteResume = (id: string) => {
    const index = resumes.value.findIndex((resume) => resume.id === id);
    if (index !== -1) {
      resumes.value.splice(index, 1);
      if (selectedResumeId.value === id && resumes.value.length > 0) {
        selectedResumeId.value = resumes.value[0].id;
      } else if (resumes.value.length === 0) {
        selectedResumeId.value = null;
      }
      return true;
    }
    return false;
  };

  const duplicateResume = (id: string) => {
    const resume = resumes.value.find((resume) => resume.id === id);
    if (resume) {
      const duplicatedResume: Resume = {
        ...JSON.parse(JSON.stringify(resume)),
        id: nanoid(),
        name: `${resume.name} (kĂłpia)`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      resumes.value.push(duplicatedResume);
      return duplicatedResume;
    }
    return null;
  };

  const setActiveResume = (id: string) => {
    const resume = resumes.value.find((resume) => resume.id === id);
    if (resume) {
      selectedResumeId.value = id;
      return true;
    }
    return false;
  };

  return {
    resumes,
    selectedResumeId,
    selectedResume,
    createResume,
    updateResume,
    deleteResume,
    duplicateResume,
    setActiveResume,
  };
});
