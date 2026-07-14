module.exports = () => ({
  // Provider upload. In test = disco locale (default).
  // In prod: S3/R2/MinIO — installa @strapi/provider-upload-aws-s3 e configura qui.
  //
  // upload: {
  //   config: {
  //     provider: 'aws-s3',
  //     providerOptions: {
  //       s3Options: {
  //         endpoint: env('S3_ENDPOINT'),
  //         region: env('S3_REGION'),
  //         credentials: {
  //           accessKeyId: env('S3_ACCESS_KEY_ID'),
  //           secretAccessKey: env('S3_ACCESS_SECRET'),
  //         },
  //         params: { Bucket: env('S3_BUCKET') },
  //       },
  //     },
  //   },
  // },
});
