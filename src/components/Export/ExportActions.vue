<template>
  <div class="export-actions">
    <v-list>
      <v-list-item @click="exportToPDF">
        <template v-slot:prepend>
          <v-icon color="red">mdi-file-pdf-box</v-icon>
        </template>
        <v-list-item-title>Download as PDF</v-list-item-title>
      </v-list-item>

      <v-list-item @click="printResume">
        <template v-slot:prepend>
          <v-icon color="grey-darken-1">mdi-printer</v-icon>
        </template>
        <v-list-item-title>Print Resume</v-list-item-title>
      </v-list-item>
    </v-list>

    <v-divider class="my-3"></v-divider>

    <h3 class="text-subtitle-1 mb-2">PDF Options</h3>

    <v-form>
      <v-select
        v-model="pdfOptions.format"
        :items="paperFormats"
        label="Paper Format"
      ></v-select>

      <v-select
        v-model="pdfOptions.orientation"
        :items="orientations"
        label="Orientation"
      ></v-select>

      <v-text-field
        v-model="pdfOptions.filename"
        label="Filename"
        :placeholder="defaultFilename"
      ></v-text-field>
    </v-form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineExpose } from "vue";
import { Resume } from "@/store/resumeStore";
import html2pdf from "html2pdf.js";

// Define props and emits
const props = defineProps<{
  resume: Resume;
}>();

const emit = defineEmits<{
  (e: "export-started"): void;
  (e: "export-completed", success: boolean): void;
}>();

// Options
const paperFormats = [
  { title: "A4", value: "a4" },
  { title: "Letter", value: "letter" },
  { title: "Legal", value: "legal" },
];

const orientations = [
  { title: "Portrait", value: "portrait" as "portrait" | "landscape" },
  { title: "Landscape", value: "landscape" as "portrait" | "landscape" },
];

// State
const pdfOptions = ref({
  format: "a4",
  orientation: "portrait" as "portrait" | "landscape",
  filename: "",
});

// Computed properties
const defaultFilename = computed(() => {
  if (props.resume && props.resume.fullName) {
    return `${props.resume.fullName} - Resume.pdf`;
  }
  return "Resume.pdf";
});

// Methods
const exportToPDF = async () => {
  const element = document.getElementById("resume-preview");

  if (!element) {
    console.error("Resume preview element not found");
    return;
  }

  emit("export-started");

  // Dočasne odstránime obmedzenie výšky kontajnera, aby sa zobrazil celý obsah
  const previewContainer = element.closest(".preview-container") as HTMLElement;
  let originalHeight = "";
  let originalOverflow = "";

  if (previewContainer) {
    originalHeight = previewContainer.style.maxHeight || "";
    originalOverflow = previewContainer.style.overflow || "";
    previewContainer.style.maxHeight = "none";
    previewContainer.style.overflow = "visible";
  }

  const options = {
    margin: 10,
    filename: pdfOptions.value.filename || defaultFilename.value,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      scrollY: 0,
      windowHeight: element.scrollHeight + 20, // Pridaná výška s rezervou
      logging: true, // Pre prípadné ladenie
    },
    jsPDF: {
      unit: "mm",
      format: pdfOptions.value.format,
      orientation: pdfOptions.value.orientation,
      compress: true,
    },
    pagebreak: { mode: ["avoid-all", "css", "legacy"] },
  };

  try {
    await html2pdf().from(element).set(options).save();
    emit("export-completed", true);
  } catch (error) {
    console.error("PDF export failed:", error);
    emit("export-completed", false);
  } finally {
    // Obnovíme pôvodné nastavenia kontajnera
    if (previewContainer) {
      previewContainer.style.maxHeight = originalHeight;
      previewContainer.style.overflow = originalOverflow;
    }
  }
};

const printResume = () => {
  const element = document.getElementById("resume-preview");

  if (!element) {
    console.error("Resume preview element not found");
    return;
  }

  const printWindow = window.open("", "_blank");

  if (!printWindow) {
    alert("Please allow pop-ups to print your resume.");
    return;
  }

  // Simplified HTML creation to avoid parsing issues
  let html = "<!DOCTYPE html><html><head>";
  html += "<title>" + (props.resume.fullName || "Resume") + "</title>";
  html +=
    "<style>body{margin:0;padding:20px}@media print{body{padding:0}}</style>";
  html += "</head><body>";
  html += element.innerHTML;
  html +=
    "<" +
    "script>window.onload=function(){setTimeout(function(){window.print();window.close();},250)};</" +
    "script>";
  html += "</body></html>";

  printWindow.document.write(html);
  printWindow.document.close();
};

// Explicitne vystavujeme metódy, aby boli dostupné pre šablónu
defineExpose({
  exportToPDF,
  printResume,
});
</script>

<style lang="scss" scoped>
.export-actions {
  padding: 10px 0;
}
</style>
