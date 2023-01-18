import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'


async function refreshAccessToken(token) {
    try {
      const url =
        'http://localhost:3000/auth/refresh';
  
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'GET'
      })
  
      const refreshedTokens = await response.json()
  
      if (!response.ok) {
        throw refreshedTokens
      }
  
      return {
        ...token,
        accessToken: refreshedTokens.access_token,
        accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
        refreshToken: refreshedTokens.refresh_token ?? token.refreshToken // Fall back to old refresh token
      }
    } catch (error) {
      console.log(error)
  
      return {
        ...token,
        error: 'RefreshAccessTokenError'
      }
    }
  }

const options = {
    providers: [
        CredentialsProvider({
        name: 'my-proj',
        credentials: {
            email: { label: 'Email', type: 'email' },
            password: { label: 'Password', type: 'password' }
          },
        async authorize(credentials, req){
          console.log('authorize execution', arguments)
          const payload = {
            email: credentials.email,
            password: credentials.password
          }
          console.log('authorize execution', payload)
          const res = await fetch(`${process.env.NEXTAUTH_URL}/auth/login`, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json',
            },
            mode: 'cors'
          });
          const user = await res.json();
          if(!(res).ok){
            throw new Error(user.message);
          }

          if (res.ok && user) {
            console.log(user);
            return user;
          }
  
          // Return null if user data could not be retrieved
          return null;
        }
      })
    ],
    secret: 'secret',
    pages: {
      signIn: '/auth/signin',
    },
    callbacks: {
        async jwt(token, user, account) {
          if (account && user) {
              return {
                ...token,
                accessToken: user.accessToken,
                refreshToken: user.refreshToken,
              };
          }

          return token;
        },
      
        async session(session, token) {
          session.user.accessToken = token.accessToken;
          session.user.refreshToken = token.refreshToken;
          session.user.accessTokenExpires = token.accessTokenExpires;

          return session
        }
      }
};

export default (req, res) => NextAuth(req, res, options);