import 'dotenv/config'

export const dev = {
  app: {
    port: Number(process.env.PORT),
    defaultUserImagePath: process.env.DEFAULT_USER_IMAGE_PATH,
    defaultProductImagePath: process.env.DEFAULT_PRODUCT_IMAGE_PATH,
    jwtUserActivationKey: process.env.JWT_ACCOUNT_ACTIVATION_KEY,
    stmpUsername: process.env.STMP_USERNAME,
    stmpPassword: process.env.STMP_PASSWORD,
    jwtAccessKey: process.env.JWT_ACCESS_KEY,
  },
  db: {
    url: process.env.MONGODB_URL,
  },
}
