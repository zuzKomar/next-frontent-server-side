import CredentialsProvider from 'next-auth/providers/credentials';
import NextAuth, { NextAuthOptions } from 'next-auth';
import { JWT } from 'next-auth/jwt';

async function refreshAccessToken(tokenObject) {
  try {
    // Get a new set of tokens with a refreshToken
    const tokenResponse = await fetch(`${process.env.NEST_URL}/auth/refresh`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        mode: 'cors',
        credentials: 'include',
        Authorization: 'Bearer ' + tokenObject.refreshToken,
      },
    });

    const result = await tokenResponse.json();

    return {
      ...tokenObject,
      token: result.token,
      refreshToken: result.refreshToken,
    };
  } catch (error) {
    return {
      ...tokenObject,
      error: 'RefreshAccessTokenError',
    };
  }
}

export const authOptions: NextAuthOptions = {
  // Enable debug messages in the console if you are having problems
  debug: true,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials.email || !credentials.password) return null;
        const { email, password } = credentials;
        const res = await fetch(`${process.env.NEST_URL}/auth/login`, {
          method: 'POST',
          body: JSON.stringify({ email, password }),
          mode: 'cors',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (res.status === 401) {
          return null;
        }

        const userText = await res.text();
        const user = JSON.parse(userText);
        return {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          token: user.token,
          refreshToken: user.refreshToken,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      const userTmp: any = {
        ...user,
      };

      if (account) {
        token.user = userTmp;
        const tokenPayload = JSON.parse(
          Buffer.from(userTmp.token.split('.')[1], 'base64').toString(),
        );
        token.accessToken = userTmp.token;
        token.accessTokenExpiry = tokenPayload.exp;
        token.refreshToken = userTmp.refreshToken;
      }
      console.log('token', token);
      const shouldRefreshToken = Date.now() > parseInt(<string>token.accessTokenExpiry) * 1000;
      if (shouldRefreshToken) {
        //console.log('call po nowy accessToken');
        token = await refreshAccessToken(token);
        //console.log('refreshAccessToken execution result: ', token);
        return token;
      } else {
        //console.log('accessToken aktualny');
        return Promise.resolve(token);
      }
    },
    async session({ session, token }) {
      console.log('session', session);

      session.user = token.user;
      session.error = token.error;
      session.expires = token.expires;

      const tokenPayload = JSON.parse(atob(token.user.token.split('.')[1]));
      session.expires = new Date(tokenPayload.exp * 1000);
      console.log('session after eventual improvements', session);
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export default NextAuth(authOptions);

export { handler as GET, handler as POST };
