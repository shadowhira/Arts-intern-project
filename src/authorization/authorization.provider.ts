import {
  AuthorizationContext,
  AuthorizationDecision,
  AuthorizationMetadata,
  Authorizer,
  // Provider,
} from '@loopback/authorization';

import {Provider} from '@loopback/core';

export class MyAuthorizationProvider implements Provider<Authorizer> {
  value(): Authorizer {
    return this.authorize.bind(this);
  }

  // Logic kiểm tra quyền truy cập
  async authorize(
    authorizationCtx: AuthorizationContext,
    metadata: AuthorizationMetadata,
  ): Promise<AuthorizationDecision> {
    const userRole = authorizationCtx.principals[0]?.role;

    if (!userRole) {
      return AuthorizationDecision.DENY;
    }

    // Kiểm tra nếu vai trò người dùng nằm trong các vai trò được phép
    if (metadata.allowedRoles?.includes(userRole)) {
      return AuthorizationDecision.ALLOW;
    }

    return AuthorizationDecision.DENY;
  }
}
