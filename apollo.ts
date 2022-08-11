import { ApolloClient, createHttpLink, gql, InMemoryCache, makeVar } from '@apollo/client'
import { setContext } from '@apollo/client/link/context';
import { LOCALSTORAGE_ROLE_MODE, LOCALSTORAGE_TOKEN } from './utils/constants';

const token = typeof window !== 'undefined' ? localStorage.getItem(LOCALSTORAGE_TOKEN) : null
const roleMode = typeof window !== 'undefined' && typeof localStorage !== 'undefined' ? localStorage.getItem(LOCALSTORAGE_ROLE_MODE) : null

export const isLoggedInVar = makeVar(Boolean(token));
export const authToken = makeVar(token);
export const roleModeVar = makeVar(roleMode)

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql'
})

const authLink = setContext((_, { headers }) => ({
  headers: {
    ...headers,
    "x-jwt": authToken() || ''
  }
}))

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  ssrMode: typeof window === 'undefined',
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          isLoggedIn: {
            read() {
              return isLoggedInVar();
            }
          },
          token: {
            read() {
              return authToken();
            }
          },
          roleMode: {
            read() {
              return roleModeVar()
              // return typeof window !== 'undefined' && typeof localStorage !== 'undefined' ? localStorage.getItem(LOCALSTORAGE_ROLE_MODE) : null;
            }
          }
        }
      }
    }
  }),
});