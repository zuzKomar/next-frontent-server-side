export type User = {
  id: number | string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  token?: string;
  refreshToken?: string;
  rents?: any[];
};
