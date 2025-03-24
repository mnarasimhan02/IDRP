# AI-Assisted Intelligent Data Review Plan (IDRP) Application

This application is designed for clinical data managers to facilitate efficient data review by leveraging AI-driven recommendations, collaborative workflows, and modern UI components.

## Key Features

### Workflow Management
- **4-Status Workflow Implementation**:
  - Draft → In-Review → Reviewed → Approved
  - Status-specific permissions:
    - **Draft**: Add, modify, or delete checks
    - **In-Review**: Add comments only, no check modifications
    - **Reviewed**: Add or modify checks
    - **Approved**: Only inactivate checks (version is finalized)
  - Status change dialog with confirmation
  - Status changes recorded in IDRP history

- **Version Control**:
  - Automatic version increment when an IDRP is approved
  - Major version numbers (1.0, 2.0, etc.) only for approved IDRPs
  - Version history maintained in the IDRP history tab

### Collaboration and Comments
- **Threaded Discussions**:
  - General (IDRP-level) and check-specific comments
  - Check-specific comments grouped by check
  - Reply functionality for threaded discussions

- **Comment Features**:
  - User and role tracking with color-coded avatars
  - Timestamps for all comments
  - Comment counts and notifications
  - Comment dialog accessible directly from check list

### Check Management
- **Check Operations**:
  - Add new checks (Draft or Reviewed status)
  - Edit existing checks (Draft or Reviewed status)
  - Delete checks (Draft or Reviewed status)
  - Inactivate checks (Approved status)

- **Standardized Check Structure**:
  - Check ID (auto-generated)
  - Check Type (DQ, IRL, Dashboard)
  - Check Category (Safety, Efficacy, etc.)
  - Data Category (Subject, Safety, etc.)
  - Visit (All, Screening, Baseline, etc.)
  - Description
  - Query Text
  - Roles Involved (multi-select)
  - Frequency (Daily, Weekly, etc.)
  - Source (Library, Similar Study, Custom)

### UI/UX Features
- **Dashboard**:
  - Status summary cards for all four statuses
  - IDRP listing with status indicators
  - Edit button (disabled for In-Review status)
  - Real-time updates when IDRPs are modified

- **IDRP Detail View**:
  - Tabs for Overview, Checks, History, and Comments
  - Status change button that updates based on current status
  - Check table with inline actions
  - Comment section with threaded discussions

### Data Management
- **LocalStorage Integration**:
  - Persistent storage of all IDRPs
  - Proper handling of adding new IDRPs and updating existing ones
  - Error handling for localStorage operations

- **Event-Based Updates**:
  - Custom events for real-time updates across components
  - Dashboard listens for events to refresh data
  - No page refresh needed for updates

## Role-Based Collaboration
- **Data Managers** (Primary Owners)
- **Medical Monitors** (Clinical relevance)
- **Safety Reviewers** (Safety data compliance)
- **Study Managers** (Oversight and approvals)

## Technology Stack

- React
- Material UI
- React Router
- LocalStorage for data persistence
- Custom event system for real-time updates

## Getting Started

1. Clone this repository
2. Install dependencies: `npm install`
3. Start the development server: `npm start`
4. Open [http://localhost:3000](http://localhost:3000) to view it in your browser

## Project Structure

- `/src`: Source code
  - `/components`: Reusable UI components
  - `/pages`: Main application pages
    - `Dashboard.js`: Main dashboard with IDRP status overview
    - `IDRPDetail.js`: Detailed view of individual IDRPs
  - `/assets`: Images and static assets
  - `/theme`: Material UI theme customization

## Future Enhancements
- AI-driven check recommendations
- Enhanced filtering and sorting of checks
- User authentication and role-based access control
- Integration with external systems
- Advanced reporting capabilities
- Real-time collaboration features
- Email notifications for comments and status changes

## Contact

For more information about this project, please contact Mahesh N.
