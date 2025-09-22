
import CrudOperations from '@/lib/crud-operations';
import { createSuccessResponse, createErrorResponse } from '@/lib/create-response';
import { requestMiddleware, parseQueryParams, validateRequestBody } from "@/lib/api-utils";

// GET request - fetch nonconformance reports
export const GET = requestMiddleware(async (request) => {
  const { limit, offset, search } = parseQueryParams(request);
  const searchParams = request.nextUrl.searchParams;
  
  const nonconformanceReportsCrud = new CrudOperations("nonconformance_reports");
  
  // Build filter conditions
  const filters: Record<string, any> = {};
  
  // Filter by status if provided
  const status = searchParams.get("status");
  if (status) {
    filters.status = status;
  }
  
  // Filter by severity if provided
  const severity = searchParams.get("severity");
  if (severity) {
    filters.severity_level = severity;
  }
  
  // Filter by category if provided
  const category = searchParams.get("category");
  if (category) {
    filters.category = category;
  }

  const data = await nonconformanceReportsCrud.findMany(filters, { 
    limit, 
    offset,
    orderBy: { column: 'date_occurred', direction: 'desc' }
  });
  
  return createSuccessResponse(data);
});

// POST request - create nonconformance report
export const POST = requestMiddleware(async (request) => {
  const body = await validateRequestBody(request);
  
  // Validate required fields
  const requiredFields = ['title', 'description', 'date_occurred', 'reported_by_user_id', 'severity_level', 'category'];
  for (const field of requiredFields) {
    if (!body[field]) {
      return createErrorResponse({
        errorMessage: `${field} is required`,
        status: 400,
      });
    }
  }
  
  // Generate report number if not provided
  if (!body.report_number) {
    const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
    const randomSuffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    body.report_number = `NCR-${timestamp}-${randomSuffix}`;
  }
  
  // Ensure proper data types
  const processedBody = {
    ...body,
    reported_by_user_id: parseInt(body.reported_by_user_id),
    priority_score: parseInt(body.priority_score || 5),
    customer_notified: Boolean(body.customer_notified),
    estimated_cost: body.estimated_cost ? parseFloat(body.estimated_cost) : null,
  };
  
  const nonconformanceReportsCrud = new CrudOperations("nonconformance_reports");
  const data = await nonconformanceReportsCrud.create(processedBody);
  
  return createSuccessResponse(data, 201);
});

// PUT request - update nonconformance report
export const PUT = requestMiddleware(async (request) => {
  const { id } = parseQueryParams(request);

  if (!id) {
    return createErrorResponse({
      errorMessage: "ID parameter is required",
      status: 400,
    });
  }
  
  const body = await validateRequestBody(request);
  const nonconformanceReportsCrud = new CrudOperations("nonconformance_reports");
  
  // Check if record exists
  const existing = await nonconformanceReportsCrud.findById(id);
  if (!existing) {
    return createErrorResponse({
      errorMessage: "Nonconformance report not found",
      status: 404,
    });
  }
  
  // Process data types
  const processedBody = {
    ...body,
    modify_time: new Date().toISOString(),
  };
  
  // Convert numeric fields if they exist
  if (body.reported_by_user_id) {
    processedBody.reported_by_user_id = parseInt(body.reported_by_user_id);
  }
  if (body.priority_score) {
    processedBody.priority_score = parseInt(body.priority_score);
  }
  if (body.customer_notified !== undefined) {
    processedBody.customer_notified = Boolean(body.customer_notified);
  }
  if (body.estimated_cost) {
    processedBody.estimated_cost = parseFloat(body.estimated_cost);
  }
  
  const data = await nonconformanceReportsCrud.update(id, processedBody);
  return createSuccessResponse(data);
});

// DELETE request - delete nonconformance report
export const DELETE = requestMiddleware(async (request) => {
  const { id } = parseQueryParams(request);
  
  if (!id) {
    return createErrorResponse({
      errorMessage: "ID parameter is required",
      status: 400,
    });
  }
  
  const nonconformanceReportsCrud = new CrudOperations("nonconformance_reports");
  
  // Check if record exists
  const existing = await nonconformanceReportsCrud.findById(id);
  if (!existing) {
    return createErrorResponse({
      errorMessage: "Nonconformance report not found",
      status: 404,
    });
  }
  
  const data = await nonconformanceReportsCrud.delete(id);
  return createSuccessResponse(data);
});
