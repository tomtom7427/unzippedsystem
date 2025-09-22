
import CrudOperations from '@/lib/crud-operations';
import { createSuccessResponse, createErrorResponse } from '@/lib/create-response';
import { requestMiddleware, parseQueryParams, validateRequestBody } from "@/lib/api-utils";

// GET request - fetch nonconformance categories
export const GET = requestMiddleware(async (request) => {
  const { limit, offset } = parseQueryParams(request);
  
  const categoriesCrud = new CrudOperations("nonconformance_categories");
  
  // Only fetch active categories by default
  const filters = { is_active: true };
  
  const data = await categoriesCrud.findMany(filters, { 
    limit, 
    offset,
    orderBy: { column: 'name', direction: 'asc' }
  });
  
  return createSuccessResponse(data);
});

// POST request - create category
export const POST = requestMiddleware(async (request) => {
  const body = await validateRequestBody(request);
  
  // Validate required fields
  if (!body.name) {
    return createErrorResponse({
      errorMessage: "Name is required",
      status: 400,
    });
  }
  
  const categoriesCrud = new CrudOperations("nonconformance_categories");
  const data = await categoriesCrud.create(body);
  
  return createSuccessResponse(data, 201);
});

// PUT request - update category
export const PUT = requestMiddleware(async (request) => {
  const { id } = parseQueryParams(request);

  if (!id) {
    return createErrorResponse({
      errorMessage: "ID parameter is required",
      status: 400,
    });
  }
  
  const body = await validateRequestBody(request);
  const categoriesCrud = new CrudOperations("nonconformance_categories");
  
  // Check if record exists
  const existing = await categoriesCrud.findById(id);
  if (!existing) {
    return createErrorResponse({
      errorMessage: "Category not found",
      status: 404,
    });
  }
  
  // Update modify_time
  body.modify_time = new Date().toISOString();
  
  const data = await categoriesCrud.update(id, body);
  return createSuccessResponse(data);
});

// DELETE request - delete category (soft delete by setting is_active to false)
export const DELETE = requestMiddleware(async (request) => {
  const { id } = parseQueryParams(request);
  
  if (!id) {
    return createErrorResponse({
      errorMessage: "ID parameter is required",
      status: 400,
    });
  }
  
  const categoriesCrud = new CrudOperations("nonconformance_categories");
  
  // Check if record exists
  const existing = await categoriesCrud.findById(id);
  if (!existing) {
    return createErrorResponse({
      errorMessage: "Category not found",
      status: 404,
    });
  }
  
  // Soft delete by setting is_active to false
  const data = await categoriesCrud.update(id, { 
    is_active: false,
    modify_time: new Date().toISOString()
  });
  
  return createSuccessResponse(data);
});
