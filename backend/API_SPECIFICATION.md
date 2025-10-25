# API Specification

## Database Models

```prisma
model User {
  id              Int      @id @default(autoincrement())
  email           String   @unique
  name            String?
  password        String
  role            String   @default("USER")
  isEmailVerified Boolean  @default(false)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  tokens          Token[]
  guarantorSubmissions GuarantorSubmission[]
}

model Token {
  id          Int       @id @default(autoincrement())
  token       String
  type        String
  expires     DateTime
  blacklisted Boolean
  createdAt   DateTime  @default(now())
  user        User      @relation(fields: [userId], references: [id])
  userId      Int
}

model GuarantorSubmission {
  id                         String      @id @default(uuid())
  guarantorName             String
  relationshipToBorrower    String
  streetAddress             String
  city                      String
  state                     String
  zip                       String
  dateOfBirth               DateTime
  occupation                String
  employerOrBusiness        String
  linkedinProfile           String?
  companyRegistrationNumber String?
  knownAssociations         String[]
  comments                  String
  submissionTimestamp       DateTime    @default(now())
  recordStatus              String      @default("pending_verification")
  lastUpdated               DateTime    @updatedAt
  submittedBy               User        @relation(fields: [submittedById], references: [id])
  submittedById             Int
  attachments               Attachment[]
}

model Attachment {
  id                    String              @id @default(uuid())
  filename              String
  fileType              String
  fileSize              Int
  uploadedAt            DateTime            @default(now())
  url                   String?
  guarantorSubmission   GuarantorSubmission @relation(fields: [guarantorSubmissionId], references: [id])
  guarantorSubmissionId String
}
```

## Authentication Endpoints

EP: POST /auth/register
DESC: Register a new user account.
IN: body:{name:str!, email:str!, password:str!}
OUT: 201:{user:{id:int, email:str, name:str, role:str, isEmailVerified:bool, createdAt:str, updatedAt:str}, tokens:{access:{token:str, expires:str}, refresh:{token:str, expires:str}}}
ERR: {"400":"Email already exists", "422":"Invalid input data", "500":"Internal server error"}
EX_REQ: curl -X POST /auth/register -H "Content-Type: application/json" -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
EX_RES_201: {"user":{"id":1,"email":"john@example.com","name":"John Doe","role":"USER","isEmailVerified":false,"createdAt":"2025-10-25T10:30:00Z","updatedAt":"2025-10-25T10:30:00Z"},"tokens":{"access":{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...","expires":"2025-10-25T11:30:00Z"},"refresh":{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...","expires":"2025-11-01T10:30:00Z"}}}

---

EP: POST /auth/login
DESC: Authenticate user and return tokens.
IN: body:{email:str!, password:str!}
OUT: 200:{user:{id:int, email:str, name:str, role:str, isEmailVerified:bool, createdAt:str, updatedAt:str}, tokens:{access:{token:str, expires:str}, refresh:{token:str, expires:str}}}
ERR: {"401":"Invalid email or password", "422":"Invalid input data", "500":"Internal server error"}
EX_REQ: curl -X POST /auth/login -H "Content-Type: application/json" -d '{"email":"john@example.com","password":"password123"}'
EX_RES_200: {"user":{"id":1,"email":"john@example.com","name":"John Doe","role":"USER","isEmailVerified":false,"createdAt":"2025-10-25T10:30:00Z","updatedAt":"2025-10-25T10:30:00Z"},"tokens":{"access":{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...","expires":"2025-10-25T11:30:00Z"},"refresh":{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...","expires":"2025-11-01T10:30:00Z"}}}

---

EP: POST /auth/logout
DESC: Logout user and blacklist refresh token.
IN: body:{refreshToken:str!}
OUT: 204:{}
ERR: {"404":"Token not found", "500":"Internal server error"}
EX_REQ: curl -X POST /auth/logout -H "Content-Type: application/json" -d '{"refreshToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}'
EX_RES_204: {}

---

EP: POST /auth/refresh-tokens
DESC: Refresh access and refresh tokens.
IN: body:{refreshToken:str!}
OUT: 200:{access:{token:str, expires:str}, refresh:{token:str, expires:str}}
ERR: {"401":"Invalid refresh token", "500":"Internal server error"}
EX_REQ: curl -X POST /auth/refresh-tokens -H "Content-Type: application/json" -d '{"refreshToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}'
EX_RES_200: {"access":{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...","expires":"2025-10-25T11:30:00Z"},"refresh":{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...","expires":"2025-11-01T10:30:00Z"}}

---

EP: POST /auth/forgot-password
DESC: Send password reset email to user.
IN: body:{email:str!}
OUT: 204:{}
ERR: {"404":"User not found", "500":"Internal server error"}
EX_REQ: curl -X POST /auth/forgot-password -H "Content-Type: application/json" -d '{"email":"john@example.com"}'
EX_RES_204: {}

---

EP: POST /auth/reset-password
DESC: Reset user password using reset token.
IN: query:{token:str!}, body:{password:str!}
OUT: 204:{}
ERR: {"401":"Invalid or expired token", "422":"Invalid password", "500":"Internal server error"}
EX_REQ: curl -X POST "/auth/reset-password?token=reset_token_here" -H "Content-Type: application/json" -d '{"password":"newpassword123"}'
EX_RES_204: {}

---

EP: POST /auth/send-verification-email
DESC: Send email verification to authenticated user.
IN: headers:{Authorization:str!}
OUT: 204:{}
ERR: {"401":"Unauthorized", "500":"Internal server error"}
EX_REQ: curl -X POST /auth/send-verification-email -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
EX_RES_204: {}

---

EP: POST /auth/verify-email
DESC: Verify user email using verification token.
IN: query:{token:str!}
OUT: 204:{}
ERR: {"401":"Invalid or expired token", "500":"Internal server error"}
EX_REQ: curl -X POST "/auth/verify-email?token=verify_token_here"
EX_RES_204: {}

## Guarantor Management Endpoints

EP: POST /api/guarantor/submit
DESC: Submit new guarantor information.
IN: headers:{Authorization:str!}, body:{guarantor_name:str!, relationship_to_borrower:str!, address:{street:str!, city:str!, state:str!, zip:str!}, date_of_birth:str!, occupation:str!, employer_or_business:str!, linkedin_profile:str, company_registration_number:str, known_associations:arr[str]!, comments:str!}
OUT: 201:{id:str, guarantor_name:str, relationship_to_borrower:str, address:{street:str, city:str, state:str, zip:str}, date_of_birth:str, occupation:str, employer_or_business:str, linkedin_profile:str, company_registration_number:str, known_associations:arr[str], comments:str, attachments:arr[obj], submission_timestamp:str, submitted_by:str, record_status:str, last_updated:str}
ERR: {"400":"Invalid input data", "401":"Unauthorized", "422":"Validation failed", "500":"Internal server error"}
EX_REQ: curl -X POST /api/guarantor/submit -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." -H "Content-Type: application/json" -d '{"guarantor_name":"John Smith","relationship_to_borrower":"Business partner","address":{"street":"123 Main St","city":"New York","state":"NY","zip":"10001"},"date_of_birth":"1980-01-01","occupation":"Engineer","employer_or_business":"Tech Corp","linkedin_profile":"https://linkedin.com/in/johnsmith","company_registration_number":"","known_associations":["Tech Association"],"comments":"Reliable guarantor"}'
EX_RES_201: {"id":"g123","guarantor_name":"John Smith","relationship_to_borrower":"Business partner","address":{"street":"123 Main St","city":"New York","state":"NY","zip":"10001"},"date_of_birth":"1980-01-01","occupation":"Engineer","employer_or_business":"Tech Corp","linkedin_profile":"https://linkedin.com/in/johnsmith","company_registration_number":"","known_associations":["Tech Association"],"comments":"Reliable guarantor","attachments":[],"submission_timestamp":"2025-10-25T10:30:00Z","submitted_by":"CurrentUser","record_status":"pending_verification","last_updated":"2025-10-25T10:30:00Z"}

---

EP: PUT /api/guarantor/:id
DESC: Update existing guarantor information.
IN: params:{id:str!}, headers:{Authorization:str!}, body:{guarantor_name:str, relationship_to_borrower:str, address:{street:str, city:str, state:str, zip:str}, date_of_birth:str, occupation:str, employer_or_business:str, linkedin_profile:str, company_registration_number:str, known_associations:arr[str], comments:str}
OUT: 200:{id:str, guarantor_name:str, relationship_to_borrower:str, address:{street:str, city:str, state:str, zip:str}, date_of_birth:str, occupation:str, employer_or_business:str, linkedin_profile:str, company_registration_number:str, known_associations:arr[str], comments:str, attachments:arr[obj], submission_timestamp:str, submitted_by:str, record_status:str, last_updated:str}
ERR: {"400":"Invalid input data", "401":"Unauthorized", "404":"Guarantor not found", "422":"Validation failed", "500":"Internal server error"}
EX_REQ: curl -X PUT /api/guarantor/g123 -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." -H "Content-Type: application/json" -d '{"comments":"Updated comments"}'
EX_RES_200: {"id":"g123","guarantor_name":"John Smith","relationship_to_borrower":"Business partner","address":{"street":"123 Main St","city":"New York","state":"NY","zip":"10001"},"date_of_birth":"1980-01-01","occupation":"Engineer","employer_or_business":"Tech Corp","linkedin_profile":"https://linkedin.com/in/johnsmith","company_registration_number":"","known_associations":["Tech Association"],"comments":"Updated comments","attachments":[],"submission_timestamp":"2025-10-25T10:30:00Z","submitted_by":"CurrentUser","record_status":"pending_verification","last_updated":"2025-10-25T10:35:00Z"}

---

EP: GET /api/guarantor/:id
DESC: Get guarantor submission by ID.
IN: params:{id:str!}, headers:{Authorization:str!}
OUT: 200:{id:str, guarantor_name:str, relationship_to_borrower:str, address:{street:str, city:str, state:str, zip:str}, date_of_birth:str, occupation:str, employer_or_business:str, linkedin_profile:str, company_registration_number:str, known_associations:arr[str], comments:str, attachments:arr[obj], submission_timestamp:str, submitted_by:str, record_status:str, last_updated:str}
ERR: {"401":"Unauthorized", "404":"Guarantor not found", "500":"Internal server error"}
EX_REQ: curl -X GET /api/guarantor/g123 -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
EX_RES_200: {"id":"g123","guarantor_name":"John Smith","relationship_to_borrower":"Business partner","address":{"street":"123 Main St","city":"New York","state":"NY","zip":"10001"},"date_of_birth":"1980-01-01","occupation":"Engineer","employer_or_business":"Tech Corp","linkedin_profile":"https://linkedin.com/in/johnsmith","company_registration_number":"","known_associations":["Tech Association"],"comments":"Reliable guarantor","attachments":[],"submission_timestamp":"2025-10-25T10:30:00Z","submitted_by":"CurrentUser","record_status":"pending_verification","last_updated":"2025-10-25T10:30:00Z"}

---

EP: GET /api/submissions/list
DESC: Get paginated list of guarantor submissions with filters.
IN: headers:{Authorization:str!}, query:{page:int, limit:int, search:str, status:str, submitted_by:str}
OUT: 200:{data:arr[obj], total:int, page:int, limit:int}
ERR: {"401":"Unauthorized", "422":"Invalid query parameters", "500":"Internal server error"}
EX_REQ: curl -X GET "/api/submissions/list?page=1&limit=10&status=pending_verification" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
EX_RES_200: {"data":[{"id":"g123","guarantor_name":"John Smith","relationship_to_borrower":"Business partner","address":{"street":"123 Main St","city":"New York","state":"NY","zip":"10001"},"date_of_birth":"1980-01-01","occupation":"Engineer","employer_or_business":"Tech Corp","linkedin_profile":"https://linkedin.com/in/johnsmith","company_registration_number":"","known_associations":["Tech Association"],"comments":"Reliable guarantor","attachments":[],"submission_timestamp":"2025-10-25T10:30:00Z","submitted_by":"CurrentUser","record_status":"pending_verification","last_updated":"2025-10-25T10:30:00Z"}],"total":1,"page":1,"limit":10}

---

EP: DELETE /api/submissions/:id
DESC: Delete guarantor submission by ID.
IN: params:{id:str!}, headers:{Authorization:str!}
OUT: 204:{}
ERR: {"401":"Unauthorized", "404":"Guarantor not found", "403":"Insufficient permissions", "500":"Internal server error"}
EX_REQ: curl -X DELETE /api/submissions/g123 -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
EX_RES_204: {}

---

EP: POST /api/attachments/upload
DESC: Upload file attachment for guarantor submission.
IN: headers:{Authorization:str!}, body:{file:file!, guarantorId:str}
OUT: 201:{id:str, filename:str, url:str, fileType:str, fileSize:int}
ERR: {"400":"Invalid file format", "401":"Unauthorized", "413":"File too large", "500":"Internal server error"}
EX_REQ: curl -X POST /api/attachments/upload -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." -F "file=@document.pdf" -F "guarantorId=g123"
EX_RES_201: {"id":"att456","filename":"document.pdf","url":"https://storage.example.com/files/att456/document.pdf","fileType":"application/pdf","fileSize":1024000}

---

EP: GET /api/dashboard/stats
DESC: Get dashboard statistics for guarantor submissions.
IN: headers:{Authorization:str!}
OUT: 200:{total_submissions:int, pending_verification:int, verified:int, rejected:int, recent_submissions:arr[obj]}
ERR: {"401":"Unauthorized", "500":"Internal server error"}
EX_REQ: curl -X GET /api/dashboard/stats -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
EX_RES_200: {"total_submissions":15,"pending_verification":8,"verified":5,"rejected":2,"recent_submissions":[{"id":"g123","guarantor_name":"John Smith","relationship_to_borrower":"Business partner","record_status":"pending_verification","submission_timestamp":"2025-10-25T10:30:00Z","submitted_by":"CurrentUser"}]}

## User Management Endpoints

EP: GET /users
DESC: Get paginated list of users with optional filters.
IN: headers:{Authorization:str!}, query:{name:str, role:str, sortBy:str, limit:int, page:int}
OUT: 200:{results:arr[obj], page:int, limit:int, totalPages:int, totalResults:int}
ERR: {"401":"Unauthorized", "403":"Insufficient permissions", "422":"Invalid query parameters", "500":"Internal server error"}
EX_REQ: curl -X GET "/users?page=1&limit=10&role=USER" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
EX_RES_200: {"results":[{"id":1,"email":"john@example.com","name":"John Doe","role":"USER","isEmailVerified":true,"createdAt":"2025-10-25T10:30:00Z","updatedAt":"2025-10-25T10:30:00Z"}],"page":1,"limit":10,"totalPages":1,"totalResults":1}

---

EP: POST /users
DESC: Create a new user account (Admin only).
IN: headers:{Authorization:str!}, body:{email:str!, password:str!, name:str!, role:str!}
OUT: 201:{id:int, email:str, name:str, role:str, isEmailVerified:bool, createdAt:str, updatedAt:str}
ERR: {"400":"Email already exists", "401":"Unauthorized", "403":"Insufficient permissions", "422":"Invalid input data", "500":"Internal server error"}
EX_REQ: curl -X POST /users -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." -H "Content-Type: application/json" -d '{"email":"jane@example.com","password":"password123","name":"Jane Doe","role":"USER"}'
EX_RES_201: {"id":2,"email":"jane@example.com","name":"Jane Doe","role":"USER","isEmailVerified":false,"createdAt":"2025-10-25T10:35:00Z","updatedAt":"2025-10-25T10:35:00Z"}

---

EP: GET /users/:userId
DESC: Get user details by ID.
IN: params:{userId:int!}, headers:{Authorization:str!}
OUT: 200:{id:int, email:str, name:str, role:str, isEmailVerified:bool, createdAt:str, updatedAt:str}
ERR: {"401":"Unauthorized", "403":"Insufficient permissions", "404":"User not found", "500":"Internal server error"}
EX_REQ: curl -X GET /users/1 -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
EX_RES_200: {"id":1,"email":"john@example.com","name":"John Doe","role":"USER","isEmailVerified":true,"createdAt":"2025-10-25T10:30:00Z","updatedAt":"2025-10-25T10:30:00Z"}

---

EP: PATCH /users/:userId
DESC: Update user information.
IN: params:{userId:int!}, headers:{Authorization:str!}, body:{email:str, name:str, role:str}
OUT: 200:{id:int, email:str, name:str, role:str, isEmailVerified:bool, createdAt:str, updatedAt:str}
ERR: {"400":"Email already exists", "401":"Unauthorized", "403":"Insufficient permissions", "404":"User not found", "422":"Invalid input data", "500":"Internal server error"}
EX_REQ: curl -X PATCH /users/1 -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." -H "Content-Type: application/json" -d '{"name":"John Updated"}'
EX_RES_200: {"id":1,"email":"john@example.com","name":"John Updated","role":"USER","isEmailVerified":true,"createdAt":"2025-10-25T10:30:00Z","updatedAt":"2025-10-25T10:40:00Z"}

---

EP: DELETE /users/:userId
DESC: Delete user account.
IN: params:{userId:int!}, headers:{Authorization:str!}
OUT: 204:{}
ERR: {"401":"Unauthorized", "403":"Insufficient permissions", "404":"User not found", "500":"Internal server error"}
EX_REQ: curl -X DELETE /users/1 -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
EX_RES_204: {}