function registerProfileRoutes(router, ctx) {
  router.register('PUT', '/api/profile', ({ body }) => ({ status: 200, data: ctx.profileService.upsertProfile(body) }));
  router.register('GET', '/api/profile/:userId', ({ params }) => ({ status: 200, data: ctx.profileService.getProfile(params.userId) }));
  router.register('POST', '/api/profile/:userId/addresses', ({ params, body }) => ({
    status: 201,
    data: ctx.profileService.addAddress({ userId: params.userId, ...body }),
  }));
  router.register('GET', '/api/profile/:userId/addresses', ({ params }) => ({
    status: 200,
    data: ctx.profileService.getAddresses(params.userId),
  }));
}

module.exports = { registerProfileRoutes };
