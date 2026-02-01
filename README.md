# Login Auth Roles Backend

This project is a **production-style authentication backend** that provides secure login, JWT-based authentication, and role-based authorization for a frontend Angular application.

It exposes a REST API consumed by a real frontend and follows patterns commonly used in **enterprise, banking, and fintech systems**.

The backend is deployed on **Render (free tier)** and serves as the authentication authority for the application.

---

## Overview

This backend is responsible for:

- Authenticating users via username and password
- Issuing **JWT (JSON Web Tokens)** upon successful login
- Returning user identity and role information
- Enforcing secure token-based sessions
- Supporting role-based access control (RBAC)

It is designed to work with a frontend that handles routing, guards, and UI-level authorization.

---

## Features

✔ Secure login endpoint  
✔ JWT token generation and validation  
✔ Role-based authorization (Admin / Advisor / User)  
✔ Stateless authentication  
✔ Token expiration handling  
✔ Clean and scalable architecture  
✔ Ready for enterprise extension  

---

## Authentication Flow

1. Client sends credentials to the backend  
2. Backend validates user credentials  
3. On success, backend returns:
   - JWT token
   - user id
   - username
   - role
4. Client stores the token and attaches it to future requests  
5. Backend validates the token on protected routes  
