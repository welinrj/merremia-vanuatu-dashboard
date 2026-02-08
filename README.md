# Merremia Vanuatu Dashboard

Invasive vine species monitoring dashboard for Vanuatu.

Created by **Vanuatu Spatial Solutions** for **DEPC** & **NBSAP**.

## Components

- **[Dashboard](https://welinrj.github.io/merremia-vanuatu-dashboard/)** — Main monitoring dashboard with tabs (Dashboard, Methodology, Data Sources, Intent)
- **[Live Dashboard](https://welinrj.github.io/merremia-vanuatu-dashboard/dashboard-live.html)** — Real-time view of field-collected data
- **[Field Collector](https://welinrj.github.io/merremia-vanuatu-dashboard/field-collector/)** — Mobile PWA for rangers to collect data in the field (works offline)

## Data Pipeline

Field Collector (PWA) → GitHub API → merremia-field-data repo → Merremia Connector → Live Dashboard
