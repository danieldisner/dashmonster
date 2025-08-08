# Copilot Instructions for Dashmonster Admin Panel

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview

This project is a modern, responsive admin panel built with Next.js, TypeScript, and Tailwind CSS. It is designed to manage multiple applications or system modules via a clean and flexible dashboard interface.

## Architecture Guidelines

- Use the Next.js App Router (`app/`) architecture
- Follow Domain-Driven Design (DDD) for code organization (where applicable)
- Use strict TypeScript typing across the entire codebase
- Use Zustand for global state management
- Use React Hook Form + Zod for form handling and validation
- Use Framer Motion for animations and transitions
- Structure the layout and components for mobile-first responsiveness

## Key Features

- User authentication and role-based access control (RBAC)
- Dynamic menu system based on permissions
- Dashboard with real-time or static widgets (cards, charts, metrics, etc.)
- Resource management pages (CRUD: users, roles, permissions, apps/modules, etc.)
- Theme switcher (light/dark mode)
- Notification system (toasts, alerts)
- Fully responsive and accessible design

## Code Standards

- Use TypeScript in strict mode
- Implement error boundaries where needed
- Follow Tailwind CSS utility-first styling
- Use consistent naming conventions for files, variables, and components
- Create reusable UI components under the `components/` directory
- Group feature-specific logic under the `features/` directory
- Use loading and empty states appropriately in UI

## Data Layer Strategy

- Use mock APIs via `localStorage` during frontend development
- Simulate full CRUD behavior with mocked services
- Implement all fake data generation via seed scripts only
- Avoid hardcoded/mock data directly in components
- Abstract all localStorage operations inside services
- Define all data models via TypeScript interfaces or types

## UI/UX Requirements

- Clean, modern interface with high contrast and good visual hierarchy
- Smooth page transitions and UI feedback (animations, loading states)
- Responsive layout for both mobile and desktop devices
- Theme toggle support (light/dark)
- Accessible, keyboard-navigable components
- Avoid use of modals for full-page workflows; prefer page-based or inline UI flows

