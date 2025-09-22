
import CrudOperations from '@/lib/crud-operations';
import { createSuccessResponse, createErrorResponse } from '@/lib/create-response';
import { requestMiddleware, parseQueryParams, validateRequestBody } from "@/lib/api-utils";

// GET request - fetch corrective actions
export const GET = requestMiddleware(async (request) => {
  const { limit, offset } = parseQueryParams(request);
  const searchParams = request.nextUrl.searchParams;
  
  const correctiveActionsCrud = new CrudOperations("corrective_actions");
  
  // Build filter conditions
  const filters: Record<string, any> = {};
  
  // Filter by nonconformance report ID if provided
  const reportId = searchParams.get("nonconformance_report_id");
  if (reportId) {
    filters.nonconformance_report_id = reportId;
  }
  
  // Filter by status if provided
  const status = searchParams.get("status");
  if (status) {
    filters.status = status;
  }

  const data = await correctiveActionsCrud.findMany(filters, { 
    limit, 
    offset,
    orderBy: { column: 'target_completion_date', direction: 'asc' }
  });
  
  return createSuccessResponse(data);
});

// POST request - create corrective action
export const POST = requestMiddleware(async (request) => {
  const body = await validateRequestBody(request);
  
  // Validate required fields
  const requiredFields = ['nonconformance_report_id', 'action_description', 'action_type'];
  for (const field of requiredFields) {
    if (!body[field]) {
      return createErrorResponse({
        errorMessage: `${field} is required`,
        status: 400,
      });
    }
  }
  
  const correctiveActionsCrud = new CrudOperations("corrective_actions");
  const data = await correctiveActionsCrud.create(body);
  
  return createSuccessResponse(data, 201);
});

// PUT request - update corrective action
export const PUT = requestMiddleware(async (request) => {
  const { id } = parseQueryParams(request);

  if (!id) {
    return createErrorResponse({
      errorMessage: "ID parameter is required",
      status: 400,
    });
  }
  
  const body = await validateRequestBody(request);
  const correctiveActionsCrud = new CrudOperations("corrective_actions");
  
  // Check if record exists
  const existing = await correctiveActionsCrud.findById(id);
  if (!existing) {
    return createErrorResponse({
      errorMessage: "Corrective action not found",
      status: 404,
    });
  }
  
  // Update modify_time
  body.modify_time = new Date().toISOString();
  
  const data = await correctiveActionsCrud.update(id, body);
  return createSuccessResponse(data);
});

// DELETE request - delete corrective action
export const DELETE = requestMiddleware(async (request) => {
  const { id } = parseQueryParams(request);
  
  if (!id) {
    return createErrorResponse({
      errorMessage: "ID parameter is required",
      status: 400,
    });
  }
  
  const correctiveActionsCrud = new CrudOperations("corrective_actions");
  
  // Check if record exists
  const existing = await correctiveActionsCrud.findById(id);
  if (!existing) {
    return createErrorResponse({
      errorMessage: "Corrective action not found",
      status: 404,
    });
  }
  
  const data = await correctiveActionsCrud.delete(id);
  return createSuccessResponse(data);
});
