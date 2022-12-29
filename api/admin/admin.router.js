const { default: AdminBro } = require('admin-bro');
const { buildRouter , buildAuthenticatedRouter } = require('admin-bro-expressjs');
const express = require('express');

/**
 * @param {AdminBro} admin
 * @return {express.Router} router
 */
const buildAdminRouter = (admin) => {
    const ADMIN = {
        email : process.env.ADMIN_EMAIL || 'abgurene@gmail.com' ,
        password : process.env.ADMIN_PASSWORD || 'amircentre'  ,
    }
  const router = buildAuthenticatedRouter(admin, {
    cookieName: process.env.ADMIN_COOKIE_NAME || 'admin-bro' ,
    coockiePassword: process.env.ADMIN_COOKIE_PASSWORD || 'done-un-tres-tres-logn-mot-de-masww'  ,
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