
-- Nonconformance Reports table
CREATE TABLE nonconformance_reports (
    id BIGSERIAL PRIMARY KEY,
    report_number VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255),
    job_site VARCHAR(255),
    date_occurred TIMESTAMP WITH TIME ZONE NOT NULL,
    date_reported TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    reported_by_user_id BIGINT NOT NULL,
    severity_level VARCHAR(20) NOT NULL CHECK (severity_level IN ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW')),
    category VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'IN_PROGRESS', 'PENDING_APPROVAL', 'CLOSED', 'CANCELLED')),
    immediate_action_taken TEXT,
    root_cause_analysis TEXT,
    personnel_involved TEXT,
    equipment_involved VARCHAR(255),
    material_batch_number VARCHAR(100),
    environmental_conditions TEXT,
    customer_notified BOOLEAN DEFAULT FALSE,
    customer_notification_date TIMESTAMP WITH TIME ZONE,
    assigned_to_user_id BIGINT,
    priority_score INTEGER DEFAULT 1 CHECK (priority_score BETWEEN 1 AND 10),
    estimated_cost DECIMAL(10,2),
    actual_cost DECIMAL(10,2),
    approved_by_user_id BIGINT,
    approved_at TIMESTAMP WITH TIME ZONE,
    closed_by_user_id BIGINT,
    closed_at TIMESTAMP WITH TIME ZONE,
    closure_notes TEXT,
    create_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    modify_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Corrective Actions table
CREATE TABLE corrective_actions (
    id BIGSERIAL PRIMARY KEY,
    nonconformance_report_id BIGINT NOT NULL,
    action_description TEXT NOT NULL,
    action_type VARCHAR(50) NOT NULL CHECK (action_type IN ('IMMEDIATE', 'CORRECTIVE', 'PREVENTIVE')),
    responsible_user_id BIGINT,
    target_completion_date DATE,
    actual_completion_date DATE,
    status VARCHAR(20) DEFAULT 'PLANNED' CHECK (status IN ('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE', 'CANCELLED')),
    effectiveness_verified BOOLEAN DEFAULT FALSE,
    verification_date TIMESTAMP WITH TIME ZONE,
    verification_notes TEXT,
    cost_estimate DECIMAL(10,2),
    actual_cost DECIMAL(10,2),
    create_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    modify_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Attachments table for photos and documents
CREATE TABLE nonconformance_attachments (
    id BIGSERIAL PRIMARY KEY,
    nonconformance_report_id BIGINT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_size INTEGER,
    description TEXT,
    uploaded_by_user_id BIGINT NOT NULL,
    create_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    modify_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Comments/Notes table for tracking communication
CREATE TABLE nonconformance_comments (
    id BIGSERIAL PRIMARY KEY,
    nonconformance_report_id BIGINT NOT NULL,
    comment_text TEXT NOT NULL,
    comment_type VARCHAR(20) DEFAULT 'GENERAL' CHECK (comment_type IN ('GENERAL', 'STATUS_UPDATE', 'APPROVAL', 'REJECTION')),
    created_by_user_id BIGINT NOT NULL,
    is_internal BOOLEAN DEFAULT TRUE,
    create_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    modify_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Categories lookup table
CREATE TABLE nonconformance_categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    create_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    modify_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Follow-up tasks table
CREATE TABLE nonconformance_followups (
    id BIGSERIAL PRIMARY KEY,
    nonconformance_report_id BIGINT NOT NULL,
    task_description TEXT NOT NULL,
    due_date DATE NOT NULL,
    assigned_to_user_id BIGINT,
    completed BOOLEAN DEFAULT FALSE,
    completion_date TIMESTAMP WITH TIME ZONE,
    completion_notes TEXT,
    create_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    modify_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_nonconformance_reports_status ON nonconformance_reports(status);
CREATE INDEX idx_nonconformance_reports_severity ON nonconformance_reports(severity_level);
CREATE INDEX idx_nonconformance_reports_reported_by ON nonconformance_reports(reported_by_user_id);
CREATE INDEX idx_nonconformance_reports_assigned_to ON nonconformance_reports(assigned_to_user_id);
CREATE INDEX idx_nonconformance_reports_date_occurred ON nonconformance_reports(date_occurred);
CREATE INDEX idx_corrective_actions_report_id ON corrective_actions(nonconformance_report_id);
CREATE INDEX idx_corrective_actions_responsible ON corrective_actions(responsible_user_id);
CREATE INDEX idx_nonconformance_attachments_report_id ON nonconformance_attachments(nonconformance_report_id);
CREATE INDEX idx_nonconformance_comments_report_id ON nonconformance_comments(nonconformance_report_id);
CREATE INDEX idx_nonconformance_followups_report_id ON nonconformance_followups(nonconformance_report_id);

-- Insert sample categories
INSERT INTO nonconformance_categories (name, description) VALUES
('Material Defect', 'Issues with Rhino Linings materials or products'),
('Application Error', 'Problems during spray application process'),
('Equipment Failure', 'Spray equipment or tool malfunctions'),
('Safety Violation', 'Safety protocol breaches or incidents'),
('Process Deviation', 'Deviation from standard operating procedures'),
('Quality Control', 'Issues identified during quality inspections'),
('Customer Complaint', 'Issues reported by customers'),
('Environmental', 'Environmental compliance or impact issues'),
('Documentation', 'Missing or incorrect documentation'),
('Training', 'Training-related deficiencies');

-- Insert sample nonconformance reports
INSERT INTO nonconformance_reports (
    report_number, title, description, location, job_site, date_occurred, 
    reported_by_user_id, severity_level, category, immediate_action_taken,
    personnel_involved, equipment_involved
) VALUES
('NCR-2024-001', 'Uneven Spray Pattern on Truck Bed', 'Customer truck bed liner shows uneven spray pattern with thin spots in corners', 'Bay 2', 'Main Shop Floor', '2024-01-15 14:30:00+00', 1, 'MEDIUM', 'Application Error', 'Stopped work, isolated affected area', 'Tech: John Smith, QC: Mike Johnson', 'Graco Reactor E-30'),
('NCR-2024-002', 'Material Contamination Detected', 'Foreign particles found in polyurea material batch PU-240115', 'Material Storage', 'Warehouse', '2024-01-16 09:15:00+00', 1, 'HIGH', 'Material Defect', 'Quarantined entire batch, switched to backup material', 'QC Inspector: Sarah Davis', 'Batch PU-240115'),
('NCR-2024-003', 'Safety Equipment Not Worn', 'Technician observed working without proper respiratory protection', 'Bay 1', 'Main Shop Floor', '2024-01-17 11:45:00+00', 1, 'CRITICAL', 'Safety Violation', 'Work stopped immediately, technician sent for retraining', 'Tech: Robert Wilson, Supervisor: Tom Brown', 'N/A'),
('NCR-2024-004', 'Spray Gun Pressure Fluctuation', 'Inconsistent pressure readings causing application quality issues', 'Bay 3', 'Main Shop Floor', '2024-01-18 13:20:00+00', 1, 'MEDIUM', 'Equipment Failure', 'Switched to backup spray gun, scheduled equipment maintenance', 'Tech: Lisa Anderson', 'Graco Fusion AP Gun'),
('NCR-2024-005', 'Customer Complaint - Peeling Liner', 'Customer reports liner peeling after 2 weeks of installation', 'Customer Site', 'ABC Construction - Fleet Vehicle', '2024-01-19 16:00:00+00', 1, 'HIGH', 'Customer Complaint', 'Scheduled immediate site visit and assessment', 'Service Tech: Mark Thompson', 'Job #2024-0105');

-- Insert sample corrective actions
INSERT INTO corrective_actions (
    nonconformance_report_id, action_description, action_type, 
    responsible_user_id, target_completion_date, status
) VALUES
(1, 'Retrain technician on proper spray technique for corners and edges', 'CORRECTIVE', 1, '2024-01-22', 'PLANNED'),
(1, 'Implement corner spray pattern checklist', 'PREVENTIVE', 1, '2024-01-25', 'PLANNED'),
(2, 'Investigate material supplier quality control processes', 'CORRECTIVE', 1, '2024-01-20', 'IN_PROGRESS'),
(2, 'Implement incoming material inspection protocol', 'PREVENTIVE', 1, '2024-01-30', 'PLANNED'),
(3, 'Mandatory safety refresher training for all technicians', 'CORRECTIVE', 1, '2024-01-24', 'IN_PROGRESS'),
(3, 'Install additional safety reminder signage', 'PREVENTIVE', 1, '2024-01-26', 'PLANNED'),
(4, 'Complete maintenance on spray gun pressure system', 'IMMEDIATE', 1, '2024-01-19', 'COMPLETED'),
(4, 'Implement daily equipment pressure checks', 'PREVENTIVE', 1, '2024-01-22', 'PLANNED');

-- Insert sample comments
INSERT INTO nonconformance_comments (
    nonconformance_report_id, comment_text, comment_type, created_by_user_id
) VALUES
(1, 'Initial assessment completed. Root cause appears to be inadequate training on corner application techniques.', 'GENERAL', 1),
(2, 'Contacted supplier - they are investigating their batch control processes.', 'STATUS_UPDATE', 1),
(3, 'This is the second safety violation this month. Need to review overall safety culture.', 'GENERAL', 1),
(4, 'Equipment maintenance completed. Pressure system now operating within specifications.', 'STATUS_UPDATE', 1),
(5, 'Customer site visit scheduled for tomorrow morning. Will assess extent of peeling.', 'STATUS_UPDATE', 1);

-- Insert sample follow-up tasks
INSERT INTO nonconformance_followups (
    nonconformance_report_id, task_description, due_date, assigned_to_user_id
) VALUES
(1, 'Verify technician completed retraining and demonstrate proper corner technique', '2024-01-25', 1),
(2, 'Review supplier response and update material inspection procedures', '2024-02-01', 1),
(3, 'Conduct safety culture assessment and develop improvement plan', '2024-02-15', 1),
(4, 'Monitor equipment performance for one week post-maintenance', '2024-01-26', 1),
(5, 'Complete customer site assessment and provide resolution plan', '2024-01-22', 1);
