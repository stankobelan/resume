import { defineStore } from "pinia";
import { ref } from "vue";

// Template interface
export interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  colorSchemes: ColorScheme[];
  fonts: Font[];
  layouts: Layout[];
}

export interface ColorScheme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

export interface Font {
  id: string;
  name: string;
  family: string;
  url?: string;
}

export interface Layout {
  id: string;
  name: string;
  type: "side-by-side" | "block";
}

// Create and export the store
export const useTemplateStore = defineStore("template", () => {
  // Default templates
  const defaultTemplates: Template[] = [
    {
      id: "default",
      name: "Professional",
      description:
        "Clean and professional design suitable for most job applications",
      thumbnail: "/templates/professional.png",
      colorSchemes: [
        {
          id: "default-blue",
          name: "Classic Blue",
          primary: "#2c3e50",
          secondary: "#3498db",
          accent: "#1abc9c",
          background: "#ffffff",
          text: "#333333",
        },
        {
          id: "default-dark",
          name: "Dark Mode",
          primary: "#1a1a1a",
          secondary: "#3498db",
          accent: "#1abc9c",
          background: "#121212",
          text: "#f5f5f5",
        },
      ],
      fonts: [
        {
          id: "default-roboto",
          name: "Roboto",
          family: "Roboto, sans-serif",
          url: "https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap",
        },
        {
          id: "default-open-sans",
          name: "Open Sans",
          family: "Open Sans, sans-serif",
          url: "https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap",
        },
      ],
      layouts: [
        {
          id: "default-side",
          name: "Side by side",
          type: "side-by-side",
        },
        {
          id: "default-block",
          name: "Block style",
          type: "block",
        },
      ],
    },
    {
      id: "creative",
      name: "Creative",
      description: "A modern and creative design for creative industries",
      thumbnail: "/templates/creative.png",
      colorSchemes: [
        {
          id: "creative-purple",
          name: "Creative Purple",
          primary: "#6c5ce7",
          secondary: "#a29bfe",
          accent: "#fd79a8",
          background: "#ffffff",
          text: "#2d3436",
        },
        {
          id: "creative-green",
          name: "Creative Green",
          primary: "#00b894",
          secondary: "#55efc4",
          accent: "#fdcb6e",
          background: "#ffffff",
          text: "#2d3436",
        },
      ],
      fonts: [
        {
          id: "creative-montserrat",
          name: "Montserrat",
          family: "Montserrat, sans-serif",
          url: "https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;700&display=swap",
        },
        {
          id: "creative-poppins",
          name: "Poppins",
          family: "Poppins, sans-serif",
          url: "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;700&display=swap",
        },
      ],
      layouts: [
        {
          id: "creative-side",
          name: "Side by side",
          type: "side-by-side",
        },
        {
          id: "creative-block",
          name: "Block style",
          type: "block",
        },
      ],
    },
  ];

  // State
  const templates = ref<Template[]>(defaultTemplates);
  const selectedTemplateId = ref<string>("default");
  const selectedColorSchemeId = ref<string>("default-blue");
  const selectedFontId = ref<string>("default-roboto");
  const selectedLayoutId = ref<string>("default-side");

  // Getters
  const selectedTemplate = () => {
    return (
      templates.value.find(
        (template) => template.id === selectedTemplateId.value
      ) || templates.value[0]
    );
  };

  const selectedColorScheme = () => {
    const template = selectedTemplate();
    return (
      template.colorSchemes.find(
        (scheme) => scheme.id === selectedColorSchemeId.value
      ) || template.colorSchemes[0]
    );
  };

  const selectedFont = () => {
    const template = selectedTemplate();
    return (
      template.fonts.find((font) => font.id === selectedFontId.value) ||
      template.fonts[0]
    );
  };

  const selectedLayout = () => {
    const template = selectedTemplate();
    return (
      template.layouts.find((layout) => layout.id === selectedLayoutId.value) ||
      template.layouts[0]
    );
  };

  // Actions
  const setTemplate = (templateId: string) => {
    const template = templates.value.find((t) => t.id === templateId);
    if (template) {
      selectedTemplateId.value = templateId;
      // Set defaults for this template
      selectedColorSchemeId.value = template.colorSchemes[0].id;
      selectedFontId.value = template.fonts[0].id;
      selectedLayoutId.value = template.layouts[0].id;
      return true;
    }
    return false;
  };

  const setColorScheme = (colorSchemeId: string) => {
    const template = selectedTemplate();
    const colorScheme = template.colorSchemes.find(
      (scheme) => scheme.id === colorSchemeId
    );
    if (colorScheme) {
      selectedColorSchemeId.value = colorSchemeId;
      return true;
    }
    return false;
  };

  const setFont = (fontId: string) => {
    const template = selectedTemplate();
    const font = template.fonts.find((font) => font.id === fontId);
    if (font) {
      selectedFontId.value = fontId;
      return true;
    }
    return false;
  };

  const setLayout = (layoutId: string) => {
    const template = selectedTemplate();
    const layout = template.layouts.find((layout) => layout.id === layoutId);
    if (layout) {
      selectedLayoutId.value = layoutId;
      return true;
    }
    return false;
  };

  return {
    templates,
    selectedTemplateId,
    selectedColorSchemeId,
    selectedFontId,
    selectedLayoutId,
    selectedTemplate,
    selectedColorScheme,
    selectedFont,
    selectedLayout,
    setTemplate,
    setColorScheme,
    setFont,
    setLayout,
  };
});
