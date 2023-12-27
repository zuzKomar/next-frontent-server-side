import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { User } from '../../../types/User';
import { JWT } from 'next-auth/jwt';

async function refreshAccessToken(tokenObject) {
  try {
    // Get a new set of tokens with a refreshToken
    const tokenResponse = await fetch(`${process.env.NEST_URL}auth/refresh`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + tokenObject.refreshToken,
      },
    });

    const result = await tokenResponse.json();

    return {
      ...tokenObject,
      accessToken: result.token,
      refreshToken: result.refreshToken,
    };
  } catch (error) {
    return {
      ...tokenObject,
      error: 'RefreshAccessTokenError',
    };
  }
}

export default NextAuth({
  theme: {
    colorScheme: 'auto', // "auto" | "dark" | "light"
    brandColor: '', // Hex color code #33FF5D
    logo: '/logo.png', // Absolute URL to image
  },
  // Enable debug messages in the console if you are having problems
  debug: true,
  // session: {
  //   strategy: 'jwt',
  // },
  // jwt: {
  //   secret: 'secret',
  // },
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      id: 'email-login',
      name: 'Credentials',
      credentials: {
        email: { label: 'email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      async authorize(credentials, req) {
        const payload = {
          email: req.body.email,
          password: req.body.password,
        };
        console.log('from nextAuth authorize func...');
        console.log(credentials);

        const res = await fetch(`${process.env.NEST_URL}auth/login`, {
          method: 'POST',
          body: JSON.stringify(payload),
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const user = await res.json();

        if (!res.ok) {
          throw new Error(user.message);
        }
        // If no error and we have user data, return it
        if (res.ok && user) {
          return user;
        }
        // Return null if user data could not be retrieved
        return null;
      },
    }),
    // ...add more providers here
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      const user2: User = user;
      const token2: JWT = token;

      //user is defined during login ONLY
      // console.log('jwt callback: ')
      // console.log('token', token);
      // console.log('user', user);
      // console.log('account', account)

      if (account && user2) {
        token2.userId = user2.id;
        token2.user = user2.firstName + ' ' + user2.lastName;
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
      const tokenn = <string>token.accessToken;
      const refTokenn = <string>token.refreshToken;
      const tokenError = <string>token.error;
      const tokenUserId = <string>token.userId;
      const tokenUser = <string>token.user;

      session.user.accessToken = tokenn;
      session.user.refreshToken = refTokenn;
      session.error = tokenError;
      session.user.id = tokenUserId;
      session.user.name = tokenUser;

      const tokenPayload = JSON.parse(atob(tokenn.split('.')[1]));
      session.expires = new Date(tokenPayload.exp * 1000);
      //console.log('session after eventual improvements', session);
      return session;
    },
  },
});
