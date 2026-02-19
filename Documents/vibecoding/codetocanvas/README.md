# Vibe Editor: Code-to-Canvas Bridge

> **Vibe Editor** is a bi-directional development tool that bridges the gap between visual design ("Vibedesign") and coding ("Vibecoding") using AI-powered transformations.

## 📚 Documentation Index

All project documentation is organized in the `docs/` directory following industry standards.

### 🎯 Product (Requirements & Vision)
*   **[Product Requirements (PRD)](docs/product/REQ-001-product-requirements.md)**:
    Defines the problem, user personas, functional requirements, and roadmap. **Start here.**

### 🛠 Engineering (Specs & Design)
*   **[Architecture Overview](docs/engineering/ENG-001-architecture-overview.md)**:
    High-level system design (Vibe Engine + Vibe Canvas).
*   **[AST Engine Spec](docs/engineering/ENG-002-ast-engine-spec.md)**:
    Technical design for the Node.js service that modifies source code via AST.
*   **[AI Integration Spec](docs/engineering/ENG-003-ai-integration-spec.md)**:
    Strategy for integrating Gemini CLI (Refactoring) and Stitch API (UI Gen).
*   **[Frontend Canvas Spec](docs/engineering/ENG-004-frontend-spec.md)**:
    UX/UI design for the editor overlay and interaction model.

### 🔬 Research
*   **[Feasibility Study](docs/research/RES-001-feasibility-study.md)**:
    Initial research on technical feasibility and workflow definition.

---

## 🚀 Getting Started (Planned)

1.  **Scaffold Target App**: `npx create-next-app target-app`
2.  **Start Vibe Engine**: `cd vibe-engine && npm start`
3.  **Launch Editor**: Open the Vibe Editor overlay.
