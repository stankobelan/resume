# Resume Builder

A modern, feature-rich resume building application built with Vue.js and TypeScript.

## Overview

Resume Builder is a web application that helps users create professional resumes with ease. The application offers multiple templates, a user-friendly editor, and the ability to export resumes to various formats including PDF.

## Features

- **Document Management**: Create, save, and manage multiple resume documents
- **Template Selection**: Choose from various professionally designed resume templates
- **User-friendly Editor**: Intuitive interface for editing different resume sections:
  - Personal Information
  - Profile/Summary
  - Work Experience
  - Education
  - Skills
  - Languages
  - Hobbies
  - References
- **Live Preview**: Real-time preview of your resume as you edit
- **Export Options**: Export your resume to PDF and other formats
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

- **Frontend Framework**: Vue.js 3 with Composition API
- **Type System**: TypeScript
- **State Management**: Vuex/Pinia
- **UI Framework**: Vuetify 3
- **Routing**: Vue Router
- **Form Validation**: Vee-validate with Yup
- **Internationalization**: Vue-i18n
- **PDF Generation**: html2pdf.js
- **Testing**: Jest (Unit), Cypress (E2E)
- **Build Tools**: Vue CLI

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone [repository-url]

# Navigate to the project directory
cd resume

# Install dependencies
npm install
# or
yarn install
```

### Development

```bash
# Start development server
npm run serve
# or
yarn serve
```

### Building for Production

```bash
# Create production build
npm run build
# or
yarn build
```

### Testing

```bash
# Run unit tests
npm run test:unit
# or
yarn test:unit

# Run end-to-end tests
npm run test:e2e
# or
yarn test:e2e
```

## Project Structure

```
public/            # Static assets
src/
  assets/          # Images and static resources
  components/      # Vue components
    Documents/     # Document management components
    Editor/        # Resume editor components
    Export/        # Export functionality components
    Templates/     # Template selection and preview components
  router/          # Vue Router configuration
  store/           # Vuex/Pinia store modules
  types/           # TypeScript type definitions
  views/           # Main application views
  App.vue          # Root component
  main.ts          # Application entry point
tests/
  e2e/             # Cypress end-to-end tests
  unit/            # Jest unit tests
```

## License

MIT License

Copyright (c) <YEAR> <COPYRIGHT HOLDER>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Acknowledgments

- All contributors to this project
- Open source libraries used in this project
