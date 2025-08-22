import React, { lazy } from "react";
import { Navigate } from "react-router-dom";
import AppLayout from './../componnets/Applayout';
import AuthGuard from "../componnets/Auth/AuthGuard";
import GuestGuard from "../componnets/Auth/GuestGuard";
import ForgotPassword from "../pages/authPages/ForgotPassword";
import VerifyOtp from "../pages/authPages/VerifyOtp";
import ResetPassword from "../pages/authPages/ResetPassword";
import LoginPage from "../pages/authPages/Login";
import NotFound from "../pages/authPages/NotFondPage";

const DocumentRepository = lazy(() => import('./../pages/incidents/DocumentRepository'));
const RecentDocs = lazy(() => import('./../pages/RecentDocs'));
const StarredDocs = lazy(() => import('./../pages/StarredDocs'));
const DeletedDocs = lazy(() => import('./../pages/DeletedDocs'));

export const privateRoutes = [
  {
    path: "/",
    element: (
      <AuthGuard>
        <AppLayout />
      </AuthGuard>
    ),
    children: [
      { index: true, element: <Navigate to="/home" replace /> },
      { path: "home", element: <DocumentRepository /> },  
     { path: "recent", element: <RecentDocs /> },  
     { path: "starred", element: <StarredDocs /> },  
    { path: "deleted", element: <DeletedDocs /> },  ],
  },
];

export const publicRoutes = [
  {
    path: "/login",
    element: (
      <GuestGuard>
        <LoginPage />
      </GuestGuard>
    ),
  },
  { path: "/resetPassword", element: <GuestGuard><ResetPassword /></GuestGuard> },
  { path: "/forgotPassword", element: <GuestGuard><ForgotPassword /></GuestGuard> },
  { path: "/verify-otp", element: <GuestGuard><VerifyOtp /></GuestGuard> },
];


export const appRoutes = [
  ...privateRoutes,
  ...publicRoutes,
  { path: "*", element: <NotFound /> }, 
];

