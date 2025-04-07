// Defines the basic structure we expect in the JWT payload from Auth0
export interface JwtPayload {
  iss: string; // Issuer (Auth0 domain)
  sub: string; // Subject (Auth0 user ID)
  aud: string[] | string; // Audience (Your API identifier)
  iat: number; // Issued at (timestamp)
  exp: number; // Expiration time (timestamp)
  azp?: string; // Authorized party (Client ID)
  scope?: string; // Scopes granted
  // Add other custom claims you might have configured in Auth0 Rules/Actions
  // e.g., email?: string;
  // e.g., permissions?: string[];
}