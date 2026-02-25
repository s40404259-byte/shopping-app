function registerProfileRoutes(router, ctx) {
  router.register('PUT', '/api/profile', ({ body }) => ({ status: 200, data: ctx.profileService.upsertProfile(body) }));
  router.register('GET', '/api/profile/:userId', ({ params }) => ({ status: 200, data: ctx.profileService.getProfile(params.userId) }));
}

module.exports = { registerProfileRoutes };
