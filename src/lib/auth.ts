// auth with next-auth
import { getSession } from "next-auth/react";
import { NextApiRequest, NextApiResponse } from "next";
import { redirect } from "next/dist/server/api-utils";

import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import Github from "next-auth/providers/github";

