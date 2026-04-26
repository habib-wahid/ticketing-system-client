export interface ComplaintCategoryResponse {
  id: string;
  name: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

export interface ComplaintCategoryCreateRequest {
  name: string;
}

export interface ComplaintCategoryUpdateRequest {
  name: string;
}
