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
    // async signIn(user) {
    //   console.log('dupa signIn');
    //   const isAllowedToSignIn = true;
    //   if (isAllowedToSignIn) {
    //     return true;
    //   } else {
    //     // Return false to display a default error message
    //     return false;
    //     // Or you can return a URL to redirect to:
    //     // return '/unauthorized'
    //   }
    // },
    async jwt({ token, user, account }) {
      const user2: any = user;
      const token2: JWT = token;

      //user is defined during login ONLY
      console.log('jwt callback: ');
      console.log('token', token);
      console.log('user', user);
      console.log('account', account);

      if (account && user2) {
        token2.user = user2;
        token2.accessToken = user2.token;
        token2.accessTokenExpiry = token.exp;
        token2.refreshToken = user2.refreshToken;
      }
      //Math.round((1676926364 - 900000)-Date.now())
      //const shouldRefreshTime = Math.round((token.accessTokenExpiry - 900000) - Date.now());
      //const shouldRefreshTime = Date.now()-60000 >= (token.accessTokenExpiry * 1000)
      const accessTokenk = <string>token2.accessToken;
      const tokenPayload = JSON.parse(atob(accessTokenk));
      //console.log('data w jwt callbacku', new Date(tokenPayload.exp * 1000));
      const shouldRefreshToken = Date.now() > tokenPayload.exp * 1000;
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
      console.log(session);
      const tokenUser = token.user;
      const tokenError = token.error;
      const tokenExpires = token.expires;

      session.user = tokenUser;
      session.error = tokenError;
      session.expires = tokenExpires;

      const tokenPayload = JSON.parse(atob(tokenUser.token.split('.')[1]));
      session.expires = new Date(tokenPayload.exp * 1000);
      //console.log('session after eventual improvements', session);
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export default NextAuth(authOptions);

export { handler as GET, handler as POST };
