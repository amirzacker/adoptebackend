const { default: AdminBro } = require('admin-bro');
const { buildRouter , buildAuthenticatedRouter } = require('admin-bro-expressjs');
const express = require('express');
const config = require('../../config');

/**
 * @param {AdminBro} admin
 * @return {express.Router} router
 */
const buildAdminRouter = (admin) => {
    const ADMIN = {
        email : config.ADMIN_EMAIL || 'abgurene@gmail.com' ,
        password : config.ADMIN_PASSWORD || 'amircentre'  ,
    }
  const router = buildAuthenticatedRouter(admin, {
    cookieName: config.ADMIN_COOKIE_NAME || 'admin-bro' ,
    coockiePassword: config.ADMIN_COOKIE_PASSWORD || 'done-un-tres-tres-logn-mot-de-masww'  ,
    authenticate: async (email, password) => {
        if (email === ADMIN.email && password === ADMIN.password) {
            return ADMIN
        }
        return null
    }
  });
  return router;
};

module.exports = buildAdminRouter;