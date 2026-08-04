# Ledgerly Insights

Ledgerly Frontend Prompt

Build a modular, production-style frontend for my personal finance application Ledgerly. The backend is already implemented using Node.js, Express, MongoDB, JWT authentication with HTTP-only cookies, and REST APIs. Your job is to build the entire client-side application and integrate it with my backend.

General Instructions

You may choose any frontend tech stack you think is best (React, Next.js, Vite, Tailwind, shadcn/ui, Zustand, React Query, Redux, etc.).

Optimize for clean architecture, maintainability, accessibility, and responsiveness.

Do not change my backend API contract.

If any backend response shape is unclear, ask me for the backend file instead of making assumptions.

The application should feel like a polished personal finance product, not a tutorial project.

Backend API Contract

Authentication / Users

Base URL: /api/users

POST /api/users/register

Body:

name

email

password

POST /api/users/login

Body:

email

password

POST /api/users/logout

GET /api/users/me

Returns the currently authenticated user.

Authentication uses HTTP-only cookies, so all authenticated requests must send credentials (credentials: 'include' or equivalent).

Transactions

Base URL: /api/transactions

All transaction routes require authentication.

GET /api/transactions

GET /api/transactions/:id

POST /api/transactions

PATCH /api/transactions/:id

DELETE /api/transactions/:id

Transaction fields:

title

note (optional)

amount

type (income or expense)

date

category

Expense categories:

Food

Groceries

Transportation

Shopping

Entertainment

Bills & Utilities

Healthcare

Education

Travel

Other

Income categories:

Salary

Freelance

Investments

Other

Currency

Base URL: /api/currency

PATCH /api/currency

Body:

currency (INR, USD, or EUR)

The user has a preferred currency. When it changes, every place in the UI displaying currency values or currency symbols must update immediately.

Authentication & Route Protection

On first load:

Call GET /api/users/me.

If authenticated:

Redirect to the dashboard.

If not authenticated:

Redirect to the login page.

By default, the application should open on Login or Register, never on the dashboard.

Protect all authenticated routes.

Prevent authenticated users from accessing Login/Register unnecessarily.

Required Pages

Public

Login

Register

Protected

Dashboard

Transactions

Add Transaction

Edit Transaction

Transaction Details

Profile / Settings

Currency Settings

Dashboard

Show:

Total balance

Total income

Total expenses

Recent transactions

Income vs expense summary

Category summary cards or charts

Use attractive charts if your chosen stack supports them.

Transactions

Include:

Search

Filter by:

type

category

date

Sort

Pagination if needed

Create

Edit

Delete

View details

Currency Handling

Support:

INR

USD

EUR

Changing the preferred currency must update:

Dashboard totals

Transaction list amounts

Detail pages

Charts/tooltips

Any currency text anywhere in the application

Theme

Implement a Dark / Light mode toggle.

Requirements:

Persist user preference (localStorage is acceptable)

Smooth transitions

Proper contrast

Theme-aware charts, cards, modals, and forms

Responsive Design

The application must be fully responsive.

Support:

Mobile

Tablet

Laptop

Desktop

Use:

Responsive navigation

Collapsible sidebar on smaller screens

Mobile-friendly tables/cards

Touch-friendly spacing

Modularity

Use a clean modular structure.

Example:

components

layouts

pages

routes

hooks

services/api

contexts or stores

utils

constants

validation

assets

Keep API logic separated from UI components.

Footer & Dummy Links

Create a professional footer with links such as:

About

Privacy Policy

Terms

Careers

Contact

Help

Documentation

Blog

These are UI-only dummy pages because this is a personal portfolio project.

Requirements:

Every footer link must be clickable.

Each dummy page must clearly state that it is a placeholder page created for a personal portfolio project.

Do not leave any broken links.

Do not leave any non-functional navigation elements.

Navigation

Every visible button should work.

If a feature is not backed by my API, create a dummy implementation that navigates to an appropriate placeholder page explaining that it is intentionally not implemented.

No dead buttons.

Error Handling

Implement:

Loading states

Empty states

Error states

Toast notifications

Form validation

Friendly authentication errors

Unauthorized handling

Session expiration handling

API Integration

Use a centralized API client.

Ensure:

Cookies are included with requests.

Authentication failures redirect properly.

Currency changes refresh relevant user data.

Optimistic UI where appropriate.

Deliverables

After generating the frontend, provide:

The exact frontend tech stack chosen.

The complete folder structure.

A short explanation of the architecture.

Any environment variables required.

Any backend assumptions made.

A list of files I should send if you need additional backend information.

Do not simplify this into a basic CRUD frontend. Build a polished, modular, responsive application that looks like a real fintech product while strictly using the backend API described above.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/96cf72c3-2b17-48de-888e-76aeab68d3ec).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
