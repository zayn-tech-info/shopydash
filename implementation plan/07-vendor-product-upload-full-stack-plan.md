# Vendor Product Upload - Full Stack Implementation Plan

## 1. Overview
This plan outlines the implementation of the vendor product upload feature, covering the frontend form data, backend schema, and controller logic.

## 2. Data Input (Frontend Form)
The vendor will input the following data via a form on the frontend:

| Field | Type | UI Component | Validation |
| :--- | :--- | :--- | :--- |
| **Title** | String | Text Input | Required, Min 3 chars |
| **Description** | String | Text Area | Required, Min 10 chars |
| **Price** | Number | Number Input | Required, Non-negative |
| **Category** | String | Dropdown Select | Required, One of predefined list |
| **Condition** | String | Dropdown Select | Required (New, Like New, etc.) |
| **Stock** | Number | Number Input | Required, Integer, >= 0 |
| **Images** | File[] | File Upload (Drag & Drop) | Required (1-5 images), Max 5MB each |
| **School** | String | Text Input (Auto-filled) | Required (Can be editable) |
| **Location** | String | Text Input | Required (e.g., "North Gate") |
| **Tags** | String[] | Tag Input | Optional, Max 10 tags |

**Note**: `School` should ideally be auto-filled from the logged-in vendor's profile to ensure consistency, but can be editable if they sell across campuses.

## 3. Backend Schema (`vendorProduct.js`)
The existing schema in `backend/models/vendorProduct.js` is well-structured and ready for use. Key fields include:

- `vendorId`: Reference to User (Vendor).
- `title`, `description`, `price`: Basic details.
- `category`: Enum (Electronics, Fashion, etc.).
- `images`: Array of strings (URLs).
- `school`, `location`: Location details.
- `stock`, `isInStock`: Inventory management.
- `condition`: Enum.
- `tags`: Array of strings.

## 4. Controller Flow & Logic

### A. Image Upload Handling
Since products require images, we need a strategy to handle file uploads.
**Strategy**: Two-step process.
1.  **Upload Endpoint**: Frontend uploads images to a dedicated endpoint (e.g., `/api/v1/upload`).
2.  **Response**: Backend saves files (locally or Cloudinary) and returns URLs.
3.  **Product Creation**: Frontend sends these URLs along with other product data to the create product endpoint.

**Controller: `upload.controller.js`** (New)
- Use `multer` for handling `multipart/form-data`.
- Validate file types (images only) and size.
- Save files to `backend/uploads` (for dev) or Cloudinary (for prod).
- Return array of file URLs.

### B. Product Creation Controller
**Controller: `vendorProduct.controller.js`** (New)
**Function: `createProduct`**

1.  **Authentication**: Verify user is logged in and has role `vendor`.
2.  **Input Validation**: Check if all required fields are present and valid.
3.  **Data Preparation**:
    - Set `vendorId` from `req.user._id`.
    - Sanitize inputs.
4.  **Database Operation**:
    - Create new `Product` document.
    - Save to database.
5.  **Profile Update**:
    - Find `VendorProfile` for the user.
    - Push the new product's `_id` to the `products` array in `VendorProfile`.
    - Save `VendorProfile`.
6.  **Response**: Return 201 Created with the new product data.

## 5. Implementation Steps

### Phase 1: Backend Setup
1.  **Install Dependencies**: `multer` (for file uploads).
2.  **Create Upload Controller**: Implement `upload.controller.js` to handle image uploads.
3.  **Create Product Controller**: Implement `vendorProduct.controller.js` with `createProduct`, `getMyProducts`, `updateProduct`, `deleteProduct`.
4.  **Define Routes**: Create `vendorProduct.route.js` and mount it in `app.js`.

### Phase 2: Frontend Integration
1.  **API Service**: Add functions to `api.js` (or similar) for `uploadImage` and `createProduct`.
2.  **Create Component**: `VendorProductUpload.jsx`.
    - Implement form layout using Tailwind CSS.
    - Integrate `react-dropzone` or simple file input for images.
    - Handle form state and validation.
    - Call `uploadImage` API first, get URLs, then call `createProduct` API.
3.  **Route**: Add route `/vendor/upload` (or similar) in frontend router.

## 6. Example Request Payload (Create Product)

```json
{
  "title": "iPhone 13 Pro",
  "description": "Barely used, battery health 95%",
  "price": 450000,
  "category": "Electronics",
  "condition": "Like New",
  "stock": 1,
  "school": "UNILAG",
  "location": "Moremi Hall",
  "images": [
    "/uploads/image-123.jpg",
    "/uploads/image-456.jpg"
  ],
  "tags": ["iphone", "apple", "phone"]
}
```
