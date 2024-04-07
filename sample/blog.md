Introduction:
Yes, you read it right (and you read it right here !). There is an out-of-the-box approach to achieving a single sign-on (SSO) experience for user flows between a corporate identity provider (that authenticates and authorizes the user) and a tenant of Cloud Integration runtime (loosely called CPI worker) fully within the BTP ecosystem.

Ok, let’s zoom out a bit and break this down.

If you are reading this blog post, you probably know already that SAP BTP Services can leverage the OpenID Connect federation-based mechanics of SAP Cloud Identity Service (read SAP IAS) to connect users from corporate Identity Providers like Entra ID (formerly known as Azure AD), Okta, etc. to XSUAA BTP’s OAuth Authorization Server. This is certainly not uncharted and I did a detailed blog post a few months ago demonstrating this setup.

However, this setup applied mostly to browser-based SaaS applications (read: Design Time applications with a web frontend), and that leads us to the objective of this blog -> Customers want to put together a similar setup for their client applications that interface with SAP Cloud Integration’s IFLows (in other words, the CPI runtime). Certainly, this is not impossible to achieve and solution blueprints like these have existed in the past

My colleague Francisco’s blog puts API Management in between a client and Cloud Integration and enforces API Management to perform an OAuthSAMLBearer handshake.
Microsoft champion Martin Raepple teaches how to set up SAML Trust between Entra ID Identity Provider and BTP to set up a user impersonation flow.
However, these approaches were often seen as cumbersome to setup / troubleshoot and certainly not for the faint-hearted !

Solution Summary:
An easier solution can be described in two phrases: 'OpenID Connect' and Authorization Code grant type'. If you are super-smart then you've figured it out already. You can stop reading this blog and hack this yourself. I wish you a nice day ahead! If you are like me and need a bit more explanation, keep reading 🙂

Here is the solution blueprint that explains that handshake: