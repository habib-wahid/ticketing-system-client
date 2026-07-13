export interface CategoryDistributorMappingResponse {
  id: string;
  categoryId: string;
  categoryName: string;
  distributorUserId: string;
  distributorName: string;
  active: boolean;
  createdBy: string | null;
  createdAt: string | null;
  updatedBy: string | null;
  updatedAt: string | null;
}

export interface CategoryDistributorMappingCreateRequest {
  categoryId: string;
  distributorUserId: string;
  active?: boolean;
}

export interface CategoryDistributorMappingUpdateRequest {
  distributorUserId?: string;
  active?: boolean;
}
